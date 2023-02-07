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
     * @param {Object[]} enzymes enzymes indexed by enzyme.id
     * @param enzymes[].reversible 
     * @param enzymes[].substrates input moleules to the enzyme
     * @param enzymes[].products output molecules to the enzyme
     * @param enzymes[].cofactors molecules effecting the enzyme's production
     */
    parseEnzymes(enzymes) {
        this.moleculeConcentrations = [];
        for (const [id, enzyme] of Object.entries(enzymes)) {
            for (const substrate of enzyme.substrates) {
                this.moleculeConcentrations[substrate.id] = {"title": substrate.title, "value": 1};
            }
            for (const product of enzyme.products) {
                this.moleculeConcentrations[product.id] = {"title": product.title, "value": 1};
            }
            for (const cofactor of enzyme.cofactors) {
                this.moleculeConcentrations[cofactor.id] = {"title": cofactor.title, "value": 1};
            }
            // TODO: Get, store, and update enzyme speeds. Link to a slider on the frontend?
            enzyme.speed = 0.05;
            enzyme.subToProd = 0;
            enzyme.prodToSub = 0;
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
        for (const [id, enzyme] of Object.entries(this.enzymes)) {
            // Amount of substrate turned into product
            let subToProd = this.calculateEnzymeSubstrateToProduct(enzyme, cachedConcentrations);
            // Amount of product turned into substrate
            let prodToSub = 0;
            if (enzyme.reversible) {
                prodToSub = this.calculateEnzymeProductToSubstrate(enzyme, cachedConcentrations);
            }
            this.enzymes[id].subToProd = subToProd;
            this.enzymes[id].prodToSub = prodToSub;
            for (const substrate of enzyme.substrates) {
                this.moleculeConcentrations[substrate.id].value += prodToSub - subToProd;
            }
            for (const product of enzyme.products) {
                this.moleculeConcentrations[product.id].value += subToProd - prodToSub;
            }            
        }
        console.log("UpdateConcentrations()");
        this.notifyListeners();
    }

    /**
     * Calculate amount of substrate to convert to product
     * @param {Object} enzyme 
     */
    calculateEnzymeSubstrateToProduct(enzyme, cachedConcentrations) {
        return this.calculateMinConcentration(enzyme.substrates, cachedConcentrations) * this.getCofactorScalar(enzyme, cachedConcentrations) * enzyme.speed;
    }

    /**
     * Calculate amount of product to convert to substrate
     * @param {Object} enzyme 
     */
    calculateEnzymeProductToSubstrate(enzyme, cachedConcentrations) {
        return this.calculateMinConcentration(enzyme.products, cachedConcentrations) * this.getCofactorScalar(enzyme, cachedConcentrations) * enzyme.speed;
    }

    calculateMinConcentration(molecules, cachedConcentrations) {
        if (molecules.length === 0) {
            return 0;
        }
        // Calculate the least of the substrates
        let minConc = null;
        for (const molecule of molecules) {
            if (!minConc) {
                minConc = cachedConcentrations[molecule.id].value;
            }
            if (cachedConcentrations[molecule.id] < minConc) {
                minConc = cachedConcentrations[molecule.id].value;
            }
        }
        return minConc;
    }

    getCofactorScalar(enzyme, cachedConcentrations) {
        return 1;
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