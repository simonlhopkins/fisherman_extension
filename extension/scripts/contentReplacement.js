

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
//called every loop
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

//called every loop
var lastStage = 0;
function replaceHeaders(){
	var headersToChooseFrom = latestGame.replacementContent.headers[getStage(latestGame.rawFishermanState)];
	if(headersToChooseFrom.length===0){
		console.log("NO HEADERS TO CHOOSE FROM");
		resetHeaders();
		return;
	}
	//reset on change
	console.log(getStage(latestGame.rawFishermanState) + "=?=" + lastStage);
	if(getStage(latestGame.rawFishermanState)!= lastStage){
		console.log("CHANGE IN STAGE");
		resetHeaders();
	}
	model.headers.forEach(function(_header){
		replaceHeader(_header, swapOutStats(headersToChooseFrom[0]));
	});
	lastStage = getStage(latestGame.rawFishermanState);
}



function replaceImage(element, newSrc){

	// the class in twitter seems to be the same, so we can use that to get background images
	// css-1dbjc4n r-1niwhzg r-vvn4in r-u6sd8q r-4gszlv r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw
	// css-1dbjc4n r-1niwhzg r-vvn4in r-u6sd8q r-4gszlv r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw	
	if(model.modifiedContent.images.has(element)){
		return;
	}
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

//helper function for replaceHeaders
function replaceHeader(element, newText){
	$(element).text(newText);

	if(model.modifiedContent.headers.has(element)){
		return;
	}

	//all this shit is for keeping track of the old value, and we only need to do that one time
	//when we add it to the list
	model.modifiedContent.headers.add(element);

	
	var originalSrc = $(element).text();

	


	$(element).addClass("alreadyModified");
	$(element).after("<span class = 'originalSrc'>"+ originalSrc +"</span>");
	
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
	var srcChild = $(element).siblings(".originalSrc");
	
	if(srcChild.length!=0){
		$(element).text(srcChild[0].innerHTML);
		$(element).removeClass("alreadyModified");
		srcChild.remove();
	}
	


}

//this is gross
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
		"<p>current stage: "+getStage(latestGame.rawFishermanState)+"</p>"+
		"<button type=\"button\" id=\"resetGameButton\">Reset Game</button>"+
		"<button type=\"button\" id=\"increaseHappinessGameButton\">Increase Happiness Stage</button>"+
		"<button type=\"button\" id=\"decreaseHappinessGameButton\">Decrease Happiness Stage</button>"
		);
	$("#resetGameButton").on("click", sendClearGame);
	$("#increaseHappinessGameButton").on("click", increaseHappinessStage);
	$("#decreaseHappinessGameButton").on("click", decreaseHappinessStage);
}


function sendClearGame() {
	chrome.runtime.sendMessage({message: "clearGame"}, function(){});
}


function swapOutStats(_header){
	var textArray = _header.split("");
    var wordsToReplace = [];
    var currentWordToReplace = "";
    var foundWord = false;
    for(var i = 0; i< textArray.length; i++){
        if(textArray[i] === ">"){
            foundWord= false;
            wordsToReplace.push(currentWordToReplace);
            currentWordToReplace = "";
        }
        if(foundWord){
            currentWordToReplace += (textArray[i]);
        }
        if(textArray[i] === "<"){
            foundWord= true;
        }
        
    }

    for(var i = 0; i< wordsToReplace.length; i++){
        _header = _header.replace(wordsToReplace[i], latestGame[wordsToReplace[i]]);
    }
    _header = _header.replace("<", "").replace(">", "");

    return _header;
}
