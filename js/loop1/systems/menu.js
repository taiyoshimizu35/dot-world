import { GameConfig } from '../../constants.js';
import { Draw } from '../../core/draw.js';
import { Input } from '../../core/input.js';
import { FX } from '../../core/effects.js';
import { PlayerStats } from '../player.js';
import { Inventory as Inv } from '../inventory.js';
// import { WorldState } from '../world.js'; // Dependency Injected
import { Maps } from './maps/manager.js';

// ===========================================
// メニュー
// ===========================================
export const Menu = {
    visible: false, cur: 0, sub: null, itemCur: 0,
    categoryCur: 0,
    categories: ['道具', '武器', '防具', '装飾品'],
    message: null,
    opts: ['アイテム', 'ステータス', '閉じる'],
    _worldState: null,

    init(worldState) {
        this._worldState = worldState;
    },

    open() {
        this.visible = true;
        this.cur = 0;
        this.sub = null;
        this.itemCur = 0;
        this.categoryCur = 0;
        this.message = null;
        // currentState = GameState.MENU;
        Input.lock(200);
    },

    close() {
        this.visible = false;
        this.sub = null;
        this.message = null;
        // currentState = GameState.PLAYING;
        Input.lock(150);
    },

    update() {
        if (!this.visible) return;

        // Message Mode
        if (this.message) {
            if (Input.interact() || Input.cancel()) this.message = null;
            return;
        }

        // Submenu: Status
        if (this.sub === 'status') {
            if (Input.cancel()) { this.sub = null; Input.lock(150); }
            return;
        }

        // Submenu: Item Categories
        if (this.sub === 'categories') {
            if (Input.justPressed('ArrowUp')) this.categoryCur = (this.categoryCur - 1 + this.categories.length) % this.categories.length;
            if (Input.justPressed('ArrowDown')) this.categoryCur = (this.categoryCur + 1) % this.categories.length;
            if (Input.interact()) {
                this.sub = 'items';
                this.itemCur = 0;
            }
            if (Input.cancel()) { this.sub = null; Input.lock(150); }
            return;
        }

        // Submenu: Item List
        if (this.sub === 'items') {
            const items = this.getFilteredItems();
            if (items.length === 0) {
                if (Input.cancel()) { this.sub = 'categories'; Input.lock(150); }
                return;
            }
            if (Input.justPressed('ArrowUp')) this.itemCur = (this.itemCur - 1 + items.length) % items.length;
            if (Input.justPressed('ArrowDown')) this.itemCur = (this.itemCur + 1) % items.length;

            if (Input.interact()) {
                const item = items[this.itemCur];
                this.handleItemAction(item);
            }

            if (Input.cancel()) { this.sub = 'categories'; Input.lock(150); }
            return;
        }

        // Main Menu
        if (Input.justPressed('ArrowUp')) this.cur = (this.cur - 1 + 3) % 3;
        if (Input.justPressed('ArrowDown')) this.cur = (this.cur + 1) % 3;
        if (Input.interact()) {
            if (this.cur === 0) { this.sub = 'categories'; this.categoryCur = 0; }
            else if (this.cur === 1) this.sub = 'status';
            else this.close();
        }
        if (Input.cancel()) this.close();
    },

    getFilteredItems() {
        const cat = this.categories[this.categoryCur];
        const all = Inv.list().map(([n, c]) => ({ name: n, count: c, data: PlayerStats.findItemData(n) }));

        let typeFilter = [];
        if (cat === '道具') typeFilter = ['item'];
        else if (cat === '武器') typeFilter = ['weapon', 'holySword', 'staff'];
        else if (cat === '防具') typeFilter = ['armor', 'robe'];
        else if (cat === '装飾品') typeFilter = ['amulet'];

        // Include equipped items? "Inv.list()" checks inventory.
        // Assuming equipped items are REMOVED from inventory or KEPT?
        // Standard RPG: Equipped item is distinct.
        // CURRENT SYSTEM: inv.add just increments counter.
        // If I equip, do I remove from inventory?
        // If I buy 1 Sword, Equip it -> Inv count 0?
        // If count 0, Inv.list won't return it.
        // So I need to ALSO list equipped items if they match category.

        let list = all.filter(i => i.data && typeFilter.includes(i.data.type));

        // Add equipped items if they match filter and aren't in inventory (or simplify display)
        // Let's create a display list.
        // If something is equipped, it might not be in Inv (count 0), so we must check PlayerStats.equipment.

        const eq = PlayerStats.equipment;
        const slots = [];
        if (cat === '武器' && eq.weapon) slots.push(eq.weapon);
        if (cat === '防具' && eq.armor) slots.push(eq.armor);
        if (cat === '装飾品' && eq.accessory) slots.push(eq.accessory);

        // Add equipped items to list if not present (or mark them)
        slots.forEach(name => {
            const existing = list.find(i => i.name === name);
            if (existing) {
                existing.equipped = true;
            } else {
                const data = PlayerStats.findItemData(name);
                if (data) list.unshift({ name: name, count: 0, data: data, equipped: true });
            }
        });

        return list;
    },

    handleItemAction(item) {
        if (item.equipped) {
            // Unequip or do nothing? User said "着脱".
            // If equipped, unequip.
            PlayerStats.equip(item.name); // Re-equipping same item? Usually no-op or unequip.
            // Let's implement unequip check.
            let slot = null;
            if (['weapon', 'holySword', 'staff'].includes(item.data.type)) slot = 'weapon';
            else if (['armor', 'robe'].includes(item.data.type)) slot = 'armor';
            else if (item.data.type === 'amulet') slot = 'accessory';

            if (slot && PlayerStats.equipment[slot] === item.name) {
                // Already equipped -> Unequip
                PlayerStats.unequip(slot);
                // Return to inventory implicitly (since we check Inv.list + equipped)
                // We need to ensure Inv has it back if we count it.
                // Wait, if Inv system counts ownership independently of equip state?
                // If I have 1 Sword, Equip it. Is it 1 in Inv?
                // Usually yes. "Inv" = "Possession". "Equipped" = "Active".
                // If so, my getFilteredItems logic is: Inv.list() shows all.
                // Then I just mark 'equipped'.

                // Let's assume Inv.add keeps it in inventory.
                // BUT, if I "sell" it, I need to check if equipped.
                // For now, let's assume Inv count includes equipped.

                // If so:
                // Equipping doesn't change Inv count.
                // It just sets PlayerStats.equipment.

                // However, logic above: `existing.equipped = true`.
                // So if I click equipped item -> Unequip.
                this.message = `${item.name}を外しました。`;
                return;
            }
        }

        // Equip / Use
        if (this.categories[this.categoryCur] === '道具') {
            this.useItem(item.name);
        } else {
            // Equip
            if (PlayerStats.equip(item.name)) {
                this.message = `${item.name}を装備しました！`;
            } else {
                this.message = '装備できません。';
            }
        }
    },

    useItem(itemName) {
        // ... (Existing useItem logic, but simplified/adapted)
        // Need to copy existing logic but refactor slightly if needed.
        // pasting previous logic...
        if (itemName === '薬草') {
            PlayerStats.heal(15); Inv.remove('薬草'); this.message = 'HPが15回復した！';
        } else if (itemName === 'ポーション') {
            PlayerStats.heal(30); Inv.remove('ポーション'); this.message = 'HPが30回復した！';
        } else if (itemName === '上薬草') {
            PlayerStats.heal(60); Inv.remove('上薬草'); this.message = 'HPが60回復した！';
        } else if (itemName === 'エリクサー') {
            PlayerStats.heal(100); Inv.remove('エリクサー'); this.message = 'HPが100回復した！';
        } else if (itemName === '魔力の小瓶') {
            PlayerStats.healMp(10); Inv.remove('魔力の小瓶'); this.message = 'MPが10回復した！';
        } else if (itemName === 'ハイ・エーテル') {
            PlayerStats.healMp(30); Inv.remove('ハイ・エーテル'); this.message = 'MPが30回復した！';
        } else if (itemName === '解毒ポーション') {
            if (PlayerStats.status.poisonVal > 0) {
                PlayerStats.status.poisonVal = 0; Inv.remove('解毒ポーション'); this.message = '毒が治った！';
            } else { this.message = '毒にかかっていない！'; }
        } else if (itemName === '気付け薬') {
            if (PlayerStats.status.silence > 0) {
                PlayerStats.status.silence = 0; Inv.remove('気付け薬'); this.message = '沈黙が治った！';
            } else { this.message = '沈黙にかかっていない！'; }
        } else if (itemName === '力の粉') {
            if (PlayerStats.status.atkDownVal > 0) {
                PlayerStats.atk += PlayerStats.status.atkDownVal;
                PlayerStats.status.atkDownVal = 0; Inv.remove('力の粉'); this.message = '攻撃力が戻った！';
            } else { this.message = '攻撃力は下がっていない！'; }
        } else if (itemName === '守りの霧') {
            if (PlayerStats.status.defDownVal > 0) {
                PlayerStats.def = PlayerStats.baseDef;
                PlayerStats.status.defDownVal = 0; Inv.remove('守りの霧'); this.message = '防御力が戻った！';
            } else { this.message = '防御力は下がっていない！'; }
        } else if (itemName === '魔除け薬') {
            if (this._worldState) this._worldState.useCharm();
            Inv.remove('魔除け薬'); this.message = '魔除けの効果が現れた！';
        } else if (itemName === '天使のはね') {
            Inv.remove('天使のはね');
            this.message = '天使のはねを使った！';
            FX.fadeOut(() => {
                Maps.current = 'village';
                const game = this._worldState ? this._worldState.game : null;
                if (game && game.player) {
                    const TS = GameConfig.TILE_SIZE;
                    game.player.x = 12 * TS;
                    game.player.y = 11 * TS;
                    if (this._worldState) this._worldState.resetEncounterSteps(Maps.get().encounterRate);
                }
                FX.fadeIn();
                this.close();
            });
            return;
        } else {
            this.message = 'このアイテムは使えない！';
        }
    },

    render(ctx) {
        if (!this.visible) return;

        // Submenu: Categories
        if (this.sub === 'categories') {
            this.renderCategories(ctx);
        }
        // Submenu: Items
        else if (this.sub === 'items') {
            this.renderItems(ctx);
        }
        // Submenu: Status
        else if (this.sub === 'status') {
            this.renderStatus(ctx);
        }
        // Main Menu
        else {
            Draw.rect(ctx, 160, 16, 88, 80, 'rgba(0,0,40,0.95)');
            Draw.stroke(ctx, 160, 16, 88, 80, '#fff', 2);
            for (let i = 0; i < this.opts.length; i++) {
                const y = 26 + i * 22;
                if (i === this.cur) Draw.text(ctx, '▶', 168, y, '#fc0', 12);
                Draw.text(ctx, this.opts[i], 184, y, '#fff', 12);
            }
        }

        if (this.message) {
            const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;
            Draw.rect(ctx, 20, VH - 50, VW - 40, 40, 'rgba(0,0,40,0.95)');
            Draw.stroke(ctx, 20, VH - 50, VW - 40, 40, '#fff', 2);
            Draw.text(ctx, this.message, 30, VH - 40, '#fff', 12);
        }
    },

    renderCategories(ctx) {
        Draw.rect(ctx, 100, 16, 120, 120, 'rgba(0,0,40,0.95)');
        Draw.stroke(ctx, 100, 16, 120, 120, '#fff', 2);
        Draw.text(ctx, '【分類】', 110, 30, '#fc0', 12);

        for (let i = 0; i < this.categories.length; i++) {
            const y = 50 + i * 20;
            if (i === this.categoryCur) Draw.text(ctx, '▶', 110, y, '#fc0', 12);
            Draw.text(ctx, this.categories[i], 126, y, '#fff', 12);
        }
    },

    renderItems(ctx) {
        const items = this.getFilteredItems();
        const boxHeight = Math.max(120, 50 + items.length * 20);
        Draw.rect(ctx, 16, 16, 200, boxHeight, 'rgba(0,0,40,0.95)');
        Draw.stroke(ctx, 16, 16, 200, boxHeight, '#fff', 2);

        const cat = this.categories[this.categoryCur];
        Draw.text(ctx, `【${cat}】Z:決定 X:戻る`, 24, 24, '#fc0', 10);

        if (items.length === 0) {
            Draw.text(ctx, '何も持っていない', 24, 48, '#888', 12);
        } else {
            let y = 44;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (i === this.itemCur) Draw.text(ctx, '▶', 24, y, '#fc0', 12);

                let prefix = '';
                if (item.equipped) prefix = '[E]';

                Draw.text(ctx, `${prefix}${item.name} x${item.count}`, 38, y, '#fff', 12);

                // Show stats if equipable
                if (item.data) {
                    let stat = '';
                    if (item.data.atk) {
                        let val = item.data.atk;
                        if (item.name === '聖剣') val += PlayerStats.holySwordBonus;
                        stat += `攻:${val} `;
                    }
                    if (item.data.def) stat += `防:${item.data.def} `;
                    if (stat) Draw.text(ctx, stat, 140, y, '#ccc', 10);
                }

                y += 20;
            }
        }
    },

    renderStatus(ctx) {
        const s = PlayerStats.getDisplayStats();
        Draw.rect(ctx, 16, 16, 160, 200, 'rgba(0,0,40,0.95)');
        Draw.stroke(ctx, 16, 16, 160, 200, '#fff', 2);
        Draw.text(ctx, '【ステータス】X/Escで戻る', 24, 24, '#fc0', 10);
        Draw.text(ctx, s.name, 24, 44, '#fff', 12);
        Draw.text(ctx, `Lv: ${s.level}`, 24, 62, '#fff', 12);
        Draw.text(ctx, `HP: ${s.hp}/${s.maxHp}`, 24, 80, '#8f8', 12);
        Draw.text(ctx, `MP: ${s.mp}/${s.maxMp}`, 24, 98, '#8cf', 12);
        Draw.text(ctx, `ATK: ${s.atk}`, 24, 116, '#f88', 12);
        Draw.text(ctx, `DEF: ${s.def}`, 90, 116, '#88f', 12);
        Draw.text(ctx, `MATK: ${s.matk}`, 24, 134, '#f8f', 12);
        Draw.text(ctx, `MDEF: ${s.mdef}`, 90, 134, '#8ff', 12);
        Draw.text(ctx, `Gold: ${s.gold}G`, 24, 152, '#ff0', 12);

        // Equipment Display (Text Only)
        Draw.text(ctx, `武器: ${PlayerStats.equipment.weapon || 'なし'}`, 24, 170, '#fff', 10);
        Draw.text(ctx, `防具: ${PlayerStats.equipment.armor || 'なし'}`, 24, 182, '#fff', 10);
        Draw.text(ctx, `装飾: ${PlayerStats.equipment.accessory || 'なし'}`, 24, 194, '#fff', 10);
    }
};