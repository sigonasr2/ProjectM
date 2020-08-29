var canvas;

const WAITING = 0;
const RUNNING = 1;
const REVIEWING = 2;

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

const RED = 0;
const BLUE = 1;
const GREEN = 2;
const YELLOW = 3;
const PURPLE = 4;
const PINK = 5;
const BLACK = 6;
const GRAY = 7;

const ALIVE = 0;
const DEAD = 1;

var BOT_X = -1
var BOT_Y = -1
var BOT_DIR = RIGHT
var BOT_STATE = ALIVE
var BOT_TAPE = [{color:RED},{color:BLUE}]

var BELTDOWN = {type:"BELT",direction:DOWN/*,direction2 - defines a secondary direction. For two belts at once.*/}
var BELTRIGHT = {type:"BELT",direction:RIGHT}
var BELTUP = {type:"BELT",direction:UP}
var BELTLEFT = {type:"BELT",direction:LEFT}
var BRANCHDOWN = {type:"BRANCH",direction:DOWN,color1:RED,color2:BLUE} //color 1 points left, color 2 points right
var BRANCHLEFT = {type:"BRANCH",direction:LEFT,color1:RED,color2:BLUE}
var BRANCHRIGHT = {type:"BRANCH",direction:RIGHT,color1:RED,color2:BLUE}
var BRANCHUP = {type:"BRANCH",direction:UP,color1:RED,color2:BLUE}
var WRITERDOWN = {type:"WRITER",direction:DOWN,color1:RED,color2:BLUE} //color 1 points left, color 2 points right
var WRITERLEFT = {type:"WRITER",direction:LEFT,color1:RED,color2:BLUE}
var WRITERRIGHT = {type:"WRITER",direction:RIGHT,color1:RED,color2:BLUE}
var WRITERUP = {type:"WRITER",direction:UP,color1:RED,color2:BLUE}


var lastGameUpdate = 0;
var gameSpeed = 1000/1;

var gameState=RUNNING;

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

var gameGrid= []

function createGrid(width,height) {
	var grid = []
	for (var i=0;i<width;i++) {
		var row = []
		for (var j=0;j<height;j++) {
			row.push({})
		}
		grid.push(row)
	}
	return grid
}

function runBot() {
	//console.log(new Date().getTime())
	if (lastGameUpdate<new Date().getTime()) {
		//console.log("Update")
		lastGameUpdate=new Date().getTime()+gameSpeed
		
		var nextSquare = {}
		switch (BOT_DIR) {
			case UP:{nextSquare = gameGrid[--BOT_Y][BOT_X];}break;
			case LEFT:{nextSquare = gameGrid[BOT_Y][--BOT_X];}break;
			case RIGHT:{nextSquare = gameGrid[BOT_Y][++BOT_X];}break;
			case DOWN:{nextSquare = gameGrid[++BOT_Y][BOT_X];}break;
		}
		if (nextSquare.direction!==undefined) {
			
			if (nextSquare.type==="BRANCH") {
				//console.log("Branch found")
				if (BOT_TAPE[0].color===nextSquare.color1) {
					console.log("Matches color1")
					//Move towards left side of the branch.
					BOT_DIR = LeftOf(nextSquare.direction)
					ConsumeTape()
				} else
				if (BOT_TAPE[0].color===nextSquare.color2) {
					console.log("Matches color2")
					//Move towards left side of the branch.
					BOT_DIR = RightOf(nextSquare.direction)
					ConsumeTape()
				}
			} else {
				BOT_DIR = nextSquare.direction
			}
			console.log("Direction is now "+BOT_DIR)
		} else {
			gameState = REVIEWING
			BOT_STATE = DEAD
		}
		renderGame()
	}
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
	BOT_TAPE.shift()
}

function LeftOf(dir) {
	return (dir+1)%4
}
function RightOf(dir) {
	if (dir===0) {dir=4}
	return (dir-1)%4
}

setupGame();
loadLevel(LEVEL2,0,2)
setInterval(()=>{
	step()
	draw()
},1000/60)
console.log("Running")