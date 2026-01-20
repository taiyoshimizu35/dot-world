import { S, M } from './helpers.js';

export function initVillage(Maps, T) {
    const vw = 25, vh = S; // 25x15
    const vt = [];
    for (let y = 0; y < vh; y++) {
        const r = [];
        for (let x = 0; x < vw; x++) r.push(T.GRASS);
        vt.push(r);
    }

    // 中心線(M=7)に道を引く
    for (let x = 0; x < vw; x++) vt[M][x] = T.PATH;  // 横道
    for (let y = 0; y < vh; y++) vt[y][12] = T.PATH; // 縦道

    // 外枠と出入口
    for (let x = 0; x < vw; x++) { vt[0][x] = T.ROCK; vt[vh-1][x] = T.ROCK; }
    for (let y = 0; y < vh; y++) { vt[y][0] = T.ROCK; vt[vw-1][y] = T.ROCK; }
    vt[M][0] = T.PATH; vt[M][vw-1] = T.PATH; // 西・東出口
    vt[0][12] = T.PATH; vt[vh-1][12] = T.PATH; // 北・南出口

    Maps.data.village = {
        w: vw, h: vh, tiles: vt,
        npcs: [
            { id: 'sign1', type: 'signpost', x: 12, y: M-2, msg: '【始まりの村】\n中心座標は7なり', blocking: true },
            { id: 'npc1', type: 'villager', x: 8, y: M, msg: 'ようこそ！', blocking: true },
            { id: 'alex_join', type: 'villager', img: 'ally_alex', x: 10, y: M+2, partyJoin: 'alex', week2Only: true, blocking: true }
        ],
        warps: [
            // 東 (tx:1, ty:7)
            { x: 24, y: M, to: 'east_stage1', tx: 1, ty: M, week2Only: true },
            { x: 24, y: M, to: 'dungeon', tx: 1, ty: M, week1Only: true },
            // 西 (tx:13, ty:7)
            { x: 0, y: M, to: 'west_stage1', tx: 13, ty: M, week2Only: true },
            { x: 0, y: M, to: 'dungeon_west', tx: 13, ty: M, week1Only: true },
            // 北 (tx:7, ty:13)
            { x: 12, y: 0, to: 'north_stage1', tx: M, ty: 13, week2Only: true },
            { x: 12, y: 0, to: 'north_snowfield', tx: M, ty: 13, week1Only: true },
            // 南 (tx:7, ty:1)
            { x: 12, y: vh-1, to: 'south_stage1', tx: M, ty: 1, week2Only: true },
            { x: 12, y: vh-1, to: 'south_forest', tx: M, ty: 1, week1Only: true }
        ],
        start: { x: 12, y: M + 2 }
    };
}