PATHWAY_DATA = {
    "name": "pathway",
    "author": -1,
    "public": True,
    "molecule_instances": [
        {
            "temp_id": 1,
            "molecule": -1,
            "x": 0,
            "y": 0
        },
        {
            "temp_id": 2,
            "molecule": -1,
            "x": 0,
            "y": 0
        }
    ],
    "enzyme_instances": [
        {
            "enzyme": -1,
            "x": 0,
            "y": 0,
            "limiting": "False",
            "substrate_instances": [1],
            "product_instances": [2],
            "cofactor_instances": []
        }
    ]
}

MOLECULE_DATA = {
    "name": "molecule",
    "abbreviation": "m",
    "ball_and_stick_image": "img1",
    "space_filling_image": "img2",
    "link": "",
    "author": -1,
    "public": True
}

ENZYME_DATA = {
    "name": "enzyme",
    "abbreviation": "e",
    "reversible": True,
    "image": "img1",
    "link": "",
    "public": True,
    "author": -1,
    "substrates": [],
    "products": [],
    "cofactors": []
}