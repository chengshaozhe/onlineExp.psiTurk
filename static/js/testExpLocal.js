// var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
};

// random sample a map configuration
var expData = randomProperty(config)
console.log('sampleData:',expData[0]['samples'],expData)

var nTrials = Object.keys(expData).length
console.log('nTrials:',nTrials)

// random shuffle trails for each subj
var initIndex = [];
for(var i = 0; i < nTrials; i++){
  initIndex.push(i);
}

shuffledIndex = shuffle(initIndex);

const designData = {}
for (var i = 0; i < nTrials; i++){
    designData[i] = expData[shuffledIndex[i]]
};

var curTrial = 0;
let gridMatrixList = Array(EXPSETTINGS.matrixsize).fill(0).map(()=>Array(EXPSETTINGS.matrixsize).fill(0))
var allTrialsData = new Array();

var ifPrac = true;
var pracCurTrial = 0;
var nPracTrials = Object.keys(practiceMapsData).length


var jsPsych = initJsPsych()
var timeline = [];

var introPage1= {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p style="font-size:30px;">Thank you for participating in our experiment!</p>
        <p style="font-size:20px;">You will play a game where you are a hungry traveler (<PLAYER>red circle</PLAYER>), who needs to reach a restaurant to replenish your food as soon as possible.</p>
        <p style="font-size:20px;">There will be two restaurants (<GOAL>blue circles</GOAL>) on the map. Your task is to manipulate the arrow keys (up, down, left, right) to navigate to one of the restaurants <strong> as quickly as possible with the fewest steps</strong>.
        </p>

        <img src="../static/images/demoMap.png" style = "width: 300px; height: 300px"/>
        <p style="font-size:20px;"> <strong> Balck tiles </strong> are walls that you cannot pass through. </p>

        <p style="font-size:20px;">Press the <strong>spacebar</strong> to continue.</p>
        <style>
            PLAYER {
                color: red;
            }
            GOAL {
                color: blue;
            }
        </style>

      `,
    choices: [' '],
    data: {type: 'introPage1'}
};

var introPage2= {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p style="font-size:20px;">
            During navigation, your keypress will have a <strong> 1/15 chance of failing </strong>, causing your movement direction to randomize to a nearby location.
        </p>
        <p style="text-align: center;"><img src="../static/images/noiseFig.png" style = "width: 300px; height: 300px;"/></p>

        <p style="font-size:20px; text-align: center;">For example, when you press the ← key to control the red agent move one step to the left. There is a 1/15 chance that you will be drifted to one of 7 nearby grids (<DRIFT>orange grids</DRIFT>).</p>

        <p style="font-size:20px;">Press the <strong>spacebar</strong> to continue.</p>
        <style>
            DRIFT {
                color: orange;
            }
        </style>
      `,
    choices: [' '],
    data: {type: 'introPage2'}
};

var introPage3= {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p style="font-size:20px;">
            Next, you will have <strong> 3 rounds </strong> to practice, then we will give you a series of <strong> 24 rounds </strong> to play.
        </p>

        <p style="font-size:20px;">
            In each round of the game, you can reach <strong> only one restaurant </strong> and this round of the game will end after reaching the restaurant. A new round will start once you press the spacebar.
        </p>

        <p style="font-size:20px;"> For each round, you will receive <strong> a\nbonus of 5 cents </strong> if your performance is above average.
        </p>

        <p style="font-size:20px;">
            To transition between the rounds as smoothly as possible, we recommend using one hand to press the spacebar and the other use the arrow keys.
        </p>

        <p style="font-size:20px;">Press the <strong>spacebar</strong> to start practicing!</p>
      `,
    choices: [' '],
    data: {type: 'introPage3'}
};

var initialMap = {
    type: jsPsychCallFunction,
    func: function(){
        stepCount = 0;

        let currentDesign = designData[curTrial]
        console.log('currentMap:',currentDesign['mapType'],currentDesign)

        gridMatrixList = Array(EXPSETTINGS.matrixsize).fill(0).map(()=>Array(EXPSETTINGS.matrixsize).fill(0))
        gridMatrixList[currentDesign.initPlayerGrid[0]][currentDesign.initPlayerGrid[1]] = OBJECT.player;
        goalList = Array(currentDesign.target1, currentDesign.target2)
        goalList.forEach((state,i) => gridMatrixList[state[0]][state[1]] = OBJECT.goal);

        currentDesign.obstacles.forEach((state,i) => gridMatrixList[state[0]][state[1]] = OBJECT.obstacle);

        singleTrialDataToRecord = {
            trialIndex: curTrial,
            trajectory: Array(currentDesign.initPlayerGrid),
            aimAction: Array(),
            realAction: Array(),
            closerDestination: Array(),
            RT: Array()};

        singleTrialData = Object.assign({}, currentDesign, singleTrialDataToRecord);
    },

    data:{type: 'initial'}
}

var fixationWithTime = {
    type: jsPsychCanvasKeyboardResponse,
    canvas_size: [WINSETTING.w, WINSETTING.h],
    stimulus: fixation,
    choices: "NO_KEYS",
    trial_duration: 500,
    data: {type: 'fixation'}
};

var fixationWithKeyPress = {
    type: jsPsychCanvasKeyboardResponse,
    canvas_size: [WINSETTING.w, WINSETTING.h],
    stimulus: fixation,
    choices: " ",
    prompt:
    `
    <p style="font-size:20px;text-align: center;">Press the <strong>spacebar</strong> to start.</p>
    <p style="font-size:20px;text-align: center;">Press ↑ ↓ ← → to control the player.</p>
    `,
    data: {type: 'fixation'}
};

var eachStep = {
    type: jsPsychCanvasKeyboardResponse,
    canvas_size: [WINSETTING.w, WINSETTING.h],
    stimulus: drawGrid,
    choices: ["ArrowDown","ArrowUp","ArrowLeft","ArrowRight"],
    prompt: '<p style="font-size:20px;text-align: center;">Press ↑ ↓ ← → to control the player</p>',
    data: {type: 'maintask'}
};

var mainTask = {
    timeline: [eachStep],
    loop_function: function(){
        let currentDesign = designData[curTrial]

        if (stepCount === 0) {
            playerState = currentDesign.initPlayerGrid
        }

        let responseKey = jsPsych.data.getLastTrialData().filter({type:'maintask'}).trials[0].response;
        let aimAction = DIRECTIONS[responseKey].movement;
        let action = aimAction


        let isDrift = currentDesign.noiseStep.includes(stepCount) ? 1: 0;
        if (isDrift) {
            action = addNoise(aimAction)
        } else {
            action = aimAction}

        let aimNextState = transition(playerState, action)

        if (isValidMove(gridMatrixList, playerState, aimNextState)) {
            gridMatrixList = updateMatrix(gridMatrixList, playerState[0], playerState[1], OBJECT.blank);
            gridMatrixList = updateMatrix(gridMatrixList, aimNextState[0], aimNextState[1], OBJECT.player);
            playerState = aimNextState;
        }

        let goals = Array(currentDesign.target1, currentDesign.target2)
        let closerDestination = calCloserDestination(currentDesign.initPlayerGrid, goals);

        let trialOver = isGoalReached(playerState, goals);

        singleTrialData.trajectory.push(playerState);
        singleTrialData.aimAction.push(aimAction);
        singleTrialData.realAction.push(action);
        singleTrialData.closerDestination.push(closerDestination);

        jsPsych.data.get().addToLast({
                trialIndex: curTrial,
                RT: jsPsych.data.getLastTrialData().select('rt').values[0],
            });

        if(trialOver){
            let reachedGoal = whichGoalReached(playerState, goals);
            let isReachCloserGoal = isReachedCloserGoal(reachedGoal,closerDestination)

            let stepsTaken = singleTrialData.aimAction.length
            let isTooManySteps = stepsTaken - currentDesign.leastStep > STEPS_THRESHOLD ? 1: 0;

            jsPsych.data.get().addToLast({
                    isReachCloserGoal: isReachCloserGoal,
                    isTooManySteps: isTooManySteps,
                });

            singleTrialData.RT.push(jsPsych.data.get().filter({trialIndex: curTrial}).select('rt'));
            allTrialsData[curTrial] = singleTrialData;
            return false;
        } else {
            stepCount ++;
            return true;
        }
    },
    data: {type: 'mainloop'}
}

//////////
var giveTooManyStepsFeedback = {
    type: jsPsychCanvasButtonResponse,
    canvas_size: [WINSETTING.w, WINSETTING.h],
    stimulus: drawGrid,
    prompt:
        `
    <p style="font-size:30px; text-align:center;color:red"><strong> Took too many steps! </strong></p>
    <p style="font-size:30px; text-align:center;color:red"><strong> Please use fewer steps.</strong></p>
    `,
    choices: ['OK!'],
    data: {type: 'trialFeedback'}
}

var ifGiveTooManyStepsFeedback = {
    timeline: [giveTooManyStepsFeedback],
    conditional_function: function(){
        var isTooManySteps = jsPsych.data.getLastTrialData().select('isTooManySteps').values[0];

        if(isTooManySteps){
            return true ;
        } else {
            return false;
        }
    }
}

var giveWrongGoalFeedback = {
    type: jsPsychCanvasButtonResponse,
    canvas_size: [WINSETTING.w, WINSETTING.h],
    stimulus: drawGrid,
    prompt:
        `
    <p style="font-size:30px; text-align:center;color:red"><strong>The other restaurant is closer!</strong></p>
    `,
    //    <p style="font-size:30px; text-align:center;color:red"><strong> Remeber to go to the closest restaurant.</strong></p>
    choices: ['OK!'],
    data: {type: 'trialFeedback'}
}

var ifGiveWrongGoalFeedback = {
    timeline: [giveWrongGoalFeedback],
    conditional_function: function(){
        var isReachCloserGoal = jsPsych.data.getLastTrialData().select('isReachCloserGoal').values[0];
        if(isReachCloserGoal){
            return false;
        } else {
            return true;
        }
    }
}
////

var updateTrial = {
    type: jsPsychCallFunction,
    func: function(){
        drawGrid;
        curTrial++;
    },
    data: {type: 'updateTrial'}
}

var experiments = {
    timeline: [initialMap, fixationWithKeyPress, mainTask, ifGiveWrongGoalFeedback,  updateTrial],
    repetitions: nTrials
}

var endExpInfo = {
    type:jsPsychHtmlButtonResponse,
    stimulus: `
      <p style="font-size:30px;">You have finished all the tasks!</p>
      <p style="font-size:30px;">Please press the button on the screen to save the data.</p>
      `,
    choices: ['OK!'],
};




var pracInitialMap = {
    type: jsPsychCallFunction,
    func: function(){
        practiceStepCount = 0;
        let currentDesign = practiceMapsData[pracCurTrial]

        gridMatrixList = Array(EXPSETTINGS.matrixsize).fill(0).map(()=>Array(EXPSETTINGS.matrixsize).fill(0))
        gridMatrixList[currentDesign.initPlayerGrid[0]][currentDesign.initPlayerGrid[1]] = OBJECT.player;
        goalList = Array(currentDesign.target1, currentDesign.target2)
        goalList.forEach((state,i) => gridMatrixList[state[0]][state[1]] = OBJECT.goal);
        currentDesign.obstacles.forEach((state,i) => gridMatrixList[state[0]][state[1]] = OBJECT.obstacle);
    },
    data:{type: 'pracInitialMap'}
}


var pracMainTask = {
    timeline: [eachStep],
    loop_function: function(){
        let currentDesign = practiceMapsData[pracCurTrial]
        if (practiceStepCount === 0) {
            playerState = currentDesign.initPlayerGrid
        }

        let responseKey = jsPsych.data.getLastTrialData().filter({type:'maintask'}).trials[0].response;
        let aimAction = DIRECTIONS[responseKey].movement;
        let action = aimAction

        let isDrift = currentDesign.noiseStep.includes(practiceStepCount) ? 1: 0;
        if (isDrift) {
            action = addNoise(aimAction)
        } else {
            action = aimAction}

        let aimNextState = transition(playerState, action)

        if (isValidMove(gridMatrixList, playerState, aimNextState)) {
            gridMatrixList = updateMatrix(gridMatrixList, playerState[0], playerState[1], OBJECT.blank);
            gridMatrixList = updateMatrix(gridMatrixList, aimNextState[0], aimNextState[1], OBJECT.player);
            playerState = aimNextState;
        }
        let goals = Array(currentDesign.target1, currentDesign.target2)
        let trialOver = isGoalReached(playerState, goals);
        if(trialOver){
            return false;
        } else {
            practiceStepCount ++;
            return true;
        }
    },
    data: {type: 'pracMainloop'}
}

var pracUpdateTrial = {
    type: jsPsychCallFunction,
    func: function(){
        drawGrid;
        pracCurTrial++;
    },
    data: {type: 'pracUpdateTrial'}
}

var pratice = {
    timeline: [pracInitialMap, fixationWithKeyPress, pracMainTask, pracUpdateTrial],
    repetitions: nPracTrials,
    conditional_function(){
        if(ifPrac){
            pracCurTrial = 0;
            return true;
        }
        else {
            return false;
        }
    },
    data: {type: 'pratice'}
}

var introTest = {
    type: jsPsychSurvey,
    pages: [
        [
            {
                type: 'multi-choice',
                prompt: 'Each keypress will move only one step.\n',
                options: ["True", "False"],
                correct_response: "True",
                required: true
            },
            {
                type: 'multi-choice',
                prompt: 'Each round of the game ends when you reach one of the restaurants.\n',
                options: ["True", "False"],
                correct_response: "True",
                required: true
            },
            {
                type: 'multi-choice',
                prompt: 'Your keypress has a certain probability of failure.\n',
                options: ["True", "False"],
                correct_response: "True",
                required: true
            },
            {
                type: 'multi-choice',
                prompt: 'The agent will move in the direction you are going when your keypress fails.\n',
                options: ["True", "False"],
                correct_response: "False",
                required: true
            }
        ],
    ],
    title: 'Please answer the following questions. The experiment will start if all answers are correct.',
    button_label_finish: 'Click to submit your answer',
    show_question_numbers: 'onPage',
    data:{type: 'questionaire'}
};

var wrongQuesntionarieFeedback = {
    type:jsPsychHtmlKeyboardResponse,
    stimulus:'<p style="font-size:30px;text-align: center;">Some mistakes in your answers. Please read the instructions again. Press the <strong>spacebar</strong> to continue.</p>',
    choices: " ",
    data: {type: 'wrongQuesntionarieFeedback'}
};


var correctQuesntionarieFeedback = {
    type:jsPsychHtmlKeyboardResponse,
    stimulus:
    `
        <p style="font-size:30px;">The practice is over.</p>
        <p style="font-size:30px;">Please press the <strong>spacebar</strong> to enter the formal experiment.</p>
      `,
    choices: " ",
    data: {type: 'correctQuesntionarieFeedback'}
};


var correctFeedbackJudge = {
    timeline: [correctQuesntionarieFeedback],
    conditional_function: function(){
        if(ifQuestionarieCorrect){
            return true;
        } else {
            return false;
        }
    },
    data: {type: 'correctFeedbackJudge'}
}

var wrongFeedbackJudge = {
    timeline: [wrongQuesntionarieFeedback],
    conditional_function: function(){
        if(ifQuestionarieCorrect){
            return false;
        } else {
            return true;
        }
    },
    data: {type: 'wrongFeedbackJudge'}
}

var ifQuestionarieCorrect = false;
var introTestJudge = {
    type: jsPsychCallFunction,
    func: function(){
        if (pracCurTrial > nPracTrials-1){
            let introTestData = jsPsych.data.getLastTrialData().trials[0].accuracy;
            let introTestAccuracyData = new Array();
            introTestData.forEach((item, index) => {
                introTestAccuracyData.push(Object.values(item)[0]);
            });

            if (introTestAccuracyData.filter(function(res){
                return res == true;
            }).length === 4){
                ifPrac = false;
                ifQuestionarieCorrect = true;
            }
            else{
                ifPrac = false;
                ifQuestionarieCorrect = false;
            }
        }
    },
    data: {type: 'introTestJudge'}
}

var introWithPrac = {
    timeline: [introPage1, introPage2, introPage3, pratice, introTest, introTestJudge, wrongFeedbackJudge, correctFeedbackJudge],
    loop_function: function(){
        if(!ifQuestionarieCorrect){
            return true;
        }
        else {
            return false;
        }
    },
    data: {type: 'introWithPrac'}
}


// timeline.push(introWithPrac);
timeline.push(experiments);
timeline.push(endExpInfo);
jsPsych.run(timeline);