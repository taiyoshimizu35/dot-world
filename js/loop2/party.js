import { Msg } from '../core/message.js';
import { PlayerStats2 } from './player.js';
import { QuestSystem2 } from './quest.js';
import { PartyMemberData2 } from './data/companions.js';

export const Party2 = {
    members: [],  // 現在のパーティメンバー

    // 仲間追加
    add(memberId) {
        // データ取得
        const data = PartyMemberData2[memberId];
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

    // 戦闘中の自動行動選択 - AI廃止のため削除
    // getAction(member, battle) { ... }

    // パーティ全体のHP回復
    healAll(amount) {
        this.members.forEach(m => {
            m.hp = Math.min(m.maxHp, m.hp + amount);
        });
    },

    // パーティ全体の全回復 (HP/SP/Status)
    fullHealAll() {
        this.members.forEach(m => {
            m.hp = m.maxHp;
            if (m.maxSp) m.sp = m.maxSp;
            // Status reset if members have complex status
        });
    },

    // 初期化
    init() {
        this.members = [];
    }
};
