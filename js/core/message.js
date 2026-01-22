// ===========================================
// メッセージ
// ===========================================
const Msg = {
    visible: false, text: '', disp: '', idx: 0, lt: 0, callback: null,

    show(t, cb = null, mode = 'normal') {
        this.visible = true;
        this.text = t;
        this.disp = '';
        this.idx = 0;
        this.lt = Date.now();
        this.callback = cb;
        if (mode !== 'overlay') {
            currentState = GameState.DIALOG;
        }
    },

    hide() {
        this.visible = false;
        Input.lock(150);
        if (this.callback) {
            const cb = this.callback;
            this.callback = null;
            cb();
        } else {
            currentState = GameState.PLAYING;
        }
    },

    update() {
        if (!this.visible) return;
        const now = Date.now();
        if (this.idx < this.text.length && now - this.lt > 30) {
            this.disp += this.text[this.idx++];
            this.lt = now;
        }
    },

    done() { return this.idx >= this.text.length; },
    skip() { this.disp = this.text; this.idx = this.text.length; },

    render(ctx) {
        if (!this.visible) return;
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;
        const h = 50, y = VH - h - 8;
        Draw.rect(ctx, 8, y, VW - 16, h, 'rgba(0,0,40,0.95)');
        Draw.stroke(ctx, 8, y, VW - 16, h, '#fff', 2);
        let ty = y + 10;
        for (const line of this.disp.split('\n')) {
            Draw.text(ctx, line, 16, ty, '#fff', 12);
            ty += 16;
        }
        if (this.done()) Draw.text(ctx, '▼', VW - 24, y + h - 16, '#fff', 12);
    }
};
