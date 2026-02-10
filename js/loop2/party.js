const Party2 = {
    members: [],  // 現在のパーティメンバー

    // 仲間追加
    add(memberId) {
        // データ取得
        // Note: PartyMemberData2 is defined in data/companions.js (which has been reset/deleted).
        // User must create data/companions.js to use this.
        const data = window.PartyMemberData2 ? window.PartyMemberData2[memberId] : null;
        if (!data) return false;

        // すでに仲間にいる
        if (this.members.find(m => m.id === memberId)) return false;

        // 一度別れた仲間は再加入不可
        if (QuestSystem2.departed && QuestSystem2.departed[memberId]) {
            Msg.show('「ごめん、もう一緒には行けないよ…」');
            return false;
        }

        // 3人制限
        if (this.members.length >= 3) {
            Msg.show('パーティがいっぱいです。（最大3人）\n誰かと別れる必要があります。');
            return false;
        }

        this.members.push({
            ...data,
            hiddenExp: 0
        });
        return true;
    },

    // 仲間と別れる
    remove(memberId) {
        const idx = this.members.findIndex(m => m.id === memberId);
        if (idx === -1) return false;

        // 別れフラグを立てる
        if (QuestSystem2.departed) {
            QuestSystem2.departed[memberId] = true;
        }

        this.members.splice(idx, 1);
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
