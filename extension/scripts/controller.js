var fish_caught_since_update = 0;
var isFishingGame = false; // is this tab the fishing game?
var latestGame = null; // store the game data
// keep track of how much you've played the game
var lastTimeBlurred = null;
var lastTimeFocused = null;
var focusedOnThisTab = true;

var rawFishermanStateDelta = 0;
var timeSpentFishingDelta = 0;

$(document).ready(function(){
	//checks if it is the fisherman game, there is a proprietary span object that is "isFishingGame"
	if($("#isFishingGame").length != 0){
		isFishingGame = true;
	}
	onTabLoad();

	$(document).bind('keypress', function(e) {
	    if(e.keyCode===61){
	        console.log("plus pressed");

	        chrome.runtime.sendMessage({message: "clearGame"}, function(){});
	    }
	});
});

window.addEventListener('message', (event) => {
    // console.log(`Received message: ${event.data}`);
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type === "FROM_PAGE")) {
    	if (event.data.message && (event.data.message === "Caught a fish!")) {
    		// then update our fish caught count
    		fish_caught_since_update += event.data.number;
    		// console.log("Fish caught: " + fish_caught_since_update + " this time: " + event.data.number)
    		// console.log("Caught " + fish_caught_since_update + " fish since update");
    		chrome.runtime.sendMessage({message: "requestUpdateGame"}, function(){});
    	}
    	else if (event.data.message && (event.data.message === "I'm the fishing game!")) {
    		// then update our fish caught count
    		isFishingGame = true;
    		console.log("This is the fishing game!");
    		initializeIfIsFishingGame();
    	}
    	else if (event.data.message === "setGame"){
            // overwrite the game stored on this script
            latestGame = event.data.data;
        }
        else if (event.data.message === "getGame"){
            // tell them what your copy of the game is
            var data = { type: "FROM_PAGE", message: "setGame", data: latestGame };
            event.source.postMessage(data, "*"); // should only send it to who asked
        }
    	// else {
	    //     console.log("Controller script received message: " + event.data.message);
	    // }
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// console.log(sender);
    if (request.message === "updateGame"){

    	// gets the latest version of game on this script, updates it, and sends it back!
    	console.log(request);
    	chrome.runtime.sendMessage(sender.id, {message: "setGame", data: updateGameData(request.data.game)}, function(){});
    }
    else if (request.message === "setGame"){
    	// overwrite the game stored on this script
    	latestGame = request.data.game;
    	console.log(request.data);
    }
    else if (request.message === "getGame"){
    	// tell them what your copy of the game is
    	chrome.runtime.sendMessage(sender.id, {message: "setGame", data: result}, function(){});
    }
    // console.log("Controller recieved runtime message " + request);
    sendResponse( {response:"Dummy response"} );
});

function timeSinceTime(time) {
	// get how long it's been in seconds
	var d = new Date();
	return (d - time)/1000;
}

function initializeIfIsFishingGame() {
	// window.onblur = onFishergameBlur;
	// window.onfocus = onFishergameFocus;
	console.log("init is fishing game");
	var d = new Date();
	var n = d.getTime();
	lastTimeFocused = n;
	console.log("setting blur and focus")
	window.onfocus = onFishergameFocus;
	window.onblur = onFishergameBlur;

}

function initializeIfNotFishingGame() {
	// everything in this needs to be overwritten by the initializeIfIsFishingGame since we just run this no matter what
	console.log("initializing not fisherman blur and focus");
	window.onblur = onTabBlur;
	window.onfocus = onTabFocus;
}

//function for focusing on the fisherman game tab
var gameStateTimeout= null;

function onFishergameFocus() {
	//handle the return happyness
	//it should be like the last session time times a constant
	//if you spend less than 5 seconds, it is negative, else, it is a positibe
	if(latestGame.lastSessionTime/1000 > 5){
		rawFishermanStateDelta += 10;
		console.log("you spent more than 5 seconds with me last time:)");
	}
	else{
		rawFishermanStateDelta -= 5;
		console.log("you spent less than 5 seconds with me :(");
	}
	
	console.log("fishy focus");
	console.log("fishing game is focussed");
	var d = new Date();
	var n = d.getTime();
	lastTimeFocused = n;
	focusedOnThisTab = true;
	

	chrome.runtime.sendMessage({message: "requestUpdateGame"}, function(){});
}

//function that is called when you leave the fisherman game
function onFishergameBlur() {
	console.log('fishy blur');
	//when you leave the tab, it should log how long you spent fishing:)
	
	var d = new Date();
	var n = d.getTime();
	console.log("setting last time blurred to +: " + n);
	lastTimeBlurred = n;
	focusedOnThisTab = false;

	timeSpentFishingDelta = lastTimeBlurred - lastTimeFocused;
	chrome.runtime.sendMessage({message: "requestUpdateGame"}, function(){});
}


function onTabFocus() {
	console.log('normie focus');
	var d = new Date();
	var n = d.getTime();
	lastTimeFocused = n;
	focusedOnThisTab = true;

	
	
}

function onTabBlur() {
	console.log('normie blur');
	var d = new Date();
	var n = d.getTime();
	lastTimeBlurred = n;
	focusedOnThisTab = false
}



function updateGameData(game) {


	if(focusedOnThisTab){
		game.rawFishermanState += rawFishermanStateDelta;
		console.log(rawFishermanStateDelta);
    	rawFishermanStateDelta = 0;
	}
	
	game.modFishermanState = game.rawFishermanState;



	if (isFishingGame) {
		// only update this stuff if it's the fishing game
		game.fish_caught += fish_caught_since_update;
	    fish_caught_since_update = 0;

	    
	    game.lastTimeBlurred = lastTimeBlurred;
	    game.lastTimeFocused = lastTimeFocused;
	    
	    //timeSpentFishingDelta is set to not zero when you leave the tab:)
	    game.timeSpentFishing += timeSpentFishingDelta;
	    game.lastSessionTime = (lastTimeBlurred - lastTimeFocused);

	    timeSpentFishingDelta = 0;
	    //only set the time spent fishing when you leave the tab, thus focusedOnThisTab will be false
	    
	    //time since time gets you the seconds between the arg and the current time in seconds
	    

	}
    latestGame = game;
    return latestGame;
}


function onTabLoad() {
	// console.log("Tab loaded fn");


	console.log("isFishingGame? :" + isFishingGame);
	//gets the game from background script once the tab loads
	chrome.runtime.sendMessage({message: "getGame" }, function(){});
	var d = new Date();
	var n = d.getTime();

	if(isFishingGame){
		
		initializeIfIsFishingGame();
	}else{
		initializeIfNotFishingGame();
	}



	//this is only for updating the content of the page, and connstantly refresshing the game every second
	//if it is the fisherman game, then just refresh the game every frame, if it is another page, then don't repopulate model
	setInterval(function(){
		if(!isFishingGame){
			$.when(populateModel()).done(refreshTab());
		}else{
			refreshGame();
		}
	},1000);
}

function refreshTab() {
	//updates the game with current 
	
	
	if(focusedOnThisTab){
		rawFishermanStateDelta += modTabDelta();
	}
	//replaces content based on the updated model
	replaceContent();
	chrome.runtime.sendMessage({message: "requestUpdateGame"}, function(){});
}

function refreshGame(){

	if(focusedOnThisTab){
		rawFishermanStateDelta += modGameDelta();
	}
	chrome.runtime.sendMessage({message: "requestUpdateGame"}, function(){});
}





var fishSrc = chrome.runtime.getURL("images/temp1.jpg");
function replaceContent(){
	// console.log("Is fishing game? " + isFishingGame);
	

	if (!focusedOnThisTab) {
		return; // only change things if you're looking at the tab? We may or may not want this idk.
	}

	// attempting to get background images and replace them
	$("div").each(function(){
		if ($(this).attr("style")) {
			$(this).removeAttr("style");
			var newStyle = $(this).attr("style", "background-image: url("+ fishSrc+")");
		}
	});
	
	if (latestGame.lastTimeFocused > latestGame.lastTimeBlurred) {
		// then you're currently playing it so return
		return
	}
	// console.log("Made it past the gauntlet");
	//this is the time you've spent away from the game
	var timeSincePlayed = timeSinceTime(latestGame.lastTimeBlurred);

	// if (timeSincePlayed / 600 < Math.random()) {
	// 	// if it's less than 10 minutes then there's a chance it just discards this
	// 	console.log("return");
	// 	return;
	// }


	var chanceToReplace = timeSincePlayed / 1000; // if chance is less than this then replace it

	if (latestGame) {
		
		// if it has a copy of the latestGame data then it knows it can run this!
		for (var i = 0; i < model.headers.length; i++) {
			if (chanceToReplace < Math.random()) {
				continue;
			}
			var choice = Math.random();
			if (choice < .5) {
				$(model.headers[i]).text("You caught " + latestGame.fish_caught + " fish!");
			} else {
				$(model.headers[i]).text("You should go fishing!");
			}
		}

		for(var i = 0; i < model.images.length; i++){
			if (chanceToReplace < Math.random()) {
				continue;
			}

			// the class in twitter seems to be the same, so we can use that to get background images
			// css-1dbjc4n r-1niwhzg r-vvn4in r-u6sd8q r-4gszlv r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw
			// css-1dbjc4n r-1niwhzg r-vvn4in r-u6sd8q r-4gszlv r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw
			$(model.images[i]).removeAttr("ng-src");
			$(model.images[i]).removeAttr("srcset");


			model.images[i].src = fishSrc;
			// console.log("Replaced something");
		}

		
	}
	
	
	// console.log("update");
}


function modTabDelta(){
	var currentAwayTime = (new Date().getTime() - latestGame.lastTimeBlurred)/1000;
	//slope of (x)(x-360)
	console.log("current time: " + new Date().getTime() );
	console.log("lastTimeBlurred: "+ latestGame.lastTimeBlurred)
	console.log("time spent away " + currentAwayTime);
	var x = currentAwayTime;
	//make sure slope won't get steeper past 180
	x = Math.min(x, 180);
	var slope = -(2*x);
	slope/= 720;
	console.log(currentAwayTime);
	console.log("slope is :" + slope)
	return slope;
}
function modGameDelta(){
	//last time focussed
	var currentFishingTime = (new Date().getTime() - latestGame.lastTimeFocused)/1000;
	//slope of (x)(x-360)
	var x = currentFishingTime;
	var slope = 360-(2*x);
	slope/= 720;
	//make sure slope isn't negative
	slope = Math.max(slope, 0);
	return slope;
}

