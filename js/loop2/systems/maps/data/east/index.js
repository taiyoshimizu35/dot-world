import { GameConfig } from '../../../../../constants.js';
import { QuestSystem2 } from '../../../../quest.js';
import { Party2 } from '../../../../party.js';
import { Msg } from '../../../../../core/message.js';

const T = GameConfig.TILE_TYPES;
const W = 20;
const H = 15;

const createMap = (areaName, baseTile) => {
    const tiles = [];
    for (let y = 0; y < H; y++) {
        tiles[y] = [];
        for (let x = 0; x < W; x++) {
            if (x === 0 || x === W - 1 || y === 0 || y === H - 1) tiles[y][x] = T.WALL;
            else tiles[y][x] = baseTile;
        }
    }

    // Exits (West -> World, Others -> Dungeon)
    const midX = Math.floor(W / 2);
    const midY = Math.floor(H / 2);

    // Make exits passable
    tiles[midY][0] = baseTile; // West
    tiles[0][midX] = baseTile; // North
    tiles[midY][W - 1] = baseTile; // East
    tiles[H - 1][midX] = baseTile; // South


    return {
        w: W, h: H, tiles: tiles,
        area: areaName,
        baseTile: baseTile,
        npcs: [
            // Area Boss (Appears if not defeated)
            {
                x: 10, y: 2, name: '森の主', img: 'wolf',
                type: 'boss', bossId: 'east',
                reqFlag: null, // Always visible until defeated
                setFlag: 'east_boss_defeated', // Hide if defeated (Logic in map loader needed or manual check)
                afterMsg: '森の主は倒れた。',
                repeatable: false
            },
            // Shera & George Encounter Event
            {
                x: 16, y: 12, name: '怪しい女', img: 'shera',
                blocking: true,
                hideFlag: 'east_thief_event', // Custom flag
                onInteract: () => {
                    Msg.show('怪しい女「ほら、さっさとその荷物を渡しな！」\n気の弱そうな男「ひぃっ！ 命だけは……！」', () => {
                        Msg.choice('女が男を脅している……', ['助ける', '見守る'], (idx) => {
                            if (idx === 0) {
                                Msg.show('勇者「そこまでだ！」\n怪しい女「ちっ、邪魔が入ったか。……あんた、なかなか見込みがありそうじゃん。アタシはシェラ。組まない？」', () => {
                                    Msg.show('気の弱そうな男「あ、ありがとうございます……私は行商人のジョージです。お礼に荷物持ちでもなんでもします！」', () => {
                                        Msg.show('（シェラとジョージが仲間になった！）', () => {
                                            Party2.add('shera');
                                            Party2.add('george');
                                            QuestSystem2.set('east_thief_event'); // Hides both NPCs
                                        });
                                    });
                                });
                            } else {
                                Msg.show('（今は関わらない方がよさそうだ……）');
                            }
                        });
                    });
                }
            },
            {
                x: 15, y: 12, name: '行商人', img: 'george',
                blocking: true,
                hideFlag: 'east_thief_event',
                msg: '「ひぃっ！ 助けて……！」'
            }
        ],
        warps: [
            // West: World Map
            {
                x: 0, y: midY,
                onWarp: () => { import('../../../world_map.js').then(m => m.WorldMap.open()); }
            },
            // North: Dungeon 1
            { x: midX, y: 0, to: 'east_dungeon_1', tx: 10, ty: 13 },
            // East: Dungeon 2
            { x: W - 1, y: midY, to: 'east_dungeon_2', tx: 1, ty: 7 },
            // South: Dungeon 3
            { x: midX, y: H - 1, to: 'east_dungeon_3', tx: 10, ty: 1 }
        ],
        start: { x: midX, y: midY },
        encounterRate: 0.0
    };
};

export const EastMap = createMap('east', T.GRASS);
