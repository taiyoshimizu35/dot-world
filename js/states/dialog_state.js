import { BaseState } from './base_state.js';
import { Input } from '../core/input.js';
import { Msg } from '../core/message.js';
import { WorldState } from '../loop1/world.js';
// Import static Shop/Inn for now if they are singletons, or use managers
import { Shop } from '../loop1/systems/shop.js';
import { Inn } from '../loop1/systems/inn.js';

export class DialogState extends BaseState {
    update() {
        // If choices are available and text is done, let Msg handle input entirely
        if (Msg.choices && Msg.done()) {
            Msg.update();
            return;
        }

        if (Input.interact()) {
            if (Msg.done()) {
                console.log("DialogState: Msg done, hiding and changing to playing.");
                Msg.hide();
                this.game.stateMachine.change('playing');
            } else {
                Msg.skip();
            }
        }
        Msg.update();
    }

    draw(ctx) {
        // Render underlying Playing layer
        // We can access 'playing' state from stateMachine if it exists
        // Or we can rely on Frame buffer if we had one.
        // For now, re-render playing state if possible, or just background.
        // BUT accessing game.stateMachine.states['playing'] requires the state logic to be public.
        // PlayingState.draw() expects ctx.

        // Note: Check if playing state is available in StateMachine (it stores instances in .states object usually?)
        // StateMachine implementation: this.states = {}
        const playingState = this.game.stateMachine.states['playing'];
        if (playingState) {
            playingState.draw(ctx);
        }

        // Render underlying UI layers if visible (Legacy check)
        if (Shop.visible) Shop.render(ctx);
        if (Inn.visible) Inn.render(ctx);

        Msg.render(ctx);
    }
}
