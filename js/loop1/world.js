import { Msg } from '../core/message.js';
import { PlayerStats } from './player.js';
import { Inventory as Inv } from './inventory.js';
import { Battle } from './systems/battle/core.js';
import { Inn } from './systems/inn.js';
import { Menu } from './systems/menu.js';
import { Shop } from './systems/shop.js';
import { QuestSystem } from './quest.js';

// Loop 2 Systems (Data only)
import { PlayerStats2 } from '../loop2/player.js';
import { Party2 } from '../loop2/party.js';
import { Battle2 } from '../loop2/systems/battle/core.js';
import { QuestSystem2 } from '../loop2/quest.js';


import { PlayerController } from '../systems/player_controller.js';
// import { PlayerController2 } from '../loop2/systems/player_controller.js'; // REMOVED (Will use unified Controller)
import { Maps } from './systems/maps/manager.js';
import { InteractionSystem } from './systems/interaction.js';
import { InteractionSystem2 } from '../loop2/systems/interaction.js';
import { WorldMap } from '../loop2/systems/world_map.js'; // Import World Map

// ===========================================
// ワールドステート (Unified)
// ===========================================
export const WorldState = {
    week: 1,

    // Loop 2 Specific State (formerly WorldState2)
    world2: {
        trueBosses: { east: false, west: false, north: false, south: false },
        trueDemonKingDefeated: false,
        active: false // Flag if Loop 2 system is active (redundant with week=2 but good for logic)
    },

    // マネージャーレジストリ
    managers: {
        player: null,
        party: null,
        inventory: null,
        battle: null
    },

    // 魔除け薬の効果
    charmSteps: 0,
    stepsUntilEncounter: 0,

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

    // エンカウント歩数のリセット
    resetEncounterSteps(rate) {
        if (rate === undefined || rate <= 0) {
            this.stepsUntilEncounter = Infinity;
            return;
        }
        let baseSteps = Math.ceil(1 / rate);
        baseSteps = Math.floor(baseSteps * (0.8 + Math.random() * 0.4));
        if (this.charmSteps > 0) baseSteps *= 3;
        this.stepsUntilEncounter = baseSteps;
    },

    // 初期化
    reset() {
        this.week = 1;

        // マネージャー初期化
        this.managers.player = PlayerStats;
        PlayerStats.init(this);
        this.managers.party = null;
        this.managers.inventory = Inv;
        this.managers.battle = Battle;
        Battle.init(this);
        this.managers.menu = Menu;
        Menu.init(this);
        this.managers.shop = Shop;
        Shop.init(this);
        this.managers.inn = Inn;
        this.managers.controllerClass = PlayerController;
        this.managers.interaction = new InteractionSystem(this);

        this.managers.quest = QuestSystem;
        QuestSystem.init(PlayerStats);
        QuestSystem.reset();

        if (Maps && Maps.init) Maps.init();
    },

    // 2週目開始処理
    startWeek2(loop1PlayerStats) {
        this.week = 2;
        this.world2.active = true;
        console.log("Starting Loop 2 (Week 2)...");

        // Loop 2 Systems Initialization
        // WorldState2.init(); // REMOVED

        // Init properties (from WorldState2.init)
        this.world2.trueBosses = { east: false, west: false, north: false, south: false };
        this.world2.trueDemonKingDefeated = false;

        PlayerStats2.init();
        Party2.init();
        QuestSystem2.init();

        Battle2.init(this);

        // Manager Swap
        this.managers.player = PlayerStats2;
        this.managers.party = Party2;
        this.managers.battle = Battle2;
        this.managers.controllerClass = PlayerController; // Use Unified Controller
        this.managers.interaction = new InteractionSystem2(this);

        console.log("Loop 2 Managers initialized.");

        // Map Load (Center) via Unified Maps
        // Maps.load('center') will be called by Loop1Ending or here?
        // Let's call it here to be safe and ensure data is loaded.
        Maps.load('center');
    },

    // Game Instance Registry
    game: null,
    registerGame(game) {
        this.game = game;
    },

    changeState(state, params) {
        if (this.game && this.game.stateMachine) {
            this.game.stateMachine.change(state, params);
        }
    }
};

// グローバル公開
// グローバル公開廃止
// window.WorldState = WorldState;
// window.gameLoop = WorldState;
// window.truthFlags = {}; // Stub logic removed