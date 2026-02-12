import { BaseState } from './base_state.js';
import { Opening } from '../loop1/systems/opening.js';

export class OpeningState extends BaseState {
    enter() {
        Opening.init(this.game);
    }

    update() {
        Opening.update();
        // State transition handled in Opening.js
    }

    draw(ctx) {
        Opening.render(ctx);
    }
}
