
import { GameConfig } from '../../../../../constants.js';
import { Party2 } from '../../../../party.js';
import { Msg } from '../../../../../core/message.js';
import { Battle2 } from '../../../battle/core.js';
import { QuestSystem2 } from '../../../../quest.js';

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
    '.': T.GRAVEL, // Dark ground
    'S': T.STONE,
    'L': T.LAVA || T.WATER, // Lava (if implemented, else Water/Red Water)
    'B': T.STONE,
    'C': T.STONE
};

// South Dungeon 1 (South of South Town) - Volcanic Cave
// 40x40 Layout
const layout1F = [
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WW....................................WW",
    "WW....................................WW",
    "WW...WWWWWWWWWWWWWW...WWWWWWWWWWWWW...WW",
    "WW...WWWWWWWWWWWWWW...WWWWWWWWWWWWW...WW",
    "WW.........WW...............WW........WW",
    "WW.........WW...............WW........WW",
    "WW...WWW...WW...SSSSSSSSS...WW...WWW..WW",
    "WW...WWW...WW...SSSSSSSSS...WW...WWW..WW",
    "WW...WWW...WW...SSSSSSSSS...WW...WWW..WW",
    "WW.............SSSSSSSSSSS............WW",
    "WW.............SSSSSSSSSSS............WW",
    "WW......WW.....SSSSSSSSSSS.....WW.....WW",
    "WW......WW......SSSSSSSSS......WW.....WW",
    "WW......WW......SSSSSSSSS......WW.....WW",
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
    "WW......WW......SSSSSSSSS......WW.....WW",
    "WW......WW......SSSSSSSSS......WW.....WW",
    "WW......WW.....SSSSSSSSSSS.....WW.....WW",
    "WW.............SSSSSSSSSSS............WW",
    "WW.............SSSSSSSSSSS............WW",
    "WW...WWW...WW...SSSSSSSSS...WW...WWW..WW",
    "WW...WWW...WW...SSSSSSSSS...WW...WWW..WW",
    "WW.........WW.......E.......WW........WW",
    "WW.........WW.......E.......WW........WW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];
// Entrance at x=20, y=37 (South)

export const SouthDungeon1 = {
    w: 40, h: 40,
    tiles: mapFromLayout(layout1F, mapping),
    area: 'south_dungeon_1',
    baseTile: T.GRAVEL,
    encounterRate: 0.15,
    npcs: [
        { x: 20, y: 35, msg: '熱気がすごい…' },
        {
            x: 20, y: 25, name: '鋭い目つきの剣士', img: 'aldo',
            blocking: true,
            hideFlag: 'aldo_joined',
            onInteract: () => {
                Msg.show('剣士「……貴様、只者ではないな。その歩法、ただの旅人ではない。」\n勇者「お前は？」', () => {
                    Msg.choice('凄まじい剣気だ……', ['勝負を受ける', '立ち去る'], (idx) => {
                        if (idx === 0) {
                            Msg.show('剣士「俺はアルド。親父の残した剣の極致を探している。……いざ、尋常に！」', () => {
                                // Dummy battle for Aldo duel
                                Msg.show('（激しい打ち合いの末、アルドの剣が弾き飛ばされた！）', () => {
                                    Msg.show('アルド「見事だ……。親父の言っていた『無心の剣』、貴様の太刀筋にそれを見た。」', () => {
                                        Msg.show('アルド「頼む、俺を弟子にしてくれ！ 貴様と同行すれば、俺の剣も高みに……！」\n（アルドが仲間になった！）', () => {
                                            Party2.add('aldo');
                                            QuestSystem2.set('aldo_joined');
                                        });
                                    });
                                });
                            });
                        } else {
                            Msg.show('アルド「……臆したか。まあいい、俺は見込みのある奴としか刃を交えん。」');
                        }
                    });
                });
            }
        }
    ],
    warps: [
        { x: 20, y: 37, to: 'south', tx: 10, ty: 13 },
        { x: 20, y: 2, to: 'south_dungeon_1_2f', tx: 20, ty: 37 }
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

export const SouthDungeon1_2F = {
    w: 40, h: 40,
    tiles: mapFromLayout(layout2F, mapping),
    area: 'south_dungeon_1_2f',
    baseTile: T.GRAVEL,
    encounterRate: 0.1,
    npcs: [
        { x: 20, y: 12, sprite: 'chest', msg: '炎のクリスタルを見つけた！（素材）' }
    ],
    warps: [
        { x: 20, y: 37, to: 'south_dungeon_1', tx: 20, ty: 3 }
    ],
    onLoad: (m) => {
        m.tiles[37][20] = T.STAIRS;
    },
    start: { x: 20, y: 37 }
};
