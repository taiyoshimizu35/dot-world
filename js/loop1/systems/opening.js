// ===========================================
// オープニングムービー
// ===========================================
const Opening = {
    active: false,
    timer: 0,
    phase: 0, // 0:FadeIn, 1:Wait, 2:FadeOut, 3:Next
    currentLine: 0,
    alpha: 0,

    // ムービーテキスト
    lines: [
        "かつて、この世界は光に満ちていた",
        "しかし、突如現れた魔王により",
        "全ては闇に覆われた",
        "人々は希望を失いかけていたが",
        "ある日、一人の勇者が立ち上がる",
        "これは、運命に抗う物語である"
    ],

    init() {
        this.active = true;
        this.timer = 0;
        this.phase = 0;
        this.currentLine = 0;
        this.alpha = 0;
    },

    update() {
        // スキップ
        if (Input.interact()) {
            this.end();
            return;
        }

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

        // スキップ案内
        Draw.text(ctx, 'Press Action to Skip', VW - 10, VH - 10, '#666', 10, 'right');
    },

    end() {
        this.active = false;
        currentState = GameState.PLAYING;
        FX.fadeIn();
    }
};
