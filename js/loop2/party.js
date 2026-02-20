import { Msg } from '../core/message.js';
import { PlayerStats2 } from './player.js';
import { QuestSystem2 } from './quest.js';
import { PartyMemberData2 } from './data/companions.js';
import { LevelSystem } from './systems/level.js';

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
            level: 1,
            exp: 0,
            nextExp: LevelSystem.getNextExp(1),
            // 初期スキルは data.initialSkills からコピーするか、LevelSystemで管理するかだが
            // データ側で持っているのでそのままコピーされる
            // hiddenExp: 0 // Old system
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
            // 安全策: プロパティ初期化
            if (member.level === undefined) member.level = 1;
            if (member.exp === undefined) member.exp = 0;
            if (member.nextExp === undefined) member.nextExp = LevelSystem.getNextExp(member.level);

            LevelSystem.addExp(member, amount);
        });
    },

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
            m.status = {};
            m.buffs = {};
        });
    },

    // 初期化
    init() {
        this.members = [];
    }
};
