// ===========================================
// 北エリアマップデータ
// ===========================================

// 1週目：ボス直行マップ
function initNorthWeek1(Maps, T) {
    const { createFieldTiles } = MapHelper;
    const nt = createFieldTiles(14, 14, T);
    nt[13][7] = T.EXIT;
    for (let y = 1; y < 13; y++) nt[y][7] = T.PATH;

    Maps.data.north_snowfield = {
        w: 14, h: 14, tiles: nt, encounterRate: 0.15, area: 'north', week1Map: true,
        npcs: [{ id: 'northBoss', type: 'enemy_yeti', img: 'ice_golem_map', x: 7, y: 2, msg: null, areaBoss: 'north', blocking: true }],
        warps: [{ x: 7, y: 13, to: 'village', tx: 12, ty: 1 }],
        start: { x: 7, y: 12 }
    };
}

// 2週目：ステージ1-4 + ボス部屋
function initNorthWeek2(Maps, T) {
    const { createFieldTiles, createDungeonTiles } = MapHelper;

    // ステージ1
    const n1t = createFieldTiles(22, 18, T);
    for (let y = 2; y <= 15; y++) n1t[y][11] = T.PATH;
    for (let x = 5; x <= 17; x++) n1t[9][x] = T.PATH;
    for (let x = 3; x <= 7; x++) for (let y = 3; y <= 7; y++) n1t[y][x] = T.WATER;
    n1t[16][11] = T.EXIT;
    Maps.data.north_stage1 = {
        w: 22, h: 18, tiles: n1t, encounterRate: 0.10, area: 'north', week2Map: true,
        npcs: [{ id: 'n1_sign', type: 'signpost', x: 11, y: 14, msg: '【極寒の地】\n北へ進むには仲間の力が必要', blocking: true }],
        warps: [
            { x: 11, y: 16, to: 'village', tx: 12, ty: 1 },
            { x: 11, y: 2, to: 'north_stage2', tx: 9, ty: 16 }
        ],
        start: { x: 11, y: 15 }
    };

    // ステージ2
    const n2t = createDungeonTiles(20, 20, T);
    for (let y = 2; y <= 17; y++) n2t[y][10] = T.PATH;
    for (let x = 4; x <= 16; x++) n2t[10][x] = T.PATH;
    n2t[18][10] = T.EXIT;
    Maps.data.north_stage2 = {
        w: 20, h: 20, tiles: n2t, isDungeon: true, encounterRate: 0.12, area: 'north', week2Map: true,
        npcs: [],
        warps: [
            { x: 10, y: 18, to: 'north_stage1', tx: 11, ty: 3 },
            { x: 10, y: 2, to: 'north_stage3', tx: 8, ty: 16 }
        ],
        start: { x: 10, y: 17 }
    };

    // ステージ3
    const n3t = createDungeonTiles(18, 20, T);
    for (let y = 2; y <= 17; y++) n3t[y][9] = T.PATH;
    for (let x = 3; x <= 15; x++) n3t[10][x] = T.PATH;
    n3t[18][9] = T.EXIT;
    Maps.data.north_stage3 = {
        w: 18, h: 20, tiles: n3t, isDungeon: true, encounterRate: 0.14, area: 'north', week2Map: true,
        npcs: [{ id: 'n3_sign', type: 'signpost', x: 9, y: 12, msg: '氷の壁を破るには\n3人の力が必要だ', blocking: true }],
        warps: [
            { x: 9, y: 18, to: 'north_stage2', tx: 10, ty: 3 },
            { x: 9, y: 2, to: 'north_stage4', tx: 7, ty: 14 }
        ],
        start: { x: 9, y: 17 }
    };

    // ステージ4
    const n4t = createDungeonTiles(16, 18, T);
    for (let y = 2; y <= 15; y++) n4t[y][8] = T.PATH;
    for (let x = 3; x <= 13; x++) n4t[8][x] = T.PATH;
    n4t[16][8] = T.EXIT;
    Maps.data.north_stage4 = {
        w: 16, h: 18, tiles: n4t, isDungeon: true, encounterRate: 0.16, area: 'north', week2Map: true,
        npcs: [],
        warps: [
            { x: 8, y: 16, to: 'north_stage3', tx: 9, ty: 3 },
            { x: 8, y: 2, to: 'north_boss_room', tx: 7, ty: 12 }
        ],
        start: { x: 8, y: 15 }
    };

    // ボス部屋
    const nbt = createDungeonTiles(16, 14, T);
    for (let y = 2; y <= 11; y++) nbt[y][8] = T.PATH;
    nbt[12][8] = T.EXIT;
    Maps.data.north_boss_room = {
        w: 16, h: 14, tiles: nbt, isDungeon: true, encounterRate: 0, area: 'north', week2Map: true,
        npcs: [{ id: 'northTrueBoss', type: 'enemy_yeti', img: 'ice_golem_map', x: 8, y: 3, msg: null, areaBoss: 'north', trueAreaBoss: true, blocking: true }],
        warps: [
            { x: 8, y: 12, to: 'north_stage4', tx: 8, ty: 3 },
            { x: 8, y: 2, to: 'demon_castle', tx: 7, ty: 12, requiresBoss: 'north' }
        ],
        start: { x: 8, y: 11 }
    };
}