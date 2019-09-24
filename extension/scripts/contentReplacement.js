
var fishermanStageCutoffs = [-30, -10, 10, 30];


function getRandomElement(_list){
	return _list[Math.floor(Math.random()*_list.length)];
}
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
	if(getStage(latestGame.rawFishermanState)!= stageAfterReplace){
		resetImages();
	}
	//need to add randomness here
	model.images.forEach(function(_image){
		replaceImage(_image, getRandomElement(imagesToChooseFrom));
	});
	
}



function resetImages(){
	// model.images.forEach(function(_image){
	model.modifiedContent.images.forEach(function(_image){
		if($(_image).hasClass("alreadyModified")){
			changeImageBackToOriginal(_image);
		}
	});
}

function changeImageBackToOriginal(element){

	model.modifiedContent.images.delete(element);
	var srcChild = $(element).find(".originalSrc");
	element.src = srcChild[0].innerHTML;
	$(element).removeClass("alreadyModified");
	$(element).remove(srcChild);

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

//called every loop


function replaceHeaders(){
	var headersToChooseFrom = latestGame.replacementContent.headers[getStage(latestGame.rawFishermanState)];
	if(headersToChooseFrom.length===0){
		console.log("NO HEADERS TO CHOOSE FROM");
		resetHeaders();
		return;
	}
	//reset on change
	console.log(getStage(latestGame.rawFishermanState) + "=?=" + stageAfterReplace);
	if(getStage(latestGame.rawFishermanState)!= stageAfterReplace){
		console.log("CHANGE IN STAGE");
		resetHeaders();
	}
	//need to add randomness here
	model.headers.forEach(function(_header){
		if(model.modifiedContent.headers.has(_header)){
			replaceHeader(_header, $(_header).siblings(".originalReplacement")[0].innerHTML);
		}
		else{

			replaceHeader(_header, getRandomElement(headersToChooseFrom));
		}
		
	});
}

function resetHeaders(){
	model.modifiedContent.headers.forEach(function(_header){
		
		changeHeaderBackToOriginal(_header);
		
	});
}

//helper function for replaceHeaders
function replaceHeader(element, newText){
	
	var origText = $(element).text();
	$(element).text(swapOutStats(newText));


	if(model.modifiedContent.headers.has(element)){
		return;
	}

	model.modifiedContent.headers.add(element);
	


	$(element).addClass("alreadyModified");
	$(element).after("<span class = 'originalSrc'>"+ origText +"</span>");
	$(element).after("<span class = 'originalReplacement'>"+ newText +"</span>");
	console.log(newText);
}

function changeHeaderBackToOriginal(element){

	model.modifiedContent.headers.delete(element);
	var srcChild = $(element).siblings(".originalSrc");
	var originalReplacement = $(element).siblings(".originalReplacement");
	if(srcChild.length!=0){
		$(element).text(srcChild[0].innerHTML);
		$(element).removeClass("alreadyModified");
		srcChild.remove();
		
	}
	if(originalReplacement.length!=0){
		originalReplacement.remove();
	}

}




//hyperlinks
function replaceHyperlinks(){
	var hyperlinksImgsToChooseFrom = latestGame.replacementContent.popUps[getStage(latestGame.rawFishermanState)];
	
	if(hyperlinksImgsToChooseFrom.length===0){
		resetHyperlinks();
		return;
	}

	
	if(getStage(latestGame.rawFishermanState)!= stageAfterReplace){
		resetHyperlinks();
	}

	//need to add randomness here
	if(getStage(latestGame.rawFishermanState)<2){
		model.hyperlinks.forEach(function(_hyperlink){
			modifyHyperlink(_hyperlink, hyperlinksImgsToChooseFrom);
		});
	}
	
}

function randomElementInList(list)
{
    return list[Math.floor(Math.random() * list.length)];
}

function resetHyperlinks(){
	model.modifiedContent.hyperlinks.forEach(function(_hyperlink){
		if($(_hyperlink).hasClass("alreadyModified")){
			changeHyperlinkBackToOriginal(_hyperlink);
		}
	});
}

function modifyHyperlink(element, _hyperlinksImgsToChooseFrom){
	
	if(model.modifiedContent.hyperlinks.has(element)){
		return;
	}

	//all this shit is for keeping track of the old value, and we only need to do that one time
	//when we add it to the list
	model.modifiedContent.hyperlinks.add(element);
	$(element).addClass("fishermanPopUp");
	$(element).addClass("alreadyModified");
	//lmao
	//$(element).attr("href", imgSrc);




	
}

function changeHyperlinkBackToOriginal(element){
	model.modifiedContent.hyperlinks.delete(element);
	$(element).mousedown(function(){});
	$(element).removeClass("alreadyModified");
	$(element).removeClass("fishermanPopUp");
	
}

$(document).ready(function(){

	
	$(document).on('click', ".fishermanPopUp", function() {
		for(var i = 0; i< 3; i++){
			var popupImg = new Image();
		
			
			popupImg.onload = function() {
				var w = window.open("", new Date().getTime(), "width="+this.width/4+", height="+this.height/4+", top="+ parseInt(Math.random()*1000)+", left= "+parseInt(Math.random()*1000)+", scrollbars=yes");
		    	var $w = $(w.document.body);
		    	$w.html("<body><style>img{width: 100%;height:100%;}</style>"+
		    		"<img  src = '"+ this.src+ "'>"+
		    		+"</body>");
		    	console.log(this.src);
				
				console.log(this.width +", " + this.height);
			}

			popupImg.src = getRandomElement(latestGame.replacementContent.popUps[getStage(latestGame.rawFishermanState)]);
		}
	});

});




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
        if(textArray[i] === "}"){
            foundWord= false;
            wordsToReplace.push(currentWordToReplace);
            currentWordToReplace = "";
        }
        if(foundWord){
            currentWordToReplace += (textArray[i]);
        }
        if(textArray[i] === "{"){
            foundWord= true;
        }
        
    }

    for(var i = 0; i< wordsToReplace.length; i++){
        _header = _header.replace(wordsToReplace[i], latestGame[wordsToReplace[i]]);
    }
    _header = _header.replace("{", "").replace("}", "");

    return _header;
}
