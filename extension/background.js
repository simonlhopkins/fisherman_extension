

var game = new Object();
game.fish_caught = 0;
game.times = [];


chrome.storage.sync.get(['game'], function(result) {
	console.log("getting game");
	if(result.game === undefined){
		chrome.storage.sync.set({'game': game}, function(result) {
			console.log("setting new game because game is null");
			
		});
	}
	chrome.storage.sync.get(["game"], function(result){
		console.log(result);
	});

});




chrome.runtime.onMessage.addListener(function(request, sender) {
	console.log(request)
	//if they want to just view the game data
    if (request.message === "requestGameData"){
    	console.log("requested from: ");
    	console.log(sender);
    	//have to set it in the callback to ensure that the value loads in time.
    	chrome.storage.sync.get(['game'], function(result) {
    		chrome.tabs.sendMessage(sender.tab.id, {message: "requestGameData", data: result}, function(){

    		});
		});
    }

    if(request.message === "setGameData"){
    	console.log("setGameData");
    	chrome.storage.sync.set({'game': request.data}, function(result) {
			console.log(request.data);
		});
    }


});
