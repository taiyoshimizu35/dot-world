// ===========================================
// 宿屋システム
// ===========================================
const Inn = {
    visible: false,
    cost: 0,

    open(cost) {
        this.visible = true;
        this.cost = cost;
        this.step = 0; // 0: Prompt, 1: Result
        currentState = GameState.INN;
        Input.lock(200);
    },

    close() {
        this.visible = false;
        currentState = GameState.PLAYING;
        Input.lock(150);
    },

    update() {
        if (!this.visible) return;

        // Yes/No Selection for "Rest?"
        if (this.step === 0) {
            if (Input.interact()) {
                this.rest();
            } else if (Input.cancel()) {
                this.close();
            }
        } else if (this.step === 1) {
            // Result check
            if (Input.interact()) {
                this.close();
            }
        }
    },

    rest() {
        if (PlayerStats.gold < this.cost) {
            Msg.show('「金が足りないみたいだね。」');
            this.close();
            return;
        }

        PlayerStats.spendGold(this.cost);

        // Fade out/in sequence
        FX.fadeOut(() => {
            PlayerStats.healFull();
            FX.fadeIn();
            Msg.show('「おはよう！\n  体力はバッチリだね！」');
            this.close();
        });
    },

    render(ctx) {
        if (!this.visible) return;
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        // Draw Window
        Draw.rect(ctx, 40, VH - 100, VW - 80, 80, 'rgba(0,0,40,0.95)');
        Draw.stroke(ctx, 40, VH - 100, VW - 80, 80, '#fff', 2);

        Draw.text(ctx, '【宿屋】', 50, VH - 80, '#fc0', 14);
        Draw.text(ctx, `一泊 ${this.cost}G です。`, 50, VH - 50, '#fff', 12);
        Draw.text(ctx, `宿泊しますか？ (Z: はい / X: いいえ)`, 50, VH - 30, '#aaa', 10);
        Draw.text(ctx, `所持金: ${PlayerStats.gold}G`, VW - 140, VH - 80, '#ff0', 12);
    }
};
