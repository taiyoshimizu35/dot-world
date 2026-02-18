import { GameConfig } from '../../../constants.js';
import { Draw } from '../../../core/draw.js';
import { AssetLoader } from '../../../core/assets.js';
import { PlayerStats2 } from '../../player.js';
import { Party2 } from '../../party.js';

export const BattleRender2 = {
    render(ctx, battle) {
        if (!battle.active) return;
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        // Background
        Draw.rect(ctx, 0, 0, VW, VH, '#111');

        // Render Enemies
        const enemies = battle.enemies || [];
        const count = enemies.length;
        const spacing = 60; // Reduced from 80 to fit with Right Panel
        const totalWidth = (count - 1) * spacing;
        const startX = (VW / 2) - (totalWidth / 2); // Centered (removed -40 offset)

        enemies.forEach((enemy, index) => {
            if (enemy.hp <= 0) return;

            const x = startX + index * spacing;
            const y = VH / 2 + 20; // Lowered further to avoid Top Panel
            const size = battle.isBoss ? 96 : 40;

            // Draw Image
            const img = AssetLoader.get(enemy.img || 'enemy_slime');
            if (img) {
                ctx.drawImage(img, x - size / 2, y - size / 2 - 20, size, size);
            } else {
                // Placeholder if no image, but alive
                Draw.rect(ctx, x - size / 2, y - size / 2, size, size, '#800');
            }
            ctx.globalAlpha = 1.0;

            // Name & HP
            // Draw name below image to avoid overlap if images are close?
            // Or stagger?
            // Let's draw name *below* image.
            const nameY = y + size / 2 + 5;
            Draw.text(ctx, enemy.name, x, nameY, '#fff', 10, 'center');
            // Draw.text(ctx, `HP:${enemy.hp}`, x, nameY + 10, '#f88', 10, 'center');
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
        } else if (battle.phase === 'partyTarget' || battle.phase === 'playerTarget') {
            Draw.text(ctx, 'ターゲットを選択', 16, y + 8, '#fff', 12);

            // Draw cursor over target
            // Need to calc target pos again (duplicate logic from above... ideally refactor positions)
            const enemies = battle.enemies || [];
            const count = enemies.length;
            const spacing = 60;
            const totalWidth = (count - 1) * spacing;
            const startX = (VW / 2) - (totalWidth / 2);

            const targetIdx = (battle.phase === 'playerTarget') ? battle.targetIndex : battle.partyTargetIndex;
            const tx = startX + targetIdx * spacing;
            const ty = VH / 2 + 20 - 40; // Above enemy (adjusted to match new y)

            Draw.text(ctx, '▼', tx, ty, '#fc0', 14, 'center');

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

        // Stats (Player + Party) - Top Horizontal List
        const boxW = 80;
        const boxH = 50; // Compact height
        const boxSpacing = 4;

        // Calculate total width to center them
        let memberCount = 1; // Player
        if (Party2 && Party2.members) memberCount += Party2.members.length;

        const totalW = memberCount * boxW + (memberCount - 1) * boxSpacing;
        let currentX = (VW - totalW) / 2;
        const baseY = 4;

        // Player Info
        this.renderStatusBox(ctx, currentX, baseY, boxW, boxH, PlayerStats2);
        currentX += boxW + boxSpacing;

        // Party Info
        if (Party2 && Party2.members) {
            Party2.members.forEach(m => {
                this.renderStatusBox(ctx, currentX, baseY, boxW, boxH, m);
                currentX += boxW + boxSpacing;
            });
        }
    },

    renderStatusBox(ctx, x, y, w, h, stats) {
        // Background
        Draw.rect(ctx, x, y, w, h, 'rgba(0,0,0,0.6)');
        Draw.stroke(ctx, x, y, w, h, '#fff', 1);

        // Name
        Draw.text(ctx, stats.name, x + 4, y + 10, '#fff', 10);

        // Safety for Max
        const maxHp = stats.maxHp || 1;
        const maxMp = stats.maxMp || 0;

        // HP
        const barW = w - 8;
        let cy = y + 16;
        this.renderBar(ctx, x + 4, cy, barW, 6, stats.hp, maxHp, '#400', '#0f0');
        cy += 10;
        // Text: "27/30"
        Draw.text(ctx, `${stats.hp}/${maxHp}`, x + w - 4, cy, '#fff', 9, 'right');
        Draw.text(ctx, 'HP', x + 4, cy, '#aaa', 8);

        // SP (Show if maxSp > 0)
        if (maxMp > 0) {
            cy += 6;
            this.renderBar(ctx, x + 4, cy, barW, 6, stats.mp, maxMp, '#004', '#fa0');
            cy += 10;
            Draw.text(ctx, `${stats.mp}/${maxMp}`, x + w - 4, cy, '#fff', 9, 'right');
            Draw.text(ctx, 'SP', x + 4, cy, '#aaa', 8);
        }
    },

    renderBar(ctx, x, y, w, h, val, max, bgCol, fCol) {
        Draw.rect(ctx, x, y, w, h, bgCol);
        if (max <= 0) return; // Divide by zero protection
        const ratio = Math.max(0, Math.min(1, val / max)); // Clamp 0-1
        const w2 = Math.floor(w * ratio);
        if (w2 > 0) Draw.rect(ctx, x, y, w2, h, fCol);
    }
};
