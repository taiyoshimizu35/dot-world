
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
    '.': T.floor_ice || T.GRAVEL,
    'S': T.STONE,
    'T': T.TREE // White tree if available
};

// North Dungeon 3 (East of North Town) - Snowfield
const layout1F = [
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WW....................................WW",
    "WW.....TT......TT......TT......TT.....WW",
    "WW.....TT......TT......TT......TT.....WW",
    "WW....................................WW",
    "WW....................................WW",
    "WW....................................WW",
    "WW...................TT...............WW",
    "WW.......TT...........................WW",
    "WW.......TT...........................WW",
    "WW.......TT...........................WW",
    "WW...........................TT.......WW",
    "WW...........................TT.......WW",
    "WW....................................WW",
    "WW....................................WW",
    "WW..............E.....................WW",
    "WW....................................WW",
    "WW....................................WW",
    "WW....................................WW",
    "WW....................................WW",
    "WW.......TT..................TT.......WW",
    "WW.......TT.........TT.......TT.......WW",
    "WW.......TT.........TT................WW",
    "WW..................TT................WW",
    "WW..........................TT........WW",
    "WW..........................TT........WW",
    "WW.......TT...........................WW",
    "WW.......TT...........................WW",
    "WW....................................WW",
    "WW..............................TT....WW",
    "WW.......TT.....................TT....WW",
    "WW.......TT...........................WW",
    "WW...................TT...............WW",
    "WW...................TT...............WW",
    "WW....................................WW",
    "WW......TTTT...................TT.....WW",
    "WW......TTTT...................TT.....WW",
    "WW...................TT........TT.....WW",
    "WW.................................UU.WW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];
// Entrance at x=16, y=15
// Stairs at x=37, y=38

export const NorthDungeon3 = {
    w: 40, h: 40,
    tiles: mapFromLayout(layout1F, mapping),
    area: 'north_dungeon_3',
    baseTile: T.STONE,
    encounterRate: 0.1,
    npcs: [],
    warps: [
        { x: 16, y: 15, to: 'north', tx: 19, ty: 7 }, // East Exit of North Town
        { x: 37, y: 38, to: 'north_dungeon_3_2f', tx: 37, ty: 38 }
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
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW..........WWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW.....C....WWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWW.....D....WWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];

export const NorthDungeon3_2F = {
    w: 40, h: 40,
    tiles: mapFromLayout(layout2F, mapping),
    area: 'north_dungeon_3_2f',
    baseTile: T.STONE,
    encounterRate: 0.1,
    npcs: [
        { x: 19, y: 38, sprite: 'chest', msg: '巨人の指輪を見つけた！（素材）' }
    ],
    warps: [
        { x: 19, y: 39, to: 'north_dungeon_3', tx: 37, ty: 37 }
    ],
    onLoad: (m) => {
        m.tiles[39][19] = T.STAIRS;
    },
    start: { x: 19, y: 39 }
};
