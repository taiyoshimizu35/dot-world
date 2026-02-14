import { Msg } from '../core/message.js';
import { PlayerStats } from './player.js';
import { Inventory as Inv } from './inventory.js';
import { Battle } from './systems/battle/core.js';
import { Inn } from './systems/inn.js';
import { Menu } from './systems/menu.js';
import { Shop } from './systems/shop.js';
import { QuestSystem } from './quest.js';

// ...

// 初期化

import { PlayerStats2 } from '../loop2/player.js';
import { Party2 } from '../loop2/party.js';
import { Battle2 } from '../loop2/systems/battle/core.js';
import { WorldState2 } from '../loop2/world.js';
// import { Menu2 } from '../loop2/systems/menu.js'; // Circular dependency if imported here. Imported in Loop1Ending.

import { PlayerController } from '../systems/player_controller.js';
import { PlayerController2 } from '../loop2/systems/player_controller.js';
import { Maps } from './systems/maps/manager.js';
import { InteractionSystem } from './systems/interaction.js';
import { InteractionSystem2 } from '../loop2/systems/interaction.js';

// ===========================================
// ワールドステート
// ===========================================
export const WorldState = {
    week: 1,

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
        console.log("Starting Loop 2 (Week 2)...");

        // Loop 2 Systems Initialization
        WorldState2.init();
        // PlayerStats2.init(); // Already called in WorldState2.init()? Let's check. 
        // WorldState2.init() calls PlayerStats2.init(), Party2.init(), QuestSystem2.init()
        // So we can remove explicit calls if we use WorldState2.init()

        Battle2.init(this);

        // Manager Swap
        this.managers.player = PlayerStats2;
        this.managers.party = Party2;
        this.managers.battle = Battle2;
        this.managers.controllerClass = PlayerController2;
        this.managers.interaction = new InteractionSystem2(this);
        // Menu is swapped in Loop1Ending.js, but good to be safe implies relying on caller or doing it here.
        // Loop1Ending does: WorldState.managers.menu = Menu2;

        console.log("Loop 2 Managers initialized.");
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