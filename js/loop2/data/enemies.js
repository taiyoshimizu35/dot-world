import { Enemies } from '../../loop1/data/enemies.js';

export const EnemyData2 = {
    ...Enemies, // Inherit Loop 1 data
    true_demon_king: { name: '真・魔王', hp: 50000, atk: 500, def: 100, exp: 0, gold: 0 }
};

export function getEnemiesForMap2(map, mapId) {
    if (mapId === 'center') return [];

    if (mapId === 'east' || mapId.startsWith('east_dungeon')) {
        return ['slime', 'goblin'];
    }
    if (mapId === 'west' || mapId.startsWith('west_dungeon')) {
        return ['skeleton', 'imp', 'killerbee'];
    }
    if (mapId === 'north' || mapId.startsWith('north_dungeon')) {
        // Loop 1 North enemies are bosses, maybe reuse or add standard ones?
        // Let's use some placeholders or reuse standard ones for now as requested "randomly"
        return ['ice_dragon', 'ice_magician', 'ice_knight']; // These are bosses in loop 1, might be too strong?
        // User said "use Loop 1 data", so I'll use what's there.
    }
    if (mapId === 'south' || mapId.startsWith('south_dungeon')) {
        return ['zombie', 'skeleton_knight', 'ghost'];
    }

    // Default fallback
    return ['slime', 'goblin', 'bat'];
}
