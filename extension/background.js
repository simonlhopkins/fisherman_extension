

var emptyGame = new Object();
emptyGame.fish_caught = 0;
emptyGame.times = [];
emptyGame.lastTimeBlurred = 0;
emptyGame.lastTimeFocused = 0;
emptyGame.timeSpentFishing = 0;
emptyGame.lastSessionTime = 0;
emptyGame.rawFishermanState = 0;
emptyGame.modFishermanState = 0;
//emptyGame.replacementContent = new Object();
//loadOurContent() was moved to generateReplacementContent.
//instead of sending a massive json object with all the replacement content
//around, we are breaking things up so that we stop getting errors.


// chrome.storage.sync.get(['game'], function(result) {
// 	console.log("getting game");
//                         console.log(result);
//     var gameData = new Object();
// 	if(result.game === undefined){
// 		chrome.storage.sync.set({'game': emptyGame}, function(result) {
// 			console.log("setting new game because game is null");
			
// 		});
//         gameData.game = emptyGame;
// 	} 
//     else
//     {
//         gameData.game = result.game;
//     }
// //	chrome.storage.sync.get(["game"], function(result){
// //		console.log(result);
// //	});

// //    var emptyGameData = new Object();
// //    emptyGameData.game = emptyGame;
//     console.log("game data to return:");
//     console.log(gameData);
//     chrome.tabs.sendMessage(sender.tab.id, {message: "setGame", data: gameData}, function(response){
//         console.log("response");
//         console.log(response);
//      });

// });




chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	//if they want to just view the game data
    //console.log("Recieved message: " + request.message);
    if (request.message === "getGame"){
    	// console.log("requested from: ");
    	//console.log(sender);
    	//have to set it in the callback to ensure that the value loads in time.
    	chrome.storage.sync.get(['game'], function(result) {
            var gameData = new Object();
            if(result.game === undefined){
                chrome.storage.sync.set({'game': emptyGame}, function(result) {
                    console.log("setting new game because game is null");
                    
                    var error = chrome.runtime.lastError;
                    if (error !== undefined)
                    {
                        var errorMessage = error.message;
                        if (errorMessage !== undefined)
                        {
                            if (errorMessage.includes("MAX_WRITE"))
                            {
                                console.log("The above error is likely caused by this issue: " + errorMessage);
                            }
                        }
                    }

                });
                gameData.game = emptyGame;
            } 
            else
            {
                gameData.game = result.game;
            }

    		chrome.tabs.sendMessage(sender.tab.id, {message: "setGame", data: gameData}, function(){

    		});
		});
    }

    if(request.message === "setGame"){
    	chrome.storage.sync.set({'game': request.data}, function(result) {
		});
    }

    if (request.message === "requestUpdateGame") {
    	// console.log("background update game, is this supposed to happen?");
    	chrome.storage.sync.get(['game'], function(result) {
            var gameData = new Object();
            if(result.game === undefined){
                chrome.storage.sync.set({'game': emptyGame}, function() {
                    console.log("setting new game in update game because game is null");
                    
                    var error = chrome.runtime.lastError;
                    if (error !== undefined)
                    {
                        var errorMessage = error.message;
                        if (errorMessage !== undefined)
                        {
                            if (errorMessage.includes("MAX_WRITE"))
                            {
                                console.log("The above error is likely caused by this issue: " + errorMessage);
                            }
                        }
                    }
                });
                gameData.game = emptyGame;
            } 
            else
            {
                gameData.game = result.game;
            }
    		chrome.tabs.sendMessage(sender.tab.id, {message: "updateGame", data: gameData}, function(){});
            //console.log(gameData.rawFishermanState);
		});
    }

    if(request.message === "clearGame"){
    	chrome.storage.sync.set({'game': emptyGame}, function(result) {
            var emptyGameData = new Object();
            emptyGameData.game = emptyGame;
            //loadOurContent();
            chrome.tabs.sendMessage(sender.tab.id, {message: "setGame", data: emptyGameData}, function(){

            });
        });
    }

    sendResponse( {response:"Dummy response"} );
});



//not used anymore, just kept in in case we need it
//taken from stackoverfloe
//https://stackoverflow.com/questions/23318037/size-of-json-object-in-kbs-mbs
function memorySizeOf(obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if(obj !== null && obj !== undefined) {
            switch(typeof obj) {
            case 'number':
                bytes += 8;
                break;
            case 'string':
                bytes += obj.length * 2;
                break;
            case 'boolean':
                bytes += 4;
                break;
            case 'object':
                var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                if(objClass === 'Object' || objClass === 'Array') {
                    for(var key in obj) {
                        if(!obj.hasOwnProperty(key)) continue;
                        sizeOf(obj[key]);
                    }
                } else bytes += obj.toString().length * 2;
                break;
            }
        }
        return bytes;
    };

    function formatByteSize(bytes) {
        if(bytes < 1024) return bytes + " bytes";
        else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
        else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
        else return(bytes / 1073741824).toFixed(3) + " GiB";
    };

    return formatByteSize(sizeOf(obj));
};


//arguments: last session time, current session time so far, current state






