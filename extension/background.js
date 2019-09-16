

var game = new Object();
game.fish_caught = 0;
game.times = [];
game.lastTimeBlurred = 0;
game.lastTimeFocused = 0;


chrome.storage.sync.get(['game'], function(result) {
	// console.log("getting game");
	if(result.game === undefined){
		chrome.storage.sync.set({'game': game}, function(result) {
			console.log("setting new game because game is null");
			
		});
	}
	chrome.storage.sync.get(["game"], function(result){
		console.log(result);
	});

});




chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request)
	//if they want to just view the game data
    if (request.message === "getGame"){
    	// console.log("requested from: ");
    	console.log(sender);
    	//have to set it in the callback to ensure that the value loads in time.
    	chrome.storage.sync.get(['game'], function(result) {
    		chrome.tabs.sendMessage(sender.tab.id, {message: "setGame", data: result}, function(){

    		});
		});
    }

    if(request.message === "setGame"){
    	// console.log("setGame");
    	chrome.storage.sync.set({'game': request.data}, function(result) {
			console.log(request.data);
		});
    }

    if (request.message === "requestUpdateGame") {
    	// console.log("background update game, is this supposed to happen?");
    	// console.log("Recieved request update game");
    	chrome.storage.sync.get(['game'], function(result) {
    		chrome.tabs.sendMessage(sender.tab.id, {message: "updateGame", data: result}, function(){});
		});
    }

    if(request.message === "clearGame"){
    	console.log("clearGame");

    	var _game = new Object();
		_game.times = [];

    	chrome.storage.sync.set({'game': _game}, function(result) {
			console.log(request.data);
		});
    }

    sendResponse( {response:"Dummy response"} );
});
