export class BaseState {
    constructor(game) {
        this.game = game;
    }

    enter(params) { }
    exit() { }
    update() { }
    draw(ctx) { }
}
