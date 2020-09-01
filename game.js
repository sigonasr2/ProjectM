var canvas;
const WAITING = 0;
const RUNNING = 1;
const REVIEWING = 2;
const TESTING = 3;
const FINISH = 4;
const PAUSED = 5;

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

const RED = "R";
const BLUE = "B";
const GREEN = "G";
const YELLOW = "Y";
const PURPLE = "P";
const PINK = "p";
const BLACK = "b";
const GRAY = "g";

const ALIVE = 0;
const DEAD = 1;
const DONE = 2;

var BOT_X = -1
var BOT_Y = -1
var BOT_DIR = RIGHT
var BOT_STATE = ALIVE
var BOT_TAPE = "RB"
var BOT_QUEUE = []
var DELETEMODE = false

var BELTDOWN = {type:"BELT",direction:DOWN/*,direction2 - defines a secondary direction. For two belts at once.*/}
var BELTRIGHT = {type:"BELT",direction:RIGHT}
var BELTUP = {type:"BELT",direction:UP}
var BELTLEFT = {type:"BELT",direction:LEFT}
var BRANCHDOWN = {type:"BRANCH",direction:DOWN,color1:RED,color2:BLUE} //color 1 points clockwise(right), color 2 points counter-clockwise(left)
var BRANCHLEFT = {type:"BRANCH",direction:LEFT,color1:RED,color2:BLUE}
var BRANCHRIGHT = {type:"BRANCH",direction:RIGHT,color1:RED,color2:BLUE}
var BRANCHUP = {type:"BRANCH",direction:UP,color1:RED,color2:BLUE}
var WRITERDOWN = {type:"WRITER",direction:DOWN,color1:RED/*overwrite - if turned on, the writer overwrites the current tape position instead of appending.*/}
var WRITERLEFT = {type:"WRITER",direction:LEFT,color1:RED}
var WRITERRIGHT = {type:"WRITER",direction:RIGHT,color1:RED}
var WRITERUP = {type:"WRITER",direction:UP,color1:RED}

var DEF_BRANCHUP_RB = {img:IMAGE_BRANCH,color1:RED,color2:BLUE,type:"BRANCH"}
var DEF_BRANCHUP_BR = {img:IMAGE_BRANCH,color1:BLUE,color2:RED,type:"BRANCH"}
var DEF_BRANCHUP_GY = {img:IMAGE_BRANCH,color1:GREEN,color2:YELLOW,type:"BRANCH"}
var DEF_BRANCHUP_YG = {img:IMAGE_BRANCH,color1:YELLOW,color2:GREEN,type:"BRANCH"}
var DEF_BRANCHUP_PPI = {img:IMAGE_BRANCH,color1:PURPLE,color2:PINK,type:"BRANCH"}
var DEF_BRANCHUP_PIP = {img:IMAGE_BRANCH,color1:PINK,color2:PURPLE,type:"BRANCH"}
var DEF_BRANCHUP_BLGR = {img:IMAGE_BRANCH,color1:BLACK,color2:GRAY,type:"BRANCH"}
var DEF_BRANCHUP_GRBL = {img:IMAGE_BRANCH,color1:GRAY,color2:BLACK,type:"BRANCH"}
var DEF_WRITERRIGHT_R = {img:IMAGE_WRITER,color1:RED,type:"WRITER"}
var DEF_WRITERRIGHT_B = {img:IMAGE_WRITER,color1:BLUE,type:"WRITER"}
var DEF_WRITERRIGHT_G = {img:IMAGE_WRITER,color1:GREEN,type:"WRITER"}
var DEF_WRITERRIGHT_Y = {img:IMAGE_WRITER,color1:YELLOW,type:"WRITER"}
var DEF_WRITERRIGHT_P = {img:IMAGE_WRITER,color1:PURPLE,type:"WRITER"}
var DEF_WRITERRIGHT_PI = {img:IMAGE_WRITER,color1:PINK,type:"WRITER"}
var DEF_WRITERRIGHT_BL = {img:IMAGE_WRITER,color1:BLACK,type:"WRITER"}
var DEF_WRITERRIGHT_GR = {img:IMAGE_WRITER,color1:GRAY,type:"WRITER"}
var DEF_CONVEYOR = {img:IMAGE_CONVEYOR,type:"BELT"}


var GRID_W = 32
var GRID_H = 32
var GRID_X = 20
var GRID_Y = 20

var LAST_MOUSE_X=0;
var LAST_MOUSE_Y=0;

var ITEM_DIRECTION=RIGHT;

var dashOffset=0

var SUBMENU = {
	visible:false,
	width:0,
	height:0,
	buttons:[]
}

var BUTTON_SELECTED = undefined
var ITEM_SELECTED = undefined

var KEY_ROTATION_RIGHT = ["d","l","6","ArrowRight"]
var KEY_ROTATION_LEFT = ["a","h","4","ArrowLeft"]
var KEY_ROTATION_UP = ["w","k","8","ArrowUp"]
var KEY_ROTATION_DOWN = ["s","j","2","ArrowDown"]

var CONVEYOR_BUILD_BUTTON = {img:IMAGE_CONVEYOR,x:-1,y:-1,w:-1,h:-1,lastselected:DEF_CONVEYOR}
var BRANCH_BUILD_BUTTON = {img:IMAGE_BRANCH,x:-1,y:-1,w:-1,h:-1,submenu_buttons:[DEF_BRANCHUP_RB,DEF_BRANCHUP_BR,DEF_BRANCHUP_GY,DEF_BRANCHUP_YG,DEF_BRANCHUP_PPI,DEF_BRANCHUP_PIP,DEF_BRANCHUP_BLGR,DEF_BRANCHUP_GRBL],lastselected:undefined}
var WRITER_BUILD_BUTTON = {img:IMAGE_WRITER,x:-1,y:-1,w:-1,h:-1,submenu_buttons:[DEF_WRITERRIGHT_R,DEF_WRITERRIGHT_B,DEF_WRITERRIGHT_G,DEF_WRITERRIGHT_Y,DEF_WRITERRIGHT_P,DEF_WRITERRIGHT_PI,DEF_WRITERRIGHT_BL,DEF_WRITERRIGHT_GR],lastselected:undefined}
var ROTATE_CLOCKWISE_BUTTON = {img:IMAGE_ROTATE_CLOCKWISE,x:-1,y:-1,w:-1,h:-1,cb:rotateClockwise
}
var ROTATE_COUNTERCLOCKWISE_BUTTON = {img:IMAGE_ROTATE_COUNTERCLOCKWISE,x:-1,y:-1,w:-1,h:-1,cb:rotateCounterClockwise
}
var WRITER_BUILD_BUTTON = {img:IMAGE_WRITER,x:-1,y:-1,w:-1,h:-1,submenu_buttons:[DEF_WRITERRIGHT_R,DEF_WRITERRIGHT_B,DEF_WRITERRIGHT_G,DEF_WRITERRIGHT_Y,DEF_WRITERRIGHT_P,DEF_WRITERRIGHT_PI,DEF_WRITERRIGHT_BL,DEF_WRITERRIGHT_GR],lastselected:undefined}


var PLAY_BUTTON = {img:IMAGE_PLAY,x:-1,y:-1,w:-1,h:-1,cb:runGameSimulation
}
var PAUSE_BUTTON = {img:IMAGE_PAUSE,x:-1,y:-1,w:-1,h:-1,cb:pauseGameSimulation
}
var RESET_BUTTON = {img:IMAGE_RESET,x:-1,y:-1,w:-1,h:-1,cb:resetSimulation
}
var DELETE_BUTTON = {img:IMAGE_DELETE,x:-1,y:-1,w:-1,h:-1,cb:toggleDeleteMode
}

var MENU = {
	visible:true,
	buttons:[CONVEYOR_BUILD_BUTTON,BRANCH_BUILD_BUTTON,WRITER_BUILD_BUTTON,ROTATE_COUNTERCLOCKWISE_BUTTON,ROTATE_CLOCKWISE_BUTTON,DELETE_BUTTON,PLAY_BUTTON,RESET_BUTTON]
}

function runGameSimulation(){
	gameState=TESTING
	generateBotQueue()
	//console.log(BOT_QUEUE)
	if (BOT_QUEUE.length>0) {
		BOT_TAPE=BOT_QUEUE[0]
	} else {
		BOT_TAPE="BR"
	}
	BOT_STATE=ALIVE
	gameState=WAITING
	BOT_X=gameStage.start.x
	BOT_Y=gameStage.start.y
	BOT_DIR=RIGHT
	gameState=RUNNING
	for (var i=0;i<MENU.buttons.length;i++) {
		if (MENU.buttons[i].img===IMAGE_PLAY) {
			MENU.buttons[i]=PAUSE_BUTTON
			break;
		}
	}
}

function endARound() {
	for (var i=0;i<MENU.buttons.length;i++) {
		if (MENU.buttons[i].img===IMAGE_PAUSE) {
			MENU.buttons[i]=PLAY_BUTTON
			break;
		}
	}
}

function pauseGameSimulation(){
	gameState=PAUSED
	endARound()
}
function resetSimulation(){
	BOT_STATE=ALIVE
	gameState=WAITING
	BOT_X=gameStage.start.x
	BOT_Y=gameStage.start.y
	BOT_DIR=RIGHT
	endARound()
}
function toggleDeleteMode(){
	DELETEMODE=!DELETEMODE
	if (DELETEMODE) {
		ITEM_SELECTED=undefined
		document.body.style.cursor="url('delete_cursor.png') 8 8,auto"
	} else {
		document.body.style.cursor="url('cursor.png') 8 8,auto"
	}
}

function rotateClockwise() {
	ITEM_DIRECTION=(ITEM_DIRECTION+1)%4
}
function rotateCounterClockwise() {
	ITEM_DIRECTION=(ITEM_DIRECTION-1);
	if(ITEM_DIRECTION<0){ITEM_DIRECTION=3}
}


var lastGameUpdate = 0;
var gameSpeed = 1000/1;

var gameState=WAITING;
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
			if (tape.length===0) {
				return false;
			}
			for (var i=0;i<tape.length;i++) {
				if (tape[i]!=="B") {
					return false;
				}
			}
			return true;
		}
	}

var gameGrid = []

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
	BOT_QUEUE=[]
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

function setNextSquare(offsetX,offsetY) {
	if (gameGrid[BOT_Y+offsetY]!==undefined) {
		var nextSquare = gameGrid[BOT_Y+offsetY][BOT_X+offsetX];
		BOT_X+=offsetX
		BOT_Y+=offsetY
		return nextSquare
	} else {
		gameState = REVIEWING
		BOT_STATE = DEAD
		return undefined
	}
}

function runBot(testing) {
	//console.log(new Date().getTime())
	if (lastGameUpdate<new Date().getTime()||testing) {
		lastGameUpdate=new Date().getTime()+gameSpeed
		//console.log("Update")
		var nextSquare = {}
		switch (BOT_DIR) {
			case UP:{
				nextSquare = setNextSquare(0,-1)
				if (nextSquare!==undefined) {
					BOT_DIR=(nextSquare.direction2 &&
						(nextSquare.direction2===UP||nextSquare.direction2===DOWN))?nextSquare.direction2:nextSquare.direction
				}
			}break;
			case LEFT:{
				nextSquare = setNextSquare(-1,0)
				if (nextSquare!==undefined) {
					BOT_DIR=(nextSquare.direction2 &&
					(nextSquare.direction2===RIGHT||nextSquare.direction2===LEFT))?nextSquare.direction2:nextSquare.direction
				}
			}break;
			case RIGHT:{
				nextSquare = setNextSquare(1,0);
				if (nextSquare!==undefined) {
					BOT_DIR=(nextSquare.direction2 &&
					(nextSquare.direction2===RIGHT||nextSquare.direction2===LEFT))?nextSquare.direction2:nextSquare.direction
				}
			}break;
			case DOWN:{
				nextSquare = setNextSquare(0,1)
				if (nextSquare!==undefined) {
					BOT_DIR=(nextSquare.direction2 &&
					(nextSquare.direction2===UP||nextSquare.direction2===DOWN))?nextSquare.direction2:nextSquare.direction
				}
			}break;
		}
		if (nextSquare!==undefined&&(nextSquare.direction!==undefined||nextSquare.type==="EXIT")) {
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
						OverwriteTape(nextSquare.color1)
					} else {
						AppendTape(nextSquare.color1)
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
			endARound()
		}
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
	canvas.addEventListener("mousedown",clickEvent)
	canvas.addEventListener("mouseup",releaseEvent)
	canvas.addEventListener("touchmove",updateMouse)
	canvas.addEventListener("touchstart",clickEvent)
	canvas.addEventListener("touchend",releaseEvent)
	document.addEventListener("keydown",keydownEvent)
	loadStage(STAGE2)
}

function CheckKeys(e,keys) {
	for (var key of keys) {
		if (key===e.key) {
			return true
		}
	}
	return false
}

function keydownEvent(e) {
	if (CheckKeys(e,KEY_ROTATION_RIGHT)) {
		ITEM_DIRECTION=RIGHT
	}
	if (CheckKeys(e,KEY_ROTATION_LEFT)) {
		ITEM_DIRECTION=LEFT
	}
	if (CheckKeys(e,KEY_ROTATION_UP)) {
		ITEM_DIRECTION=UP
	}
	if (CheckKeys(e,KEY_ROTATION_DOWN)) {
		ITEM_DIRECTION=DOWN
	}
}

function mouseOverButton(canvas,e,button) {
	return (getMousePos(e).x>=button.x &&
			getMousePos(e).x<=button.x+button.w &&
			getMousePos(e).y>=button.y &&
			getMousePos(e).y<=button.y+button.h)
}

function clickEvent(e) {
	//console.log(MENU.buttons)
	if (MENU.visible) {
		for (var button of MENU.buttons) {
			if (mouseOverButton(canvas,e,button)) {
				if (button.cb!==undefined) {
					button.cb()
					return;
				} else {
					DELETEMODE=false
					document.body.style.cursor="url('cursor.png') 8 8,auto"
					if (button.submenu_buttons&&button.submenu_buttons.length>0) {
						BUTTON_SELECTED=button;
						SUBMENU.visible=true;
						SUBMENU.buttons=[]
						var index = 0;
						for (var button2 of BUTTON_SELECTED.submenu_buttons) {
							var buttonX = ((index%3)*48)+16
							var buttonY = canvas.height*0.8-(Math.floor(index/3)*48)-40
							SUBMENU.buttons.push({def:button2,img:button2.img,x:buttonX,y:buttonY,w:32,h:32})
							index++;
						}
					}
					ITEM_SELECTED=button.lastselected
					//console.log(button)
					return
				}
			}
		}
	}
	
	//console.log(getGridCoords(getMousePos(e)))
	if (ITEM_SELECTED!==undefined||DELETEMODE) {
		var clickCoords = getGridCoords(getMousePos(e))
		if (clickCoords.x>=0&&clickCoords.y>=0&&clickCoords.y<gameGrid.length&&clickCoords.x<gameGrid[clickCoords.y].length) {
			if (DELETEMODE) {
				deleteObject(clickCoords)
			} else {
				placeObject(clickCoords,ITEM_SELECTED)
			}
			//console.log(gameGrid)
		}
	}
}

function deleteObject(coords,def) {
	gameGrid[coords.y][coords.x]={}
}
function placeObject(coords,def) {
	var newObj={...def,direction:ITEM_DIRECTION}
	gameGrid[coords.y][coords.x]=newObj
}

function getGridCoords(pos) {
	var x = Math.round((pos.x-GRID_X)/GRID_W-1)
	var y = Math.round((pos.y-GRID_Y)/GRID_H-1)
	return {x:x,y:y}
}

function releaseEvent(e) {
	if (SUBMENU.visible) {
		for (var button of SUBMENU.buttons) {
			if (mouseOverButton(canvas,e,button)) {
				ITEM_SELECTED=button.def
				BUTTON_SELECTED.lastselected=button.def
				SUBMENU.visible=false
				return
			}
		}
		SUBMENU.visible=false
	}
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
	dashOffset+=0.3
	if (gameState===RUNNING) {
		runBot()
	}
}

function updateMouse(e) {
	//console.log(getMousePos(e))
	e.preventDefault()
	var mousepos = getMousePos(e)
	LAST_MOUSE_X=mousepos.x
	LAST_MOUSE_Y=mousepos.y
}

function getMousePos(e) {
	var rect = canvas.getBoundingClientRect();
	if (e.changedTouches) {
		return {
		  x: e.changedTouches[0].clientX - rect.left,
		  y: e.changedTouches[0].clientY - rect.top
		};
	} else {
		return {
		  x: e.clientX - rect.left,
		  y: e.clientY - rect.top
		};
	}
}

function renderGame(ctx) {
	ctx.lineWidth=1
	ctx.strokeStyle="#000000"
	ctx.setLineDash([])
	for (var y=0;y<=gameGrid.length+1;y++) {
		ctx.moveTo(GRID_X, GRID_Y+GRID_H*y);
		ctx.lineTo(GRID_X+GRID_W*(gameGrid.length+1), GRID_Y+GRID_H*y);
	}
	for (var x=0;x<=gameGrid.length+1;x++) {
		ctx.moveTo(GRID_X+GRID_W*x, GRID_Y);
		ctx.lineTo(GRID_X+GRID_W*x, GRID_Y+GRID_H*(gameGrid.length+1));
	}
	ctx.stroke();
	for (var y=0;y<gameGrid.length;y++) {
		for (var x=0;x<gameGrid[y].length;x++) {
			if (gameGrid[y][x].img!==undefined) {
				RenderIcon(GRID_X+GRID_W*x+16,GRID_Y+GRID_H*y+16,ctx,gameGrid[y][x],gameGrid[y][x].direction,undefined,{x:x,y:y})
			}
			if (BOT_X!==undefined) {
				drawImage(
				GRID_X+GRID_W*BOT_X+16+GRID_W/2,
				GRID_Y+GRID_H*BOT_Y+16+GRID_H/2,
				IMAGE_BOT,ctx,0*90)
			}
		}
	}
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
		ctx.fillStyle="rgba(63, 73, 71, 0.5)"
		ctx.globalAlpha=0.5
		ctx.fillRect(0,0,canvas.width,canvas.height)
	} else {
		ctx.fillStyle="#b5c4c1"
		ctx.globalAlpha=1.0
		ctx.fillRect(0,0,canvas.width,canvas.height)
		renderGame(ctx)
		
		if (ITEM_SELECTED) {
			RenderIcon(LAST_MOUSE_X-16,LAST_MOUSE_Y-16,ctx,ITEM_SELECTED,ITEM_DIRECTION)
		}
		//drawImage(0,0,IMAGE_CONVEYOR,ctx,0)
		//drawImage(LAST_MOUSE_X,LAST_MOUSE_Y,IMAGE_ARROW,ctx,0)
		RenderSubmenu(ctx)
		RenderMenu(ctx)
		RenderGameInfo(ctx)
	}
}

function RenderGameInfo(ctx) {
	if (MENU.visible) {
		ctx.fillStyle="#20424a"
		ctx.fillRect(canvas.width*0.75,0,canvas.width,canvas.height*0.8)
		RenderTape(canvas.width*0.75+8,8,canvas.width*0.25-16,ctx)
	}
}

function RenderTape(x,y,width,ctx) {
	var xOffset=0
	var yOffset=0
	for (var i=0;i<BOT_TAPE.length;i++) {
		switch (BOT_TAPE[i]) {
			case RED:{
				drawImage(x+xOffset+16,y+yOffset+16,IMAGE_DOT_R,ctx,0)
			}break;
			case BLUE:{
				drawImage(x+xOffset+16,y+yOffset+16,IMAGE_DOT_B,ctx,0)
			}break;
			case GREEN:{
				drawImage(x+xOffset+16,y+yOffset+16,IMAGE_DOT_G,ctx,0)
			}break;
			case YELLOW:{
				drawImage(x+xOffset+16,y+yOffset+16,IMAGE_DOT_Y,ctx,0)
			}break;
			case PURPLE:{
				drawImage(x+xOffset+16,y+yOffset+16,IMAGE_DOT_P,ctx,0)
			}break;
			case PINK:{
				drawImage(x+xOffset+16,y+yOffset+16,IMAGE_DOT_PI,ctx,0)
			}break;
			case BLACK:{
				
				drawImage(x+xOffset+16,y+yOffset+16,IMAGE_DOT_BL,ctx,0)
			}break;
			case GRAY:{
				
				drawImage(x+xOffset+16,y+yOffset+16,IMAGE_DOT_GR,ctx,0)
			}break;
		}
		xOffset+=24;
		if (xOffset>width-24) {
			xOffset=0;
			yOffset+=24;
		}
	}
}

function createVerticalGradient(x,y,up,ctx) {
	var gradient = ctx.createLinearGradient(x, y+32*((up)?1:0), x, y+32*((up)?0:1));
		gradient.addColorStop(0,"rgb(124,162,157)")
		gradient.addColorStop(0.31,"black")
		gradient.addColorStop(0.6,"rgb(124,162,157)")
		gradient.addColorStop(0.61,"black")
		gradient.addColorStop(0.9,"rgb(124,162,157)")
		gradient.addColorStop(0.91,"white")
		gradient.addColorStop(1,"white")
	return gradient
}

function createHorizontalGradient(x,y,right,ctx) {
	var gradient = ctx.createLinearGradient(x+32*((right)?0:1), y, x+32*((right)?1:0), y);
		gradient.addColorStop(0,"rgb(124,162,157)")
		gradient.addColorStop(0.31,"black")
		gradient.addColorStop(0.6,"rgb(124,162,157)")
		gradient.addColorStop(0.61,"black")
		gradient.addColorStop(0.9,"rgb(124,162,157)")
		gradient.addColorStop(0.91,"white")
		gradient.addColorStop(1,"white")
	return gradient
}

function DrawSingleConveyor(x,y,dir,ctx) {
	ctx.lineWidth = 16;
	ctx.lineCap = "square"
	ctx.strokeStyle="rgb(124,162,157)"
	ctx.setLineDash([])
	if (dir===LEFT||dir===RIGHT) {
		ctx.beginPath()
		ctx.moveTo(x+8,y+16)
		ctx.lineTo(x+24,y+16)
		ctx.stroke()
		ctx.setLineDash([5,5])
		ctx.lineDashOffset = -dashOffset*((dir===LEFT)?-1:1);
		ctx.strokeStyle=createHorizontalGradient(x,y,dir===RIGHT,ctx)
		ctx.lineWidth = 3.5;
		ctx.beginPath()
		ctx.moveTo(x+2,y+16)
		ctx.lineTo(x+30,y+16)
		ctx.stroke()
	} else {
		ctx.beginPath()
		ctx.moveTo(x+16,y+8)
		ctx.lineTo(x+16,y+24)
		ctx.stroke()
		ctx.strokeStyle="rgb(34,62,57)"
		ctx.setLineDash([5,5])
		ctx.lineDashOffset = -dashOffset*((dir===DOWN)?1:-1);
		ctx.strokeStyle=createVerticalGradient(x,y,dir===UP,ctx)
		ctx.lineWidth = 3.5;
		ctx.beginPath()
		ctx.moveTo(x+16,y+2)
		ctx.lineTo(x+16,y+30)
		ctx.stroke()
	}
}

function GetOppositeDirection(dir) {
	switch (dir) {
		case UP:{return DOWN}
		case DOWN:{return UP}
		case LEFT:{return RIGHT}
		case RIGHT:{return LEFT}
	}
}

function DrawConnectedConveyor(x,y,ctx,connections,dir,pass=0) {
	ctx.lineWidth = 15;
	ctx.lineCap = "round"
	ctx.strokeStyle="rgb(124,162,157)"
	switch (Object.keys(connections).length) {
		case 0:{
			DrawSingleConveyor(x,y,dir,ctx)
		}break;
		default:{
			ctx.lineWidth = 15;
			ctx.lineCap = "square"
			ctx.strokeStyle="rgb(124,162,157)"
			ctx.setLineDash([])
			ctx.beginPath()
			ctx.moveTo(x+16,y+16)
			var endingPoint={x:0,y:0}
			switch (dir) {
				case UP:{startingPoint={x:0,y:-12};endingPoint={x:0,y:-14}}break;
				case DOWN:{startingPoint={x:0,y:12};endingPoint={x:0,y:14}}break;
				case RIGHT:{startingPoint={x:12,y:0};endingPoint={x:14,y:0}}break;
				case LEFT:{startingPoint={x:-12,y:0};endingPoint={x:-14,y:0}}break;
			}
			ctx.moveTo(x+16+startingPoint.x,y+16+startingPoint.y)
			ctx.lineTo(x+16+endingPoint.x,y+16+endingPoint.y)
			if (pass===0) {ctx.stroke();}
			for (var connection of Object.keys(connections)) {
				var startingPoint={x:x,y:y}
				switch (Number(connection)) {
					case UP:{startingPoint={x:x+16,y:y+8}}break;
					case DOWN:{startingPoint={x:x+16,y:y+24}}break;
					case RIGHT:{startingPoint={x:x+24,y:y+16}}break;
					case LEFT:{startingPoint={x:x+8,y:y+16}}break;
				}
				ctx.lineWidth = 16;
				ctx.lineCap = "square"
				ctx.strokeStyle="rgb(124,162,157)"
				ctx.setLineDash([])
				ctx.beginPath()
				ctx.moveTo(startingPoint.x,startingPoint.y)
				ctx.lineTo(x+16,y+16)
				if (pass===0) {ctx.stroke()}
				ctx.setLineDash([5,5])
				ctx.lineDashOffset = -dashOffset*1;
				if (Number(connection)===RIGHT||Number(connection)===LEFT) {
					ctx.strokeStyle=createHorizontalGradient(x,y,Number(connection)===LEFT,ctx)
				} else {
					ctx.strokeStyle=createVerticalGradient(x,y,Number(connection)===UP,ctx)
				}
				ctx.lineWidth = 3.5;
				ctx.beginPath()
				startingPoint={x:x,y:y}
				switch (Number(connection)) {
					case UP:{startingPoint={x:x+16,y:y+2}}break;
					case DOWN:{startingPoint={x:x+16,y:y+30}}break;
					case RIGHT:{startingPoint={x:x+30,y:y+16}}break;
					case LEFT:{startingPoint={x:x+2,y:y+16}}break;
				}
				ctx.moveTo(startingPoint.x,startingPoint.y)
				ctx.lineTo(x+16,y+16)
				if (pass===1) {ctx.stroke()}
			}
			
			if (dir===RIGHT||dir===LEFT) {
				ctx.strokeStyle=createHorizontalGradient(x,y,dir===LEFT,ctx)
			} else {
				ctx.strokeStyle=createVerticalGradient(x,y,dir===UP,ctx)
			}
			ctx.setLineDash([5,5])
			ctx.lineWidth = 3.5;
			ctx.beginPath()
			switch (dir) {
				case UP:{startingPoint={x:0,y:-14}}break;
				case DOWN:{startingPoint={x:0,y:14}}break;
				case RIGHT:{startingPoint={x:14,y:0}}break;
				case LEFT:{startingPoint={x:-14,y:0}}break;
			}
			ctx.moveTo(x+16,y+16)
			ctx.lineTo(x+16+startingPoint.x,y+16+startingPoint.y)
			if (pass===1) {ctx.stroke();}
		}break;
	}
}

function RenderConveyor(x,y,ctx,icon_definition,dir=0,background=undefined,grid=undefined) {
	if (grid===undefined) {
		DrawSingleConveyor(x,y,dir,ctx)
	} else {
		var connections = {}
		if (grid.x>0) {if (gameGrid[grid.y][grid.x-1].direction===RIGHT){connections[LEFT]=true}}
		if (grid.x<gameGrid[grid.y].length-1) {if (gameGrid[grid.y][grid.x+1].direction===LEFT){connections[RIGHT]=true}}
		if (grid.y>0) {if (gameGrid[grid.y-1][grid.x].direction===DOWN){connections[UP]=true}}
		if (grid.y<gameGrid.length-1) {if (gameGrid[grid.y+1][grid.x].direction===UP){connections[DOWN]=true}}
		//console.log("Connections: "+JSON.stringify(connections))
		DrawConnectedConveyor(x,y,ctx,connections,dir)
		DrawConnectedConveyor(x,y,ctx,connections,dir,1)
	}
}

function RenderIcon(x,y,ctx,icon_definition,dir=0,background=undefined,renderToGrid=undefined) {
	if (background!==undefined) {
		ctx.fillStyle=background
		ctx.fillRect(x,y,32,32)
	}
	if (icon_definition.img===IMAGE_CONVEYOR) {
		RenderConveyor(x,y,ctx,icon_definition,dir,background,renderToGrid)
	} else {
		if (icon_definition.img===IMAGE_BRANCH) {
			drawImage(
				x+16,
				y+16,
				icon_definition.img,ctx,dir*90)
		} else {
			drawImage(
				x+16,
				y+16,
				icon_definition.img,ctx,dir*90-90)
		}
		switch (icon_definition.img) {
			case IMAGE_BRANCH:{
				drawImage(
					x+16,
					y+16,
					GetArrowImage(icon_definition.color1),ctx,dir*90+0)
				drawImage(
					x+16,
					y+16,
					GetArrowImage(icon_definition.color2),ctx,dir*90+180)
			}break;
			case IMAGE_WRITER:{
				drawImage(
					x+16,
					y+16,
					GetDotImage(icon_definition.color1),ctx,dir*90-90)
			}break;
		}
	}
}

function GetArrowImage(col) {
	switch (col) {
		case RED:{
			return IMAGE_ARROW_R
		}break;
		case BLUE:{
			return IMAGE_ARROW_B
		}break;
		case GREEN:{
			return IMAGE_ARROW_G
		}break;
		case YELLOW:{
			return IMAGE_ARROW_Y
		}break;
		case PURPLE:{
			return IMAGE_ARROW_P
		}break;
		case PINK:{
			return IMAGE_ARROW_PI
		}break;
		case BLACK:{
			return IMAGE_ARROW_BL
		}break;
		case GRAY:{
			return IMAGE_ARROW_GR
		}break;
	}
}

function GetDotImage(col) {
	switch (col) {
		case RED:{
			return IMAGE_DOT_R
		}break;
		case BLUE:{
			return IMAGE_DOT_B
		}break;
		case GREEN:{
			return IMAGE_DOT_G
		}break;
		case YELLOW:{
			return IMAGE_DOT_Y
		}break;
		case PURPLE:{
			return IMAGE_DOT_P
		}break;
		case PINK:{
			return IMAGE_DOT_PI
		}break;
		case BLACK:{
			return IMAGE_DOT_BL
		}break;
		case GRAY:{
			return IMAGE_DOT_GR
		}break;
	}
}

function RenderSubmenu(ctx) {
	if (SUBMENU.visible) {
		ctx.fillStyle="#76abab"
		var submenuRows = BUTTON_SELECTED.submenu_buttons.length/3
		var submenuCols = 3
		ctx.fillRect(0,canvas.height*0.8-submenuRows*48-16,submenuCols*48+16,submenuRows*48+16)
		var index = 0;
		for (var button of BUTTON_SELECTED.submenu_buttons) {
			var buttonX = ((index%3)*48)+16
			var buttonY = canvas.height*0.8-(Math.floor(index/3)*48)-40
			RenderIcon(buttonX,buttonY,ctx,button,ITEM_DIRECTION,(LAST_MOUSE_X>=buttonX&&LAST_MOUSE_X<=buttonX+32&&LAST_MOUSE_Y>=buttonY&&LAST_MOUSE_Y<=buttonY+32)?"#555555":"#b5b5b5")
			index++;
		}
	}
}

function RenderMenu(ctx) {
	if (MENU.visible) {
		ctx.fillStyle="#20424a"
		ctx.fillRect(0,canvas.height*0.8,canvas.width,canvas.height*0.2)
		var buttonX = 16
		var buttonY = canvas.height*0.8+16
		for (var button of MENU.buttons) {
			if (button.lastselected) {
				RenderIcon(buttonX,buttonY,ctx,button.lastselected,(button.cb===undefined)?ITEM_DIRECTION:0,"#b5b5b5")
			} else {
				AddButton(button.img,buttonX,buttonY,ctx,button,(button.cb===undefined)?ITEM_DIRECTION:0)
			}
			button.x=buttonX
			button.y=buttonY
			button.w=32
			button.h=32
			buttonX+=48
		}
	}
}

function AddButton(img,x,y,ctx,button,dir=0) {
	ctx.fillStyle="#b5b5b5"
	ctx.fillRect(x,y,32,32)
	if (img===IMAGE_WRITER) {
		drawImage(x+16,y+16,img,ctx,dir*90-90)
	} else {
		drawImage(x+16,y+16,img,ctx,dir*90)
	}
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