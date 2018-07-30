//@ts-check
var game;

var fix = function(num) {
  return Math.floor(num + .001);
}

class Game {
  constructor() {
    this.words = 0;
    this.words_per_click = 1;
    this.wps = 0;
    this.buildings = [];
    this.fps = 60;
  }


  click() {
    this.words += this.words_per_click;
  }

  createBuildings() {
    this.buildings.push(new Building("Building 1", 1, 10));

    for(var building in this.buildings)
    for(let i = 0; i < this.buildings.length; ++i) {
      const building = this.buildings[i];
      console.log(building);
      // create stat div on left panel
      var div = document.createElement("div");
      div.id = building + "stats";
      var leftpanel = document.getElementById("leftpanel");
      leftpanel.appendChild(div);

      // create buttons on right panel
      div = document.createElement("div");
      var b1 = building + 1;
      //div.innerHTML = '<button id="button' + building + '">Buy one <span id="bname'+building+'">"Building '+b1+'"</span></button><span id="b'+building+'"></span>'
      div.innerHTML = `<button id="button${building}">Buy one <span id="bname${building}">${building}</span></button><span id="b${building}"></span>`
      div.id = building;
      var rightpanel = document.getElementById("rightpanel");
      rightpanel.appendChild(div);
    }
    var hr = document.createElement("hr");
    rightpanel.appendChild(hr);
  }

  loop() {
    const words_before = this.words;
    for(var i = 0; i < this.buildings.length; ++i) {
      this.buildings[i].tick();
    }
    const deltawords = this.words - words_before;
    this.wps = deltawords * this.fps;
    this.draw();

    // bind() to set the this var correctly.
    setTimeout(this.loop.bind(this), 1000/this.fps);
  }

  draw() {
    var wordsDOM = document.getElementById("words");
    wordsDOM.innerHTML = fix(this.words) + " word" + (fix(this.words) == 1 ? "" : "s");
    var wpsDOM = document.getElementById("wordsps");
    wpsDOM.innerHTML = fix(this.wps) + " word" + (fix(this.wps) == 1 ? "" : "s") + " per second";
  }
}

class Building {
  constructor(name, wps, cost) {
    this.name = name;
    this.wps = wps;
    this.cost = cost;
    this.quantity = 0;
  }

  tick() {
    game.words += this.wps * this.quantity / game.fps;
  }

  buy() {
    if(game.words >= this.cost) {
      game.words -= this.cost;
      this.quantity++;
    }
  }
}


window.onload = function() {
  game = new Game();

  game.createBuildings();

  document.
    getElementById("leftCanvas").
    addEventListener("click", game.click.bind(game), false);

  for(var i = 0; i < game.buildings.length; i++) {
    document.
      getElementById(""+i).
      addEventListener("click", 
        function(i){
          return function() {
            game.buildings[i].buy();
          };
        }(i), false);
  }

  game.loop();
}
