
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
    '.': T.floor_ice || T.STONE,
    'S': T.STONE,
    'I': T.WALL // Ice Pillar
};

// North Dungeon 2 (West of North Town) - Frozen Ruins
const layout1F = [
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WW....................................WW",
    "WW.IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII.WW",
    "WW.I................................I.WW",
    "WW.I.WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW.I.WW",
    "WW.I.WW..........................WW.I.WW",
    "WW.I.WW.IIIIIIIIIIIIIIIIIIIIIIII.WW.I.WW",
    "WW.I.WW.I......................I.WW.I.WW",
    "WW.I.WW.I.WWWWWWWWWWWWWWWWWWWW.I.WW.I.WW",
    "WW.I.WW.I.WW................WW.I.WW.I.WW",
    "WW.I.WW.I.WW.IIIIIIIIIIIIII.WW.I.WW.I.WW",
    "WW.I.WW.I.WW.I............I.WW.I.WW.I.WW",
    "WW.I.WW.I.WW.I.WWWWWWWWWW.I.WW.I.WW.I.WW",
    "WW.I.WW.I.WW.I.W........W.I.WW.I.WW.I.WW",
    "WW.I.WW.I.WW.I.W.IIIIII.W.I.WW.I.WW.I.WW",
    "WW.I.WW.I.WW.I.W.I....I.W.I.WW.I.WW.I.WW",
    "WW.I.WW.I.WW.I.W.I.WW.I.W.I.WW.I.WW.I.WW",
    "WW.I.WW.I.WW.I.W.I.WW.I.W.I.WW.I.WW.I.WW",
    "WW.I.WW.I.WW.I.W.I.UU.I.W.I.WW.I.WW.I.WW",
    "WW.I.WW.I.WW.I.W.I....I.W.I.WW.I.WW.I.WW",
    "WW.I.WW.I.WW.I.W.IIIIII.W.I.WW.I.WW.I.WW",
    "WW.I.WW.I.WW.I.W........W.I.WW.I.WW.I.WW",
    "WW.I.WW.I.WW.I.WWWWWWWWWW.I.WW.I.WW.I.WW",
    "WW.I.WW.I.WW.I............I.WW.I.WW.I.WW",
    "WW.I.WW.I.WW.IIIIIIIIIIIIII.WW.I.WW.I.WW",
    "WW.I.WW.I.WW................WW.I.WW.I.WW",
    "WW.I.WW.I.WWWWWWWWWWWWWWWWWWWW.I.WW.I.WW",
    "WW.I.WW.I......................I.WW.I.WW",
    "WW.I.WW.IIIIIIIIIIIIIIIIIIIIIIII.WW.I.WW",
    "WW.I.WW..........................WW.I.WW",
    "WW.I.WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW.I.WW",
    "WW.I................................I.WW",
    "WW.IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII.WW",
    "WW....................................WW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWEWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];
// Entrance at x=14, y=37 (West side approach but entered from bottom for simplicity in layout)

export const NorthDungeon2 = {
    w: 40, h: 40,
    tiles: mapFromLayout(layout1F, mapping),
    area: 'north_dungeon_2',
    baseTile: T.STONE,
    encounterRate: 0.1,
    npcs: [],
    warps: [
        { x: 14, y: 37, to: 'north', tx: 0, ty: 7 }, // West Exit of North Town
        { x: 19, y: 18, to: 'north_dungeon_2_2f', tx: 19, ty: 18 }
    ],
    onLoad: (m) => {
        m.tiles[18][19] = T.STAIRS;
    },
    start: { x: 14, y: 37 }
};

// 2F
const layout2F = [
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW...........WWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW...........WWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW...........WWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW...........WWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW.....C.....WWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW...........WWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW...........WWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW...D......WWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW...........WWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW...........WWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW...........WWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW...........WWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW...........WWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];

export const NorthDungeon2_2F = {
    w: 40, h: 40,
    tiles: mapFromLayout(layout2F, mapping),
    area: 'north_dungeon_2_2f',
    baseTile: T.STONE,
    encounterRate: 0.05,
    npcs: [
        { x: 19, y: 12, sprite: 'chest', msg: '白銀の鎧を見つけた！（素材/装備）' }
    ],
    warps: [
        { x: 17, y: 15, to: 'north_dungeon_2', tx: 19, ty: 18 }
    ],
    onLoad: (m) => {
        m.tiles[15][17] = T.STAIRS;
    },
    start: { x: 17, y: 15 }
};
