


function generateReplacementContent() {
    globalReplacementContent.replacementContent = new Object();
    globalReplacementContent.replacementContent.images = [[], [], [], [], []];
    globalReplacementContent.replacementContent.headers = [[], [], [], [], []];
    globalReplacementContent.replacementContent.popUps = [[], [], [], [], []];
    // I will have to manually set all of the images here
    loadOurContent();
    console.log(globalReplacementContent);
}



function loadOurContent(){
    //images
    addImage("/images/FishermanandSon_polaroid.png", [0, 1]);
    addImage("/images/FirstBoat_polaroid.png", [0, 1]);
    addImage("/images/OldManStorm1_polaroid.png", [1, 2]);
    addImage("/images/OldManBigFish_polaroid.png", [1, 2, 3]);
    addImage("/images/FishSoBig_polaroid.png", [2, 3]);
    addImage("/images/OldMan_Polaroid.png", [2, 3, 4]);
    addImage("/images/OldManSunrise_polaroid.png", [2, 3, 4]);
    addImage("/images/OldSelfie_polaroid.png", [3, 4]);
    addImage("/images/FishMan_polaroid.png", [3, 4]);
    addImage("/images/FishMan_polaroid.png", [3, 4]);

    addImage("/images/FirstBoat_Polaroid.png", [2, 3, 4]);
    addImage("/images/FishingSon_Polaroid", [1,2]);
    addImage("/images/Shesamonster_Polaroid.png", [3, 4]);

    //headers
    // addHeader("fish w me bitch im mad u have spent like <timeSpentFishing> with me:(", [0]);
    // addHeader("fish w me plz", [4]);
    // addHeader("thank you for everything you've done:)", [4]);
    // addHeader("I'm getting a lil lonley", [3]);
    // addHeader("I've only caught <fish_caught> fish with you and you've spent <timeSpentFishing> with me:(", [0, 1, 2]);

    addHeader("I’ll be here waiting for you, and so will the fish!", [3, 4]);
    addHeader("I’ve caught a real big one! #shesamonster", [4]);
    addHeader("Take your time out there! I’ll be here when you come back.", [3, 4]);
    addHeader("When are you coming back? It’s a perfect day for some fishing!", [3, 4]);
    addHeader("The sky is blue, the sea is clear. All I need now is for the fish to bite!", [4]);
    addHeader("Hey! Don’t know if you can see this but you’re always welcome to fish with me!", [3, 4]);
    addHeader("Hey, I miss you, hope you come back soon!", [2, 3]);
    addHeader("Where did you go?", [0]);
    addHeader("Please come back", [0]);
    addHeader("It’s lonely out here all on my own", [0]);
    addHeader("I miss you", [0]);
    addHeader("I’ve caught a big one just for you!", [3, 4]);
    addHeader("Why did you leave me?", [0]);
    addHeader("You're all I have", [0]);
    addHeader("The best day for fishing is Sunday. Everyone else is out at church!", [3, 4]);
    addHeader("When are you coming back? The fish are biting real good today!", [2, 3]);
    addHeader("It’s a perfect day to catch the perfect fish!", [3, 4]);
    addHeader("Come back", [0, 1]);
    addHeader("I’ll be waiting, no matter how long it takes.", [0, 1]);
    addHeader("Have you ever tried out Bob’s Bait? I’m telling you, if you’re into buying branded bait that’s the stuff!", [3, 4]);
    addHeader("You caught {fish_caught} fish already! A natural!", [4]);
    

    // these ones could be paragraphs or inserted into paragraphs
    addHeader("What’s your favorite type of fish? Mine’s the red snapper! A beautiful specimen and tasty too!", [4]);
    addHeader("Looks like a storm is brewing so I respect your choice not to be out here! You better get back as soon as it ends though, that’s prime time for a big catch!", [2]);
    addHeader("It’s been a long time since I last saw you friend, are you feeling alright? I’ve got a hell of a cold remedy if you need it! Keeps me on the sea 24/7!", [2, 3]);
    addHeader("Catch and release is the only real type of fishing anything else is hunting with a fishing pole!", [3, 4]);
    addHeader("Hey, there’s a storm brewing up out here. Rain’s the best weather for fishing you know!", [3, 4]);
    addHeader("Why did you leave me.", [0]);
    addHeader("Come back.", [0]);
    addHeader("Don't leave me.", [0, 1]);
    addHeader("This is not dissimilar to an old fishing tale when you think about it.", [4]);
    addHeader("I’d love to talk with you about all this!", [2, 3]);
    addHeader("Much like a strong storm blowing in from the southern seas!", [2, 3]);



    //popups
    addPopup("/images/Ads/BaitClub.png", [0,1,2,3,4]);
    addPopup("/images/Ads/BaitTackle.png", [0,1,2,3,4]);
    addPopup("/images/Ads/BobsBait.png", [0,1,2,3,4]);
    addPopup("/images/Ads/FishPole.png", [0,1,2,3,4]);
    addPopup("/images/Ads/Gift.png", [0,1,2,3,4]);
    addPopup("/images/Ads/SexyMan.png", [0,1,2,3,4]);
    addPopup("/images/Ads/YouWin.png", [0,1,2,3,4]);
}



function addImage(src, levels){
    var imgSrc = chrome.runtime.getURL(src);
    console.log(imgSrc);
    for(var i = 0; i<levels.length; i++){
        if(levels[i]>=globalReplacementContent.replacementContent.images.length){
            console.log("invalid level");
            continue;
        }
        globalReplacementContent.replacementContent.images[levels[i]].push(imgSrc);
    }
}

function addPopup(src, levels){
    var imgSrc = chrome.runtime.getURL(src); //was globalreplacementcontent
    
    for(var i = 0; i<levels.length; i++){
        if(levels[i]>=globalReplacementContent.replacementContent.popUps.length){
            console.log("invalid level");
            continue;
        }
        globalReplacementContent.replacementContent.popUps[levels[i]].push(imgSrc);
    }
}

function addHeader(text, levels){
    


    for(var i = 0; i<levels.length; i++){
        if(levels[i]>=globalReplacementContent.replacementContent.headers.length){
            console.log("invalid level");
            continue;
        }

        globalReplacementContent.replacementContent.headers[levels[i]].push(text);
    }
}