

var emptyGame = new Object();
emptyGame.fish_caught = 0;
emptyGame.times = [];
emptyGame.lastTimeBlurred = 0;
emptyGame.lastTimeFocused = 0;
emptyGame.timeSpentFishing = 0;
emptyGame.lastSessionTime = 0;
emptyGame.rawFishermanState = 0;
emptyGame.modFishermanState = 0;
emptyGame.replacementContent = new Object();



emptyGame.replacementContent.images = [[], [], [], [], []]
emptyGame.replacementContent.headers = [[], [], [], [], []]
// I will have to manually set all of the images here

function loadOurContent(){
    addImage("/images/temp1.jpg", [0, 1]);
    addHeader("come fish with me", [0, 1]);
}


function addImage(src, levels){
    var imgSrc = chrome.runtime.getURL(src);
    for(var i = 0; i<levels.length; i++){
        if(levels[i]>=emptyGame.replacementContent.images.length){
            console.log("invalid level");
            continue;
        }
        emptyGame.replacementContent.images[levels[i]].push(imgSrc);
    }
}

function addHeader(text, levels){
    
    for(var i = 0; i<levels.length; i++){
        if(levels[i]>=emptyGame.replacementContent.images.length){
            console.log("invalid level");
            continue;
        }
        emptyGame.replacementContent.headers[levels[i]].push(text);
    }
}

loadOurContent();

console.log(emptyGame.replacementContent);


chrome.storage.sync.get(['game'], function(result) {
	// console.log("getting game");
	if(result.game === undefined){
		chrome.storage.sync.set({'game': emptyGame}, function(result) {
			console.log("setting new game because game is null");
			
		});
	}
	chrome.storage.sync.get(["game"], function(result){
		console.log(result);
	});

    var emptyGameData = new Object();
    emptyGameData.game = emptyGame;
    // chrome.tabs.sendMessage(sender.tab.id, {message: "setGame", data: emptyGameData}, function(){

    // });

});




chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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
		});
    }

    if (request.message === "requestUpdateGame") {
    	// console.log("background update game, is this supposed to happen?");
    	console.log("Recieved request update game");
    	chrome.storage.sync.get(['game'], function(result) {
    		chrome.tabs.sendMessage(sender.tab.id, {message: "updateGame", data: result}, function(){});
            console.log(result.game.rawFishermanState);
		});
    }

    if(request.message === "clearGame"){
    	console.log("clearGame");

    	chrome.storage.sync.set({'game': emptyGame}, function(result) {
            var emptyGameData = new Object();
            emptyGameData.game = emptyGame;
            chrome.tabs.sendMessage(sender.tab.id, {message: "setGame", data: emptyGameData}, function(){

            });
        });
    }

    sendResponse( {response:"Dummy response"} );
});


//arguments: last session time, current session time so far, current state






