// ===========================================
// ゲームオーバーメニュー
// ===========================================
const GameOverMenu = {
    cur: 0,
    opts: ['▶ 続きからやり直す', '　 はじめからやり直す'],

    update() {
        if (Input.justPressed('ArrowUp') || Input.justPressed('ArrowDown')) {
            this.cur = (this.cur + 1) % 2;
        }
        if (Input.interact()) {
            if (this.cur === 0) {
                if (Checkpoint.saved) {
                    FX.fadeOut(() => {
                        Checkpoint.restore(game.player);
                        currentState = GameState.PLAYING;
                        FX.fadeIn();
                    });
                } else {
                    location.reload();
                }
            } else {
                location.reload();
            }
        }
    },

    render(ctx) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;
        Draw.rect(ctx, 0, 0, VW, VH, 'rgba(50,0,0,0.8)');
        Draw.text(ctx, 'GAME OVER', 80, 80, '#f00', 20);

        const y = 140;
        Draw.text(ctx, this.cur === 0 ? '▶ 続きからやり直す' : '　 続きからやり直す', 80, y, this.cur === 0 ? '#fc0' : '#fff', 12);
        Draw.text(ctx, this.cur === 1 ? '▶ はじめからやり直す' : '　 はじめからやり直す', 80, y + 20, this.cur === 1 ? '#fc0' : '#fff', 12);

        if (this.cur === 0 && !Checkpoint.saved) {
            Draw.text(ctx, '(データなし)', 200, y, '#888', 10);
        }
    }
};
