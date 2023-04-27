import { useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
    Controls,
    useNodesState,
    useEdgesState,
    addEdge,
} from 'reactflow';
import SliderSideBar from './SliderSideBar';
import { generateNodes, generateEdges } from './utils/pathwayComponentUtils';

import './../scss/CustomNodes.scss';
import 'reactflow/dist/style.css';

import { Enzyme } from './customNodes/Enzyme.js';
import { Molecule } from './customNodes/Molecule.js';
const nodeTypes = {
    enzyme: Enzyme,
    molecule: Molecule,
};

/**
 * Wrapper for ReactFlow and concentration sliders.
 * Main interaction area for working with a pathway.
 * @param props
 * @prop {Object} concentrationManager used to manage changing concentrations
 * @prop {Object} pathway pathway object generated by the backend
 */
function FlowModel({ pathway, concentrationManager }) {
    console.log(pathway, concentrationManager);
    const [pathwayTitle, setPathwayTitle] = useState(pathway['name']);
    const [pathwayDescription, setPathwayDescription] =
        useState('about the pathway');
    const [pathwayAuthor, setPathwayAuthor] = useState('author');
    const [pathwayID, setPathwayID] = useState(pathway.id);

    // Data used for ReactFlow
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // molecules[id] = {"title": "ATP", "value": 10}
    const [molecules, setMolecules] = useState([]);

    // Used for the running model
    const [running, setRunning] = useState(false);
    // Milliseconds between concentration calculations, lower = faster
    const [speed, setSpeed] = useState(1000);

    const navigate = useNavigate(); // used when editing an existing pathway

    /**
     * Console logs id and position of ReactFlow nodes
     * when onNodeChange is called
     *
     * Can be used by adding
     * useEffect(() => {
     *     printNodesOnChange();
     * }, [nodes])
     */
    const printNodesOnChange = () => {
        let out = [];
        for (const node of nodes) {
            out.push({
                id: node.data.label,
                pos: node.position,
            });
        }
        console.log(out);
    };

    /**
     * Gets updated pathway based on current FlowModel pathwayID.
     * If there is no pathway ID, close the current pathway.
     */
    useEffect(() => {
        handlePathwayOpen(pathway);
    }, [pathway]); // monitor pathwayID for changes

    /**
     * Initializes the model given a newPathway
     * @param newPathway
     */
    const handlePathwayOpen = (newPathway) => {
        setRunning(false);

        setPathwayTitle(newPathway['name']);
        setPathwayDescription('about the pathway');
        setPathwayAuthor(newPathway['author']);

        // Create the nodes and edges for ReactFlow
        setNodes(generateNodes(pathway));
        setEdges(generateEdges(pathway));

        concentrationManager.addListener(onConcentrationUpdate);
        concentrationManager.parsePathway(newPathway);
    };

    /**
     * @param {import('react').BaseSyntheticEvent} e event
     * @param {import('reactflow').Node} node
     */
    const onNodeClick = (e, node) => {
        if (node.type === 'molecule') {
            let clicked_id = node.data.molecule_id;
            setNodes(
                nodes.map((n) => {
                    if (n.data.molecule_id === clicked_id) {
                        if (n.data.locked) {
                            concentrationManager.unlock(n.data.molecule_id);
                            n.data.locked = false;
                            n.className = 'molecule';
                        } else {
                            concentrationManager.lock(n.data.molecule_id);
                            n.data.locked = true;
                            n.className = 'molecule locked';
                        }
                    }
                    return n;
                })
            );
        }
    };

    /**
     * Updates the molecule data in state and ReactFlow edges
     * @param {Object[]} moleculeConcentrations
     */
    const onConcentrationUpdate = (moleculeConcentrations) => {
        let mList = [];
        for (const [id, data] of Object.entries(moleculeConcentrations)) {
            mList[id] = {
                title: data.title,
                value: data.value,
            };
        }

        setMolecules(mList);
        setEdges((edges) =>
            edges.map((edge) => {
                if (concentrationManager.enzymes[edge.data.enzyme_id]) {
                    if (edge.id.split('_')[0] === 'R') {
                        edge.style = {
                            strokeWidth:
                                concentrationManager.enzymes[
                                    edge.data.enzyme_id
                                ].prodToSub * 300,
                            stroke: '#FF0000',
                        };
                    } else {
                        edge.style = {
                            strokeWidth:
                                concentrationManager.enzymes[
                                    edge.data.enzyme_id
                                ].subToProd * 300,
                            stroke: '#00FF00',
                        };
                    }
                }
                return edge;
            })
        );
    };

    const handleConcentrationChange = (id, value) => {
        concentrationManager.setConcentration(id, value);
    };

    // Used by ReactFlow whenever an edge is connected between nodes
    const onConnect = useCallback(
        (params) => setEdges((els) => addEdge(params, els)),
        [setEdges]
    );

    // Updates the concentrations every 1000 milliseconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (running) {
                concentrationManager.updateConcentrations();
            }
        }, speed);

        return () => {
            clearInterval(interval);
        };
    }, [running, speed]);

    /**
     * Resets concentrations to starting values
     *
     */
    const resetConcentrations = () => {
        concentrationManager.reset();
    };

    const handleEdit = () => {
        // sends reactflow state to flowBuilder
        navigate('/build', {
            state: {
                initialNodes: nodes,
                initialEdges: edges,
                id: pathwayID,
                title: pathwayTitle,
            },
        });
    };

    return (
        <div className="h-100" style={{ background: '#adb5bd' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes} // needed for multiple handlers
                fitView={true}
                attributionPosition="bottom-left"
                onNodeClick={onNodeClick}
            >
                <Controls position="bottom-right" />
                <div className="container-fluid d-flex flex-row justify-content-between h-100">
                    <div className="py-3">
                        <SliderSideBar
                            molecules={molecules}
                            handleConcentrationChange={
                                handleConcentrationChange
                            }
                            run={() => {
                                setRunning(true);
                            }}
                            stop={() => {
                                setRunning(false);
                            }}
                            reset={resetConcentrations}
                            running={running}
                        />
                    </div>
                    <div className="py-3">
                        <PathwayTitleCard
                            pathwayTitle={pathwayTitle}
                            pathwayDescription={pathwayDescription}
                            pathwayAuthor={pathwayAuthor}
                            editPathway={handleEdit}
                        />
                    </div>
                </div>
            </ReactFlow>
        </div>
    );
}

/**
 *
 * @prop {string} pathwayTitle - the name of the pathway
 * @prop {string} pathwayDescription - the description of the pathway
 * @prop {string} pathwayAuthor - the author of the pathway
 * @returns An informational react component for the current pathway
 */
function PathwayTitleCard({
    pathwayTitle,
    pathwayDescription,
    pathwayAuthor,
    editPathway,
}) {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpanded = () => {
        setIsExpanded((expanded) => !expanded);
    };

    return pathwayTitle ? (
        <>
            <div className="card bg-opacity-10" style={{ zIndex: '5' }}>
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={toggleExpanded}
                >
                    {isExpanded ? 'Hide Info' : 'Show Info'}
                </button>
            </div>
            <div
                className={'card collapse' + (isExpanded ? ' show' : '')}
                style={{ zIndex: '5' }}
            >
                <div className="card-body">
                    <div className="fs-2 card-title" id="PathwayTitle">
                        {pathwayTitle}
                    </div>
                    <div className="fs-5 card-text">{pathwayDescription}</div>
                    <div className="fs-5 card-text">
                        <small className="text-muted">
                            Created By {pathwayAuthor}
                        </small>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={editPathway}>
                    Edit pathway
                </button>
            </div>
        </>
    ) : (
        <></>
    );
}

export default FlowModel;
