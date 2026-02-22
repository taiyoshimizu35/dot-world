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

    // Exits (East -> World, Others -> Dungeon)
    const midX = Math.floor(W / 2);
    const midY = Math.floor(H / 2);

    // Make exits passable
    tiles[midY][W - 1] = baseTile; // East
    tiles[0][midX] = baseTile; // North
    tiles[midY][0] = baseTile; // West
    tiles[H - 1][midX] = baseTile; // South

    // Tiles remain baseTile

    return {
        w: W, h: H, tiles: tiles,
        area: areaName,
        baseTile: baseTile,
        npcs: [
            // Gordon & Gawain Event
            {
                x: 15, y: 10, name: 'でっぷりした男', img: 'gordon',
                blocking: true,
                hideFlag: 'west_merchant_event',
                onInteract: () => {
                    Msg.show('でっぷりした男「ひぃぃ！ 魔物が出たぞ！ ガウェイン、何とかしろ！」\n老騎士「御意。……しかし数が多すぎるな。」', () => {
                        Msg.choice('魔物に襲われているようだ……', ['助太刀する', '立ち去る'], (idx) => {
                            if (idx === 0) {
                                Msg.show('勇者「加勢するぞ！」\n（魔物を蹴散らした！）', () => {
                                    Msg.show('でっぷりした男「ふぅ、助かったぜ。俺は豪商のゴルドン。こっちは護衛のガウェインだ。」\n老騎士「……助太刀感謝する。私一人では商人殿を守り切れなかったやもしれん。」', () => {
                                        Msg.show('ゴルドン「あんた強いな！ 恩着せがましいが、俺たちも同行させてくれ。金儲けの臭いがするぜ！」\nガウェイン「主の命なれば。私の盾、役立ててくだされ。」', () => {
                                            Msg.show('（ゴルドンとガウェインが仲間になった！）', () => {
                                                Party2.add('gordon');
                                                Party2.add('gawain');
                                                QuestSystem2.set('west_merchant_event');
                                            });
                                        });
                                    });
                                });
                            } else {
                                Msg.show('（他人の揉め事に関わるのはやめておこう……）');
                            }
                        });
                    });
                }
            },
            {
                x: 14, y: 10, name: '老騎士', img: 'gawain',
                blocking: true,
                hideFlag: 'west_merchant_event',
                msg: '「主はお下がりくだされ！」'
            },

            // Area Boss
            {
                x: 10, y: 3, name: '砂塵の覇者', img: 'desert_scorpion',
                type: 'boss', bossId: 'west',
                setFlag: 'west_boss_defeated',
                afterMsg: '砂塵の覇者は崩れ去った。',
                repeatable: false
            }
        ],
        warps: [
            // East: World Map
            {
                x: W - 1, y: midY,
                onWarp: () => { import('../../../world_map.js').then(m => m.WorldMap.open()); }
            },
            // North: Dungeon 1
            { x: midX, y: 0, to: 'west_dungeon_1', tx: 10, ty: 13 },
            // West: Dungeon 2
            { x: 0, y: midY, to: 'west_dungeon_2', tx: 18, ty: 7 },
            // South: Dungeon 3
            { x: midX, y: H - 1, to: 'west_dungeon_3', tx: 10, ty: 2 }
        ],
        start: { x: midX, y: midY },
        encounterRate: 0.0
    };
};

export const WestMap = createMap('west', T.SAND);
