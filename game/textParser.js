var currentTextArray = [];
var maxLineSize = 10;
var numLinesShown = 3;
var currentTextIndex = 0;

function getTextToDisplay()
{
    return currentTextArray.slice(currentTextIndex, currentTextIndex + numLinesShown + 1);
}

function incrementTextIndex()
{
    currentTextIndex++;
}

function fetchNewText()
{
    currentTextIndex = 0;
    currentTextArray = [];
    requestNextLine();
}

function ingestText(text, timeForEachLine, timeBeforeFetchingNextStory)
{
    var splitList = text.split(" ");
    var textLine = "";
    var x = 0;
    
    for (; x < splitList.length; x++)
    {
        if (textLine.length + splitList[x].length + 1 >= maxLineSize)
        {
            //needed if the first element is larger that the max line size. Just add it anyways.
            if (x != 0)
            {
                currentTextArray.push(textLine);
            }
            
            textLine = "";
        }
        
        textLine += splitList[x] + " ";
    }
    
    if (textLine.length > 0)
    {
        currentTextArray.push(textLine);
    }
    
    for (x = 0; x < currentTextArray.length; x++)
    {
        setTimeout(incrementTextIndex, (x + 1) * timeForEachLine * 1000);
    }
    
    setTimeout(fetchNewText, ((currentTextArray.length + 1) * timeForEachLine + timeBeforeFetchingNextStory) * 1000);
}
