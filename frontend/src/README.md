### ReadME for frontend react structure

## Introduction
This readme is to help understanding for how the react app is organized, how we utilize the reactflow library, and how the files in frontend/src interact with each other.

# ReactFlow
Understanding reactflow is essential to the biopath project. It is very helpful to look at some of the example flows they have included in their documentation. In the Biopath project, reactflow is utilized in the flowModel and flowBuilder views.

ReactFlow Documentation
[Link text](https://reactflow.dev/)

## Important ReactFlow Concepts
- Custom Node
- UpdateNode
- Custom Edges
- Updatable Edge
- Drag and Drop (used in flowBuilder)

# How we use reactflow
Reactflow is a library focused on nodes and edges. In our project, both molecules and enzymes are represented as nodes. The edges represent the flow of molecules through the different enzymes. The edges are dynamic and are changing based on the concentration of the molecule it is connected to. Some molecules have an in and an out edge to a single enzyme which represents that the enzyme it is connected to is a reversible enzyme. All these concentration values are calculated using the ConcentrationManager.js file.

As our backend simply sends JSON responses representing the pathways, the pathwayComponentUtils.js is responsible for parsing the JSON into usable attributes for a reactflow custom node.


# Potential Todos
* components/customNodes
    -> images are currently hard coded in for enzymes
        -> need a way to dynamically load in the images instead of importing each by hand

* components/flowBuilder.js
    -> need to implement a way to input an image into database from webapp
    -> author and public values currently hardcoded
    -> need an interface to delete / edit molecules and enzymes already in database

* components/utils/ConcentrationManager.js
    -> need to add functionality for cofactors
        -> currently cofactors are just a constant value, need to consider cofactor concentration

* In addition to these, Jeff surely has many features he wants implemented to enhance the model


## Additional information

# Change the substrates / products from temp ID to real ID
**further information for comment in flowBuilder.js**
This is in reference to translating the reactFlow nodes from flowModel, into nodes that can be sent back to the database in flowBuilder. 

In order to save a new pathway or update an existing, the request generated in the flowBuilder must be exactly correct. Becuase of this, an issue arises when editing an existing pathway, i.e. coming from flowModel to flowBuilder.

The problem is that when you GET a pathway from the DB, the ids in an enzymes substrate / product / cofactor lists are instance ids. This is necessary because each molecule has an XY coordinate stored in the database but there could be multiple of the same molecule in the pathway. When rendering the flow model, you must use the instance id. However, when pushing to the database, in order to have a correct pathway, the enzymes must have the molecule real id. This means that we need to switch the instance ids in the subtrate / product / cofactor lists of each enzyme to real ids.
