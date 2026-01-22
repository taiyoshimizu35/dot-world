// ===========================================
// 村マップデータ
// ===========================================
function initVillageMap(Maps, T) {
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
    vt[5][5] = T.DOOR;
    for (let y = 2; y <= 5; y++) for (let x = 17; x <= 22; x++) vt[y][x] = T.HOUSE;
    vt[5][19] = T.DOOR;
    vt[5][20] = T.DOOR;    

    // 池
    for (let y = 12; y <= 15; y++) for (let x = 18; x <= 22; x++) vt[y][x] = T.WATER;

    // 岩
    [[1, 1], [23, 3], [2, 15], [20, 1], [15, 15]].forEach(([x, y]) => {
        if (vt[y] && vt[y][x] === T.GRASS) vt[y][x] = T.ROCK;
    });

    Maps.data.village = {
        w: vw, h: vh, tiles: vt, encounterRate: 0.02,
        npcs: [
            { id: 'npc1', type: 'villager', x: 8, y: 9, msg: 'ようこそ！\n草原を歩くとモンスターに会うよ。', blocking: true },
            { id: 'guard', type: 'guard', x: 23, y: 9, msg: null, guard: true, blocking: true },
            { id: 'westGuard', type: 'guard', x: 1, y: 9, msg: null, westGuard: true, blocking: true },
            { id: 'sign1', type: 'signpost', x: 12, y: 7, msg: '【始まりの村】\n東西南北、全ての道はここに通ず', blocking: true },
            { id: 'demon_guide', type: 'villager', x: 14, y: 11, msg: null, demonGuide: true, blocking: true }
        ],
        warps: [
            { x: 4, y: 5, to: 'magic_shop', tx: 4, ty: 6 },
            { x: 5, y: 5, to: 'magic_shop', tx: 4, ty: 6 },
            { x: 19, y: 5, to: 'shop_interior', tx: 4, ty: 6 },
            { x: 20, y: 5, to: 'shop_interior', tx: 4, ty: 6 },
            { x: 24, y: 9, to: 'east_stage1', tx: 2, ty: 20 },
            { x: 0, y: 9, to: 'west_stage1', tx: 38, ty: 20 },
            { x: 12, y: 0, to: 'north_stage1', tx: 20, ty: 38 },
            { x: 12, y: 17, to: 'south_stage1', tx: 20, ty: 2 },
            { x: 14, y: 12, to: 'demon_castle', tx: 10, ty: 15, requiresDemonCastle: true }
        ],
        start: { x: 12, y: 11 }
    };
}

// ショップマップ
function initShopMaps(Maps, T) {
    // 魔法ショップ
    const hw = 9, hh = 8, ht = [];
    for (let y = 0; y < hh; y++) {
        const r = [];
        for (let x = 0; x < hw; x++) r.push(y === 0 || y === hh - 1 || x === 0 || x === hw - 1 ? T.HOUSE : T.FLOOR);
        ht.push(r);
    }
    ht[2][3] = T.COUNTER; ht[2][4] = T.COUNTER; ht[2][5] = T.COUNTER;
    ht[hh - 1][4] = T.EXIT;
    Maps.data.magic_shop = {
        w: hw, h: hh, tiles: ht,
        npcs: [{ id: 'mage_shopkeeper', type: 'villager', x: 4, y: 1, msg: null, magicShop: true, blocking: true }],
        warps: [{ x: 4, y: 7, to: 'village', tx: 4, ty: 6 }],
        start: { x: 4, y: 5 }
    };

    // 通常ショップ
    const sw = 9, sh = 8, st = [];
    for (let y = 0; y < sh; y++) {
        const r = [];
        for (let x = 0; x < sw; x++) r.push(y === 0 || y === sh - 1 || x === 0 || x === sw - 1 ? T.HOUSE : T.FLOOR);
        st.push(r);
    }
    st[2][3] = T.COUNTER; st[2][4] = T.COUNTER; st[2][5] = T.COUNTER;
    st[sh - 1][4] = T.EXIT;
    Maps.data.shop_interior = {
        w: sw, h: sh, tiles: st,
        npcs: [{ id: 'shopkeeper', type: 'villager', x: 4, y: 1, msg: null, shop: true, blocking: true }],
        warps: [{ x: 4, y: 7, to: 'village', tx: 19, ty: 6 }],
        start: { x: 4, y: 5 }
    };
}