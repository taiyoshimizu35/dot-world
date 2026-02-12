// ===========================================
// カメラ
// ===========================================
import { GameConfig } from '../constants.js';

export const Camera = {
    x: 0, y: 0,

    update(tx, ty, mw, mh) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH, TILE_SIZE: TS } = GameConfig;
        this.x = Math.max(0, Math.min(tx - VW / 2 + TS / 2, Math.max(0, mw * TS - VW)));
        this.y = Math.max(0, Math.min(ty - VH / 2 + TS / 2, Math.max(0, mh * TS - VH)));
    },

    toScreen(wx, wy) {
        return { x: Math.floor(wx - this.x), y: Math.floor(wy - this.y) };
    }
};
