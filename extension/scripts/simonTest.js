

$(document).ready(function(){
	

	

	$(document).mousedown(function(){
		console.log("mouse down");
		updateGame(function(data){
			// var _game = data;
			// console.log(_game);
			console.log("updatedGame");
		});
	});

	$(document).dblclick(function(){
		chrome.runtime.sendMessage({message: "clearGame"},function(){
			return Promise.resolve("Dummy response to keep the console quiet");
		});
	});
});



function updateGame(callback){

	chrome.runtime.sendMessage({message: "getGame"},function(){
		return Promise.resolve("Dummy response to keep the console quiet");
	});

	
}

chrome.runtime.onMessage.addListener(function(request, sender) {

    if (request.message === "getGame"){

    	var newData = request.data.game;
    	var d = new Date();
		var n = d.getTime();
		console.log(newData);
		newData.times.push(n);
    	

    	chrome.runtime.sendMessage({message: "setGame", data: newData},function(){

    	});

    	
    }

    return Promise.resolve("Dummy response to keep the console quiet");

});

// chrome.runtime.onMessage.addListener(function(request, sender) {

//     if (request.message === "requestGameData"){
//     	console.log("client recieved game data")
//     	var newData = request.data.game;
//     	console.log("recieved data");
//     	var d = new Date();
// 		var n = d.getTime();
// 		console.log(newData);
//     	newData.times.push(n);
//     	console.log("setting new game data...");
//     	chrome.runtime.sendMessage({message: "setGameData", data: newData},function(){});
//     }
// });


// chrome.runtime.onMessage.addListener(){

// }