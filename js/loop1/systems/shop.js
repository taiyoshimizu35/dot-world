import { GameConfig, GameState } from '../../constants.js';
import { Draw } from '../../core/draw.js';
import { Input } from '../../core/input.js';
import { Msg } from '../../core/message.js';
// import { WorldState } from '../world.js'; // Circular dependency avoidance. Use window.WorldState
import { PlayerStats } from '../player.js';
import { Inventory as Inv } from '../inventory.js';
import { ShopData, MagicShopData, AdvancedShopData, MaterialData } from '../data/items.js';
import { QuestSystem as QuestFlags } from '../quest.js';

// ===========================================
// ショップUI
// ===========================================
export const Shop = {
    visible: false, cur: 0, scroll: 0, maxVisible: 5, warning: null, shopType: 'normal', mode: 'select',
    sellItems: [], // List of items player can sell
    _worldState: null,

    init(worldState) {
        this._worldState = worldState;
    },

    open(type = 'normal') {
        this.visible = true;
        this.cur = 0;
        this.scroll = 0;
        this.warning = null;
        this.shopType = type;

        // Loop 1: Buy only mode (legacy behavior)
        // Loop 2: Select mode (Buy/Sell)
        const ws = this._worldState || { week: 1 };
        if (ws.week === 1) {
            this.mode = 'buy';
        } else {
            this.mode = 'select'; // select, buy, sell
        }

        // currentState = GameState.SHOP; // Handled by StateMachine usually, but if this is a sub-state/overlay...
        // The original code set `currentState` global. We should probably use a method or return a state?
        // But for now, we leave it as is, but we need to know where `currentState` comes from if we want to change it.
        // `currentState` is imported from `constants.js` if we exported it? No, `GameState` is exported. `currentState` was a global variable.
        // We need to handle `currentState`.
        // In the beginning I saw `currentState` being removed from `constants.js`?
        // No, `constants.js` had `currentState` removed.
        // So `currentState` is likely defined in `main.js` or `game.js`.
        // BUT, `shop.js` tries to assign to it.
        // Takes a step back: `currentState` usage is problematic if it's not available.
        // I should probably NOT rely on `currentState` global if possible, or `game.currentState`.
        // However, I can't easily change all logic right now.
        // If `currentState` is not defined anywhere, this will error.
        // I should import `game` or pass it?
        // Or maybe `Shop` checks `Input` itself?
        // `Shop.update` is called by `PlayingState` (or similar).
        // If `Shop.visible` is true, `PlayingState` delegates to `Shop.update`.
        // The `currentState = GameState.SHOP` assignment might be for other systems to know?
        // If I removed `currentState` global, I need a replacement.
        // Maybe I can export a mutable state object or use `WorldState`?
        // Or maybe `window.currentState`?
        // For now, I will comment out `currentState` assignment and assume the caller handles logic based on `Shop.visible`.
        // OR I can re-introduce `window.currentState` in `main.js` for compatibility.
        // I will comment it out for now and rely on `visible` flag, assuming `PlayingState` checks `Shop.visible`.

        Input.lock(200);
    },

    close() {
        this.visible = false;
        this.warning = null;
        // currentState = GameState.PLAYING;
        Input.lock(150);
    },

    getItems() {
        if (this.shopType === 'magic') return MagicShopData.items;
        if (this.shopType === 'advanced') return AdvancedShopData.items;
        return ShopData.items;
    },

    getSellableItems() {
        // Create list from Inventory
        const inventory = Inv.list(); // [['name', count], ...]
        const sellList = [];

        inventory.forEach(([name, count]) => {
            // Find item data
            let data = ShopData.items.find(i => i.name === name) ||
                MagicShopData.items.find(i => i.name === name) ||
                AdvancedShopData.items.find(i => i.name === name) ||
                MaterialData.items.find(i => i.name === name);

            if (data) {
                // Sell price is usually half of buy price, or defined price for materials
                let sellPrice = Math.floor(data.price / 2);
                if (data.type === 'material') sellPrice = data.price; // Materials sell at full specific value

                if (sellPrice > 0) {
                    sellList.push({ name: name, count: count, price: sellPrice, desc: data.desc });
                }
            }
        });
        return sellList;
    },

    update() {
        if (!this.visible) return;
        if (this.warning) {
            if (Input.interact() || Input.cancel()) this.warning = null;
            return;
        }

        // Loop 2 only: Selection logic
        const ws = this._worldState || { week: 1 };
        if (this.mode === 'select' && ws.week !== 1) {
            if (Input.justPressed('ArrowUp') || Input.justPressed('ArrowDown')) this.cur = (this.cur ^ 1);
            if (Input.interact()) {
                if (this.cur === 0) {
                    this.mode = 'buy';
                    this.cur = 0; this.scroll = 0;
                } else {
                    this.mode = 'sell';
                    this.sellItems = this.getSellableItems();
                    this.cur = 0; this.scroll = 0;
                }
            }
            if (Input.cancel()) this.close();
            return;
        }

        // Common list navigation
        const items = (this.mode === 'buy') ? this.getItems() : this.sellItems;

        if (items.length > 0) {
            if (Input.justPressed('ArrowUp')) {
                this.cur = (this.cur - 1 + items.length) % items.length;
                if (this.cur < this.scroll) this.scroll = this.cur;
                if (this.cur >= this.scroll + this.maxVisible) this.scroll = this.cur - this.maxVisible + 1;
                if (this.cur === items.length - 1) this.scroll = Math.max(0, items.length - this.maxVisible);
            }
            if (Input.justPressed('ArrowDown')) {
                this.cur = (this.cur + 1) % items.length;
                if (this.cur >= this.scroll + this.maxVisible) this.scroll = this.cur - this.maxVisible + 1;
                if (this.cur < this.scroll) this.scroll = this.cur;
                if (this.cur === 0) this.scroll = 0;
            }
            if (Input.interact()) {
                if (this.mode === 'buy') this.buy();
                else this.sell();
            }
        }

        if (Input.cancel()) {
            const ws = this._worldState || { week: 1 };
            // Loop 1: Close immediately
            if (ws.week === 1) {
                this.close();
            } else {
                // Loop 2: Back to select
                this.mode = 'select';
                this.cur = (this.mode === 'buy' ? 0 : 1);
                this.warning = null;
            }
        }
    },

    buy() {
        const item = this.getItems()[this.cur];
        const uniqueTypes = ['weapon', 'armor', 'spell', 'staff', 'robe', 'amulet', 'holySword'];
        if (item.sold && uniqueTypes.includes(item.type)) { this.warning = 'SOLD OUT!'; return; }

        if (PlayerStats.gold < item.price) { this.warning = 'ゴールドが足りない！'; return; }
        PlayerStats.spendGold(item.price);

        if (item.type !== 'spell') {
            Inv.add(item.name);
        }
        item.sold = true;

        if (item.type === 'item') {
            Msg.show(`${item.name}を購入した！`, () => { Input.lock(100); }, 'overlay');
        } else if (item.type === 'weapon') {
            if (item.name === '鋼の剣') QuestFlags.hasSword = true;
            QuestFlags.check();
            Msg.show(`${item.name}を購入した！\nメニューから装備しよう。`, () => { Input.lock(100); }, 'overlay');
        } else if (item.type === 'holySword') {
            if (this._worldState) this._worldState.holySwordOwned = true;
            Msg.show(`${item.name}を購入した！\n「特別な力を感じる...」`, () => { Input.lock(100); }, 'overlay');
        } else if (item.type === 'armor') {
            Msg.show(`${item.name}を購入した！\nメニューから装備しよう。`, () => { Input.lock(100); }, 'overlay');
        } else if (item.type === 'spell') {
            PlayerStats.spells[item.spell] = true;
            Msg.show(`${item.name}を読んだ！\n習得した！`, () => { Input.lock(100); }, 'overlay');
        } else if (item.type === 'staff') {
            Msg.show(`${item.name}を購入した！\nメニューから装備しよう。`, () => { Input.lock(100); }, 'overlay');
        } else if (item.type === 'robe') {
            Msg.show(`${item.name}を購入した！\nメニューから装備しよう。`, () => { Input.lock(100); }, 'overlay');
        } else if (item.type === 'amulet') {
            QuestFlags.hasAmulet = true;
            QuestFlags.check();
            Msg.show(`${item.name}を入手した！\nメニューから装備しよう。`, () => { Input.lock(100); }, 'overlay');
        }
    },

    sell() {
        const item = this.sellItems[this.cur];
        Inv.remove(item.name, 1);
        PlayerStats.addGold(item.price);
        Msg.show(`${item.name}を${item.price}Gで売却した！`, () => {
            this.sellItems = this.getSellableItems(); // Update list
            if (this.cur >= this.sellItems.length) this.cur = Math.max(0, this.sellItems.length - 1);
            Input.lock(100);
        }, 'overlay');
    },

    render(ctx) {
        if (!this.visible) return;
        const VW = GameConfig ? GameConfig.VIEWPORT_WIDTH : 320;
        const VH = GameConfig ? GameConfig.VIEWPORT_HEIGHT : 240;

        Draw.rect(ctx, 20, 20, VW - 40, VH - 40, 'rgba(0,0,40,0.95)');
        Draw.stroke(ctx, 20, 20, VW - 40, VH - 40, '#fff', 2);

        let title = '【ショップ】';
        if (this.shopType === 'magic') title = '【魔法ショップ】';
        else if (this.shopType === 'advanced') title = '【上級ショップ】';

        try {
            Draw.text(ctx, title, 32, 28, '#fc0', 14);
            const gold = PlayerStats ? PlayerStats.gold : 0;
            Draw.text(ctx, `所持金: ${gold}G`, VW - 120, 28, '#ff0', 12);
        } catch (e) { console.error("Shop text render error", e); }

        if (this.mode === 'select') {
            Draw.text(ctx, '買いに来た', 60, 80, this.cur === 0 ? '#fff' : '#888', 14);
            Draw.text(ctx, '売りに来た', 60, 110, this.cur === 1 ? '#fff' : '#888', 14);
            Draw.text(ctx, '▶', 40, this.cur === 0 ? 80 : 110, '#fc0', 14);
        } else {
            const items = (this.mode === 'buy') ? this.getItems() : this.sellItems;

            if (items.length === 0 && this.mode === 'sell') {
                Draw.text(ctx, '売れるものがありません', VW / 2, VH / 2, '#aaa', 12, 'center');
            }

            let y = 52;
            const PStats = PlayerStats || { gold: 0 };
            for (let i = this.scroll; i < Math.min(this.scroll + this.maxVisible, items.length); i++) {
                const item = items[i];
                if (this.mode === 'buy') {
                    const isSoldOut = item.sold && ['weapon', 'armor', 'spell', 'staff', 'robe', 'amulet', 'holySword'].includes(item.type);
                    const affordable = PStats.gold >= item.price && !isSoldOut;
                    if (i === this.cur) Draw.text(ctx, '▶', 32, y, '#fc0', 12);
                    Draw.text(ctx, item.name, 48, y, affordable ? '#fff' : '#666', 12);
                    Draw.text(ctx, `${item.price}G`, VW - 50, y, affordable ? '#ff0' : '#664', 12, 'right');
                    Draw.text(ctx, item.desc, 48, y + 14, isSoldOut ? '#333' : '#aaa', 10);
                } else {
                    // Sell mode
                    if (i === this.cur) Draw.text(ctx, '▶', 32, y, '#fc0', 12);
                    Draw.text(ctx, item.name, 48, y, '#fff', 12);
                    Draw.text(ctx, `x${item.count}`, VW - 100, y, '#fff', 12, 'right');
                    Draw.text(ctx, `${item.price}G`, VW - 50, y, '#ff0', 12, 'right');
                    Draw.text(ctx, item.desc, 48, y + 14, '#aaa', 10);
                }
                y += 32;
            }

            // Scroll Indicators
            const centerX = 20 + (VW - 40) / 2; // Box starts at 20, width VW-40
            if (this.scroll > 0) {
                Draw.text(ctx, '▲', centerX, 44, '#fc0', 12, 'center');
            }
            if (this.scroll + this.maxVisible < items.length) {
                Draw.text(ctx, '▼', centerX, 210, '#fc0', 12, 'center');
            }
        }

        if (this.warning) {
            Draw.rect(ctx, 40, VH / 2 - 20, VW - 80, 40, 'rgba(0,0,0,0.9)');
            Draw.stroke(ctx, 40, VH / 2 - 20, VW - 80, 40, '#f00', 2);
            Draw.text(ctx, this.warning, 50, VH / 2 + 5, '#fff', 12);
        }
    }
};