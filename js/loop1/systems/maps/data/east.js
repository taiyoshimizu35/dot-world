// ===========================================
// 東エリアマップデータ
// ===========================================

// 1週目：ボス直行マップ
// 1週目：探索エリア1層 + ボス部屋
function initEastWeek1(Maps, T) {
    const { createDungeonTiles } = MapHelper;

    // ステージ1 (41x41)
    const e1t = createDungeonTiles(41, 41, T);
    // シンプルな道: 西(2,20)から東(38,20)へ
    for (let x = 2; x <= 38; x++) e1t[20][x] = T.PATH;
    // 分岐や少し広がりを持たせる
    for (let y = 15; y <= 25; y++) e1t[y][20] = T.PATH;
    for (let x = 15; x <= 25; x++) e1t[15][x] = T.PATH;
    e1t[20][39] = T.EXIT;

    Maps.data.east_stage1 = {
        w: 41, h: 41, tiles: e1t, isDungeon: true, encounterRate: 0.15, area: 'east', week1Map: true,
        npcs: [{ id: 'e1_sign', type: 'signpost', x: 5, y: 20, msg: '【深緑の迷宮】\n主の間は遥か東', blocking: true }],
        warps: [
            { x: 1, y: 20, to: 'village', tx: 23, ty: 9 },
            { x: 39, y: 20, to: 'east_boss_room', tx: 2, ty: 7 }
        ],
        start: { x: 2, y: 20 }
    };

    // ボス部屋 (15x15)
    const ebt = createDungeonTiles(15, 15, T);
    for (let x = 2; x <= 12; x++) ebt[7][x] = T.PATH;
    ebt[7][1] = T.EXIT;

    Maps.data.east_boss_room = {
        w: 15, h: 15, tiles: ebt, isDungeon: true, encounterRate: 0, area: 'east', week1Map: true,
        npcs: [{ id: 'eastBoss', type: 'enemy_slime', img: 'dragon_map', x: 10, y: 7, msg: null, areaBoss: 'east', blocking: true }],
        warps: [{ x: 1, y: 7, to: 'east_stage1', tx: 38, ty: 20 }],
        start: { x: 2, y: 7 }
    };
}

// 2週目は loop2/systems/maps/data/east.js に移動