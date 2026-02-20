
import { GameConfig } from '../../../../../constants.js';

const T = GameConfig.TILE_TYPES;
const W = 20;
const H = 15;

// Dungeon 2 (East of Town)
// 1F: Enter from West, Stairs at East
// Helper to map string layout to tiles
const mapFromLayout = (layout, mapping) => {
    const tiles = [];
    const H = layout.length;
    const W = layout[0].length;
    for (let y = 0; y < H; y++) {
        tiles[y] = [];
        for (let x = 0; x < W; x++) {
            const char = layout[y][x];
            tiles[y][x] = mapping[char] || GameConfig.TILE_TYPES.STONE;
        }
    }
    return tiles;
};

const mapping = {
    'W': T.WALL,
    'S': T.STONE,
    '.': T.SANDS // Use SANDS for variety
};

// Dungeon 2 (East of Town) - Ruins
// 1F: Pillars and Sands
const layout1F = [
    "WWWWWWWWWWWWWWWWWWWW",
    "W........W.........W",
    "W..S..S..W..S..S...W",
    "W.................UW",
    "W..S..S..W..S..S...W",
    "W........W.........W",
    "WWWWWW.WWWWWW.WWWWWW",
    "E..................W",
    "WWWWWW.WWWWWW.WWWWWW",
    "W........W.........W",
    "W..S..S..W..S..S...W",
    "W..................W",
    "W..S..S..W..S..S...W",
    "W........W.........W",
    "WWWWWWWWWWWWWWWWWWWW"
];
// E = Entrance (West, y=7)
// U = Up Stairs (East, y=3)

export const EastDungeon2 = {
    w: 20, h: 15,
    tiles: mapFromLayout(layout1F, mapping),
    area: 'east_dungeon_2',
    baseTile: T.STONE,
    encounterRate: 0.1,
    npcs: [],
    warps: [
        // To Town (West Exit)
        { x: 0, y: 7, to: 'east', tx: 18, ty: 7 }, // Land at East entrance of Town
        // To 2F (East Stairs)
        { x: 18, y: 3, to: 'east_dungeon_2_2f', tx: 18, ty: 3 }
    ],
    onLoad: (m) => {
        m.tiles[3][18] = T.STAIRS;
    },
    start: { x: 1, y: 7 }
};

// 2F: Deep Ruins
const layout2F = [
    "WWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWW",
    "W.........W........W",
    "W................DUW",
    "W.........W........W",
    "WWWWWWWWWWWWWWWWWWWW",
    "W..................W",
    "W...SSSS.....SSSS..W",
    "W...S..S.....S..S..W",
    "W...SSSS.....SSSS..W",
    "W..................W",
    "WWWWWWWWWWWWWWWWWWWW",
    "W..................W",
    "W.......C..........W",
    "WWWWWWWWWWWWWWWWWWWW"
];
// D = Down Stairs (x=17, y=3)

export const EastDungeon2_2F = {
    w: 20, h: 15,
    tiles: mapFromLayout(layout2F, mapping),
    area: 'east_dungeon_2_2f',
    baseTile: T.STONE,
    encounterRate: 0.0,
    npcs: [
        { x: 8, y: 13, sprite: 'chest', msg: '宝箱だ！（中身はまだない）' }
    ],
    warps: [
        // To 1F
        { x: 17, y: 3, to: 'east_dungeon_2', tx: 17, ty: 3 }
    ],
    onLoad: (m) => {
        m.tiles[3][17] = T.STAIRS;
    },
    start: { x: 17, y: 3 }
};
