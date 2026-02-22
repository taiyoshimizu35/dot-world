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

    // Exits (North -> World, Others -> Dungeon)
    const midX = Math.floor(W / 2);
    const midY = Math.floor(H / 2);

    // Make exits passable
    tiles[0][midX] = baseTile; // North
    tiles[midY][0] = baseTile; // West
    tiles[H - 1][midX] = baseTile; // South
    tiles[midY][W - 1] = baseTile; // East

    return {
        w: W, h: H, tiles: tiles,
        area: areaName,
        baseTile: baseTile,
        npcs: [
            // Sophina & Kron Event
            {
                x: 14, y: 12, name: '怪しげな女', img: 'sophina',
                blocking: true,
                hideFlag: 'south_mage_event',
                onInteract: () => {
                    Msg.show('怪しげな女「ククク……そこの君、面白い魔力を秘めているわね。」\n眠そうな少年「……ふわぁ。この人から、複雑な未来が見えるよ。」', () => {
                        Msg.show('勇者「お前たちは？」\n怪しげな女「私は禁術師ソフィーナ。こっちは時魔導士のクロンよ。君の横にいる『彼女』から、凄まじいものを感じるわ。」', () => {
                            Msg.show('ルルシア「……！」\nソフィーナ「安心なさい、誰にも言わないわ。ただ私たちの研究対象として観察させてもらうわよ。」', () => {
                                Msg.show('（ソフィーナとクロンが仲間になった！）', () => {
                                    Party2.add('sophina');
                                    Party2.add('kron');
                                    QuestSystem2.set('south_mage_event');
                                });
                            });
                        });
                    });
                }
            },
            {
                x: 15, y: 12, name: '眠そうな少年', img: 'kron',
                blocking: true,
                hideFlag: 'south_mage_event',
                msg: '「……おやすみ。」'
            },

            // Area Boss
            {
                x: 10, y: 10, name: '死霊の王', img: 'skeleton_soldier',
                type: 'boss', bossId: 'south',
                setFlag: 'south_boss_defeated',
                afterMsg: '死霊の王は浄化された。',
                repeatable: false
            }
        ],
        warps: [
            // North: World Map
            {
                x: midX, y: 0,
                onWarp: () => { import('../../../world_map.js').then(m => m.WorldMap.open()); }
            },
            // West: Dungeon 1
            { x: 0, y: midY, to: 'south_dungeon_1', tx: 18, ty: 7 },
            // South: Dungeon 2
            { x: midX, y: H - 1, to: 'south_dungeon_2', tx: 10, ty: 2 },
            // East: Dungeon 3
            { x: W - 1, y: midY, to: 'south_dungeon_3', tx: 2, ty: 7 }
        ],
        start: { x: midX, y: midY },
        encounterRate: 0.0
    };
};

export const SouthMap = createMap('south', T.DIRT);
