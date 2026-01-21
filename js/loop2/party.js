// ===========================================
// 2週目仲間システム
// ===========================================

const PartyMemberData2 = {
    alex: {
        id: 'alex',
        name: 'アレックス',
        hp: 40, maxHp: 40,
        mp: 5, maxMp: 5,
        atk: 12, def: 6,
        matk: 3, mdef: 4,
        type: 'physical',  // 物理特化
        skills: ['強撃', '守護'],
        joinCondition: null  // 村で話すだけ
    },
    rose: {
        id: 'rose',
        name: 'ローズ',
        hp: 25, maxHp: 25,
        mp: 20, maxMp: 20,
        atk: 5, def: 3,
        matk: 15, mdef: 8,
        type: 'magic',  // 魔法特化
        skills: ['ファイア', 'ブリザド'],
        joinCondition: 'east'  // 東ボス撃破後
    },
    milia: {
        id: 'milia',
        name: 'ミリア',
        hp: 30, maxHp: 30,
        mp: 15, maxMp: 15,
        atk: 6, def: 4,
        matk: 10, mdef: 10,
        type: 'healer',  // 回復特化
        skills: ['ヒール', 'プロテク'],
        joinCondition: 'west'  // 西ボス撃破後
    }
};

const Party2 = {
    members: [],  // 現在のパーティメンバー

    // 仲間追加
    add(memberId) {
        const data = PartyMemberData2[memberId];
        if (!data) return false;
        if (this.members.find(m => m.id === memberId)) return false;

        this.members.push({
            ...data,
            hiddenExp: 0
        });
        return true;
    },

    // 仲間のステータス成長
    addExpToAll(amount) {
        this.members.forEach(member => {
            member.hiddenExp += amount;
            while (member.hiddenExp >= 150) {
                member.hiddenExp -= 150;
                member.maxHp += 2;
                member.atk += 1;
                member.def += 1;
            }
        });
    },

    // 戦闘中の自動行動選択
    getAction(member, battle) {
        if (member.type === 'healer') {
            // 回復役：HPが低い味方がいたら回復
            if (PlayerStats2.hp < PlayerStats2.maxHp * 0.4) {
                return { type: 'heal', target: 'player', power: 15 };
            }
        }
        if (member.type === 'magic') {
            // 魔法役：魔法攻撃
            if (member.mp >= 5) {
                return { type: 'magic', power: member.matk * 2 };
            }
        }
        // 物理役・その他：通常攻撃
        return { type: 'attack', power: member.atk };
    },

    // パーティ全体のHP回復
    healAll(amount) {
        this.members.forEach(m => {
            m.hp = Math.min(m.maxHp, m.hp + amount);
        });
    },

    // 初期化
    init() {
        this.members = [];
    }
};
