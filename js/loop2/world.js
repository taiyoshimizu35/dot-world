// ===========================================
// 2週目ワールド状態
// ===========================================

const WorldState2 = {
    // 真ボス撃破状況
    trueBosses: { east: false, west: false, north: false, south: false },

    // 真魔王撃破
    trueDemonKingDefeated: false,

    // 全真ボス撃破チェック
    allTrueBossesDefeated() {
        return this.trueBosses.east && this.trueBosses.west &&
            this.trueBosses.north && this.trueBosses.south;
    },

    // 初期化
    init() {
        this.trueBosses = { east: false, west: false, north: false, south: false };
        this.trueDemonKingDefeated = false;

        // 各システム初期化
        PlayerStats2.init();
        Party2.init();
        QuestSystem2.init();
    }
};
