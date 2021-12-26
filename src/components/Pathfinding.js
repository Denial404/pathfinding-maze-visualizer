import React, { useState, useEffect } from "react";
import Node from "./Node";
import Astar from "../astar/aStar";
import "./Pathfinding.css";

const rows = Math.round(window.innerHeight / 55);
const cols = Math.round(window.innerWidth / 50);

const NODE_START_ROW = 0;
const NODE_START_COL = 0;
const NODE_END_ROW = rows - 1;
const NODE_END_COL = cols - 1;
let completed = false;

const Pathfind = () => {
    const [VisitedNodes, setVisitedNodes] = useState([]);
    const [Grid, setGrid] = useState([]);
    const [Path, setPath] = useState([]);

    useEffect(() => {
        initalizeGrid();
    }, []);

    // create grid
    const initalizeGrid = () => {
        const grid = new Array(cols);

        for (let i = 0; i < rows; i++) {
            grid[i] = new Array(cols);
        }

        createSpot(grid);
        setGrid(grid);
        addneighbors(grid);

        const startNode = grid[NODE_START_ROW][NODE_START_COL];
        const endNode = grid[NODE_END_ROW][NODE_END_COL];
        let path = Astar(startNode, endNode);
        startNode.isWall = false;
        endNode.isWall = false;

        setPath(path.path);
        setVisitedNodes(path.visitedNodes);
    };

    // creates spot
    const createSpot = (grid) => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j] = new Spot(i, j);
            }
        }
    };

    // add neighbors
    const addneighbors = (grid) => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j].addneighbors(grid);
            }
        }
    }

    // spot constructor
    function Spot(i, j) {
        this.x = i;
        this.y = j;
        this.isStart = this.x === NODE_START_ROW && this.y === NODE_START_COL;
        this.isEnd = this.x === NODE_END_ROW && this.y === NODE_END_COL;
        this.g = 0;
        this.f = 0;
        this.h = 0;
        this.neighbors = [];
        this.isWall = false;
        // randomly make walls take up 15% of the grid
        if (Math.random(1) < 0.15) {
            this.isWall = true;
        }
        this.previous = undefined;
        this.addneighbors = function (grid) {
            let i = this.x;
            let j = this.y;
            if (i > 0) this.neighbors.push(grid[i - 1][j]);
            if (i < rows - 1) this.neighbors.push(grid[i + 1][j]);
            if (j > 0) this.neighbors.push(grid[i][j - 1]);
            if (j < cols - 1) this.neighbors.push(grid[i][j + 1]);
        };
        completed = false;
    }

    // grid with node
    const gridWithNode = (
        <div>
            {Grid.map((row, rowIndex) => {
                return (
                    <div key={rowIndex} className="rowWrapper">
                        {row.map((col, colIndex) => {
                            const { isStart, isEnd, isWall } = col;
                            return <Node
                                key={colIndex}
                                isStart={isStart}
                                isEnd={isEnd}
                                isWall={isWall}
                                row={rowIndex}
                                col={colIndex}
                            />;
                        })}
                    </div>
                );
            })}
        </div>
    );

    const visualizeShortestPath = (shortestPathNodes) => {
        const startNode = Grid[NODE_START_ROW][NODE_START_COL];
        const endNode = Grid[NODE_END_ROW][NODE_END_COL];
        for (let i = 0; i < shortestPathNodes.length; i++) {
            setTimeout(() => {
                const node = shortestPathNodes[i];
                if (node !== startNode && node !== endNode) {
                    document.getElementById(`node-${node.x}-${node.y}`).className =
                    "node node-shortest-path";
                }
            }, 10 * i); // "framerate"
        }
    };

    const visualizePath = () => {
        if (completed) {
            return;
        }

        const startNode = Grid[NODE_START_ROW][NODE_START_COL];
        const endNode = Grid[NODE_END_ROW][NODE_END_COL];
        for (let i = 0; i <= VisitedNodes.length; i++) {
            if (i === VisitedNodes.length) {
                setTimeout(() => {
                    visualizeShortestPath(Path, startNode, endNode);
                }, 10 * i); // "framerate"
            } else {
                setTimeout(() => {
                    const node = VisitedNodes[i];
                    if (node !== startNode && node !== endNode) {
                        document.getElementById(`node-${node.x}-${node.y}`).className =
                        "node node-visited";
                    }
                }, 10 * i); // "framerate"
            }
        }
        completed = true;
    };
    console.log(Path);

    const Reset = () => {
        window.location.reload();
    };

    return (
        <div className="Wrapper">
            <h1 className="title">Pathfinding Maze Visualizer</h1>
            <button class="myButton" onClick={visualizePath}>
                Visualize Path (A* Search Algorithm)</button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button class="myButton" onClick={Reset}>Reset</button>
            <p class="space"> 
            {gridWithNode}
            </p>
        </div>
    );
};

export default Pathfind;