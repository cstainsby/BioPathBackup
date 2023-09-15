import ConcentrationManager from "./ConcentrationManager";

const pathway = {
    "id": 3,
    "enzyme_instances": [
        {
            "id": 1,
            "name": "enzyme1",
            "abbreviation": "e1",
            "reversible": false,
            "enzyme": 1,
            "substrate_instances": [
                4
            ],
            "product_instances": [
                5
            ],
            "cofactor_instances": [
                6
            ]
        }
    ],
    "molecule_instances": [
        {
            "id": 4,
            "molecule_name": "molecule1",
            "abbreviation": "m1",
            "molecule": 1
        },
        {
            "id": 5,
            "molecule_name": "molecule2",
            "abbreviation": "m2",
            "molecule": 2
        },
        {
            "id": 6,
            "molecule_name": "molecule3",
            "abbreviation": "m3",
            "molecule": 3
        }
    ]
}

describe('concentrations', () => {
    test('init', () => {
        let c = new ConcentrationManager();
        c.parsePathway(pathway);
        expect(c.moleculeConcentrations[1].value).toBe(1);
        expect(c.moleculeConcentrations[2].value).toBe(1);
        expect(c.moleculeConcentrations[3].value).toBe(1);
    });
    
    test('update', () => {
        let c = new ConcentrationManager();
        c.parsePathway(pathway);
        c.updateConcentrations();
        expect(c.moleculeConcentrations[1].value).toBeLessThan(1);
        expect(c.moleculeConcentrations[2].value).toBeGreaterThan(1);
    });
    
    test('addListener', () => {
        let c = new ConcentrationManager();
        c.parsePathway(pathway);
        let listener = jest.fn();
        c.addListener(listener);
        c.updateConcentrations();
        expect(listener).toHaveBeenCalled();
    });

    test('removeListener', () => {
        let c = new ConcentrationManager();
        c.parsePathway(pathway);
        let listener_a = jest.fn();
        c.addListener(listener_a);
        c.updateConcentrations();
        c.removeListener(listener_a);
        c.updateConcentrations;
        expect(listener_a).toHaveBeenCalledTimes(1);     
    });

    test('setConcentration', () => {
        let c = new ConcentrationManager();
        c.parsePathway(pathway);
        let listener_a = jest.fn();
        c.addListener(listener_a);
        c.setConcentration(1, 0.2);
        expect(c.moleculeConcentrations[1].value).toBe(0.2);
        expect(listener_a).toHaveBeenCalledTimes(1);
    });
});
