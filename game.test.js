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
var totalTests = 0;
var totalTestsPassed = 0;

class describe {
	constructor(testname) {
		this.testname=testname
		this.beforecb = ()=>{};
		this.cb = undefined;
		this.totaltests = 0;
		this.passedtests = 0;
		this.starttime = 0;
		console.log(this.testname)
	
		this.beforeEach = (cb)=>{
			this.beforecb = cb
			return this
		}
		this.it = (checkname,cb)=>{
			this.starttime = new Date().getTime()
			console.log("->"+checkname)
			this.beforecb()
			this.cb=cb;
			this.cb()
			return this
		}
		this.showResults = () =>{
			console.log("==============")
			console.log("TEST RESULTS: "+TestSuite.passedtests+" passed, "+(TestSuite.totaltests-TestSuite.passedtests)+" failed, "+TestSuite.totaltests+" total")
			console.log("==============")
		}
	}
}

function expect(testval1,testval2,name) {
	if (testval1!==testval2) {
		console.log("    Test Failed! Expected "+testval2+" but got "+testval1+". ("+(new Date().getTime()-TestSuite.starttime)+"ms)"+((name)?` - ${name}`:""))
		TestSuite.totaltests++
		totalTests++
		testsPass=false
	} else 
	{
		TestSuite.totaltests++
		TestSuite.passedtests++
		totalTests++
		totalTestsPassed++
		console.log("    Test Passed!"+" ("+(new Date().getTime()-TestSuite.starttime)+"ms)"+((name)?` - ${name}`:""))
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
		resetGame()
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
			BOT_TAPE = "B"
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
			if (BOT_TAPE.length===1&&BOT_TAPE[0]==="B") {
				return true
			} else {
				return false
			}
		}(),true)
	})
	.it("Bot tape is reduced by 1 when passing through a different branch.",()=>{
		expect(function(){
			loadLevel(LEVEL2,0,2)
			BOT_TAPE = "B"
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
			if (BOT_TAPE.length===3&&BOT_TAPE[2]==="R") {
				return true
			} else {
				return false
			}
		}(),true)
	})
	.it("Bot obeys writer tape rules - Has correct tape when overwriting",()=>{
		expect(function(){
			loadLevel(LEVEL3,0,1)
			BOT_TAPE="BR"
			for (var i=0;i<2;i++) {runBot(true)}
			if (BOT_TAPE.length===2&&BOT_TAPE[0]==="R") {
				return true
			} else {
				return false
			}
		}(),true)
	})
	.it("Bot goes forward if no color matched.",()=>{
		expect(function(){
			loadLevel(LEVEL2,0,2)
			BOT_TAPE = [{color:YELLOW}]
			for (var i=0;i<2;i++) {runBot(true)}
			if (BOT_X===2&&BOT_Y===2) {
				return true
			} else {
				return false
			}
		}(),true)
	})
	.it("Bot tape is unaffected if no color matched.",()=>{
		expect(function(){
			loadLevel(LEVEL2,0,2)
			BOT_TAPE = [{color:YELLOW}]
			for (var i=0;i<2;i++) {runBot(true)}
			if (BOT_TAPE.length===1) {
				return true
			} else {
				return false
			}
		}(),true)
	})
	.it("Bot goes right when approaching a double belt (Left->Right) from the left",()=>{
		expect(function(){
			loadLevel(LEVEL4,0,2)
			for (var i=0;i<2;i++) {runBot(true)}
			if (BOT_X===2&&BOT_Y===2) {
				return true
			} else {
				return false
			}
		}(),true)
	})
	.it("Bot goes down when approaching a double belt (Up->Down) from the top",()=>{
		expect(function(){
			loadLevel(LEVEL4,1,1)
			BOT_DIR=DOWN
			for (var i=0;i<2;i++) {runBot(true)}
			if (BOT_X===1&&BOT_Y===3) {
				return true
			} else {
				return false
			}
		}(),true)
	})
	.it("Bot goes right when approaching a double belt (Left->Right) from the Right",()=>{
		expect(function(){
			loadLevel(LEVEL4,2,2)
			BOT_DIR=LEFT
			for (var i=0;i<2;i++) {runBot(true)}
			if (BOT_X===2&&BOT_Y===2) {
				return true
			} else {
				return false
			}
		}(),true)
	})
	.it("Bot goes up when approaching a double belt (Down->Up) from the Bottom",()=>{
		expect(function(){
			loadLevel(LEVEL4,2,4)
			BOT_DIR=UP
			for (var i=0;i<2;i++) {runBot(true)}
			if (BOT_X===2&&BOT_Y===2) {
				return true
			} else {
				return false
			}
		}(),true)
	})
	.it("Convert Number to Tape function works as expected. 0 bits=R, 1 bits=B",()=>{
		expect(binaryToTape(4),"RRB","4=100=\"BRR\"")
		expect(binaryToTape(24),"RRRBB","24=11000=\"BBRRR\"")
		expect(binaryToTape(167),"BBBRRBRB","167=10100111=\"BRBRRBBB\"")
	}).showResults()
	
	
	TestSuite = new describe("Stage 1")
	TestSuite
	.beforeEach(()=>{
		resetGame()
	})
	.it("Stage 1 has a level",()=>{
		expect(STAGE1.level===undefined,false,"Is defined")
		expect(Array.isArray(STAGE1.level),true,"Is an array")
		expect(STAGE1.level.length>0,true,"Cannot be empty")
	})
	.it("Stage 1 has a name",()=>{
		expect(STAGE1.name===undefined,false,"Is defined")
		expect(typeof(STAGE1.name),"string","Is a string")
		expect(STAGE1.name.length>0,true,"Cannot be blank")
	})
	.it("Stage 1 has an objective",()=>{
		expect(STAGE1.objective===undefined,false,"Is defined")
		expect(typeof(STAGE1.objective),"string","Is a string")
		expect(STAGE1.objective.length>0,true,"Cannot be blank")
	})
	.it("Stage 1 has a starting position",()=>{
		expect(STAGE1.start===undefined,false,"Is defined")
		expect(typeof(STAGE1.start),"object","Is an object")
		expect(STAGE1.start.x===undefined,false,"Must have an X coordinate")
		expect(STAGE1.start.y===undefined,false,"Must have a Y coordinate")
	})
	.it("Stage 1 has an acceptance condition",()=>{
		expect(STAGE1.accept===undefined,false)
		expect(typeof(STAGE1.accept),"function")
	})
	.it("loadStage sets up stage 1",()=>{
		loadStage(STAGE1)
		expect(gameGrid.length===STAGE1.level.length,true,"Height of stage is equal")
		expect(gameGrid[0].length===STAGE1.level[0].length,true,"Width of stage is equal")
	})
	.it("current stage set to stage 1",()=>{
		loadStage(STAGE1)
		expect(gameStage===STAGE1,true)
	})
	.it("accept all bots for stage 1.",()=>{
		loadStage(STAGE1)
		expect(gameStage.accept(""),true,"Expect true for \"\"")
		expect(gameStage.accept("RB"),true,"Expect true for RB")
		expect(gameStage.accept("BRBR"),true,"Expect true for BRBR")
	})
	.it("bot fails at the start.",()=>{
		loadStage(STAGE1)
		runBot(true)
		expect(gameState===REVIEWING,true)
	})
	.it("When TESTING state is on, the game should test the current level for cases expecting to pass, but fail and create 3 of them if possible.",()=>{
		loadStage(STAGE1)
		expect(BOT_QUEUE.length===0,true,"Bot queue should be empty.")
		generateBotQueue()
		expect(BOT_QUEUE.length===0&&gameState!==TESTING,true,"Bot queue should not be modified while state is not TESTING")
		gameState=TESTING
		generateBotQueue()
		expect(BOT_QUEUE.length>=3,true,"There should be at least 3 bots in queue for an unbuilt level, as all bots are supposed to pass.")
	})
	.it("A stage should have an Exit.",()=>{
		loadStage(STAGE1)
		var hasAnExit=()=>{
			for (var y=0;y<gameGrid.length;y++) {
				for (var x=0;x<gameGrid[y].length;x++) {
					if (gameGrid[y][x].type==="EXIT") {
						return true;
					}
				}
			}
			return false;
		}
		expect(hasAnExit(),true)
	})
	.it("A bot reaching the exit should set the state to FINISH.",()=>{
		loadStage(STAGE1)
		placeBot(3,2)
		runBot(true)
		expect(gameState===FINISH,true)
	})
	.it("Run a TESTING state to see if an acceptable player-built level has no bots in queue.",()=>{
		loadStage(STAGE1)
		gameGrid=[
			[{},{},{},{},{},],
			[{},{},{},{},{},],
			[{},{...BELTRIGHT},{...BELTRIGHT},{...BELTRIGHT},{type:"EXIT"},],
			[{},{},{},{},{},],
			[{},{},{},{},{},],
		]
		expect(BOT_QUEUE.length===0,true,"Bot queue should be empty.")
		gameState=TESTING
		generateBotQueue()
		expect(BOT_QUEUE.length===0,true,"There should be 0 bots in queue for a good level, as all bots are supposed to pass.")
	})
	.showResults()
	
	TestSuite = new describe("Basic Stage 5 - Back and Forth")
	TestSuite
	.beforeEach(()=>{
		resetGame()
	})
	.it("accepts valid results",()=>{
		loadStage(BSTAGE5)
		expect(gameStage.accept("BBB"),false)
		expect(gameStage.accept("BRB"),true)
		expect(gameStage.accept("RBRBRB"),true)
		expect(gameStage.accept("RBRBRBR"),true)
		expect(gameStage.accept("RBRRRBR"),false)
	})
	
	TestSuite = new describe("Basic Stage 7 - End-to-End")
	TestSuite
	.beforeEach(()=>{
		resetGame()
	})
	.it("accepts valid results",()=>{
		loadStage(BSTAGE7)
		expect(gameStage.accept("BBB"),true)
		expect(gameStage.accept("BRB"),true)
		expect(gameStage.accept("RBRBRB"),false)
		expect(gameStage.accept("RBRBRBR"),true)
		expect(gameStage.accept("RBRRRBR"),true)
		expect(gameStage.accept("BBBBRBBR"),false)
	})
	
	TestSuite = new describe("Basic Stage 8 - Greatest Count")
	TestSuite
	.beforeEach(()=>{
		resetGame()
	})
	.it("accepts valid results",()=>{
		loadStage(BSTAGE8)
		expect(gameStage.accept("BBBRR"),"BBB")
		expect(gameStage.accept("BBRRR"),"RRR")
		expect(gameStage.accept("RBRBRBR"),"RRRR")
		expect(gameStage.accept("RBRBRBB"),"BBBB")
		expect(gameStage.accept("RBRRRBR"),"RRRRR")
		expect(gameStage.accept("BBBBRBBR"),"BBBBBB")
	})
	
	TestSuite = new describe("Stage 2")
	TestSuite
	.beforeEach(()=>{
		resetGame()
	})
	.it("Stage 2 has a level",()=>{
		expect(STAGE2.level===undefined,false,"Is defined")
		expect(Array.isArray(STAGE2.level),true,"Is an array")
		expect(STAGE2.level.length>0,true,"Cannot be empty")
	})
	.it("Stage 2 has a name",()=>{
		expect(STAGE2.name===undefined,false,"Is defined")
		expect(typeof(STAGE2.name),"string","Is a string")
		expect(STAGE2.name.length>0,true,"Cannot be blank")
	})
	.it("Stage 2 has an objective",()=>{
		expect(STAGE2.objective===undefined,false,"Is defined")
		expect(typeof(STAGE2.objective),"string","Is a string")
		expect(STAGE2.objective.length>0,true,"Cannot be blank")
	})
	.it("Stage 2 has a starting position",()=>{
		expect(STAGE2.start===undefined,false,"Is defined")
		expect(typeof(STAGE2.start),"object","Is an object")
		expect(STAGE2.start.x===undefined,false,"Must have an X coordinate")
		expect(STAGE2.start.y===undefined,false,"Must have a Y coordinate")
	})
	.it("Stage 2 has an acceptance condition",()=>{
		expect(STAGE2.accept===undefined,false)
		expect(typeof(STAGE2.accept),"function")
	})
	.it("loadStage sets up Stage 2",()=>{
		loadStage(STAGE2)
		expect(gameGrid.length===STAGE2.level.length,true,"Height of stage is equal")
		expect(gameGrid[0].length===STAGE2.level[0].length,true,"Width of stage is equal")
	})
	.it("current stage set to Stage 2",()=>{
		loadStage(STAGE2)
		expect(gameStage===STAGE2,true)
	})
	.it("accept only blue bots for Stage 2.",()=>{
		loadStage(STAGE2)
		expect(gameStage.accept("BBB"),true,"Expect true for BBB")
		expect(gameStage.accept("RB"),false,"Expect false for RB")
		expect(gameStage.accept("BRBR"),false,"Expect false for BRBR")
		expect(gameStage.accept("BBBBBBBBBBBB"),true,"Expect true for BBBBBBBBBBBB")
	})
	.it("bot fails at the start.",()=>{
		loadStage(STAGE2)
		runBot(true)
		expect(gameState===REVIEWING,true)
	})
	.it("When TESTING state is on, the game should test the current level for cases expecting to pass, but fail and create 3 of them if possible.",()=>{
		loadStage(STAGE2)
		expect(BOT_QUEUE.length===0,true,"Bot queue should be empty.")
		generateBotQueue()
		expect(BOT_QUEUE.length===0&&gameState!==TESTING,true,"Bot queue should not be modified while state is not TESTING")
		gameState=TESTING
		generateBotQueue()
		expect(BOT_QUEUE.length>=3,true,"There should be at least 3 bots in queue for an unbuilt level, as there are cases that do not pass.")
	})
	.it("A stage should have an Exit.",()=>{
		loadStage(STAGE2)
		var hasAnExit=()=>{
			for (var y=0;y<gameGrid.length;y++) {
				for (var x=0;x<gameGrid[y].length;x++) {
					if (gameGrid[y][x].type==="EXIT") {
						return true;
					}
				}
			}
			return false;
		}
		expect(hasAnExit(),true)
	})
	.it("A bot reaching the exit should set the state to FINISH.",()=>{
		loadStage(STAGE2)
		placeBot(3,2)
		runBot(true)
		expect(gameState===FINISH,true)
	})
	.it("Run a TESTING state to see if an acceptable player-built level has no bots in queue.",()=>{
		loadStage(STAGE2)
		gameGrid=[
			[{},{...BELTRIGHT},{...BELTRIGHT},{...BELTDOWN},{},],
			[{...BELTRIGHT},{...BRANCHUP},{},{...BELTDOWN},{},],
			[{},{...BRANCHRIGHT},{},{...BELTRIGHT},{type:"EXIT"},],
			[{},{},{},{},{},],
			[{},{},{},{},{},],
		]
		expect(BOT_QUEUE.length===0,true,"Bot queue should be empty.")
		gameState=TESTING
		generateBotQueue()
		expect(BOT_QUEUE.length===0,true,"There should be 0 bots in queue for a good level, as all bots are supposed to pass.")
	})
	.showResults()
	
	TestSuite = new describe("Color Hex Conversion")
	TestSuite
	.it("converts a color to hex",()=>{
		expect(colorToHex(0,0,0),"#000000")
		expect(colorToHex(66, 135, 245),"#4287f5")
		expect(colorToHex(245, 66, 221),"#f542dd")
		expect(colorToHex(58, 79, 55),"#3a4f37")
	}).showResults()
	
	TestSuite = new describe("Intermediate Stage 1 - Blue In Blue Out")
	TestSuite
	.beforeEach(()=>{
		resetGame()
		loadStage(ISTAGE1)
	})
	.it("accepts valid results",()=>{
		expect(gameStage.accept("BBBRR"),"BBBRR")
		expect(gameStage.accept("BBRRR"),"BBRRR")
		expect(gameStage.accept("RBRBRBR"),"BBBRRRR")
		expect(gameStage.accept("RBRBRBB"),"BBBBRRR")
		expect(gameStage.accept("RBRRRBR"),"BBRRRRR")
		expect(gameStage.accept("BBBBRBBR"),"BBBBBBRR")
	})
	.it("the generator doesn't fail",()=>{
		gameState=TESTING
		generateBotQueue()
	})
	
	TestSuite = new describe("Intermediate Stage 2 - Blue In Blue Out")
	TestSuite
	.beforeEach(()=>{
		resetGame()
		loadStage(ISTAGE2)
	})
	.it("accepts valid results",()=>{
		expect(gameStage.accept("BBBRR"),false)
		expect(gameStage.accept("BBRRR"),false)
		expect(gameStage.accept("RBRBRBR"),false)
		expect(gameStage.accept("RBRBRB"),true)
		expect(gameStage.accept("RBRRRBRB"),true)
		expect(gameStage.accept(""),true)
	})
	.it("the generator doesn't fail",()=>{
		gameState=TESTING
		generateBotQueue()
	})
	
	TestSuite = new describe("Intermediate Stage 3 - Add One")
	TestSuite
	.beforeEach(()=>{
		resetGame()
		loadStage(ISTAGE3)
	})
	.it("accepts valid results",()=>{
		expect(gameStage.accept("RRBBB"),"BRBBB")
		expect(gameStage.accept("RRRBB"),"BRRBB")
		expect(gameStage.accept("RRBRBB"),"BRBRBB")
		expect(gameStage.accept("BRBRB"),"RBBRB")
		expect(gameStage.accept("BRRRBRB"),"RBRRBRB")
		expect(gameStage.accept(""),"B")
	})
	.it("the generator doesn't fail",()=>{
		gameState=TESTING
		generateBotQueue()
	})
	
	TestSuite = new describe("Intermediate Stage 4 - String Length")
	TestSuite
	.beforeEach(()=>{
		resetGame()
		loadStage(ISTAGE4)
	})
	.it("accepts valid results",()=>{
		expect(gameStage.accept("RRBBB"),"RB")
		expect(gameStage.accept("RRRBB"),"BB")
		expect(gameStage.accept("RRBRBB"),"BB")
		expect(gameStage.accept("BRBRB"),"RB")
		expect(gameStage.accept("BRRRBRB"),"RRB")
		expect(gameStage.accept(""),"")
	})
	.it("the generator doesn't fail",()=>{
		gameState=TESTING
		generateBotQueue()
	})
	
	TestSuite = new describe("Intermediate Stage 5 - NoLemonsNoMelon")
	TestSuite
	.beforeEach(()=>{
		resetGame()
		loadStage(ISTAGE5)
	})
	.it("accepts valid results",()=>{
		expect(gameStage.accept("RRBBB"),false)
		expect(gameStage.accept("BBRBB"),true)
		expect(gameStage.accept("RRBRBB"),false)
		expect(gameStage.accept("BRBRB"),true)
		expect(gameStage.accept("BRRRBRB"),false)
		expect(gameStage.accept("BBBRRBBB"),true)
		expect(gameStage.accept(""),true)
	})
	.it("the generator doesn't fail",()=>{
		gameState=TESTING
		generateBotQueue()
	})
	
	TestSuite = new describe("Intermediate Stage 6 - Is Equal To")
	TestSuite
	.beforeEach(()=>{
		resetGame()
		loadStage(ISTAGE6)
	})
	.it("accepts valid results",()=>{
		expect(gameStage.accept("RRBGBB"),false)
		expect(gameStage.accept("BBGBB"),true) //
		expect(gameStage.accept("RRBGRBB"),false)
		expect(gameStage.accept("BRGRB"),false) //
		expect(gameStage.accept("BRBGBRB"),true) //
		expect(gameStage.accept("BBBGRBBB"),false)
		expect(gameStage.accept("G"),true) //
	})
	.it("the generator doesn't fail",()=>{
		gameState=TESTING
		generateBotQueue()
	})
	
	TestSuite = new describe("Intermediate Stage 7 - Substring")
	TestSuite
	.beforeEach(()=>{
		resetGame()
		loadStage(ISTAGE7)
	})
	.it("accepts valid results",()=>{
		expect(gameStage.accept("RYRBBYB"),"RBB")
		expect(gameStage.accept("BBYBYB"),"B") //
		expect(gameStage.accept("RYRBRBBY"),"RBRBB")
		expect(gameStage.accept("BRYYRB"),"") //
		expect(gameStage.accept("BRYBBRYB"),"BBR") //
		expect(gameStage.accept("BBBYRBBYB"),"RBB")
		expect(gameStage.accept("YY"),"") //
	})
	.it("the generator doesn't fail",()=>{
		gameState=TESTING
		generateBotQueue()
	})
	
	TestSuite = new describe("Intermediate Stage 8 - Reversal")
	TestSuite
	.beforeEach(()=>{
		resetGame()
		loadStage(ISTAGE8)
	})
	.it("accepts valid results",()=>{
		expect(gameStage.accept("RRBBB"),"BBBRR")
		expect(gameStage.accept("BBBB"),"BBBB") //
		expect(gameStage.accept("RRBRBB"),"BBRBRR")
		expect(gameStage.accept("BRRBRR"),"RRBRRB") //
		expect(gameStage.accept("BRBRRBRB"),"BRBRRBRB") //
		expect(gameStage.accept("BBBBBRBBB"),"BBBRBBBBB")
		expect(gameStage.accept(""),"") //
	})
	.it("the generator doesn't fail",()=>{
		gameState=TESTING
		generateBotQueue()
	})
	
	TestSuite = new describe("Advanced Stage 1 - Right in the Center")
	TestSuite
	.beforeEach(()=>{
		resetGame()
		loadStage(ASTAGE1)
	})
	.it("accepts valid results",()=>{
		expect(gameStage.accept("RRBB"),"RRYBB")
		expect(gameStage.accept("BBBB"),"BBYBB") 
		expect(gameStage.accept("RRBRBB"),"RRBYRBB")
		expect(gameStage.accept("BRRBRR"),"BRRYBRR") 
		expect(gameStage.accept("BRBRRBRB"),"BRBRYRBRB") 
		expect(gameStage.accept("BBBBBRBBBB"),"BBBBBYRBBBB")
		expect(gameStage.accept(""),"Y") 
	})
	.it("the generator doesn't fail",()=>{
		gameState=TESTING
		generateBotQueue()
	})
	
	TestSuite = new describe("Advanced Stage 2 - toLowerCase")
	TestSuite
	.beforeEach(()=>{
		resetGame()
		loadStage(ASTAGE2)
	})
	.it("accepts valid results",()=>{
		expect(gameStage.accept("RRRBRRBYBRRBRRB"),"RRRBRBBYBRRBRBB")
	})
	.it("the generator doesn't fail",()=>{
		gameState=TESTING
		generateBotQueue()
	})
	
	TestSuite = new describe("Advanced Stage 3 - Addition")
	TestSuite
	.beforeEach(()=>{
		resetGame()
		loadStage(ASTAGE3)
	})
	.it("accepts valid results",()=>{
		expect(gameStage.accept("BRBBGRB"),"BBBB")
		expect(gameStage.accept("RBGRB"),"RRB") 
		expect(gameStage.accept("BGR"),"B")
		expect(gameStage.accept("RGBB"),"BB") 
		expect(gameStage.accept("BRBGRRBRB"),"BRRBB") 
		expect(gameStage.accept("BBBBBGRBBBB"),"BRBBBB")
	})
	.it("the generator doesn't fail",()=>{
		gameState=TESTING
		generateBotQueue()
	})
	
	TestSuite = new describe("Advanced Stage 4 - The Great Conversion")
	TestSuite
	.beforeEach(()=>{
		resetGame()
		loadStage(ASTAGE4)
	})
	.it("accepts valid results",()=>{
		expect(gameStage.accept("RRBBRBBBR"),"RBGBBGRBBBBG")
	})
	.it("the generator doesn't fail",()=>{
		gameState=TESTING
		generateBotQueue()
	})
	
	TestSuite = new describe("Advanced Stage 5 - Compare")
	TestSuite
	.beforeEach(()=>{
		resetGame()
		loadStage(ASTAGE5)
	})
	.it("accepts valid results",()=>{
		expect(gameStage.accept("BRBBGRB"),"BRBB")
		expect(gameStage.accept("RBGRBB"),"RBB") 
		expect(gameStage.accept("BGR"),"B")
		expect(gameStage.accept("RGBB"),"BB") 
		expect(gameStage.accept("BRBGRRBRB"),"RRBRB") 
		expect(gameStage.accept("BBBBBGRBBBB"),"BBBBB")
	})
	.it("the generator doesn't fail",()=>{
		gameState=TESTING
		generateBotQueue()
	})
	
	console.log("----------------------")
	console.log("ALL TESTS: "+totalTestsPassed+" passed, "+(totalTests-totalTestsPassed)+" failed, "+totalTests+" total")
	if (testsPass===undefined) {
		testsPass=true
	}	
	resetGame();
}


function runGame() {	
	resetGame();
	setupGame();
	//loadLevel(LEVEL2,0,2)
	setInterval(()=>{
		step()
		draw()
	},1000/60)
}

var RUNTESTS = false;

loadScript("image_data.js",gameLoader)

function gameLoader() {
	if (RUNTESTS) {
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
	} else {
		loadScript("game.js",runGame)
	}
}