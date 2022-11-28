var ifPlayerShowInFixation = false;
var ifGoalShowInFixation = false;
var ifObstacleShowInFixation = false;

function getCenter(w, h) {
    return {
        x: window.innerWidth / 2 - w / 2 + "px",
        y: window.innerHeight / 2 - h / 2 + "px"
    };
}

function drawGrid(c){
    var context = c.getContext("2d");
    c.width = WINSETTING.w;
    c.height = WINSETTING.h;

    const center = getCenter(WINSETTING.w, WINSETTING.h);
    // c.style.marginLeft = center.x
    // c.style.marginTop = center.y;

    c.style.marginLeft = 0
    c.style.marginTop = 0;

    context.fillStyle = COLORPOOL.line;
    context.fillRect(0 - EXPSETTINGS.padding,
        0 - EXPSETTINGS.padding,
        WINSETTING.w + EXPSETTINGS.padding, WINSETTING.h + EXPSETTINGS.padding);


    for (let row = 0; row < gridMatrixList.length; row++) {
        for (let col = 0; col < gridMatrixList.length; col++) {
            const cellVal = gridMatrixList[row][col];
            let color = "#111";
            if (cellVal === OBJECT.obstacle) {
                color = COLORPOOL.obstacle;
            } else if (cellVal === OBJECT.player) {
                color = COLORPOOL.player;
            } else if (cellVal === OBJECT.goal) {
                color = COLORPOOL.goal;
            } else {
                color = COLORPOOL.map;
            };

            // draw rect
            if (cellVal === OBJECT.player ||  cellVal === OBJECT.goal) {
                drawCircle(context, color, 1 / 3 * EXPSETTINGS.padding,
                    col, row, 0, 2 * Math.PI);
            } else {
                context.fillStyle = color;
                context.fillRect(col * (EXPSETTINGS.cellSize + EXPSETTINGS.padding) + EXPSETTINGS.padding,
                    row * (EXPSETTINGS.cellSize + EXPSETTINGS.padding) + EXPSETTINGS.padding,
                    EXPSETTINGS.cellSize, EXPSETTINGS.cellSize);
            };
        }
    }
}

function drawCircle (c,color, lineWidth, colPos, rowPos, startAngle,tmpAngle){
    c.fillStyle = COLORPOOL.map;
    c.fillRect(colPos * (EXPSETTINGS.cellSize + EXPSETTINGS.padding) + EXPSETTINGS.padding,
        rowPos * (EXPSETTINGS.cellSize + EXPSETTINGS.padding) + EXPSETTINGS.padding,
        EXPSETTINGS.cellSize, EXPSETTINGS.cellSize);

    c.beginPath();
    c.lineWidth = lineWidth;
    c.strokeStyle = COLORPOOL.line;
    c.arc(colPos * (EXPSETTINGS.cellSize + EXPSETTINGS.padding) + EXPSETTINGS.padding+ 1/2 * EXPSETTINGS.cellSize,
        rowPos * (EXPSETTINGS.cellSize + EXPSETTINGS.padding) + EXPSETTINGS.padding + 1/2 * EXPSETTINGS.cellSize, 1/3 * EXPSETTINGS.cellSize,
        startAngle, tmpAngle);
    c.fillStyle = color
    c.fill()
    c.stroke();
    c.closePath();}


function fixation(c){
    var context = c.getContext("2d");
    c.width = WINSETTING.w;
    c.height = WINSETTING.h;

    const center = getCenter(WINSETTING.w, WINSETTING.h);
    // c.style.marginLeft = center.x
    // c.style.marginTop = center.y;

    c.style.marginLeft = 0
    c.style.marginTop = 0;

    context.fillStyle = COLORPOOL.line;
    context.fillRect(0 - EXPSETTINGS.padding ,
        0 - EXPSETTINGS.padding,
        WINSETTING.w + EXPSETTINGS.padding, WINSETTING.h + EXPSETTINGS.padding);
    for (let row = 0; row < gridMatrixList.length; row++) {
        for (let col = 0; col < gridMatrixList.length; col++) {
            const cellVal = gridMatrixList[row][col];
            let color = "#111";
            if (cellVal === OBJECT.obstacle && ifObstacleShowInFixation === true) {
                color = COLORPOOL.obstacle;
            } else if (cellVal === OBJECT.player && ifPlayerShowInFixation === true) {
                color = COLORPOOL.player;
            } else if (cellVal === OBJECT.goal && ifGoalShowInFixation === true) {
                color = COLORPOOL.goal;
            } else{
                color = COLORPOOL.map;
            };

            // draw rect
            if (ifGoalShowInFixation === true && (cellVal === OBJECT.goal ||  cellVal === OBJECT.player)) {
                drawCircle(context, color, 1 / 3 * EXPSETTINGS.padding,
                    col, row, 0, 2 * Math.PI);
            } else{
                context.fillStyle = color;
                context.fillRect(col * (EXPSETTINGS.cellSize + EXPSETTINGS.padding) + EXPSETTINGS.padding,
                    row * (EXPSETTINGS.cellSize + EXPSETTINGS.padding) + EXPSETTINGS.padding,
                    EXPSETTINGS.cellSize, EXPSETTINGS.cellSize);
            };
        }
    }
    drawFixation(context,[Math.floor(EXPSETTINGS.matrixsize/2),Math.floor(EXPSETTINGS.matrixsize/2)],1 / 5, 2 * EXPSETTINGS.padding);
}

function drawFixation(c,fixationPos,posScale, lineWidth) {
    let col = fixationPos[1];
    let row = fixationPos[0];
    c.lineWidth = lineWidth;
    c.strokeStyle = COLORPOOL.fixation;

    c.moveTo(col * (EXPSETTINGS.cellSize + EXPSETTINGS.padding) + EXPSETTINGS.padding + posScale * EXPSETTINGS.cellSize,
        row * (EXPSETTINGS.cellSize + EXPSETTINGS.padding) + EXPSETTINGS.padding + 1/2 * EXPSETTINGS.cellSize);
    c.lineTo(col * (EXPSETTINGS.cellSize + EXPSETTINGS.padding) + EXPSETTINGS.padding + (1-posScale) * EXPSETTINGS.cellSize,
        row * (EXPSETTINGS.cellSize + EXPSETTINGS.padding) + EXPSETTINGS.padding + 1/2 * EXPSETTINGS.cellSize);

    c.moveTo(col * (EXPSETTINGS.cellSize + EXPSETTINGS.padding) + 1/2 * EXPSETTINGS.cellSize + EXPSETTINGS.padding,
        row * (EXPSETTINGS.cellSize + EXPSETTINGS.padding) + posScale * EXPSETTINGS.cellSize + EXPSETTINGS.padding);
    c.lineTo(col * (EXPSETTINGS.cellSize + EXPSETTINGS.padding) + 1/2 * EXPSETTINGS.cellSize + EXPSETTINGS.padding,
        row * (EXPSETTINGS.cellSize + EXPSETTINGS.padding) + (1-posScale) * EXPSETTINGS.cellSize + EXPSETTINGS.padding);
    c.stroke();
}

