import { S, M, createField, createDungeon } from './helpers.js';

export function initSouthArea(Maps, T) {
    // --- 1週目: 墓地 ---
    const st1 = createField(T);
    for (let y = 1; y < S - 1; y++) st1[y][M] = T.PATH;
    st1[0][M] = T.EXIT;

    Maps.data.south_forest = {
        w: S, h: S, tiles: st1, area: 'south', week1Map: true,
        npcs: [{ id: 'southBoss', type: 'enemy_skeleton', img: 'phantom_knight_map', x: M, y: 11, areaBoss: 'south', blocking: true }],
        warps: [{ x: M, y: 0, to: 'village', tx: 12, ty: 16 }],
        start: { x: M, y: 1 }
    };

    // --- 2週目: ステージ1 (墓地) ---
    const s1 = createField(T);
    for (let y = 1; y < S - 1; y++) s1[y][M] = T.PATH;
    s1[0][M] = T.EXIT;

    Maps.data.south_stage1 = {
        w: S, h: S, tiles: s1, area: 'south', week2Map: true,
        npcs: [
            { id: 's1_sign', type: 'signpost', x: M - 2, y: M, msg: '【忘却の墓地】', blocking: true },
            { id: 'milia_join', type: 'villager', img: 'ally_milia', x: M + 2, y: M, partyJoin: 'milia', requiresBoss: 'west', week2Only: true, blocking: true }
        ],
        warps: [
            { x: M, y: 0, to: 'village', tx: 12, ty: 16 },
            { x: M, y: S-1, to: 'south_stage2', tx: M, ty: 1 }
        ],
        start: { x: M, y: 1 }
    };

    // --- 2週目: ボス部屋 ---
    const sb = createDungeon(T);
    for (let y = 1; y < 11; y++) sb[y][M] = T.PATH;
    sb[0][M] = T.EXIT;

    Maps.data.south_boss_room = {
        w: S, h: S, tiles: sb, area: 'south', week2Map: true,
        npcs: [{ id: 'southTrueBoss', type: 'enemy_skeleton', img: 'phantom_knight_map', x: M, y: 11, areaBoss: 'south', trueAreaBoss: true, blocking: true }],
        warps: [{ x: M, y: 0, to: 'south_stage1', tx: M, ty: S-2 }],
        start: { x: M, y: 1 }
    };
}