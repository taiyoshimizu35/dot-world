// import { BaseState } from './base_state.js';

class TitleState extends BaseState {
    update() {
        if (Input.interact()) {
            // currentState = GameState.OPENING;
            // Opening.init();
            this.game.stateMachine.change('opening');
        }
    }

    draw(ctx) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;
        Draw.rect(ctx, 0, 0, VW, VH, '#000');
        Draw.text(ctx, 'DOT WORLD', 80, 80, '#fff', 20);
        Draw.text(ctx, 'Press Enter', 90, 150, '#fff', 10);
    }
}
