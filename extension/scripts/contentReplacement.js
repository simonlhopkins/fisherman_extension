

var fishSrc = chrome.runtime.getURL("images/temp1.jpg");


var fishermanStageCutoffs = [-30, -10, 10, 30];

function getStage(_rawFishermanState){

	for(var i = 0; i< fishermanStageCutoffs.length; i++){
		if(_rawFishermanState < fishermanStageCutoffs[i]){
			if(i==0){
				return i;
			}
			if(_rawFishermanState>=fishermanStageCutoffs[i-1]){
				return i;
			}
		}

	}
	return i;
}

function replaceImagesWithPoloroids(){

	var imagesToChooseFrom = latestGame.replacementContent.images[getStage(latestGame.rawFishermanState)];
	if(imagesToChooseFrom.length===0){
		resetImages();
		return;
	}
	//reset on change
	if(getStage(latestGame.rawFishermanState)!= lastStage){
		resetImages();
	}
	model.images.forEach(function(_image){
		replaceImage(_image, imagesToChooseFrom[0]);
	});
	var lastStage = getStage(latestGame.rawFishermanState);
	
}

function resetImages(){
	model.images.forEach(function(_image){
		if($(_image).hasClass("alreadyModified")){
			changeImageBackToOriginal(_image);
		}
	});
}

function resetHeaders(){
	model.headers.forEach(function(_header){
		if($(_header).hasClass("alreadyModified")){
			changeHeaderBackToOriginal(_header);
		}
	});
}

function replaceHeaders(){

	var headersToChooseFrom = latestGame.replacementContent.headers[getStage(latestGame.rawFishermanState)];
	if(headersToChooseFrom.length===0){
		resetHeaders();
		return;
	}
	//reset on change
	if(getStage(latestGame.rawFishermanState)!= lastStage){
		resetHeaders();
	}
	model.headers.forEach(function(_header){
		replaceHeader(_header, headersToChooseFrom[0]);
	});
	var lastStage = getStage(latestGame.rawFishermanState);
}



function replaceImage(element, newSrc){

	// the class in twitter seems to be the same, so we can use that to get background images
	// css-1dbjc4n r-1niwhzg r-vvn4in r-u6sd8q r-4gszlv r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw
	// css-1dbjc4n r-1niwhzg r-vvn4in r-u6sd8q r-4gszlv r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw	
	model.modifiedContent.images.add(element);
	var originalSrc = $(element)[0].src;

	$(element).removeAttr("ng-src");
	$(element).removeAttr("srcset");

	element.src = newSrc;


	$(element).addClass("alreadyModified");
	$(element).append("<span class = 'originalSrc'>"+ originalSrc +"</span>");
	var width = $(element).width();
	var height = $(element).height();
	$(element).width(Math.min(width, height));
	$(element).height(Math.min(width, height));

	// console.log("Replaced something");
}

function replaceHeader(element, newText){
	model.modifiedContent.images.add(element);
	var originalSrc = $(element).text();

	$(element).text(newText);


	$(element).addClass("alreadyModified");
	$(element).append("<span class = 'originalSrc'>"+ originalSrc +"</span>");
	
}

function changeImageBackToOriginal(element){

	model.modifiedContent.images.delete(element);
	var srcChild = $(element).find(".originalSrc");
	element.src = srcChild[0].innerHTML;
	$(element).removeClass("alreadyModified");
	$(element).remove(srcChild);

}

function changeHeaderBackToOriginal(element){

	model.modifiedContent.headers.delete(element);
	var srcChild = $(element).find(".originalSrc");
	$(element).text(srcChild[0].innerHTML);
	$(element).removeClass("alreadyModified");
	$(element).remove(srcChild);

}


function debugWindow(){

	if($("#debugWindow").length === 0){
		$("body").append("<div id = 'debugWindow'</div>");
	}
	$("html").css({
		"height": "100%",
		"width": "100%"
	});
	$("#debugWindow").css({
		"position": "fixed",
		"width": "50%",
		"height": "50%",
		"background-color": "white",
		"z-index": "100",
		"top": "0px",
		"right": "0px",
		"padding": "10px",
		"outline-style": "solid"

	});


	$("#debugWindow p").css("font-size", "12px");
	if(showDebugWindow){
		$("#debugWindow").css("visibility", "visible");
	}else{
		$("#debugWindow").css("visibility", "hidden");
	}

	$("#debugWindow").html(
		"<p>fish caught: "+latestGame.fish_caught+"</p>"+
		"<p>lastTimeBlurred: "+latestGame.lastTimeBlurred+"</p>"+
		"<p>lastTimeFocused: "+latestGame.lastTimeFocused+"</p>"+
		"<p>timeSpentFishing: "+latestGame.timeSpentFishing/1000+"</p>"+
		"<p>lastSessionTime: "+latestGame.lastSessionTime/1000+"</p>"+
		"<p>rawFishermanState: "+latestGame.rawFishermanState+"</p>"+
		"<p>current stage: "+getStage(latestGame.rawFishermanState)+"</p>"
		);
}




// console.log("Is fishing game? " + isFishingGame);
	

// if (!focusedOnThisTab) {
// 	return; // only change things if you're looking at the tab? We may or may not want this idk.
// }

// // attempting to get background images and replace them
// $("div").each(function(){
// 	if ($(this).attr("style")) {
// 		$(this).removeAttr("style");
// 		var newStyle = $(this).attr("style", "background-image: url("+ fishSrc+")");
// 	}
// });

// if (latestGame.lastTimeFocused > latestGame.lastTimeBlurred) {
// 	// then you're currently playing it so return
// 	return
// }
// // console.log("Made it past the gauntlet");
// //this is the time you've spent away from the game
// var timeSincePlayed = timeSinceTime(latestGame.lastTimeBlurred);

// // if (timeSincePlayed / 600 < Math.random()) {
// // 	// if it's less than 10 minutes then there's a chance it just discards this
// // 	console.log("return");
// // 	return;
// // }


// var chanceToReplace = timeSincePlayed / 1000; // if chance is less than this then replace it



//stuff from old replace content

// if it has a copy of the latestGame data then it knows it can run this!
// for (var i = 0; i < model.headers.length; i++) {
// 	if (chanceToReplace < Math.random()) {
// 		continue;
// 	}
// 	var choice = Math.random();
// 	if (choice < .5) {
// 		$(model.headers[i]).text("You caught " + latestGame.fish_caught + " fish!");
// 	} else {
// 		$(model.headers[i]).text("You should go fishing!");
// 	}
// }

// for(var i = 0; i < model.images.length; i++){
// 	if (chanceToReplace < Math.random()) {
// 		continue;
// 	}

// 	// the class in twitter seems to be the same, so we can use that to get background images
// 	// css-1dbjc4n r-1niwhzg r-vvn4in r-u6sd8q r-4gszlv r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw
// 	// css-1dbjc4n r-1niwhzg r-vvn4in r-u6sd8q r-4gszlv r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw
// 	$(model.images[i]).removeAttr("ng-src");
// 	$(model.images[i]).removeAttr("srcset");


// 	model.images[i].src = fishSrc;
// 	// console.log("Replaced something");
// }