// ===========================================
// クエストフラグ
// ===========================================
const QuestFlags = {
    // 旧フラグ（互換性維持）
    hasSword: false,
    gateOpen: false,
    bossDefeated: false,
    guardMoved: false,
    hasAmulet: false,
    westGateOpen: false,
    westGuardMoved: false,
    westBossDefeated: false,
    northGateOpen: false,
    southGateOpen: false,
    phantomTruthRevealed: false,

    // ===== 新ストーリー進行フラグ =====
    // 嘘ボス撃破状況
    fakeBosses: { east: false, west: false, north: false, south: false },

    // 西ダンジョンスイッチ
    westSwitches: { stage1: false, stage2: false },

    // 北エリア中ボス (reset when returning to village)
    northMinibosses: { stage1: false, stage2: false, stage3: false },

    resetNorthMinibosses() {
        this.northMinibosses.stage1 = false;
        this.northMinibosses.stage2 = false;
        this.northMinibosses.stage3 = false;
    },


    // 嘘魔王と対面したか
    metFakeDemonKing: false,

    // 真ボス撃破状況
    trueBosses: { east: false, west: false, north: false, south: false },

    // 真魔王に挑戦可能か
    canFaceTrueDemonKing: false,

    // 全嘘ボス撃破済みか
    allFakeBossesDefeated() {
        return this.fakeBosses.east && this.fakeBosses.west &&
            this.fakeBosses.north && this.fakeBosses.south;
    },

    // 全真ボス撃破済みか
    allTrueBossesDefeated() {
        return this.trueBosses.east && this.trueBosses.west &&
            this.trueBosses.north && this.trueBosses.south;
    },

    // 撃破済みの Loop 1 ボス数（嘘ボス）
    countDefeatedBosses() {
        return Object.values(this.fakeBosses).filter(b => b).length;
    },

    check() {
        this.gateOpen = this.hasSword || PlayerStats.level >= 3;
        this.westGateOpen = this.hasAmulet || PlayerStats.level >= 6;

        // 真魔王挑戦条件チェック
        if (this.allTrueBossesDefeated()) {
            this.canFaceTrueDemonKing = true;
        }
    },

    // 2週目開始時のリセット
    reset() {
        this.hasSword = false;
        this.gateOpen = false;
        this.bossDefeated = false;
        this.guardMoved = false;
        this.hasAmulet = false;
        this.westGateOpen = false;
        this.westGuardMoved = false;
        this.westBossDefeated = false;
        this.northGateOpen = false;
        this.southGateOpen = false;
        this.phantomTruthRevealed = false;
        this.fakeBosses = { east: false, west: false, north: false, south: false };
        this.westSwitches = { stage1: false, stage2: false };
        this.metFakeDemonKing = true; // 2週目開始時は嘘魔王遭遇済み
        this.trueBosses = { east: false, west: false, north: false, south: false };
        this.northMinibosses = { stage1: false, stage2: false, stage3: false };
        this.canFaceTrueDemonKing = false;
    }
};
