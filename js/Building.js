// @ts-check

class Building {
    constructor(name, wps, cost) {
        this.name = name;
        this.wps = wps;
        this.cost = cost;
        this.quantity = 0;
    }

    tick() {
    }

    buy() {
        this.quantity++;
    }
}

export { Building };