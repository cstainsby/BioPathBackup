import {generatePathwayJson, exportedForTesting} from "./pathwayBuilderUtils"
const { generateEnzymeInstances, generateMoleculeInstances, filterMolecules, filterEnzymes } = exportedForTesting;


const nodesEmpty = [];
const edgesEmpty = [];

const nodesFilled = [
    {"id":"35_enzyme","className":"enzyme build build","data":{"abbreviation":"e1","label":"enzyme1","type":"enzyme","reversible":true,"substrates":[1],"products":[2],"cofactors":[3],"enzyme_id":1,"image":null},"type":"enzyme","position":{"x":449,"y":312},"width":250,"height":100},
    {"id":"107_molecule","className":"molecule build build","data":{"label":"m2","type":"molecule","molecule_name":"molecule2","molecule_id":2},"type":"molecule","position":{"x":528,"y":524},"width":60,"height":40},
    {"id":"108_molecule","className":"molecule build build","data":{"label":"m3","type":"molecule","molecule_name":"molecule3","molecule_id":3},"type":"molecule","position":{"x":715,"y":524},"width":60,"height":40},
    {"id":"109_molecule","className":"molecule build build","data":{"label":"m1","type":"molecule","molecule_name":"molecule1","molecule_id":1},"type":"molecule","position":{"x":551,"y":168},"width":60,"height":40}
]

const edgesFilled = [
    {"id":"109_35","data":{"title":"109 to 35","enzyme_id":"35"},"animated":true,"source":"109_molecule","sourceHandle":"bottom-source","targetHandle":"top-target-0","target":"35_enzyme","style":{"strokeWidth":3,"stroke":"#00FF00"}},
    {"id":"35_107","data":{"title":"107 to 35","enzyme_id":"35"},"animated":true,"source":"35_enzyme","target":"107_molecule","sourceHandle":"bottom-source-0","targetHandle":"top-target","style":{"strokeWidth":3,"stroke":"#00FF00"}}
]

describe('pathwayBuilder', () => {
    test('generatePathwayJson', () => {
        expect(generatePathwayJson(nodesFilled, edgesFilled, "test-filled")).toStrictEqual({"name":"test-filled","author":1,"public":false,"enzyme_instances":[{"enzyme":1,"x":449,"y":312,"limiting":false,"substrate_instances":[109],"product_instances":[107],"cofactor_instances":[108]}],"molecule_instances":[{"temp_id":107,"molecule":2,"x":528,"y":524},{"temp_id":108,"molecule":3,"x":715,"y":524},{"temp_id":109,"molecule":1,"x":551,"y":168}]})
        expect(generatePathwayJson(nodesEmpty, edgesEmpty, "test-empty")).toStrictEqual({
            "author": 1,
            "enzyme_instances": [],
            "molecule_instances": [],
            "name": "test-empty",
            "public": false
        })
    });
    
    test('generateMoleculeInstances', () => {
        let molecules = nodesFilled.filter(filterMolecules);
        expect(generateMoleculeInstances(molecules)).toStrictEqual([{"temp_id":107,"molecule":2,"x":528,"y":524},{"temp_id":108,"molecule":3,"x":715,"y":524},{"temp_id":109,"molecule":1,"x":551,"y":168}])

        molecules = nodesEmpty.filter(filterMolecules);
        expect(generateMoleculeInstances(molecules)).toStrictEqual([])
    });
    
    test('generateEnzymeInstances', () => {
        let enzymes = nodesFilled.filter(filterEnzymes);
        let molecules = nodesFilled.filter(filterMolecules);
        expect(generateEnzymeInstances(enzymes, molecules, edgesFilled)).toStrictEqual([{"enzyme":1,"x":449,"y":312,"limiting":false,"substrate_instances":[109],"product_instances":[107],"cofactor_instances":[108]}])

        enzymes = nodesEmpty.filter(filterEnzymes);
        molecules = nodesEmpty.filter(filterMolecules);
        expect(generateEnzymeInstances(enzymes, molecules, edgesEmpty)).toStrictEqual([])
    });

    test('filterEnzymes', () => { 
        expect(filterEnzymes(nodesFilled[0])).toBe(true)
        expect(filterEnzymes(nodesFilled[1])).toBe(false)
    });

    test('filterMolecules', () => {
        expect(filterMolecules(nodesFilled[1])).toBe(true)
        expect(filterMolecules(nodesFilled[0])).toBe(false)
    });

    test('filterEmpty', () => {
        expect(filterMolecules()).toBe(false)
        expect(filterEnzymes()).toBe(false)
    });
});