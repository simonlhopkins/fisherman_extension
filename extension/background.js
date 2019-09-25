

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

var currentBackgroundGame = null; // this is to prevent the write quotas
var updatesSinceSyncing = 0;
var maxUpdatesBeforeSyncing = 10;



emptyGame.replacementContent.images = [[], [], [], [], []];
emptyGame.replacementContent.headers = [[], [], [], [], []];
emptyGame.replacementContent.popUps = [[], [], [], [], []];
// I will have to manually set all of the images here

function loadOurContent(){
    //images
    addImage("/images/FishermanandSon_polaroid.png", [0, 1]);
    addImage("/images/FirstBoat_polaroid.png", [0, 1]);
    addImage("/images/OldManStorm1_polaroid.png", [1, 2]);
    addImage("/images/OldManBigFish_polaroid.png", [1, 2, 3]);
    addImage("/images/FishSoBig_polaroid.png", [2, 3]);
    addImage("/images/OldMan_Polaroid.png", [2, 3, 4]);
    addImage("/images/OldManSunrise_polaroid.png", [2, 3, 4]);
    addImage("/images/OldSelfie_polaroid.png", [3, 4]);
    addImage("/images/FishMan_polaroid.png", [3, 4]);

    //headers
    // addHeader("fish w me bitch im mad u have spent like <timeSpentFishing> with me:(", [0]);
    // addHeader("fish w me plz", [4]);
    // addHeader("thank you for everything you've done:)", [4]);
    // addHeader("I'm getting a lil lonley", [3]);
    // addHeader("I've only caught <fish_caught> fish with you and you've spent <timeSpentFishing> with me:(", [0, 1, 2]);
    

    addHeader("I’ll be here waiting for you, and so will the fish!", [3, 4]);
    addHeader("I’ve caught a real big one! #shesamonster", [4]);
    addHeader("Take your time out there! I’ll be here when you come back.", [3, 4]);
    addHeader("When are you coming back? It’s a perfect day for some fishing!", [3, 4]);
    addHeader("The sky is blue, the sea is clear. All I need now is for the fish to bite!", [4]);
    addHeader("Hey! Don’t know if you can see this but you’re always welcome to fish with me!", [3, 4]);
    addHeader("Hey, I miss you, hope you come back soon!", [2, 3]);
    addHeader("Where did you go?", [0]);
    addHeader("Please come back", [0]);
    addHeader("It’s lonely out here all on my own", [0]);
    addHeader("I miss you", [0]);
    addHeader("I’ve caught a big one just for you!", [3, 4]);
    addHeader("Why did you leave me?", [0]);
    addHeader("You're all I have", [0]);
    addHeader("The best day for fishing is Sunday. Everyone else is out at church!", [3, 4]);
    addHeader("When are you coming back? The fish are biting real good today!", [2, 3]);
    addHeader("It’s a perfect day to catch the perfect fish!", [3, 4]);
    addHeader("Come back", [0, 1]);
    addHeader("I’ll be waiting, no matter how long it takes.", [0, 1]);
    addHeader("Have you ever tried out Bob’s Bait? I’m telling you, if you’re into buying branded bait that’s the stuff!", [3, 4]);
    addHeader("You caught <fish_caught> fish already! A natural!", [4]);
    

    // these ones could be paragraphs or inserted into paragraphs
    addHeader("What’s your favorite type of fish? Mine’s the red snapper! A beautiful specimen and tasty too!", [4]);
    addHeader("Looks like a storm is brewing so I respect your choice not to be out here! You better get back as soon as it ends though, that’s prime time for a big catch!", [2]);
    addHeader("It’s been a long time since I last saw you friend, are you feeling alright? I’ve got a hell of a cold remedy if you need it! Keeps me on the sea 24/7!", [2, 3]);
    addHeader("Catch and release is the only real type of fishing anything else is hunting with a fishing pole!", [3, 4]);
    addHeader("Hey, there’s a storm brewing up out here. Rain’s the best weather for fishing you know!", [3, 4]);
    addHeader("Why did you leave me.", [0]);
    addHeader("Come back.", [0]);
    addHeader("Don't leave me.", [0, 1]);
    addHeader("This is not dissimilar to an old fishing tale when you think about it.", [4]);
    addHeader("I’d love to talk with you about all this!", [2, 3]);
    addHeader("Much like a strong storm blowing in from the southern seas!", [2, 3]);



    //popups
    addPopup("/images/BaitClub.png", [0,1,2,3,4]);
    addPopup("/images/BaitTackle.png", [0,1,2,3,4]);
    addPopup("/images/FishPole.png", [0,1,2,3,4]);
    addPopup("/images/Gift.png", [0,1,2,3,4]);
    addPopup("/images/SexyMan.png", [0,1,2,3,4]);
    addPopup("/images/YouWin.png", [0,1,2,3,4]);
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

function addPopup(src, levels){
    var imgSrc = chrome.runtime.getURL(src);
    
    for(var i = 0; i<levels.length; i++){
        if(levels[i]>=emptyGame.replacementContent.popUps.length){
            console.log("invalid level");
            continue;
        }
        emptyGame.replacementContent.popUps[levels[i]].push(imgSrc);
    }
}

function addHeader(text, levels){
    


    for(var i = 0; i<levels.length; i++){
        if(levels[i]>=emptyGame.replacementContent.headers.length){
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
    else {
        // set the game that we have stored!
        currentBackgroundGame = result.game;
    }
	// chrome.storage.sync.get(["game"], function(result){
	// 	console.log(result);
	// });

    // var emptyGameData = new Object();
    // emptyGameData.game = emptyGame;
    // chrome.tabs.sendMessage(sender.tab.id, {message: "setGame", data: emptyGameData}, function(){

    // });

});




chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	//if they want to just view the game data
    if (request.message === "getGame"){
    	// console.log("requested from: ");
    	// console.log(sender);
    	//have to set it in the callback to ensure that the value loads in time.
        if (currentBackgroundGame == null) {
        	chrome.storage.sync.get(['game'], function(result) {

                currentBackgroundGame = result.game; // update our current version of the game

        		chrome.tabs.sendMessage(sender.tab.id, {message: "setGame", data: result}, function(){

        		});
    		});
        } else {
            // just send them the version we have
            chrome.tabs.sendMessage(sender.tab.id, {message: "setGame", data: {'game': currentBackgroundGame}}, function(){});
        }
    }

    if(request.message === "setGame"){
    	// console.log("setGame");
        updatesSinceSyncing++;
        if (updatesSinceSyncing > maxUpdatesBeforeSyncing) {
        	chrome.storage.sync.set({'game': request.data}, function(result) {
    		});
        } else {
            // just set our local copy
            currentBackgroundGame = request.data;
        }
    }

    if (request.message === "requestUpdateGame") {
    	// console.log("background update game, is this supposed to happen?");
    	console.log("Recieved request update game");
        if (currentBackgroundGame == null) {
        	chrome.storage.sync.get(['game'], function(result) {
        		chrome.tabs.sendMessage(sender.tab.id, {message: "updateGame", data: result}, function(){});
                console.log(result.game.rawFishermanState);
    		});
        } else {
            // just send the current copy
            chrome.tabs.sendMessage(sender.tab.id, {message: "updateGame", data: {'game': currentBackgroundGame}}, function(){});
        }
    }

    if(request.message === "clearGame"){
    	console.log("clearGame");

        currentBackgroundGame = null; // so that we have to fetch it from storage

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






