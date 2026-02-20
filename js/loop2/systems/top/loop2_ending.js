import { FX } from '../../../core/effects.js';
import { Draw } from '../../../core/draw.js';
import { Input } from '../../../core/input.js';
import { GameConfig } from '../../../constants.js';
import { GameState } from '../../../constants.js';
import { Msg } from '../../../core/message.js';

export class Loop2Ending {
    constructor(worldState) {
        this.worldState = worldState;
        this.active = false;
        this.timer = 0;
        this.step = 0;
        this.alpha = 0;
    }

    start() {
        this.active = true;
        this.timer = 0;
        this.step = 0;
        this.alpha = 0;
        this.worldState.changeState('loop2_ending_scene');
        console.log("Loop 2 Ending Started");
    }

    update() {
        if (!this.active) return;
        this.timer++;

        if (this.step === 0) {
            // Fade Out World
            if (this.timer > 60) {
                this.step = 1;
                this.timer = 0;
            }
        } else if (this.step === 1) {
            // Text Sequence
            if (this.timer === 1) {
                Msg.show('魔王は光の中に消えていった……', () => {
                    this.timer = 100; // Force next
                });
            }
            if (this.timer > 120 && !Msg.active) {
                this.step = 2;
                this.timer = 0;
            }
        } else if (this.step === 2) {
            if (this.timer === 1) {
                Msg.show('世界に平和が戻ったように見えた。', () => {
                    this.timer = 100;
                });
            }
            if (this.timer > 120 && !Msg.active) {
                this.step = 3;
                this.timer = 0;
            }
        } else if (this.step === 3) {
            if (this.timer === 1) {
                Msg.show('しかし、ループは終わらない……\n新たなる旅立ちの予感がする。', () => {
                    this.timer = 100;
                });
            }
            if (this.timer > 120 && !Msg.active) {
                this.step = 4;
                this.timer = 0;
            }
        } else if (this.step === 4) {
            // Fade to Black completely
            if (this.timer > 60) {
                this.worldState.changeState('title'); // Return to Title for now
                // or loop3 init?
                this.active = false;
            }
        }
    }

    render(ctx) {
        if (!this.active) return;

        const { VIEWPORT_WIDTH, VIEWPORT_HEIGHT } = GameConfig;

        // Draw Black Overlay handled by FX or manually here?
        // Let's draw overlay
        ctx.save();
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, this.timer / 60)})`;
        if (this.step > 0) ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

        // Text Drawing is handled by Msg system usually on top.
        // We can draw custom ending art here if needed.
        if (this.step >= 1 && this.step <= 3) {
            // Maybe some centrered text if Msg is not used
        }

        ctx.restore();
    }
}
