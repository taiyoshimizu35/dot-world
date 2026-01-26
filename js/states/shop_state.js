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
        const shop = WorldState.managers.shop;
        if (!shop) {
            this.game.stateMachine.change('playing');
            return;
        }

        shop.update();
        if (!shop.visible) {
            this.game.stateMachine.change('playing');
        }
    }

    draw(ctx) {
        if (this.game.stateMachine.states['playing']) {
            this.game.stateMachine.states['playing'].draw(ctx);
        }
        const shop = WorldState.managers.shop;
        if (shop) shop.render(ctx);
        // Msg.render(ctx); // Handled globally in main.js to sort with FX
    }
}
