// this file only handles fisherman lines
// I'm trying to figure out the best way to split up functions but I guess we'll see!

window.addEventListener('message', (event) => {
    // console.log(`Received message: ${event.data}`);
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type === "FROM_PAGE")) {
    	if (event.data.message === "requestNextFishermanLine") {
        	var lineData = getNextLine();
        	var data = { type: "FROM_PAGE", message: "nextFishermanLine", data: lineData };
            event.source.postMessage(data, "*"); // should only send it to who asked
        }
    }
});

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     sendResponse( {response:"Dummy response"} );
// });


function getNextLine() {
    return { line: "Oh they're biting alright!", timeToNextStory:5, timeForEachLine:2 };
}
