import { GameConfig } from '../../constants.js';
import { Draw } from '../../core/draw.js';
import { Input } from '../../core/input.js';
import { Msg } from '../../core/message.js';
import { PlayerStats2 } from '../player.js';
import { Inventory2 } from '../inventory.js';
import { ItemData2 } from '../data/items.js';
import { WorldState } from '../../loop1/world.js';

export const ShopSystem2 = {
    visible: false,
    mode: 'sell', // 'buy' or 'sell' (Loop 2 mainly sell)
    cursor: 0,
    scroll: 0,
    items: [],

    init() {
        this.visible = false;
        this.mode = 'sell';
        this.cursor = 0;
        this.scroll = 0;
        this.items = [];
    },

    open() {
        this.visible = true;
        this.mode = 'sell';
        this.cursor = 0;
        this.scroll = 0;
        this.updateItemList();

        // Change State
        if (WorldState.game && WorldState.game.stateMachine) {
            WorldState.game.stateMachine.change('shop');
        }
    },

    close() {
        this.visible = false;
        if (WorldState.game && WorldState.game.stateMachine) {
            WorldState.game.stateMachine.change('playing');
        }
    },

    updateItemList() {
        // Create Sellable Item List from Inventory
        this.items = [];
        Inventory2.items.forEach(id => {
            const data = ItemData2[id];
            if (data && data.price) {
                this.items.push({ ...data, id: id });
            }
        });
    },

    update() {
        if (!this.visible) return;

        if (Input.justPressed('ArrowUp')) {
            if (this.cursor > 0) this.cursor--;
        }
        if (Input.justPressed('ArrowDown')) {
            if (this.cursor < this.items.length - 1) this.cursor++;
        }

        if (Input.cancel()) {
            this.close();
            return;
        }

        if (Input.interact()) {
            this.sellItem();
        }
    },

    sellItem() {
        if (this.items.length === 0) return;

        const item = this.items[this.cursor];
        const price = Math.floor(item.price / 2); // Sell at half price? or full? Let's say half for now or specific sellPrice

        Msg.choice(`${item.name}を${price}Gで売りますか？`, ['はい', 'いいえ'], (idx) => {
            if (idx === 0) {
                Inventory2.removeItem(item.id);
                PlayerStats2.addGold(price);
                Msg.show(`${item.name}を売却しました。`);

                // Update List
                const oldCursor = this.cursor;
                this.updateItemList();
                this.cursor = Math.min(oldCursor, Math.max(0, this.items.length - 1));
            }
        });
    },

    render(ctx) {
        if (!this.visible) return;
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        // Overlay
        Draw.rect(ctx, 0, 0, VW, VH, 'rgba(0,0,0,0.8)');

        // Header
        Draw.text(ctx, '素材買取所', VW / 2, 30, '#fff', 20, 'center');
        Draw.text(ctx, `所持金: ${PlayerStats2.gold}G`, VW - 20, 30, '#ffcc00', 14, 'right');

        // List
        const startY = 60;
        const maxItems = 10;
        const itemH = 25;

        // Scroll Logic (simple centering or window)
        // If cursor > scroll + maxItems - 1 -> scroll = cursor - maxItems + 1
        // If cursor < scroll -> scroll = cursor
        if (this.cursor >= this.scroll + maxItems) this.scroll = this.cursor - maxItems + 1;
        if (this.cursor < this.scroll) this.scroll = this.cursor;

        if (this.items.length === 0) {
            Draw.text(ctx, '売れるものがない……', VW / 2, VH / 2, '#aaa', 14, 'center');
        } else {
            for (let i = 0; i < maxItems; i++) {
                const idx = this.scroll + i;
                if (idx >= this.items.length) break;

                const item = this.items[idx];
                const y = startY + i * itemH;
                const isSelected = (idx === this.cursor);
                const color = isSelected ? '#fff' : '#aaa';
                const prefix = isSelected ? '▶ ' : '  ';

                Draw.text(ctx, `${prefix}${item.name}`, 40, y, color, 14, 'left');
                Draw.text(ctx, `${Math.floor(item.price / 2)}G`, VW - 40, y, color, 14, 'right');
            }
        }

        // Hint
        Draw.text(ctx, 'Action: 売る / Cancel: 戻る', VW / 2, VH - 20, '#666', 10, 'center');
    }
};
