// ===========================================
// 東エリアマップデータ（Loop 2）
// ===========================================

// 2週目：ステージ1-3 + ボス部屋
function initEastWeek2(Maps, T) {
    const { createFieldTiles, createDungeonTiles } = MapHelper;

    // ステージ1
    const e1t = createFieldTiles(20, 16, T);
    for (let x = 2; x <= 17; x++) e1t[8][x] = T.PATH;
    for (let y = 4; y <= 8; y++) e1t[y][6] = T.PATH;
    for (let y = 8; y <= 12; y++) e1t[y][14] = T.PATH;
    e1t[6][10] = T.ROCK; e1t[7][10] = T.ROCK;
    e1t[9][10] = T.ROCK; e1t[10][10] = T.ROCK;
    e1t[8][1] = T.EXIT;
    Maps.data.east_stage1 = {
        w: 20, h: 16, tiles: e1t, encounterRate: 0.10, area: 'east', week2Map: true,
        npcs: [{ id: 'e1_sign', type: 'signpost', x: 4, y: 8, msg: '【緑深き森】\n東へ進めば先に続く', blocking: true }],
        warps: [
            { x: 1, y: 8, to: 'village', tx: 23, ty: 9 },
            { x: 18, y: 8, to: 'east_stage2', tx: 2, ty: 8 }
        ],
        start: { x: 2, y: 8 }
    };

    // ステージ2
    const e2t = createFieldTiles(24, 20, T);
    for (let x = 2; x <= 6; x++) e2t[8][x] = T.PATH;
    for (let y = 8; y <= 14; y++) e2t[y][6] = T.PATH;
    for (let x = 6; x <= 18; x++) e2t[14][x] = T.PATH;
    for (let y = 8; y <= 14; y++) e2t[y][18] = T.PATH;
    for (let x = 18; x <= 22; x++) e2t[8][x] = T.PATH;
    e2t[8][1] = T.EXIT;
    Maps.data.east_stage2 = {
        w: 24, h: 20, tiles: e2t, encounterRate: 0.12, area: 'east', week2Map: true,
        npcs: [{ id: 'e2_sign', type: 'signpost', x: 12, y: 14, msg: '迷ったら引き返せ', blocking: true }],
        warps: [
            { x: 1, y: 8, to: 'east_stage1', tx: 17, ty: 8 },
            { x: 22, y: 8, to: 'east_stage3', tx: 2, ty: 8 }
        ],
        start: { x: 2, y: 8 }
    };

    // ステージ3
    const e3t = createDungeonTiles(18, 18, T);
    for (let x = 2; x <= 15; x++) e3t[9][x] = T.PATH;
    for (let y = 5; y <= 13; y++) e3t[y][9] = T.PATH;
    e3t[9][1] = T.EXIT;
    Maps.data.east_stage3 = {
        w: 18, h: 18, tiles: e3t, isDungeon: true, encounterRate: 0.14, area: 'east', week2Map: true,
        npcs: [],
        warps: [
            { x: 1, y: 9, to: 'east_stage2', tx: 21, ty: 8 },
            { x: 16, y: 9, to: 'east_boss_room', tx: 2, ty: 7 }
        ],
        start: { x: 2, y: 9 }
    };

    // ボス部屋
    const ebt = createDungeonTiles(16, 14, T);
    for (let x = 2; x <= 13; x++) ebt[7][x] = T.PATH;
    for (let y = 4; y <= 10; y++) ebt[y][8] = T.PATH;
    ebt[7][1] = T.EXIT;
    Maps.data.east_boss_room = {
        w: 16, h: 14, tiles: ebt, isDungeon: true, encounterRate: 0, area: 'east', week2Map: true,
        npcs: [{ id: 'eastTrueBoss', type: 'enemy_slime', img: 'dragon_map', x: 12, y: 7, msg: null, areaBoss: 'east', trueAreaBoss: true, blocking: true }],
        warps: [{ x: 1, y: 7, to: 'east_stage3', tx: 15, ty: 9 }],
        start: { x: 2, y: 7 }
    };
}
