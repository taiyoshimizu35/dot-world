// ===========================================
// オープニングムービー（1行ずつ進む版）
// ===========================================
const Opening = {
    active: false,
    timer: 0,
    phase: 0, // 0:FadeIn, 1:Wait, 2:FadeOut, 3:Next
    currentLine: 0,
    alpha: 0,
    waitForKey: false, // 連続入力を防ぐフラグ

    // ムービーテキスト
    lines: [
        "目をさまさなくては...",
        "力を取り戻さくては...",
        "やつを、滅ぼさなくては..."
    ],

    init() {
        this.active = true;
        this.timer = 0;
        this.phase = 0;
        this.currentLine = 0;
        this.alpha = 0;
        this.waitForKey = true; // 開始直後の誤作動防止
    },

    update() {
        // ---------------------------------------------------------
        // 1. 入力判定（1行進める処理）
        // ---------------------------------------------------------
        if (!Input.interact()) {
            this.waitForKey = false; // ボタンを離したらロック解除
        }

        if (Input.interact() && !this.waitForKey) {
            this.waitForKey = true; // ロックをかける
            
            // 次の行へ強制移行
            this.currentLine++;
            
            if (this.currentLine >= this.lines.length) {
                this.end(); // 全行終われば終了
            } else {
                // 次の行を最初から再生
                this.phase = 0;
                this.alpha = 0;
                this.timer = 0;
            }
            return; // 以降の通常処理はスキップ
        }

        // ---------------------------------------------------------
        // 2. 通常の自動進行処理
        // ---------------------------------------------------------
        if (this.phase === 0) { // Fade In
            this.alpha += 0.02;
            if (this.alpha >= 1) {
                this.alpha = 1;
                this.phase = 1;
                this.timer = 0;
            }
        } else if (this.phase === 1) { // Wait
            this.timer++;
            if (this.timer > 120) { // 2秒待機
                this.phase = 2;
            }
        } else if (this.phase === 2) { // Fade Out
            this.alpha -= 0.02;
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
                this.timer = 0;
            }
        }
    },

    render(ctx) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        // 背景（黒）
        Draw.rect(ctx, 0, 0, VW, VH, '#000');

        // テキスト描画
        if (this.currentLine < this.lines.length) {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            Draw.text(ctx, this.lines[this.currentLine], VW / 2, VH / 2, '#fff', 16, 'center');
            ctx.restore();
        }

        // 案内表示
        const guide = this.currentLine === this.lines.length - 1 ? 'Press Action to Start' : 'Press Action to Next';
        Draw.text(ctx, guide, VW - 10, VH - 10, '#666', 10, 'right');
    },

    end() {
        this.active = false;
        currentState = GameState.PLAYING;
        FX.fadeIn();
    }
};