
import { GameConfig } from '../../../../../constants.js';

const T = GameConfig.TILE_TYPES;
const W = 20;
const H = 15;

// Dungeon 3 (South of Town)
// 1F: Enter from North, Stairs at South
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
    'G': T.GRAVEL // Gravel path
};

// Dungeon 3 (South of Town) - Hunter's Trail
const layout1F = [
    "WWWWWWWWWEWWWWWWWWWW",
    "WWWWWWWWWGGWWWWWWWWW",
    "WWWWWWWWWGGWWWWWWWWW",
    "WWWWGGGGG11GGGGGWWWW",
    "WWWGGWWWWWWWWWWGGWWW",
    "WWGGWGGGGGGGGGGWGGWW",
    "WGGWWGGWWWWWWGGWWGGW",
    "WGGWWGGWWWWWWGGWWGGW",
    "WGGWWGGGGGGGGGGWWGGW",
    "WGGWWWWWWWWWWWWWWGGW",
    "WGGGGGGGGGGGGGGGGGGW",
    "WWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWUWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWW"
];
// E = Entrance (North, x=9)
// U = Stairs Up (South, x=8, y=13)

export const EastDungeon3 = {
    w: 20, h: 15,
    tiles: mapFromLayout(layout1F, mapping),
    area: 'east_dungeon_3',
    baseTile: T.STONE,
    encounterRate: 0.1,
    npcs: [],
    warps: [
        // To Town (North Exit)
        { x: 9, y: 0, to: 'east', tx: 10, ty: 13 }, // Land at South entrance of Town
        // To 2F (South Stairs)
        { x: 8, y: 13, to: 'east_dungeon_3_2f', tx: 8, ty: 13 }
    ],
    onLoad: (m) => {
        m.tiles[13][8] = T.STAIRS;
    },
    start: { x: 9, y: 1 }
};

// 2F: Boss Room
const layout2F = [
    "WWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWCWWWWWWWWWW",
    "WWWWWWWW....WWWWWWWW",
    "WWWWWWWW....WWWWWWWW",
    "WWWWWWWW....WWWWWWWW",
    "WWWWWWWW....WWWWWWWW",
    "WWWWWWWW....WWWWWWWW",
    "WWWWWWWW....WWWWWWWW",
    "WWWWWWWW....WWWWWWWW",
    "WWWWWWWW....WWWWWWWW",
    "WWWWWWWW....WWWWWWWW",
    "WWWWWWWWD...WWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWW"
];

export const EastDungeon3_2F = {
    w: 20, h: 15,
    tiles: mapFromLayout(layout2F, mapping),
    area: 'east_dungeon_3_2f',
    baseTile: T.STONE,
    encounterRate: 0.0,
    npcs: [
        { x: 9, y: 3, sprite: 'chest', msg: '宝箱だ！（中身はまだない）' }
    ],
    warps: [
        // To 1F
        { x: 8, y: 13, to: 'east_dungeon_3', tx: 8, ty: 12 }
    ],
    onLoad: (m) => {
        m.tiles[13][8] = T.STAIRS;
    },
    start: { x: 8, y: 13 }
};
