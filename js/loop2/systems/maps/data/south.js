// ===========================================
// 南エリアマップデータ（Loop 2）
// ===========================================

// 2週目：ステージ1-3 + ボス部屋
function initSouthWeek2(Maps, T) {
    const { createFieldTiles, createDungeonTiles } = MapHelper;

    // ステージ1
    const s1t = createFieldTiles(20, 18, T);
    for (let y = 2; y <= 15; y++) s1t[y][10] = T.PATH;
    for (let x = 5; x <= 15; x++) s1t[8][x] = T.PATH;
    s1t[5][8] = T.ROCK; s1t[5][12] = T.ROCK;
    s1t[11][8] = T.ROCK; s1t[11][12] = T.ROCK;
    s1t[1][10] = T.EXIT;
    Maps.data.south_stage1 = {
        w: 20, h: 18, tiles: s1t, encounterRate: 0.10, area: 'south', week2Map: true,
        npcs: [
            { id: 's1_sign', type: 'signpost', x: 10, y: 4, msg: '【忘却の墓地】\n南へ進むほど闇は深くなる', blocking: true },
            { id: 'milia_join', type: 'villager', img: 'ally_milia', x: 8, y: 8, msg: null, partyJoin: 'milia', requiresBoss: 'west', week2Only: true, blocking: true }
        ],
        warps: [
            { x: 10, y: 1, to: 'village', tx: 12, ty: 16 },
            { x: 10, y: 16, to: 'south_stage2', tx: 10, ty: 2 }
        ],
        start: { x: 10, y: 2 }
    };

    // ステージ2
    const s2t = createDungeonTiles(22, 22, T);
    for (let y = 2; y <= 19; y++) s2t[y][11] = T.PATH;
    for (let x = 5; x <= 17; x++) s2t[11][x] = T.PATH;
    s2t[1][11] = T.EXIT;
    Maps.data.south_stage2 = {
        w: 22, h: 22, tiles: s2t, isDungeon: true, encounterRate: 0.14, area: 'south', week2Map: true,
        npcs: [{ id: 's2_ghost', type: 'villager', x: 11, y: 11, msg: '（亡霊の声）\n先へ進みたいなら…南へ…', blocking: false }],
        warps: [
            { x: 11, y: 1, to: 'south_stage1', tx: 10, ty: 15 },
            { x: 11, y: 20, to: 'south_stage3', tx: 8, ty: 2 }
        ],
        start: { x: 11, y: 2 }
    };

    // ステージ3
    const s3t = createDungeonTiles(18, 18, T);
    for (let y = 2; y <= 15; y++) s3t[y][9] = T.PATH;
    for (let x = 4; x <= 14; x++) s3t[9][x] = T.PATH;
    s3t[1][9] = T.EXIT;
    Maps.data.south_stage3 = {
        w: 18, h: 18, tiles: s3t, isDungeon: true, encounterRate: 0.16, area: 'south', week2Map: true,
        npcs: [],
        warps: [
            { x: 9, y: 1, to: 'south_stage2', tx: 11, ty: 19 },
            { x: 9, y: 16, to: 'south_boss_room', tx: 7, ty: 2 }
        ],
        start: { x: 9, y: 2 }
    };

    // ボス部屋
    const sbt = createDungeonTiles(16, 14, T);
    for (let y = 2; y <= 11; y++) sbt[y][8] = T.PATH;
    sbt[1][8] = T.EXIT;
    Maps.data.south_boss_room = {
        w: 16, h: 14, tiles: sbt, isDungeon: true, encounterRate: 0, area: 'south', week2Map: true,
        npcs: [{ id: 'southTrueBoss', type: 'enemy_skeleton', img: 'phantom_knight_map', x: 8, y: 10, msg: null, areaBoss: 'south', trueAreaBoss: true, blocking: true }],
        warps: [{ x: 8, y: 1, to: 'south_stage3', tx: 9, ty: 15 }],
        start: { x: 8, y: 2 }
    };
}
