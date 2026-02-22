
import { GameConfig } from '../../../../../constants.js';
import { Party2 } from '../../../../party.js';
import { Msg } from '../../../../../core/message.js';
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
    '.': T.SANDS,
    'R': T.ROCK // Using Rock for Canyon walls
};

// West Dungeon 3 (South of Town) - Maze Canyon
const layout1F = [
    "WWWWWWWWWWWWWEWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWW.WWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWW.WWWWWWWWWWWWWWWW",
    "W.............WW.............W",
    "W.WWWW.WWWWWW.WW.WWWWWW.WWWW.W",
    "W.WWWW.WWWWWW.WW.WWWWWW.WWWW.W",
    "W.WWWW.WWWWWW.WW.WWWWWW.WWWW.W",
    "W.............WW.............W",
    "WWWWWW.WWWWWW....WWWWWW.WWWWWW",
    "WWWWWW.WWWWWW....WWWWWW.WWWWWW",
    "WWWWWW.WWWWWW....WWWWWW.WWWWWW",
    "W............................W",
    "W.WWWW.WWWWWW.WW.WWWWWW.WWWW.W",
    "W.WWWW.WWWWWW.WW.WWWWWW.WWWW.W",
    "W.............WW.............W",
    "WWWWWW.WWWWWW....WWWWWW.WWWWWW",
    "WWWWWW.WWWWWW....WWWWWW.WWWWWW",
    "WWWWWW.WWWWWW....WWWWWW.WWWWWW",
    "W............................W",
    "W.WWWW.WWWWWW.WW.WWWWWW.WWWW.W",
    "W.WWWW.WWWWWW.WW.WWWWWW.WWWW.W",
    "W.WWWW.WWWWWW.WW.WWWWWW.WWWW.W",
    "W.............WW.............W",
    "WWWWWW.WWWWWW....WWWWWW.WWWWWW",
    "WWWWWW.WWWWWW....WWWWWW.WWWWWW",
    "WWWWWW.WWWWWW....WWWWWW.WWWWWW",
    "W............................W",
    "W.WWWW.WWWWWW.WW.WWWWWW.WWWW.W",
    "W.............WW.............W",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];
// Entrance at x=13, y=0

export const WestDungeon3 = {
    w: 30, h: 30,
    tiles: mapFromLayout(layout1F, mapping),
    area: 'west_dungeon_3',
    baseTile: T.SANDS,
    encounterRate: 0.2, // High encounter
    npcs: [],
    warps: [
        { x: 13, y: 0, to: 'west', tx: 10, ty: 13 },
        { x: 13, y: 28, to: 'west_dungeon_3_2f', tx: 13, ty: 28 }
    ],
    onLoad: (m) => {
        m.tiles[28][13] = T.STAIRS;
    },
    start: { x: 13, y: 1 }
};

// 2F
const layout2F = [
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW...C...WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWW.......WWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];

export const WestDungeon3_2F = {
    w: 30, h: 30,
    tiles: mapFromLayout(layout2F, mapping),
    area: 'west_dungeon_3_2f',
    baseTile: T.SANDS,
    encounterRate: 0.1,
    npcs: [
        { x: 15, y: 11, sprite: 'chest', msg: 'サソリの毒針を入手した！（素材）' },
        {
            x: 15, y: 9, name: '魔法使いの少女', img: 'elena',
            blocking: true,
            hideFlag: 'elena_intro',
            onInteract: () => {
                Msg.show('魔法使いの少女「はぁっ…はぁっ……。先祖の古文書は……どこ……？」', () => {
                    Msg.show('勇者「大丈夫か？ こんな砂漠の地下で何を……」\n魔法使いの少女「私、大魔術師の末裔なのに……攻撃魔法がちっとも使えないの。」', () => {
                        Msg.show('魔法使いの少女「一族から追放されたけど……せめて先代の魔力さえ取り戻せればって……」\n勇者「……攻撃なんて俺がやる。お前は治癒が得意なら、それで十分だろ？」', () => {
                            Msg.show('魔法使いの少女「え……？ ほんと？ 足手まといにならない？」\n勇者「ああ。お前の魔法が必要だ。」', () => {
                                Msg.show('エレナ「ありがとう……！ 私、エレナっていうの。よろしくお願いします！」\n（エレナが仲間になった！）', () => {
                                    Party2.add('elena');
                                    QuestSystem2.set('elena_intro');
                                });
                            });
                        });
                    });
                });
            }
        }
    ],
    warps: [
        { x: 13, y: 28, to: 'west_dungeon_3', tx: 13, ty: 27 }
    ],
    onLoad: (m) => {
        m.tiles[28][13] = T.STAIRS;
    },
    start: { x: 13, y: 28 }
};
