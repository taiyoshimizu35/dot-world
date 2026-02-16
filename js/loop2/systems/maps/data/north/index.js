import { GameConfig } from '../../../../../constants.js';

const T = GameConfig.TILE_TYPES;
const W = 20;
const H = 15;

const createMap = (areaName, baseTile) => {
    const tiles = [];
    for (let y = 0; y < H; y++) {
        tiles[y] = [];
        for (let x = 0; x < W; x++) {
            if (x === 0 || x === W - 1 || y === 0 || y === H - 1) tiles[y][x] = T.WALL;
            else tiles[y][x] = baseTile;
        }
    }
    tiles[H - 1][Math.floor(W / 2)] = T.EXIT;
    return {
        w: W, h: H, tiles: tiles,
        area: areaName,
        baseTile: baseTile,
        npcs: [],
        warps: [
            {
                x: Math.floor(W / 2),
                y: H - 1,
                onWarp: () => {
                    import('../../../world_map.js').then(m => m.WorldMap.open());
                }
            }
        ],
        start: { x: Math.floor(W / 2), y: H - 2 },
        encounterRate: 15
    };
};

export const NorthMap = createMap('north', T.SNOW);
