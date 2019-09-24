var FISH_WIDTH = 194;
var FISH_HEIGHT = 116;

var fishImages = [
                  [
                  document.getElementById("fishGif0"),
                  document.getElementById("fishGif1"),
                  document.getElementById("fishGif2")
                  ],
                  [
                   document.getElementById("fishGif0back"),
                   document.getElementById("fishGif1back"),
                   document.getElementById("fishGif2back")
                   ]
                  ];

var boatImages = [
                  [
                   document.getElementById("fisherman1_0"),
                   document.getElementById("fisherman1_1"),
                   document.getElementById("fisherman1_2"),
                   document.getElementById("fisherman1_3"),
                   document.getElementById("fisherman1_4"),
                   document.getElementById("fisherman1_5"),
                   document.getElementById("fisherman1_6"),
                   document.getElementById("fisherman1_7")
                  ],
                  [
                   document.getElementById("fisherman2_0"),
                   document.getElementById("fisherman2_1"),
                   document.getElementById("fisherman2_2"),
                   document.getElementById("fisherman2_3")
                  ]
];

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

function renderSun(ctx)
{
    ctx.beginPath();
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.arc(50, 50, 20, 0, 2 * Math.PI);
    ctx.fill();
}

function renderFish(ctx, fish)
{
    var fishSet = 0;
    
    if (Math.abs(fish.angle) < 1.57)
    {
        fishSet = 1;
    }
    
    ctx.translate(fish.currentPoint.x, fish.currentPoint.y);
    ctx.drawImage(fishImages[fishSet][fish.gifState], 0, 0, FISH_WIDTH, FISH_HEIGHT);
    ctx.translate(-fish.currentPoint.x, -fish.currentPoint.y);
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
    var boatImage = (boatImages[boatDisplayState-1])[actualDispayState];
    ctx.drawImage((boatImages[boatDisplayState-1])[actualDispayState], 0, 0, 1720 * scale, CANVAS_HEIGHT);
}

function renderOcean(ctx)
{
    var oceanImage = document.getElementById("oceanSunny" + oceanState);
    ctx.drawImage(oceanImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function renderText(ctx, textObj)
{
    if (textObj === undefined)
    {
        return;
    }
    
    var textArray = textObj.text;
    var point = textObj.point;
    
    var fontSize = 50;
    var padding = 25;
    ctx.font = String(fontSize) + "px Comic Sans MS";
    
    var timeDiff = (new Date()).getTime() - interpolationTime;
    var interpolationValue = timeDiff / (1000 * timeBetweenSentence);
    
    interpolationValue = Math.min(Math.max(interpolationValue, 0), 1);
    
    var alpha = 1.0;
    
    if (interpolationValue > 0.9)
    {
        alpha = (1.0 - interpolationValue) / 0.10;
    }
    else if (interpolationValue < 0.10)
    {
        alpha = (interpolationValue / 0.10);
    }

    
    ctx.fillStyle = "rgba(255, 255, 255, " + alpha +")";
    
    for (var x = 0; x < textArray.length; x++)
    {
        ctx.fillText(textArray[x], point.x + padding, point.y + ((fontSize + padding) * (1 + x)));
    }
}

function renderCanvas()
{
    var ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, 2 * CANVAS_WIDTH, 2 * CANVAS_HEIGHT);

    renderBackground(ctx);
    renderOcean(ctx);
    renderBoat(ctx);
    renderText(ctx, getTextToDisplay());
    
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
