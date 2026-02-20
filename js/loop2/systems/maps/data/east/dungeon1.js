
import { GameConfig } from '../../../../../constants.js';

const T = GameConfig.TILE_TYPES;
const W = 20;
const H = 15;

// Dungeon 1 (North of Town)
// 1F: Enter from South, Stairs at North
// Helper to map string layout to tiles
const mapFromLayout = (layout, mapping) => {
    const tiles = [];
    const H = layout.length;
    const W = layout[0].length;
    for (let y = 0; y < H; y++) {
        tiles[y] = [];
        for (let x = 0; x < W; x++) {
            const char = layout[y][x];
            tiles[y][x] = mapping[char] || GameConfig.TILE_TYPES.dungeon_floor || GameConfig.TILE_TYPES.STONE;
        }
    }
    return tiles;
};

// Dungeon 1 (North of Town) - Forest Cave
// 1F: Maze
const layout1F = [
    "WWWWWWWWWWWWWWWWWWWW",
    "WSSSSWSSSSSSSSSSSSSW",
    "WSWWSWSWWWWWWWWWWWSW",
    "WSWSSSSSSSSSSSWSSSSW",
    "WSWWWWWWWWWWWSWSWWSW",
    "WSSSSSWSSSSSSSWSSSSW",
    "WWWSWSWSWWWWWWWWWWWW",
    "WSSSWSSSWSSSSSSSSSSW",
    "WSWWWWWWSWSWWWWWWWSW",
    "WSSSSSSWSWSWSSSSSSSW",
    "WWWWWWWSWSWSWWWWWWWW",
    "WSSSSSSSSSWSSSSSSSSW",
    "WSWWWWWWWWWWWWWWWWSW",
    "WSSSSSSSSSESSSSSSSSW",
    "WWWWWWWWWWWWWWWWWWWW"
];

const mapping = {
    'W': T.WALL,
    'S': T.STONE,
    'E': T.STONE, // Entrance position (South)
    'U': T.STAIRS // Stairs Up (handled via logic mostly, but good for vis)
};

export const EastDungeon1 = {
    w: 20, h: 15,
    tiles: mapFromLayout(layout1F, mapping),
    area: 'east_dungeon_1',
    baseTile: T.STONE,
    encounterRate: 0.1,
    npcs: [
        { x: 10, y: 12, msg: 'この先は危険だ…' } // Moved near entrance
    ],
    warps: [
        // To Town (South Exit)
        { x: 9, y: 13, to: 'east', tx: 10, ty: 1 }, // Land at North entrance of Town
        // To 2F (North Stairs - visually placed at 5,1 based on maze?)
        // Let's place stairs at top left (1,1) ? Or somewhere hard to reach.
        // Layout: Top Left seems reachable.
        // Let's put stairs at x=1, y=1
        { x: 1, y: 1, to: 'east_dungeon_1_2f', tx: 1, ty: 13 }
    ],
    // Add visual stairs tile manually
    onLoad: (m) => {
        m.tiles[1][1] = T.STAIRS;
    },
    start: { x: 9, y: 13 }
};

// 2F: Boss Room
const layout2F = [
    "WWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWSSSSSWWWWW",
    "WWWWWWWWSSBSSSSWWWWW",
    "WWWWWWWWSSCSSSSWWWWW",
    "WWWWWWWWSSSSSSSWWWWW",
    "WWWWWWWWWWWSWWWWWWWW",
    "WWWWWWWWWWWSWWWWWWWW",
    "WWWWWWWWWWWSWWWWWWWW",
    "WWWWWWWWWWWSWWWWWWWW",
    "WWWWWWWWWWWSWWWWWWWW",
    "WSSSSSSSSSSSSSSSSSSW",
    "WDWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWW"
];
// D = Down Stairs (from 1F)

export const EastDungeon1_2F = {
    w: 20, h: 15,
    tiles: mapFromLayout(layout2F, mapping),
    area: 'east_dungeon_1_2f',
    baseTile: T.STONE,
    encounterRate: 0.0,
    npcs: [
        { x: 10, y: 5, sprite: 'chest', msg: '宝箱だ！（中身はまだない）' }
    ],
    warps: [
        // To 1F
        { x: 1, y: 13, to: 'east_dungeon_1', tx: 1, ty: 2 }
    ],
    onLoad: (m) => {
        m.tiles[13][1] = T.STAIRS; // Down Stairs
    },
    start: { x: 1, y: 13 }
};
