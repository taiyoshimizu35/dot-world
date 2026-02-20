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

    // Exits (East -> World, Others -> Dungeon)
    const midX = Math.floor(W / 2);
    const midY = Math.floor(H / 2);

    // Make exits passable
    tiles[midY][W - 1] = baseTile; // East
    tiles[0][midX] = baseTile; // North
    tiles[midY][0] = baseTile; // West
    tiles[H - 1][midX] = baseTile; // South

    // Tiles remain baseTile

    return {
        w: W, h: H, tiles: tiles,
        area: areaName,
        baseTile: baseTile,
        npcs: [
            // Elena (Mage)
            { x: 5, y: 10, name: 'エレナ', img: 'elena', partyJoin: 'elena' },
            // Gordon (Merchant)
            { x: 15, y: 10, name: 'ゴルドン', img: 'gordon', partyJoin: 'gordon' },
            // Gawain (Guardian)
            { x: 5, y: 5, name: 'ガウェイン', img: 'gawain', partyJoin: 'gawain' }
        ],
        warps: [
            // East: World Map
            {
                x: W - 1, y: midY,
                onWarp: () => { import('../../../world_map.js').then(m => m.WorldMap.open()); }
            },
            // North: Dungeon 1
            { x: midX, y: 0, to: 'west_dungeon_1', tx: 10, ty: 13 },
            // West: Dungeon 2
            { x: 0, y: midY, to: 'west_dungeon_2', tx: 18, ty: 7 },
            // South: Dungeon 3
            { x: midX, y: H - 1, to: 'west_dungeon_3', tx: 10, ty: 2 }
        ],
        start: { x: midX, y: midY },
        encounterRate: 0.0
    };
};

export const WestMap = createMap('west', T.SAND);
