// ===========================================
// 2週目プレイヤー（内部exp成長システム）
// ===========================================

const PlayerStats2 = {
    name: '勇者',
    hp: 30, maxHp: 30,
    mp: 10, maxMp: 10,
    atk: 8, def: 4,
    matk: 6, mdef: 3,
    baseDef: 4,
    gold: 50,

    // 内部経験値（プレイヤーには非表示）
    hiddenExp: 0,

    // 装備武器
    weapon: null,

    spells: { fire: false, heal: false, water: false, wind: false },
    status: { poisonVal: 0, silence: 0, atkDownVal: 0, defDownVal: 0 },
    magicBoost: 1.0,
    isDefending: false,

    // 表示用ステータス取得（2週目はレベル非表示）
    getDisplayStats() {
        const weaponAtk = this.weapon ? this.weapon.atk : 0;
        return {
            hp: this.hp,
            maxHp: this.maxHp,
            mp: this.mp,
            maxMp: this.maxMp,
            atk: this.atk + weaponAtk,
            def: this.def,
            matk: this.matk,
            mdef: this.mdef,
            gold: this.gold,
            name: this.name
            // レベル・経験値は表示しない
        };
    },

    // 内部経験値を加算し、閾値到達でステータス成長
    addHiddenExp(amount) {
        this.hiddenExp += amount;
        let grew = false;
        // 100ごとにステータス成長
        while (this.hiddenExp >= 100) {
            this.hiddenExp -= 100;
            this.maxHp += 2;
            this.maxMp += 1;
            this.atk += 1;
            this.def += 1;
            this.matk += 1;
            this.mdef += 1;
            grew = true;
        }
        return grew;
    },

    // 戦闘でのダメージ処理
    takeDamage(dmg) {
        this.hp = Math.max(0, this.hp - dmg);
        return this.hp <= 0;
    },

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    },

    healMp(amount) {
        this.mp = Math.min(this.maxMp, this.mp + amount);
    },

    fullHealMp() {
        this.mp = this.maxMp;
    },

    useMp(amount) {
        if (this.mp >= amount) {
            this.mp -= amount;
            return true;
        }
        return false;
    },

    hasSufficientMp(amount) {
        return this.mp >= amount;
    },

    addGold(amount) { this.gold += amount; },

    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        return false;
    },

    // 武器装備
    equipWeapon(weapon) {
        this.weapon = weapon;
    },

    // 実際の攻撃力（ステータス + 武器）
    getTotalAtk() {
        return this.atk + (this.weapon ? this.weapon.atk : 0);
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
        this.mp = this.maxMp;
        this.status = { poisonVal: 0, silence: 0, atkDownVal: 0, defDownVal: 0 };
    },

    // 2週目初期化
    init() {
        this.hp = 30; this.maxHp = 30;
        this.mp = 10; this.maxMp = 10;
        this.atk = 8; this.def = 4; this.baseDef = 4;
        this.matk = 6; this.mdef = 3;
        this.gold = 50;
        this.hiddenExp = 0;
        this.weapon = null;
        this.status = { poisonVal: 0, silence: 0, atkDownVal: 0, defDownVal: 0 };
        this.spells = { fire: false, heal: false, water: false, wind: false };
        this.magicBoost = 1.0;
    }
};