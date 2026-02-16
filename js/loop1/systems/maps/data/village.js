import { MapHelper } from './helper.js';

// ===========================================
// 村マップデータ
// ===========================================
export function initVillageMap(Maps, T) {
    const { S, M, createFieldTiles } = MapHelper;
    const vw = 25, vh = 19;

    // 基本タイル
    const vt = [];
    for (let y = 0; y < vh; y++) {
        const r = [];
        for (let x = 0; x < vw; x++) r.push(T.GRASS);
        vt.push(r);
    }

    // 道（端まで）
    for (let x = 0; x < vw; x++) vt[9][x] = T.PATH;
    for (let x = 0; x < vw; x++) vt[10][x] = T.PATH;
    for (let y = 0; y < vh; y++) vt[y][13] = T.PATH;
    for (let y = 0; y < vh; y++) vt[y][12] = T.PATH;
    for (let y = 6; y <= 8; y++) for (let x = 4; x <= 5; x++) vt[y][x] = T.PATH
    for (let y = 6; y <= 8; y++) for (let x = 19; x <= 20; x++) vt[y][x] = T.PATH
    for (let x = 14; x <= 21; x++) vt[16][x] = T.PATH
    for (let x = 14; x <= 21; x++) vt[17][x] = T.PATH
    for (let x = 3; x <= 11; x++) vt[16][x] = T.PATH
    for (let x = 3; x <= 11; x++) vt[17][x] = T.PATH


    // 建物
    // for (let y = 3; y <= 5; y++) for (let x = 3; x <= 6; x++) vt[y][x] = T.HOUSE_WOOD;
    // vt[5][4] = T.DOOR_LEFT;
    // vt[5][5] = T.DOOR_RIGHT;
    // vt[4][4] = T.MAGIC_SHOP_SIGN_LEFT;
    // vt[4][5] = T.MAGIC_SHOP_SIGN_RIGHT;
    // for (let y = 3; y <= 5; y++) for (let x = 18; x <= 21; x++) vt[y][x] = T.HOUSE_WOOD;
    // vt[5][19] = T.DOOR_LEFT;
    // vt[5][20] = T.DOOR_RIGHT;
    // vt[4][19] = T.WEAPON_SHOP_SIGN_LEFT;
    // vt[4][20] = T.WEAPON_SHOP_SIGN_RIGHT;
    // for (let y = 13; y <= 15; y++) for (let x = 18; x <= 21; x++) vt[y][x] = T.HOUSE_WOOD;
    // vt[15][19] = T.DOOR_LEFT;
    // vt[15][20] = T.DOOR_RIGHT;
    // vt[14][19] = T.INN_SIGN_LEFT;
    // vt[14][20] = T.INN_SIGN_RIGHT;
    // for (let y = 13; y <= 15; y++) for (let x = 3; x <= 6; x++) vt[y][x] = T.HOUSE_WOOD;
    // vt[15][4] = T.DOOR_LEFT;
    // vt[15][5] = T.DOOR_RIGHT;



    // 岩
    // [[1, 1], [23, 3], [2, 15], [20, 1], [15, 15]].forEach(([x, y]) => {
    //     if (vt[y] && vt[y][x] === T.GRASS) vt[y][x] = T.ROCK;
    // });

    Maps.data.village = {
        w: vw, h: vh, tiles: vt, encounterRate: 0.5,
        baseTile: T.GRASS,
        npcs: [
            { id: 'npc1', type: 'villager', x: 8, y: 8, msg: '草原を歩くとモンスターに会うぞ。\n勇者！魔王様を倒してくれよな！', blocking: true },
            { id: 'npc2', type: 'villager', x: 10, y: 15, msg: '女神像は記憶を保持してくれるらしい', blocking: true },
            { id: 'sign1', type: 'signpost', x: 11, y: 7, msg: '四天王を倒せ。\nさすれば道は開かれん', blocking: true },
            { id: 'demon_guide', type: 'villager', x: 14, y: 11, msg: null, demonGuide: true, blocking: true },
            { id: 'magic_shop', type: 'shop', img: 'magic_shop', x: 2.5, y: 1.5, width:5, height:4.5, msg: null, blocking: true },
            { id: 'weapon_shop', type: 'shop', img: 'weapon_shop', x: 17.5, y: 1.5, width:5, height:4.5, msg: null, blocking: true },
            { id: 'inn', type: 'inn', img: 'inn', x: 18, y: 11, width:4, height:5, msg: null, blocking: true },
            { id: 'advanced_shop', type: 'shop', img: 'advanced_shop', x: 2.5, y: 11, width:4.5, height:5, msg: null, blocking: true },
        ],
        warps: [
            { x: 4, y: 5, to: 'magic_shop', tx: 4, ty: 6 },
            { x: 5, y: 5, to: 'magic_shop', tx: 4, ty: 6 },
            { x: 19, y: 5, to: 'shop_interior', tx: 4, ty: 6 },
            { x: 20, y: 5, to: 'shop_interior', tx: 4, ty: 6 },
            { x: 24, y: 9, to: 'east_stage1', tx: 2, ty: 20 },
            { x: 24, y: 10, to: 'east_stage1', tx: 2, ty: 20 },
            { x: 0, y: 9, to: 'west_stage1', tx: 37, ty: 20 },
            { x: 0, y: 10, to: 'west_stage1', tx: 37, ty: 20 },
            { x: 12, y: 0, to: 'north_stage1', tx: 7, ty: 12 },
            { x: 13, y: 0, to: 'north_stage1', tx: 7, ty: 12 },
            { x: 12, y: 18, to: 'south_stage1', tx: 20, ty: 2 },
            { x: 13, y: 18, to: 'south_stage1', tx: 20, ty: 2 },
            // { x: 14, y: 12, to: 'demon_castle', tx: 10, ty: 15, requiresDemonCastle: true },
            { x: 4, y: 15, to: 'advanced_shop', tx: 4, ty: 6, requiresBossCount: 1 },
            { x: 5, y: 15, to: 'advanced_shop', tx: 4, ty: 6, requiresBossCount: 1 },
            { x: 19, y: 15, to: 'inn', tx: 4, ty: 6 },
            { x: 20, y: 15, to: 'inn', tx: 4, ty: 6 }
        ],
        start: { x: 12, y: 11 }
    };
}

// ショップマップ
export function initShopMaps(Maps, T) {
    // 魔法ショップ
    const hw = 9, hh = 8, ht = [];
    for (let y = 0; y < hh; y++) {
        const r = [];
        for (let x = 0; x < hw; x++) r.push(y === 0 || y === hh - 1 || x === 0 || x === hw - 1 ? T.HOUSE_WOOD : T.FLOOR);
        ht.push(r);
    }
    ht[2][3] = T.COUNTER; ht[2][4] = T.COUNTER; ht[2][5] = T.COUNTER;
    ht[hh - 1][4] = T.FLOOR;
    Maps.data.magic_shop = {
        w: hw, h: hh, tiles: ht,
        baseTile: T.FLOOR,
        npcs: [{ id: 'mage_shopkeeper', type: 'villager', x: 4, y: 1, msg: null, magicShop: true, blocking: true }],
        warps: [{ x: 4, y: 7, to: 'village', tx: 4, ty: 6 }],
        start: { x: 4, y: 5 }
    };

    // 通常ショップ
    const sw = 9, sh = 8, st = [];
    for (let y = 0; y < sh; y++) {
        const r = [];
        for (let x = 0; x < sw; x++) r.push(y === 0 || y === sh - 1 || x === 0 || x === sw - 1 ? T.HOUSE_WOOD : T.FLOOR);
        st.push(r);
    }
    st[2][3] = T.COUNTER; st[2][4] = T.COUNTER; st[2][5] = T.COUNTER;
    st[sh - 1][4] = T.FLOOR;
    Maps.data.shop_interior = {
        w: sw, h: sh, tiles: st,
        baseTile: T.FLOOR,
        npcs: [{ id: 'shopkeeper', type: 'villager', x: 4, y: 1, msg: null, shop: true, blocking: true }],
        warps: [{ x: 4, y: 7, to: 'village', tx: 19, ty: 6 }],
        start: { x: 4, y: 5 }
    };

    // 上級ショップ
    const aw = 9, ah = 8;
    // タイルは通常ショップと同じものを使用
    Maps.data.advanced_shop = {
        w: aw, h: ah, tiles: st,
        baseTile: T.FLOOR,
        npcs: [{ id: 'adv_shopkeeper', type: 'villager', x: 4, y: 1, msg: null, advancedShop: true, blocking: true }],
        warps: [{ x: 4, y: 7, to: 'village', tx: 4, ty: 16 }],
        start: { x: 4, y: 5 }
    };

    // 宿屋
    const iw = 9, ih = 8, it = [];
    for (let y = 0; y < ih; y++) {
        const r = [];
        for (let x = 0; x < iw; x++) r.push(y === 0 || y === ih - 1 || x === 0 || x === iw - 1 ? T.HOUSE_WOOD : T.FLOOR);
        it.push(r);
    }
    it[2][4] = T.PULPIT; // カウンター1つ
    it[ih - 1][4] = T.FLOOR;
    it[2][6] = T.BED; it[2][7] = T.BED; // ベッド装飾

    Maps.data.inn = {
        w: iw, h: ih, tiles: it,
        baseTile: T.FLOOR,
        npcs: [
            { id: 'innkeeper', type: 'villager', img: 'priest', x: 4.1, y: 1, width:0.8, height:1, msg: null, inn: true, blocking: true },
            { id: 'save_point', type: 'goddes', x: 1, y: 0.2, width:1, height:2, savePoint: true, blocking: true }
        ],
        warps: [{ x: 4, y: 7, to: 'village', tx: 19, ty: 16 }],
        start: { x: 4, y: 5 }
    };
}