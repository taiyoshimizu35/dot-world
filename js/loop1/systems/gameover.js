import { GameConfig } from '../../constants.js';
import { Input } from '../../core/input.js';
import { Draw } from '../../core/draw.js';
import { FX } from '../../core/effects.js';
import { SaveSystem } from '../../core/save_system.js';
import { WorldState } from '../world.js';
import { Checkpoint } from '../checkpoint.js';

// ===========================================
// ゲームオーバーメニュー
// ===========================================
export const GameOverMenu = {
    game: null,
    cur: 0,
    opts: ['▶ 続きからやり直す', '　 はじめからやり直す'],

    init(game) {
        this.game = game;
        this.cur = 0;
    },

    update() {
        if (Input.justPressed('ArrowUp') || Input.justPressed('ArrowDown')) {
            this.cur = (this.cur + 1) % 2;
        }
        if (Input.interact()) {
            if (this.cur === 0) {
                // Retry
                if (WorldState.week === 2) {
                    // Loop 2: Load latest save
                    if (SaveSystem.loadLatest()) {
                        if (this.game && this.game.stateMachine) this.game.stateMachine.change('playing');
                        FX.fadeIn();
                    } else {
                        window.location.reload();
                    }
                } else {
                    // Loop 1: Checkpoint
                    if (Checkpoint.saved) {
                        FX.fadeOut(() => {
                            if (this.game && this.game.player) Checkpoint.restore(this.game.player);
                            if (this.game && this.game.stateMachine) this.game.stateMachine.change('playing');
                            FX.fadeIn();
                        });
                    } else {
                        window.location.reload();
                    }
                }
            } else {
                // Restart (Title)
                window.location.reload();
            }
        }
    },

    render(ctx) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;
        Draw.rect(ctx, 0, 0, VW, VH, 'rgba(50,0,0,0.8)');
        Draw.text(ctx, 'GAME OVER', 80, 80, '#f00', 20);

        const y = 140;
        Draw.text(ctx, this.cur === 0 ? '▶ 続きからやり直す' : '　 続きからやり直す', 80, y, this.cur === 0 ? '#fc0' : '#fff', 12);
        Draw.text(ctx, this.cur === 1 ? '▶ タイトルへ戻る' : '　 タイトルへ戻る', 80, y + 20, this.cur === 1 ? '#fc0' : '#fff', 12);

        if (this.cur === 0) {
            if (WorldState.week === 2) {
                // Check if any save exists?
                if (!SaveSystem.hasSave || !SaveSystem.getSaveList().some(s => s.exists)) {
                    Draw.text(ctx, '(データなし)', 200, y, '#888', 10);
                }
            } else {
                if (!Checkpoint.saved) {
                    Draw.text(ctx, '(データなし)', 200, y, '#888', 10);
                }
            }
        }
    }
};
