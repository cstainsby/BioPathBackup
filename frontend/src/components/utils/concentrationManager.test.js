import ConcentrationManager from "./ConcentrationManager";

describe('concentrations', () => {
    test('init', () => {
        let enzymes = [
            {
                substrates: ["G"],
                products: ["G6"],
                cofactors: ["Na"]
            }
        ]
        let c = new ConcentrationManager(enzymes);
        expect(c.moleculeConcentrations["G"]).toBe(100);
        expect(c.moleculeConcentrations["G6"]).toBe(100);
        expect(c.moleculeConcentrations["Na"]).toBe(100);
    });
    
    test('update', () => {
        let enzymes = [
            {
                substrates: ["G"],
                products: ["G6"],
                cofactors: ["Na"]
            }
        ]
        let c = new ConcentrationManager(enzymes);
        c.updateConcentrations();
        expect(c.moleculeConcentrations["G"]).toBe(90);
        expect(c.moleculeConcentrations["G6"]).toBe(110);
    });
    
    test('addListener', () => {
        let enzymes = [
            {
                substrates: ["G"],
                products: ["G6"],
                cofactors: ["Na"]
            }
        ]
        let c = new ConcentrationManager(enzymes);
        let listener = jest.fn();
        c.addListener(listener);
        c.updateConcentrations();
        expect(listener).toHaveBeenCalled();
    });

    test('removeListener', () => {
        let enzymes = [
            {
                substrates: ["G"],
                products: ["G6"],
                cofactors: ["Na"]
            }
        ]
        let c = new ConcentrationManager(enzymes);
        let listener_a = jest.fn();
        c.addListener(listener_a);
        c.updateConcentrations();
        c.removeListener(listener_a);
        c.updateConcentrations;
        expect(listener_a).toHaveBeenCalledTimes(1);     
    });

    test('setConcentration', () => {
        let enzymes = [
            {
                substrates: ["G"],
                products: ["G6"],
                cofactors: ["Na"]
            }
        ]
        let c = new ConcentrationManager(enzymes);
        let listener_a = jest.fn();
        c.addListener(listener_a);
        c.setConcentration("G", 20);
        expect(c.moleculeConcentrations["G"]).toBe(20);
        expect(listener_a).toHaveBeenCalledTimes(1);
    });
});
