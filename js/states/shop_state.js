// import { BaseState } from './base_state.js';

class ShopState extends BaseState {
    update() {
        if (Msg.visible) {
            Msg.update();
            if (Input.interact()) {
                if (Msg.done()) Msg.hide();
                else Msg.skip();
            }
            return;
        }
        Shop.update();
        if (!Shop.visible) {
            this.game.stateMachine.change('playing');
        }
    }

    draw(ctx) {
        if (this.game.stateMachine.states['playing']) {
            this.game.stateMachine.states['playing'].draw(ctx);
        }
        Shop.render(ctx);
        // Msg.render(ctx); // Handled globally in main.js to sort with FX
    }
}
