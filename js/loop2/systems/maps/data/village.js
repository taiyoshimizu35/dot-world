// ===========================================
// 村マップデータ（Loop 2）
// ===========================================
function initVillageWeek2(Maps, T) {
    const { S, M, createFieldTiles } = MapHelper;
    const vw = 25, vh = 18;

    // 基本タイル
    const vt = [];
    for (let y = 0; y < vh; y++) {
        const r = [];
        for (let x = 0; x < vw; x++) r.push(T.GRASS);
        vt.push(r);
    }

    // 道（端まで）
    for (let x = 0; x < vw; x++) vt[9][x] = T.PATH;
    for (let y = 0; y < vh; y++) vt[y][12] = T.PATH;

    // 建物
    for (let y = 2; y <= 5; y++) for (let x = 3; x <= 6; x++) vt[y][x] = T.HOUSE;
    vt[5][4] = T.DOOR;
    for (let y = 2; y <= 5; y++) for (let x = 17; x <= 21; x++) vt[y][x] = T.HOUSE;
    vt[5][19] = T.DOOR;

    // 池
    for (let y = 12; y <= 15; y++) for (let x = 18; x <= 22; x++) vt[y][x] = T.WATER;

    // 岩
    [[1, 1], [23, 3], [2, 15], [20, 1], [15, 15]].forEach(([x, y]) => {
        if (vt[y] && vt[y][x] === T.GRASS) vt[y][x] = T.ROCK;
    });

    Maps.data.village = {
        w: vw, h: vh, tiles: vt, encounterRate: 0.0,
        npcs: [
            { id: 'npc1', type: 'villager', x: 8, y: 9, msg: 'ようこそ！\n草原を歩くとモンスターに会うよ。', blocking: true },
            { id: 'shop', type: 'villager', x: 19, y: 4, msg: null, shop: true, blocking: true },
            { id: 'guard', type: 'guard', x: 23, y: 9, msg: null, guard: true, blocking: true },
            { id: 'westGuard', type: 'guard', x: 1, y: 9, msg: null, westGuard: true, blocking: true },
            { id: 'sign1', type: 'signpost', x: 12, y: 7, msg: '【始まりの村】\n東西南北、全ての道はここに通ず', blocking: true },
            // Week 2 Specific NPCs
            { id: 'alex_join', type: 'villager', img: 'ally_alex', x: 10, y: 11, msg: null, partyJoin: 'alex', blocking: true },
            { id: 'quest_npc', type: 'villager', x: 6, y: 11, msg: null, questGiver: true, blocking: true },
            { id: 'weapon_shop', type: 'villager', x: 16, y: 11, msg: null, weaponShop: true, blocking: true }
        ],
        warps: [
            { x: 4, y: 5, to: 'magic_shop', tx: 4, ty: 6 },
            { x: 19, y: 5, to: 'shop_interior', tx: 4, ty: 6 },
            // Week 2 Specific Warps (Direct to Stage 1)
            { x: 24, y: 9, to: 'east_stage1', tx: 3, ty: 6 },
            { x: 0, y: 9, to: 'west_stage1', tx: 16, ty: 9 },
            { x: 12, y: 0, to: 'north_stage1', tx: 9, ty: 16 },
            { x: 12, y: 17, to: 'town3', tx: 12, ty: 1 }
        ],
        start: { x: 12, y: 11 }
    };
}
