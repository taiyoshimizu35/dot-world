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

    // Exits (North -> World, Others -> Dungeon)
    const midX = Math.floor(W / 2);
    const midY = Math.floor(H / 2);

    // Make exits passable
    tiles[0][midX] = baseTile; // North
    tiles[midY][0] = baseTile; // West
    tiles[H - 1][midX] = baseTile; // South
    tiles[midY][W - 1] = baseTile; // East

    return {
        w: W, h: H, tiles: tiles,
        area: areaName,
        baseTile: baseTile,
        npcs: [
            // Aldo (Swordsman)
            { x: 8, y: 6, name: 'アルド', img: 'aldo', partyJoin: 'aldo' },
            // Sophina (Forbidden Mage)
            { x: 14, y: 12, name: 'ソフィーナ', img: 'sophina', partyJoin: 'sophina' },
            // Kron (Time Mage)
            { x: 16, y: 4, name: 'クロン', img: 'kron', partyJoin: 'kron' }
        ],
        warps: [
            // North: World Map
            {
                x: midX, y: 0,
                onWarp: () => { import('../../../world_map.js').then(m => m.WorldMap.open()); }
            },
            // West: Dungeon 1
            { x: 0, y: midY, to: 'south_dungeon_1', tx: 18, ty: 7 },
            // South: Dungeon 2
            { x: midX, y: H - 1, to: 'south_dungeon_2', tx: 10, ty: 2 },
            // East: Dungeon 3
            { x: W - 1, y: midY, to: 'south_dungeon_3', tx: 2, ty: 7 }
        ],
        start: { x: midX, y: midY },
        encounterRate: 0.0
    };
};

export const SouthMap = createMap('south', T.DIRT);
