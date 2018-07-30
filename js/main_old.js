//@ts-check

/*
    Helper functions!
    I never really understood the distinction between helper functions and regular
    functions...  All functions are supposed to be helpful (right?)
*/

// beautify a number
var fix = function(num)
{
    // first of all, is it >= 1,000,000?

    if(num >= 1000000)
    {
        var numdigits = Math.floor(Math.log(num) / Math.log(10) + .0001);
        var numgroupsofthree = Math.floor(numdigits / 3);
        numdigits -= numdigits % 3;
        switch (numgroupsofthree)
        {
        case 2:
            var postfix = "million";
            break;
        case 3:
            var postfix = "billion";
            break;
        case 4:
            var postfix = "trillion";
            break;
        case 5:
            var postfix = "quadrillion";
            break;
        case 6:
            var postfix = "quintillion";
            break;
        default:
            var postfix = "...  A lot";
        }
        return Math.floor((1000 * num / Math.pow(10, numdigits)) + .001) / 1000 + " " + postfix;
    }

    return Math.floor(num + .001);
}

/*
    CLASSES! (well they would be called classes but it's JS)
*/

var Building = function(bprice,wpsgain,howmany,called,onbuy){
    this.bprice=bprice;
    this.price=bprice;
    this.wpsgain=wpsgain;
    this.howMany=howmany;
    this.called=called;
    this.onbuy=onbuy;

    /*this.tooltip = function(){
        return '<div>Name: ' + this.called + ' </div>' + '<div>Amount: ' + this.howMany + '</div'
        + '<div>Price: ' + this.price + '</div>';
    }*/
}

var Float = function(x, y, text) {
    this.x = x + 5 * (Math.random()) - 5;
    this.y = y - 30;
    this.text = text;

    this.div = document.createElement("div");
    this.div.innerHTML = this.text;
    this.div.style.left = this.x + "px";
    this.div.style.top = this.y + "px";
    this.div.style.position = "absolute";
    this.div.style.cursor = "pointer";
    this.div.style.pointerEvents = "none";
    document.getElementById("leftpanel").appendChild(this.div);

    this.update = function() {
        this.y-=2;
        this.div.style.top = this.y + "px";
    }
}



Game = {};

/*Game.tooltip = function(html){
    div = document.getElementById("tooltip");
    this.html = html;
    div.innerHTML = this.html;
}
Game.tooltip.get = function(html){
    
}
Game.tooltip.hide = function(){

}*/

/*
    SETUP STUPH!  But then again it's almost all setup stuph
*/

// resets things and loads the save from localstorage
Game.Launch = function() {
    Game.wps = 0;
    Game.words = 0;
    Game.wordsd = 0;
    Game.wordsAllTime = 0;
    Game.priceScale = 1.15;
    Game.fps = 60;
    Game.buildings = [];
    Game.buildings.push(new Building(15,0.1,0,"B1",function(){
        var numUpgrades = 0;
        if(Game.upgrades['test'].status === 2)
        {
            numUpgrades += 1;
        }
        this.wpsgain *= Math.pow(2, numUpgrades);
    }));
    Game.buildings.push(new Building(100,1,0,"B2"));
    Game.buildings.push(new Building(10000,500,0,"B3"));
    Game.buildBuildings();
    Game.floats = [];
    Game.upgrades = [];
    Game.buildUpgrades();

    //Game.tooltip(Game.buildings[0].tooltip());
    if (localStorage.getItem("game"))
    {
        Game.loadSave(localStorage.getItem("game"));
    }

    document.getElementById("greeting").innerHTML = "Hello " + Game.playerName + "!";
    
}

// creates divs and buttons for buildings
Game.buildBuildings = function() {
    for(b in Game.buildings)
    {
        // create stat div on left panel
        var div = document.createElement("div");
        div.id = b + "stats";
        var leftpanel = document.getElementById("leftpanel");
        leftpanel.appendChild(div);

        // create buttons on right panel
        div = document.createElement("div");
        var b1 = b + 1;
        div.innerHTML = '<button id="button'+b+'">Buy one <span id="bname'+b+'">"Building '+b1+'"</span></button><span id="b'+b+'"></span>'
        div.id = b;
        var rightpanel = document.getElementById("rightpanel");
        rightpanel.appendChild(div);
    }
    var hr = document.createElement("hr");
    rightpanel.appendChild(hr);
}

/*
    SAVING (and for some reason, renaming your character...  whatevs)
*/

// import the save file as text
Game.importSave = function() {
    var sve = prompt("Paste save here!");
    Game.loadSave(sve);
}

// export the save file as text
Game.exportSave = function() {
    prompt("Copy and paste this save!", Game.Save());
}

// the onclick function for the name
Game.newName = function() {
    Game.playerName = prompt("What's your name?");
    document.getElementById("greeting").innerHTML = "Hello " + Game.playerName + "!";

}

// save the game, maybe?
Game.Save = function() {
    var str = '';
    str += Game.wordsd + '|';
    for(b in Game.buildings)
    {
        str += Game.buildings[b].howMany + ',';
    }
    str += '|';
    str += Game.playerName + '|';
    str += '|';
    str += parseInt(Game.wordsAllTime) + '|';

    // upgrades
    var tempstr = '';
    for(u in Game.upgrades)
    {
        if(!isNaN(u))
        {
            if(Game.upgrades[u].status === 4)
            {
                tempstr += '1';
            }
            else{tempstr += '0';}
        }
    }
    str += tempstr + '|'; // yeah someday I should compress the upgrades... whatevs

    localStorage.setItem("game", str);
    var save = document.getElementById("save");
    save.innerHTML += "Game Saved";

    setTimeout(Game.Save, 10000);
    setTimeout(Game.clearMiddle, 1500);

    return str;
}

// load the save, maybe?
Game.loadSave = function(file) {
    splitfile = file.split('|');
    Game.words = parseInt(splitfile[0]);
    buildingCount = splitfile[1].split(',');
    for(var i = 0; i<Game.buildings.length; ++i)
    {
        Game.buildings[i].howMany = buildingCount[i];
    }
    Game.playerName = splitfile[2].toString();
    Game.wordsAllTime = parseInt(splitfile[4]);

    // upgrades
    // can't set upgrades if we haven't built them yet -- luckily, building occurs before loading the save
    for(c in splitfile[5])
    {
        if(splitfile[5][c] === '1' && Game.upgrades[c])
        {
            Game.upgrades[c].status = 3;
        }
        else if(splitfile[5][c] === '0'){Game.upgrades[c].status = 0;}
    }


    Game.recalculate();
}

/*
    PRESTIGE!
*/

// reset the game!
Game.reset = function(kind)
{
    if(kind)
    {
        Game.loadSave("0|0,0,0,|0|0|0");
        Game.wordsAllTime = 0;
    }
}

/*
    UPGRADES!
*/

var Upgrade = function(name, desc, price) {
    this.name = name;
    this.price = price;
    this.desc = desc;
    this.status = 1; // 0 = nothing, 1 = unlocked but not affordable, 2 = affordable, 3 = bought

    this.div = document.createElement("div");
    this.div.id = "div" + this.name;
    this.div.innerHTML = "<button id=" + this.name + " onMouseOver=\"Game.puttextindiv(document.getElementById(\'mousediv\'), \'<hr>" + this.desc + "<hr>\');\" onMouseOut=\"Game.puttextindiv(document.getElementById(\'mousediv\'),'')\">" + this.name + "</button>";
    
    var rightpanel = document.getElementById("rightpanel");
    rightpanel.appendChild(this.div);
    this.button = document.getElementById(this.name);

    this.update = function() {
//
    }

    Game.upgrades[this.name] = this;
}

Game.buildUpgrades = function() {
    Game.upgrades.push(new Upgrade("temp","afoiejf",100));


    // to build the buttons on the right side
    Game.checkUpgrades();
}

/*
    GAME LOGIC!
*/

Game.checkEverything = function() {
    Game.checkBuildings();
    Game.checkUpgrades(); // DON'T EVEN TRY THIS
    //Game.checkAchievements(); // NOT DONE
}

// add things when you click!
Game.click = function(event) {
    Game.words++;
    Game.wordsAllTime++;

    // create new floating text thingy
    Game.floats.push(new Float(event.x, event.y,  "+" + 1));
}

Game.recalculate = function(){
    Game.recalculatePrice();
    Game.recalculateWps();
}

// have any buildings become affordable?
// have any buildings become too expensive?
Game.checkBuildings = function(){
    for(b in Game.buildings)
    {
        if(Game.words < Game.buildings[b].price)
        {
            var temp = document.getElementById("button"+b);
            temp.className = "grayed";
        }
        else if(Game.words >= Game.buildings[b].price)
        {
            var temp = document.getElementById("button"+b);
            temp.className = "notgrayed";
        }
    }
}

// see above, but for upgrades (I'm too lazy to type it all out again)
Game.checkUpgrades = function(){
    for(b in Game.upgrades)
    {
        var up = Game.upgrades[b];
        // affordability
        if(Game.words < up.price && up.status != 0 && up.status < 3)
        {
            up.status = 1;
        }
        else if(Game.words >= up.price && up.status != 0 && up.status < 3)
        {
            up.status = 2;
        }
        // based on status
        switch(up.status)
        {
        case 0:
            break;
        case 1:
            var temp = document.getElementById(up.name);
            temp.className = "grayed";
            break;
        case 2:
            var temp = document.getElementById(up.name);
            temp.className = "notgrayed";
            break;
        case 3:
            var temp = document.getElementById(up.name);
            var rightpanel = document.getElementById("div"+up.name);
            rightpanel.removeChild(temp);
            up.status = 4;
            break;
        case 4:
            break;
        }
    }
}

// update the floating text to make it float up and die when it hits the top
Game.updateFloats = function() {
    for(f in Game.floats)
    {
        Game.floats[f].update();
        if(Game.floats[f].y <= -10)
        {
            //console.log("foajeoi");
            document.getElementById("leftpanel").removeChild(Game.floats[f].div);
            Game.floats.splice(f,1);
            f--;
        }
    }
}

// when you buy a building, cost increases
Game.recalculatePrice = function() {
    for(b in Game.buildings)
    {
        Game.buildings[b].price = Game.buildings[b].bprice * Math.pow(Game.priceScale, Game.buildings[b].howMany);
    }
}

// how about this recalculates the wps
Game.recalculateWps = function() {
    Game.wps = 0;
    for(b in Game.buildings)
    {
        Game.wps += Game.buildings[b].wpsgain * Game.buildings[b].howMany;
    }
}

// buys the building when you can afford it and you click it
Game.buyBuildings = function(whichBuilding) {
    if(Game.words>=Game.buildings[whichBuilding].price)
    {
        Game.words -= Game.buildings[whichBuilding].price;
        Game.buildings[whichBuilding].howMany++;
        Game.recalculate();
    }
}

// buys the upgrade when you can afford it and you click it
Game.buyUpgrades = function(whichUpgrade) {
    if(Game.upgrades[whichUpgrade].status === 2)
    {
        alert("faoj!");
        Game.words -= Game.upgrades[whichUpgrade].price;
        Game.upgrades[whichUpgrade].status = 3;
        Game.recalculate();
    }
}

// get words from idling
Game.Logic = function() {
    Game.words += Game.wps/Game.fps;
    Game.wordsAllTime += Game.wps/Game.fps;
    Game.wordsd = fix(Game.words);
    Game.recalculate();
    Game.updateFloats();
    document.title = Game.wordsd;
}

/*
    DRAWING!
*/

// put text in a div!
Game.puttextindiv = function(div, text) {
    div.innerHTML = text;
}

// draw everything!  mostly a wrapper function
Game.Draw = function() {
    Game.drawPic();
    Game.drawBuildings();
    Game.drawStats();
}

// draw the lone image
Game.drawPic = function() {
    Game.leftCanvas = document.getElementById("leftCanvas").getContext('2d');
    var img = new Image();
    img.onload = function()
    {
        document.getElementById("leftCanvas").style.backgroundColor = "white";
        Game.leftCanvas.drawImage(img,0,0);
    }
    img.src = "img/paper.png";
    img.width = leftCanvas.width;
    img.height = leftCanvas.height;
}

// how about it draws the functions
Game.drawBuildings = function() {
    for(b in Game.buildings)
    {
        if(Game.wordsAllTime >= Game.buildings[b].bprice)
        {
            var div = document.getElementById(b);
            div.style.display = "block";
            // inside the button
            var spn = document.getElementById("bname" + b);
            spn.innerHTML = Game.buildings[b].called;
            // outside the button
            var spn = document.getElementById("b" + b);
            spn.innerHTML = " Price: " + fix(Game.buildings[b].price) + " words";
        }
        else if(b == 0 || Game.wordsAllTime >= Game.buildings[b-1].bprice)
        {
            var div = document.getElementById(b);
            div.style.display = "block";
            // inside the button
            var spn = document.getElementById("bname" + b);
            spn.innerHTML = "???";
            // outside the button
            var spn = document.getElementById("b" + b);
            spn.innerHTML = " Price: " + fix(Game.buildings[b].price) + " words";
        }
        else
        {
            var div = document.getElementById(b);
            div.style.display = "none";
        }
    }
}

// draws the statistics of how many buildings you have in the left panel
Game.drawStats = function() {
    for(b in Game.buildings)
    {
        var currDiv = document.getElementById(b+"stats");
        if(Game.buildings[b].howMany != 0){currDiv.innerHTML = "You have " + Game.buildings[b].howMany + " " + Game.buildings[b].called + (Game.buildings[b].howMany == 1 ? "" : "s");}
        else{currDiv.innerHTML = "";}
    }
}

// remove the "game saved" from the middle panel
Game.clearMiddle = function() {
    var save = document.getElementById("save");
    save.innerHTML = "";
}

/*
    Let's do this thing!
*/

// everything that happens every frame
Game.Loop = function () {
    var meh = document.getElementById("words");
	meh.innerHTML = Game.wordsd + " words";
    var wps = document.getElementById("wordsps");
    wps.innerHTML = fix(10*Game.wps)/10.0 + " words per second";
    

    Game.catchuplogic = 0;
    Game.Logic();
    Game.Draw();
    Game.checkEverything();


    setTimeout(Game.Loop, 1000/Game.fps);
}

window.onload = function() {
    Game.Launch();
    Game.Loop();
    Game.Save();
    document.getElementById("leftCanvas").addEventListener("click", Game.click, false);
    for(var i = 0; i < Game.buildings.length; i++)
    {
        document.getElementById(i).addEventListener("click", function(i){return function(){Game.buyBuildings(i)};}(i), false);
    }
    for(i in Game.upgrades)
    {
        document.getElementById(Game.upgrades[i].name).addEventListener("click", function(i){return function(){Game.buyUpgrades(i)};}(i), false);
    }
}
