
import { GameConfig } from '../../../../../constants.js';

const T = GameConfig.TILE_TYPES;
const W = 20;
const H = 15;

// Dungeon 2 (East of Town)
// 1F: Enter from West, Stairs at East
export const EastDungeon2 = {
    w: W, h: H,
    tiles: (function () {
        const t = [];
        for (let y = 0; y < H; y++) {
            t[y] = [];
            for (let x = 0; x < W; x++) {
                if (x === 0 || x === W - 1 || y === 0 || y === H - 1) t[y][x] = T.WALL;
                else t[y][x] = T.SANDS || T.STONE;
            }
        }
        t[Math.floor(H / 2)][0] = T.STONE; // Entrance (West)
        t[Math.floor(H / 2)][W - 2] = T.STAIRS; // Stairs to 2F (East side)
        return t;
    })(),
    area: 'east_dungeon_2',
    baseTile: T.STONE,
    encounterRate: 0.0,
    npcs: [],
    warps: [
        // To Town (West Exit)
        { x: 0, y: Math.floor(H / 2), to: 'east', tx: 18, ty: Math.floor(H / 2) }, // Land at East entrance of Town
        // To 2F (East Stairs)
        { x: W - 2, y: Math.floor(H / 2), to: 'east_dungeon_2_2f', tx: 2, ty: Math.floor(H / 2) }
    ],
    start: { x: 1, y: Math.floor(H / 2) }
};

// 2F: Stairs from West, Boss/Goal at East
export const EastDungeon2_2F = {
    w: W, h: H,
    tiles: (function () {
        const t = [];
        for (let y = 0; y < H; y++) {
            t[y] = [];
            for (let x = 0; x < W; x++) {
                if (x === 0 || x === W - 1 || y === 0 || y === H - 1) t[y][x] = T.WALL;
                else t[y][x] = T.SANDS || T.STONE;
            }
        }
        t[Math.floor(H / 2)][1] = T.STAIRS; // Stairs from 1F (West side)
        return t;
    })(),
    area: 'east_dungeon_2_2f',
    baseTile: T.STONE,
    encounterRate: 0.0,
    npcs: [
        { x: W - 3, y: Math.floor(H / 2), sprite: 'chest', msg: '宝箱だ！（中身はまだない）' }
    ],
    warps: [
        // To 1F
        { x: 1, y: Math.floor(H / 2), to: 'east_dungeon_2', tx: W - 3, ty: Math.floor(H / 2) }
    ],
    start: { x: 1, y: Math.floor(H / 2) }
};
