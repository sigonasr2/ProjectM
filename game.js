var canvas;

var currentSound = new Audio();

const GOODQUOTES=[
"Let the conversion begin...",
"All the bots, come to ME",
"Let's convert them ALL",
"What a fantastic machine you have built",
"I like it!",]
const BADQUOTES=[
"I smell a funny one here...",
"I have found a flaw!",
"How could you build me so disfunctionally?",
"???",
"You seemed to miss a step...",]

var TITLESCREENTIMELINE=new Date().getTime()

const TITLETIMELINE = [
				{time:0,cb:
					(ctx)=>{
						SCENE_DRAW=(ctx)=>{
							ctx.globalAlpha=Math.min((new Date().getTime()-TITLESCREENTIMELINE)/3000,1)
							ctx.drawImage(IMAGE_SIG,canvas.width/2-243,canvas.height/2-22)
						}
					}
				},
				{time:4000,cb:
					(ctx)=>{
						SCENE_DRAW=(ctx)=>{
							ctx.globalAlpha=Math.max(
							(7000-(new Date().getTime()-TITLESCREENTIMELINE))/3000
							,0)
							ctx.drawImage(IMAGE_SIG,canvas.width/2-243,canvas.height/2-22)
						}
					}
				},
				{time:4000,cb:
					(ctx)=>{
						currentSound.src="Super 8 Old Movie Projector - Gaming Sound Effect.mp3"
						currentSound.play()
					}
				},
				{time:7000,cb:
					(ctx)=>{
						SCENE_DRAW=(ctx)=>{
							SCENEALPHA=0
							if (Math.random()<=0.02) {
								ctx.globalAlpha=0.5
								ctx.drawImage(IMAGE_TITLE,canvas.width/2+Math.random()*640260,canvas.height/2+Math.random()*64-70)
							} else {
								ctx.globalAlpha=0.75+Math.random()*0.25
								ctx.drawImage(IMAGE_TITLE,canvas.width/2-260,canvas.height/2-70)
							}
						}
					}
				},
				{time:15000,cb:
					(ctx)=>{
						currentSound.src="Shostakovich_ Symphony No. 9.mp3"
						currentSound.loop=true
						currentSound.play()
						SCENE_DRAW=(ctx)=>{
							ctx.globalAlpha=0.9
							ctx.drawImage(IMAGE_TITLE,canvas.width/2-260,canvas.height/2-70)
							
							ctx.font="bold 48px 'Zilla Slab', serif"
							ctx.fillStyle="black"
							ctx.strokeStyle="white"
							ctx.textAlign = "center"
							ctx.fillText("- Click to Play -",canvas.width/2,canvas.height*0.9)
							ctx.strokeText("- Click to Play -",canvas.width/2,canvas.height*0.9)
						}
					}
				},
			]
			
var SCENEBACKGROUND = "black"
var SCENEALPHA = 1.0
			
var CURRENTTIMELINE = []
var SCENE_DRAW = ()=>{}

var FIRSTBOOT = true

const WAITING = 0;
const RUNNING = 1;
const REVIEWING = 2;
const TESTING = 3;
const FINISH = 4;
const PAUSED = 5;
const MAINMENU = 6;
const TITLE = 7;
const STARTUP = 8;
const INFO = 9;

var WAITINGTOFINISH=false

const ONE_TEST = -1;
const BLANK_TEST = -2;
const NORMAL_TEST = 0;
const EVEN_LENGTH_TEST = 1; //Only generate even length tapes.
const ODD_LENGTH_TEST = 3; //Only generates odd length tapes.
const BINARY_TEST = 4; //Generates valid binary numbers (never has a trailing R)
const BSTAGE2_TEST = 2;
const TWO_NUMBERS_TEST = 5; //Generates two binary numbers separated by a green dot.
const SUBSTRING_TEST = 6; //Generates two yellow dots to indicate a substring to cut out.
const UPPERCASE_CHARACTER_TEST = 7; //Generates uppercase letters separated by yellow.
const TWO_UNEQUAL_NUMBERS_TEST = 8; //Two unequal numbers will be generated separated by a green.

const NONE = 0;
const BINARY = 1;
const STRING = 2;

var ISTESTING = false;
var MOUSEOVERTIME = -1

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
var GHOST_BOT_TAPE = "RB"
var BOT_START_TAPE = BOT_TAPE
var BOT_QUEUE = []
var DELETEMODE = false
var DRAGGING = false
var MOUSEDOWN = false
var LAST_MOUSE_X=0;
var LAST_MOUSE_Y=0;
var DRAG_X = -1
var DRAG_Y = -1
var BOT_DID_NOT_REACH_EXIT = false
var TOOLTIPDISPLAYED = undefined
var MOVEMODE = false
var STARTDRAG = undefined
var TEST_RANDOM_TAPE = ""

var MESSAGETIMER = -1
var EXPECTED = true //True means the bot was supposed to accepted, false means the bot was supposed to be rejected.
var RESULT = true //True means you won. False means you lost.
var TESTSTEPS = 0 //How long it takes the tests to run.

var BOT_PREVX = BOT_X
var BOT_PREVY = BOT_Y
var LASTPOSITIONUPDATE = 0

var BRIDGEDBELT = false

var ALLOWEDTOCLICK = true

var MOBILE = false

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

var DEF_BRANCHUP_RB = {img:ID_BRANCH,color1:RED,color2:BLUE,type:"BRANCH"}
var DEF_BRANCHUP_BR = {img:ID_BRANCH,color1:BLUE,color2:RED,type:"BRANCH"}
var DEF_BRANCHUP_GY = {img:ID_BRANCH,color1:GREEN,color2:YELLOW,type:"BRANCH"}
var DEF_BRANCHUP_YG = {img:ID_BRANCH,color1:YELLOW,color2:GREEN,type:"BRANCH"}
var DEF_BRANCHUP_PPI = {img:ID_BRANCH,color1:PURPLE,color2:PINK,type:"BRANCH"}
var DEF_BRANCHUP_PIP = {img:ID_BRANCH,color1:PINK,color2:PURPLE,type:"BRANCH"}
var DEF_BRANCHUP_BLGR = {img:ID_BRANCH,color1:BLACK,color2:GRAY,type:"BRANCH"}
var DEF_BRANCHUP_GRBL = {img:ID_BRANCH,color1:GRAY,color2:BLACK,type:"BRANCH"}
var DEF_WRITERRIGHT_R = {img:ID_WRITER,color1:RED,type:"WRITER"}
var DEF_WRITERRIGHT_B = {img:ID_WRITER,color1:BLUE,type:"WRITER"}
var DEF_WRITERRIGHT_G = {img:ID_WRITER,color1:GREEN,type:"WRITER"}
var DEF_WRITERRIGHT_Y = {img:ID_WRITER,color1:YELLOW,type:"WRITER"}
var DEF_WRITERRIGHT_P = {img:ID_WRITER,color1:PURPLE,type:"WRITER"}
var DEF_WRITERRIGHT_PI = {img:ID_WRITER,color1:PINK,type:"WRITER"}
var DEF_WRITERRIGHT_BL = {img:ID_WRITER,color1:BLACK,type:"WRITER"}
var DEF_WRITERRIGHT_GR = {img:ID_WRITER,color1:GRAY,type:"WRITER"}
var DEF_CONVEYOR = {img:ID_CONVEYOR,type:"BELT"}


var GRID_W = 32
var GRID_H = 32
var GRID_X = 20
var GRID_Y = 20

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

var KEY_ROTATION_RIGHT = ["D","L","d","l","6","ArrowRight"]
var KEY_ROTATION_LEFT = ["A","G","a","h","4","ArrowLeft"]
var KEY_ROTATION_UP = ["W","K","w","k","8","ArrowUp"]
var KEY_ROTATION_DOWN = ["S","J","s","j","2","ArrowDown"]
var KEY_BRIDGED_BELT = ["Shift"]

var CONVEYOR_BUILD_BUTTON = {img:ID_CONVEYOR,x:-1,y:-1,w:-1,h:-1,lastselected:DEF_CONVEYOR,tooltip:"Conveyor Belt\nMoves bots in a direction.\n\nHold (Shift) to bridge over other belts",mobileTooltip:"Conveyor Belt\nMoves bots in a direction.\n\nHold button down to toggle bridge mode.\nUsed to bridge over other belts"}
var BRANCH_BUILD_BUTTON = {img:ID_BRANCH,x:-1,y:-1,w:-1,h:-1,submenu_buttons:[DEF_BRANCHUP_RB,DEF_BRANCHUP_BR,DEF_BRANCHUP_GY,DEF_BRANCHUP_YG,DEF_BRANCHUP_PPI,DEF_BRANCHUP_PIP,DEF_BRANCHUP_BLGR,DEF_BRANCHUP_GRBL],lastselected:undefined,default:DEF_BRANCHUP_RB,tooltip:"Branch\nReads next tape and moves bot in the\nmatching color direction.\n\nMoves bot forward and does not consume\ntape if no match found."}
var WRITER_BUILD_BUTTON = {img:ID_WRITER,x:-1,y:-1,w:-1,h:-1,submenu_buttons:[DEF_WRITERRIGHT_R,DEF_WRITERRIGHT_B,DEF_WRITERRIGHT_G,DEF_WRITERRIGHT_Y,DEF_WRITERRIGHT_P,DEF_WRITERRIGHT_PI,DEF_WRITERRIGHT_BL,DEF_WRITERRIGHT_GR],lastselected:undefined,default:DEF_WRITERRIGHT_R,tooltip:"Writer\nWrites a color to the end of the tape."}
var ROTATE_CLOCKWISE_BUTTON = {img:ID_ROTATE_CLOCKWISE,x:-1,y:-1,w:-1,h:-1,cb:rotateClockwise,tooltip:"Rotate selection clockwise.\nYou can use WASD, HJKL, Arrow Keys\nto rotate quickly.",mobileTooltip:"Rotate selection clockwise."
}
var ROTATE_COUNTERCLOCKWISE_BUTTON = {img:ID_ROTATE_COUNTERCLOCKWISE,x:-1,y:-1,w:-1,h:-1,cb:rotateCounterClockwise,tooltip:"Rotate selection counter-clockwise.\nYou can use WASD, HJKL, Arrow Keys\nto rotate quickly.",mobileTooltip:"Rotate selection counter-clockwise."
}


var PLAY_BUTTON = {img:ID_PLAY,x:-1,y:-1,w:-1,h:-1,cb:runGameSimulation,tooltip:"Test your great machine.\n\nConvert all the bots!"
}
var PAUSE_BUTTON = {img:ID_PAUSE,x:-1,y:-1,w:-1,h:-1,cb:pauseGameSimulation,tooltip:"Pause the great machine."
}
var RESET_BUTTON = {img:ID_RESET,x:-1,y:-1,w:-1,h:-1,cb:resetSimulation,tooltip:"Reset the great machine."
}
var DELETE_BUTTON = {img:ID_DELETE,x:-1,y:-1,w:-1,h:-1,cb:toggleDeleteMode,tooltip:"Remove a piece on the field."
}
var HOME_BUTTON = {img:ID_HOME,x:-1,y:-1,w:-1,h:-1,cb:goHome,tooltip:"Go back to the level selection menu.\n\nYour progress will be saved automatically."
}
var MOVE_BUTTON = {img:ID_MOVE_BUTTON,x:2,y:2,w:32,h:32,cb:toggleMoveMode,tooltip:"Scroll the view area."
}

var AUDIO_BUTTON = {
	bounds:{x:4,y:4,w:40,h:40},
	cb:()=>{
		currentSound.muted=!currentSound.muted
	}
}
var INFO_BUTTON = {
	bounds:{x:4,y:44,w:40,h:40},
	cb:()=>{
		gameState=INFO
	}
}
var INFO_HOME_BUTTON = {
	bounds:{x:4,y:4,w:40,h:40},
	cb:()=>{
		goHome(false)
	}
}


var CREDITS=">CREDITS\n\n"
+"First, thanks to Javidx9 for putting on a wonderful coding jam!\n"
+"I had a lot of fun working on this game.\n"
+"\n"
+"This game is heavily inspired by Manufactoria, and thus\n"
+"it is appropriate to give credit to the developer of Manufactoria\n"
+">(@pleasingfungus) Nicholas Feinberg - Creator of Manufactoria\n"
+"\n"
+">Music is from an excerpt from the Shostakovich - Symphony No.9 Performance\n"
+"\n"
+"All graphics were designed by myself.\n"
+">(@sigonasr2) Joshua Sigona - Creator of The Great Conversion\n"
+"\n"
+"Font licenses are included in attached License files."


var MENU = {
	visible:false,
	buttons:[CONVEYOR_BUILD_BUTTON,BRANCH_BUILD_BUTTON,WRITER_BUILD_BUTTON,ROTATE_COUNTERCLOCKWISE_BUTTON,ROTATE_CLOCKWISE_BUTTON,DELETE_BUTTON,PLAY_BUTTON,RESET_BUTTON,HOME_BUTTON]
}

function toggleMoveMode() {
	setMoveMode(!MOVEMODE)
}

function saveLevelData() {
	completedStages[gameStage.name].data=deepCopy(gameGrid)
	localStorage.setItem("game",JSON.stringify(completedStages))
}

function goHome(save=true) {
	if (save) {
		saveLevelData()
	}
	MENU.visible=false
	BRIDGEDBELT=false
	setMoveMode(false)
	BOT_TAPE=""
	GHOST_BOT_TAPE=""
	GRID_X=20
	GRID_Y=20
	ITEM_SELECTED=undefined
	MOUSEDOWN=false
	ALLOWEDTOCLICK=false
	endARound()
	for (var button of MENU.buttons) {
		if (button.submenu_buttons) {
			button.lastselected=button.default
		}
	}
	gameGrid=[]
	gameState=MAINMENU
}

function runGameSimulation(){
	if (gameState!==PAUSED) {
		gameState=TESTING
		ISTESTING=true
		BOT_PREVX=-100
		BOT_PREVY=-100
		BOT_TAPE=""
		GHOST_BOT_TAPE=""
		ITEM_SELECTED=undefined
		BOT_START_TAPE=undefined
		if (gameSpeed===-1) {
			gameSpeed=1000/1
		}
		setMoveMode(false)
		generateBotQueue()
		ISTESTING=false
		if (BOT_QUEUE.length>0) {
			BOT_TAPE=BOT_QUEUE[0]
		} else {
			BOT_TAPE=TEST_RANDOM_TAPE
			EXPECTED=gameStage.accept(BOT_TAPE)
		}
		BOT_START_TAPE=BOT_TAPE
		BOT_X=gameStage.start.x
		BOT_Y=gameStage.start.y
		BOT_PREVX=BOT_X
		BOT_PREVY=BOT_Y
		BOT_STATE=ALIVE
		gameState=WAITING
		BOT_DIR=RIGHT
		gameState=RUNNING
		gameState=RUNNING
		MESSAGETIMER=new Date().getTime()+3000
		for (var i=0;i<MENU.buttons.length;i++) {
			if (MENU.buttons[i].img===ID_PLAY) {
				MENU.buttons[i]=PAUSE_BUTTON
				break;
			}
		}
	}
	gameState=RUNNING
	for (var i=0;i<MENU.buttons.length;i++) {
		if (MENU.buttons[i].img===ID_PLAY) {
			MENU.buttons[i]=PAUSE_BUTTON
			break;
		}
	}
}

function endARound() {
	for (var i=0;i<MENU.buttons.length;i++) {
		if (MENU.buttons[i].img===ID_PAUSE) {
			MENU.buttons[i]=PLAY_BUTTON
			break;
		}
	}
}

function pauseGameSimulation(){
	if (!ISTESTING) {
		gameState=PAUSED
		endARound()
	}
}
function resetSimulation(){
	BOT_STATE=ALIVE
	gameState=WAITING
	BOT_X=gameStage.start.x
	BOT_Y=gameStage.start.y
	BOT_PREVX=-100
	BOT_PREVY=-100
	BOT_DIR=RIGHT
	endARound()
}
function toggleDeleteMode(){
	DELETEMODE=!DELETEMODE
	if (DELETEMODE) {
		ITEM_SELECTED=undefined
		setMoveMode(false)
		document.body.style.cursor="url('delete_cursor.png') 8 8,auto"
	} else {
		document.body.style.cursor="url('cursor.png') 8 8,auto"
	}
}

function rotateClockwise() {
	ITEM_DIRECTION=getClockwiseDirection(ITEM_DIRECTION)
}
function rotateCounterClockwise() {
	ITEM_DIRECTION=getCounterClockwiseDirection(ITEM_DIRECTION)
}
function getClockwiseDirection(dir) {
	return (dir+1)%4
}
function getCounterClockwiseDirection(dir) {
	var newdir=dir;
	newdir=(newdir-1);
	if(newdir<0){newdir=3}
	return newdir;
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
	objective:"Accept only bots that have all B markers.",
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
var STAGE3 = {
	name:"Balance",
	objective:"Accept bots with an equal number of R and B markers in total.",
	level:createGrid(15,15,14,14),
	start:{x:0,y:0},
	accept:(tape)=>{
			var reds=0;
			var blues=0;
			for (var i=0;i<tape.length;i++) {
				switch (tape[i]) {
					case RED:{
						reds++;
					}break;
					case BLUE:{
						blues++;
					}break;
				}
			}
			return blues===reds;
		}
	}
var BSTAGE1 = {
	name:"Bloody Red",
	objective:`Output just the ${RED} markers from a bot.`,
	level:createGrid(5,5,4,4),
	start:{x:0,y:0},
	accept:(tape)=>{
		var finalTape=""
		for (var i=0;i<tape.length;i++) {
			if (tape[i]===RED) {
				finalTape+=RED
			}
		}
		return finalTape
	},
	//generator:BLANK_TEST,
	//display:STRING
}
var BSTAGE2 = {
	name:"Crazy Conversion",
	objective:`Given that ${YELLOW}=${RED}, ${GREEN}=${BLUE}${BLUE}${RED}, ${PURPLE}=${BLUE}${RED}, ${PINK}=${RED}${RED}${RED}, ${BLACK}=${RED}${BLUE}, ${GRAY}=${BLUE}, convert all the bots to the correct ${RED} and ${BLUE} values.`,
	level:createGrid(11,11,10,0),
	start:{x:0,y:10},
	accept:(tape)=>{
		var finalTape=""
		for (var i=0;i<tape.length;i++) {
			switch (tape[i]) {
				case YELLOW:{
					finalTape+=`${RED}`
				}break;
				case GREEN:{
					finalTape+=`${BLUE}${BLUE}${RED}`
				}break;
				case PURPLE:{
					finalTape+=`${BLUE}${RED}`
				}break;
				case PINK:{
					finalTape+=`${RED}${RED}${RED}`
				}break;
				case BLACK:{
					finalTape+=`${RED}${BLUE}`
				}break;
				case GRAY:{
					finalTape+=`${BLUE}`
				}break;
			}
		}
		return finalTape
	},
	generator:BSTAGE2_TEST,
	//display:STRING
}
var BSTAGE3 = {
	name:"Double Trouble",
	objective:`For every dot on the tape, double the output. Ex. ${RED}${RED}${RED}${BLUE} should output ${RED}${RED}${RED}${RED}${RED}${RED}${BLUE}${BLUE}.`,
	level:createGrid(5,5,4,4),
	start:{x:0,y:0},
	accept:(tape)=>{
		var finalTape=""
		for (var i=0;i<tape.length;i++) {
			finalTape+=tape[i]+tape[i]
		}
		return finalTape
	},
	//generator:BLANK_TEST,
	//display:STRING
}
var BSTAGE4 = {
	name:"Back of the line",
	objective:`Replace the last marker on the tape with a ${YELLOW} marker.`,
	level:createGrid(5,5,4,4),
	start:{x:0,y:0},
	accept:(tape)=>{
		var finalTape = tape.substring(0,tape.length-1)
		finalTape+=YELLOW
		return finalTape
	},
	//generator:BLANK_TEST,
	//display:STRING
}
var BSTAGE5 = {
	name:"Back and Forth",
	objective:`Accept robots that have alternating colors.`,
	level:createGrid(7,7,6,6),
	start:{x:0,y:0},
	accept:(tape)=>{
		var finalTape=""
		var lastCol=""
		for (var i=0;i<tape.length;i++) {
			if (tape[i]===lastCol) {
				return false
			} else {
				lastCol=tape[i]
			}
		}
		return true
	},
	//generator:BLANK_TEST,
	//display:STRING
}
var BSTAGE6 = {
	name:"#olcCodeJam2020",
	objective:`Output the string "#olcCodeJam2020", using Binary ASCII characters (${RED}=0 ${BLUE}=1) and using ${YELLOW} markers as a separator. Ex: "A"=65=${BLUE}${RED}${RED}${RED}${RED}${RED}${BLUE}, "b"=98=${RED}${BLUE}${RED}${RED}${RED}${BLUE}${BLUE}`,
	level:createGrid(12,12,11,11),
	start:{x:0,y:0},
	accept:(tape)=>{
		return {string:"#olcCodeJam2020"}
	},
	generator:BLANK_TEST,
	display:STRING
}
var BSTAGE7 = {
	name:"End-to-End",
	objective:`Accept robots that have the same first and last colors on their tapes. Ex: ${RED}${BLUE}${RED} is accepted, ${RED}${BLUE}${BLUE} is not.`,
	level:createGrid(7,7,6,6),
	start:{x:0,y:0},
	accept:(tape)=>{
		var first=""
		var last=""
		if (tape.length>0) {
			first=tape[0]
			last=tape[tape.length-1]
		}
		return first===last
	},
	//generator:BLANK_TEST,
	//display:STRING
}
var BSTAGE8 = {
	name:"Greatest Count",
	objective:`Given an odd number of ${BLUE}s and ${RED}s, determine if there are more ${BLUE}s or more ${RED}s and only return those markers. Ex: ${BLUE}${BLUE}${BLUE}${RED}${RED} should output as ${BLUE}${BLUE}${BLUE} (3>2)`,
	level:createGrid(9,9,8,8),
	start:{x:0,y:0},
	accept:(tape)=>{
		var blues = ""
		var reds = ""
		for (var i=0;i<tape.length;i++) {
			if (tape[i]===BLUE) {
				blues+=BLUE
			} else
			if (tape[i]===RED) {
				reds+=RED
			}
		}
		return (blues.length>reds.length)?blues:reds
	},
	generator:ODD_LENGTH_TEST,
	//display:STRING
}
var ISTAGE2 = {
	name:"Oddly Even",
	objective:`Accepts bots that have an even length of tape.`,
	level:createGrid(7,7,6,6),
	start:{x:0,y:0},
	accept:(tape)=>{
		return tape.length%2===0
	},
	//generator:BLANK_TEST,
	//display:STRING
}
var ISTAGE3 = {
	name:"Add One",
	objective:`Given a tape representing binary (${RED}=0 ${BLUE}=1), add 1 to the number. Ex: ${BLUE}${RED}${BLUE}(5) should output ${BLUE}${BLUE}${RED}(6)`,
	level:createGrid(9,9,8,8),
	start:{x:0,y:0},
	accept:(tape)=>{
		var answer = tapeToBinary(tape)+1
		return binaryToTape(answer)
	},
	generator:BINARY_TEST,
	display:BINARY
}
var ISTAGE4 = {
	name:"String Length",
	objective:`Return the number of ${RED}s from a bot as a binary number (${RED}=0 ${BLUE}=1). Ex: ${RED}${RED}${RED}${BLUE}${RED} should output as ${BLUE}${RED}${RED} (4 ${RED}s)`,
	level:createGrid(13,13,12,12),
	start:{x:0,y:0},
	accept:(tape)=>{
		var reds = 0
		for (var i=0;i<tape.length;i++) {
			if (tape[i]===RED) {
				reds++
			}
		}
		return binaryToTape(reds)
	},
	//generator:BINARY_TEST,
	display:BINARY
}
var ISTAGE1 = {
	name:"Blue In Blue Out",
	objective:`Output the tape with all the ${BLUE}s moved to the front.`,
	level:createGrid(7,7,6,6),
	start:{x:0,y:0},
	accept:(tape)=>{
		var blues = ""
		var reds = ""
		for (var i=0;i<tape.length;i++) {
			if (tape[i]===BLUE) {
				blues+=BLUE
			} else
			if (tape[i]===RED) {
				reds+=RED
			}
		}
		return blues+reds
	},
	//generator:BINARY_TEST,
	//display:BINARY
}
var ISTAGE5 = {
	name:"NoLemonsNoMelon",
	objective:`Accept bots that are a palindrome. Ex: ${BLUE}${RED}${RED}${BLUE} is a palindrome, ${BLUE}${RED}${BLUE} is a palindrome, ${BLUE}${RED}${BLUE}${RED} is not a palindrome.`,
	level:createGrid(7,7,6,6),
	start:{x:0,y:0},
	accept:(tape)=>{
		for (var i=0;i<tape.length/2;i++) {
			if (tape[i]!==tape[tape.length-1-i]) {
				return false;
			}
		}
		return true;
	},
	//generator:ODD_LENGTH_TEST,
	//display:BINARY
}
var ISTAGE6 = {
	name:"Is Equal To",
	objective:`Given 2 binary numbers (${RED}=0 ${BLUE}=1) separated by a ${GREEN} marker, accept bots where the 2 numbers are equal. Ex. ${RED}${BLUE}${RED}${GREEN}${RED}${BLUE}${RED} (2/2) should be accepted while ${BLUE}${RED}${GREEN}${RED}${BLUE} (2/1) should not be.`,
	level:createGrid(11,11,10,10),
	start:{x:0,y:0},
	accept:(tape)=>{
		var temp = ""
		var number1 = -1
		var number2 = -1
		for (var i=0;i<tape.length;i++) {
			if (tape[i]===GREEN) {
				if (number1===-1) {
					number1=tapeToBinary(temp)
				}
				temp=""
			} else {
				temp+=tape[i]
			}
		}
		number2=tapeToBinary(temp)
		return number1===number2
	},
	generator:TWO_NUMBERS_TEST,
	display:BINARY
}
var ISTAGE7 = {
	name:"Substring",
	objective:`Given a tape with 2 ${YELLOW} markers, return all the contents between the 2 ${YELLOW} markers. Ex: ${BLUE}${RED}${YELLOW}${RED}${RED}${BLUE}${YELLOW}${RED}${RED}${RED} should output ${RED}${RED}${BLUE}`,
	level:createGrid(7,7,6,6),
	start:{x:0,y:0},
	accept:(tape)=>{
		var found = ""
		var start = false
		for (var i=0;i<tape.length;i++) {
			if (tape[i]===YELLOW) {
				if (!start) {
					start=true
				} else {
					break;
				}
			} else {
				if (start) {
					found+=tape[i]
				}
			}
		}
		return found;
	},
	generator:SUBSTRING_TEST,
	//display:BINARY
}
var ISTAGE8 = {
	name:"Reversal",
	objective:`Reverse the input string. Ex: ${RED}${RED}${RED}${BLUE}${BLUE}${RED}${BLUE}${BLUE} -> ${BLUE}${BLUE}${RED}${BLUE}${BLUE}${RED}${RED}${RED}`,
	level:createGrid(11,11,10,10),
	start:{x:0,y:0},
	accept:(tape)=>{
		return tape.split("").reverse().join("")
	},
	//generator:SUBSTRING_TEST,
	//display:BINARY
}
var ASTAGE1 = {
	name:"Right in the Center",
	objective:`Given an even length tape, add a ${YELLOW} marker in the middle of it.`,
	level:createGrid(10,10,9,9),
	start:{x:0,y:0},
	accept:(tape)=>{
		return tape.substring(0,tape.length/2)+"Y"+tape.substring(tape.length/2,tape.length)
	},
	generator:EVEN_LENGTH_TEST,
	//display:STRING
}
var ASTAGE2 = {
	name:"toLowerCase",
	objective:`Given a string of uppercase ASCII binary characters (${RED}=0 ${BLUE}=1) separated by ${YELLOW}, convert all uppercase to lowercase. Ex: "HI"= ${BLUE}${RED}${RED}${BLUE}${RED}${RED}${RED}Y${BLUE}${RED}${RED}${BLUE}${RED}${RED}${BLUE} output as "hi"= ${BLUE}${BLUE}${RED}${BLUE}${RED}${RED}${RED}Y${BLUE}${BLUE}${RED}${BLUE}${RED}${RED}${BLUE}`,
	level:createGrid(25,25,24,24),
	start:{x:0,y:0},
	accept:(tape)=>{
		var chars=tape.split(YELLOW)
		var finalString = ""
		for (var i=0;i<chars.length;i++) {
			chars[i]=binaryToTape(tapeToBinary(chars[i])+32)
		}
		return chars.join(YELLOW)
	},
	generator:UPPERCASE_CHARACTER_TEST,
	display:STRING
}
var ASTAGE3 = {
	name:"Addition",
	objective:`Given 2 binary numbers (R=0 B=1) separated by a green dot, output the addition of those two numbers.`,
	level:createGrid(15,15,14,14),
	start:{x:0,y:0},
	accept:(tape)=>{
		var temp = ""
		var number1 = -1
		var number2 = -1
		for (var i=0;i<tape.length;i++) {
			if (tape[i]===GREEN) {
				if (number1===-1) {
					number1=tapeToBinary(temp)
				}
				temp=""
			} else {
				temp+=tape[i]
			}
		}
		number2=tapeToBinary(temp)
		return binaryToTape(number1+number2)
	},
	generator:TWO_NUMBERS_TEST,
	display:BINARY
}
var ASTAGE4 = {
	name:"The Great Conversion",
	objective:`Convert every other ${RED} to ${BLUE}${GREEN}, then for every found ${BLUE}${RED} sequence, turn them into ${RED}${RED} and run the checks again. Ex: ${RED}${RED}${BLUE}${BLUE}${RED}${BLUE}${BLUE}${BLUE}${RED} -> ${RED}${BLUE}${GREEN}${BLUE}${BLUE}${RED}${BLUE}${BLUE}${BLUE}${BLUE}${GREEN} -> ${RED}${BLUE}${GREEN}${BLUE}${RED}${RED}${BLUE}${BLUE}${BLUE}${BLUE}${GREEN} -> ${RED}${BLUE}${GREEN}${BLUE}${BLUE}${GREEN}${RED}${BLUE}${BLUE}${BLUE}${BLUE}${GREEN}`,
	level:createGrid(13,13,6,6),
	start:{x:0,y:6},
	accept:(tape)=>{
		var first=false;
		var newString=""
		var found=true
		var limit=2
		while (found&&limit-->0) {
			found=false
			first=false
			//Red->Blue-Green
			for (var i=0;i<tape.length;i++) {
				if (tape[i]===RED) {
					if (first) {
						found=true
						newString+=BLUE+GREEN
						first=false
					} else {
						newString+=RED
						first=true
					}
				} else {
					newString+=tape[i]
				}
			}
			tape=newString
			newString=""
			//BR -> RR
			var last = ""
			for (var i=0;i<tape.length;i++) {
				if (tape[i]===BLUE) {
					if (i+1<tape.length&&tape[i+1]===RED) {
						newString+=RED+RED
						i+=1
					} else {
						newString+=tape[i]
					}
				} else 
				{
					newString+=tape[i]
				}
			}
			tape=newString
			newString=""
		}
		return tape
	},
	//generator:TWO_NUMBERS_TEST,
	//display:BINARY
}
var ASTAGE5 = {
	name:"Compare",
	objective:`Given 2 distinct binary values (${RED}=0 ${BLUE}=1) separated by a green dot, output the greater of the two numbers Ex: ${BLUE}${BLUE}${BLUE}${RED}${BLUE}${GREEN}${BLUE}${BLUE}${RED}${RED}${RED} (29/24) outputs as ${BLUE}${BLUE}${BLUE}${RED}${BLUE} (29>24)`,
	level:createGrid(17,17,16,16),
	start:{x:0,y:0},
	accept:(tape)=>{
		var temp = ""
		var number1 = -1
		var number2 = -1
		for (var i=0;i<tape.length;i++) {
			if (tape[i]===GREEN) {
				if (number1===-1) {
					number1=tapeToBinary(temp)
				}
				temp=""
			} else {
				temp+=tape[i]
			}
		}
		number2=tapeToBinary(temp)
		return binaryToTape((number1>number2)?number1:number2)
	},
	generator:TWO_UNEQUAL_NUMBERS_TEST,
	display:BINARY
}
var TUTORIAL1 = {
	name:"Conveyors!",
	objective:"To convert your robots, you must send them from the entrance to the exit. Select a belt and send robots to where they truly belong.  Press the Play button to test your machine!",
	level:createGrid(5,5,4,2),
	start:{x:0,y:2},
	locked:[BRANCH_BUILD_BUTTON,WRITER_BUILD_BUTTON],
	tutorial:true,
	accept:(tape)=>{
			return true;
		},
	//display:BINARY
}
var TUTORIAL2 = {
	name:"Branches",
	objective:"We have to make sure we are sending robots that meet our needs! Use the branch to filter out robots that start with a R signal. Send only those to the exit!",
	level:createGrid(5,5,4,2),
	start:{x:0,y:2},
	locked:[WRITER_BUILD_BUTTON],
	tutorial:true,
	accept:(tape)=>{
			if (tape[0]===RED) {
				return true;
			} else {
				return false;
			}
		},
	//generator:BLANK_TEST,
	//display:STRING
	}
var TUTORIAL3 = {
	name:"Writers",
	objective:"CONVERSION! It's time to convert robots to what they should be. Add 3 B signals to every bot that comes through. We shall convert them all!",
	level:createGrid(5,5,4,2),
	start:{x:0,y:2},
	tutorial:true,
	accept:(tape)=>{
			return tape+BLUE+BLUE+BLUE
		}
	}
var TUTORIAL4 = {
	name:"More Colors",
	objective:"You may be required to use different colors, either for your purposes or mine. For this robot cycle, convert all B and R signals to Y signals.",
	level:createGrid(5,5,4,2),
	start:{x:0,y:2},
	accept:(tape)=>{
			var newTape = ""
			for (var i=0;i<tape.length;i++) {
				newTape+=YELLOW
			}
			return newTape
		}
	}
var SANDBOX = {
	name:"The Sandbox",
	objective:"You may experiment freely in this very large room.",
	level:createGrid(50,50,24,24),
	start:{x:0,y:0},
	accept:(tape)=>{
			return true
		}
	}

var TUTORIALMENU={
	title:"Introduction to Conversion",
	levels:[TUTORIAL1,TUTORIAL2,TUTORIAL3,TUTORIAL4],
	cols:2,
	width:568*0.8
}
var EASYMENU={
	title:"Beginner Stages",
	levels:[BSTAGE1,BSTAGE2,BSTAGE3,BSTAGE4,BSTAGE5,BSTAGE6,BSTAGE7,BSTAGE8],
	cols:1,
	width:568*0.33
}
var MEDIUMMENU={
	title:"Intermediate Stages",
	levels:[ISTAGE1,ISTAGE2,ISTAGE3,ISTAGE4,ISTAGE5,ISTAGE6,ISTAGE7,ISTAGE8],
	cols:1,
	width:568*0.33
}
var HARDMENU={
	title:"Advanced Stages",
	levels:[ASTAGE1,ASTAGE2,ASTAGE3,ASTAGE4,ASTAGE5],
	cols:1,
	width:568*0.33
}
var SANDBOXMENU={
	title:"Sandbox",
	levels:[SANDBOX],
	cols:1,
	width:568*0.33
}

var gameGrid = []
var completedStages = undefined //Example completed structure.

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


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
	completedStages={}
	MENU.visible=false
}

function convertStringToTape(str) {
	var finalTape=""
	for (var i=0;i<str.length;i++) {
		if (finalTape!=="") {
			finalTape+=YELLOW
		}
		finalTape+=binaryToTape(str.charCodeAt(i))
	}
	return finalTape
}

function decideIfWrongBot(isSupposedToBeAccepted,tape) {
	var result;
	var wrongBot=false;
	switch (typeof(isSupposedToBeAccepted)) {
		case "object":{
			if (isSupposedToBeAccepted.string!==undefined) {
				if (getSimulatedBotResult(tape)) {
					result = BOT_TAPE
					if (result===convertStringToTape(isSupposedToBeAccepted.string)) {
						wrongBot=false
					} else {
						wrongBot=true
					}
					isSupposedToBeAccepted=isSupposedToBeAccepted.string
				} else {
					if (BOT_QUEUE.length===0) {
						BOT_DID_NOT_REACH_EXIT=true
					}
					wrongBot=true;
				}
			}
		}break;
		case "string":{
			if (getSimulatedBotResult(tape)) {
				result = BOT_TAPE
				if (result===isSupposedToBeAccepted) {
					wrongBot=false;
				} else {
					wrongBot=true;
				}
			} else {
				if (BOT_QUEUE.length===0) {
					BOT_DID_NOT_REACH_EXIT=true
				}
				wrongBot=true;
			}
		}break;
		case "boolean":{
			result = getSimulatedBotResult(tape)
			if (result===isSupposedToBeAccepted) {
				wrongBot=false;
			} else {
				wrongBot=true;
			}
		}break;
	}
	if (wrongBot) {
		if (BOT_QUEUE.length===0) {
			EXPECTED = isSupposedToBeAccepted;
		}
		RESULT=false
		BOT_QUEUE.push(tape)
	}
}

function generateBotQueue() {
	BOT_QUEUE=[]
	RESULT=true
	TESTSTEPS=0
	BOT_DID_NOT_REACH_EXIT=false
	if (gameState===TESTING) {
		//Iterate up to...15 RED/BLUE combinations.
		var MAX_VALUE=1000
		var startingValue=0
		var tests = []
		var generator
		if (gameStage.generator!==undefined) {
			generator=gameStage.generator
		} else {
			generator=NORMAL_TEST
		}
		switch (generator) {
			case BSTAGE2_TEST:{
				for (var i=0;i<MAX_VALUE;i++) {
					var newTape=""
					var numb=i;
					while (numb>0) {
						var mask = numb&7
						switch (mask) {
							case 0:{
								newTape+=GREEN
							}break;
							case 1:{
								newTape+=YELLOW
							}break;
							case 2:{
								newTape+=PURPLE
							}break;
							case 3:{
								newTape+=PINK
							}break;
							case 4:{
								newTape+=BLACK
							}break;
							case 5:{
								newTape+=GRAY
							}break;
							default:{
								newTape+=GREEN
							}
						}
						numb=numb>>>3
					}
					tests.push(newTape)
				}
			}break;
			case EVEN_LENGTH_TEST:{
				while (tests.length<2000) {
					var newTape = binaryToTape(startingValue++)
					if (newTape.length%2===0) {
						tests.push(newTape)
						tests.push(newTape.split("").reverse().join(""))
					}
				}
			}break;
			case ODD_LENGTH_TEST:{
				while (tests.length<2000) {
					var newTape = binaryToTape(startingValue++)
					if (newTape.length%2===1) {
						tests.push(newTape)
						tests.push(newTape.split("").reverse().join(""))
					}
				}
			}break;
			case BINARY_TEST:{
				while (tests.length<2000) {
					var newTape = binaryToTape(startingValue++)
					if (newTape[newTape.length-1]!==RED) {
						tests.push(newTape)
					}
				}
			}break;
			case TWO_NUMBERS_TEST:{
				while (tests.length<2000) {
					var newTape = binaryToTape(startingValue++)
					var newTape2 = binaryToTape(startingValue++)
					if (Math.random()<=0.5) {
						newTape2=newTape
					}
					if (newTape[newTape.length-1]!==RED&&newTape2[newTape2.length-1]!==RED) {
						tests.push(newTape+GREEN+newTape2)
					}
				}
			}break;
			case SUBSTRING_TEST:{
				startingValue=1000
				while (tests.length<2000) {
					var tape = binaryToTape(startingValue)
					var pos1 = Math.floor(Math.random()*(tape.length/2))
					var pos2 = (tape.length/2)+Math.floor(Math.random()*(tape.length/2))
					tests.push(tape.substring(0,pos1)+YELLOW+tape.substring(pos1,pos2)+YELLOW+tape.substring(pos2,tape.length-1))
					startingValue+=141
				}
			}break;
			case UPPERCASE_CHARACTER_TEST:{
				while (tests.length<2000) {
					var length=Math.floor(Math.random()*15)
					var word = ""
					for (var i=0;i<length;i++) {
						word+=String.fromCharCode(Math.floor(Math.random()*26)+65)
					}
					tests.push(convertStringToTape(word))
				}
			}break;
			case TWO_UNEQUAL_NUMBERS_TEST:{
				while (tests.length<2000) {
					var numb1 = Math.floor(Math.random()*512)
					var numb2 = Math.floor(Math.random()*512)
					var newTape = binaryToTape(numb1)
					var newTape2 = binaryToTape(numb2)
					if (newTape[newTape.length-1]!==RED&&newTape2[newTape2.length-1]!==RED&&numb1!==numb2) {
						tests.push(newTape+GREEN+newTape2)
					}
				}
			}break;
			case ONE_TEST:{
				tests = ["RRR"]
			}break;
			case BLANK_TEST:{
				tests = [""]
			}break;
			default:{
				for (var i=0;i<MAX_VALUE;i++) {
					tests.push(binaryToTape(startingValue++))
					tests.push(binaryToTape(startingValue).split("").reverse().join(""))
				}
			}
		}
		TEST_RANDOM_TAPE = tests[Math.floor(Math.random()*tests.length)]
		for (var i=0;i<tests.length;i++) {
			 //Set to true if a bot that's supposed to pass fails, or a bot that's supposed to fail passes.
			var isSupposedToBeAccepted=gameStage.accept(tests[i])
			decideIfWrongBot(isSupposedToBeAccepted,tests[i])
			if (BOT_QUEUE.length>=3) {
				break;
			}
		}
		if (RESULT) {
			completedStages[gameStage.name].complete=true
			completedStages[gameStage.name].score=TESTSTEPS
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
		TESTSTEPS++
		if (gameState===REVIEWING) {
			return false
		}
		if (gameState===FINISH) {
			return true
		}
		iterations++
	}
	if (BOT_QUEUE.length===0) {
		BOT_DID_NOT_REACH_EXIT=true
		RESULT=false
		BOT_QUEUE.push(tape)
	}
	if (iterations===MAX_ITERATIONS) {
		TESTSTEPS=-1
	}
	return false
}

function binaryToTape(val) {
	var remainingVal = val
	var tape = ""
	while (remainingVal>0) {
		var mask = remainingVal&1
		if (mask===1) {
			tape=tape+BLUE
		} else {
			tape=tape+RED
		}
		remainingVal=remainingVal>>>1
	}
	return tape;
}

function setNextSquare(offsetX,offsetY) {
	if (gameGrid[BOT_Y+offsetY]!==undefined) {
		var nextSquare = gameGrid[BOT_Y+offsetY][BOT_X+offsetX];
		if (!ISTESTING) {
			BOT_PREVX=BOT_X
			BOT_PREVY=BOT_Y
		}
		LASTPOSITIONUPDATE=new Date().getTime()
		BOT_X+=offsetX
		BOT_Y+=offsetY
		return nextSquare
	} else {
		gameState = REVIEWING
		BOT_STATE = DEAD
		endARound()
		return undefined
	}
}

function runBot(testing) {
	if ((lastGameUpdate<new Date().getTime()||testing)&&gameSpeed!==-1) {
		GHOST_BOT_TAPE=BOT_TAPE
		lastGameUpdate=new Date().getTime()+gameSpeed
		var nextSquare = {}
		switch (BOT_DIR) {
			case UP:{
				nextSquare = setNextSquare(0,-1)
				if (nextSquare!==undefined) {
					BOT_DIR=(nextSquare.direction2!==undefined &&
						(nextSquare.direction2===UP||nextSquare.direction2===DOWN))?nextSquare.direction2:nextSquare.direction
				}
			}break;
			case LEFT:{
				nextSquare = setNextSquare(-1,0)
				if (nextSquare!==undefined) {
					BOT_DIR=(nextSquare.direction2!==undefined &&
					(nextSquare.direction2===RIGHT||nextSquare.direction2===LEFT))?nextSquare.direction2:nextSquare.direction
				}
			}break;
			case RIGHT:{
				nextSquare = setNextSquare(1,0);
				if (nextSquare!==undefined) {
					BOT_DIR=(nextSquare.direction2!==undefined &&
					(nextSquare.direction2===RIGHT||nextSquare.direction2===LEFT))?nextSquare.direction2:nextSquare.direction
				}
			}break;
			case DOWN:{
				nextSquare = setNextSquare(0,1)
				if (nextSquare!==undefined) {
					BOT_DIR=(nextSquare.direction2!==undefined &&
					(nextSquare.direction2===UP||nextSquare.direction2===DOWN))?nextSquare.direction2:nextSquare.direction
				}
			}break;
		}
		if (nextSquare!==undefined&&(nextSquare.direction!==undefined||nextSquare.type==="EXIT")) {
			switch (nextSquare.type) {
				case "BRANCH":{
					if (BOT_TAPE[0]===nextSquare.color1) {
						//Move towards left side of the branch.
						BOT_DIR = LeftOf(nextSquare.direction)
						ConsumeTape()
					} else
					if (BOT_TAPE[0]===nextSquare.color2) {
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
					endARound()
				}break;
			}
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
	canvas.style.height="100%"
	document.getElementById("game").appendChild(canvas)
	canvas.addEventListener("mousemove",updateMouse)
	canvas.addEventListener("mousedown",clickEvent)
	canvas.addEventListener("mouseup",releaseEvent)
	canvas.addEventListener("touchmove",updateMouse)
	canvas.addEventListener("touchstart",clickEvent)
	canvas.addEventListener("touchend",releaseEvent)
	document.addEventListener("keydown",keydownEvent)
	document.addEventListener("keyup",keyupEvent)
	try {
		completedStages = JSON.parse(localStorage.getItem("game"))
		if (!completedStages) {
			completedStages={}
		} else {
			FIRSTBOOT=false
		}
	}catch{}
	//loadStage(TUTORIAL4)
	//gameState=MAINMENU
	gameState=STARTUP
}

function setupTitleScreen() {
	gameState=TITLE
	CURRENTTIMELINE=[...TITLETIMELINE]
	TITLESCREENTIMELINE=new Date().getTime();
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
	if (CheckKeys(e,KEY_BRIDGED_BELT)) {
		BRIDGEDBELT=true
	}
}

function keyupEvent(e) {
	if (CheckKeys(e,KEY_BRIDGED_BELT)) {
		BRIDGEDBELT=false
	}
}

function mouseOverButton(canvas,e,button) {
	return (getMousePos(e).x>=button.x &&
			getMousePos(e).x<=button.x+button.w &&
			getMousePos(e).y>=button.y &&
			getMousePos(e).y<=button.y+button.h)
}

function setMoveMode(mode) {
	MOVEMODE=mode
	if (MOVEMODE) {
		document.body.style.cursor="move"
	} else {
		if (DELETEMODE) {
			document.body.style.cursor="url('delete_cursor.png') 8 8,auto"
		} else {
			document.body.style.cursor="url('cursor.png') 8 8,auto"
		}
	}
}

function clickEvent(e) {
	if (window.TouchEvent && e instanceof TouchEvent) {
		MOBILE=true
		e.preventDefault()
	} else {
		MOBILE=false
	}
	var mousepos = getMousePos(e)
	LAST_MOUSE_X=mousepos.x
	LAST_MOUSE_Y=mousepos.y
	MOUSEOVERTIME=-1
	
	MOUSEDOWN=true
	
	if (gameState===STARTUP) {
		currentSound.play()
		setupTitleScreen()
		MOUSEDOWN=false
	}
	if (gameState===TITLE) {
		MOUSEDOWN=false
		if (new Date().getTime()-TITLESCREENTIMELINE>=15000) {
			if (FIRSTBOOT) {
				loadStage(TUTORIAL1)
				gameState=WAITING
			} else {
					gameState=MAINMENU
			}
		}
	}
	if (gameState===MAINMENU) {
		if (MouseOverBounds(AUDIO_BUTTON.bounds)) {AUDIO_BUTTON.cb();return;}
		if (MouseOverBounds(INFO_BUTTON.bounds)) {INFO_BUTTON.cb();return;}
	}
	if (gameState===INFO) {
		if (MouseOverBounds(INFO_HOME_BUTTON.bounds)) {INFO_HOME_BUTTON.cb();return;}
	}
	
	if (MENU.visible) {
		for (var button of MENU.buttons) {
			if (ButtonIsUnlocked(button)) {
				if (mouseOverButton(canvas,e,button)) {
					if (MOBILE&&button===CONVEYOR_BUILD_BUTTON) {
						setTimeout(()=>{
							if (MOUSEDOWN&&
								LAST_MOUSE_X>=CONVEYOR_BUILD_BUTTON.x&&
								LAST_MOUSE_X<=CONVEYOR_BUILD_BUTTON.x+CONVEYOR_BUILD_BUTTON.w&&
								LAST_MOUSE_Y>=CONVEYOR_BUILD_BUTTON.y&&
								LAST_MOUSE_Y<=CONVEYOR_BUILD_BUTTON.y+CONVEYOR_BUILD_BUTTON.h) {
									BRIDGEDBELT=!BRIDGEDBELT
								}
							},500)
					}
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
						if (ITEM_SELECTED===button.lastselected&&!MOVEMODE) {
							if (!MOBILE) {
								ITEM_SELECTED=undefined
							}
						} else {
							ITEM_SELECTED=button.lastselected
						}
						setMoveMode(false)
						return
					}
				}
			}
		}
		
		if (mouseOverButton(canvas,e,MOVE_BUTTON)&&!DELETEMODE) {
			MOVE_BUTTON.cb()
			return
		}
	}
	
	if (gridModeIsAvailable()&&ITEM_SELECTED===undefined) {
		setMoveMode(true)
	}
	
	if (!MOBILE&&e.button!==0) {
		e.preventDefault()
		if (gridModeIsAvailable()) {
			setMoveMode(true)
		} else {
			setMoveMode(false)
		}
	}
	
	if (MOVEMODE) {
		//Cannot handle building until out of move mode.
		STARTDRAG=getMousePos(e)
		return;
	}
	
	if ((ITEM_SELECTED!==undefined||DELETEMODE)&&!MOVEMODE) {
		var clickCoords = getGridCoords(getMousePos(e))
		if (coordsInBounds(clickCoords)) {
			modifyBoard(clickCoords,ITEM_SELECTED)
			DRAGGING = true
			DRAG_X = clickCoords.x
			DRAG_Y = clickCoords.y
		}
	}
}

function coordsInBounds(coords) {
	return coords.x>=0&&coords.y>=0&&coords.y<gameGrid.length&&coords.x<gameGrid[coords.y].length
}

function modifyBoard(clickCoords,item) {
	if (DELETEMODE) {
		deleteObject(clickCoords)
	} else {
		placeObject(clickCoords,item)
	}
}

function notAForbiddenObject(coords) {
	return (gameStage.start.x!==coords.x||gameStage.start.y!==coords.y)&&(gameGrid[coords.y][coords.x].type===undefined||(gameGrid[coords.y][coords.x].type&&gameGrid[coords.y][coords.x].type!=="EXIT"))
}

function deleteObject(coords,def) {
	if (notAForbiddenObject(coords)) {
		gameGrid[coords.y][coords.x]={}
		gameState=WAITING
		endARound()
	}
}
function placeObject(coords,def) {
	if (notAForbiddenObject(coords)) {
		if (gameGrid[coords.y][coords.x].direction!==undefined&&gameGrid[coords.y][coords.x].type&&gameGrid[coords.y][coords.x].type==="BELT"
		&&(gameGrid[coords.y][coords.x].direction===getClockwiseDirection(ITEM_DIRECTION)||gameGrid[coords.y][coords.x].direction===getCounterClockwiseDirection(ITEM_DIRECTION))
		&&BRIDGEDBELT) {
			gameGrid[coords.y][coords.x]={...gameGrid[coords.y][coords.x],direction2:ITEM_DIRECTION}
		} else {
			var newObj={...def,direction:ITEM_DIRECTION}
			gameGrid[coords.y][coords.x]=newObj
		}
		gameState=WAITING
		endARound()
	}
}

function getGridCoords(pos) {
	if (pos.x<canvas.width*0.75&&pos.y<canvas.height*0.8) {
		var x = Math.round((pos.x-GRID_X)/GRID_W-1)
		var y = Math.round((pos.y-GRID_Y)/GRID_H-1)
		return {x:x,y:y}
	} else {
		return {x:-1,y:-1}
	}
}

function releaseEvent(e) {
	if (window.TouchEvent && e instanceof TouchEvent) {
		e.preventDefault()
	}
	
	if (gridModeIsAvailable()&&ITEM_SELECTED===undefined) {
		setMoveMode(false)
	}
	if (!MOBILE&&e.button!==0) {
		e.preventDefault()
		if (gridModeIsAvailable()) {
			setMoveMode(false)
		}
	}
	
	ALLOWEDTOCLICK=true
	
	if (MOVEMODE) {
		STARTDRAG=undefined
	}
	
	var mousepos = getMousePos(e)
	LAST_MOUSE_X=mousepos.x
	LAST_MOUSE_Y=mousepos.y
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
	DRAGGING = false
	MOUSEDOWN = false
}

function loadLevel(level,botx,boty) {
	placeBot(botx,boty)
	gameGrid = deepCopy(level)
	MENU.visible=true
}

function loadStage(stage) {
	//gameGrid=deepCopy(stage.level)
	ITEM_SELECTED=undefined
	loadLevel(stage.level,stage.start.x,stage.start.y)
	gameStage=stage
	if (completedStages[stage.name]===undefined) {
		completedStages[stage.name]={}
	} else {
		if (completedStages[stage.name].data!==undefined) {
			gameGrid = deepCopy(completedStages[stage.name].data)
		}
	}
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
	dashOffset+=0.1*Math.max((1000/gameSpeed),1)
	switch (gameState) {
		case RUNNING:{
			runBot()
		}break;
	}
}

function updateMouse(e) {
	e.preventDefault()
	var mousepos = getMousePos(e)
	LAST_MOUSE_X=mousepos.x
	LAST_MOUSE_Y=mousepos.y
	
	if (MOVEMODE&&STARTDRAG!==undefined) {
		GRID_X+=mousepos.x-STARTDRAG.x
		GRID_Y+=mousepos.y-STARTDRAG.y
		STARTDRAG=mousepos
	}
	
	if (DRAGGING) {
		var clickCoords = getGridCoords(getMousePos(e))
		if (coordsInBounds(clickCoords)) {
			if (DRAG_X!==clickCoords.x||DRAG_Y!==clickCoords.y) {
				modifyBoard(clickCoords,ITEM_SELECTED)
				DRAG_X=clickCoords.x
				DRAG_Y=clickCoords.y
			}
		}
	}
}

function getMousePos(e) {
	var rect = canvas.getBoundingClientRect();
	var scale = canvas.height/canvas.clientHeight
	if (e.changedTouches) {
		return {
		  x: (e.changedTouches[0].clientX - rect.left) * scale,
		  y: (e.changedTouches[0].clientY - rect.top) * scale
		};
	} else {
		return {
		  x: (e.clientX - rect.left) * scale,
		  y: (e.clientY - rect.top) * scale
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
			if (gameGrid[y][x].type==="EXIT") {
				drawImage(GRID_X+GRID_W*x+32,GRID_Y+GRID_H*y+32,ID_EXIT,ctx,0,1)
			}
		}
	}
	drawImage(GRID_X+GRID_W*gameStage.start.x+16+GRID_W/2,
		GRID_Y+GRID_H*gameStage.start.y+16+GRID_H/2,
		ID_ENTRANCE,ctx,0)
	if (BOT_X!==undefined&&(gameState===RUNNING||gameState===PAUSED||gameState==REVIEWING||gameState==FINISH)) {
		var movedDiff = {x:BOT_X-BOT_PREVX,y:BOT_Y-BOT_PREVY}
		movedDiff.x*=Math.min((new Date().getTime()-LASTPOSITIONUPDATE),gameSpeed)/gameSpeed
		movedDiff.y*=Math.min((new Date().getTime()-LASTPOSITIONUPDATE),gameSpeed)/gameSpeed
		
		var interpolatedX = GRID_X+GRID_W*(BOT_PREVX+movedDiff.x)+16+GRID_W/2
		var interpolatedY = GRID_Y+GRID_H*(BOT_PREVY+movedDiff.y)+16+GRID_H/2
		
		if (gridModeIsAvailable()&&gameState===RUNNING&&BOT_START_TAPE!==undefined) {
			GRID_X=-(interpolatedX-GRID_X)+canvas.width/2-20-GRID_W
			GRID_Y=-(interpolatedY-GRID_Y)+canvas.height/2-20-GRID_H
		}
		drawImage(
		interpolatedX,
		interpolatedY,
		ID_BOT,ctx,0*90)
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

function drawImage(x,y,img,ctx,degrees,scale=1){
    //context.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(degrees*Math.PI/180);
	ctx.scale(scale,scale)
    ctx.drawImage(IMAGE_DATA[img],(IMAGE_DATA[img].width)?-IMAGE_DATA[img].width/2:0,(IMAGE_DATA[img].height)?-IMAGE_DATA[img].height/2:0);
    ctx.restore();
}

function runEvents(ctx) {
	var elapsedTime= new Date().getTime()-TITLESCREENTIMELINE
	if (CURRENTTIMELINE.length>0) {
		var currentEvent = CURRENTTIMELINE[0]
		if (currentEvent.time<elapsedTime) {
			currentEvent.cb(ctx)
			CURRENTTIMELINE.shift()
		}
	}
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
		switch (gameState) {
			case TITLE:{
				ctx.save();
				ctx.scale(1,1)
				ctx.translate(260+320,100+320)
				ctx.rotate((dashOffset)*(Math.PI/180))
				ctx.translate(-320,-320)
				ctx.drawImage(IMAGE_GEAR,0,0)
				ctx.restore()
				runEvents(ctx)
				ctx.fillStyle=SCENEBACKGROUND
				ctx.globalAlpha=SCENEALPHA
				ctx.fillRect(0,0,canvas.width,canvas.height)
				SCENE_DRAW(ctx)
			}break;
			case MAINMENU:{
				ctx.fillStyle="rgb(180,180,180)"
				ctx.strokeStyle="black"
				ctx.beginPath()
					ctx.ellipse(24,24,20,20,0,0,2*Math.PI)
				ctx.fill()
				ctx.stroke()
				ctx.beginPath()
					ctx.ellipse(24,64,20,20,0,0,2*Math.PI)
				ctx.fill()
				ctx.stroke()
				ctx.drawImage((currentSound.muted)?IMAGE_NOAUDIO_BUTTON:IMAGE_AUDIO_BUTTON,8,8)
				ctx.drawImage(IMAGE_INFO_BUTTON,8,48)
				DisplayMenu(canvas.width/2,8,TUTORIALMENU,ctx)
				DisplayMenu((canvas.width*0.33)*0+(canvas.width*0.15)+(canvas.width*0.01),108,EASYMENU,ctx)
				DisplayMenu((canvas.width*0.33)*1+(canvas.width*0.15)+(canvas.width*0.02),108,MEDIUMMENU,ctx)
				DisplayMenu((canvas.width*0.33)*2+(canvas.width*0.15)+(canvas.width*0.03),108,HARDMENU,ctx)
				DisplayMenu((canvas.width*0.33)*2+(canvas.width*0.15)+(canvas.width*0.03),275,SANDBOXMENU,ctx)
			}break;
			case INFO:{
				ctx.fillStyle="rgb(180,180,180)"
				ctx.strokeStyle="black"
				ctx.beginPath()
					ctx.ellipse(24,24,20,20,0,0,2*Math.PI)
				ctx.fill()
				ctx.stroke()
				ctx.drawImage(IMAGE_DATA[ID_HOME],12,8)
				var split = CREDITS.split("\n")
				for (var i=0;i<split.length;i++) {
					var string = split[i]
					if (split[i][0]===">") {
						string=split[i].substring(1)
						ctx.font="bold 16px 'Zilla Slab', serif"
					} else {
						ctx.font="16px 'Zilla Slab', serif"
					}
					ctx.textAlign = "center"
					ctx.fillStyle="black"
					
					ctx.fillText(string,canvas.width/2,i*20+36)
				}
			}break;
			case STARTUP:{
				ctx.fillStyle="black"
				ctx.fillRect(0,0,canvas.width,canvas.height)
				ctx.font="16px 'Zilla Slab', serif"
				ctx.fillStyle="white"
				ctx.textAlign = "left"
				ctx.fillText("Booting...",0,24)
				ctx.fillText("Click to begin",0,48)
			}break;
			default:{
				renderGame(ctx)
				
				if (ITEM_SELECTED&&!MOBILE) {
					RenderIcon(LAST_MOUSE_X-16,LAST_MOUSE_Y-16,ctx,ITEM_SELECTED,ITEM_DIRECTION)
				}
				//drawImage(0,0,ID_CONVEYOR,ctx,0)
				//drawImage(LAST_MOUSE_X,LAST_MOUSE_Y,ID_ARROW,ctx,0)
				RenderSubmenu(ctx)
				RenderMenu(ctx)
				RenderGameInfo(ctx)
			}
		}
	}
}

function RenderSpeedbar(x,y,w,ctx) {
	var gradient = ctx.createLinearGradient(x, 32, x+w, 32);
		gradient.addColorStop(0,"rgb(105, 55, 51)")
		gradient.addColorStop(1,"rgb(54, 77, 255)")
	ctx.lineWidth = 6;
	ctx.lineCap = "round"
	ctx.strokeStyle="white"
	ctx.setLineDash([])
	ctx.beginPath()
	ctx.moveTo(x,y)
	ctx.lineTo(x+w,y)
	ctx.stroke();
	ctx.lineWidth = 4;
	ctx.lineCap = "round"
	ctx.strokeStyle=gradient
	ctx.setLineDash([])
	ctx.beginPath()
	ctx.moveTo(x,y)
	ctx.lineTo(x+w,y)
	ctx.stroke();
	ctx.lineWidth = 2;
	ctx.lineCap = "round"
	ctx.strokeStyle="yellow"
	ctx.setLineDash([])
	var cursorX = 0
	switch (gameSpeed) {
		case 1000/1:{
			cursorX=8;
		}break;
		case 1000/2:{
			cursorX=16;
		}break;
		case 1000/3:{
			cursorX=24;
		}break;
		case 1000/4:{
			cursorX=32;
		}break;
		case 1000/6:{
			cursorX=40;
		}break;
		case 1000/8:{
			cursorX=48;
		}break;
		case 1000/16:{
			cursorX=56;
		}break;
		case 1000/32:{
			cursorX=64;
		}break;
	}
	if (MOUSEDOWN && LAST_MOUSE_X>=x&&LAST_MOUSE_X<=x+w && LAST_MOUSE_Y>=y-6&&LAST_MOUSE_Y<=y+6) {
		var mouseCursorPos = Math.round((LAST_MOUSE_X-x)/8)*8
		switch (mouseCursorPos) {
			case 0:{
				gameSpeed=-1;
			}break;
			case 8:{
				gameSpeed=1000/1;
			}break;
			case 16:{
				gameSpeed=1000/2;
			}break;
			case 24:{
				gameSpeed=1000/3;
			}break;
			case 32:{
				gameSpeed=1000/4;
			}break;
			case 40:{
				gameSpeed=1000/6;
			}break;
			case 48:{
				gameSpeed=1000/8;
			}break;
			case 56:{
				gameSpeed=1000/16;
			}break;
			case 64:{
				gameSpeed=1000/32;
			}break;
		}
	}
	ctx.beginPath()
	ctx.moveTo(x+cursorX,y-4)
	ctx.lineTo(x+cursorX,y+4)
	ctx.stroke();
}

function DrawWrapText(text,x,y,w,fontHeight,ctx,topToBottom=false/*Set to true to draw from the position downward. Defaults to drawing upwards.*/) {
	var arr = text.split(" ")
	var finalText = []
	for (var i=0;i<arr.length;i++) {
		var tempText = (finalText[finalText.length-1]!==undefined)?finalText[finalText.length-1]+" "+arr[i]:arr[i]
		var newWidth = ctx.measureText(tempText).width
		if (newWidth>w) {
			finalText.push(arr[i])
		} else {
			if (finalText.length===0) {
				finalText.push(arr[i])
			} else {
				finalText[finalText.length-1]+=" "+arr[i]
			}
		}
	}
	for (var i=0;i<finalText.length;i++) {
		if (topToBottom) {
			ctx.fillText(finalText[i],x,y+i*fontHeight+4)
		} else {
			ctx.fillText(finalText[finalText.length-1-i],x,y-i*fontHeight+4)
		}
	}
}

function LevelIsBeat(levelName) {
	return completedStages[levelName]!==undefined&&completedStages[levelName].complete
}

function RenderGameInfo(ctx) {
	if (MENU.visible) {
		ctx.fillStyle="#20424a"
		ctx.fillRect(canvas.width*0.75,0,canvas.width,canvas.height*0.8)
		
		RenderSpeedbar(canvas.width*0.75+(canvas.width*0.25)/2-32,8,64,ctx)
		
		
		if (LevelIsBeat(gameStage.name)) {
			drawImage(canvas.width-18,14,ID_COMPLETE_STAR,ctx,0,0.75)
			ctx.font="11px 'Profont','Courier New', serif"
			ctx.fillStyle="white"
			ctx.textAlign = "center"
			ctx.fillText("Best Score: "+completedStages[gameStage.name].score,canvas.width*0.75+(canvas.width*0.25)/3+2,22)
		} else {
			drawImage(canvas.width-18,14,ID_INCOMPLETE_STAR,ctx,0,0.75)
		}
		
		if (BOT_START_TAPE!==undefined&&(gameState===REVIEWING||gameState===FINISH)) {
			ctx.fillStyle="#20424a"
			ctx.globalAlpha=0.6
			ctx.fillRect(canvas.width*0.75-canvas.width*0.25,4,canvas.width*0.25,5*12+56)
			ctx.globalAlpha=1
			
			ctx.font="bold 16px 'Zilla Slab', serif"
			ctx.textAlign = "left"
			ctx.strokeStyle="rgb(90, 148, 118)"
			ctx.strokeText("Original Tape",canvas.width*0.75-canvas.width*0.25,20)
			ctx.fillStyle="black"
			ctx.fillText("Original Tape",canvas.width*0.75-canvas.width*0.25,20)
			RenderTape(canvas.width*0.75-canvas.width*0.25+8,16,canvas.width*0.25-16,ctx,BOT_START_TAPE)
			ctx.font="12px 'Profont','Courier New', serif"
			ctx.fillStyle="white"
			ctx.textAlign = "left"
			ctx.fillText("Efficiency Score:",canvas.width*0.75-(canvas.width*0.25)+4,4+5*12+36)
			ctx.textAlign = "right"
			ctx.fillText(TESTSTEPS,canvas.width*0.75-8,4+5*12+36+16)
			
		}
		if (BOT_START_TAPE!==undefined) {
			RenderTape(canvas.width*0.75+8,16,canvas.width*0.25-16,ctx,GHOST_BOT_TAPE)
		}
		
		
		if (gameState===RUNNING||gameState===REVIEWING||gameState===FINISH||gameState===PAUSED) {
			ctx.font="16px 'Zilla Slab', serif"
			ctx.fillStyle="white"
			ctx.textAlign = "center"
			
			switch (typeof(EXPECTED)) {
				case "string":{
					ctx.fillText("Expected Result: ",canvas.width-canvas.width*0.25/2,canvas.height/2-52)
					ctx.fillStyle="rgb(52, 235, 140)"
					RenderTape(canvas.width*0.75+8,canvas.height/2-52,canvas.width*0.25-16,ctx,EXPECTED)
					if (RESULT) {
						ctx.fillStyle="rgb(52, 235, 140)"
						ctx.fillText("PASSED",canvas.width-canvas.width*0.25/2,canvas.height/2+24)
					} else {
						if (BOT_DID_NOT_REACH_EXIT) {
							ctx.fillStyle="rgb(235, 98, 52)"
							ctx.fillText("DID NOT EXIT",canvas.width-canvas.width*0.25/2,canvas.height/2+24)
 						} else {
							ctx.fillStyle="rgb(235, 98, 52)"
							ctx.fillText("FAILED",canvas.width-canvas.width*0.25/2,canvas.height/2+24)
						}
					}
				}break;
				case "boolean":{
					ctx.fillText("Expected Result: ",canvas.width-canvas.width*0.25/2,canvas.height-120-40)
					if (EXPECTED) {
						ctx.fillStyle="rgb(52, 235, 140)"
						ctx.fillText(" ACCEPT",canvas.width-canvas.width*0.25/2,canvas.height-100-40)
					} else {
						ctx.fillStyle="rgb(235, 98, 52)"
						ctx.fillText(" REJECT",canvas.width-canvas.width*0.25/2,canvas.height-100-40)
					}
				}break;
			}
		}
		
		if (ISTESTING) {
			ctx.font="32px 'Zilla Slab', serif"
			ctx.fillStyle="white"
			ctx.textAlign = "center"
			ctx.fillText("Testing...",(canvas.width*0.75)/2,canvas.height*0.75)
			ctx.lineWidth=2
			ctx.strokeStyle="Black"
			ctx.strokeText("Testing...",(canvas.width*0.75)/2,canvas.height*0.75)
		}
		
		var currentTime = new Date().getTime();
		if (currentTime<MESSAGETIMER) {
			ctx.font="bold 24px 'Zilla Slab', serif"
			ctx.fillStyle=(RESULT)?"rgb(32, 59, 33)":"rgb(144, 12, 63)"
			ctx.textAlign = "center"
			DrawWrapText((RESULT)?GOODQUOTES[MESSAGETIMER%GOODQUOTES.length]:BADQUOTES[MESSAGETIMER%BADQUOTES.length],(canvas.width*0.75)/2,canvas.height*0.75,(canvas.width*0.75)*0.9,24,ctx)
		}
		
		var levelDescriptionOffsetY = -16
		ctx.font="bold 20px 'Zilla Slab', serif"
		ctx.fillStyle="rgb(52, 227, 160)"
		ctx.textAlign = "center"
		ctx.fillText(gameStage.name,(canvas.width*0.75)+(canvas.width*0.25)/2,canvas.height-100+levelDescriptionOffsetY)
		ctx.strokeStyle="white"
		ctx.lineWidth=1
		ctx.beginPath()
		ctx.moveTo((canvas.width*0.75)+(canvas.width*0.25)/4,canvas.height-94+levelDescriptionOffsetY)
		ctx.lineTo((canvas.width*0.75)+((canvas.width*0.25))*0.75,canvas.height-94+levelDescriptionOffsetY)
		ctx.stroke()
		ctx.font="12px 'Zilla Slab', serif"
		ctx.fillStyle="white"
		ctx.textAlign ="left"
		DrawWrapText(gameStage.objective,(canvas.width*0.75)+8,canvas.height-84+levelDescriptionOffsetY,(canvas.width*0.25)*0.9,12,ctx,true)
	
		if (MOBILE&&gameState!==RUNNING) {
			drawImage(canvas.width*0.75-48,canvas.height*0.8-48,
			ID_OUTLINE,ctx,0)
			if (ITEM_SELECTED&&!MOVEMODE) {
				if (ITEM_SELECTED.img===ID_CONVEYOR) {
					RenderIcon(canvas.width*0.75-48-32,canvas.height*0.8-48-32,ctx,ITEM_SELECTED,ITEM_DIRECTION,undefined,undefined,2)
				} else {
					RenderIcon(canvas.width*0.75-48-16,canvas.height*0.8-48-16,ctx,ITEM_SELECTED,ITEM_DIRECTION,undefined,undefined,2)
				}
			} else {
				if (DELETEMODE) {
					drawImage(canvas.width*0.75-48,canvas.height*0.8-48,ID_DELETE_CURSOR,ctx,0,2)
				} else {
					drawImage(canvas.width*0.75-48,canvas.height*0.8-48,ID_CURSOR,ctx,0,2)
				}
			}
		}
	}
}

var DARKCOLORS = [PURPLE,GRAY,BLACK]

function drawTape(color,ctx,x,y,ySpacing,first=false,last=false,firstInRow=false) {
	ctx.font="bold 12px 'Profont','Courier New', serif"
	
	if (first) {
		ctx.fillStyle="rgb(222, 210, 158)"
		ctx.fillRect(x-8,y-8,16,16)
	}
	
	if (DARKCOLORS.includes(color)) {
		ctx.fillStyle="rgb(210,210,210)"
	} else {
		ctx.fillStyle="black"
	}
	ctx.textAlign = "center"
	switch (color) {
		case RED:{
			drawImage(x,y,ID_DOT_R,ctx,0)
		}break;
		case BLUE:{
			drawImage(x,y,ID_DOT_B,ctx,0)
		}break;
		case GREEN:{
			drawImage(x,y,ID_DOT_G,ctx,0)
		}break;
		case YELLOW:{
			drawImage(x,y,ID_DOT_Y,ctx,0)
		}break;
		case PURPLE:{
			drawImage(x,y,ID_DOT_P,ctx,0)
		}break;
		case PINK:{
			drawImage(x,y,ID_DOT_PI,ctx,0)
		}break;
		case BLACK:{
			drawImage(x,y,ID_DOT_BL,ctx,0)
		}break;
		case GRAY:{
			drawImage(x,y,ID_DOT_GR,ctx,0)
		}break;
	}
	
	if (last) {
		ctx.strokeStyle="white"
		ctx.lineWidth=1
		ctx.beginPath()
		ctx.moveTo(x-16,y)
		ctx.lineTo(x-8,y)
		ctx.moveTo(x-12,y-4)
		ctx.lineTo(x-8,y)
		ctx.moveTo(x-12,y+4)
		ctx.lineTo(x-8,y)
		ctx.stroke()
	}
	
	if (firstInRow) {
		ctx.strokeStyle="white"
		ctx.lineWidth=1
		ctx.beginPath()
		ctx.moveTo(x,y)
		ctx.lineTo(x,y-6)
		ctx.lineTo(x-112,y-6)
		ctx.lineTo(x-112,y-ySpacing)
		ctx.stroke()
	}
	
	ctx.fillText(color,x,y+4)
}
	
function tapeToBinary(tape) {
	var numb = 0;
	for (var i=tape.length-1;i>=0;i--) {
		if (tape[i]===RED) {
			numb=numb<<1;
			numb=numb|0
		} else 
		if (tape[i]===BLUE) {
			numb=numb<<1;
			numb=numb|1
		}
	}
	return numb
}

function RenderTape(x,y,width,ctx,tape) {
	var xOffset=width-24
	var yOffset=0
	var ySpacingMult=1
	var ySpacing=12
	if (tape.length>5*5) {
		ySpacingMult=(ySpacing*5)/(Math.ceil(tape.length/5)*ySpacing)
	}
	yOffset=ySpacing*ySpacingMult
	for (var i=5;i<Math.min(tape.length,1024);i++) {
		drawTape(tape[i],ctx,x+xOffset+16,y+yOffset+16,ySpacing*ySpacingMult,i===0,i!==Math.min(tape.length,1024)-1,i%5===0)
		xOffset-=24;
		if (xOffset<0) {
			xOffset=width-24;
			yOffset+=ySpacing*ySpacingMult;
		}
	}
	xOffset=width-24
	yOffset=0
	for (var i=0;i<Math.min(tape.length,5);i++) {
		drawTape(tape[i],ctx,x+xOffset+16,y+yOffset+16,ySpacing*ySpacingMult,i===0,i!==Math.min(tape.length,1024)-1,false)
		xOffset-=24;
		if (xOffset<0) {
			xOffset=width-24;
			yOffset+=ySpacing*ySpacingMult;
		}
	}
	
	if (gameStage.display!==undefined) {
		switch (gameStage.display) {
			case BINARY:{
				ctx.fillStyle="gray"
				ctx.globalAlpha=0.8
				ctx.fillRect(x,y+60,width,14)
				ctx.globalAlpha=1
				ctx.fillStyle="white"
				if (tape.includes(GREEN)) {
					var numbs = tape.split(GREEN)
					ctx.fillText(tapeToBinary(numbs[0])+","+tapeToBinary(numbs[1]),x+width/2,y+70)
				} else {
					ctx.fillText(tapeToBinary(tape),x+width/2,y+70)
				}
			}break;
			case STRING:{
				ctx.fillStyle="gray"
				ctx.globalAlpha=0.8
				ctx.fillRect(x,y+60,width,14)
				ctx.globalAlpha=1
				ctx.fillStyle="white"
				var splitString=tape.split(YELLOW)
				var finalString="\""
				for (var i=0;i<splitString.length;i++) {
					var binary = tapeToBinary(splitString[i])
					finalString+=String.fromCharCode(binary)
				}
				finalString+="\""
				ctx.fillText(finalString,x+width/2,y+70)
			}break;
		}
	}
}

function createVerticalGradient(x,y,up,ctx,scale) {
	var gradient = ctx.createLinearGradient(x, y+32*scale*((up)?1:0), x, y+32*scale*((up)?0:1));
		gradient.addColorStop(0,"rgb(124,162,157)")
		gradient.addColorStop(0.31,"black")
		gradient.addColorStop(0.6,"rgb(124,162,157)")
		gradient.addColorStop(0.61,"black")
		gradient.addColorStop(0.9,"rgb(124,162,157)")
		gradient.addColorStop(0.91,"white")
		gradient.addColorStop(1,"white")
	return gradient
}

function createHorizontalGradient(x,y,right,ctx,scale) {
	var gradient = ctx.createLinearGradient(x+32*scale*((right)?0:1), y, x+32*scale*((right)?1:0), y);
		gradient.addColorStop(0,"rgb(124,162,157)")
		gradient.addColorStop(0.31,"black")
		gradient.addColorStop(0.6,"rgb(124,162,157)")
		gradient.addColorStop(0.61,"black")
		gradient.addColorStop(0.9,"rgb(124,162,157)")
		gradient.addColorStop(0.91,"white")
		gradient.addColorStop(1,"white")
	return gradient
}

function DrawSingleConveyor(x,y,dir,ctx,scale,ghost=false) {
	ctx.lineWidth = 16*scale;
	ctx.lineCap = "square"
	if (ghost) {
		ctx.globalAlpha=0.6
		ctx.strokeStyle="rgb(0,255,0)"
	} else {
		ctx.globalAlpha=1
		ctx.strokeStyle="rgb(124,162,157)"
	}
	ctx.setLineDash([])
	if (dir===LEFT||dir===RIGHT) {
		ctx.beginPath()
		ctx.moveTo(x+8*scale,y+16*scale)
		ctx.lineTo(x+24*scale,y+16*scale)
		ctx.stroke()
		ctx.setLineDash([5*scale,5*scale])
		ctx.lineDashOffset = -dashOffset*((dir===LEFT)?-1*scale:1*scale);
		ctx.strokeStyle=createHorizontalGradient(x,y,dir===RIGHT,ctx,scale)
		ctx.lineWidth = 3.5*scale;
		ctx.beginPath()
		ctx.moveTo(x+2*scale,y+16*scale)
		ctx.lineTo(x+30*scale,y+16*scale)
		ctx.stroke()
	} else {
		ctx.beginPath()
		ctx.moveTo(x+16*scale,y+8*scale)
		ctx.lineTo(x+16*scale,y+24*scale)
		ctx.stroke()
		ctx.strokeStyle="rgb(34,62,57)"
		ctx.setLineDash([5*scale,5*scale])
		ctx.lineDashOffset = -dashOffset*((dir===DOWN)?1:-1);
		ctx.strokeStyle=createVerticalGradient(x,y,dir===UP,ctx,scale)
		ctx.lineWidth = 3.5*scale;
		ctx.beginPath()
		ctx.moveTo(x+16*scale,y+2*scale)
		ctx.lineTo(x+16*scale,y+30*scale)
		ctx.stroke()
	}
	ctx.globalAlpha=1
}

function GetOppositeDirection(dir) {
	switch (dir) {
		case UP:{return DOWN}
		case DOWN:{return UP}
		case LEFT:{return RIGHT}
		case RIGHT:{return LEFT}
	}
}

function DrawConnectedConveyor(x,y,ctx,connections,dir,scale,pass=0) {
	ctx.lineWidth = 15*scale;
	ctx.lineCap = "round"
	ctx.strokeStyle="rgb(124,162,157)"
	switch (Object.keys(connections).length) {
		case 0:{
			DrawSingleConveyor(x*scale,y*scale,dir,ctx,scale)
		}break;
		default:{
			ctx.lineWidth = 15*scale;
			ctx.lineCap = "square"
			ctx.strokeStyle="rgb(124,162,157)"
			ctx.setLineDash([])
			ctx.beginPath()
			ctx.moveTo(x+16*scale,y+16*scale)
			var endingPoint={x:0,y:0}
			switch (dir) {
				case UP:{startingPoint={x:0,y:-12*scale};endingPoint={x:0,y:-14*scale}}break;
				case DOWN:{startingPoint={x:0,y:12*scale};endingPoint={x:0,y:14*scale}}break;
				case RIGHT:{startingPoint={x:12*scale,y:0};endingPoint={x:14*scale,y:0}}break;
				case LEFT:{startingPoint={x:-12*scale,y:0};endingPoint={x:-14*scale,y:0}}break;
			}
			ctx.moveTo(x+16*scale+startingPoint.x,y+16*scale+startingPoint.y)
			ctx.lineTo(x+16*scale+endingPoint.x,y+16*scale+endingPoint.y)
			if (pass===0) {ctx.stroke();}
			for (var connection of Object.keys(connections)) {
				var startingPoint={x:x,y:y}
				switch (Number(connection)) {
					case UP:{startingPoint={x:x+16*scale,y:y+8*scale}}break;
					case DOWN:{startingPoint={x:x+16*scale,y:y+24*scale}}break;
					case RIGHT:{startingPoint={x:x+24*scale,y:y+16*scale}}break;
					case LEFT:{startingPoint={x:x+8*scale,y:y+16*scale}}break;
				}
				ctx.lineWidth = 16*scale;
				ctx.lineCap = "square"
				ctx.strokeStyle="rgb(124,162,157)"
				ctx.setLineDash([])
				ctx.beginPath()
				ctx.moveTo(startingPoint.x,startingPoint.y)
				ctx.lineTo(x+16*scale,y+16*scale)
				if (pass===0) {ctx.stroke()}
				ctx.setLineDash([5*scale,5*scale])
				ctx.lineDashOffset = -dashOffset*1;
				if (Number(connection)===RIGHT||Number(connection)===LEFT) {
					ctx.strokeStyle=createHorizontalGradient(x,y,Number(connection)===LEFT,ctx,scale)
				} else {
					ctx.strokeStyle=createVerticalGradient(x,y,Number(connection)===UP,ctx,scale)
				}
				ctx.lineWidth = 3.5*scale;
				ctx.beginPath()
				startingPoint={x:x,y:y}
				switch (Number(connection)) {
					case UP:{startingPoint={x:x+16*scale,y:y+2*scale}}break;
					case DOWN:{startingPoint={x:x+16*scale,y:y+30*scale}}break;
					case RIGHT:{startingPoint={x:x+30*scale,y:y+16*scale}}break;
					case LEFT:{startingPoint={x:x+2*scale,y:y+16*scale}}break;
				}
				ctx.moveTo(startingPoint.x,startingPoint.y)
				ctx.lineTo(x+16*scale,y+16*scale)
				if (pass===1) {ctx.stroke()}
			}
			
			if (dir===RIGHT||dir===LEFT) {
				ctx.strokeStyle=createHorizontalGradient(x,y,dir===LEFT,ctx,scale)
			} else {
				ctx.strokeStyle=createVerticalGradient(x,y,dir===UP,ctx,scale)
			}
			ctx.setLineDash([5*scale,5*scale])
			ctx.lineWidth = 3.5*scale;
			ctx.beginPath()
			switch (dir) {
				case UP:{startingPoint={x:0,y:-14*scale}}break;
				case DOWN:{startingPoint={x:0,y:14*scale}}break;
				case RIGHT:{startingPoint={x:14*scale,y:0}}break;
				case LEFT:{startingPoint={x:-14*scale,y:0}}break;
			}
			ctx.moveTo(x+16*scale,y+16*scale)
			ctx.lineTo(x+16*scale+startingPoint.x,y+16*scale+startingPoint.y)
			if (pass===1) {ctx.stroke();}
		}break;
	}
}

function HasRelativeConnection(x,y,dir) {
	return (gameGrid[y][x].direction===dir ||
		(gameGrid[y][x].direction2!==undefined&&gameGrid[y][x].direction2===dir) ||
		(
			gameGrid[y][x].type==="BRANCH" &&
			(gameGrid[y][x].direction===getClockwiseDirection(dir) || gameGrid[y][x].direction===getCounterClockwiseDirection(dir) ||
			(gameGrid[y][x].direction2!==undefined&&gameGrid[y][x].direction2===getClockwiseDirection(dir)) ||
			(gameGrid[y][x].direction2!==undefined&&gameGrid[y][x].direction2===getCounterClockwiseDirection(dir)))
		) ||
		(
			x===gameStage.start.x&&y===gameStage.start.y
		)
	)
}

function RenderConveyor(x,y,ctx,icon_definition,dir=0,background=undefined,grid=undefined,scale) {
	if (grid===undefined) {
		//This is the button version.
		if (BRIDGEDBELT) {
			DrawSingleConveyor(x,y,dir+1,ctx,scale,true)
			DrawSingleConveyor(x,y,dir,ctx,scale)
		} else {
			DrawSingleConveyor(x,y,dir,ctx,scale)
		}
	} else 
	if (gameGrid[grid.y][grid.x].direction2!==undefined) {
		DrawSingleConveyor(x,y,dir,ctx,scale)
		DrawSingleConveyor(x,y,gameGrid[grid.y][grid.x].direction2,ctx,scale)
	} else
	{
		var connections = {}
		if (grid.x>0) {if (HasRelativeConnection(grid.x-1,grid.y+0,RIGHT)){connections[LEFT]=true}}
		if (grid.x<gameGrid[grid.y].length-1) {if (HasRelativeConnection(grid.x+1,grid.y+0,LEFT)){connections[RIGHT]=true}}
		if (grid.y>0) {if (HasRelativeConnection(grid.x+0,grid.y-1,DOWN)){connections[UP]=true}}
		if (grid.y<gameGrid.length-1) {if (HasRelativeConnection(grid.x+0,grid.y+1,UP)){connections[DOWN]=true}}
		DrawConnectedConveyor(x,y,ctx,connections,dir,scale)
		DrawConnectedConveyor(x,y,ctx,connections,dir,scale,1)
	}
}

function DrawDirectionalColorText(x,y,color1,color2,dir,ctx) {
	ctx.font="bold 12px 'Profont','Courier New', serif"
	ctx.fillStyle="black"
	ctx.textAlign = "center"
	switch (dir) {
		case UP:{
			ctx.fillText(color1,x+12,y-8)
			ctx.fillText(color2,x-12,y-8)
		}break;
		case DOWN:{
			ctx.fillText(color1,x-12,y+14)
			ctx.fillText(color2,x+12,y+14)
		}break;
		case RIGHT:{
			ctx.fillText(color1,x+12,y+4+12)
			ctx.fillText(color2,x+12,y+4-12)
		}break;
		case LEFT:{
			ctx.fillText(color1,x-10,y+4-12)
			ctx.fillText(color2,x-10,y+4+12)
		}break;
	}
}

function RenderIcon(x,y,ctx,icon_definition,dir=0,background=undefined,renderToGrid=undefined,scale=1) {
	if (background!==undefined) {
		ctx.fillStyle=background
		ctx.fillRect(x,y,32,32)
	}
	if (icon_definition.img===ID_CONVEYOR) {
		RenderConveyor(x,y,ctx,icon_definition,dir,background,renderToGrid,scale)
	} else {
		if (icon_definition.img===ID_BRANCH) {
			drawImage(
				x+16,
				y+16,
				icon_definition.img,ctx,dir*90,scale)
		} else {
			drawImage(
				x+16,
				y+16,
				icon_definition.img,ctx,dir*90-90,scale)
		}
		switch (icon_definition.img) {
			case ID_BRANCH:{
				drawImage(
					x+16,
					y+16,
					GetArrowImage(icon_definition.color1),ctx,dir*90+0,scale)
				drawImage(
					x+16,
					y+16,
					GetArrowImage(icon_definition.color2),ctx,dir*90+180,scale)
				DrawDirectionalColorText(x+16,y+16,icon_definition.color1,icon_definition.color2,dir,ctx)
			}break;
			case ID_WRITER:{
				drawImage(
					x+16,
					y+16,
					GetDotImage(icon_definition.color1),ctx,dir*90-90,scale)
				ctx.font="bold 12px 'Profont','Courier New', serif"
				var darkcolors = [PURPLE,GRAY,BLACK]
				if (darkcolors.includes(icon_definition.color1)) {
					ctx.fillStyle="rgb(210,210,210)"
				} else {
					ctx.fillStyle="black"
				}
				ctx.textAlign = "center"
				ctx.fillText(icon_definition.color1,x+16,y+16+4)
			}break;
		}
	}
}

function DisplayMenu(x,y,menu,ctx) {
	ctx.fillStyle="#20424a"
	var totalRowHeight = Math.floor(menu.levels.length / menu.cols)*24+16+24
	ctx.fillRect(x-menu.width/2,y,menu.width,totalRowHeight)
	ctx.font="bold 16px 'Zilla Slab', serif"
	ctx.fillStyle="white"
	ctx.textAlign = "center"
	ctx.fillText(menu.title,x,y+16)
	ctx.beginPath()
	ctx.lineWidth = 1;
	ctx.strokeStyle="gray"
	ctx.moveTo(x-menu.width/2+4,y+18)
	ctx.lineTo(x+menu.width/2-4,y+18)
	ctx.stroke()
	for (var i=0;i<menu.levels.length;i++) {
		ctx.font="16px 'Zilla Slab', serif"
		ctx.fillStyle="white"
		ctx.textAlign = "left"
		var col = i % menu.cols
		var row = Math.floor(i / menu.cols)
		var colWidth = menu.width/menu.cols
		var levelBoxBounds = {x:x+col*colWidth-((menu.cols!==1)?colWidth:colWidth/2),y:y+24+24*row,w:colWidth,h:16}
		if (MouseOverBounds(levelBoxBounds)) {
			if (MOUSEDOWN&&ALLOWEDTOCLICK) {
				MOUSEDOWN=false
				ALLOWEDTOCLICK=false
				loadStage(menu.levels[i])
				gameState=WAITING
			}
			ctx.fillStyle="rgb(132, 186, 133)"
			ctx.fillRect(levelBoxBounds.x,levelBoxBounds.y,levelBoxBounds.w,levelBoxBounds.h)
		}
		ctx.fillStyle="white"
		if (LevelIsBeat(menu.levels[i].name)) {
			drawImage(x+col*colWidth+16-((menu.cols!==1)?colWidth:colWidth/2)-8,y+32+24*row,ID_COMPLETE_STAR,ctx,0,0.5)
		}
		ctx.fillText(menu.levels[i].name,x+col*colWidth-((menu.cols!==1)?colWidth/2:0)+20-colWidth/2,y+16+24+24*row)
		if (LevelIsBeat(menu.levels[i].name)) {
			ctx.font="12px 'Profont','Courier New', serif"
			ctx.fillStyle="white"
			ctx.textAlign = "center"
			ctx.fillText(completedStages[menu.levels[i].name].score,x+col*colWidth-((menu.cols!==1)?colWidth/2:0)+colWidth/2-16,y+16+24+24*row)
		}
	}
}

function MouseOverBounds(bounds) {
	return (LAST_MOUSE_X>=bounds.x&&
	LAST_MOUSE_X<=bounds.x+bounds.w&&
	LAST_MOUSE_Y>=bounds.y&&
	LAST_MOUSE_Y<=bounds.y+bounds.h)
}

function GetArrowImage(col) {
	switch (col) {
		case RED:{
			return ID_ARROW_R
		}break;
		case BLUE:{
			return ID_ARROW_B
		}break;
		case GREEN:{
			return ID_ARROW_G
		}break;
		case YELLOW:{
			return ID_ARROW_Y
		}break;
		case PURPLE:{
			return ID_ARROW_P
		}break;
		case PINK:{
			return ID_ARROW_PI
		}break;
		case BLACK:{
			return ID_ARROW_BL
		}break;
		case GRAY:{
			return ID_ARROW_GR
		}break;
	}
}

function GetDotImage(col) {
	switch (col) {
		case RED:{
			return ID_DOT_R
		}break;
		case BLUE:{
			return ID_DOT_B
		}break;
		case GREEN:{
			return ID_DOT_G
		}break;
		case YELLOW:{
			return ID_DOT_Y
		}break;
		case PURPLE:{
			return ID_DOT_P
		}break;
		case PINK:{
			return ID_DOT_PI
		}break;
		case BLACK:{
			return ID_DOT_BL
		}break;
		case GRAY:{
			return ID_DOT_GR
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
			if (SubmenuButtonIsUnlocked(button)) {
				var buttonX = ((index%3)*48)+16
				var buttonY = canvas.height*0.8-(Math.floor(index/3)*48)-40
				RenderIcon(buttonX,buttonY,ctx,button,ITEM_DIRECTION,(LAST_MOUSE_X>=buttonX&&LAST_MOUSE_X<=buttonX+32&&LAST_MOUSE_Y>=buttonY&&LAST_MOUSE_Y<=buttonY+32)?"#555555":"#b5b5b5")
				index++;
			}
		}
	}
}

function SubmenuButtonIsUnlocked(button) {
	return gameStage.tutorial===undefined||!gameStage.tutorial||button.color1===RED||button.color1===BLUE
}

function ButtonIsUnlocked(button) {
	if (button===HOME_BUTTON&&gameStage.tutorial&&!LevelIsBeat(gameStage.name)) {
		return false
	}
	return gameStage.locked===undefined||(!gameStage.locked.includes(button))
}

function isMouseOverButton(button) {
	return LAST_MOUSE_X>=button.x&&
		LAST_MOUSE_X<=button.x+button.w&&
		LAST_MOUSE_Y>=button.y&&
		LAST_MOUSE_Y<=button.y+button.h
}

function DisplayTooltip(button,ctx) {
	//240x(20*lines) (16pt font)
	var tooltipSplit=[]
	if (MOBILE&&button.mobileTooltip!==undefined){
		tooltipSplit=button.mobileTooltip.split("\n")
	} else {
		tooltipSplit=button.tooltip.split("\n")
	}
	var tooltipBounds = {
		x:Math.min(Math.max(LAST_MOUSE_X-120,0),canvas.width*0.75-240),
		y:LAST_MOUSE_Y-tooltipSplit.length*20-4,
		w:240,
		h:tooltipSplit.length*16+8
	}
	ctx.globalAlpha=0.9
	ctx.fillStyle="#20424a"
	ctx.fillRect(tooltipBounds.x,tooltipBounds.y,tooltipBounds.w,tooltipBounds.h)
	ctx.strokeStyle="white"
	ctx.lineWidth=1
	ctx.setLineDash([])
	ctx.strokeRect(tooltipBounds.x,tooltipBounds.y,tooltipBounds.w,tooltipBounds.h)
	ctx.fillStyle="white"
	ctx.textAlign = "left"
	for (var i=0;i<tooltipSplit.length;i++) {
		if (i===0) {
			ctx.font="bold 12px 'Zilla Slab', serif"
		} else {
			ctx.font="12px 'Zilla Slab', serif"
		}
		ctx.fillText(tooltipSplit[i],tooltipBounds.x+8,tooltipBounds.y+i*16+16)
	}
	ctx.globalAlpha=1
}

function RenderMenu(ctx) {
	if (MENU.visible) {
		ctx.fillStyle="#20424a"
		ctx.fillRect(0,canvas.height*0.8,canvas.width,canvas.height*0.2)
		var buttonX = 16
		var buttonY = canvas.height*0.8+16
		var mouseOverButton = undefined
		var mousedOver = false
		
		for (var button of MENU.buttons) {
			button.x=buttonX
			button.y=buttonY
			button.w=32
			button.h=32
			if (ButtonIsUnlocked(button)) {
				if (mouseOverButton===undefined&&isMouseOverButton(button)) {
					mousedOver=true
					if (MOUSEOVERTIME===-1) {
						MOUSEOVERTIME=new Date().getTime()
					} else 
					if (MOBILE&&new Date().getTime()-MOUSEOVERTIME>=4000 || !MOBILE&&new Date().getTime()-MOUSEOVERTIME>=1000) {
						mouseOverButton = button
					}
				}
				if (button.lastselected) {
					RenderIcon(buttonX,buttonY,ctx,button.lastselected,(button.cb===undefined)?ITEM_DIRECTION:0,"#b5b5b5")
				} else {
					AddButton(button.img,buttonX,buttonY,ctx,button,(button.cb===undefined)?ITEM_DIRECTION:0)
				}
			}
			buttonX+=47
		}
		if (mouseOverButton!==undefined) {
			DisplayTooltip(mouseOverButton,ctx)
		}
		if (!mousedOver) {
			MOUSEOVERTIME=-1
		}
		
		if (gridModeIsAvailable()) {
			AddButton(MOVE_BUTTON.img,MOVE_BUTTON.x,MOVE_BUTTON.y,ctx,MOVE_BUTTON,MOVE_BUTTON.cb)
		}
	}
}

function gridModeIsAvailable() {
	return (gameGrid.length>5||(gameGrid.length>0&&gameGrid[0].length>5))&&!DELETEMODE
}

function AddButton(img,x,y,ctx,button,dir=0) {
	ctx.fillStyle="#b5b5b5"
	ctx.fillRect(x,y,32,32)
	if (img===ID_WRITER) {
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