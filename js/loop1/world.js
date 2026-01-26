// ===========================================
// ワールドステート - 週管理と真実フラグの統一管理
// ===========================================

// ゲームループ管理（1週目/2週目）
const WorldState = {
    week: 1,              // 1 or 2
    absorbedStats: null,  // 吸収されたステータス（2週目魔王強化用）
    holySwordOwned: false,  // 聖剣所持
    holySwordStolen: false, // 聖剣が魔剣として奪われた

    // 真実フラグ - falseの間、各種偽装が有効
    truthFlags: {
        status: false,   // ステータスの嘘（Lv×3下駄）
        command: false,  // コマンドの嘘（防御=挑発、属性ずらし）
        map: false,      // マップの嘘（1本道、高経験値）
        weapon: false    // 武器の嘘（聖剣→魔剣）
    },

    // マネージャーレジストリ（現在のアクティブなシステム）
    managers: {
        player: null,
        party: null,
        inventory: null,
        battle: null
    },

    // 魔除け薬の効果
    charmSteps: 0,
    stepsUntilEncounter: 0, // 次のエンカウントまでの歩数

    useCharm() {
        this.charmSteps = 600;
        Msg.show('魔除け薬を使った！\nしばらくの間、敵が出にくくなる。');
    },
    decrementCharm() {
        if (this.charmSteps > 0) {
            this.charmSteps--;
            if (this.charmSteps === 0) Msg.show('魔除け薬の効果が切れた。');
        }
    },

    // エンカウント歩数のリセット（再計算）
    resetEncounterSteps(rate) {
        if (rate <= 0) {
            this.stepsUntilEncounter = Infinity;
            return;
        }

        // 基本歩数 = 1 / 確率 (例: 0.05 -> 20歩)
        let baseSteps = Math.ceil(1 / rate);

        // ランダム分散 (0.8 ~ 1.2倍)
        baseSteps = Math.floor(baseSteps * (0.8 + Math.random() * 0.4));

        // 魔除け効果中なら3倍
        if (this.charmSteps > 0) {
            baseSteps *= 3;
        }

        this.stepsUntilEncounter = baseSteps;
        // console.log(`Next encounter in ${this.stepsUntilEncounter} steps (Rate: ${rate}, Charmed: ${this.charmSteps > 0})`);
    },

    // ヘルパーメソッド
    isWeek1() {
        return this.week === 1;
    },

    isWeek2() {
        return this.week === 2;
    },

    // 2週目へ移行する時の処理
    startWeek2(playerStats) {
        // 現在のステータスを保存（魔王強化用）
        this.absorbedStats = {
            level: playerStats.level,
            hp: playerStats.maxHp,
            mp: playerStats.maxMp,
            atk: playerStats.atk,
            def: playerStats.def,
            matk: playerStats.matk,
            mdef: playerStats.mdef
        };

        // 2週目フラグ
        this.week = 2;

        // 真実フラグを全て有効に
        this.truthFlags.status = true;
        this.truthFlags.command = true;
        this.truthFlags.map = true;
        this.truthFlags.weapon = true;

        // マネージャー切り替え
        this.managers.player = PlayerStats2;
        this.managers.party = Party2;
        this.managers.inventory = null; // 2週目はインベントリなし（または別途実装）
        this.managers.battle = Battle2;
        this.managers.menu = null; // Loop 2 Menu (TBD)
        this.managers.shop = null; // Loop 2 Shop (TBD)
        this.managers.inn = null; // Loop 2 Inn (TBD)
        this.managers.controllerClass = PlayerController; // Shared or PlayerController2

        // システム初期化
        if (this.managers.party) this.managers.party.init();
        if (this.managers.player) this.managers.player.init();
        if (window.Maps && window.Maps.initWeek2) window.Maps.initWeek2();
    },

    // 初期化（ニューゲーム時）
    reset() {
        this.week = 1;
        this.absorbedStats = null;
        this.holySwordOwned = false;
        this.holySwordStolen = false;
        this.truthFlags = {
            status: false,
            command: false,
            map: false,
            weapon: false
        };

        // マネージャー初期化（1週目）
        this.managers.player = PlayerStats;
        this.managers.party = null; // 1週目は仲間なし
        this.managers.inventory = Inv;
        this.managers.battle = Battle;
        // Loop 2 Abstraction
        this.managers.menu = Menu;
        this.managers.shop = Shop;
        this.managers.inn = Inn;
        this.managers.controllerClass = PlayerController;
    }
};

// 後方互換性のためのエイリアス
// 後方互換性のためのエイリアス
const gameLoop = WorldState;
const truthFlags = WorldState.truthFlags;

// グローバル公開
window.WorldState = WorldState;
window.gameLoop = gameLoop;
window.truthFlags = truthFlags;