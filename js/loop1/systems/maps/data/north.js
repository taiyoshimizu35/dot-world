// ===========================================
// 北エリアマップデータ
// ===========================================

// 1週目：ボス直行マップ
// 1週目：探索エリア3層 + ボス部屋
function initNorthWeek1(Maps, T) {
    const { createFieldTiles, createDungeonTiles } = MapHelper;

    // ステージ1 (41x41)
    const n1t = createFieldTiles(41, 41, T);
    // 南(20,38)から北(20,2)へ
    for (let y = 2; y <= 38; y++) n1t[y][20] = T.PATH;
    // 湖や障害物
    for (let x = 5; x <= 15; x++) for (let y = 10; y <= 30; y++) n1t[y][x] = T.WATER;
    for (let x = 25; x <= 35; x++) for (let y = 10; y <= 30; y++) n1t[y][x] = T.WATER;
    n1t[39][20] = T.EXIT;

    Maps.data.north_stage1 = {
        w: 41, h: 41, tiles: n1t, encounterRate: 0.15, area: 'north', week1Map: true,
        npcs: [{ id: 'n1_sign', type: 'signpost', x: 23, y: 35, msg: '【極寒の地】\n北へ進む者は覚悟せよ', blocking: true }],
        warps: [
            { x: 20, y: 39, to: 'village', tx: 12, ty: 1 },
            { x: 20, y: 1, to: 'north_stage2', tx: 20, ty: 38 }
        ],
        start: { x: 20, y: 38 }
    };

    // ステージ2 (41x41)
    const n2t = createDungeonTiles(41, 41, T);
    // 東西に迂回する道
    for (let y = 2; y <= 38; y++) n2t[y][20] = T.PATH;
    for (let x = 10; x <= 30; x++) n2t[20][x] = T.PATH;
    for (let y = 10; y <= 30; y++) n2t[y][10] = T.PATH;
    for (let y = 10; y <= 30; y++) n2t[y][30] = T.PATH;
    n2t[39][20] = T.EXIT;

    Maps.data.north_stage2 = {
        w: 41, h: 41, tiles: n2t, isDungeon: true, encounterRate: 0.15, area: 'north', week1Map: true,
        npcs: [],
        warps: [
            { x: 20, y: 39, to: 'north_stage1', tx: 20, ty: 2 },
            { x: 20, y: 1, to: 'north_stage3', tx: 20, ty: 38 }
        ],
        start: { x: 20, y: 38 }
    };

    // ステージ3 (41x41)
    const n3t = createFieldTiles(41, 41, T);
    // 猛吹雪（視覚効果のみ想定、タイルは通常）
    for (let y = 2; y <= 38; y++) n3t[y][20] = T.PATH;
    // 迷路状
    for (let x = 2; x <= 38; x++) n3t[20][x] = T.PATH;
    for (let y = 2; y <= 38; y++) n3t[y][5] = T.PATH;
    for (let y = 2; y <= 38; y++) n3t[y][35] = T.PATH;
    n3t[39][20] = T.EXIT;

    Maps.data.north_stage3 = {
        w: 41, h: 41, tiles: n3t, encounterRate: 0.15, area: 'north', week1Map: true,
        npcs: [{ id: 'n3_sign', type: 'signpost', x: 23, y: 35, msg: '吹雪が視界を遮る…', blocking: true }],
        warps: [
            { x: 20, y: 39, to: 'north_stage2', tx: 20, ty: 2 },
            { x: 20, y: 1, to: 'north_boss_room', tx: 7, ty: 12 }
        ],
        start: { x: 20, y: 38 }
    };

    // ボス部屋 (15x15)
    const nbt = createFieldTiles(15, 15, T);
    for (let y = 2; y <= 12; y++) nbt[y][7] = T.PATH;
    nbt[13][7] = T.EXIT;

    Maps.data.north_boss_room = {
        w: 15, h: 15, tiles: nbt, encounterRate: 0, area: 'north', week1Map: true,
        npcs: [{ id: 'northBoss', type: 'enemy_yeti', img: 'ice_golem_map', x: 7, y: 2, msg: null, areaBoss: 'north', blocking: true }],
        warps: [{ x: 7, y: 13, to: 'north_stage3', tx: 20, ty: 2 }],
        start: { x: 7, y: 12 }
    };
}

// 2週目は loop2/systems/maps/data/north.js に移動