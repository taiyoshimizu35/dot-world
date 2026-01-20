// ===========================================
// 戦闘描画
// ===========================================
const BattleRender = {
    render(ctx, battle) {
        if (!battle.active) return;
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        // 背景
        Draw.rect(ctx, 0, 0, VW, VH, '#222');

        // 敵
        if (battle.enemy) {
            const shakeX = FX.shakeActive ? FX.shakeX : 0;
            const shakeY = FX.shakeActive ? FX.shakeY : 0;
            const img = AssetLoader.get(battle.enemy.img || 'enemy_slime');
            if (img) {
                const es = battle.isBoss ? 64 : 32;
                const ex = (VW - es) / 2 + shakeX;
                const ey = (VH / 2 - es / 2) - 20 + shakeY;
                ctx.drawImage(img, Math.floor(ex), Math.floor(ey), es, es);
            }
            Draw.text(ctx, battle.enemy.name, VW / 2 - (battle.enemy.name.length * 6), VH / 2 - 60, '#fff', 12);
        }

        // コマンドUI
        const h = 60, y = VH - h - 8;
        Draw.rect(ctx, 8, y, VW - 16, h, 'rgba(0,0,40,0.95)');
        Draw.stroke(ctx, 8, y, VW - 16, h, '#fff', 2);

        if (battle.phase === 'command') {
            Draw.text(ctx, 'どうする？', 16, y + 8, '#fff', 12);
            const cmds = ['こうげき', '魔法', 'アイテム', 'にげる'];
            for (let i = 0; i < 4; i++) {
                const cx = 16 + (i % 2) * 80;
                const cy = y + 24 + Math.floor(i / 2) * 16;
                if (i === battle.cur) Draw.text(ctx, '▶', cx - 10, cy, '#fc0', 12);
                Draw.text(ctx, cmds[i], cx, cy, '#fff', 12);
            }
        } else if (battle.phase === 'magic') {
            Draw.text(ctx, '魔法を選択', 16, y + 8, '#fc0', 12);
            const spells = getLearnedSpells(PlayerStats.spells);
            if (spells.length === 0) {
                Draw.text(ctx, '魔法を覚えていない', 32, y + 24, '#888', 12);
            } else {
                const s = spells[battle.magicCur];
                Draw.text(ctx, '▶ ' + s.name, 32, y + 24, '#fff', 12);
                Draw.text(ctx, `MP: ${s.mp}`, 120, y + 24, '#8cf', 12);
                Draw.text(ctx, '▲▼で選択', 160, y + 40, '#888', 10);
            }
        } else if (battle.phase === 'item') {
            Draw.text(ctx, 'アイテムを選択', 16, y + 8, '#fc0', 12);
            const items = Inv.list();
            if (items.length === 0) {
                Draw.text(ctx, 'アイテムを持っていない', 32, y + 24, '#888', 12);
            } else {
                const [n, c] = items[battle.itemCur];
                Draw.text(ctx, `▶ ${n} x${c}`, 32, y + 24, '#fff', 12);
                Draw.text(ctx, '▲▼で選択', 160, y + 40, '#888', 10);
            }
        } else {
            let ty = y + 10;
            for (const line of battle.msg.split('\n')) {
                Draw.text(ctx, line, 16, ty, '#fff', 12);
                ty += 16;
            }
            if (battle.waitForInput) Draw.text(ctx, '▼', VW - 20, y + h - 16, '#fff', 10);
        }

        // DECEPTION_LOGIC: ステータスオーバーレイ - 偽装されたステータスを表示
        const s = PlayerStats.getDisplayStats();
        Draw.rect(ctx, 4, 4, 100, 40, 'rgba(0,0,0,0.5)');
        Draw.text(ctx, `${s.name} Lv${s.level}`, 8, 8, '#fff', 10);
        Draw.text(ctx, `HP: ${s.hp}/${s.maxHp}`, 8, 20, '#8f8', 10);
        Draw.text(ctx, `MP: ${s.mp}/${s.maxMp}`, 60, 20, '#8cf', 10);
    }
};
