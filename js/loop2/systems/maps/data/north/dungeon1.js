
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
    '.': T.floor_ice || T.STONE, // Ice floor if available, else Stone
    'S': T.STONE,
    'I': T.WALL, // Ice Wall
    'B': T.STONE,
    'C': T.STONE
};

// North Dungeon 1 (North of North Town) - Ice Cave
// 40x40 Layout
const layout1F = [
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WW....................................WW",
    "WW....................................WW",
    "WW...IIIIIIIIIIIIII...IIIIIIIIIIIII...WW",
    "WW...IIIIIIIIIIIIII...IIIIIIIIIIIII...WW",
    "WW.........II...............II........WW",
    "WW.........II...............II........WW",
    "WW...III...II...SSSSSSSSS...II...III..WW",
    "WW...III...II...SSSSSSSSS...II...III..WW",
    "WW...III...II...SSSSSSSSS...II...III..WW",
    "WW.............SSSSSSSSSSS............WW",
    "WW.............SSSSSSSSSSS............WW",
    "WW......II.....SSSSSSSSSSS.....II.....WW",
    "WW......II......SSSSSSSSS......II.....WW",
    "WW......II......SSSSSSSSS......II.....WW",
    "WWWWWWWWWWWWWWWWSSSSSSSSSWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWSSSSSSSSSWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWSSSSSSSSSWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWSSSSSSSSSWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWSSSSSSSSSWWWWWWWWWWWWWWW",
    "WWSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSWW",
    "WWSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSWW",
    "WWWWWWWWWWWWWWWWSSSSSSSSSWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWSSSSSSSSSWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWSSSSSSSSSWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWSSSSSSSSSWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWSSSSSSSSSWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWSSSSSSSSSWWWWWWWWWWWWWWW",
    "WW......II......SSSSSSSSS......II.....WW",
    "WW......II......SSSSSSSSS......II.....WW",
    "WW......II.....SSSSSSSSSSS.....II.....WW",
    "WW.............SSSSSSSSSSS............WW",
    "WW.............SSSSSSSSSSS............WW",
    "WW...III...II...SSSSSSSSS...II...III..WW",
    "WW...III...II...SSSSSSSSS...II...III..WW",
    "WW.........II.......E.......II........WW",
    "WW.........II.......E.......II........WW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];
// Entrance at x=20, y=37 (South)

export const NorthDungeon1 = {
    w: 40, h: 40,
    tiles: mapFromLayout(layout1F, mapping),
    area: 'north_dungeon_1',
    baseTile: T.STONE,
    encounterRate: 0.15,
    npcs: [
        { x: 20, y: 35, msg: '冷気が漂ってくる…' }
    ],
    warps: [
        { x: 20, y: 37, to: 'north', tx: 10, ty: 0 }, // Back to North Town (South Entrance)
        { x: 20, y: 2, to: 'north_dungeon_1_2f', tx: 20, ty: 37 }
    ],
    onLoad: (m) => {
        m.tiles[2][20] = T.STAIRS;
    },
    start: { x: 20, y: 37 }
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
    "WWWWWWWWWWWWWW...........WWWWWWWWWWWWWWW",
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
    "WWWWWWWWWWWWWWWWWWDWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];

export const NorthDungeon1_2F = {
    w: 40, h: 40,
    tiles: mapFromLayout(layout2F, mapping),
    area: 'north_dungeon_1_2f',
    baseTile: T.STONE,
    encounterRate: 0.1,
    npcs: [
        { x: 20, y: 12, sprite: 'chest', msg: '氷の結晶を見つけた！（素材）' }
    ],
    warps: [
        { x: 20, y: 37, to: 'north_dungeon_1', tx: 20, ty: 3 }
    ],
    onLoad: (m) => {
        m.tiles[37][20] = T.STAIRS;
    },
    start: { x: 20, y: 37 }
};
