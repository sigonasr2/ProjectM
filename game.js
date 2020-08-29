var canvas;

const WAITING = 0;
const RUNNING = 1;

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

var BOT_X = 0
var BOT_Y = 0
var BOT_DIR = RIGHT

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

var gameState=WAITING;

var LEVEL1 = [
	[{},{},{...BELTDOWN},{...BELTLEFT},{...BELTLEFT},],
	[{},{},{},{},BELTUP,],
	[{},{...BELTDOWN},{},{},{...BELTUP},],
	[{},{...BELTRIGHT},{...BELTRIGHT},{...BELTRIGHT},{...BELTUP},],
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
			case UP:{nextSquare = grid[y-1][x];BOT_Y--}break;
			case LEFT:{nextSquare = grid[y][x-1];BOT_X--}break;
			case RIGHT:{nextSquare = grid[y][x+1];BOT_X++}break;
			case DOWN:{nextSquare = grid[y+1][x];BOT_Y++}break;
		}
		if (nextSquare.direction) {
			BOT_DIR = nextSquare.direction
		}
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
	
	gameGrid = [...createGrid(5,5)]
	placeBot(0,2)
	console.log(gameGrid)
}

function step() {
	if (gameState===RUNNING) {
		runBot()
	}
}

function draw() {
	var ctx = canvas.getContext("2d")
	ctx.fillStyle="#FFF"
	ctx.fillRect(0,0,canvas.width,canvas.height)
	ctx.beginPath();
	
	ctx.stroke();
}

setupGame();
setInterval(()=>{
	step()
	draw()
},1000/60)
console.log("Running")