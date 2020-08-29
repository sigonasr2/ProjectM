function loadScript(url, callback)
{
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = callback;
    script.onload = callback;
    head.appendChild(script);
}

var testsPass=undefined;

class describe {
	constructor(testname) {
		this.testname=testname
		this.beforecb = undefined;
		this.cb = undefined;
		console.log(this.testname)
	}
	
	beforeEach = (cb)=>{
		this.beforecb = cb
		return this
	}
	
	it = (checkname,cb)=>{
		console.log("->"+checkname)
		this.beforecb()
		this.cb=cb;
		this.cb()
		return this
	}
}

function expect(testval1,testval2,test) {
	if (testval1!==testval2) {
		console.log("    Test Failed!")
		testsPass=false
	} else 
	{
		console.log("    Test Passed!")
	}
}

function AllBlankSpaces(level) {
	for (var x=0;x<level.length;x++) {
		for (var y=0;y<level.length;y++) {
			if (Object.keys(level[y][x]).length!==0) {
				return false;
			}
		}
	}
	return true;
}

function runTests() {
	console.log("Running test suite...")
	new describe("Bot moving")
	.beforeEach(()=>{
		gameGrid=[]
		gameState=WAITING
		BOT_X=-1
		BOT_Y=-1
		BOT_DIR=RIGHT
		BOT_STATE=ALIVE
		BOT_TAPE=[{color:RED},{color:BLUE}]
		lastGameUpdate=0
	})
	.it("Blank level exists.",()=>{
		var starttime = new Date().getTime()
		expect(AllBlankSpaces(LEVEL0),true)
		console.log("    ("+(new Date().getTime()-starttime)+"ms)")
	})
	.it("Bot moves to the right initially.",()=>{
		var starttime = new Date().getTime()
		expect(function(){
			gameGrid=createGrid(5,5)
			placeBot(0,2)
			runBot(true)
			if (BOT_X===1&&BOT_Y===2) {
				return true
			} else {
				return false
			}
		}(),true)
		console.log("    ("+(new Date().getTime()-starttime)+"ms)")
	})
	.it("Bot obeys conveyor belt rules",()=>{
		var starttime = new Date().getTime()
		expect(function(){
			loadLevel(LEVEL1,0,2)
			for (var i=0;i<11;i++) {runBot(true)}
			if (BOT_X===2&&BOT_Y===1) {
				return true
			} else {
				return false
			}
		}(),true)
		console.log("    ("+(new Date().getTime()-starttime)+"ms)")
	})
	.it("Bot obeys branch rules",()=>{
		var starttime = new Date().getTime()
		expect(function(){
			loadLevel(LEVEL2,0,2)
			for (var i=0;i<3;i++) {runBot(true)}
			if (BOT_X===2&&BOT_Y===3) {
				return true
			} else {
				return false
			}
		}(),true)
		console.log("    ("+(new Date().getTime()-starttime)+"ms)")
	})
	.it("Bot obeys branch rules with different colored tape.",()=>{
		var starttime = new Date().getTime()
		expect(function(){
			loadLevel(LEVEL2,0,2)
			BOT_TAPE = [{color:BLUE}]
			for (var i=0;i<3;i++) {runBot(true)}
			if (BOT_X===2&&BOT_Y===1) {
				return true
			} else {
				return false
			}
		}(),true)
		console.log("    ("+(new Date().getTime()-starttime)+"ms)")
	})
	
	if (testsPass===undefined) {
		testsPass=true
	}
}


function runGame() {	
	setupGame();
	loadLevel(LEVEL2,0,2)
	setInterval(()=>{
		step()
		draw()
	},1000/60)
	console.log("Running")
}

loadScript("game.js",runTests)

initializeGame()

function initializeGame() {
	if (testsPass) {
		runGame()
	} else {
		setTimeout(()=>{
			initializeGame()
		},1000)
	}
}
