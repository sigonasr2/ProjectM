var canvas;

const WAITING = 0;
const RUNNING = 1;
const REVIEWING = 2;
const TESTING = 3;
const FINISH = 4;

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

const RED = "R";
const BLUE = "B";
const GREEN = "G";
const YELLOW = "Y";
const PURPLE = "P";
const PINK = "PI";
const BLACK = "BL";
const GRAY = "GR";

const ALIVE = 0;
const DEAD = 1;
const DONE = 2;

var BOT_X = -1
var BOT_Y = -1
var BOT_DIR = RIGHT
var BOT_STATE = ALIVE
var BOT_TAPE = "RB"
var BOT_QUEUE = []

var BELTDOWN = {type:"BELT",direction:DOWN/*,direction2 - defines a secondary direction. For two belts at once.*/}
var BELTRIGHT = {type:"BELT",direction:RIGHT}
var BELTUP = {type:"BELT",direction:UP}
var BELTLEFT = {type:"BELT",direction:LEFT}
var BRANCHDOWN = {type:"BRANCH",direction:DOWN,color1:RED,color2:BLUE} //color 1 points clockwise(right), color 2 points counter-clockwise(left)
var BRANCHLEFT = {type:"BRANCH",direction:LEFT,color1:RED,color2:BLUE}
var BRANCHRIGHT = {type:"BRANCH",direction:RIGHT,color1:RED,color2:BLUE}
var BRANCHUP = {type:"BRANCH",direction:UP,color1:RED,color2:BLUE}
var WRITERDOWN = {type:"WRITER",direction:DOWN,color:RED/*overwrite - if turned on, the writer overwrites the current tape position instead of appending.*/}
var WRITERLEFT = {type:"WRITER",direction:LEFT,color:RED}
var WRITERRIGHT = {type:"WRITER",direction:RIGHT,color:RED}
var WRITERUP = {type:"WRITER",direction:UP,color:RED}


var lastGameUpdate = 0;
var gameSpeed = 1000/1;

var gameState=RUNNING;
var gameStage=0;

var LEVEL0 = [
	[{},{},{},{},{},],
	[{},{},{},{},{},],
	[{},{},{},{},{},],
	[{},{},{},{},{},],
	[{},{},{},{},{},],]
var LEVEL1 = [
	[{},{},{...BELTDOWN},{...BELTLEFT},{...BELTLEFT},],
	[{},{},{},{},{...BELTUP},],
	[{},{...BELTDOWN},{},{},{...BELTUP},],
	[{},{...BELTRIGHT},{...BELTRIGHT},{...BELTRIGHT},{...BELTUP},],
	[{},{},{},{},{},],]
var LEVEL2 = [
	[{},{},{},{},{},],
	[{},{...BELTRIGHT},{},{},{},], //BLUE
	[{},{...BRANCHRIGHT},{},{},{},],
	[{},{...BELTRIGHT},{},{},{},], //RED
	[{},{},{},{},{},],]
var LEVEL3 = [
	[{},{},{},{},{},],
	[{},{...WRITERUP,overwrite:true},{},{},{},],
	[{},{...WRITERDOWN},{},{},{},],
	[{},{...BELTRIGHT},{},{},{},],
	[{},{},{},{},{},],]
var LEVEL4 = [
	[{},{},{},{},{},],
	[{},{},{},{},{},],
	[{},{...BELTRIGHT,direction2:DOWN},{},{},{},],
	[{},{},{...BELTUP,direction2:LEFT},{},{},],
	[{},{},{},{},{},],]
var STAGE1 = {
	name:"The First Stage!",
	objective:"Accept all bots",
	level:createGrid(5,5,4,2),
	start:{x:0,y:2},
	accept:(tape)=>true}
var STAGE2 = {
	name:"Blue Blue",
	objective:"Accept only Blue Bots",
	level:createGrid(5,5,4,2),
	start:{x:0,y:2},
	accept:(tape)=>{
			for (var i=0;i<tape.length;i++) {
				if (tape[i]!=="B") {
					return false;
				}
			}
			return true;
		}
	}

var gameGrid= []

function createGrid(width=5,height=5,exitX=4,exitY=2) {
	var grid = []
	for (var i=0;i<width;i++) {
		var row = []
		for (var j=0;j<height;j++) {
			row.push({})
		}
		grid.push(row)
	}
	grid[exitY][exitX]={type:"EXIT"}
	return grid
}

function resetGame() {
	gameGrid=[]
	gameState=WAITING
	BOT_X=-1
	BOT_Y=-1
	BOT_DIR=RIGHT
	BOT_STATE=ALIVE
	BOT_TAPE="RB"
	BOT_QUEUE=[]
	lastGameUpdate=0
}

function generateBotQueue() {
	if (gameState===TESTING) {
		//Iterate up to...15 RED/BLUE combinations.
		var MAX_VALUE=1000
		var startingValue=0
		while (startingValue<MAX_VALUE) {
			var tape=ConvertNumberToTape(startingValue++)
			//console.log(tape)
			var wrongBot=false //Set to true if a bot that's supposed to pass fails, or a bot that's supposed to fail passes.
			var isSupposedToBeAccepted=gameStage.accept(tape)
			var result=getSimulatedBotResult(tape)
			if (result===isSupposedToBeAccepted) {
				wrongBot=false;
			} else {
				wrongBot=true;
			}
			
			if (wrongBot) {
				BOT_QUEUE.push(tape)
			}
			if (BOT_QUEUE.length===3) {
				break;
			}
		}
	}
}

function getSimulatedBotResult(tape) {
	var simulatedBoard = deepCopy(gameGrid)
	resetBot(gameStage.start.x,gameStage.start.y,TESTING,tape)
	const MAX_ITERATIONS=10000
	var iterations=0
	while (iterations<MAX_ITERATIONS) {
		runBot(true)
		//renderGame()
		if (gameState===REVIEWING) {
			//console.log("Rejected")
			return false
		}
		if (gameState===FINISH) {
			//console.log("Accepted")
			return true
		}
		iterations++
	}
	return false
}

function ConvertNumberToTape(val) {
	var remainingVal = val
	var tape = ""
	while (remainingVal>0) {
		var mask = remainingVal&1
		if (mask===1) {
			tape="B"+tape
		} else {
			tape="R"+tape
		}
		remainingVal=remainingVal>>>1
	}
	return tape;
}

function runBot(testing) {
	//console.log(new Date().getTime())
	if (lastGameUpdate<new Date().getTime()||testing) {
		lastGameUpdate=new Date().getTime()+gameSpeed
		//console.log("Update")
		var nextSquare = {}
		switch (BOT_DIR) {
			case UP:{
				nextSquare = gameGrid[--BOT_Y][BOT_X];
				BOT_DIR=(nextSquare.direction2 &&
				(nextSquare.direction2===UP||nextSquare.direction2===DOWN))?nextSquare.direction2:nextSquare.direction
			}break;
			case LEFT:{
				nextSquare = gameGrid[BOT_Y][--BOT_X];
				BOT_DIR=(nextSquare.direction2 &&
				(nextSquare.direction2===RIGHT||nextSquare.direction2===LEFT))?nextSquare.direction2:nextSquare.direction
			}break;
			case RIGHT:{
				nextSquare = gameGrid[BOT_Y][++BOT_X];
				BOT_DIR=(nextSquare.direction2 &&
				(nextSquare.direction2===RIGHT||nextSquare.direction2===LEFT))?nextSquare.direction2:nextSquare.direction
			}break;
			case DOWN:{
				nextSquare = gameGrid[++BOT_Y][BOT_X];
				BOT_DIR=(nextSquare.direction2 &&
				(nextSquare.direction2===UP||nextSquare.direction2===DOWN))?nextSquare.direction2:nextSquare.direction
			}break;
		}
		if (nextSquare.direction!==undefined||nextSquare.type==="EXIT") {
			switch (nextSquare.type) {
				case "BRANCH":{
					//console.log("Branch found")
					if (BOT_TAPE[0]===nextSquare.color1) {
						//console.log("Matches color1")
						//Move towards left side of the branch.
						BOT_DIR = LeftOf(nextSquare.direction)
						ConsumeTape()
					} else
					if (BOT_TAPE[0]===nextSquare.color2) {
						//console.log("Matches color2")
						//Move towards left side of the branch.
						BOT_DIR = RightOf(nextSquare.direction)
						ConsumeTape()
					}
				}break;
				case "WRITER":{
					if (nextSquare.overwrite) {
						OverwriteTape(nextSquare.color)
					} else {
						AppendTape(nextSquare.color)
					}
					BOT_DIR = nextSquare.direction
				}break;
				case "EXIT":{
					gameState=FINISH
					BOT_STATE=DONE
				}break;
			}
			//console.log("Direction is now "+BOT_DIR)
		} else {
			gameState = REVIEWING
			BOT_STATE = DEAD
		}
		if (!testing){renderGame()}
	}
}

function resetBot(x,y,state,tape) {
	gameState=state
	BOT_STATE = ALIVE
	BOT_DIR = RIGHT
	BOT_TAPE=tape
	placeBot(x,y)
}

function placeBot(x,y) {
	BOT_X = x
	BOT_Y = y
}

function setupGame() {
	canvas = document.createElement("CANVAS");
	canvas.style.width="100%"
	canvas.style.height="100%"
	document.getElementById("game").appendChild(canvas)
	
	//gameGrid = [...createGrid(5,5)]
}

function loadLevel(level,botx,boty) {
	placeBot(botx,boty)
	gameGrid = deepCopy(level)
}

function loadStage(stage) {
	//gameGrid=deepCopy(stage.level)
	loadLevel(stage.level,stage.start.x,stage.start.y)
	gameStage=stage
}

function deepCopy(arr) {
	var newarr = []
	for (var i=0;i<arr.length;i++) {
		newarr[i] = []
		for (var j=0;j<arr[i].length;j++) {
			newarr[i][j]={...arr[i][j]}
		}
	}
	return newarr
}

function step() {
	if (gameState===RUNNING) {
		runBot()
	}
}

function renderGame() {
	var displayGrid = []
	displayGrid = deepCopy(gameGrid)
	if (BOT_X!==-1&&BOT_Y!==-1) {
		displayGrid[BOT_Y][BOT_X]["BOT"]=true
	}
	console.log("Tape: "+BOT_TAPE)
	console.log(displayGrid)
}

function draw() {
	var ctx = canvas.getContext("2d")
	ctx.fillStyle="#FFF"
	ctx.fillRect(0,0,canvas.width,canvas.height)
	ctx.beginPath();
	
	ctx.stroke();
}

function ConsumeTape() {
	BOT_TAPE=BOT_TAPE.substring(1)
}
function AppendTape(col) {
	BOT_TAPE+=col
}
function OverwriteTape(col) {
	BOT_TAPE=col+BOT_TAPE.substring(1)
}

function LeftOf(dir) {
	return (dir+1)%4
}
function RightOf(dir) {
	if (dir===0) {dir=4}
	return (dir-1)%4
}