$.when(populateModel()).done(main());


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
});


function main(){
	var fishSrc = chrome.runtime.getURL("images/temp1.jpg");

	for(var i = 0; i< model.headers.length; i++){
		$(model.headers[i]).text("f i s h e r m a n");
	}

	
	for(var i = 0; i < model.images.length; i++){
		// if($(model.images[i]).id === "fishGif"){
		// 	continue;
		// }
		model.images[i].src = fishSrc;
	}
	console.log("update");
	
	
}

setInterval(function(){
	populateModel();
	$.when(populateModel()).done(main());
}, 1000);

