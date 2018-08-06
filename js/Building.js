// @ts-check

class Building {
    constructor(name, wps, cost, quantity) {
        this.name = name;
        this.wps = wps;
        this.cost = cost;
        this.quantity = quantity;
    }

    tick() {
    }

    buy() {
        this.quantity++;
    }
}

export { Building };