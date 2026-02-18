
import { GameConfig } from '../../../../../constants.js';

const T = GameConfig.TILE_TYPES;
const W = 20;
const H = 15;

// Dungeon 1 (North of Town)
// 1F: Enter from South, Stairs at North
export const EastDungeon1 = {
    w: W, h: H,
    tiles: (function () {
        const t = [];
        for (let y = 0; y < H; y++) {
            t[y] = [];
            for (let x = 0; x < W; x++) {
                if (x === 0 || x === W - 1 || y === 0 || y === H - 1) t[y][x] = T.WALL;
                else t[y][x] = T.STONE; // Base
            }
        }
        // Features
        t[H - 1][Math.floor(W / 2)] = T.STONE; // Entrance (South)
        t[1][Math.floor(W / 2)] = T.STAIRS; // Stairs to 2F (North)
        return t;
    })(),
    area: 'east_dungeon_1',
    baseTile: T.STONE,
    encounterRate: 0.1,
    npcs: [
        { x: Math.floor(W / 2), y: H - 3, msg: 'この先は危険だ…' }
    ],
    warps: [
        // To Town (South Exit)
        { x: Math.floor(W / 2), y: H - 1, to: 'east', tx: Math.floor(20 / 2), ty: 1 }, // Land at North entrance of Town
        // To 2F (North Stairs)
        { x: Math.floor(W / 2), y: 1, to: 'east_dungeon_1_2f', tx: Math.floor(W / 2), ty: H - 2 }
    ],
    start: { x: Math.floor(W / 2), y: H - 2 }
};

// 2F: Stairs from South, Boss/Goal at North
export const EastDungeon1_2F = {
    w: W, h: H,
    tiles: (function () {
        const t = [];
        for (let y = 0; y < H; y++) {
            t[y] = [];
            for (let x = 0; x < W; x++) {
                if (x === 0 || x === W - 1 || y === 0 || y === H - 1) t[y][x] = T.WALL;
                else t[y][x] = T.floor_ice || T.STONE; // Use STONE for now
            }
        }
        t[H - 2][Math.floor(W / 2)] = T.STAIRS; // Stairs down (South)
        return t;
    })(),
    area: 'east_dungeon_1_2f',
    baseTile: T.STONE,
    encounterRate: 0.0,
    npcs: [
        // Boss or Chest
        { x: Math.floor(W / 2), y: 3, sprite: 'chest', msg: '宝箱だ！（中身はまだない）' }
    ],
    warps: [
        // To 1F
        { x: Math.floor(W / 2), y: H - 2, to: 'east_dungeon_1', tx: Math.floor(W / 2), ty: 2 }
    ],
    start: { x: Math.floor(W / 2), y: H - 2 }
};
