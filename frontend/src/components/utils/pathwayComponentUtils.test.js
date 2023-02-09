import { parseEnzymesForManager } from "./pathwayComponentUtils";

describe('pathwayComponentUtils', () => {
    test('parseEnzymesForManager', () => {
        let data = {
            "enzyme_instances":[{
                "id":24,
                "name":"enzyme1",
                "abbreviation":"e1",
                "reversible":true,
                "substrate_instances":[56],
                "product_instances":[57],
                "cofactor_instances":[58]
            }], 
            "molecule_instances":[{
                "id":56,
                "abbreviation":"m1"
            },{
                "id":57,
                "abbreviation":"m2"
            },{
                "id":58,
                "abbreviation":"m3",
            }]
        }
        let enzymes = parseEnzymesForManager(data);
        expect(Object.entries(enzymes).length).toEqual(1);
        for (const [id, enzyme] of Object.entries(enzymes)) {
            expect(enzyme["substrates"]).toContainEqual({"id": 56, "title": "m1"});
            expect(enzyme["products"]).toContainEqual({"id": 57, "title": "m2"});
            expect(enzyme["cofactors"]).toContainEqual({"id": 58, "title": "m3"});
        }
    });
});