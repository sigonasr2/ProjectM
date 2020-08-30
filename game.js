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

var DEF_BRANCHDOWN_RB = {img:IMAGE_BRANCH,color1:RED,color2:BLUE}
var DEF_BRANCHDOWN_BR = {img:IMAGE_BRANCH,color1:BLUE,color2:RED}
var DEF_BRANCHDOWN_GY = {img:IMAGE_BRANCH,color1:GREEN,color2:YELLOW}
var DEF_BRANCHDOWN_YG = {img:IMAGE_BRANCH,color1:YELLOW,color2:GREEN}
var DEF_BRANCHDOWN_PPI = {img:IMAGE_BRANCH,color1:PURPLE,color2:PINK}
var DEF_BRANCHDOWN_PIP = {img:IMAGE_BRANCH,color1:PINK,color2:PURPLE}
var DEF_BRANCHDOWN_BLGR = {img:IMAGE_BRANCH,color1:BLACK,color2:GRAY}
var DEF_BRANCHDOWN_GRBL = {img:IMAGE_BRANCH,color1:GRAY,color2:BLACK}


var GRID_W = 32
var GRID_H = 32
var GRID_X = 20
var GRID_Y = 20

var LAST_MOUSE_X=0;
var LAST_MOUSE_Y=0;

var SUBMENU = {
	visible:true,
	width:0,
	height:0,
	buttons:[]
}

var BUTTON_SELECTED = undefined

var CONVEYOR_BUILD_BUTTON = {img:IMAGE_CONVEYOR,x:-1,y:-1,w:-1,h:-1}
var BRANCH_BUILD_BUTTON = {img:IMAGE_BRANCH,x:-1,y:-1,w:-1,h:-1}
var WRITER_BUILD_BUTTON = {img:IMAGE_WRITER,x:-1,y:-1,w:-1,h:-1}

var MENU = {
	visible:true,
	buttons:[CONVEYOR_BUILD_BUTTON,BRANCH_BUILD_BUTTON,WRITER_BUILD_BUTTON]
}


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
		//if (!testing){renderGame()}
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
	canvas = document.createElement("canvas");
	canvas.width=568
	canvas.height=320
	document.getElementById("game").appendChild(canvas)
	canvas.addEventListener("mousemove",updateMouse)
	canvas.addEventListener("touchmove",updateMouse)
	canvas.addEventListener("touchstart",clickEvent)
	canvas.addEventListener("touchend",releaseEvent)
	//gameGrid = [...createGrid(5,5)]
}

function clickEvent(e) {
}

function releaseEvent(e) {
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

function updateMouse(e) {
	//console.log(getMousePos(canvas,e))
	e.preventDefault()
	var mousepos = getMousePos(canvas,e)
	LAST_MOUSE_X=mousepos.x
	LAST_MOUSE_Y=mousepos.y
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	if (evt.changedTouches) {
		return {
		  x: evt.changedTouches[0].clientX - rect.left,
		  y: evt.changedTouches[0].clientY - rect.top
		};
	} else {
		return {
		  x: evt.clientX - rect.left,
		  y: evt.clientY - rect.top
		};
	}
}

function renderGame() {
	var displayGrid = []
	displayGrid = deepCopy(gameGrid)
	if (BOT_X!==-1&&BOT_Y!==-1) {
		displayGrid[BOT_Y][BOT_X]["BOT"]=true
	}
	/*console.log("Tape: "+BOT_TAPE)
	console.log(displayGrid)*/
}

function colorToHex(r,g,b) {
	function hex(col) {
		function toHex(val) {
			switch (Math.floor(val)) {
				case 10:{
					return "a";
				}break;
				case 11:{
					return "b";
				}break;
				case 12:{
					return "c";
				}break;
				case 13:{
					return "d";
				}break;
				case 14:{
					return "e";
				}break;
				case 15:{
					return "f";
				}break;
				default:{
					return String(Math.floor(val));
				}
			}
		}
		var placeValue1=col%16;
		var placeValue2=col/16;
		return toHex(placeValue2)+toHex(placeValue1)
	}
	return "#"+hex(r)+hex(g)+hex(b);
}

function drawImage(x,y,img,ctx,degrees){
    //context.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(degrees*Math.PI/180);
    ctx.drawImage(img,-img.width/2,-img.height/2);
    ctx.restore();
}

function draw() {
	var ctx = canvas.getContext("2d")
	if (Math.random()<0.01) {
		ctx.fillStyle="#a3adab"
	} else {
		ctx.fillStyle="#b5c4c1"
	}
	ctx.fillRect(0,0,canvas.width,canvas.height)
	renderGame()
	for (var y=0;y<=gameGrid.length;y++) {
		ctx.moveTo(GRID_X, GRID_Y+GRID_H*y);
		ctx.lineTo(GRID_X+GRID_W*gameGrid.length, GRID_Y+GRID_H*y);
	}
	for (var x=0;x<=gameGrid.length;x++) {
		ctx.moveTo(GRID_X+GRID_W*x, GRID_Y);
		ctx.lineTo(GRID_X+GRID_W*x, GRID_Y+GRID_H*gameGrid.length);
	}
	ctx.fillStyle="#000000"
	ctx.stroke();
	//drawImage(0,0,IMAGE_CONVEYOR,ctx,0)
	//drawImage(LAST_MOUSE_X,LAST_MOUSE_Y,IMAGE_ARROW,ctx,0)
	RenderSubmenu(ctx)
	RenderMenu(ctx)
}

function RenderIcon(x,y,ctx,icon_definition,rot=0) {
	drawImage(
		x+icon_definition.img.width/2,
		y+icon_definition.img.height/2,
		icon_definition.img,ctx,rot)
	switch (icon_definition.img) {
		case IMAGE_BRANCH:{
		drawImage(
			x+icon_definition.img.width/2,
			y+icon_definition.img.height/2,
			IMAGE_ARROW,ctx,rot)
		drawImage(
			x+icon_definition.img.width/2,
			y+icon_definition.img.height/2,
			IMAGE_ARROW,ctx,rot+180)
		}break;
	}
}

function RenderSubmenu(ctx) {
	if (SUBMENU.visible) {
		ctx.fillStyle="#76abab"
		var submenuRows = SUBMENU.buttons.length/3
		var submenuCols = 3
		ctx.fillRect(0,canvas.height*0.8-submenuRows*48-16,submenuCols*48+16,submenuRows*48+16)
	}
}

function RenderMenu(ctx) {
	if (MENU.visible) {
		ctx.fillStyle="#20424a"
		ctx.fillRect(0,canvas.height*0.8,canvas.width,canvas.height*0.2)
		var buttonX = 16
		for (var button of MENU.buttons) {
			AddButton(button.img,buttonX,canvas.height*0.8+16,ctx,button,0)
			buttonX+=48
		}
	}
}

function AddButton(img,x,y,ctx,button,rot=0) {
	ctx.fillStyle="#b5b5b5"
	ctx.fillRect(x,y,32,32)
	button.x=x
	button.y=y
	button.w=32
	button.h=32
	drawImage(x+button.img.width/2,y+button.img.height/2,img,ctx,rot)
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