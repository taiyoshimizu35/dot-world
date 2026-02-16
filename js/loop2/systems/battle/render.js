import { GameConfig } from '../../../constants.js';
import { Draw } from '../../../core/draw.js';
import { AssetLoader } from '../../../core/assets.js';
import { PlayerStats2 } from '../../player.js';

export const BattleRender2 = {
    render(ctx, battle) {
        if (!battle.active) return;
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        // Background
        Draw.rect(ctx, 0, 0, VW, VH, '#111');

        // Render Enemies
        const enemies = battle.enemies || [];
        const count = enemies.length;
        const spacing = 80;
        const totalWidth = (count - 1) * spacing;
        const startX = (VW / 2) - (totalWidth / 2);

        enemies.forEach((enemy, index) => {
            if (enemy.hp <= 0) return;

            const x = startX + index * spacing;
            const y = VH / 2 - 40;
            const size = battle.isBoss ? 96 : 40;

            // Draw Image
            const img = AssetLoader.get(enemy.img || 'enemy_slime');
            if (img) {
                ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
            } else {
                // Placeholder if no image
                Draw.rect(ctx, x - size / 2, y - size / 2, size, size, '#800');
            }

            // Name & HP (Debug/Simple)
            Draw.text(ctx, enemy.name, x - (enemy.name.length * 6), y - size / 2 - 20, '#fff', 12);
            // Draw.text(ctx, `HP:${enemy.hp}`, x - 20, y - size / 2 - 8, '#f88', 10);
        });

        // UI Background
        const h = 60, y = VH - h - 8;
        Draw.rect(ctx, 8, y, VW - 16, h, 'rgba(0,0,40,0.95)');
        Draw.stroke(ctx, 8, y, VW - 16, h, '#fff', 2);

        // Command Phase
        if (battle.phase === 'command') {
            Draw.text(ctx, 'どうする？', 16, y + 8, '#fff', 12);
            const cmds = ['こうげき', 'スキル', 'アイテム', 'にげる'];
            for (let i = 0; i < 4; i++) {
                const cx = 16 + (i % 2) * 80;
                const cy = y + 24 + Math.floor(i / 2) * 16;
                if (i === battle.cur) Draw.text(ctx, '▶', cx - 10, cy, '#fc0', 12);
                Draw.text(ctx, cmds[i], cx, cy, '#fff', 12);
            }
        } else {
            // Message Phase
            let ty = y + 10;
            const lines = battle.msg.split('\n');
            for (const line of lines) {
                Draw.text(ctx, line, 16, ty, '#fff', 12);
                ty += 16;
            }
            if (battle.waitForInput) Draw.text(ctx, '▼', VW - 20, y + h - 16, '#fff', 10);
        }

        // Stats
        Draw.rect(ctx, 4, 4, 100, 40, 'rgba(0,0,0,0.5)');
        Draw.text(ctx, `Loop2 Player Lv${PlayerStats2.level}`, 8, 8, '#fff', 10);
        Draw.text(ctx, `HP: ${PlayerStats2.hp}/${PlayerStats2.maxHp}`, 8, 20, '#8f8', 10);
    }
};
