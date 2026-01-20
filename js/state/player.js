// ===========================================
// プレイヤーステータス
// ===========================================

// ゲームループ管理（1週目/2週目）
const gameLoop = {
    week: 1,              // 1 or 2
    absorbedStats: null,  // 吸収されたステータス（2週目魔王強化用）
    holySwordOwned: false,  // 聖剣所持
    holySwordStolen: false  // 聖剣が魔剣として奪われた
};

// 真実フラグ - falseの間、各種偽装が有効
const truthFlags = {
    status: false,   // ステータスの嘘（Lv×3下駄）
    command: false,  // コマンドの嘘（防御=挑発、属性ずらし）
    map: false,      // マップの嘘（1本道、高経験値）
    weapon: false    // 武器の嘘（聖剣→魔剣）
};

const PlayerStats = {
    name: '勇者',
    level: 1,
    hp: 30, maxHp: 30,
    mp: 10, maxMp: 10,
    atk: 8, def: 4,
    matk: 6, mdef: 3,
    baseDef: 4,
    exp: 0, nextExp: 50,
    gold: 50,
    spells: { fire: false, heal: false, water: false, wind: false },
    status: { poisonVal: 0, silence: 0, atkDownVal: 0, defDownVal: 0 },
    magicBoost: 1.0,
    isDefending: false,
    displayMpOffset: 0,

    // DECEPTION_LOGIC: 表示用ステータス取得 - 1週目はLv×3の下駄
    getDisplayStats() {
        // ステータスの嘘: Lv×3の下駄
        const boost = truthFlags.status ? 0 : (this.level * 3);

        const displayHp = this.hp <= 0 ? 0 : this.hp + boost;
        const rawDisplayMp = this.mp + boost - this.displayMpOffset;
        const displayMp = Math.max(0, rawDisplayMp);

        return {
            hp: displayHp,
            maxHp: this.maxHp + boost,
            mp: displayMp,
            maxMp: this.maxMp + boost,
            atk: this.atk + boost,
            def: this.def + boost,
            matk: this.matk + boost,
            mdef: this.mdef + boost,
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

    addExp(amount) { this.exp += amount; if (this.exp >= this.nextExp) { this.levelUp(); return true; } return false; },
    addGold(amount) { this.gold += amount; },
    spendGold(amount) { if (this.gold >= amount) { this.gold -= amount; return true; } return false; },

    applyDefDebuff(amount) {
        this.def = Math.max(0, this.def - amount);
        this.status.defDownVal = (this.status.defDownVal || 0) + amount;
    },
    applyAtkDebuff(amount) {
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
        this.maxHp += 5; this.hp = this.maxHp;
        this.maxMp += 2; this.mp = this.maxMp;
        this.displayMpOffset = 0;
        this.atk += 2; this.def += 1; this.baseDef = this.def;
        this.matk += 2; this.mdef += 1;
        this.exp = 0; this.nextExp = Math.floor(this.nextExp * 1.5);
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

    // 2週目開始時のリセット（ステータス吸収後）
    resetForWeek2() {
        // 現在のステータスを保存（魔王強化用）
        gameLoop.absorbedStats = {
            level: this.level,
            hp: this.maxHp,
            mp: this.maxMp,
            atk: this.atk,
            def: this.def,
            matk: this.matk,
            mdef: this.mdef
        };

        // 初期状態にリセット
        this.level = 1;
        this.hp = 30; this.maxHp = 30;
        this.mp = 10; this.maxMp = 10;
        this.atk = 8; this.def = 4; this.baseDef = 4;
        this.matk = 6; this.mdef = 3;
        this.exp = 0; this.nextExp = 50;
        this.gold = 50;
        this.displayMpOffset = 0;
        this.status = { poisonVal: 0, silence: 0, atkDownVal: 0, defDownVal: 0 };
        this.spells = { fire: false, heal: false, water: false, wind: false };
        this.magicBoost = 1.0;

        // 2週目フラグ
        gameLoop.week = 2;

        // 真実フラグを全て有効に
        truthFlags.status = true;
        truthFlags.command = true;
        truthFlags.map = true;
        truthFlags.weapon = true;
    }
};
