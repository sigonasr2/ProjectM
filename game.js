var canvas;

const IMAGE_CONVEYOR = new Image();
IMAGE_CONVEYOR.src ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAANCAYAAADISGwcAAAACXBIWXMAAADGAAAAxgGwdJvFAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAj5JREFUOI2l1V1IU2Ecx/Hv2dnOfKlIirpRb3xJyJokBFl04bVeF0QvFhKGiImGWzrdUDY0dFik2Jt0YQVGRBJBb2Io5lstMs2yi6LoSgqlbWc753TVbJ0zJfe7/H84D7/n/C8ewTc4pGGQsBzCIlmNaA2TsUiSoRnFFA/mX0/x9O4tQ5sefsbk88eG9mLwHu8mxhIvADDY18vIw/u6uaao9Pu8+EeGdaZEwtzwNPHBP514AU3TGOj2Mfrogc5UReFmu5uZ8VGdheUQV9x2Ft76EysAUFKyn4HLnUwNPYmZS1aJ4uJC+rzNvH81GWNbtqZhs2Vx1W3n8/xsYgWqqw9RWnqA/k4Pb0ZXfrkgCDQ3naJoXz7XWs7H3NZiEWlvqyRvRwY9zjq+fvq4/gKCIFBTc5jNaRu4c/ECocCvqImiCYfjGGZRoN/nRVWUqCUlSTQ2liEHA9zualt/gUhEoaGhl6WlIGUON9bklKiFQjL19m4wmTlR78IkilFbXg5gd/SQsnETR2sb455vXquAy3Wd8YlZyp0esncVROeaqlJbd4m5uS9UtHaQkZ0bNTkUpqqqk2/ff1Dp7WJbesb/F1BVFYCxlzOcdLjJLShcMU1FlsP4/QucdrWRmZMX893i4k+CssKZ1g62p2euesG4K9A0DZMocvyck517i/5FLJKVcqeHrHybzpJTU6lo6SA9K5e1EreAIAgcOVvP7qKDOhPNZsrsLnJse3T2p9jfK1ktQry3QIlEEM3GG1qvGeU3ALjbp7CJK1kAAAAASUVORK5CYII="
const IMAGE_WRITER = new Image();
IMAGE_WRITER.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAACgAAAAoAFdfrujAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAOhJREFUWIVjZCARhDX17njy4Ys5NjklYYHlS6rzs0gxj4VUB7z+/J352aevAtjkeDnYSTWOgYlkHVQGow4YdcCoA0YdMOAOYIxtm3T61ddvrETr+P9f6eefv7zYpNhZWN4yMDI8IdYoMW6u3yx337xXwVW2kwGEoZgo8Jnv54cBj4JRB4w6gEVfUmSOojD/f2I1fPv9J+z9tx/y2OREuLkusLMw7SbWLD42VkZGYhXDgGNpy+777z+5YJNTFxOavrOtgqQ24YBHwagDRh0w6oBRBwy4A0juHYvycv79+ffvB6xy3JwkOwAAdhs7qElosC8AAAAASUVORK5CYII="
const IMAGE_ARROW = new Image();
IMAGE_ARROW.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAPCAYAAAAoAdW+AAAACXBIWXMAAAC/AAAAvwFipAVzAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAQlJREFUGJVdzrGRglAUheEfeD4YjB4WYCQJWILRFgAFODSxySaWsP1sAQQWQEgCZAQwOs7AA5EN3MFxT/rNufcYp9Np7rqONE05n8/85Rv4MtfrNa7rcjgciOMYKeUMfAI/pmVZeJ6HbdvsdjuSJDE2mw3Ah2kYBmEYopRCSolSiuPxiO/7mABCCPb7PUopVqsVUkqiKHoigJRyuSCEAHghgOM4BEGAUgrLshD8i+u6bLdbpml6bwL0fU9Zllwul3fUWpNlGU3ToLV+4TiOZFlG27bc73eqqnriNE0LDMMAQFEUmPM8L6C1Xl4URYH5eDxo25au6xa4Xq/UdY243W70ff+2OM9zAH4BBIduqM7GcJMAAAAASUVORK5CYII="
const IMAGE_BOT = new Image();
IMAGE_BOT.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAgCAYAAAD5VeO1AAAACXBIWXMAAABrAAAAawEOX1tRAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAhNJREFUSIntk29IE2Ecx7+3u905162x2IS5cbgj0Ep0w6G9EQshDIwZFRq+7IVQ+NK3e7FXgi/TIAoDX0Rofxn4Ynu34QIXV4Nhb+auEa5DzjxLt/OY1wtx2Fw1ohe9uM+rh9/zPB/4fnkewMDA4P+FaOTQnf7+jh6fj3Pb7cTnrS0tns9nXyQSxb+WR0Ih/kpn5z0nyw57HA6eMpmqe3v7+5WN7e33BVleeiYIDx7G40o9B1lv+HpycvRGMPiSd7kuvxNFx2o+j7MtLaBIEkVFwZNk0mSzWNwD7e2D3a2t1857vak3gvDlj/L74+OBEb//FUNRp6/PziItitgplzGfTGIkEMDgzAwueDx4nEjgbS6H2319zjNW64AsSfMZSdJ+W8tqODzdw3FTAJDK5XCR5wEAu6oKK8NAq1RgJknouo61YhHn3G4AwGI6ffPW3NzScZepVg5d14+WR2IAsDIMAMBMHoYlCKIqBoAD4KBWdUKeWl9/ulMqfTs++66q6A6H0Twxgd5IBGXtp/QQNzezzwVhudZ1ovPlTEYKtrV9dNpsl5pp2goANEXhVFMTfE4nrnZ1wc9xIIjDRkVZ/hDLZsemo9GNWtcvn+LU0JAnFAjcdbHssNtu77DQdDWlUiqpkqKkP8ny4kIs9mghk9mt52joE40Gg95enudJs5nd0zQ5urKyliwUvjZy18DAwOBf8wM6KLN5YP6+kAAAAABJRU5ErkJggg=="
const IMAGE_BRANCH = new Image();
IMAGE_BRANCH.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAcCAYAAAB2+A+pAAAACXBIWXMAAAC/AAAAvwFipAVzAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABK5JREFUSIm1ls1rG0cYh59dSdGHv+TdBCRa2wQhhVqy40JIDoHaJK1JQijpISEUCqW3/AG999ZTb6VQeigtPbRpUvqRthAntO4ph1LT4KxsOR+yrdhJrcqKVitZu9rdHlarWIolHIf+QKCdeed9dn4z887C3hQBrgGfAn17zPHcehsoAnbjlwXe+D+BEvC1C5yYmLBjsZgLt4DPgIHdJhN2Gfc68DnwcigUsk+dOiXEYjEAFhcXmZmZsavVqgCsA5eAH14UHAA+AN4HxEQiwfT0NMFgsCVI0zRu3LhBJpNxm75tvMC/ewGngMvAK36/3z558qSQTCa7vmU6nebmzZvu7HPAO8DvO8V6OuR4F/geiA4NDXH+/HlhZGSkKxQgGo0yOjoqFItFCoVCfwO8D/gDZx90BAeAj4APAd+xY8c4c+YMwWCQgYEBarVaV3A4HEYUReLxOOFwmGw2K1iW9RpwGvgNKOwETgDXgTeDwaB97tw5YWJiAo/HgyzLiKJItVrtCu7t7aWnpwdd15FlmUQiITx8+BBN014C3sOx//Z28FvAL8BwNBrlwoULQiQSQRRFJEkiFotRKpXQNK0ruKenh8OHD1MulzFNE5/Px/j4OIIgkMvl9jU4SWDGA3zcsNd/9OhRzp49SyAQaELj8TiyLLO2trYr8NDQEAcOHEBVVQzDwDRNhoeHiUajZLNZ2zCMJHBaBF4FmJqaYnJyElEUm/bG43EkSeoK20k+n4+xsTFkWW4evYMHDzI1NeWeoqwIXAUoFosAeDweJEkikUjsCerK6/UyNjaGJEmEQiEAlpeX3e6fROA7wF5aWkIQBAYHBzl06BDhcHjPUFcej4dUKkUoFMLr9fLgwQNwSuyvIk6Rn9M0jdXVVXRdJ5fLYVlWt5y7kmVZZDIZdF1neXmZSqUC8CewJjZirgIsLS1RKpXY2NhAUZQXgluWRTqdJp/PUyqVuH//vtv1M4ALvgJOwQen9ubzeebn5zFN87mhpmmiKAr5fB5VVQG4d++e230NwNt4yACKqqqjjx49IhKJoGkatm1z584d2mv0rVu3WFlZwe/3c/z4cfbv398CTafTFAoFyuUyAKqqsrGxAc7t9Re0Vq4IMBkKhXDrsmEY1Ot1SqUSpmm6a0QwGOTIkSP09fUxOztLKpUCnHNcKBQoFAotZ15RFNfqy8CP8NRqaNidTqexbbvZWKlU2NzcbLFclmUEQaBWq9Hf398y23YoPF1CnIuHdvBt4O8nT56Qy+VaBlYqFTRNQxCe3qJzc3MoisKJEyeabaqqNl1xVS6X3XybOHfBM2CALwHm5+dp19bWVssuf/z4MdPT0/j9/mabYRjPjFtYWHAdvALoncBfAcbi4iK6rtNNyWSyxYFOWlhYcP9+s729HfwPcN0wDO7evds1Yfu676Riscj6+rqbd7YbGOAL2Nnu7RofHycQCHSNaZttfXuf95loZ7tvrqysDKqqSl/f7r/XTdPEMAwsy0LX9e3gy+2xnRbpE+CSz+fD4+n0WQaiKGJZFvV6nXq93ilsFRjBuRya2mnG4Nh90TCM9p3aC/jaYlUcGzWcXVsFtoAaUMEpkXbbGP4DeoT7jGhhWUQAAAAASUVORK5CYII="
const IMAGE_QUESTIONMARK = new Image();
IMAGE_QUESTIONMARK.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAgCAYAAAAffCjxAAAACXBIWXMAAAO7AAADuwGu9yalAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAgtJREFUSInVlM2rMVEAxp8zXqYJsZGPha8hJIqyUFI2KPHf+K9YyV8wxUIiFpY+k4gFM8nn3MVbc++5uIbexX2f3fOcM79z5jlnhpTLZfl0OmGxWGA+n2O1WmG9XkMURRyPR8iyDJZlYTAYYLPZ4PF44PP5wDAMvor4/X55OBzifD5DrfR6PTKZDEKh0CcIgKya8E3RaBTZbBaEEPz5PkgIgcVigdFoBMdxuF6v2G63WCwWN7vu9XrgOA7pdPoviGEYeL1ehMNhuFwusCx7s/rhcECn00Gj0cDlclHyVquFUCgEEolE5GQyCZPJpOp1hsMhqtUqZPmzkXg8Diafz6uGAFBO7avG4zGYB/N/lNPppPxut3sPpNPpbrK3QJIkUV6v178Hmk6nlHc4HK+DlsslRqMRlQUCgddA+/0etVqNOnq73Q6e529v9iNJkoRKpYLNZqNkWq0WuVwOANSBJpMJ6vU6RFFUMo1Gg0KhAIvF8hwkSRIEQUC/36dylmVRKpXgdruV7C7ocrmg3W6j2WzieDxSYzabDcViEWazmcrvggRBQKvVojKdTodUKoV4PA5CyM0zd0HX65XyPM8jm83CYDDcmw5A5c1OJBI/QlSD1Oj3ge6W7XA4qP/zs34egoLBIILB4Es7+k86GgwG2G63irdardR3pRrU7XYxm80UH4vFnoJ+X0f/DPQBTWisRXkNpbwAAAAASUVORK5CYII="
const IMAGE_WRITER = new Image();
IMAGE_WRITER.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAACgAAAAoAFdfrujAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAOhJREFUWIVjZCARhDX17njy4Ys5NjklYYHlS6rzs0gxj4VUB7z+/J352aevAtjkeDnYSTWOgYlkHVQGow4YdcCoA0YdMOAOYIxtm3T61ddvrETr+P9f6eefv7zYpNhZWN4yMDI8IdYoMW6u3yx337xXwVW2kwGEoZgo8Jnv54cBj4JRB4w6gEVfUmSOojD/f2I1fPv9J+z9tx/y2OREuLkusLMw7SbWLD42VkZGYhXDgGNpy+777z+5YJNTFxOavrOtgqQ24YBHwagDRh0w6oBRBwy4A0juHYvycv79+ffvB6xy3JwkOwAAdhs7qElosC8AAAAASUVORK5CYII="

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


var GRID_W = 32
var GRID_H = 32
var GRID_X = 20
var GRID_Y = 20


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

function updateMouse(e) {
	//console.log(getMousePos(canvas,e))
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
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