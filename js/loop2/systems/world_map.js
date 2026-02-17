import { GameConfig } from '../../constants.js';
import { Draw } from '../../core/draw.js';
import { Input } from '../../core/input.js';
import { AssetLoader } from '../../core/assets.js';
import { WorldState } from '../../loop1/world.js';
import { Maps } from '../../loop1/systems/maps/manager.js';

// Actually, Loop 2 should have its own map loader or reuse Loop 1's manager if adapted.
// For now, let's assume we use Loop 1's manager but load `areas.js` data.
// Or create a simple `MapManager2` if needed.
// Checking `loop2/systems/maps/loader.js`: it existed. I should probably use that or a new `manager.js`.
// Let's use `Maps` from Loop 1 if it can switch context, OR create `MapManager2`.
// Given the prompt "minimal components", let's use a simple state here or integrated manager.

import { Areas } from './maps/data/areas.js';

export const WorldMap = {
    active: false,
    selected: 0,
    areas: ['center', 'east', 'west', 'north', 'south'],
    // Visual positions for the nodes (Fit to 320x240)
    positions: [
        { x: 155, y: 120, name: 'Center' },
        { x: 278, y: 120, name: 'East' },
        { x: 50, y: 120, name: 'West' },
        { x: 150, y: 50, name: 'North' },
        { x: 160, y: 220, name: 'South' }
    ],

    open() {
        this.active = true;
        this.selected = 0;
        // Maybe play world map music
    },

    update() {
        if (!this.active) return;

        if (Input.justPressed('ArrowRight')) this.moveSelection(1, 0);
        if (Input.justPressed('ArrowLeft')) this.moveSelection(-1, 0);
        if (Input.justPressed('ArrowUp')) this.moveSelection(0, -1);
        if (Input.justPressed('ArrowDown')) this.moveSelection(0, 1);

        if (Input.interact()) {
            this.enterArea();
        }
    },

    moveSelection(dx, dy) {
        const current = this.positions[this.selected];
        let best = -1;
        let bestDist = Infinity;

        this.positions.forEach((pos, index) => {
            if (index === this.selected) return;

            // Check direction
            const vecX = pos.x - current.x;
            const vecY = pos.y - current.y;

            // Simple dot product check for direction
            const dot = vecX * dx + vecY * dy;
            if (dot > 0) {
                // Prioritize nodes that are more aligned with the direction
                // Angle check: normalized dot product should be high
                const len = Math.sqrt(vecX * vecX + vecY * vecY);
                const normalizedDot = dot / len;

                // 45 degrees cone (approx 0.707)
                if (normalizedDot > 0.5) {
                    if (len < bestDist) {
                        bestDist = len;
                        best = index;
                    }
                }
            }
        });

        if (best !== -1) {
            this.selected = best;
        }
    },

    enterArea() {
        const areaName = this.areas[this.selected];
        console.log(`Entering area: ${areaName}`);
        this.active = false;

        // Load Map using Unified Maps Manager
        import('../../loop1/systems/maps/manager.js').then(m => {
            m.Maps.load(areaName);
            const map = m.Maps.get();
            if (map && map.start) {
                // Ensure player is available (global or via manager system)
                // Assuming standard player object in Loop 2 context
                if (WorldState.game && WorldState.game.player) {
                    WorldState.game.player.x = map.start.x * GameConfig.TILE_SIZE;
                    WorldState.game.player.y = map.start.y * GameConfig.TILE_SIZE;
                    // Reset direction if needed?
                } else if (WorldState.managers.player) {
                    // Loop 1 manager fallback
                    // But loop2 player might be different object? 
                    // map.start logic handled above
                    // Let's stick to modifying coordinates directly if possible or finding the right reference.
                    // In Loop 2, PlayerStats2 is stats, but entity is game.player.
                }
            }
        });
    },

    render(ctx) {
        if (!this.active) return;

        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        // Draw Background Image
        const bg = AssetLoader.images.world_map;
        if (bg) {
            ctx.drawImage(bg, 0, 0, VW, VH);
        } else {
            Draw.rect(ctx, 0, 0, VW, VH, '#000');
            Draw.text(ctx, 'World Map (Image Missing)', 20, 20, '#fff');
        }

        // Draw Cursor (Arrow)
        const pos = this.positions[this.selected];
        if (pos) {
            // Arrow Animation
            const offset = Math.floor(Date.now() / 200) % 2 * 3;

            // Draw Arrow (▼) pointing to the spot
            // Adjust y - 20 to be above the spot
            Draw.text(ctx, '▼', pos.x, pos.y - 15 - offset, '#fc0', 14, 'center');

            // Text Removed as requested
        }
    }
};
