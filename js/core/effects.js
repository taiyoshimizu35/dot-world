// ===========================================
// エフェクト (フェード・フラッシュ・シェイク)
// ===========================================
const FX = {
    fadeAlpha: 0, fadeActive: false, fadeDir: 0, fadeCb: null,
    flashAlpha: 0, flashColor: 'white',
    shakeX: 0, shakeY: 0, shakeActive: false,

    fadeOut(cb) {
        this.fadeAlpha = 0; this.fadeDir = 1;
        this.fadeActive = true; this.fadeCb = cb;
        currentState = GameState.FADE;
    },

    fadeIn(cb) {
        this.fadeAlpha = 1; this.fadeDir = -1;
        this.fadeActive = true; this.fadeCb = cb;
    },

    flash(d = 150) {
        this.flashAlpha = 1; this.flashColor = 'white';
        setTimeout(() => this.flashAlpha = 0, d);
    },

    flashRed(d = 150) {
        this.flashAlpha = 0.6; this.flashColor = 'red';
        setTimeout(() => this.flashAlpha = 0, d);
    },

    shake(d = 200) {
        this.shakeActive = true;
        setTimeout(() => { this.shakeActive = false; this.shakeX = 0; this.shakeY = 0; }, d);
    },

    update() {
        if (this.fadeActive) {
            this.fadeAlpha += this.fadeDir * 0.08;
            if ((this.fadeDir > 0 && this.fadeAlpha >= 1) || (this.fadeDir < 0 && this.fadeAlpha <= 0)) {
                this.fadeAlpha = this.fadeDir > 0 ? 1 : 0;
                this.fadeActive = false;
                if (this.fadeCb) this.fadeCb();
                if (this.fadeDir < 0) {
                    currentState = GameState.PLAYING;
                    Input.lock(100);
                }
            }
        }
        if (this.shakeActive) {
            this.shakeX = (Math.random() - 0.5) * 6;
            this.shakeY = (Math.random() - 0.5) * 6;
        }
    },

    render(ctx) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;
        if (this.fadeAlpha > 0) Draw.rect(ctx, 0, 0, VW, VH, `rgba(0,0,0,${this.fadeAlpha})`);
        if (this.flashAlpha > 0) {
            const c = this.flashColor === 'red' ? `rgba(255,0,0,${this.flashAlpha})` : `rgba(255,255,255,${this.flashAlpha})`;
            Draw.rect(ctx, 0, 0, VW, VH, c);
        }
    }
};
