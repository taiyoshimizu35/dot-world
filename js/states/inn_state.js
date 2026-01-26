// import { BaseState } from './base_state.js';

class InnState extends BaseState {
    update() {
        const inn = WorldState.managers.inn;
        if (!inn) {
            this.game.stateMachine.change('playing');
            return;
        }

        inn.update();
        if (!inn.visible) {
            this.game.stateMachine.change('playing');
        }
    }

    draw(ctx) {
        if (this.game.stateMachine.states['playing']) {
            this.game.stateMachine.states['playing'].draw(ctx);
        }
        const inn = WorldState.managers.inn;
        if (inn) inn.render(ctx);
    }
}
