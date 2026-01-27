// import { BaseState } from './base_state.js';

class TitleState extends BaseState {
    constructor(game) {
        super(game);
        this.options = ['はじめから'];
        this.cur = 0;
        this.canContinue = false;
    }

    enter() {
        if (typeof SaveSystem !== 'undefined' && SaveSystem.hasSave()) {
            this.canContinue = true;
            this.options = ['つづきから', 'はじめから'];
            this.cur = 0;
        } else {
            this.canContinue = false;
            this.options = ['はじめから'];
            this.cur = 0;
        }
    }

    update() {
        if (this.options.length > 1) {
            if (Input.justPressed('ArrowUp')) this.cur = (this.cur - 1 + this.options.length) % this.options.length;
            if (Input.justPressed('ArrowDown')) this.cur = (this.cur + 1) % this.options.length;
        }

        if (Input.interact()) {
            const selected = this.options[this.cur];

            if (selected === 'つづきから') {
                if (SaveSystem.load()) {
                    // Load successful, transition to Playing (SaveSystem sets state?)
                    // SaveSystem.load() sets WorldState and Managers.
                    // We just need to change state to 'playing'.
                    currentState = GameState.PLAYING;
                    this.game.stateMachine.change('playing');

                    // Fade In Effect
                    FX.fadeIn();
                } else {
                    // Load Failed
                    // Maybe play error sound
                }
            } else {
                // New Game
                // Reset everything strictly (WorldState.reset() does this)
                WorldState.reset();
                SaveSystem.clear(); // Clear existing save if starting over? Or keep it until overwrite?
                // User said "Start from beginning = Full Reset".
                // Usually means we just start fresh. Overwriting save happens later.
                // But to be safe vs mixed state, we reset.

                this.game.stateMachine.change('opening');
            }
        }
    }

    draw(ctx) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;
        Draw.rect(ctx, 0, 0, VW, VH, '#000');

        // Title Logo
        Draw.text(ctx, 'DOT WORLD', VW / 2, 70, '#fff', 24, 'center');

        // Menu
        const startY = 130;
        this.options.forEach((opt, i) => {
            const color = (i === this.cur) ? '#fc0' : '#fff';
            const prefix = (i === this.cur) ? '▶ ' : '  ';
            Draw.text(ctx, prefix + opt, VW / 2, startY + i * 25, color, 14, 'center');
        });

        Draw.text(ctx, '© 2024 dot-world', VW / 2, VH - 20, '#666', 10, 'center');
    }
}
