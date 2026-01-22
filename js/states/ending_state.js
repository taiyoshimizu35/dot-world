// import { BaseState } from './base_state.js';

class EndingState extends BaseState {
    update() {
        if (Input.interact()) location.reload();
    }

    draw(ctx) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;
        Draw.rect(ctx, 0, 0, VW, VH, 'rgba(255,255,255,0.9)');
        Draw.text(ctx, 'THE END', 90, 100, '#000', 20);
    }
}
