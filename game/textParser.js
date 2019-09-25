var currentTextArray = [];
var maxLineSize = 50;
var numLinesShown = 20;
var currentTextIndex = 0;
var interpolationTime = 0;
var timeBetweenSentence = 0;


function getRandomTextLocation()
{
    var point = {};
    point.x = (Math.random() * CANVAS_WIDTH * 0.5);
    point.y = (Math.random() * CANVAS_HEIGHT * 0.5);
    return point;
}

function getTextToDisplay()
{
    return currentTextArray[currentTextIndex];
}

function incrementTextIndex()
{
    currentTextIndex++;
    interpolationTime = (new Date()).getTime();
}

function fetchNewText()
{
    currentTextIndex = 0;
    currentTextArray = [];
    requestNextLine();
}

function ingestText(text, timeForEachLine, timeBeforeFetchingNextStory)
{
    timeBetweenSentence = timeForEachLine;
    var sentenceList = text.split("~~ ");
    var y = 0;
    for (; y < sentenceList.length; y++)
    {
        var x = 0;
        var textLine = "";
        var splitList = sentenceList[y].split(" ");
        
        var sentenceArray = [];
        for (; x < splitList.length; x++)
        {
            if (textLine.length + splitList[x].length + 1 >= maxLineSize)
            {
                //needed if the first element is larger that the max line size. Just add it anyways.
                if (x != 0)
                {
                    sentenceArray.push(textLine);
                }
                
                textLine = "";
            }
            
            textLine += splitList[x] + " ";
        }
        
        if (textLine.length > 0)
        {
            sentenceArray.push(textLine);
        }
        
        var obj = {};
        obj.text = sentenceArray;
        obj.point = getRandomTextLocation()
        currentTextArray.push(obj);
    }
    for (y = 0; y < currentTextArray.length; y++)
    {
        setTimeout(incrementTextIndex, (y + 1) * timeForEachLine * 1000);
    }
    
    setTimeout(fetchNewText, ((currentTextArray.length + 1) * timeForEachLine + timeBeforeFetchingNextStory) * 1000);
    interpolationTime = (new Date()).getTime();
}
