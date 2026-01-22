// import { BaseState } from './base_state.js';

class DialogState extends BaseState {
    update() {
        if (Input.interact()) {
            if (Msg.done()) {
                Msg.hide();
                // Transition back to previous state? Usually PLAYING.
                // But Msg doesn't track previous state.
                // We should assume Playing for now.
                this.game.stateMachine.change('playing');
            } else {
                Msg.skip();
            }
        }
        Msg.update();
    }

    draw(ctx) {
        // Dialog overlay needs background from PlayingState or current state.
        if (this.game.stateMachine.states['playing']) {
            this.game.stateMachine.states['playing'].draw(ctx);
        }

        // Render underlying UI layers if visible
        if (typeof Shop !== 'undefined' && Shop.visible) Shop.render(ctx);
        if (typeof Inn !== 'undefined' && Inn.visible) Inn.render(ctx);

        Msg.render(ctx);
    }
}
