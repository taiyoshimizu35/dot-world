// ===========================================
// 仲間（パーティ）システム
// ===========================================

// 仲間キャラクターデータ定義
const PartyMemberData = {
    alex: {
        id: 'alex',
        name: 'アレックス',
        class: '騎士',
        img: 'ally_alex',
        // 基本ステータス
        baseHp: 40,
        baseMp: 5,
        baseAtk: 12,
        baseDef: 8,
        baseMatk: 3,
        baseMdef: 5,
        // 成長率（レベルアップ時の増加量）
        growthHp: 6,
        growthMp: 1,
        growthAtk: 3,
        growthDef: 2,
        // スキル
        skills: ['attack', 'guard'],  // 攻撃、かばう
        // AI行動パターン
        aiPattern: 'physical',  // 物理攻撃重視
        description: '元王国騎士。正義感が強く、仲間を守ることを第一に考える。'
    },

    rose: {
        id: 'rose',
        name: 'ローズ',
        class: '魔術師',
        img: 'ally_rose',
        baseHp: 25,
        baseMp: 20,
        baseAtk: 5,
        baseDef: 4,
        baseMatk: 14,
        baseMdef: 8,
        growthHp: 3,
        growthMp: 4,
        growthAtk: 1,
        growthDef: 1,
        skills: ['attack', 'fire', 'water', 'wind'],
        aiPattern: 'magic',  // 魔法攻撃重視
        description: '放浪の魔術師。クールだが仲間想い。'
    },

    milia: {
        id: 'milia',
        name: 'ミリア',
        class: '僧侶',
        img: 'ally_milia',
        baseHp: 30,
        baseMp: 18,
        baseAtk: 6,
        baseDef: 5,
        baseMatk: 10,
        baseMdef: 10,
        growthHp: 4,
        growthMp: 3,
        growthAtk: 1,
        growthDef: 2,
        skills: ['attack', 'heal', 'cure'],  // 回復、状態異常治療
        aiPattern: 'healer',  // 回復重視
        description: '旅の僧侶。優しい性格で、傷ついた人を放っておけない。'
    }
};

// パーティ管理
const Party = {
    members: [],  // 現在のパーティメンバー（実体）
    maxSize: 3,

    // パーティにメンバーを追加
    add(memberId) {
        if (this.members.length >= this.maxSize) return false;
        if (this.members.find(m => m.id === memberId)) return false;

        const data = PartyMemberData[memberId];
        if (!data) return false;

        const member = this.createMember(data, PlayerStats.level);
        this.members.push(member);
        return true;
    },

    // メンバー実体を生成
    createMember(data, level) {
        const lvBonus = level - 1;
        return {
            id: data.id,
            name: data.name,
            class: data.class,
            img: data.img,
            level: level,
            hp: data.baseHp + (data.growthHp * lvBonus),
            maxHp: data.baseHp + (data.growthHp * lvBonus),
            mp: data.baseMp + (data.growthMp * lvBonus),
            maxMp: data.baseMp + (data.growthMp * lvBonus),
            atk: data.baseAtk + (data.growthAtk * lvBonus),
            def: data.baseDef + (data.growthDef * lvBonus),
            matk: data.baseMatk + Math.floor(lvBonus * 1.5),
            mdef: data.baseMdef + lvBonus,
            skills: [...data.skills],
            aiPattern: data.aiPattern,
            isAlive: true,
            status: { poisonVal: 0, silence: 0 }
        };
    },

    // メンバーを削除
    remove(memberId) {
        this.members = this.members.filter(m => m.id !== memberId);
    },

    // パーティをクリア
    clear() {
        this.members = [];
    },

    // 生存メンバーを取得
    getAlive() {
        return this.members.filter(m => m.isAlive && m.hp > 0);
    },

    // 全員HP回復
    fullRestore() {
        for (const m of this.members) {
            m.hp = m.maxHp;
            m.mp = m.maxMp;
            m.isAlive = true;
            m.status = { poisonVal: 0, silence: 0 };
        }
    },

    // レベルアップ処理（プレイヤーに連動）
    syncLevel(newLevel) {
        for (const m of this.members) {
            const data = PartyMemberData[m.id];
            if (!data) continue;

            const lvBonus = newLevel - 1;
            m.level = newLevel;
            m.maxHp = data.baseHp + (data.growthHp * lvBonus);
            m.maxMp = data.baseMp + (data.growthMp * lvBonus);
            m.atk = data.baseAtk + (data.growthAtk * lvBonus);
            m.def = data.baseDef + (data.growthDef * lvBonus);
            m.matk = data.baseMatk + Math.floor(lvBonus * 1.5);
            m.mdef = data.baseMdef + lvBonus;
            // 戦闘中でなければ全回復
            if (currentState !== GameState.BATTLE) {
                m.hp = m.maxHp;
                m.mp = m.maxMp;
            }
        }
    },

    // 2週目リセット
    resetForWeek2() {
        this.clear();
        // 2週目専用の仲間加入フラグはQuestFlagsで管理
    }
};

// 仲間AI行動決定
const PartyAI = {
    // 行動を決定
    decideAction(member, battle) {
        const pattern = member.aiPattern;

        // HP低下時は回復優先（healerパターン）
        if (pattern === 'healer') {
            return this.healerAI(member, battle);
        } else if (pattern === 'magic') {
            return this.magicAI(member, battle);
        } else {
            return this.physicalAI(member, battle);
        }
    },

    // 物理型AI
    physicalAI(member, battle) {
        // 20%の確率でかばう（味方のHPが低い時）
        if (member.skills.includes('guard')) {
            const lowHpAlly = Party.getAlive().find(m => m.hp < m.maxHp * 0.3 && m.id !== member.id);
            if (lowHpAlly && Math.random() < 0.2) {
                return { type: 'guard', target: lowHpAlly };
            }
        }
        return { type: 'attack', target: battle.enemy };
    },

    // 魔法型AI
    magicAI(member, battle) {
        // MPがあれば魔法攻撃
        if (member.mp >= 5 && member.status.silence === 0) {
            const spells = member.skills.filter(s => ['fire', 'water', 'wind'].includes(s));
            if (spells.length > 0) {
                const spell = spells[Math.floor(Math.random() * spells.length)];
                return { type: 'magic', spell: spell, target: battle.enemy };
            }
        }
        return { type: 'attack', target: battle.enemy };
    },

    // 回復型AI
    healerAI(member, battle) {
        // プレイヤーまたは仲間のHP回復
        if (member.mp >= 4 && member.status.silence === 0) {
            // プレイヤーのHP確認
            if (PlayerStats.hp < PlayerStats.maxHp * 0.5) {
                return { type: 'heal', target: 'player' };
            }
            // 仲間のHP確認
            const lowHpAlly = Party.getAlive().find(m => m.hp < m.maxHp * 0.5);
            if (lowHpAlly) {
                return { type: 'heal', target: lowHpAlly };
            }
        }
        return { type: 'attack', target: battle.enemy };
    }
};
