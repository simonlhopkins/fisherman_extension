

var emptyGame = new Object();
emptyGame.fish_caught = 0;
emptyGame.times = [];
emptyGame.lastTimeBlurred = 0;
emptyGame.lastTimeFocused = 0;
emptyGame.timeSpentFishing = 0;
emptyGame.lastSessionTime = 0;
emptyGame.fishermanState = 0;


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

    	chrome.storage.sync.set({'game': emptyGame}, function(result) {
			console.log(result);
			chrome.tabs.sendMessage(sender.tab.id, {message: "setGame", data: emptyGame}, function(){

    		});
		});
    }

    sendResponse( {response:"Dummy response"} );
});
