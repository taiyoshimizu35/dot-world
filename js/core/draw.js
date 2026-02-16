// ===========================================
// 描画ユーティリティ
// ===========================================
export const Draw = {
    text(ctx, t, x, y, c = '#fff', s = 12, align = 'left') {
        ctx.fillStyle = c; ctx.font = `${s}px monospace`; ctx.textBaseline = 'middle'; ctx.textAlign = align;
        ctx.fillText(t, Math.floor(x), Math.floor(y));
    },
    rect(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h)); },
    stroke(ctx, x, y, w, h, c, lw = 2) { ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.strokeRect(Math.floor(x) + 0.5, Math.floor(y) + 0.5, Math.floor(w), Math.floor(h)); },
    circle(ctx, x, y, r, c, fill = true) {
        ctx.beginPath();
        ctx.arc(Math.floor(x), Math.floor(y), r, 0, Math.PI * 2);
        if (fill) {
            ctx.fillStyle = c;
            ctx.fill();
        } else {
            ctx.strokeStyle = c;
            ctx.stroke();
        }
    }
};
