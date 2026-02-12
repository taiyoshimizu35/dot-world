import { BaseState } from './base_state.js';
import { Input } from '../core/input.js';
import { Draw } from '../core/draw.js';
import { GameConfig } from '../constants.js';

export class EndingState extends BaseState {
    update() {
        if (Input.interact()) window.location.reload();
    }

    draw(ctx) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;
        Draw.rect(ctx, 0, 0, VW, VH, 'rgba(255,255,255,0.9)');
        Draw.text(ctx, 'THE END', 90, 100, '#000', 20);
    }
}
