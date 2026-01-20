import { S, M, createField, createDungeon } from './helpers.js';

export function initNorthArea(Maps, T) {
    // --- 1週目: 雪原 ---
    const nt1 = createField(T);
    for (let y = 1; y < S - 1; y++) nt1[y][M] = T.PATH;
    nt1[S-1][M] = T.EXIT;

    Maps.data.north_snowfield = {
        w: S, h: S, tiles: nt1, area: 'north', week1Map: true,
        npcs: [{ id: 'northBoss', type: 'enemy_yeti', img: 'ice_golem_map', x: M, y: 3, areaBoss: 'north', blocking: true }],
        warps: [{ x: M, y: S-1, to: 'village', tx: 12, ty: 1 }],
        start: { x: M, y: S-2 }
    };

    // --- 2週目: ステージ1 (雪原) ---
    const n1 = createField(T);
    for (let y = 1; y < S - 1; y++) n1[y][M] = T.PATH;
    n1[S-1][M] = T.EXIT;

    Maps.data.north_stage1 = {
        w: S, h: S, tiles: n1, area: 'north', week2Map: true,
        npcs: [{ id: 'n1_sign', type: 'signpost', x: M + 2, y: M, msg: '【氷の平原】', blocking: true }],
        warps: [
            { x: M, y: S-1, to: 'village', tx: 12, ty: 1 },
            { x: M, y: 0, to: 'north_stage2', tx: M, ty: S-2 }
        ],
        start: { x: M, y: S-2 }
    };

    // --- 2週目: ステージ2 (洞窟) ---
    const n2 = createDungeon(T);
    for (let y = 1; y < S - 1; y++) n2[y][M] = T.PATH;
    n2[S-1][M] = T.EXIT;

    Maps.data.north_stage2 = {
        w: S, h: S, tiles: n2, area: 'north', week2Map: true,
        warps: [
            { x: M, y: S-1, to: 'north_stage1', tx: M, ty: 1 },
            { x: M, y: 0, to: 'north_boss_room', tx: M, ty: S-2 }
        ],
        start: { x: M, y: S-2 }
    };

    // --- 2週目: ボス部屋 ---
    const nb = createField(T);
    for (let y = 3; y < S - 1; y++) nb[y][M] = T.PATH;
    nb[S-1][M] = T.EXIT;

    Maps.data.north_boss_room = {
        w: S, h: S, tiles: nb, area: 'north', week2Map: true,
        npcs: [{ id: 'northTrueBoss', type: 'enemy_yeti', img: 'ice_golem_map', x: M, y: 3, areaBoss: 'north', trueAreaBoss: true, blocking: true }],
        warps: [
            { x: M, y: S-1, to: 'north_stage2', tx: M, ty: 1 },
            { x: M, y: 0, to: 'demon_castle', tx: M, ty: S-2, requiresBoss: 'north' }
        ],
        start: { x: M, y: S-2 }
    };
}