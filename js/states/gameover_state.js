import { BaseState } from './base_state.js';
import { GameOverMenu } from '../loop1/systems/gameover.js';

export class GameOverState extends BaseState {
    enter() {
        GameOverMenu.init(this.game);
    }

    update() {
        GameOverMenu.update();
    }

    draw(ctx) {
        GameOverMenu.render(ctx);
    }
}
