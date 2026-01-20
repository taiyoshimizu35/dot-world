import { S, M, createField, createDungeon } from './helpers.js';

export function initEastArea(Maps, T) {
    // --- 1週目: ボス直行 ---
    const et1 = createDungeon(T);
    for (let x = 1; x < S - 1; x++) et1[M][x] = T.PATH;
    et1[M][1] = T.EXIT;

    Maps.data.dungeon = {
        w: S, h: S, tiles: et1, area: 'east', week1Map: true,
        npcs: [{ id: 'eastBoss', type: 'enemy_slime', img: 'dragon_map', x: 11, y: M, areaBoss: 'east', blocking: true }],
        warps: [{ x: 1, y: M, to: 'village', tx: 23, ty: 9 }],
        start: { x: 2, y: M }
    };

    // --- 2週目: ステージ1 (森の入口) ---
    const e1 = createField(T);
    for (let x = 1; x < S - 1; x++) e1[M][x] = T.PATH;
    e1[M][1] = T.EXIT;

    Maps.data.east_stage1 = {
        w: S, h: S, tiles: e1, area: 'east', week2Map: true,
        npcs: [{ id: 'e1_sign', type: 'signpost', x: 4, y: M - 1, msg: '【炎の森 入口】', blocking: true }],
        warps: [
            { x: 1, y: M, to: 'village', tx: 23, ty: 9 },
            { x: 13, y: M, to: 'east_stage2', tx: 1, ty: M }
        ],
        start: { x: 2, y: M }
    };

    // --- 2週目: ステージ2 (迷いの小道) ---
    const e2 = createField(T);
    for (let x = 1; x < S - 1; x++) e2[M][x] = T.PATH;
    for (let y = 3; y < 12; y++) e2[y][M + 3] = T.PATH; // 分岐
    e2[M][1] = T.EXIT;

    Maps.data.east_stage2 = {
        w: S, h: S, tiles: e2, area: 'east', week2Map: true,
        npcs: [{ id: 'e2_sign', type: 'signpost', x: M + 3, y: 12, msg: '迷ったら中心へ戻れ', blocking: true }],
        warps: [
            { x: 1, y: M, to: 'east_stage1', tx: 12, ty: M },
            { x: 13, y: M, to: 'east_stage3', tx: 1, ty: M }
        ],
        start: { x: 2, y: M }
    };

    // --- 2週目: ステージ3 (竜の道) ---
    const e3 = createDungeon(T);
    for (let x = 1; x < S - 1; x++) e3[M][x] = T.PATH;
    e3[M][1] = T.EXIT;

    Maps.data.east_stage3 = {
        w: S, h: S, tiles: e3, area: 'east', week2Map: true,
        warps: [
            { x: 1, y: M, to: 'east_stage2', tx: 12, ty: M },
            { x: 13, y: M, to: 'east_boss_room', tx: 1, ty: M }
        ],
        start: { x: 2, y: M }
    };

    // --- 2週目: ボス部屋 ---
    const eb = createDungeon(T);
    for (let x = 1; x <= 11; x++) eb[M][x] = T.PATH;
    eb[M][1] = T.EXIT;

    Maps.data.east_boss_room = {
        w: S, h: S, tiles: eb, area: 'east', week2Map: true,
        npcs: [{ id: 'eastTrueBoss', type: 'enemy_slime', img: 'dragon_map', x: 11, y: M, areaBoss: 'east', trueAreaBoss: true, blocking: true }],
        warps: [{ x: 1, y: M, to: 'east_stage3', tx: 12, ty: M }],
        start: { x: 2, y: M }
    };
}