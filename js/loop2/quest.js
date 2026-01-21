// ===========================================
// 2週目クエストシステム（討伐クエスト）
// ===========================================

const QuestData2 = {
    slime_hunt: {
        id: 'slime_hunt',
        name: 'スライム退治',
        desc: 'スライムを10体討伐せよ',
        target: 'slime',
        required: 10,
        reward: { gold: 100 }
    },
    goblin_hunt: {
        id: 'goblin_hunt',
        name: 'ゴブリン狩り',
        desc: 'ゴブリンを10体討伐せよ',
        target: 'goblin',
        required: 10,
        reward: { gold: 200 }
    },
    bat_hunt: {
        id: 'bat_hunt',
        name: 'コウモリ駆除',
        desc: 'コウモリを15体討伐せよ',
        target: 'bat',
        required: 15,
        reward: { gold: 150 }
    },
    monster_slayer: {
        id: 'monster_slayer',
        name: '魔物掃討',
        desc: '任意のモンスターを50体討伐せよ',
        target: 'any',
        required: 50,
        reward: { atk: 3, gold: 300 }
    },
    veteran: {
        id: 'veteran',
        name: '熟練の証',
        desc: '任意のモンスターを100体討伐せよ',
        target: 'any',
        required: 100,
        reward: { def: 3, mdef: 3, gold: 500 }
    }
};

const QuestSystem2 = {
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

    // 初期化
    init() {
        this.killCount = { slime: 0, goblin: 0, bat: 0, any: 0 };
        this.completed = {};
    }
};
