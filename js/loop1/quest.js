// ===========================================
// クエストフラグ
// ===========================================
export const QuestSystem = {
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
    // ボス撃破状況
    bosses: { east: false, west: false, north: false, south: false },

    // 西ダンジョンスイッチ
    westSwitches: { stage1: false, stage2: false },

    // 持続的なドアの状態
    doors: {},

    // 北エリア中ボス
    northMinibosses: { stage1: false, stage2: false, stage3: false },

    resetNorthMinibosses() {
        this.northMinibosses.stage1 = false;
        this.northMinibosses.stage2 = false;
        this.northMinibosses.stage3 = false;
    },

    // 全ボス撃破済みか
    allBossesDefeated() {
        return this.bosses.east && this.bosses.west &&
            this.bosses.north && this.bosses.south;
    },

    // 撃破済みの Loop 1 ボス数
    countDefeatedBosses() {
        return Object.values(this.bosses).filter(b => b).length;
    },

    player: null,
    init(player) {
        this.player = player;
    },

    check() {
        // Safe check if player is not initialized yet
        const level = this.player ? this.player.level : 1;
        this.gateOpen = this.hasSword || level >= 3;
        this.westGateOpen = this.hasAmulet || level >= 6;
    },

    // 初期化
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
        this.bosses = { east: false, west: false, north: false, south: false };
        this.westSwitches = { stage1: false, stage2: false };
        this.doors = {};
        this.northMinibosses = { stage1: false, stage2: false, stage3: false };
    }
};

export const QuestFlags = QuestSystem;
