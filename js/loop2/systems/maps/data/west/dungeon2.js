
import { GameConfig } from '../../../../../constants.js';

const T = GameConfig.TILE_TYPES;

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
    '~': T.WATER,
    'T': T.TREE
};

// West Dungeon 2 (West of Town) - Oasis Ruins
const layout1F = [
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WW.......WW.........WW......WW",
    "WW.......WW.........WW......WW",
    "WW.......WW.........WW......WW",
    "WW.......WW.........WW......WW",
    "WW.......WW.........WW......WW",
    "WW..........................WW",
    "WW..........................WW",
    "WW..........................WW",
    "WW.......~~~~~~~............WW",
    "WW......~~~~~~~~~...........WW",
    "WW......~~~~~~~~~...........WW",
    "WW.......~~~~~~~............WW",
    "E...........................WW",
    "WW.......TT...TT............WW",
    "WW.......TT...TT............WW",
    "WW..........................WW",
    "WW..........................WW",
    "WW.......WW.........WW......WW",
    "WW.......WW.........WW......WW",
    "WW.......WW.........WW......WW",
    "WW.......WW.........WW......WW",
    "WW.......WW.........WW......WW",
    "WW.......WW.........WW......WW",
    "WW.......WW.........WW......WW",
    "WW.......WW.........WW......WW",
    "WW.......WW.........WW......WW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];
// Entrance at x=0, y=14

export const WestDungeon2 = {
    w: 30, h: 30,
    tiles: mapFromLayout(layout1F, mapping),
    area: 'west_dungeon_2',
    baseTile: T.SANDS,
    encounterRate: 0.1,
    npcs: [],
    warps: [
        { x: 0, y: 14, to: 'west', tx: 18, ty: 7 },
        { x: 28, y: 14, to: 'west_dungeon_2_2f', tx: 2, ty: 14 }
    ],
    onLoad: (m) => {
        m.tiles[14][28] = T.STAIRS;
    },
    start: { x: 1, y: 14 }
};

// 2F
const layout2F = [
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW...C...WWWWWWWWWWWWW",
    "WW..........................WW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWW.......WWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];

export const WestDungeon2_2F = {
    w: 30, h: 30,
    tiles: mapFromLayout(layout2F, mapping),
    area: 'west_dungeon_2_2f',
    baseTile: T.STONE,
    encounterRate: 0.05,
    npcs: [
        { x: 15, y: 13, sprite: 'chest', msg: '古代の剣を見つけた！（まだ装備できない）' }
    ],
    warps: [
        { x: 1, y: 14, to: 'west_dungeon_2', tx: 27, ty: 14 }
    ],
    onLoad: (m) => {
        m.tiles[14][1] = T.STAIRS;
    },
    start: { x: 1, y: 14 }
};
