
var fishermanStageCutoffs = [-30, -10, 10, 30];



String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};



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

function getReplaceChancePerStage(_rawFishermanState){
	// just a linear slope going downwards from not very frequent at x=45 to very frequent at x=-45.
	// .95 at -45 to .05 at 45, much more frequent to replace something at high anger (stage 0, etc).
	// return (-_rawFishermanState+45)*.01+.05
	return (-_rawFishermanState+45)*.005+.05 // made it less frequent than the comment because that was wayy too often
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
	// model.images.forEach(function(_image){
	// 	if (randomShouldReplace()) {
	// 		replaceImage(_image, randomElementInList(imagesToChooseFrom));
	// 	}
	// });

	for (i = 0; i < 6-stageAfterReplace; i++) {
		// loop through with a bunch replacing each second
		if (randomShouldReplace()) {
			replaceImage(getRandomItemFromSet(model.images), randomElementInList(imagesToChooseFrom));
		}
	}

}

function getRandomItemFromSet(set) {
	let items = Array.from(set);
    return items[Math.floor(Math.random() * items.length)];
}

function randomShouldReplace() {
	return Math.random() <= getReplaceChancePerStage(latestGame.rawFishermanState)
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
		console.log("RESETTING BECAUSE LENGTH IS 0");
		resetHeaders();
		return;
	}
	//reset on change
	if(getStage(latestGame.rawFishermanState) != stageAfterReplace){
		console.log("RESETTING BECAUSE CHANGE OF STAGE");
		resetHeaders();
	}
	model.modifiedContent.headers.forEach(function(_header){
		replaceHeader(_header, $(_header).attr("originalReplacement"));
	});
	for (var i = 0; i < 6-stageAfterReplace; i++) {
		// loop through with a bunch replacing each second
		if (randomShouldReplace()) {
			var chosenHeader = getRandomItemFromSet(model.headers);
			if(model.modifiedContent.headers.has(chosenHeader)){
				replaceHeader(getRandomItemFromSet(model.headers), randomElementInList(headersToChooseFrom));
			}
			
		}
	}

	//need to add randomness here


	
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

	
	

	$(element).addClass("alreadyModified");
	$(element).attr("originalSrc", origText);
	$(element).attr("originalReplacement", newText);

	model.modifiedContent.headers.add(element);
}

function changeHeaderBackToOriginal(element){

	model.modifiedContent.headers.delete(element);
	
	var src = $(element).attr("originalSrc");
	var originalReplacement = $(element).attr("originalReplacement");

	$(element).text(src);
	$(element).removeClass("alreadyModified");
	$(element).removeAttr("originalReplacement");
	$(element).removeAttr("originalSrc");

		
	


}




//hyperlinks
function replaceHyperlinks(){
	console.log(model.modifiedContent.hyperlinks.size);
	var hyperlinksImgsToChooseFrom = latestGame.replacementContent.popUps[getStage(latestGame.rawFishermanState)];
	
	if(hyperlinksImgsToChooseFrom.length===0){
		resetHyperlinks();
		return;
	}

	
	if(getStage(latestGame.rawFishermanState)!= stageAfterReplace){
		resetHyperlinks();
	}

	//need to add randomness here
	// model.hyperlinks.forEach(function(_hyperlink){
	// 	if (randomShouldReplace()) {
	// 		modifyHyperlink(_hyperlink, randomElementInList(hyperlinksImgsToChooseFrom));
	// 	}
	// });


	// model.hyperlinks.forEach(function(_hl){
	// 	modifyHyperlink(_hl, randomElementInList(hyperlinksImgsToChooseFrom));
	// });
	for (var i = 0; i < 6-stageAfterReplace; i++) {
		// loop through with a bunch replacing each second
		if (randomShouldReplace()) {
			modifyHyperlink(getRandomItemFromSet(model.hyperlinks), randomElementInList(hyperlinksImgsToChooseFrom));
		}
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
		$("_hyperlink").css("color", "black");
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
	$(element).css("color", "red");
	
	//$(element).attr("href", "https://kellyme213.github.io/games/fish/");




	
}

function changeHyperlinkBackToOriginal(element){
	model.modifiedContent.hyperlinks.delete(element);
	$(element).mousedown(function(){});
	$(element).removeClass("alreadyModified");
	$(element).removeClass("fishermanPopUp");
	
}

$(document).ready(function(){
	
	$(document).on('mouseover', ".fishermanPopUp", function() {
		for(var i = 0; i< 3; i++){
			var popupImg = new Image();
		
			
			popupImg.onload = function() {
				var w = window.open("", new Date().getTime(), "width="+this.width/4+", height="+this.height/4+", top="+ parseInt(Math.random()*1000)+", left= "+parseInt(Math.random()*1000)+", scrollbars=yes");
		    	var src = this.src;
				w.onload = function(){
					$(w.document.head).html(
						"<script src= 'http://code.jquery.com/jquery-3.4.1.js'"+
	  					"integrity='sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU='"+
	  					"crossorigin='anonymous'></script>"+
	  					"<title>BUY BOB'S BAIT!</title>"


					);

			    	$(w.document.body).html(
			    		
			    		"<style>img{width: 100%;height:100%;}</style>"+
			    		"<a href = 'https://kellyme213.github.io/games/fish/'><img src = '" + src + "'></a>"
			    	);

				}

		    	//src = (this.src).replaceAll("/", "ForwardSlash");
				
				
				console.log(this.width +", " + this.height);
			}

			popupImg.src = getRandomElement(latestGame.replacementContent.popUps[getStage(latestGame.rawFishermanState)]);
		}
	});
	if(!isFishingGame){
		setInterval(swingPage, 83);;
	}

	

});

var lambda = 0;
function swingPage(){
	

	var scale = Math.max(0, (-latestGame.rawFishermanState-30)+(swingLerpAmount/12.0)*rawFishermanStateDelta);
	scale*=50;
	console.log($("html").offset());
	$("html").offset({top: Math.sin(lambda) * scale, left: Math.cos(lambda) * scale});
	lambda+=0.1;
	swingLerpAmount++;
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
		"<p>replaceChance: "+getReplaceChancePerStage(latestGame.rawFishermanState)+"</p>"+
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
    _header = _header.replaceAll("{", "").replaceAll("}", "");

    return _header;
}


