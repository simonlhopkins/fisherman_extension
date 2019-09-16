var fish_caught_since_update = 0;
var isFishingGame = false;
var latestGame = null;


$(document).ready(function(){
	// var fishGifSrc = chrome.runtime.getURL("images/fishGif.gif");
	// var fishGif = $("body").append("<img src = '"+fishGifSrc+"' id = 'fishGif'></img>");
	// var theta = 0;
	// setInterval(function(){
	// 	theta += 0.1;
	// 	$("html").offset({'top':Math.sin(theta)*100});
	// 	$("html").offset({'left':Math.cos(theta)*500});
	// 	console.log(fishGif.offset());
	// }, 10);
	onTabLoad();
});

window.addEventListener('message', (event) => {
    // console.log(`Received message: ${event.data}`);
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type === "FROM_PAGE")) {
    	if (event.data.message && (event.data.message === "Caught a fish!")) {
    		// then update our fish caught count
    		fish_caught_since_update += event.data.number;
    		// console.log("Caught " + fish_caught_since_update + " fish since update");
    		chrome.runtime.sendMessage({message: "requestUpdateGame"}, function(){});
    	}
    	else if (event.data.message && (event.data.message === "I'm the fishing game!")) {
    		// then update our fish caught count
    		isFishingGame = true;
    		console.log("This is the fishing game!");
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
    	else {
	        console.log("Controller script received message: " + event.data.message);
	    }
    }
});

chrome.runtime.onMessage.addListener(function(request, sender) {
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
    console.log("Controller recieved runtime message " + request);
});

function updateGameData(game) {
	game.fish_caught += fish_caught_since_update;
    fish_caught_since_update = 0;

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

function ifHasGame() {
	for (var i = 0; i < model.headers.length; i++) {
		$(model.headers[i]).text("You caught " + latestGame.fish_caught + " fish!");
	}
}

function refreshGame() {
	chrome.runtime.sendMessage({message: "getGame"}, function(){});
	replaceAllImages();
}

function replaceAllImages(){

	// console.log("Is fishing game? " + isFishingGame);
	var fishSrc = chrome.runtime.getURL("images/temp1.jpg");

	

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

	if (latestGame) {
		ifHasGame();
	}
	
	for(var i = 0; i < model.images.length; i++){
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
	}
	// console.log("update");
}