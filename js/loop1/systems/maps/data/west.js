// ===========================================
// 西エリアマップデータ
// ===========================================

// 1週目：ボス直行マップ
// 1週目：探索エリア2層 + ボス部屋
function initWestWeek1(Maps, T) {
    const { createDungeonTiles } = MapHelper;

    // ステージ1 (41x41)
    const w1t = createDungeonTiles(41, 41, T);
    // 東(38,20)から西(2,20)へ
    for (let x = 2; x <= 38; x++) w1t[20][x] = T.PATH;
    // 南北への広がり
    for (let y = 10; y <= 30; y++) w1t[y][10] = T.PATH;
    for (let y = 10; y <= 30; y++) w1t[y][30] = T.PATH;
    w1t[20][1] = T.EXIT;

    Maps.data.west_stage1 = {
        w: 41, h: 41, tiles: w1t, isDungeon: true, encounterRate: 0.15, area: 'west', week1Map: true,
        npcs: [{ id: 'w1_sign', type: 'signpost', x: 35, y: 20, msg: '【魔法の塔】\n1層：魔力への入口', blocking: true }],
        warps: [
            { x: 39, y: 20, to: 'village', tx: 1, ty: 9 },
            { x: 1, y: 20, to: 'west_stage2', tx: 38, ty: 20 }
        ],
        start: { x: 38, y: 20 }
    };

    // ステージ2 (41x41)
    const w2t = createDungeonTiles(41, 41, T);
    // 複雑な構造
    for (let x = 2; x <= 38; x++) w2t[20][x] = T.PATH;
    for (let y = 5; y <= 35; y++) w2t[y][20] = T.PATH;
    for (let x = 10; x <= 30; x++) w2t[10][x] = T.PATH;
    for (let x = 10; x <= 30; x++) w2t[30][x] = T.PATH;
    w2t[20][1] = T.EXIT;

    Maps.data.west_stage2 = {
        w: 41, h: 41, tiles: w2t, isDungeon: true, encounterRate: 0.15, area: 'west', week1Map: true,
        npcs: [{ id: 'w2_sign', type: 'signpost', x: 35, y: 20, msg: '【魔法の塔】\n2層：魔力の奔流', blocking: true }],
        warps: [
            { x: 39, y: 20, to: 'west_stage1', tx: 2, ty: 20 },
            { x: 1, y: 20, to: 'west_boss_room', tx: 12, ty: 7 }
        ],
        start: { x: 38, y: 20 }
    };

    // ボス部屋 (15x15)
    const wbt = createDungeonTiles(15, 15, T);
    for (let x = 2; x <= 13; x++) wbt[7][x] = T.PATH;
    wbt[7][14] = T.EXIT;

    Maps.data.west_boss_room = {
        w: 15, h: 15, tiles: wbt, isDungeon: true, encounterRate: 0, area: 'west', week1Map: true,
        npcs: [{ id: 'westBoss', type: 'enemy_slime', img: 'great_mage_map', x: 3, y: 7, msg: null, areaBoss: 'west', blocking: true }],
        warps: [{ x: 14, y: 7, to: 'west_stage2', tx: 2, ty: 20 }],
        start: { x: 13, y: 7 }
    };
}

// 2週目は loop2/systems/maps/data/west.js に移動