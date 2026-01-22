// import { BaseState } from './base_state.js';

class Loop1EndingState extends BaseState {
    update() {
        if (typeof Loop1Ending !== 'undefined') {
            Loop1Ending.update();
            // Check transition?
        }
    }

    draw(ctx) {
        if (typeof Loop1Ending !== 'undefined') {
            Loop1Ending.render(ctx);
        }
    }
}
