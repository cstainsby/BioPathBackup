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
        for (const enzyme of enzymes) {
            for (const substrate of enzyme.substrates) {
                this.moleculeConcentrations[substrate.id] = {"title": substrate.title, "value": 1};
            }
            for (const product of enzyme.products) {
                this.moleculeConcentrations[product.id] = {"title": product.title, "value": 1};
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
        for (const enzyme of this.enzymes) {
            let minSubstrateConc = null;
            for (const substrate of enzyme.substrates) {
                if (!minSubstrateConc) {
                    minSubstrateConc = cachedConcentrations[substrate.id].value;
                }
                if (cachedConcentrations[substrate] < minSubstrateConc) {
                    minSubstrateConc = cachedConcentrations[substrate.id].value;
                }
            }
            for (const substrate of enzyme.substrates) {
                if (minSubstrateConc) {
                    this.moleculeConcentrations[substrate.id].value -= minSubstrateConc * 0.1;
                }
            }
            for (const product of enzyme.products) {
                if (minSubstrateConc) {
                    this.moleculeConcentrations[product.id].value += minSubstrateConc * 0.1;
                }
            }
        }
        console.log("UpdateConcentrations()");
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
        console.log(id, this.moleculeConcentrations, this.moleculeConcentrations[235], "setConcentration")
        if (this.moleculeConcentrations) {
            for (const molecule of this.moleculeConcentrations) {
                console.log(molecule, "molecule")
                if (molecule["title"] === id) {
                    console.log("yes")
                }
            }
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