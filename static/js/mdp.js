// MDP
function transition(state, action) {
    let [x, y] = state;
    let nextState = [x+action[0],y+action[1]]
    return nextState
}

function addNoise(aimAction) {
    let [ax,ay] = aimAction;
    let noiseActionSpace = NOISEACTIONSPACE.slice()
    noiseActionSpace.splice(noiseActionSpace.findIndex(e => arrayEqual(e,[ax,ay])), 1);
    noiseAction = noiseActionSpace[Math.floor(Math.random() * noiseActionSpace.length)];
    return noiseAction
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function isTrespass(matrix, state, nextState, obs) {

    let [x,y] = state;
    if ( (x-1 >= 0) && (x+1 < EXPSETTINGS.matrixsize-1 ) && (y-1 >= 0) && (y+1 < EXPSETTINGS.matrixsize-1) ) {
        if ( (matrix[x-1][y] === obs) && (matrix[x][y+1] === obs) && arrayEquals(nextState, [x-1,y+1])) {
            return true;
        }
        else if ( (matrix[x+1][y] === obs) && (matrix[x][y+1] === obs ) && arrayEquals(nextState, [x+1,y+1]) ) {
            return true;
        }
        else if ( (matrix[x-1][y] === obs) && (matrix[x][y-1] === obs ) && arrayEquals(nextState, [x-1,y-1]) ) {
            return true;
        }
        else if ( (matrix[x+1][y] === obs) && (matrix[x][y-1] === obs ) && arrayEquals(nextState, [x+1,y-1]) ) {
            return true;
        }
        else
            {return false;}
    }
    else
        {return false;}

}

function isValidMove(matrix, state, nextState) {
    if ((nextState[0] < EXPSETTINGS.matrixsize) && (nextState[1] < EXPSETTINGS.matrixsize) && (nextState[0] >= 0) && (nextState[1] >= 0)) // outside grid
        {
            let diaTrespass = isTrespass(matrix, state, nextState, OBJECT.obstacle)
            if ((matrix[nextState[0]][nextState[1]] !== OBJECT.obstacle) && (!diaTrespass)) {
                return true;
            }
            else {return false}
        }
    return false;
}

function isOnlyGoalReached(playerState, goalState) {
    const [player_x,player_y] = playerState
    if (player_x === goalState[0][0] && player_y === goalState[0][1])
        {return true;}
    else
    {return false;}
}

function isGoalReached(playerState, goalStates) {
    const [player_x,player_y] = playerState

    if (player_x === goalStates[0][0] && player_y === goalStates[0][1])
        {return true;}
    else if
        (player_x === goalStates[1][0] && player_y === goalStates[1][1])
        {return true;}
    else
    {return false;}
}

function whichGoalReached(playerState, goalStates) {
    const [player_x,player_y] = playerState
    if (player_x === goalStates[0][0] && player_y === goalStates[0][1])
    {return 1;}
    else if
    (player_x === goalStates[1][0] && player_y === goalStates[1][1])
    {return 2;}
    else
    {return 0;}
}

function calCloserDestination(playerState, goalStates) {
    dis1 = calculatetGirdDistance(playerState, goalStates[0])
    dis2 = calculatetGirdDistance(playerState, goalStates[1])
    if (dis1 < dis2) {return 1;}
    else if (dis1 > dis2) {return 2;}
    else {return 0;}
}

function isReachedCloserGoal(reachedGoal,closerDestination) {
    if (closerDestination === 0 ) {return true;}
    else if (closerDestination === reachedGoal) {return true;}
    else {return false;}
}

function updateMatrix(matrix, y, x, value) {
    matrix[y][x] = value;
    return matrix
}

function arrayEqual(arr1, arr2) {
    if (arr1.length != arr2.length) return false;
    for (var i = 0; i < arr1.length; ++i) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}
