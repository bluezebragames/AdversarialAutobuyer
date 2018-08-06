// @ts-check

import { Building } from "./Building.js"
import { Upgrade } from "./Upgrade.js"
import { fix } from "./Utils.js"

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

    buyBuilding(i) {
        if(this.words >= this.buildings[i].cost) {
            this.words -= this.buildings[i].cost;
            this.buildings[i].buy();
        }
    }

    createBuildings() {
        this.buildings.push(new Building("Building 1", 1, 10, 0));
        this.buildings.push(new Building("Building 2", 100, 100, 0));

        for (let i = 0; i < this.buildings.length; ++i) {
            const building = this.buildings[i];
            // create stat div on left panel
            const statDiv = document.createElement("div");
            statDiv.id = i + "stats";
            var leftpanel = document.getElementById("leftpanel");
            leftpanel.appendChild(statDiv);

            // create buttons on right panel
            const buttonDiv = document.createElement("div");
            const button = document.createElement("button")
            button.id = `button${i}`;
            button.classList.add('button');
            if(i % 2 == 0) {
                button.classList.add('grayed');
            }
            else {
                button.classList.add('notgrayed');
            }
            button.innerHTML = `Buy one <span id="bname${i}">${building.name}</span>`;
            buttonDiv.appendChild(button);
            buttonDiv.id = `${i}`;
            var rightpanel = document.getElementById("rightpanel");
            rightpanel.appendChild(buttonDiv);
        }

        var hr = document.createElement("hr");
        rightpanel.appendChild(hr);
    }

    loop() {
        const words_before = this.words;
        for (var i = 0; i < this.buildings.length; ++i) {
            const building = this.buildings[i];
            this.words += building.wps * building.quantity / this.fps;
        }
        const deltawords = this.words - words_before;
        this.wps = deltawords * this.fps;
        this.draw();

        // bind() to set the this var correctly.
        setTimeout(this.loop.bind(this), 1000 / this.fps);
    }

    draw() {
        var wordsDOM = document.getElementById("words");
        wordsDOM.innerHTML = fix(this.words) + " word" + (fix(this.words) == 1 ? "" : "s");
        var wpsDOM = document.getElementById("wordsps");
        wpsDOM.innerHTML = fix(this.wps) + " word" + (fix(this.wps) == 1 ? "" : "s") + " per second";
    }
}

export { Game };