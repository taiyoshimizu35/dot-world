import { GameConfig } from '../../../constants.js';
import { Draw } from '../../../core/draw.js';
import { PlayerStats2 } from '../../player.js';

export const BattleRender2 = {
    render(ctx, battle) {
        // Stub render
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;
        Draw.rect(ctx, 0, 0, VW, VH, '#111');
        Draw.text(ctx, 'Battle Loop 2 (Stub)', 10, 10, '#fff');
    }
};
