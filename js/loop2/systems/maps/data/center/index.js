import { GameConfig } from '../../../../../constants.js';
import { QuestSystem2, StoryFlags } from '../../../../quest.js';
import { Party2 } from '../../../../party.js';
import { Msg } from '../../../../../core/message.js';

const T = GameConfig.TILE_TYPES;
const W = 20;
const H = 15;

// Basic Tile Setup
const createMap = (areaName, baseTile) => {
    const tiles = [];
    for (let y = 0; y < H; y++) {
        tiles[y] = [];
        for (let x = 0; x < W; x++) {
            if (x === 0 || x === W - 1 || y === 0 || y === H - 1) tiles[y][x] = T.WALL;
            else tiles[y][x] = baseTile;
        }
    }
    // Exit at bottom center
    tiles[H - 1][Math.floor(W / 2)] = T.EXIT;

    return {
        w: W, h: H, tiles: tiles,
        area: areaName,
        baseTile: baseTile,
        start: { x: Math.floor(W / 2), y: H - 2 },
        warps: [
            // South: World Map
            {
                x: Math.floor(W / 2),
                y: H - 1,
                onWarp: () => {
                    import('../../../world_map.js').then(m => m.WorldMap.open());
                }
            },
            // North: Demon Castle (Unlockable)
            {
                x: Math.floor(W / 2),
                y: 0,
                to: 'demon', // Warp to Demon Map
                requiresDemonCastle: true, // Manager handles check
                tx: 10, ty: 13
            }
        ],
        encounterRate: 0, // Safe zone
        npcs: [
            { x: 10, y: 5, sprite: 'goddes', savePoint: true, blocking: true },
            {
                x: 10, y: 1, name: '城門', img: 'door',
                msg: '堅く閉ざされている……\n四方のエリアボスを倒さねば開かないようだ。',
                blocking: true,
                hideFlag: 'demon_castle_open'
            },
            {
                x: 5, y: 7, name: '商人', sprite: 'villager',
                shop: true, msg: '「不要な素材なら買い取るぜ！」'
            },
            // ヒロイン導入イベント
            {
                x: 9, y: 12, name: 'ルルシア', img: 'lulusia',
                blocking: true,
                hideFlag: 'intro_done', // 加入後は消える
                onInteract: () => {
                    Msg.show('ルルシア「気がつきましたか、勇者様！」\n勇者「……！？ 魔王は！？ 俺はどうなった？」', () => {
                        Msg.show('ルルシア「圧倒的な力でした……私がいちかばちかで空間転移魔法を使い、なんとか貴方だけを助け出せたのです。」\n勇者「そうか……お前が……。」', () => {
                            Msg.show('ルルシア「はい。……魔王を倒すため、四方の結界を解く必要があります。私も同行させてください！」\n（ルルシアが仲間になった！）', () => {
                                Party2.add('lulusia');
                                QuestSystem2.set('intro_done');
                            });
                        });
                    });
                }
            },
            // 酒場のマスター (情報屋)
            {
                x: 15, y: 12, name: '酒場のマスター', sprite: 'villager_old',
                blocking: true,
                onInteract: () => {
                    Msg.choice('「よう、あんた。外の噂でも聞きたいかい？」', ['噂を聞く', 'やめる'], (idx) => {
                        if (idx === 0) {
                            const hints = [];
                            if (!Party2.isMember('rin')) hints.push('「東の森から、物騒な魔物の咆哮が聞こえやがる。…何か別の気配も混じってるな。」');
                            if (!Party2.isMember('elena')) hints.push('「西の遺跡に、杖を持った小娘が入っていったらしい。死に急ぐつもりか…？」');
                            if (!Party2.isMember('aldo')) hints.push('「南の古戦場跡で、剣の腕試しをしてる物騒な若僧がいるとよ。」');
                            if (!Party2.isMember('george')) hints.push('「東の村に向かった行商人が、変な女に絡まれてるってよ。」');
                            if (!Party2.isMember('gordon')) hints.push('「西の城塞都市あたりで、成金が護衛つきで宝探ししてるらしいぜ。」');
                            if (!Party2.isMember('sophina')) hints.push('「南の洋館には近寄らない方がいい。ヤバい魔法研究をしてる奴がいる。」');

                            if (hints.length > 0) {
                                // ランダムなヒントを1つ
                                const hint = hints[Math.floor(Math.random() * hints.length)];
                                Msg.show(hint);
                            } else {
                                Msg.show('「もう俺が知ってる新しい噂はねえな。あんたたちなら魔王も倒せるんじゃねえか？」');
                            }
                        }
                    });
                }
            }
        ]
    };
};

export const CenterMap = createMap('center', T.FLOOR);
