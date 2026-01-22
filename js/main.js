// Imports removed for global script compatibility
// State classes are now loaded via index.html globals

// ===========================================
// メインゲームクラス
// ===========================================

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
        await AssetLoader.loadAll();
        Input.init();
        Maps.init();
        Chests.init();

        // Ensure managers are initialized (Week 1 default)
        if (!WorldState.managers.player) WorldState.reset();

        const start = Maps.get().start;
        this.player.x = start.x * GameConfig.TILE_SIZE;
        this.player.y = start.y * GameConfig.TILE_SIZE;
        this.player.dir = 0;

        // ウィンドウリサイズ時の処理
        window.addEventListener('resize', () => this.resize());

        requestAnimationFrame(t => this.loop(t));
    }

    loop(t) {
        requestAnimationFrame(t => this.loop(t));
        this.lastTime = t;

        this.update();
        this.draw();

        FX.update();
    }

    update() {
        // Global Systems checks (can be moved to states later)
        // Check for Global State changes triggered by non-state systems
        this.checkGlobalStateTransitions();

        this.stateMachine.update();
        FX.update();
    }

    draw() {
        this.stateMachine.draw(this.ctx);
        FX.render(this.ctx); // FX overlay
        Msg.render(this.ctx); // Global Msg overlay (must be on top of FX)
    }

    checkGlobalStateTransitions() {
        // Compatibility: Check if `currentState` changed externally (e.g. by legacy systems)
        // and sync StateMachine. 
        // NOTE: This is a temporary bridge. ideally systems should call game.stateMachine.change

        // Map legacy GameStates to StateMachine keys
        const map = {
            [GameState.TITLE]: 'title',
            [GameState.PLAYING]: 'playing',
            [GameState.MENU]: 'menu',
            [GameState.DIALOG]: 'dialog',
            [GameState.BATTLE]: 'battle',
            [GameState.SHOP]: 'shop',
            [GameState.INN]: 'inn',
            [GameState.GAMEOVER]: 'gameover',
            [GameState.OPENING]: 'opening',
            [GameState.ENDING]: 'ending',
            [GameState.LOOP1_ENDING]: 'loop1_ending'
        };

        const targetState = map[currentState];
        if (targetState && targetState !== this.stateMachine.currentName) {
            // External change detected (e.g. from Msg.show, Menu.open)
            console.log(`Syncing state: ${this.stateMachine.currentName} -> ${targetState}`);
            // We use 'change' but we might need to be careful if 'enter' logic repeats?
            // Most 'enter' logic is safe or empty.
            this.stateMachine.change(targetState);
        }

        // If we want to support legacy systems setting `currentState`, 
        // we need to detect mismatch.
        // But `this.stateMachine.currentState` is an object.
        // We can't easily check 'name' unless we store it.
        // However, we can trust the StateMachine if we assume we are migrating fully.

        // For now, let's reverse it: allow StateMachine to be the source of truth,
        // and if legacy systems rely on `currentState` variable, keep it updated?
        // OR, if legacy systems SET `currentState`, we must detect it.

        // Let's rely on the wrapper states (MenuState etc) checking the systems.
        // e.g. MenuState checks if Menu.visible is false.

        // One critical thing: Msg.show() sets currentState = DIALOG?
        // Let's check Msg.show()
    }
}

const game = new Game();
window.game = game;
window.onload = () => game.init();

// Bridging: We might need to listen to global `currentState` changes if we can't refactor everything.
// But we can try to intercept Msg.show or similar.
// For now, let's inject a listener or poll.
// But since we want "Optimization", polling is bad.
// Ideally, we modify Msg.show to call game.stateMachine.change via a global helper?

// Let's monkey-patch Msg.show if necessary, or just rely on PlayingState to check Msg.
// In PlayingState, we can check logic.
