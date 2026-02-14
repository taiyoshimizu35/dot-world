
import { BaseState } from './base_state.js';
import { GameConfig } from '../constants.js';
import { Draw } from '../core/draw.js';
import { Input } from '../core/input.js';
import { SaveSystem } from '../core/save_system.js';
import { Msg } from '../core/message.js';

export class SaveState extends BaseState {
    constructor(game) {
        super(game);
        this.selected = 0;
        this.scroll = 0;
        this.maxVisible = 6;
        this.saveList = [];
    }

    enter() {
        this.selected = 0;
        this.scroll = 0;
        this.saveList = SaveSystem.getSaveList();
        Input.lock(150);
    }

    update() {
        if (Input.justPressed('ArrowUp')) {
            this.selected--;
            if (this.selected < 0) {
                this.selected = this.saveList.length - 1;
                this.scroll = Math.max(0, this.saveList.length - this.maxVisible);
            } else if (this.selected < this.scroll) {
                this.scroll = this.selected;
            }
        }
        if (Input.justPressed('ArrowDown')) {
            this.selected++;
            if (this.selected >= this.saveList.length) {
                this.selected = 0;
                this.scroll = 0;
            } else if (this.selected >= this.scroll + this.maxVisible) {
                this.scroll = this.selected - this.maxVisible + 1;
            }
        }

        if (Input.interact()) {
            const slot = this.selected;
            if (SaveSystem.save(slot)) {
                this.saveList = SaveSystem.getSaveList(); // Update list to show new save
                // Msg will handle close on next update/interaction if needed, 
                // but SaveSystem.save() opens a Msg.
                // We should probably wait or just let 'dialog' state take over.
                // The issue is SaveState is still active under the dialog?
                // No, SaveSystem.save calls Msg.show -> changes state to 'dialog'.
                // So SaveState exits effectively (update stops running).
            } else {
                Msg.show('セーブに失敗しました');
            }
        }

        if (Input.cancel()) {
            this.game.stateMachine.change('playing');
        }
    }

    draw(ctx) {
        // Draw underlying playing state
        const playingState = this.game.stateMachine.states['playing'];
        if (playingState) playingState.draw(ctx);

        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        // Overlay window
        Draw.rect(ctx, 40, 30, VW - 80, VH - 60, 'rgba(0,0,50,0.95)');
        Draw.stroke(ctx, 40, 30, VW - 80, VH - 60, '#fff', 2);

        Draw.text(ctx, 'どこに記録しますか？', VW / 2, 50, '#fc0', 14, 'center');

        const listY = 75;
        const itemH = 20;

        for (let i = 0; i < this.maxVisible; i++) {
            const idx = this.scroll + i;
            if (idx >= this.saveList.length) break;

            const s = this.saveList[idx];
            const y = listY + i * itemH;
            const isSel = (idx === this.selected);
            const color = isSel ? '#fc0' : '#ccc';
            const prefix = isSel ? '▶ ' : '  ';

            let info = '----';
            if (s.exists) {
                info = `${s.name} (W:${s.week} HP:${s.hp}/${s.maxHp})`;
            }

            Draw.text(ctx, prefix + `Slot ${idx + 1}: ${info}`, 60, y, color, 12);
        }

        // Scroll Indicators
        if (this.scroll > 0) Draw.text(ctx, '▲', VW / 2, 65, '#888', 10, 'center');
        if (this.scroll + this.maxVisible < this.saveList.length) Draw.text(ctx, '▼', VW / 2, listY + this.maxVisible * itemH + 5, '#888', 10, 'center');

        Draw.text(ctx, 'Z: 決定  X: キャンセル', VW - 50, VH - 35, '#888', 10, 'right');
    }
}
