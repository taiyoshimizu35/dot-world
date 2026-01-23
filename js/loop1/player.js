// ===========================================
// プレイヤーステータス
// ===========================================
// ※ gameLoop, truthFlagsはworld.jsで定義

const PlayerStats = {
    name: '勇者',
    level: 1,
    // Base stats (without equipment)
    baseMaxHp: 30, maxHp: 30, hp: 30,
    baseMaxMp: 10, maxMp: 10, mp: 10,
    baseAtk: 8, atk: 8,
    baseDef: 4, def: 4,
    baseMatk: 6, matk: 6,
    baseMdef: 3, mdef: 3,

    exp: 0, nextExp: 50,
    gold: 50,
    spells: { fire: false, heal: false, water: false, wind: false },
    status: { poisonVal: 0, silence: 0, atkDownVal: 0, defDownVal: 0 },
    magicBoost: 1.0,
    isDefending: false,
    displayMpOffset: 0,
    holySwordBonus: 0,

    // Equipment Slots
    equipment: {
        weapon: null,
        armor: null,
        accessory: null
    },

    init() {
        this.recalcStats();
    },

    // Recalculate stats based on level and equipment
    recalcStats() {
        // 1. Reset to base stats
        this.maxHp = this.baseMaxHp;
        this.maxMp = this.baseMaxMp;
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
                if (a.maxMp) this.maxMp += a.maxMp;
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

        // Cap HP/MP to new max
        this.hp = Math.min(this.hp, this.maxHp);
        this.mp = Math.min(this.mp, this.maxMp);
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

    // DECEPTION_LOGIC: 表示用ステータス取得 - 1週目はLv×3の下駄 -> 廃止
    getDisplayStats() {
        // ステータスの嘘: 廃止 (truthFlags check removed or always true essentially)
        // User requested: "Remove level * 3 status, remove waste internal number system, make it normal RPG"

        return {
            hp: this.hp,
            maxHp: this.maxHp,
            mp: this.mp,
            maxMp: this.maxMp,
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
        this.mp = this.maxMp;
        this.displayMpOffset = 0;
        // Reset status ailments
        this.status.poisonVal = 0;
        this.status.silence = 0;
        this.status.atkDownVal = 0;
        this.status.defDownVal = 0;
        // Reset base stats if needed (atk/def might be lowered by debuffs)
        // Since debuffs modify current stats, we should probably reset/recalc?
        // Current implementation seems to modify `this.atk` directly in `applyAtkDebuff`.
        // So we need to ensure stats are restored.
        // For now, simpler reset:
        this.recalcStats();
    },
    healMp(amount) {
        this.mp = Math.min(this.maxMp, this.mp + amount);
        this.displayMpOffset = Math.max(0, this.displayMpOffset - amount);
    },
    fullHealMp() {
        this.mp = this.maxMp;
        this.displayMpOffset = 0;
    },

    useMp(amount) {
        const actualDecrease = Math.min(this.mp, amount);
        this.mp = Math.max(0, this.mp - amount);
        const displayDecrease = amount - actualDecrease;
        this.displayMpOffset += displayDecrease;
        return true;
    },

    hasSufficientMp(amount) {
        return this.mp >= amount;
    },

    addExp(amount) {
        // 2週目はレベルアップなし
        if (gameLoop.week === 2) {
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
        // Check inventory via WorldState manager (Inv is usually attached there or global Inv object)
        const inv = WorldState.managers.inventory;
        if (inv && (inv.has('聖剣') || this.equipment.weapon === '聖剣')) {
            this.holySwordBonus += 3;
        }

        // Base stats growth
        this.baseMaxHp += 5;
        this.baseMaxMp += 2;
        this.baseAtk += 2;
        this.baseDef += 1;
        this.baseMatk += 2;
        this.baseMdef += 1;

        // No full heal on level up (User Request)
        // this.hp = this.baseMaxHp;
        // this.mp = this.baseMaxMp;

        this.exp = 0;
        this.nextExp = Math.floor(this.nextExp * 1.5);

        this.recalcStats(); // Update totals
        QuestFlags.check();
    },

    fullRestore() {
        this.hp = this.maxHp;
        this.mp = this.maxMp;
        this.displayMpOffset = 0;
        this.status = { poisonVal: 0, silence: 0, atkDownVal: 0, defDownVal: 0 };
    },

    resetSpells() {
        this.spells = { fire: false, heal: false, water: false, wind: false };
        this.magicBoost = 1.0;
    },

    // 2週目開始時のリセット
    resetForWeek2() {
        WorldState.startWeek2(this);

        this.level = 1;
        this.baseMaxHp = 30; this.maxHp = 30; this.hp = 30;
        this.baseMaxMp = 10; this.maxMp = 10; this.mp = 10;
        this.baseAtk = 8; this.atk = 8;
        this.baseDef = 4; this.def = 4;
        this.baseMatk = 6; this.matk = 6;
        this.baseMdef = 3; this.mdef = 3;

        this.equipment = { weapon: null, armor: null, accessory: null };

        this.exp = 0; this.nextExp = 50;
        this.gold = 50;
        this.displayMpOffset = 0;
        this.status = { poisonVal: 0, silence: 0, atkDownVal: 0, defDownVal: 0 };
        this.spells = { fire: false, heal: false, water: false, wind: false };
        this.magicBoost = 1.0;
    }
};
window.PlayerStats = PlayerStats;
