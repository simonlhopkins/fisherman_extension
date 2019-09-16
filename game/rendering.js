var FISH_WIDTH = 60;
var FISH_HEIGHT = 30;

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

function renderOcean(ctx)
{
    ctx.fillStyle = "rgb(80, 80, 255)";
    ctx.fillRect(0, 300, 600, 300);
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
    ctx.translate(fish.currentPoint.x, fish.currentPoint.y);
    //ctx.rotate(fish.angle);
    ctx.drawImage(document.getElementById("fishImage"), 0, 0, FISH_WIDTH, FISH_HEIGHT);
    //ctx.rotate(-fish.angle);
    ctx.translate(-fish.currentPoint.x, -fish.currentPoint.y);
}

function renderCanvas()
{
    var canvas = document.getElementById("maincanvas");
    var ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    renderMountains(ctx);
    renderOcean(ctx);
    renderSun(ctx);
    
    for (var x = 0; x < numFishes; x++)
    {
        if (fishes[x].visible)
        {
            renderFish(ctx, fishes[x]);
        }
    }
}
