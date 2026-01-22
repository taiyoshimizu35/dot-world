// ===========================================
// 南エリアマップデータ
// ===========================================

// 1週目：ボス直行マップ
// 1週目：探索エリア2層 + ボス部屋
function initSouthWeek1(Maps, T) {
    const { createFieldTiles, createDungeonTiles } = MapHelper;

    // ステージ1 (41x41)
    const s1t = createFieldTiles(41, 41, T);
    // 北(20,2)から南(20,38)へ
    for (let y = 2; y <= 38; y++) s1t[y][20] = T.PATH;
    // 分岐
    for (let x = 10; x <= 30; x++) s1t[10][x] = T.PATH;
    for (let x = 10; x <= 30; x++) s1t[20][x] = T.PATH;
    s1t[1][20] = T.EXIT;

    Maps.data.south_stage1 = {
        w: 41, h: 41, tiles: s1t, encounterRate: 0.15, area: 'south', week1Map: true,
        npcs: [{ id: 's1_sign', type: 'signpost', x: 23, y: 5, msg: '【忘却の墓地】\n南へ進むほど闇は深くなる', blocking: true }],
        warps: [
            { x: 20, y: 1, to: 'village', tx: 12, ty: 16 },
            { x: 20, y: 39, to: 'south_stage2', tx: 20, ty: 2 }
        ],
        start: { x: 20, y: 2 }
    };

    // ステージ2 (41x41)
    const s2t = createFieldTiles(41, 41, T);
    // 複雑な森
    for (let y = 2; y <= 38; y++) s2t[y][20] = T.PATH;
    for (let x = 5; x <= 35; x++) s2t[20][x] = T.PATH;
    for (let y = 2; y <= 38; y++) s2t[y][10] = T.PATH;
    for (let y = 2; y <= 38; y++) s2t[y][30] = T.PATH;
    s2t[1][20] = T.EXIT;

    Maps.data.south_stage2 = {
        w: 41, h: 41, tiles: s2t, encounterRate: 0.15, area: 'south', week1Map: true,
        npcs: [{ id: 's2_sign', type: 'signpost', x: 23, y: 5, msg: '墓標が道を示す…', blocking: true }],
        warps: [
            { x: 20, y: 1, to: 'south_stage1', tx: 20, ty: 38 },
            { x: 20, y: 39, to: 'south_boss_room', tx: 7, ty: 2 }
        ],
        start: { x: 20, y: 2 }
    };

    // ボス部屋 (15x15)
    const sbt = createFieldTiles(15, 15, T);
    for (let y = 2; y <= 12; y++) sbt[y][7] = T.PATH;
    sbt[1][7] = T.EXIT;

    Maps.data.south_boss_room = {
        w: 15, h: 15, tiles: sbt, encounterRate: 0, area: 'south', week1Map: true,
        npcs: [{ id: 'southBoss', type: 'enemy_skeleton', img: 'phantom_knight_map', x: 7, y: 10, msg: null, areaBoss: 'south', blocking: true }],
        warps: [{ x: 7, y: 1, to: 'south_stage2', tx: 20, ty: 38 }],
        start: { x: 7, y: 2 }
    };
}

// 2週目は loop2/systems/maps/data/south.js に移動