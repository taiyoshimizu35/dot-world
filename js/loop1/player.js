// ===========================================
// プレイヤーステータス
// ===========================================
// ※ gameLoop, truthFlagsはworld.jsで定義

import { ShopData, MagicShopData, AdvancedShopData, MaterialData, MapItems } from './data/items.js';
import { QuestSystem as QuestFlags } from './quest.js';

export const PlayerStats = {
    name: '勇者',
    level: 1,
    // Base stats (without equipment)
    baseMaxHp: 30, maxHp: 30, hp: 30,
    baseMaxSp: 10, maxSp: 10, sp: 10, // MP -> SP
    baseAtk: 8, atk: 8,
    baseDef: 4, def: 4,
    baseMatk: 6, matk: 6,
    baseMdef: 3, mdef: 3,

    exp: 0, nextExp: 40,
    gold: 50,
    skills: { fire: false, heal: false, water: false, wind: false }, // spells -> skills
    status: { poisonVal: 0, silence: 0, atkDownVal: 0, defDownVal: 0 },
    magicBoost: 1.0,
    isDefending: false,
    displaySpOffset: 0, // displayMpOffset -> displaySpOffset
    holySwordBonus: 0,

    // Equipment Slots
    equipment: {
        weapon: null,
        armor: null,
        accessory: null
    },

    _worldState: null,

    init(worldState) {
        this._worldState = worldState;
        this.recalcStats();
    },

    // Recalculate stats based on level and equipment
    recalcStats() {
        // 1. Reset to base stats
        this.maxHp = this.baseMaxHp;
        this.maxSp = this.baseMaxSp;
        this.atk = this.baseAtk;
        this.def = this.baseDef;
        this.matk = this.baseMatk;
        this.mdef = this.baseMdef;
        this.magicBoost = 1.0;

        // 2. Add Equipment Bonuses
        // Weapon
        if (this.equipment.weapon) {
            const w = this.findItemData(this.equipment.weapon);
            if (w) {
                if (w.atk) {
                    this.atk += w.atk;
                    if (this.equipment.weapon === '聖剣') {
                        this.atk += this.holySwordBonus;
                    }
                }
                if (w.def) this.def += w.def;
                if (w.matk) this.matk += w.matk;
                if (w.mdef) this.mdef += w.mdef;
                if (w.magicBoost) this.magicBoost = Math.max(this.magicBoost, w.magicBoost);
            }
        }
        // Armor
        if (this.equipment.armor) {
            const a = this.findItemData(this.equipment.armor);
            if (a) {
                if (a.def) this.def += a.def;
                if (a.matk) this.matk += a.matk;
                if (a.mdef) this.mdef += a.mdef;
                if (a.maxSp) this.maxSp += a.maxSp;
            }
        }
        // Accessory
        if (this.equipment.accessory) {
            const acc = this.findItemData(this.equipment.accessory);
            if (acc) {
                if (acc.atk) this.atk += acc.atk;
                if (acc.def) this.def += acc.def;
                if (acc.matk) this.matk += acc.matk;
                if (acc.mdef) this.mdef += acc.mdef;
            }
        }

        // Cap HP/SP to new max
        this.hp = Math.min(this.hp, this.maxHp);
        this.sp = Math.min(this.sp, this.maxSp);
    },

    // Helper to find item data (needs refernce to ShopData/Items)
    findItemData(name) {
        // Combine all shop lists or use a dedicated item DB. 
        // For now, scan the known lists.
        const allItems = [
            ...ShopData.items,
            ...MagicShopData.items,
            ...AdvancedShopData.items,
            ...MapItems.items
        ];
        return allItems.find(i => i.name === name);
    },

    // Equip item
    equip(name) {
        const item = this.findItemData(name);
        if (!item) return false;

        if (item.type === 'weapon' || item.type === 'holySword' || item.type === 'staff') {
            this.equipment.weapon = name;
        } else if (item.type === 'armor' || item.type === 'robe') {
            this.equipment.armor = name;
        } else if (item.type === 'amulet') {
            this.equipment.accessory = name;
        } else {
            return false;
        }
        this.recalcStats();
        return true;
    },

    unequip(slot) {
        if (this.equipment[slot]) {
            this.equipment[slot] = null;
            this.recalcStats();
        }
    },

    // DECEPTION_LOGIC: 表示用ステータス取得
    getDisplayStats() {
        return {
            hp: this.hp,
            maxHp: this.maxHp,
            sp: this.sp,
            maxSp: this.maxSp,
            /* Compatibility properties if needed, but we refactor fully */
            // mp: this.sp, 
            // maxMp: this.maxSp,
            atk: this.atk,
            def: this.def,
            matk: this.matk,
            mdef: this.mdef,
            level: this.level,
            exp: this.exp,
            nextExp: this.nextExp,
            gold: this.gold,
            name: this.name
        };
    },

    takeDamage(dmg) { this.hp = Math.max(0, this.hp - dmg); return this.hp <= 0; },

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    },
    healFull() {
        this.hp = this.maxHp;
        this.sp = this.maxSp;
        this.displaySpOffset = 0;
        // Reset status ailments
        this.status.poisonVal = 0;
        this.status.silence = 0;
        this.status.atkDownVal = 0;
        this.status.defDownVal = 0;
        this.recalcStats();
    },
    healSp(amount) {
        this.sp = Math.min(this.maxSp, this.sp + amount);
        this.displaySpOffset = Math.max(0, this.displaySpOffset - amount);
    },
    fullHealSp() {
        this.sp = this.maxSp;
        this.displaySpOffset = 0;
    },

    useSp(amount) {
        const actualDecrease = Math.min(this.sp, amount);
        this.sp = Math.max(0, this.sp - amount);
        const displayDecrease = amount - actualDecrease;
        this.displaySpOffset += displayDecrease;
        return true;
    },

    hasSufficientSp(amount) {
        return this.sp >= amount;
    },

    addExp(amount) {
        // 2週目はレベルアップなし
        if (this._worldState && this._worldState.week === 2) {
            this.gold += Math.floor(amount / 10);
            return false;
        }
        // 1週目は通常のレベルアップ
        this.exp += amount;
        if (this.exp >= this.nextExp) { this.levelUp(); return true; }
        return false;
    },

    addGold(amount) { this.gold += amount; },
    spendGold(amount) { if (this.gold >= amount) { this.gold -= amount; return true; } return false; },

    applyDefDebuff(amount) {
        if (this.equipment.accessory === '女神の護符' && Math.random() < 0.5) return;
        this.def = Math.max(0, this.def - amount);
        this.status.defDownVal = (this.status.defDownVal || 0) + amount;
    },
    applyAtkDebuff(amount) {
        if (this.equipment.accessory === '女神の護符' && Math.random() < 0.5) return;
        this.atk = Math.max(1, this.atk - amount);
        this.status.atkDownVal = (this.status.atkDownVal || 0) + amount;
    },

    tickStatus() {
        let msgs = [];
        if (this.status.poisonVal > 0) {
            const dmg = this.status.poisonVal;
            this.hp = Math.max(1, this.hp - dmg);
            msgs.push(`毒のダメージ！ HPが${dmg}減った！`);
        }
        if (this.status.silence > 0) {
            this.status.silence--;
            if (this.status.silence === 0) msgs.push('沈黙が治った！');
        }
        return msgs;
    },

    levelUp() {
        this.level++;

        // Holy Sword Growth Rule: +3 ATK per level if possessed
        const inv = this._worldState ? this._worldState.managers.inventory : null;
        if (inv && (inv.has('聖剣') || this.equipment.weapon === '聖剣')) {
            this.holySwordBonus += 3;
        }

        // Base stats growth
        this.baseMaxHp += 5;
        this.baseMaxSp += 2;
        this.baseAtk += 2;
        this.baseDef += 1;
        this.baseMatk += 2;
        this.baseMdef += 1;

        this.exp = 0;
        this.nextExp = Math.floor(this.nextExp * 1.15);

        this.recalcStats(); // Update totals
        QuestFlags.check();
    },

    fullRestore() {
        this.hp = this.maxHp;
        this.sp = this.maxSp;
        this.displaySpOffset = 0;
        this.status = { poisonVal: 0, silence: 0, atkDownVal: 0, defDownVal: 0 };
    },

    resetSpells() {
        this.skills = { fire: false, heal: false, water: false, wind: false };
        this.magicBoost = 1.0;
    },

    // Reset temporary battle statuses (called after battle)
    resetBattleStatus() {
        this.status.atkDownVal = 0;
        this.status.defDownVal = 0;
        this.status.silence = 0;
        // Keep Poison as it persists
        this.recalcStats();
    },

    // 2週目開始時のリセット
    resetForWeek2() {
        if (this._worldState) this._worldState.startWeek2(this);

        this.level = 1;
        this.baseMaxHp = 30; this.maxHp = 30; this.hp = 30;
        this.baseMaxSp = 10; this.maxSp = 10; this.sp = 10;
        this.baseAtk = 8; this.atk = 8;
        this.baseDef = 4; this.def = 4;
        this.baseMatk = 6; this.matk = 6;
        this.baseMdef = 3; this.mdef = 3;

        this.equipment = { weapon: null, armor: null, accessory: null };

        this.exp = 0; this.nextExp = 50;
        this.gold = 50;
        this.displaySpOffset = 0;
        this.status = { poisonVal: 0, silence: 0, atkDownVal: 0, defDownVal: 0 };
        this.skills = { fire: false, heal: false, water: false, wind: false };
        this.magicBoost = 1.0;
    }
};
// window.PlayerStats = PlayerStats;
