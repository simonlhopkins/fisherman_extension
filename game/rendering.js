var FISH_WIDTH = 194;
var FISH_HEIGHT = 116;

function renderMountains(ctx)
{
    ctx.beginPath();
    ctx.fillStyle = "rgb(150, 75, 0)";
    ctx.moveTo(0, 300);
    ctx.lineTo(200, 100);
    ctx.lineTo(400, 300);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.fillStyle = "rgb(150, 75, 0)";
    ctx.moveTo(200, 300);
    ctx.lineTo(400, 100);
    ctx.lineTo(600, 300);
    ctx.closePath();
    ctx.fill();
}

//function renderOcean(ctx)
//{
//    ctx.fillStyle = "rgb(80, 80, 255)";
//    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
//}

function renderSun(ctx)
{
    ctx.beginPath();
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.arc(50, 50, 20, 0, 2 * Math.PI);
    ctx.fill();
}

function renderFish(ctx, fish)
{
    if (Math.abs(fish.angle) < 1.57)
    {
        ctx.translate(fish.currentPoint.x + (FISH_WIDTH * 0.5), fish.currentPoint.y + (FISH_HEIGHT * 0.5));
        ctx.scale(-1, 1);
        ctx.drawImage(document.getElementById("fishGif" + fish.gifState), 0, 0, FISH_WIDTH, FISH_HEIGHT);
        ctx.scale(-1, 1);
        ctx.translate(-fish.currentPoint.x - (FISH_WIDTH * 0.5), -fish.currentPoint.y - (FISH_HEIGHT * 0.5));
    }
    else
    {
        ctx.translate(fish.currentPoint.x, fish.currentPoint.y);
        ctx.drawImage(document.getElementById("fishGif" + fish.gifState), 0, 0, FISH_WIDTH, FISH_HEIGHT);
        ctx.translate(-fish.currentPoint.x, -fish.currentPoint.y);
    }
}

function renderBackground(ctx)
{
    ctx.drawImage(document.getElementById("backgroundImage"), 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function renderBoat(ctx)
{
    var actualDispayState = boatState;
    if (boatDisplayState == 2)
    {
        actualDispayState = actualDispayState % 4;
    }
    var boatImage = document.getElementById("fisherman" + boatDisplayState + "_" + actualDispayState);
    ctx.drawImage(boatImage, 0, 0, 4299 * scale, CANVAS_HEIGHT);
}

function renderOcean(ctx)
{
    var oceanImage = document.getElementById("oceanSunny" + oceanState);
    ctx.drawImage(oceanImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function renderText(ctx, textArray)
{
    var fontSize = 100;
    var padding = 50;
    ctx.font = String(fontSize) + "px Comic Sans MS";
    
    ctx.fillStyle = "rgb(255, 255, 255)";
    
    for (var x = 0; x < textArray.length; x++)
    {
        ctx.fillText(textArray[x], padding, (fontSize + padding) * (1 + x));
    }
}

function renderCanvas()
{
    var canvas = document.getElementById("maincanvas");
    var ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, 2 * CANVAS_WIDTH, 2 * CANVAS_HEIGHT);

    //renderMountains(ctx);
    renderBackground(ctx);
    renderOcean(ctx);
    renderText(ctx, getTextToDisplay());
    renderBoat(ctx);
    //renderSun(ctx);
    
    for (var x = 0; x < numFishes; x++)
    {
        if (fishes[x].visible)
        {
            renderFish(ctx, fishes[x]);
        }
    }
}

var boatState = 0;
var boatDisplayState = 2;
function animateBoatState()
{
    boatState = (boatState + 1) % 8;
    
    if (boatState == 0)
    {
        if (Math.random() < 0.3)
        {
            boatDisplayState = 1;
        }
        else
        {
            boatDisplayState = 2;
        }
    }
}

var oceanState = 0;
function animateOceanState()
{
    oceanState = (oceanState + 1) % 5;
}
