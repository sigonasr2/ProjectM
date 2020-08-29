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
var TestSuite;

class describe {
	constructor(testname) {
		this.testname=testname
		this.beforecb = undefined;
		this.cb = undefined;
		this.totaltests = 0;
		this.passedtests = 0;
		this.starttime = 0;
		console.log(this.testname)
	}
	
	beforeEach = (cb)=>{
		this.beforecb = cb
		return this
	}
	
	it = (checkname,cb)=>{
		this.starttime = new Date().getTime()
		console.log("->"+checkname)
		this.beforecb()
		this.cb=cb;
		this.cb()
		return this
	}
}

function expect(testval1,testval2,test) {
	if (testval1!==testval2) {
		console.log("    Test Failed!"+" ("+(new Date().getTime()-TestSuite.starttime)+"ms)")
		TestSuite.totaltests++
		testsPass=false
	} else 
	{
		TestSuite.totaltests++
		TestSuite.passedtests++
		console.log("    Test Passed!"+" ("+(new Date().getTime()-TestSuite.starttime)+"ms)")
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
	TestSuite = new describe("Bot moving")
	TestSuite
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
		expect(AllBlankSpaces(LEVEL0),true)
	})
	.it("Bot moves to the right initially.",()=>{
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
	})
	.it("Bot obeys conveyor belt rules",()=>{
		expect(function(){
			loadLevel(LEVEL1,0,2)
			for (var i=0;i<11;i++) {runBot(true)}
			if (BOT_X===2&&BOT_Y===1) {
				return true
			} else {
				return false
			}
		}(),true)
	})
	.it("Bot obeys branch rules",()=>{
		expect(function(){
			loadLevel(LEVEL2,0,2)
			for (var i=0;i<3;i++) {runBot(true)}
			if (BOT_X===2&&BOT_Y===3) {
				return true
			} else {
				return false
			}
		}(),true)
	})
	.it("Bot obeys branch rules with different colored tape.",()=>{
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
	})
	.it("Bot tape is reduced by 1 when passing through a branch.",()=>{
		expect(function(){
			loadLevel(LEVEL2,0,2)
			for (var i=0;i<3;i++) {runBot(true)}
			if (BOT_TAPE.length===1&&BOT_TAPE[0].color===BLUE) {
				return true
			} else {
				return false
			}
		}(),true)
	})
	.it("Bot tape is reduced by 1 when passing through a different branch.",()=>{
		expect(function(){
			loadLevel(LEVEL2,0,2)
			BOT_TAPE = [{color:BLUE}]
			for (var i=0;i<3;i++) {runBot(true)}
			if (BOT_TAPE.length===0) {
				return true
			} else {
				return false
			}
		}(),true)
	})
	.it("Bot obeys writer movement rules",()=>{
		expect(function(){
			loadLevel(LEVEL3,0,2)
			for (var i=0;i<3;i++) {runBot(true)}
			if (BOT_X===2&&BOT_Y===3) {
				return true
			} else {
				return false
			}
		}(),true)
	})
	.it("Bot obeys writer tape rules - Has correct tape when appending",()=>{
		expect(function(){
			loadLevel(LEVEL3,0,2)
			for (var i=0;i<3;i++) {runBot(true)}
			if (BOT_TAPE.length===3&&BOT_TAPE[2].color===RED) {
				return true
			} else {
				return false
			}
		}(),true)
	})
	
	
	console.log("==============")
	console.log("TEST RESULTS: "+TestSuite.passedtests+" passed, "+(TestSuite.totaltests-TestSuite.passedtests)+" failed, "+TestSuite.totaltests+" total")
	console.log("==============")
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
