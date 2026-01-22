// import { BaseState } from './base_state.js';

class InnState extends BaseState {
    update() {
        Inn.update();
        if (!Inn.visible) {
            this.game.stateMachine.change('playing');
        }
    }

    draw(ctx) {
        if (this.game.stateMachine.states['playing']) {
            this.game.stateMachine.states['playing'].draw(ctx);
        }
        Inn.render(ctx);
    }
}
