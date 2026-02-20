import { GameConfig, GameState } from '../../constants.js';
import { Input } from '../../core/input.js';
import { Msg } from '../../core/message.js';
import { Draw } from '../../core/draw.js';
import { SaveSystem } from '../../core/save_system.js';
import { PlayerStats2 } from '../player.js';
import { Party2 } from '../party.js';
import { WorldState } from '../../loop1/world.js';
import { Inventory2 } from '../inventory.js';
import { ItemData2 } from '../data/items.js';

// ===========================================
// Loop 2 Menu System
// ===========================================
export const Menu2 = {
    visible: false,
    cur: 0,
    sub: null, // 'status', 'companions', 'items'
    subCur: 0,
    actionWindow: false, // For Companion Talk/Part
    actionCur: 0,
    targetMember: null, // Selected companion

    opts: ['アイテム', 'ステータス', 'なかま', 'とじる'],

    open() {
        this.visible = true;
        this.cur = 0;
        this.sub = null;
        this.subCur = 0;
        this.actionWindow = false;
        this.targetMember = null;
        // if (WorldState) WorldState.changeState('menu'); // Removed to prevent recursion (MenuState calls open)
        Input.lock(200);
    },

    close() {
        this.visible = false;
        this.sub = null;
        if (WorldState) WorldState.changeState('playing'); // currentState = GameState.PLAYING;
        Input.lock(150);
    },

    update() {
        if (!this.visible) return;

        // Delegate to Save/Load Menus (If visible on top)
        if (SaveMenu.visible) {
            SaveMenu.update();
            return;
        }
        if (LoadMenu.visible) {
            LoadMenu.update();
            return;
        }

        // Submenu: Status
        if (this.sub === 'status') {
            if (Input.cancel()) {
                this.sub = null;
                Input.lock(150);
            }
            return;
        }

        // Submenu: Items
        if (this.sub === 'items') {
            this.updateItems();
            return;
        }

        // Submenu: Companions
        if (this.sub === 'companions') {
            this.updateCompanions();
            return;
        }

        // Main Menu
        if (Input.justPressed('ArrowUp')) this.cur = (this.cur - 1 + this.opts.length) % this.opts.length;
        if (Input.justPressed('ArrowDown')) this.cur = (this.cur + 1) % this.opts.length;

        if (Input.interact()) {
            const selected = this.opts[this.cur];
            if (selected === 'ステータス') {
                this.sub = 'status';
            } else if (selected === 'アイテム') {
                this.sub = 'items';
                this.itemCatCur = 0;
                this.subCur = 0;
                this.targetMember = null;
            } else if (selected === 'なかま') {
                if (Party2.members.length === 0) {
                    Msg.show('今は一人旅だ。');
                } else {
                    this.sub = 'companions';
                    this.subCur = 0;
                    this.actionWindow = false;
                }
            } else if (selected === 'とじる') {
                this.close();
            }
        }
        if (Input.cancel()) this.close();
    },

    updateCompanions() {
        // If Action Window is open (Talk/Part)
        if (this.actionWindow) {
            if (Input.justPressed('ArrowUp')) this.actionCur = (this.actionCur - 1 + 2) % 2;
            if (Input.justPressed('ArrowDown')) this.actionCur = (this.actionCur + 1) % 2;

            if (Input.cancel()) {
                this.actionWindow = false;
                return;
            }

            if (Input.interact()) {
                const action = (this.actionCur === 0) ? 'talk' : 'part';
                this.handleCompanionAction(action);
            }
            return;
        }

        // Select Companion
        const len = Party2.members.length;
        if (len === 0) { // Should not happen if checked before opening
            this.sub = null;
            return;
        }

        if (Input.justPressed('ArrowUp')) this.subCur = (this.subCur - 1 + len) % len;
        if (Input.justPressed('ArrowDown')) this.subCur = (this.subCur + 1) % len;

        if (Input.interact()) {
            this.targetMember = Party2.members[this.subCur];
            this.actionWindow = true;
            this.actionCur = 0;
        }

        if (Input.cancel()) {
            this.sub = null;
            this.targetMember = null;
        }
    },

    handleCompanionAction(action) {
        const member = this.targetMember;
        if (!member) return;

        if (action === 'talk') {
            // Talk
            const text = member.msg || `「……」`;
            Msg.show(`${member.name}\n${text}`);
        } else if (action === 'part') {
            // Part
            this.actionWindow = false; // Close interaction window first
            Msg.choice(`本当に ${member.name} と別れますか？`, ['はい', 'いいえ'], (idx) => {
                if (idx === 0) { // Yes
                    if (Party2.remove(member.id)) {
                        Msg.show(`${member.name} は寂しそうに去っていった……。`);
                        this.sub = null; // Close companion menu to refresh or exit
                    }
                } else {
                    // No - do nothing
                }
            });
        }
    },

    render(ctx) {
        if (!this.visible) return;

        // Delegate to Save/Load Menus (Removed as invoked separately now)
        if (SaveMenu.visible) {
            SaveMenu.render(ctx);
            return;
        }
        // Load Menu might still be needed for Title screen but not main menu?
        // Or keep LoadMenu accessible via debug or title?
        if (LoadMenu.visible) {
            LoadMenu.render(ctx);
            return;
        }

        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        // Draw Submenus
        if (this.sub === 'status') {
            this.renderStatus(ctx);
            return;
        }
        if (this.sub === 'companions') {
            this.renderCompanions(ctx);
            return;
        }
        if (this.sub === 'items' || this.sub === 'item_list') {
            this.renderItems(ctx);
            return;
        }

        // Draw Main Menu
        const menuX = 20;
        const menuY = 20;
        const menuW = 100;
        const menuH = 140; // Expanded to fit 5 items

        Draw.rect(ctx, menuX, menuY, menuW, menuH, 'rgba(0, 0, 0, 0.9)');
        Draw.stroke(ctx, menuX, menuY, menuW, menuH, '#fff', 2);

        this.opts.forEach((opt, i) => {
            const y = menuY + 20 + i * 25;
            const color = (i === this.cur) ? '#fc0' : '#fff';
            if (i === this.cur) Draw.text(ctx, '▶', menuX + 10, y, '#fc0', 14);
            Draw.text(ctx, opt, menuX + 30, y, color, 14);
        });
    },

    renderStatus(ctx) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;
        Draw.rect(ctx, 10, 10, VW - 20, VH - 20, 'rgba(0, 0, 0, 0.95)');
        Draw.stroke(ctx, 10, 10, VW - 20, VH - 20, '#fff', 2);

        Draw.text(ctx, '【ステータス】', 15, 30, '#fc0', 14);

        // Player
        const p = PlayerStats2.getDisplayStats();
        let y = 50;
        this.renderStatusLine(ctx, p, y);

        // Companions
        y += 45; // Spacing
        Party2.members.forEach((m) => {
            // Construct stats object for standardize rendering
            const stats = {
                name: m.name,
                hp: m.hp, maxHp: m.maxHp,
                mp: m.mp, maxMp: m.maxMp,
                atk: m.atk, def: m.def,
                matk: m.matk, mdef: m.mdef
            };
            this.renderStatusLine(ctx, stats, y);
            y += 45;
        });
    },

    renderStatusLine(ctx, s, y) {
        // Name & HP/MP
        Draw.text(ctx, s.name, 20, y, '#fff', 13);
        Draw.text(ctx, `HP ${s.hp}/${s.maxHp}`, 100, y, '#8f8', 11);
        Draw.text(ctx, `MP ${s.mp}/${s.maxMp}`, 180, y, '#8cf', 11);

        // ATK/DEF stuff
        const y2 = y + 15;
        Draw.text(ctx, `ATK ${s.atk}`, 100, y2, '#f88', 11);
        Draw.text(ctx, `DEF ${s.def}`, 150, y2, '#88f', 11);
        Draw.text(ctx, `MAT ${s.matk}`, 200, y2, '#f8f', 11);
        Draw.text(ctx, `MDF ${s.mdef}`, 250, y2, '#8ff', 11);
    },

    renderCompanions(ctx) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        // Companion List Window
        const listX = 50, listY = 30, listW = 200, listH = 150;
        Draw.rect(ctx, listX, listY, listW, listH, 'rgba(0, 0, 0, 0.95)');
        Draw.stroke(ctx, listX, listY, listW, listH, '#fff', 2);

        Draw.text(ctx, '【なかま】', listX + 10, listY + 20, '#fc0', 14);

        Party2.members.forEach((m, i) => {
            const y = listY + 50 + i * 30;
            const color = (i === this.subCur) ? '#fc0' : '#fff';
            if (i === this.subCur && !this.actionWindow) Draw.text(ctx, '▶', listX + 15, y, '#fc0', 14);

            // Highlight selected if action window open
            const displayColor = (this.actionWindow && i === this.subCur) ? '#fe0' : color;
            Draw.text(ctx, m.name, listX + 35, y, displayColor, 14);
        });

        // Action Window (Talk/Part)
        if (this.actionWindow) {
            const actX = listX + 150, actY = listY + 50 + this.subCur * 30;
            const actW = 100, actH = 70;

            Draw.rect(ctx, actX, actY, actW, actH, 'rgba(0, 0, 40, 0.95)');
            Draw.stroke(ctx, actX, actY, actW, actH, '#fff', 2);

            const actions = ['話しかける', '別れる'];
            actions.forEach((act, i) => {
                const y = actY + 25 + i * 25;
                const color = (i === this.actionCur) ? '#fc0' : '#fff';
                if (i === this.actionCur) Draw.text(ctx, '▶', actX + 10, y, '#fc0', 12);
                Draw.text(ctx, act, actX + 25, y, color, 12);
            });
        }
    },

    // Categories: 0:Tools, 1:Weapons, 2:Armor, 3:Accessories, 4:Materials
    itemCats: ['道具', '武器', '防具', '装飾品', '素材'],
    itemCatCur: 0,

    updateItems() {
        // If in Category Selection
        if (this.sub === 'items') {
            if (Input.cancel()) {
                this.sub = null;
                return;
            }
            if (Input.justPressed('ArrowUp')) this.itemCatCur = (this.itemCatCur - 1 + 5) % 5;
            if (Input.justPressed('ArrowDown')) this.itemCatCur = (this.itemCatCur + 1) % 5;

            if (Input.interact()) {
                this.sub = 'item_list';
                this.subCur = 0;
            }
            return;
        }

        // If in Item List
        if (this.sub === 'item_list') {
            const filteredItems = this.getFilteredItems();

            // Target Selection
            if (this.targetMember) {
                const len = Party2.members.length + 1;
                if (Input.justPressed('ArrowUp')) this.actionCur = (this.actionCur - 1 + len) % len;
                if (Input.justPressed('ArrowDown')) this.actionCur = (this.actionCur + 1) % len;

                if (Input.cancel()) {
                    this.targetMember = null;
                    return;
                }

                if (Input.interact()) {
                    const targets = [PlayerStats2, ...Party2.members];
                    const target = targets[this.actionCur];
                    const itemId = filteredItems[this.subCur];

                    const res = Inventory2.useItem(itemId, target);
                    Msg.show(res.msg);

                    if (res.success) {
                        // Check if item still exists
                        const newFiltered = this.getFilteredItems();
                        if (this.subCur >= newFiltered.length) this.subCur = Math.max(0, newFiltered.length - 1);
                        this.targetMember = null;
                    }
                }
                return;
            }

            // List Navigation
            if (filteredItems.length === 0) {
                if (Input.cancel()) this.sub = 'items'; // Back to category
                return;
            }

            if (Input.justPressed('ArrowUp')) this.subCur = (this.subCur - 1 + filteredItems.length) % filteredItems.length;
            if (Input.justPressed('ArrowDown')) this.subCur = (this.subCur + 1) % filteredItems.length;

            if (Input.interact()) {
                const itemId = filteredItems[this.subCur];
                const data = ItemData2[itemId];
                if (data && data.type === 'consumable') {
                    this.targetMember = true;
                    this.actionCur = 0;
                } else {
                    // Gear - just show msg
                    Msg.show(`${data.name} はここでは使えない。`);
                }
            }

            if (Input.cancel()) {
                this.sub = 'items'; // Back to category
            }
        }
    },

    getFilteredItems() {
        const types = ['consumable', 'weapon', 'armor', 'accessory', 'material'];
        const targetType = types[this.itemCatCur];
        return Inventory2.items.filter(id => ItemData2[id] && ItemData2[id].type === targetType);
    },

    renderItems(ctx) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        // Category Window
        const catX = 20, catY = 30, catW = 140, catH = 165; // Height increased
        Draw.rect(ctx, catX, catY, catW, catH, 'rgba(0,0,0,0.95)');
        Draw.stroke(ctx, catX, catY, catW, catH, '#fff', 2);

        // Safety check for Inventory
        const items = Inventory2.items || [];
        const capacity = Inventory2.getCapacity ? Inventory2.getCapacity() : 20;

        // Count items per category
        const counts = [0, 0, 0, 0, 0];
        const types = ['consumable', 'weapon', 'armor', 'accessory', 'material'];
        items.forEach(id => {
            const data = ItemData2[id];
            if (data) {
                const idx = types.indexOf(data.type);
                if (idx !== -1) counts[idx]++;
            }
        });

        // Show Remaining Capacity
        const remaining = capacity - items.length;
        Draw.text(ctx, `【分類】 残り:${remaining}`, catX + 10, catY + 20, '#fc0', 14);

        this.itemCats.forEach((cat, i) => {
            const y = catY + 50 + i * 25;
            const isSel = (this.sub === 'items' && i === this.itemCatCur) || (this.sub === 'item_list' && i === this.itemCatCur);
            // Highlight active selection
            const color = (i === this.itemCatCur) ? '#fc0' : '#fff';

            // Cursor only if in category mode
            if (this.sub === 'items' && i === this.itemCatCur) Draw.text(ctx, '▶', catX + 5, y, '#fc0', 12);
            Draw.text(ctx, cat, catX + 15, y, color, 12);
            // Draw Count
            Draw.text(ctx, `${counts[i]}コ`, catX + 110, y, '#ccc', 12);
        });

        // Item List Window
        if (this.sub === 'item_list') {
            const listX = 40, listY = 20, listW = 240, listH = 200;
            Draw.rect(ctx, listX, listY, listW, listH, 'rgba(0, 0, 0, 0.95)');
            Draw.stroke(ctx, listX, listY, listW, listH, '#fff', 2);

            const filtered = this.getFilteredItems();
            Draw.text(ctx, `【${this.itemCats[this.itemCatCur]}】`, listX + 10, listY + 20, '#fc0', 14);

            if (filtered.length === 0) {
                Draw.text(ctx, '持っていない', listX + 20, listY + 50, '#ccc', 12);
            } else {
                const maxShow = 9;
                let startIdx = 0;
                if (this.subCur >= maxShow) startIdx = this.subCur - maxShow + 1;
                const visible = filtered.slice(startIdx, startIdx + maxShow);

                visible.forEach((id, i) => {
                    const y = listY + 50 + i * 20;
                    const data = ItemData2[id];
                    const absIdx = startIdx + i;
                    const isSel = (absIdx === this.subCur);
                    const color = isSel ? '#fc0' : '#fff';

                    if (isSel && !this.targetMember) Draw.text(ctx, '▶', listX + 10, y, '#fc0', 12);
                    Draw.text(ctx, data.name, listX + 25, y, color, 12);
                });

                // Description
                const selId = filtered[this.subCur];
                if (selId) {
                    const data = ItemData2[selId];
                    Draw.rect(ctx, listX, listY + listH + 5, listW, 50, 'rgba(0,0,0,0.9)');
                    Draw.stroke(ctx, listX, listY + listH + 5, listW, 50, '#fff', 1);
                    Draw.text(ctx, data.desc, listX + 10, listY + listH + 25, '#fff', 11);
                }
            }

            // Target Selection
            if (this.targetMember) {
                const tX = listX + 50, tY = listY + 30, tW = 120, tH = 120;
                Draw.rect(ctx, tX, tY, tW, tH, 'rgba(0,0,50,0.95)');
                Draw.stroke(ctx, tX, tY, tW, tH, '#fff', 2);
                const targets = [PlayerStats2, ...Party2.members];
                targets.forEach((t, i) => {
                    const y = tY + 20 + i * 20;
                    const isSel = (i === this.actionCur);
                    const color = isSel ? '#fc0' : '#fff';
                    if (isSel) Draw.text(ctx, '▶', tX + 5, y, '#fc0', 12);
                    Draw.text(ctx, t.name, tX + 20, y, color, 12);
                    Draw.text(ctx, `HP:${t.hp}`, tX + 80, y, '#8f8', 10);
                });
            }
        }
    }
};

// ===========================================
// Save Menu (For Save Points)
// ===========================================
export const SaveMenu = {
    visible: false,
    cur: 0,
    saveList: [],

    open() {
        this.visible = true;
        this.cur = 0;
        this.saveList = SaveSystem.getSaveList();
        Input.lock(200);
        if (WorldState) WorldState.changeState('menu'); // currentState = GameState.MENU;
    },

    close() {
        this.visible = false;
        Input.lock(150);
        if (WorldState) WorldState.changeState('playing'); // currentState = GameState.PLAYING;
    },

    update() {
        if (!this.visible) return;

        if (Input.cancel()) {
            this.close();
            return;
        }

        if (Input.justPressed('ArrowUp')) this.cur = (this.cur - 1 + 10) % 10;
        if (Input.justPressed('ArrowDown')) this.cur = (this.cur + 1) % 10;

        if (Input.interact()) {
            // Save to slot
            if (SaveSystem.save(this.cur)) {
                Msg.show(`Slot ${this.cur + 1} にセーブしました。`);
                this.close(); // Or refresh list?
            } else {
                Msg.show('セーブに失敗しました。');
            }
        }
    },

    render(ctx) {
        if (!this.visible) return;

        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        Draw.rect(ctx, 20, 20, VW - 40, VH - 40, 'rgba(0,0,50,0.95)');
        Draw.stroke(ctx, 20, 20, VW - 40, VH - 40, '#fff', 2);
        Draw.text(ctx, 'セーブする場所を選択', VW / 2, 40, '#fc0', 14, 'center');

        const listY = 60;
        // const showCount = 10;
        // let startIdx = 0;

        this.saveList.slice(0, 10).forEach((slot, i) => {
            const absIdx = i;
            const y = listY + i * 22; // Condensed slightly to fit
            const isSel = (absIdx === this.cur);
            const color = isSel ? '#fc0' : '#ccc';
            const prefix = isSel ? '▶ ' : '  ';

            let text = `Slot ${absIdx + 1}: ----`;
            if (slot.exists) {
                text = `Slot ${absIdx + 1}: ${slot.name} (W:${slot.week})`;
            }

            Draw.text(ctx, prefix + text, 40, y, color, 12);
        });
    }
};

// ===========================================
// Load Menu
// ===========================================
export const LoadMenu = {
    visible: false,
    cur: 0,
    saveList: [],

    open() {
        this.visible = true;
        this.cur = 0;
        this.saveList = SaveSystem.getSaveList();
        Input.lock(200);
        if (WorldState) WorldState.changeState('menu'); // currentState = GameState.MENU;
    },

    close() {
        this.visible = false;
        Input.lock(150);
        if (WorldState) WorldState.changeState('playing'); // currentState = GameState.PLAYING;
    },

    update() {
        if (!this.visible) return;

        if (Input.cancel()) {
            this.close();
            return;
        }

        if (Input.justPressed('ArrowUp')) this.cur = (this.cur - 1 + 10) % 10;
        if (Input.justPressed('ArrowDown')) this.cur = (this.cur + 1) % 10;

        if (Input.interact()) {
            const slot = this.saveList[this.cur];
            if (slot.exists) {
                if (SaveSystem.load(slot.slot)) {
                    this.close();
                    if (WorldState) WorldState.changeState('playing'); // Success load -> Playing
                    // Reset or logic?
                    // SaveSystem.load handles restoration
                } else {
                    Msg.show('ロードに失敗しました。');
                }
            } else {
                Msg.show('データがありません。');
            }
        }
    },

    render(ctx) {
        if (!this.visible) return;

        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        Draw.rect(ctx, 20, 20, VW - 40, VH - 40, 'rgba(0,0,50,0.95)');
        Draw.stroke(ctx, 20, 20, VW - 40, VH - 40, '#fff', 2);
        Draw.text(ctx, 'ロードするデータを選択', VW / 2, 40, '#fc0', 14, 'center');

        const listY = 60;

        this.saveList.slice(0, 10).forEach((slot, i) => {
            const absIdx = i;
            const y = listY + i * 22;
            const isSel = (absIdx === this.cur);
            const color = isSel ? '#fc0' : '#ccc';
            const prefix = isSel ? '▶ ' : '  ';

            let text = `Slot ${absIdx + 1}: ----`;
            if (slot.exists) {
                text = `Slot ${absIdx + 1}: ${slot.name} (W:${slot.week})`;
            }

            Draw.text(ctx, prefix + text, 40, y, color, 12);
        });
    }
};
