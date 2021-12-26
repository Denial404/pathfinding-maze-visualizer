function Astar(startNode, endNode) {
    let path = [];
    let visitedNodes = [];
    let openSet = [];
    let closedSet = [];

    openSet.push(startNode);
    while (openSet.length > 0) {
        let leastIndex = 0;
        for (let i = 0; i < openSet.length; i ++) {
            if (openSet[i].f < openSet[leastIndex.f]) {
                leastIndex = i;
            }
        }

        let curr = openSet[leastIndex];
        visitedNodes.push(curr);

        if (curr === endNode) {
            let temp = curr;
            path.push(temp);
            while (temp.previous) {
                path.push(temp.previous);
                temp = temp.previous;
            }
            return { path, visitedNodes };
        }

        openSet = openSet.filter((elt) => elt !== curr);
        closedSet.push(curr);

        let neighbors = curr.neighbors; 
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];
            if (!closedSet.includes(neighbor) && !neighbor.isWall) {
                let newPath = false;
                let tempG = curr.g + 1;
                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                        newPath = true;
                    } 
                } else {
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);
                }

                if (newPath) {
                    neighbor.h = heuristic(neighbor, endNode);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = curr;
                }
            }
        }
    }
    return { path, visitedNodes, error: "No path found!" };
}

function heuristic(a, b) {
    let d = Math.abs(a.x - a.y) + Math.abs(b.x - b.y);
    return d;
}

export default Astar;