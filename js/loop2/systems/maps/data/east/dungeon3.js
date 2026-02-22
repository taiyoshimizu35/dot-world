
import { GameConfig } from '../../../../../constants.js';
import { Party2 } from '../../../../party.js';
import { Msg } from '../../../../../core/message.js';
import { Battle2 } from '../../../battle/core.js';
import { QuestSystem2 } from '../../../../quest.js';

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
        { x: 9, y: 3, sprite: 'chest', msg: '宝箱だ！（中身はまだない）' },
        {
            x: 9, y: 7, name: 'リン', img: 'rin',
            blocking: true,
            hideFlag: 'rin_joined',
            onInteract: () => {
                Msg.show('リン「きゃあっ！ 誰か助けて！」\n（魔物の群れに囲まれている！）', () => {
                    Msg.choice('助けますか？', ['助ける', '見捨てる'], (idx) => {
                        if (idx === 0) {
                            // Dummy encounter for rescue
                            // Real game would hook a specific battle here, using a normal random encounter as a stand-in
                            Msg.show('勇者「そこまでだ！」', () => {
                                // Since Battle2 triggers asynchronous loops, hook into its post-battle callback or just join after dialogue
                                // For simplicity here, we add her immediately assuming the fight is skipped/won via narrative
                                Msg.show('リン「ありがとう、助かったわ！\n……貴方の剣技、姉さんが教えてくれた技に似てる。姉さんを探す旅、私も同行させて！」', () => {
                                    Party2.add('rin');
                                    QuestSystem2.set('rin_joined');
                                });
                            });
                        }
                    });
                });
            }
        }
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
