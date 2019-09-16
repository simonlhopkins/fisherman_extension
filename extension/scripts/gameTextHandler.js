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
    	if (event.data.message && (event.data.message === "I'm the fishing game!")) {
    		// then update our fish caught count
    		isFishingGame = true;
    	}
    	else if (event.data.message === "setGame"){
            // overwrite the game stored on this script
            latestGame = event.data.data;
        }
        else if (event.data.message === "getGame"){
            // tell them what your copy of the game is
            var data = { type: "FROM_PAGE", message: "setGame", data: latestGame };
            event.source.postMessage(data, "*"); // should only send it to who asked
        } else if (event.data.message === "requestNextFishermanLine") {
        	// var lineData = getNextLine();
        	var lineData = { line: "Oh they're biting alright!", timeSaid:4 }
        	var data = { type: "FROM_PAGE", message: "nextFishermanLine", data: lineData };
            event.source.postMessage(data, "*"); // should only send it to who asked
        }
    }
});

chrome.runtime.onMessage.addListener(function(request, sender) {
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
});

function updateGameData(game) {
    latestGame = game;
    return game;
}

function askIfFishingGame() {
	// ask the tab if it's the fishing game
	var data = { type: "FROM_PAGE", message: "Are you the fishing game?" };
    window.postMessage(data, "*");
}

function onTabLoad() {
	chrome.runtime.sendMessage({message: "getGame" }, function(){});
	// run some things once:
	askIfFishingGame();

	// after a second, every second get the game data from the main server. We can reduce this in the future
	setTimeout(
		function(){
			if (isFishingGame) {
				setInterval(
					function(){
						refreshGame();
					}, 1000);
		}}, 1000);
}

function refreshGame() {
	chrome.runtime.sendMessage({message: "getGame"}, function(){});
}