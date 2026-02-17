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

    // Exits (South -> World, Others -> Dungeon)
    const midX = Math.floor(W / 2);
    const midY = Math.floor(H / 2);

    // Make exits passable
    tiles[H - 1][midX] = baseTile; // South
    tiles[0][midX] = baseTile; // North
    tiles[midY][W - 1] = baseTile; // East
    tiles[midY][0] = baseTile; // West

    return {
        w: W, h: H, tiles: tiles,
        area: areaName,
        baseTile: baseTile,
        npcs: [],
        warps: [
            // South: World Map
            {
                x: midX, y: H - 1,
                onWarp: () => { import('../../../world_map.js').then(m => m.WorldMap.open()); }
            },
            // North: Dungeon 1
            { x: midX, y: 0, to: 'north_dungeon_1', tx: 10, ty: 13 },
            // East: Dungeon 2
            { x: W - 1, y: midY, to: 'north_dungeon_2', tx: 2, ty: 7 },
            // West: Dungeon 3
            { x: 0, y: midY, to: 'north_dungeon_3', tx: 18, ty: 7 }
        ],
        start: { x: midX, y: midY },
        encounterRate: 15
    };
};

export const NorthMap = createMap('north', T.SNOW);
