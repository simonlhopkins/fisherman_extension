

$(document).ready(function(){
	

	

	$(document).mousedown(function(){
		chrome.runtime.sendMessage({message: "requestGameData"},function(){
			
		});
	});
});





chrome.runtime.onMessage.addListener(function(request, sender) {

    if (request.message === "requestGameData"){
    	console.log("client recieved game data")
    	var newData = request.data.game;
    	console.log("recieved data");
    	var d = new Date();
		var n = d.getTime();
		console.log(newData);
    	newData.times.push(n);
    	console.log("setting new game data...");
    	chrome.runtime.sendMessage({message: "setGameData", data: newData},function(){});
    }
});


// chrome.runtime.onMessage.addListener(){

// }