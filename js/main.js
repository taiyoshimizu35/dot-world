import { GameConfig, GameState } from './constants.js';
import { AssetLoader } from './core/assets.js';
import { Input } from './core/input.js';
import { StateMachine } from './core/state_machine.js';
import { FX } from './core/effects.js';
import { Msg } from './core/message.js';
import { WorldState } from './loop1/world.js';
import { Maps } from './loop1/systems/maps/manager.js';
import { Chests } from './loop1/systems/maps/chests.js';
// SaveSystem import moved to bottom or needed here? 
// It's used at bottom. ES modules hoist imports, so top is better.
import { SaveSystem } from './core/save_system.js';

// States
import { TitleState } from './states/title_state.js';
import { PlayingState } from './states/playing_state.js';
import { MenuState } from './states/menu_state.js';
import { DialogState } from './states/dialog_state.js';
import { BattleState } from './states/battle_state.js';
import { ShopState } from './states/shop_state.js';
import { InnState } from './states/inn_state.js';
import { GameOverState } from './states/gameover_state.js';
import { OpeningState } from './states/opening_state.js';
import { EndingState } from './states/ending_state.js';
import { Loop1EndingState } from './states/loop1_ending_state.js';

class Game {
    constructor() {
        this.cvs = document.getElementById('game-canvas');
        this.ctx = this.cvs.getContext('2d');
        this.baseWidth = GameConfig.VIEWPORT_WIDTH;
        this.baseHeight = GameConfig.VIEWPORT_HEIGHT;
        this.currentScale = GameConfig.SCALE;

        // 初期リサイズ
        this.resize();

        this.player = { x: 0, y: 0, dir: 0, moving: false, anim: 0 };
        this.lastTime = 0;

        // State Machine Initialization
        this.stateMachine = new StateMachine();
        this.initStates();
    }

    initStates() {
        this.stateMachine.add('title', new TitleState(this));
        this.stateMachine.add('playing', new PlayingState(this));
        this.stateMachine.add('menu', new MenuState(this));
        this.stateMachine.add('dialog', new DialogState(this));
        this.stateMachine.add('battle', new BattleState(this));
        this.stateMachine.add('shop', new ShopState(this));
        this.stateMachine.add('inn', new InnState(this));
        this.stateMachine.add('gameover', new GameOverState(this));
        this.stateMachine.add('opening', new OpeningState(this));
        this.stateMachine.add('ending', new EndingState(this));
        this.stateMachine.add('loop1_ending', new Loop1EndingState(this));

        // Default State
        this.stateMachine.change('title');
    }

    resize() {
        // 画面サイズから最適なスケールを計算
        const padding = 60; // 余白
        const availW = window.innerWidth - padding;
        const availH = window.innerHeight - padding;

        // アスペクト比を維持しながら最大サイズを計算
        const scaleX = availW / this.baseWidth;
        const scaleY = availH / this.baseHeight;

        // 整数倍にスナップ（ドット絵ゲームなので）、最低1
        let optimalScale = Math.floor(Math.min(scaleX, scaleY));
        if (optimalScale < 1) optimalScale = 1;

        // スケール更新
        this.currentScale = optimalScale;
        GameConfig.SCALE = optimalScale;

        // キャンバスサイズ更新
        this.cvs.width = this.baseWidth * this.currentScale;
        this.cvs.height = this.baseHeight * this.currentScale;

        // コンテキスト設定をリセット
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // リセット
        this.ctx.scale(this.currentScale, this.currentScale);
        this.ctx.imageSmoothingEnabled = false;
    }

    async init() {
        console.log("Game Init Started");
        try {
            console.log("Loading Assets...");
            await AssetLoader.loadAll();
            console.log("Assets Loaded");
        } catch (e) {
            console.error("Asset Load Failed", e);
        }

        Input.init();
        Maps.init();
        Chests.init();

        // Ensure managers are initialized (Week 1 default)
        if (!WorldState.managers.player) WorldState.reset();

        const start = Maps.get().start;
        console.log("Start Log:", start, "TileSize:", GameConfig.TILE_SIZE);
        if (!start) console.error("Start position missing!");

        this.player.x = start.x * GameConfig.TILE_SIZE;
        this.player.y = start.y * GameConfig.TILE_SIZE;
        console.log("Player Initialized at:", this.player);

        this.player.dir = 0;

        // ウィンドウリサイズ時の処理
        window.addEventListener('resize', () => this.resize());

        console.log("Starting Loop");
        // Start Loop
        requestAnimationFrame(t => this.loop(t));
    }

    loop(t) {
        requestAnimationFrame(t => this.loop(t));
        this.lastTime = t;

        this.update();
        this.draw();
    }

    update() {
        this.stateMachine.update();
        FX.update();
    }

    draw() {
        this.stateMachine.draw(this.ctx);
        FX.render(this.ctx); // FX overlay
        Msg.render(this.ctx); // Global Msg overlay (must be on top of FX)
    }
}

const game = new Game();
// window.game = game; // REFACTORED: Removed global access
WorldState.registerGame(game);
Msg.init(game);
FX.init(game);
SaveSystem.init(game);

window.onload = () => game.init();
