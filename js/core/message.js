// ===========================================
// メッセージ
// ===========================================
import { GameConfig, GameState } from '../constants.js';
import { Draw } from './draw.js';
import { Input } from './input.js';

export const Msg = {
    visible: false, text: '', disp: '', idx: 0, lt: 0, callback: null,
    choices: null, choiceIdx: 0,
    game: null,

    init(game) {
        this.game = game;
    },

    show(t, cb = null, mode = 'normal') {
        console.log("Msg.show called:", t);
        this.visible = true;
        this.text = t;
        this.disp = '';
        this.idx = 0;
        this.lt = Date.now();
        this.callback = cb;
        this.choices = null; // Reset choices
        if (mode !== 'overlay') {
            if (this.game && this.game.stateMachine) this.game.stateMachine.change('dialog');
        }
    },

    // Show text with choices
    choice(t, options, cb) {
        console.log("Msg.choice called with options:", options);
        this.show(t, cb); // Use show to init text
        this.choices = options;
        this.choiceIdx = 0;
        console.log("Msg.choices set to:", this.choices);
    },

    hide() {
        this.visible = false;
        this.choices = null;
        Input.lock(150);
        if (this.callback && !this.choices) { // Only run callback if NOT a choice callback (handled internally)
            // Actually, for show(), callback is on-close.
            // For choice(), callback is on-select.
            // We need to adhere to the call pattern.
            // Let's rely on choice update logic to call callback.
            const cb = this.callback;
            this.callback = null;
            cb();
        } else if (!this.choices) {
            if (this.game && this.game.stateMachine) this.game.stateMachine.change('playing');
        }
    },

    update() {
        if (!this.visible) return;

        // Text scrolling
        const now = Date.now();
        if (this.idx < this.text.length && now - this.lt > 30) {
            this.disp += this.text[this.idx++];
            this.lt = now;
        }

        // Choice Input
        if (this.choices && this.done()) {
            if (Input.justPressed('ArrowUp')) this.choiceIdx = (this.choiceIdx - 1 + this.choices.length) % this.choices.length;
            if (Input.justPressed('ArrowDown')) this.choiceIdx = (this.choiceIdx + 1) % this.choices.length;

            if (Input.interact()) {
                const selected = this.choiceIdx;
                const cb = this.callback;
                this.visible = false;
                this.choices = null;
                if (this.game && this.game.stateMachine) this.game.stateMachine.change('playing'); // Default reset
                Input.lock(150);
                if (cb) cb(selected);
            }
        }
    },

    done() { return this.idx >= this.text.length; },
    skip() { this.disp = this.text; this.idx = this.text.length; },

    render(ctx) {
        if (!this.visible) return;
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;
        const h = 50, y = VH - h - 8;
        Draw.rect(ctx, 8, y, VW - 16, h, 'rgba(0,0,40,0.95)');
        Draw.stroke(ctx, 8, y, VW - 16, h, '#fff', 2);
        let ty = y + 10;
        for (const line of this.disp.split('\n')) {
            Draw.text(ctx, line, 16, ty, '#fff', 12);
            ty += 16;
        }

        if (this.done()) {
            if (this.choices) {
                // Render Choices
                // Draw a side window or overlay?
                // Let's draw on the right side
                const chW = 100, chH = this.choices.length * 20 + 20;
                const chX = VW - chW - 8, chY = y - chH - 4;

                Draw.rect(ctx, chX, chY, chW, chH, 'rgba(0,0,40,0.95)');
                Draw.stroke(ctx, chX, chY, chW, chH, '#fff', 2);

                this.choices.forEach((c, i) => {
                    Draw.text(ctx, c, chX + 20, chY + 14 + i * 20, '#fff', 12);
                    if (i === this.choiceIdx) {
                        Draw.text(ctx, '▶', chX + 8, chY + 14 + i * 20, '#fc0', 12);
                    }
                });
            } else {
                Draw.text(ctx, '▼', VW - 24, y + h - 16, '#fff', 12);
            }
        }
    }
};
