
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
    '.': T.GRAVEL,
    'S': T.STONE,
};

// South Dungeon 3 (East of South Town) - Ash Plains
const layout1F = [
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WW....................................WW",
    "WW.......WWWWWWWW............WWWW.....WW",
    "WW.......WWWWWWWW............WWWW.....WW",
    "WW....................................WW",
    "WW....................................WW",
    "WW....................................WW",
    "WW...................WW...............WW",
    "WW.......WW...........................WW",
    "WW.......WW...........................WW",
    "WW.......WW...........................WW",
    "WW...........................WW.......WW",
    "WW...........................WW.......WW",
    "WW....................................WW",
    "WW....................................WW",
    "WW..............E.....................WW",
    "WW....................................WW",
    "WW....................................WW",
    "WW....................................WW",
    "WW....................................WW",
    "WW.......WW..................WW.......WW",
    "WW.......WW.........WW.......WW.......WW",
    "WW.......WW.........WW................WW",
    "WW..................WW................WW",
    "WW..........................WW........WW",
    "WW..........................WW........WW",
    "WW.......WW...........................WW",
    "WW.......WW...........................WW",
    "WW....................................WW",
    "WW..............................WW....WW",
    "WW.......WW.....................WW....WW",
    "WW.......WW...........................WW",
    "WW...................WW...............WW",
    "WW...................WW...............WW",
    "WW....................................WW",
    "WW......WWWW...................WW.....WW",
    "WW......WWWW...................WW.....WW",
    "WW...................WW........WW.....WW",
    "WW.................................UU.WW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];
// Entrance at x=16, y=15
// Stairs at x=37, y=38

export const SouthDungeon3 = {
    w: 40, h: 40,
    tiles: mapFromLayout(layout1F, mapping),
    area: 'south_dungeon_3',
    baseTile: T.GRAVEL,
    encounterRate: 0.1,
    npcs: [],
    warps: [
        { x: 16, y: 15, to: 'south', tx: 18, ty: 7 },
        { x: 37, y: 38, to: 'south_dungeon_3_2f', tx: 37, ty: 38 }
    ],
    onLoad: (m) => {
        m.tiles[38][37] = T.STAIRS;
    },
    start: { x: 16, y: 15 }
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
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW..........WWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW..........WWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW.....C....WWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW..........WWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW..........WWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW.....D....WWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];

export const SouthDungeon3_2F = {
    w: 40, h: 40,
    tiles: mapFromLayout(layout2F, mapping),
    area: 'south_dungeon_3_2f',
    baseTile: T.GRAVEL,
    encounterRate: 0.1,
    npcs: [
        { x: 19, y: 34, sprite: 'chest', msg: 'ミスリル鉱石を見つけた！（素材）' }
    ],
    warps: [
        { x: 19, y: 37, to: 'south_dungeon_3', tx: 37, ty: 37 }
    ],
    onLoad: (m) => {
        m.tiles[37][19] = T.STAIRS;
    },
    start: { x: 19, y: 37 }
};
