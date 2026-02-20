
import { GameConfig } from '../../../../../constants.js';

const T = GameConfig.TILE_TYPES;

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
    '.': T.SANDS,
    'S': T.STONE,
    'B': T.STONE, // Boss placeholder
    'C': T.STONE // Chest placeholder
};

// West Dungeon 1 (North of West Town) - Desert Cave
// 30x30 Large Map
const layout1F = [
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWW............WWWWWWWWWWWW",
    "WWWW.......SS.......WWWWWWWWWW",
    "WWW......SSSSSS......WWWWWWWWW",
    "WWW.....SSSSSSSS.....WWWWWWWWW",
    "WW......SSSSSSSS......WWWWWWWW",
    "WW.......SSSSSS.......WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........SS.........WWWWWWWW",
    "WW.........E..........WWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];
// Entrance at (11, 28)

export const WestDungeon1 = {
    w: 30, h: 30,
    tiles: mapFromLayout(layout1F, mapping),
    area: 'west_dungeon_1',
    baseTile: T.SANDS,
    encounterRate: 0.15,
    npcs: [
        { x: 11, y: 25, msg: '砂漠の洞窟へようこそ。' }
    ],
    warps: [
        // To Town (South Exit)
        { x: 11, y: 28, to: 'west', tx: 10, ty: 1 },
        // To 2F (North Stairs - random placement)
        { x: 11, y: 5, to: 'west_dungeon_1_2f', tx: 15, ty: 25 }
    ],
    onLoad: (m) => {
        m.tiles[5][11] = T.STAIRS;
    },
    start: { x: 11, y: 28 }
};

// 2F
const layout2F = [
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWW....WWWWWWWWWWWWWWWW",
    "WWWWWWWWW......WWWWWWWWWWWWWWW",
    "WWWWWWWW...C....WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWW........WWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];

export const WestDungeon1_2F = {
    w: 30, h: 30,
    tiles: mapFromLayout(layout2F, mapping),
    area: 'west_dungeon_1_2f',
    baseTile: T.SANDS,
    encounterRate: 0.1,
    npcs: [
        { x: 11, y: 8, sprite: 'chest', msg: '黄金のスカラベを見つけた！（換金アイテム）' }
    ],
    warps: [
        { x: 15, y: 25, to: 'west_dungeon_1', tx: 11, ty: 6 }
    ],
    onLoad: (m) => {
        m.tiles[25][15] = T.STAIRS;
    },
    start: { x: 15, y: 25 }
};
