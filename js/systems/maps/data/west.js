import { S, M, createDungeon } from './helpers.js';

export function initWestArea(Maps, T) {
    // --- 1週目: 直行 ---
    const wt1 = createDungeon(T);
    for (let x = 1; x < S - 1; x++) wt1[M][x] = T.PATH;
    wt1[M][13] = T.EXIT;

    Maps.data.dungeon_west = {
        w: S, h: S, tiles: wt1, area: 'west', week1Map: true,
        npcs: [{ id: 'westBoss', type: 'enemy_slime', img: 'great_mage_map', x: 3, y: M, areaBoss: 'west', blocking: true }],
        warps: [{ x: 13, y: M, to: 'village', tx: 2, ty: 9 }],
        start: { x: 12, y: M }
    };

    // --- 2週目: ステージ1 (塔 1F) ---
    const w1 = createDungeon(T);
    for (let x = 1; x < S - 1; x++) w1[M][x] = T.PATH;
    w1[M][13] = T.EXIT;

    Maps.data.west_stage1 = {
        w: S, h: S, tiles: w1, area: 'west', week2Map: true,
        npcs: [
            { id: 'w1_sign', type: 'signpost', x: 10, y: M - 2, msg: '【魔塔 1F】', blocking: true },
            { id: 'rose_join', type: 'villager', img: 'ally_rose', x: 5, y: M, partyJoin: 'rose', requiresBoss: 'east', week2Only: true, blocking: true }
        ],
        warps: [
            { x: 13, y: M, to: 'village', tx: 2, ty: 9 },
            { x: 1, y: M, to: 'west_stage2', tx: 13, ty: M }
        ],
        start: { x: 12, y: M }
    };

    // --- 2週目: ステージ2 (塔 2F) ---
    const w2 = createDungeon(T);
    for (let x = 1; x < S - 1; x++) w2[M][x] = T.PATH;
    w2[M][13] = T.EXIT;

    Maps.data.west_stage2 = {
        w: S, h: S, tiles: w2, area: 'west', week2Map: true,
        warps: [
            { x: 13, y: M, to: 'west_stage1', tx: 2, ty: M },
            { x: 1, y: M, to: 'west_stage3', tx: 13, ty: M }
        ],
        start: { x: 12, y: M }
    };

    // --- 2週目: ステージ3 (塔 最上階) ---
    const w3 = createDungeon(T);
    for (let x = 1; x < S - 1; x++) w3[M][x] = T.PATH;
    w3[M][13] = T.EXIT;

    Maps.data.west_stage3 = {
        w: S, h: S, tiles: w3, area: 'west', week2Map: true,
        warps: [
            { x: 13, y: M, to: 'west_stage2', tx: 2, ty: M },
            { x: 1, y: M, to: 'west_boss_room', tx: 11, ty: M }
        ],
        start: { x: 12, y: M }
    };

    // --- 2週目: ボス部屋 ---
    const wb = createDungeon(T);
    for (let x = 3; x < S - 1; x++) wb[M][x] = T.PATH;
    wb[M][13] = T.EXIT;

    Maps.data.west_boss_room = {
        w: S, h: S, tiles: wb, area: 'west', week2Map: true,
        npcs: [{ id: 'westTrueBoss', type: 'enemy_slime', img: 'great_mage_map', x: 3, y: M, areaBoss: 'west', trueAreaBoss: true, blocking: true }],
        warps: [{ x: 13, y: M, to: 'west_stage3', tx: 2, ty: M }],
        start: { x: 12, y: M }
    };
}