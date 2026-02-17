
import { GameConfig } from '../../../../../constants.js';

const T = GameConfig.TILE_TYPES;
const W = 20;
const H = 15;

const createDungeonMap = (id, exitTo, exitTx, exitTy) => {
    const tiles = [];
    for (let y = 0; y < H; y++) {
        tiles[y] = [];
        for (let x = 0; x < W; x++) {
            if (x === 0 || x === W - 1 || y === 0 || y === H - 1) tiles[y][x] = T.WALL;
            else tiles[y][x] = T.STONE;
        }
    }
    tiles[H - 1][Math.floor(W / 2)] = T.STONE; // Forced Passable Exit

    return {
        w: W, h: H, tiles: tiles,
        area: id,
        baseTile: T.STONE,
        npcs: [
            { x: 10, y: 7, msg: `這裡是 ${id} のダンジョンだ。まだ何もない。` }
        ],
        warps: [
            { x: Math.floor(W / 2), y: H - 1, to: exitTo, tx: exitTx, ty: exitTy }
        ],
        start: { x: Math.floor(W / 2), y: H - 2 },
        encounterRate: 20
    };
};

export const SouthDungeon1 = createDungeonMap('south_dungeon_1', 'south', 1, 7);
export const SouthDungeon2 = createDungeonMap('south_dungeon_2', 'south', 10, 13);
export const SouthDungeon3 = createDungeonMap('south_dungeon_3', 'south', 18, 7);
