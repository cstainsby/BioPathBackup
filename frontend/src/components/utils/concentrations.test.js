import Concentrations from "./concentrations";

describe('concentrations', () => {
    test('init', () => {
        let enzymes = [
            {
                substrates: ["G"],
                products: ["G6"],
                cofactors: ["Na"]
            }
        ]
        let c = new Concentrations(enzymes);
        expect(c.molecule_concentrations["G"]).toBe(100);
        expect(c.molecule_concentrations["G6"]).toBe(100);
        expect(c.molecule_concentrations["Na"]).toBe(100);
    });
    
    test('update', () => {
        let enzymes = [
            {
                substrates: ["G"],
                products: ["G6"],
                cofactors: ["Na"]
            }
        ]
        let c = new Concentrations(enzymes);
        c.updateConcentrations();
        expect(c.molecule_concentrations["G"]).toBe(90);
        expect(c.molecule_concentrations["G6"]).toBe(110);
    });
    
    test('addListener', () => {
        let enzymes = [
            {
                substrates: ["G"],
                products: ["G6"],
                cofactors: ["Na"]
            }
        ]
        let c = new Concentrations(enzymes);
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
        let c = new Concentrations(enzymes);
        let listener_a = jest.fn();
        c.addListener(listener_a);
        c.updateConcentrations();
        c.removeListener(listener_a);
        c.updateConcentrations;
        expect(listener_a).toHaveBeenCalledTimes(1);     
    });
});
