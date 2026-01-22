// import { BaseState } from './base_state.js';

class GameOverState extends BaseState {
    update() {
        if (typeof GameOverMenu !== 'undefined') {
            GameOverMenu.update(); // Assumes GameOverMenu is global
            // Need to handle restart or transition?
            // GameOverMenu usually reloads page or resets state.
        }
    }

    draw(ctx) {
        if (typeof GameOverMenu !== 'undefined') {
            GameOverMenu.render(ctx);
        }
    }
}
