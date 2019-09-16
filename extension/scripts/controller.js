var fish_caught_since_update = 0;
var isFishingGame = false;


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
    	if (event.data.text && (event.data.text === "Caught a fish!")) {
    		// then update our fish caught count
    		fish_caught_since_update += event.data.number;
    		console.log("Caught " + fish_caught_since_update + " fish since update");
    	}
    	if (event.data.text && (event.data.text === "I'm the fishing game!")) {
    		// then update our fish caught count
    		isFishingGame = true;
    		console.log("This is the fishing game!");
    	}
        console.log("Content script received message: " + event.data.text);
    }
});

chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.message === "requestGameData"){
    	chrome.runtime.sendMessage({message: "setGameData", data: updateGameData(request.data.game)}, function(){});
    }
});

function updateGameData(game) {
	game.fish_caught += fish_caught_since_update;
    fish_caught_since_update = 0;
    return game
}

function askIfFishingGame() {
	// ask the tab if it's the fishing game
	var data = { type: "FROM_PAGE", text: "Are you the fishing game?" };
    window.postMessage(data, "*");
}

function onTabLoad() {
	// run some things once:
	askIfFishingGame();

	// after a second, every second populat the model and when that's finished run replaceImages.
	setTimeout(
		function(){
			if (!isFishingGame) {
			setInterval(
				function(){
					// populateModel();
					$.when(populateModel()).done(replaceAllImages());
				}, 1000);
		}}, 1000);
}

function replaceAllImages(){

	console.log("Is fishing game? " + isFishingGame);
	var fishSrc = chrome.runtime.getURL("images/temp1.jpg");

	for(var i = 0; i< model.headers.length; i++){
		$(model.headers[i]).text("f i s h e r m a n");
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