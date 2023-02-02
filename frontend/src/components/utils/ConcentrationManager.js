/**
 * Manages concentrations of a model and
 * notifies any listeners on concentration change
 * @class
 * @classdesc Managing model concentrations for
 * real time web app.
 * 
 * @author zburnaby
 */
class ConcentrationManager {
    /**
     * @constructor
     */
    constructor() {
        this.moleculeConcentrations = []; // [{ID: {"title": string, "value": float}}]
        this.moleculeDeltas = []; // [{ID: {"title": string, "forwardValue": float, "reverseValue": float}}]
        this.startMolecules = []; // used for tracking start and end molecules
        this.endMolecules = [];
        this.enzymes = [];
        this.listeners = [];
        this.interval = null;
    }

    /**
     * Initializes the molecule_concentrations list given some enzymes
     * @function
     * @param {Object[]} enzymes list of enzymes
     * @param enzymes[].substrates list of input moleules to the enzyme
     * @param enzymes[].products list of output molecules to the enzyme
     * @param enzymes[].cofactors list of molecules effecting the enzyme's production
     */
    parseEnzymes(enzymes) {
        this.moleculeConcentrations = [];
        // when commented out, the flow will eventually run to empty
        // for (const substrate of enzymes[0].substrates) {
        //     if (!this.startMolecules.includes(substrate.id) ) {
        //         this.startMolecules.push(substrate.id);
        //     }
        // }
        for (const product of enzymes[enzymes.length - 1].products) {
            if (!this.endMolecules.includes(product.id) ) {
                this.endMolecules.push(product.id);
            }
        }
        for (const enzyme of enzymes) {
            for (const substrate of enzyme.substrates) {
                this.moleculeConcentrations[substrate.id] = {"title": substrate.title, "value": 1};
                this.moleculeDeltas[substrate.id] = {"title": substrate.title, "forwardValue": 1, "reverseValue": null};
            }
            for (const product of enzyme.products) {
                this.moleculeConcentrations[product.id] = {"title": product.title, "value": 1};
                this.moleculeDeltas[product.id] = {"title": product.title, "forwardValue": 1, "reverseValue": null};
            }
            for (const cofactor of enzyme.cofactors) {
                this.moleculeConcentrations[cofactor.id] = {"title": cofactor.title, "value": 1};
            }
        }
        this.enzymes = enzymes;
        this.notifyListeners();
    }

    /**
     * Updates the concentrations of each molecule
     * @function
     */
    updateConcentrations() {
        let cachedConcentrations = this.moleculeConcentrations;
        for (const id of this.startMolecules) {
            this.moleculeConcentrations[id].value += .1;
        }
        for (const id of this.endMolecules) {
            this.moleculeConcentrations[id].value -= .1;
        }
        for (const enzyme of this.enzymes) {
            let minSubstrateConc = null;
            let minProductConc = null;
            for (const substrate of enzyme.substrates) {
                if (!minSubstrateConc) {
                    minSubstrateConc = cachedConcentrations[substrate.id].value;
                }
                if (cachedConcentrations[substrate] < minSubstrateConc) {
                    minSubstrateConc = cachedConcentrations[substrate.id].value;
                }
            }
            for (const product of enzyme.products) { // new
                if (!minProductConc) {
                    minProductConc = cachedConcentrations[product.id].value;
                }
                if (cachedConcentrations[product] < minSubstrateConc) {
                    minProductConc = cachedConcentrations[product.id].value;
                }
            }
            for (const substrate of enzyme.substrates) {
                if (minSubstrateConc) {
                    this.moleculeConcentrations[substrate.id].value -= minSubstrateConc * (0.1 * (minSubstrateConc/minProductConc));
                }
            }
            for (const product of enzyme.products) {
                if (minSubstrateConc) {
                    this.moleculeConcentrations[product.id].value += minSubstrateConc * (0.1 * (minSubstrateConc/minProductConc));
                }
            }
            if (enzyme.reversible) {
                for (const substrate of enzyme.substrates) {
                    if (minSubstrateConc) {
                        this.moleculeConcentrations[substrate.id].value += minSubstrateConc * (0.1 * (minProductConc/minSubstrateConc));
                    }
                }
                for (const product of enzyme.products) {
                    if (minSubstrateConc) {
                        this.moleculeConcentrations[product.id].value -= minSubstrateConc * (0.1 * (minProductConc/minSubstrateConc));
                    }
                } 
            }
        }
        console.log("UpdateConcentrations()");
        this.notifyListeners();
    }

    calculateChangeDelta() {
        let cachedConcentrations = this.moleculeConcentrations;
        for (const enzyme of this.enzymes) {
            let minSubstrateConc = null;
            let minProductConc = null;
            for (const substrate of enzyme.substrates) {
                if (!minSubstrateConc) {
                    minSubstrateConc = cachedConcentrations[substrate.id].value;
                }
                if (cachedConcentrations[substrate] < minSubstrateConc) {
                    minSubstrateConc = cachedConcentrations[substrate.id].value;
                }
            }
            for (const product of enzyme.products) {
                if (!minProductConc) {
                    minProductConc = cachedConcentrations[product.id].value;
                }
                if (cachedConcentrations[product] < minProductConc) {
                    minProductConc = cachedConcentrations[product.id].value;
                }
            }
            let forwardChange = minSubstrateConc / minProductConc;
            let reverseChange = 0;
            for (const substrate of enzyme.substrates) {
                if (forwardChange) {
                    this.moleculeDeltas[substrate.id].forwardValue = forwardChange;
                }
            }
            for (const product of enzyme.products) {
                if (minSubstrateConc) {
                    this.moleculeDeltas[product.id].forwardValue = forwardChange;
                }
            }
            if (enzyme.reversible) {
                reverseChange = minProductConc / minSubstrateConc;
                for (const substrate of enzyme.substrates) {
                    if (forwardChange) {
                        this.moleculeDeltas[substrate.id].reverseValue = reverseChange;
                    }
                }
                for (const product of enzyme.products) {
                    if (minSubstrateConc) {
                        this.moleculeDeltas[product.id].reverseValue = reverseChange;
                    }
                }
            }
        }
        this.notifyListeners();
    }

    /**
     * Passes current molecule concentrations to all listening functions
     * @function
     */
    notifyListeners() {
        for (const listener of this.listeners) {
            listener(this.moleculeConcentrations);
        }
    }

    /**
     * @callback onUpdateConcentration
     * @param {Object[]} moleculeConcentrations
     */

    /**
     * Add listener function from listener queue
     * @function
     * @param {onUpdateConcentration} listener
     */
    addListener(listener) {
        this.listeners.push(listener);
    }

    /**
     * Remove listener function from listener queue
     * @function
     * @param {onUpdateConcentration} listener
     */
    removeListener(listener) {
        for (let i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i] === listener) {
                this.listeners.splice(i, 1);
            }
        }
    }

    /**
     * Manually set the concentration of a molecule
     * @param {int} id
     * @param {int} value
     */
    setConcentration(id, value) {
        if (this.moleculeConcentrations) {
            this.moleculeConcentrations[id].value = parseFloat(value);
            this.notifyListeners();
        } else {
            console.log("No Concentrations");
        }
    }

    getMolculeConcentrations() {
        return this.moleculeConcentrations;
    }
}

export default ConcentrationManager;