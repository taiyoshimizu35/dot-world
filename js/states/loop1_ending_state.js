import { BaseState } from './base_state.js';
import { Loop1Ending } from '../loop1/systems/loop1_ending.js';

export class Loop1EndingState extends BaseState {
    enter() {
        Loop1Ending.init(this.game);
    }

    update() {
        Loop1Ending.update();
    }

    draw(ctx) {
        Loop1Ending.render(ctx);
    }
}
