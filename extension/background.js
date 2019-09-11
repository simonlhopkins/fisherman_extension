

chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.type == "notification"){
    	console.log("notification was recieced by background: " + request.message);
    }
});


var game = {
	state: ""
}