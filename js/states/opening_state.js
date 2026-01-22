// import { BaseState } from './base_state.js';

class OpeningState extends BaseState {
    enter() {
        if (typeof Opening !== 'undefined') Opening.init();
    }

    update() {
        if (typeof Opening !== 'undefined') {
            Opening.update();
            // Opening transitions to PLAYING usually.
            // We need to know when it finishes.
            // Opening.js might set currentState?
            if (currentState === GameState.PLAYING) {
                this.game.stateMachine.change('playing');
            }
        }
    }

    draw(ctx) {
        if (typeof Opening !== 'undefined') {
            Opening.render(ctx);
        }
    }
}
