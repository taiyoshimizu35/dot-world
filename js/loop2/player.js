// ===========================================
// 2週目プレイヤー（内部exp成長システム）
// ===========================================

// ===========================================
// 2週目プレイヤー（レベル制・SPシステム）
// ===========================================

import { ItemData2 } from './data/items.js';
import { QuestSystem2 } from './quest.js';
import { LevelSystem } from './systems/level.js';
export const PlayerStats2 = {
    id: 'hero', // Added ID for learning lookup
    name: '勇者',
    level: 1,

    // Base stats (without equipment)
    baseMaxHp: 30, maxHp: 30, hp: 30,
    baseMaxSp: 10, maxSp: 10, sp: 10, // MP -> SP
    baseAtk: 8, atk: 8,
    baseDef: 4, def: 4,
    baseMatk: 6, matk: 6,
    baseMdef: 3, mdef: 3,
    baseAgi: 5, agi: 5,

    exp: 0, nextExp: 40,
    gold: 50,

    // Equipment Slots
    equipment: {
        weapon: null,
        armor: null,
        accessory: null
    },

    spells: { fire: false, heal: false, water: false, wind: false }, // Old system (keep for safety?)
    skills: [], // New Skill System (Array of IDs)
    status: { poisonVal: 0, silence: 0, atkDownVal: 0, defDownVal: 0 },
    magicBoost: 1.0,
    isDefending: false,

    holySwordBonus: 0, // Not used in Loop 2 explicitly yet, but kept for compatibility/future use

    _worldState: null,

    init(worldState) {
        this._worldState = worldState; // Determine if needed
        this.reset();
    },

    reset() {
        this.level = 1;
        this.baseMaxHp = 30; this.maxHp = 30; this.hp = 30;
        this.baseMaxSp = 10; this.maxSp = 10; this.sp = 10;
        this.baseAtk = 8; this.atk = 8;
        this.baseDef = 4; this.def = 4;
        this.baseMatk = 6; this.matk = 6;
        this.baseMdef = 3; this.mdef = 3;

        this.exp = 0; this.nextExp = 40;
        this.gold = 50;

        this.equipment = { weapon: null, armor: null, accessory: null };
        this.status = { poisonVal: 0, silence: 0, atkDownVal: 0, defDownVal: 0 };
        this.spells = { fire: false, heal: false, water: false, wind: false };
        this.skills = []; // Logic to reload skills from save needed later, or re-learn? 
        // For now, reset clears them. Savedata should load them.
        this.magicBoost = 1.0;
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
        this.agi = this.baseAgi || 5;
        this.magicBoost = 1.0;

        // 2. Add Equipment Bonuses
        const equipList = [this.equipment.weapon, this.equipment.armor, this.equipment.accessory];

        equipList.forEach(itemId => {
            if (!itemId) return;
            const item = ItemData2[itemId];
            if (item && item.stats) {
                if (item.stats.atk) this.atk += item.stats.atk;
                if (item.stats.def) this.def += item.stats.def;
                if (item.stats.matk) this.matk += item.stats.matk;
                if (item.stats.mdef) this.mdef += item.stats.mdef;
                if (item.stats.maxHp) this.maxHp += item.stats.maxHp;
                if (item.stats.maxSp) this.maxSp += item.stats.maxSp;
                if (item.stats.agi) this.agi += item.stats.agi;
            }
        });

        // Cap HP/SP to new max
        this.hp = Math.min(this.hp, this.maxHp);
        this.sp = Math.min(this.sp, this.maxSp);
    },

    // Equip item
    equip(itemId) {
        const item = ItemData2[itemId];
        if (!item) return false;

        let slot = null;
        if (item.type === 'weapon') slot = 'weapon';
        else if (item.type === 'armor') slot = 'armor';
        else if (item.type === 'accessory') slot = 'accessory';

        if (slot) {
            this.equipment[slot] = itemId;
            this.recalcStats();
            return true;
        }
        return false;
    },

    unequip(slot) {
        if (this.equipment[slot]) {
            this.equipment[slot] = null;
            this.recalcStats();
        }
    },

    getDisplayStats() {
        return {
            hp: this.hp,
            maxHp: this.maxHp,
            mp: this.sp,    // Display uses 'mp' property key commonly in Menu code, but value is SP
            maxMp: this.maxSp, // Same here
            sp: this.sp,    // Also provide sp for SP-aware code
            maxSp: this.maxSp,
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

    addExp(amount) {
        this.exp += amount;
        let leveledUp = false;
        while (this.exp >= this.nextExp) {
            this.exp -= this.nextExp;
            this.levelUp();
            leveledUp = true;
        }
        return leveledUp;
    },

    levelUp() {
        this.level++;

        // Base stats growth (Simple linear for now)
        this.baseMaxHp += 5;
        this.baseMaxSp += 2;
        this.baseAtk += 2;
        this.baseDef += 1;
        this.baseMatk += 2;
        this.baseMdef += 1;

        // Increase Exp requirement
        this.nextExp = Math.floor(this.nextExp * 1.2);

        this.recalcStats();

        // Setup notification or message in Battle/Menu? 
        // Battle loop handles the message usually.
        LevelSystem.checkDoLearning(this);
    },

    // 戦闘でのダメージ処理
    takeDamage(dmg) {
        this.hp = Math.max(0, this.hp - dmg);
        return this.hp <= 0;
    },

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    },

    healSp(amount) {
        this.sp = Math.min(this.maxSp, this.sp + amount);
    },

    fullHealSp() {
        this.sp = this.maxSp;
    },

    useSp(amount) {
        if (this.sp >= amount) {
            this.sp -= amount;
            return true;
        }
        return false;
    },

    hasSufficientSp(amount) {
        return this.sp >= amount;
    },

    addGold(amount) { this.gold += amount; },

    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        return false;
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

    fullRestore() {
        this.hp = this.maxHp;
        this.sp = this.maxSp;
        this.status = { poisonVal: 0, silence: 0, atkDownVal: 0, defDownVal: 0 };
    }
};