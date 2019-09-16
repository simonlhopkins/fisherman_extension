var fish_caught_since_update = 0;
var isFishingGame = false; // is this tab the fishing game?
var latestGame = null; // store the game data
// keep track of how much you've played the game
var lastTimeBlurred = null;
var lastTimeFocused = null;
var focusedOnThisTab = true;


$(document).ready(function(){
	onTabLoad();
	initializeIfNotFishingGame(); // just initialize and it'll get replaced by the fisherman one if it is fisherman
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

function timeSinceTime(time) {
	// get how long it's been in seconds
	var d = new Date();
	return (d - time)/1000;
}

function initializeIfIsFishingGame() {
	window.onblur = onFishergameBlur;
	window.onfocus = onFishergameFocus;
}

function initializeIfNotFishingGame() {
	// everything in this needs to be overwritten by the initializeIfIsFishingGame since we just run this no matter what
	window.onblur = onTabBlur;
	window.onfocus = onTabFocus;
}

function onFishergameFocus() {
	console.log('focus');
	var d = new Date();
	var n = d.getTime();
	lastTimeFocused = n;
	focusedOnThisTab = true;
	chrome.runtime.sendMessage({message: "requestUpdateGame"}, function(){});
}

function onFishergameBlur() {
	console.log('blur');
	var d = new Date();
	var n = d.getTime();
	lastTimeBlurred = n;
	focusedOnThisTab = false;
	chrome.runtime.sendMessage({message: "requestUpdateGame"}, function(){});
}

function onTabFocus() {
	console.log('focus');
	var d = new Date();
	var n = d.getTime();
	lastTimeFocused = n;
	focusedOnThisTab = true;
}

function onTabBlur() {
	console.log('blur');
	var d = new Date();
	var n = d.getTime();
	lastTimeBlurred = n;
	focusedOnThisTab = false
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// console.log(sender);
    if (request.message === "updateGame"){
    	// gets the latest version of game on this script, updates it, and sends it back!
    	chrome.runtime.sendMessage(sender.id, {message: "setGame", data: updateGameData(request.data.game)}, function(){});
    }
    else if (request.message === "setGame"){
    	// overwrite the game stored on this script
    	latestGame = request.data.game;
    }
    else if (request.message === "getGame"){
    	// tell them what your copy of the game is
    	chrome.runtime.sendMessage(sender.id, {message: "setGame", data: result}, function(){});
    }
    // console.log("Controller recieved runtime message " + request);
    sendResponse( {response:"Dummy response"} );
});

function updateGameData(game) {
	if (isFishingGame) {
		// only update this stuff if it's the fishing game
		game.fish_caught += fish_caught_since_update;
	    fish_caught_since_update = 0;

	    game.lastTimeBlurred = lastTimeBlurred;
	    game.lastTimeFocused = lastTimeFocused;

	    console.log(timeSinceTime(game.lastTimeFocused) + " < focused . blurred > " + timeSinceTime(game.lastTimeBlurred));
	}
    latestGame = game;
    return game;
}

function askIfFishingGame() {
	// ask the tab if it's the fishing game
	console.log("Checked if fishing game");
	var data = { type: "FROM_PAGE", message: "Are you the fishing game?" };
    window.postMessage(data, "*");
}

function onTabLoad() {
	// console.log("Tab loaded fn");
	chrome.runtime.sendMessage({message: "getGame" }, function(){});
	// run some things once:
	askIfFishingGame();

	// after a second, every second populat the model and when that's finished run replaceImages.
	setTimeout(
		function(){
			if (!isFishingGame) {
			setInterval(
				function(){
					// populateModel();
					$.when(populateModel()).done(refreshGame());
				}, 1000);
		}}, 1000);
}

function refreshGame() {
	chrome.runtime.sendMessage({message: "getGame"}, function(){});
	replaceAllImages();
}

function ifHasGame() {
	var timeSincePlayed = timeSinceTime(latestGame.lastTimeBlurred);

	// if (timeSincePlayed / 600 < Math.random()) {
	// 	// if it's less than 10 minutes then there's a chance it just discards this
	// 	return;
	// }

	var chanceToReplace = timeSincePlayed / 1000; // if chance is less than this then replace it


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
}

function replaceAllImages(){
	// console.log("Is fishing game? " + isFishingGame);
	var fishSrc = chrome.runtime.getURL("images/temp1.jpg");

	if (!focusedOnThisTab) {
		return; // only change things if you're looking at the tab? We may or may not want this idk.
	}

	// attempting to get background images and replace them
	// var divs = document.getElementsByTagName("div");
	// for (var i = 0; i < divs.length; i++) {
	// 	if (divs[i].style) {
	// 		// console.log("Style content: " + divs[i].style);
	// 		// check if it has background-image in it
	// 		// if ($(divs[i].style).attr("background-image")) {
	// 		if ($(divs[i]).css('background-image')) {
	// 			// then replace it!
	// 			console.log("INSIDE REPLACING");
	// 			// divs[i].style.backgroundImage = "url(" + fishSrc + ");";
	// 			$(divs[i].style).attr("background-image", "url(" + fishSrc + ");");
	// 			// $(divs[i]).css('background-image', new URL(fishSrc));
	// 		}
	// 	}
	// }
	console.log("HERE. Time since: " + timeSinceTime(latestGame.lastTimeBlurred) + " " + timeSinceTime(latestGame.lastTimeFocused));
	if (latestGame.lastTimeFocused > latestGame.lastTimeBlurred) {
		// then you're currently playing it so return
		return
	}
	// console.log("Made it past the gauntlet");
	var timeSincePlayed = timeSinceTime(latestGame.lastTimeBlurred);

	if (timeSincePlayed / 600 < Math.random()) {
		// if it's less than 10 minutes then there's a chance it just discards this
		return;
	}

	var chanceToReplace = timeSincePlayed / 1000; // if chance is less than this then replace it

	if (latestGame) {
		ifHasGame();
	}
	
	for(var i = 0; i < model.images.length; i++){
		if (chanceToReplace < Math.random()) {
			continue;
		}

		// if($(model.images[i]).id === "fishGif"){
		// 	continue;
		// }
		// if (model.images[i].src) {
		// 	model.images[i].src = fishSrc;
		// }
		// else

		// the class in twitter seems to be the same, so we can use that to get background images
		// css-1dbjc4n r-1niwhzg r-vvn4in r-u6sd8q r-4gszlv r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw
		// css-1dbjc4n r-1niwhzg r-vvn4in r-u6sd8q r-4gszlv r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw
		$(model.images[i]).removeAttr("ng-src");
		$(model.images[i]).removeAttr("srcset");

		// if ($(model.images[i]).attr("ng-src")) {
		// 	// $(model.images[i]).attr("ng-src", fishSrc);
		// }
		// else if ($(model.images[i]).attr("srcset")) {
		// 	// $(model.images[i]).attr("srcset", fishSrc);
		// }

		model.images[i].src = fishSrc;
		// console.log("Replaced something");
	}
	// console.log("update");
}