// ===========================================
// 2週目クエストシステム（討伐クエスト）
// ===========================================

import { PlayerStats2 } from './player.js';
import { Msg } from '../core/message.js';

const QuestData2 = {
    // クエストデータをここに記述
    // example:
    // slime_hunt: { id: 'slime_hunt', name: 'スライム退治', ... }
};

export const QuestSystem2 = {
    // 討伐カウント
    killCount: {
        slime: 0,
        goblin: 0,
        bat: 0,
        any: 0  // 全モンスター合計
    },

    // 完了済みクエスト
    completed: {},

    // モンスター討伐を記録
    recordKill(enemyType) {
        // 特定タイプのカウント
        if (this.killCount[enemyType] !== undefined) {
            this.killCount[enemyType]++;
        }
        // 全体カウント
        this.killCount.any++;
    },

    // クエスト進捗確認
    getProgress(questId) {
        const quest = QuestData2[questId];
        if (!quest) return null;

        const current = this.killCount[quest.target] || 0;
        return {
            current,
            required: quest.required,
            isComplete: current >= quest.required,
            isClaimed: this.completed[questId] || false
        };
    },

    // 報酬受け取り
    claimReward(questId) {
        const quest = QuestData2[questId];
        if (!quest) return { success: false, msg: 'クエストが見つからない' };

        const progress = this.getProgress(questId);
        if (!progress.isComplete) {
            return { success: false, msg: 'まだ条件を達成していない' };
        }
        if (progress.isClaimed) {
            return { success: false, msg: '既に報酬を受け取っている' };
        }

        // 報酬付与
        const reward = quest.reward;
        let rewardMsg = [];

        if (reward.gold) {
            PlayerStats2.addGold(reward.gold);
            rewardMsg.push(`${reward.gold}G`);
        }
        if (reward.atk) {
            PlayerStats2.atk += reward.atk;
            rewardMsg.push(`ATK+${reward.atk}`);
        }
        if (reward.def) {
            PlayerStats2.def += reward.def;
            rewardMsg.push(`DEF+${reward.def}`);
        }
        if (reward.mdef) {
            PlayerStats2.mdef += reward.mdef;
            rewardMsg.push(`MDEF+${reward.mdef}`);
        }

        this.completed[questId] = true;

        return {
            success: true,
            msg: `クエスト達成！\n報酬: ${rewardMsg.join(', ')}`
        };
    },

    // 利用可能なクエスト一覧
    getAvailableQuests() {
        return Object.values(QuestData2).map(quest => ({
            ...quest,
            progress: this.getProgress(quest.id)
        }));
    },

    // 離脱した仲間リスト（再加入不可）
    departed: {},

    // 初期化
    init() {
        this.killCount = { slime: 0, goblin: 0, bat: 0, any: 0 };
        this.completed = {};
        this.departed = {};
    }
};
