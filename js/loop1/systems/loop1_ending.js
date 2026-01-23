// ===========================================
// 1週目エンディングムービー（魔王戦後）
// ===========================================
const Loop1Ending = {
    active: false,
    timer: 0,
    phase: 0, // 0:FadeIn, 1:Wait, 2:FadeOut, 3:Next
    currentLine: 0,
    alpha: 0,
    waitForKey: false,

    // ムービーテキスト
    lines: [
        "「勇者よ…変だとは思わないか？」",
        "「村のすぐそばにダンジョンがあり」",
        "「村人は私を'魔王様'と呼び」",
        "「聖剣は伝説の剣より安く」",
        "「私に会うには聖剣が必要」",
        "聖剣から禍々しい光が溢れ出す——",
        "「これは聖剣などではない」",
        "「この魔剣は、お前の\n力を我が糧とするための罠…」",
        "「以前お前と戦い失った力を取り戻すための、な」",
        "「さらばだ、勇者よ」",
        "全身から力が抜けていく…",
        "意識が遠のいていく…",
        "こんなはずでは……",
        "………………",
        "…………",
        "……",
        "【第一部 完】"
    ],

    init() {
        this.active = true;
        this.timer = 0;
        this.phase = 0;
        this.currentLine = 0;
        this.alpha = 0;
        this.waitForKey = false;
    },

    update() {
        // 最終行以外はスキップ可能
        if (this.currentLine < this.lines.length - 1) {
            if (Input.interact()) {
                this.currentLine++;
                if (this.currentLine >= this.lines.length) {
                    this.end();
                } else {
                    this.phase = 0;
                    this.alpha = 0;
                }
                return;
            }
        }

        if (this.phase === 0) { // Fade In
            this.alpha += 0.03;
            if (this.alpha >= 1) {
                this.alpha = 1;
                this.phase = 1;
                this.timer = 0;
            }
        } else if (this.phase === 1) { // Wait
            this.timer++;
            // 特定行は長めに表示
            const waitTime = this.getWaitTime();
            if (this.timer > waitTime) {
                this.phase = 2;
            }
        } else if (this.phase === 2) { // Fade Out
            this.alpha -= 0.03;
            if (this.alpha <= 0) {
                this.alpha = 0;
                this.phase = 3;
            }
        } else if (this.phase === 3) { // Next Line
            this.currentLine++;
            if (this.currentLine >= this.lines.length) {
                this.end();
            } else {
                this.phase = 0;
            }
        }
    },

    getWaitTime() {
        const line = this.lines[this.currentLine];
        // 「…」だけの行は短め
        if (line === '……' || line === '…………' || line === '………………') {
            return 40;
        }
        // 最終行は長め
        if (this.currentLine === this.lines.length - 1) {
            return 180;
        }
        // 長いセリフは長め
        if (line.length > 20) {
            return 150;
        }
        return 100;
    },

    render(ctx) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        // 背景（黒）
        Draw.rect(ctx, 0, 0, VW, VH, '#000');

        // テキスト描画
        if (this.currentLine < this.lines.length) {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            
            const text = this.lines[this.currentLine];
            const lines = text.split('\n');
            const lineHeight = 20;
            const startY = VH / 2 - (lines.length - 1) * lineHeight / 2;
            
            // 最終行は特別な色
            const color = this.currentLine === this.lines.length - 1 ? '#ffcc00' : '#fff';
            
            lines.forEach((line, i) => {
                Draw.text(ctx, line, VW / 2, startY + i * lineHeight, color, 14, 'center');
            });
            
            ctx.restore();
        }

        // スキップ案内（最終行以外）
        if (this.currentLine < this.lines.length - 1) {
            Draw.text(ctx, 'Press Action to Skip', VW - 10, VH - 10, '#666', 10, 'right');
        } else if (this.currentLine === this.lines.length - 1) {
            Draw.text(ctx, 'Press Action to Continue', VW - 10, VH - 10, '#888', 10, 'right');
        }
    },

    end() {
        this.active = false;
        // 2週目開始処理
        this.startWeek2();
    },

    startWeek2() {
        // ステータスリセット
        PlayerStats.resetForWeek2();
        ShopData.reset();
        MagicShopData.reset();
        QuestFlags.reset();

        // 聖剣フラグ処理
        if (typeof gameLoop !== 'undefined' && gameLoop.holySwordOwned) {
            gameLoop.holySwordStolen = true;
        }

        // 村に戻る
        Maps.current = 'village';
        const start = Maps.get().start;
        if (window.game) {
            window.game.player.x = start.x * GameConfig.TILE_SIZE;
            window.game.player.y = start.y * GameConfig.TILE_SIZE;
            window.game.player.dir = 0;
            window.game.player.moving = false;
        }

        // フェードイン
        FX.fadeIn(() => {
            currentState = GameState.PLAYING;
            Input.lock(100);
            // 2週目開始メッセージ
            Msg.show('……目が覚めた。\n何もかもが…違って見える…\n\n【2週目開始】');

            if (window.game) {
                Camera.update(window.game.player.x, window.game.player.y, Maps.get().w, Maps.get().h);
            }
        });
    }
};
