// ===========================================
// 西エリアマップデータ
// ===========================================

// 1週目：ボス直行マップ
function initWestWeek1(Maps, T) {
    const { createDungeonTiles } = MapHelper;
    const wwdt = createDungeonTiles(14, 14, T);
    for (let x = 1; x <= 12; x++) wwdt[6][x] = T.PATH;
    wwdt[6][13] = T.EXIT;

    Maps.data.dungeon_west = {
        w: 14, h: 14, tiles: wwdt, isDungeon: true, encounterRate: 0.15, area: 'west', week1Map: true,
        npcs: [{ id: 'westBoss', type: 'enemy_slime', img: 'great_mage_map', x: 3, y: 6, msg: null, areaBoss: 'west', blocking: true }],
        warps: [{ x: 13, y: 6, to: 'village', tx: 2, ty: 9 }],
        start: { x: 11, y: 6 }
    };
}

// 2週目：ステージ1-3 + ボス部屋
function initWestWeek2(Maps, T) {
    const { createDungeonTiles } = MapHelper;

    // ステージ1
    const w1t = createDungeonTiles(20, 18, T);
    for (let x = 2; x <= 17; x++) w1t[9][x] = T.PATH;
    for (let y = 5; y <= 13; y++) w1t[y][10] = T.PATH;
    w1t[9][8] = T.WATER; w1t[9][12] = T.WATER;
    w1t[9][18] = T.EXIT;
    Maps.data.west_stage1 = {
        w: 20, h: 18, tiles: w1t, isDungeon: true, encounterRate: 0.10, area: 'west', week2Map: true,
        npcs: [
            { id: 'w1_sign', type: 'signpost', x: 5, y: 9, msg: '【魔法の塔】\n氷の障壁は炎で溶ける', blocking: true },
            { id: 'rose_join', type: 'villager', img: 'ally_rose', x: 14, y: 9, msg: null, partyJoin: 'rose', requiresBoss: 'east', week2Only: true, blocking: true }
        ],
        warps: [
            { x: 18, y: 9, to: 'village', tx: 2, ty: 9 },
            { x: 2, y: 9, to: 'west_stage2', tx: 16, ty: 9 }
        ],
        start: { x: 17, y: 9 }
    };

    // ステージ2
    const w2t = createDungeonTiles(20, 20, T);
    for (let x = 5; x <= 14; x++) for (let y = 5; y <= 14; y++) w2t[y][x] = T.FLOOR;
    for (let x = 2; x <= 5; x++) w2t[10][x] = T.PATH;
    for (let x = 14; x <= 17; x++) w2t[10][x] = T.PATH;
    w2t[10][18] = T.EXIT;
    Maps.data.west_stage2 = {
        w: 20, h: 20, tiles: w2t, isDungeon: true, encounterRate: 0.12, area: 'west', week2Map: true,
        npcs: [{ id: 'w2_sign', type: 'signpost', x: 10, y: 10, msg: '魔法陣を正しい順に起動せよ', blocking: true }],
        warps: [
            { x: 18, y: 10, to: 'west_stage1', tx: 3, ty: 9 },
            { x: 2, y: 10, to: 'west_stage3', tx: 14, ty: 8 }
        ],
        start: { x: 17, y: 10 }
    };

    // ステージ3
    const w3t = createDungeonTiles(16, 16, T);
    for (let x = 2; x <= 13; x++) w3t[8][x] = T.PATH;
    for (let y = 4; y <= 12; y++) w3t[y][8] = T.PATH;
    w3t[8][14] = T.EXIT;
    Maps.data.west_stage3 = {
        w: 16, h: 16, tiles: w3t, isDungeon: true, encounterRate: 0.14, area: 'west', week2Map: true,
        npcs: [],
        warps: [
            { x: 14, y: 8, to: 'west_stage2', tx: 3, ty: 10 },
            { x: 2, y: 8, to: 'west_boss_room', tx: 12, ty: 7 }
        ],
        start: { x: 13, y: 8 }
    };

    // ボス部屋
    const wbt = createDungeonTiles(16, 14, T);
    for (let x = 2; x <= 13; x++) wbt[7][x] = T.PATH;
    wbt[7][14] = T.EXIT;
    Maps.data.west_boss_room = {
        w: 16, h: 14, tiles: wbt, isDungeon: true, encounterRate: 0, area: 'west', week2Map: true,
        npcs: [{ id: 'westTrueBoss', type: 'enemy_slime', img: 'great_mage_map', x: 3, y: 7, msg: null, areaBoss: 'west', trueAreaBoss: true, blocking: true }],
        warps: [{ x: 14, y: 7, to: 'west_stage3', tx: 3, ty: 8 }],
        start: { x: 13, y: 7 }
    };
}