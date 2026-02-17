
import { GameConfig } from '../../../../../constants.js';

const T = GameConfig.TILE_TYPES;
const W = 20;
const H = 15;

// Dungeon 3 (South of Town)
// 1F: Enter from North, Stairs at South
export const EastDungeon3 = {
    w: W, h: H,
    tiles: (function () {
        const t = [];
        for (let y = 0; y < H; y++) {
            t[y] = [];
            for (let x = 0; x < W; x++) {
                if (x === 0 || x === W - 1 || y === 0 || y === H - 1) t[y][x] = T.WALL;
                else t[y][x] = T.GRAVEL || T.STONE;
            }
        }
        t[0][Math.floor(W / 2)] = T.STONE; // Entrance (North)
        t[H - 2][Math.floor(W / 2)] = T.STAIRS; // Stairs to 2F (South)
        return t;
    })(),
    area: 'east_dungeon_3',
    baseTile: T.STONE,
    encounterRate: 0.0,
    npcs: [],
    warps: [
        // To Town (North Exit)
        { x: Math.floor(W / 2), y: 0, to: 'east', tx: Math.floor(W / 2), ty: 13 }, // Land at South entrance of Town
        // To 2F (South Stairs)
        { x: Math.floor(W / 2), y: H - 2, to: 'east_dungeon_3_2f', tx: Math.floor(W / 2), ty: 1 }
    ],
    start: { x: Math.floor(W / 2), y: 1 }
};

// 2F: Stairs from North, Boss/Goal at South
export const EastDungeon3_2F = {
    w: W, h: H,
    tiles: (function () {
        const t = [];
        for (let y = 0; y < H; y++) {
            t[y] = [];
            for (let x = 0; x < W; x++) {
                if (x === 0 || x === W - 1 || y === 0 || y === H - 1) t[y][x] = T.WALL;
                else t[y][x] = T.GRAVEL || T.STONE;
            }
        }
        t[1][Math.floor(W / 2)] = T.STAIRS; // Stairs from 1F (North side)
        return t;
    })(),
    area: 'east_dungeon_3_2f',
    baseTile: T.STONE,
    encounterRate: 0.0,
    npcs: [
        { x: Math.floor(W / 2), y: H - 3, sprite: 'chest', msg: '宝箱だ！（中身はまだない）' }
    ],
    warps: [
        // To 1F
        { x: Math.floor(W / 2), y: 1, to: 'east_dungeon_3', tx: Math.floor(W / 2), ty: H - 3 }
    ],
    start: { x: Math.floor(W / 2), y: 1 }
};
