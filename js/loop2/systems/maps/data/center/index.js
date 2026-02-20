import { GameConfig } from '../../../../../constants.js';

const T = GameConfig.TILE_TYPES;
const W = 20;
const H = 15;

// Basic Tile Setup
const createMap = (areaName, baseTile) => {
    const tiles = [];
    for (let y = 0; y < H; y++) {
        tiles[y] = [];
        for (let x = 0; x < W; x++) {
            if (x === 0 || x === W - 1 || y === 0 || y === H - 1) tiles[y][x] = T.WALL;
            else tiles[y][x] = baseTile;
        }
    }
    // Exit at bottom center
    tiles[H - 1][Math.floor(W / 2)] = T.EXIT;

    return {
        w: W, h: H, tiles: tiles,
        area: areaName,
        baseTile: baseTile,
        start: { x: Math.floor(W / 2), y: H - 2 },
        warps: [
            // South: World Map
            {
                x: Math.floor(W / 2),
                y: H - 1,
                onWarp: () => {
                    import('../../../world_map.js').then(m => m.WorldMap.open());
                }
            },
            // North: Demon Castle (Unlockable)
            {
                x: Math.floor(W / 2),
                y: 0,
                to: 'demon', // Warp to Demon Map
                requiresDemonCastle: true, // Manager handles check
                tx: 10, ty: 13
            }
        ],
        encounterRate: 0, // Safe zone
        npcs: [
            { x: 10, y: 5, sprite: 'goddes', savePoint: true, blocking: true },
            // Gatekeeper or seal visual could be added here
            {
                x: 10, y: 1, name: '城門', img: 'door',
                msg: '堅く閉ざされている……\n四方の守護者を倒さねば開かないようだ。',
                blocking: true,
                hideFlag: 'demon_castle_open'
            },
            // Shop NPC
            {
                x: 5, y: 7, name: '商人', sprite: 'villager',
                shop: true, msg: '「へいらっしゃい！」'
            }
        ]
    };
};

export const CenterMap = createMap('center', T.FLOOR);
