import { GameConfig } from '../../constants.js';
import { Draw } from '../../core/draw.js';
import { Input } from '../../core/input.js';
import { Msg } from '../../core/message.js';
import { PlayerStats } from '../player.js';

// ===========================================
// 教会システム (旧宿屋)
// ===========================================
export const Inn = {
    visible: false,
    cost: 0,

    // Config: Church Mode
    // Instant heal, no black screen.

    open(cost) {
        this.visible = true;
        this.cost = cost;
        this.step = 0; // 0: Prompt, 1: Result
        // currentState = GameState.INN;
        Input.lock(200);
    },

    close() {
        this.visible = false;
        // currentState = GameState.PLAYING;
        Input.lock(150);
    },

    update() {
        if (!this.visible) return;

        // If message is showing (result message), handle it
        if (Msg.visible) {
            Msg.update();
            if (Input.interact()) {
                if (Msg.done()) Msg.hide();
                else Msg.skip();
            }
            return;
        }

        // Yes/No Selection for "Heal?"
        if (this.step === 0) {
            if (Input.interact()) {
                this.rest();
            } else if (Input.cancel()) {
                this.close();
            }
        } else if (this.step === 1) {
            // After message closes (handled above logic mainly, but safety)
            this.close();
        }
    },

    rest() {
        if (PlayerStats.gold < this.cost) {
            Msg.show('「寄付金が足りないようですな。」', () => {
                this.close();
            }, 'overlay');
            return;
        }

        PlayerStats.spendGold(this.cost);

        // Instant Heal - No Fades
        PlayerStats.healFull();

        // Show Success Message
        this.step = 1; // Move to result step

        Msg.show('「神の御加護があらんことを…」\n(体力と魔力が全回復した！)', () => {
            this.close();
        }, 'overlay');
    },

    render(ctx) {
        if (!this.visible) return;
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        // Draw Window
        Draw.rect(ctx, 40, VH - 100, VW - 80, 80, 'rgba(0,0,40,0.95)');
        Draw.stroke(ctx, 40, VH - 100, VW - 80, 80, '#fff', 2);

        Draw.text(ctx, '【教会】', 50, VH - 80, '#fc0', 14);
        Draw.text(ctx, `寄付金 ${this.cost}G`, 50, VH - 50, '#fff', 12);
        Draw.text(ctx, `祈りを捧げますか？ (Z: はい / X: いいえ)`, 50, VH - 30, '#aaa', 10);
        Draw.text(ctx, `所持金: ${PlayerStats.gold}G`, VW - 140, VH - 80, '#ff0', 12);
    }
};
