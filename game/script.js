var fishes = [];
var numFishes = 10;
var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 600;


function main()
{
    generateFishes();
    
    document.getElementById("maincanvas").addEventListener("click", clickFunction);
    var t = setInterval(globalUpdate, 16);
}

function generatePointInLake()
{
    var point = {};
    point.x = Math.random() * CANVAS_WIDTH;
    point.y = (Math.random() * 0.5 + 0.5) * CANVAS_HEIGHT;
    return point;
}

function generateFishes()
{
    for (var x = 0; x < numFishes; x++)
    {
        var newFish = {};
        newFish.startPoint = generatePointInLake();
        newFish.endPoint = generatePointInLake();
        newFish.currentPoint = {};
        newFish.interpolationStep = 1.0 / (Math.random() * 1000 + 250);
        newFish.currentInterpolation = 0.0;
        newFish.visible = (Math.random() > 0.5);
        var yx = (newFish.endPoint.y - newFish.startPoint.y) / (newFish.endPoint.x - newFish.startPoint.x);
        newFish.angle = Math.atan2((newFish.endPoint.y - newFish.startPoint.y), (newFish.endPoint.x - newFish.startPoint.x));
        fishes.push(newFish);
    }
}

function updateFish(fish)
{
    fish.currentInterpolation += fish.interpolationStep;
    if (fish.currentInterpolation >= 1.0)
    {
        fish.startPoint.x = fish.endPoint.x;
        fish.startPoint.y = fish.endPoint.y;
        var newEndPoint = generatePointInLake();
        fish.endPoint.x = newEndPoint.x;
        fish.endPoint.y = newEndPoint.y;
        fish.interpolationStep = 1.0 / (Math.random() * 1000 + 250);
        fish.currentInterpolation = 0.0;
        fish.visible = !fish.visible;
        var yx = (fish.endPoint.y - fish.startPoint.y) / (fish.endPoint.x - fish.startPoint.x);
        fish.angle = Math.atan2((fish.endPoint.y - fish.startPoint.y), (fish.endPoint.x - fish.startPoint.x));
    }
    
    fish.currentPoint.x = ((1.0 - fish.currentInterpolation) * fish.startPoint.x +
                            fish.currentInterpolation * fish.endPoint.x);
    fish.currentPoint.y = ((1.0 - fish.currentInterpolation) * fish.startPoint.y +
                            fish.currentInterpolation * fish.endPoint.y);
                              
}

function globalUpdate()
{
    for (var x = 0; x < numFishes; x++)
    {
        updateFish(fishes[x]);
    }
    
    renderCanvas();
}

function clickFunction()
{
    var rect = document.getElementById("maincanvas").getBoundingClientRect();
    var svgx = rect.x;
    var svgy = rect.y;
    
    var point = {};
    point.x = Number(window.event.clientX - svgx);
    point.y = Number(window.event.clientY - svgy);

    for (var x = 0; x < numFishes; x++)
    {
        if (pointInFish(point, fishes[x]))
        {
            if (fishes[x].visible) {
                fishes[x].visible = false;
                notifyFishCaught();
            }
        }
    }
}

function notifyFishCaught()
{
    // console.log("FISH!!");
    var data = { type: "FROM_PAGE", text: "Caught a fish!", number: 1 };
    window.postMessage(data, "*");
}

window.addEventListener('message', (event) => {
    // console.log(`Received message: ${event.data}`);
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type === "FROM_PAGE")) {
        if (event.data.text && (event.data.text === "Are you the fishing game?")) {
            var data = { type: "FROM_PAGE", text: "I'm the fishing game!" };
            window.postMessage(data, "*");
        }
        console.log("Fishing Game script received message: " + event.data.text);
    }
});


function pointInFish(point, fish)
{
    var fishX = Number(fish.currentPoint.x);// - (FISH_WIDTH / 2);
    var fishY = Number(fish.currentPoint.y);// - (FISH_HEIGHT / 2);
    var fishW = fishX + FISH_WIDTH;
    var fishH = fishY + FISH_HEIGHT;
    return ((fishX < point.x) &&
            (point.x < fishW) &&
            (fishY < point.y) &&
            (point.y < fishH));
}
