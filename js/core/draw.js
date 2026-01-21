// ===========================================
// 描画ユーティリティ
// ===========================================
const Draw = {
    text(ctx, t, x, y, c = '#fff', s = 12) {
        ctx.fillStyle = c; ctx.font = `${s}px monospace`; ctx.textBaseline = 'top';
        ctx.fillText(t, Math.floor(x), Math.floor(y));
    },
    rect(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h)); },
    stroke(ctx, x, y, w, h, c, lw = 2) { ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.strokeRect(Math.floor(x) + 0.5, Math.floor(y) + 0.5, Math.floor(w), Math.floor(h)); }
};
