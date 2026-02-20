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

        // 4人制限 (勇者+4人=5人パーティ)
        if (this.members.length >= 4) {
            Msg.show('パーティがいっぱいです。（最大4人）\n誰かと別れる必要があります。');
            return false;
        }

        this.members.push({
            ...data,
            hiddenExp: 0
        });
        return true;
    },

    // メンバーかどうか確認
    isMember(memberId) {
        return this.members.some(m => m.id === memberId);
    },

    // 仲間と別れる
    remove(memberId) {
        const idx = this.members.findIndex(m => m.id === memberId);
        if (idx === -1) return false;

        // 固定メンバーは外せない
        if (this.members[idx].fixed) {
            Msg.show('「...離れるわけにはいきません。」');
            return false;
        }

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
            // 簡易レベルアップ仮定 (150expで1レベル相当アップ)
            while (member.hiddenExp >= 150) {
                member.hiddenExp -= 150;

                // 成長タイプによるステータス上昇
                const type = member.growthType || 'balanced';

                // HP
                let hpUp = 2;
                if (type === 'warrior' || type === 'tank') hpUp = 4;
                if (type === 'mage' || type === 'cleric') hpUp = 1;

                // SP
                let spUp = 1;
                if (type === 'mage' || type === 'cleric' || type === 'special') spUp = 3;

                // ATK
                let atkUp = 1;
                if (type === 'warrior' || type === 'monk' || type === 'physical_dex') atkUp = 2;
                if (type === 'mage' || type === 'cleric') atkUp = 0;

                // DEF
                let defUp = 1;
                if (type === 'tank') defUp = 2;

                // MATK
                let matkUp = 1;
                if (type === 'mage' || type === 'special' || type === 'cleric') matkUp = 2;
                if (type === 'warrior' || type === 'tank') matkUp = 0;

                // MDEF
                let mdefUp = 1;
                if (type === 'cleric' || type === 'mage') mdefUp = 2;

                member.maxHp += hpUp;
                member.hp += hpUp; // 全快させるかはゲームバランス次第だが、最大値増えた分は増やす
                member.maxSp += spUp;
                member.sp += spUp;
                member.atk += atkUp;
                member.def += defUp;
                member.matk += matkUp;
                member.mdef += mdefUp;
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
