// ===========================================
// マップデータ定義（2週目拡張版）
// ===========================================
function initMapData(Maps) {
    const T = GameConfig.TILE_TYPES;

    // ===== ヘルパー: ダンジョンマップ生成 =====
    function createDungeonTiles(w, h) {
        const tiles = [];
        for (let y = 0; y < h; y++) {
            const row = [];
            for (let x = 0; x < w; x++) {
                row.push(y === 0 || y === h - 1 || x === 0 || x === w - 1 ? T.ROCK : T.FLOOR);
            }
            tiles.push(row);
        }
        return tiles;
    }

    // ===== ヘルパー: 草原マップ生成 =====
    function createFieldTiles(w, h) {
        const tiles = [];
        for (let y = 0; y < h; y++) {
            const row = [];
            for (let x = 0; x < w; x++) {
                row.push(x === 0 || x === w - 1 || y === 0 || y === h - 1 ? T.ROCK : T.GRASS);
            }
            tiles.push(row);
        }
        return tiles;
    }

    // ===========================================
    // 共通マップ（村、ショップ）
    // ===========================================

    // ===== 村 =====
    const vw = 25, vh = 18, vt = [];
    for (let y = 0; y < vh; y++) { const r = []; for (let x = 0; x < vw; x++) r.push(T.GRASS); vt.push(r); }
    for (let x = 2; x < vw - 2; x++) vt[9][x] = T.PATH;
    for (let y = 2; y < vh - 2; y++) vt[y][12] = T.PATH;
    for (let y = 2; y <= 5; y++) for (let x = 3; x <= 6; x++) vt[y][x] = T.HOUSE;
    vt[5][4] = T.DOOR;
    for (let y = 2; y <= 5; y++) for (let x = 17; x <= 21; x++) vt[y][x] = T.HOUSE;
    vt[5][19] = T.DOOR;
    for (let y = 12; y <= 15; y++) for (let x = 18; x <= 22; x++) vt[y][x] = T.WATER;
    [[1, 1], [23, 3], [2, 15], [20, 1], [15, 15]].forEach(([x, y]) => { if (vt[y] && vt[y][x] === T.GRASS) vt[y][x] = T.ROCK; });
    vt[9][24] = T.PATH;
    vt[9][0] = T.PATH;
    vt[0][12] = T.PATH;
    vt[vh - 1][12] = T.PATH;

    Maps.data.village = {
        w: vw, h: vh, tiles: vt, encounterRate: 0.02,
        npcs: [
            { id: 'npc1', type: 'villager', x: 8, y: 9, msg: 'ようこそ！\n草原を歩くとモンスターに会うよ。', blocking: true },
            { id: 'shop', type: 'villager', x: 19, y: 4, msg: null, shop: true, blocking: true },
            { id: 'guard', type: 'guard', x: 23, y: 9, msg: null, guard: true, blocking: true },
            { id: 'westGuard', type: 'guard', x: 1, y: 9, msg: null, westGuard: true, blocking: true },
            { id: 'sign1', type: 'signpost', x: 12, y: 7, msg: '【始まりの村】\n東西南北、全ての道はここに通ず', blocking: true },
            // 2週目専用: アレックス（最初の仲間）
            {
                id: 'alex_join', type: 'villager', img: 'ally_alex', x: 10, y: 11,
                msg: null, partyJoin: 'alex', week2Only: true, blocking: true
            }
        ],
        warps: [
            { x: 4, y: 5, to: 'magic_shop', tx: 4, ty: 6 },
            { x: 19, y: 5, to: 'shop_interior', tx: 4, ty: 6 },
            // MAP_DECEPTION: 1週目は直接ボスへ、2週目はステージ1へ
            { x: 24, y: 9, to: 'east_stage1', tx: 3, ty: 6, week2Only: true },
            { x: 24, y: 9, to: 'dungeon', tx: 3, ty: 6, week1Only: true },
            { x: 0, y: 9, to: 'west_stage1', tx: 16, ty: 9, week2Only: true },
            { x: 0, y: 9, to: 'dungeon_west', tx: 12, ty: 6, week1Only: true },
            { x: 12, y: 0, to: 'north_stage1', tx: 9, ty: 16, week2Only: true },
            { x: 12, y: 0, to: 'north_snowfield', tx: 7, ty: 12, week1Only: true },
            { x: 12, y: 17, to: 'south_stage1', tx: 9, ty: 1, week2Only: true },
            { x: 12, y: 17, to: 'south_forest', tx: 7, ty: 1, week1Only: true }
        ],
        start: { x: 12, y: 11 }
    };

    // ===== 魔法ショップ =====
    const hw = 9, hh = 8, ht = [];
    for (let y = 0; y < hh; y++) { const r = []; for (let x = 0; x < hw; x++) r.push(y === 0 || y === hh - 1 || x === 0 || x === hw - 1 ? T.HOUSE : T.FLOOR); ht.push(r); }
    ht[2][3] = T.COUNTER; ht[2][4] = T.COUNTER; ht[2][5] = T.COUNTER;
    ht[hh - 1][4] = T.EXIT;
    Maps.data.magic_shop = {
        w: hw, h: hh, tiles: ht,
        npcs: [{ id: 'mage_shopkeeper', type: 'villager', x: 4, y: 1, msg: null, magicShop: true, blocking: true }],
        warps: [{ x: 4, y: 7, to: 'village', tx: 4, ty: 6 }],
        start: { x: 4, y: 5 }
    };

    // ===== ショップ内部 =====
    const sw = 9, sh = 8, st = [];
    for (let y = 0; y < sh; y++) { const r = []; for (let x = 0; x < sw; x++) r.push(y === 0 || y === sh - 1 || x === 0 || x === sw - 1 ? T.HOUSE : T.FLOOR); st.push(r); }
    st[2][3] = T.COUNTER; st[2][4] = T.COUNTER; st[2][5] = T.COUNTER;
    st[sh - 1][4] = T.EXIT;
    Maps.data.shop_interior = {
        w: sw, h: sh, tiles: st,
        npcs: [{ id: 'shopkeeper', type: 'villager', x: 4, y: 1, msg: null, shop: true, blocking: true }],
        warps: [{ x: 4, y: 7, to: 'village', tx: 19, ty: 6 }],
        start: { x: 4, y: 5 }
    };

    // ===========================================
    // 1週目用マップ（1本道 → ボス直行）
    // ===========================================

    // ===== 東ダンジョン（1週目: ボス直行）=====
    const dw = 14, dh = 14, dt = createDungeonTiles(dw, dh);
    for (let x = 1; x <= 12; x++) dt[6][x] = T.PATH;
    dt[6][1] = T.EXIT;
    Maps.data.dungeon = {
        w: dw, h: dh, tiles: dt, isDungeon: true, encounterRate: 0.15, area: 'east', week1Map: true,
        npcs: [{ id: 'eastBoss', type: 'enemy_slime', img: 'dragon_map', x: 10, y: 6, msg: null, areaBoss: 'east', blocking: true }],
        warps: [{ x: 1, y: 6, to: 'village', tx: 23, ty: 10 }],
        start: { x: 2, y: 6 }
    };

    // ===== 西ダンジョン（1週目: ボス直行）=====
    const wwdt = createDungeonTiles(14, 14);
    for (let x = 1; x <= 12; x++) wwdt[6][x] = T.PATH;
    wwdt[6][13] = T.EXIT;
    Maps.data.dungeon_west = {
        w: 14, h: 14, tiles: wwdt, isDungeon: true, encounterRate: 0.15, area: 'west', week1Map: true,
        npcs: [{ id: 'westBoss', type: 'enemy_slime', img: 'great_mage_map', x: 3, y: 6, msg: null, areaBoss: 'west', blocking: true }],
        warps: [{ x: 13, y: 6, to: 'village', tx: 2, ty: 9 }],
        start: { x: 11, y: 6 }
    };

    // ===== 北エリア（1週目: ボス直行）=====
    const nt = createFieldTiles(14, 14);
    nt[13][7] = T.EXIT;
    for (let y = 1; y < 13; y++) nt[y][7] = T.PATH;
    Maps.data.north_snowfield = {
        w: 14, h: 14, tiles: nt, encounterRate: 0.15, area: 'north', week1Map: true,
        npcs: [{ id: 'northBoss', type: 'enemy_yeti', img: 'ice_golem_map', x: 7, y: 2, msg: null, areaBoss: 'north', blocking: true }],
        warps: [{ x: 7, y: 13, to: 'village', tx: 12, ty: 1 }],
        start: { x: 7, y: 12 }
    };

    // ===== 南エリア（1週目: ボス直行）=====
    const stt = createFieldTiles(14, 14);
    stt[0][7] = T.EXIT;
    for (let y = 1; y <= 12; y++) stt[y][7] = T.PATH;
    Maps.data.south_forest = {
        w: 14, h: 14, tiles: stt, encounterRate: 0.15, area: 'south', week1Map: true,
        npcs: [{ id: 'southBoss', type: 'enemy_skeleton', img: 'phantom_knight_map', x: 7, y: 10, msg: null, areaBoss: 'south', blocking: true }],
        warps: [{ x: 7, y: 0, to: 'village', tx: 12, ty: 16 }],
        start: { x: 7, y: 1 }
    };

    // ===========================================
    // 2週目用マップ - 東の森（シンプル迷路）
    // 難易度: ★☆☆☆ - 最初のダンジョン
    // ===========================================

    // ===== 東エリア - ステージ1（森の入口）=====
    const e1t = createFieldTiles(20, 16);
    // メイン通路
    for (let x = 2; x <= 17; x++) e1t[8][x] = T.PATH;
    // 分岐路（デコイ）
    for (let y = 4; y <= 8; y++) e1t[y][6] = T.PATH;
    for (let y = 8; y <= 12; y++) e1t[y][14] = T.PATH;
    // 障害物（岩）
    e1t[6][10] = T.ROCK; e1t[7][10] = T.ROCK;
    e1t[9][10] = T.ROCK; e1t[10][10] = T.ROCK;
    // 入口・出口
    e1t[8][1] = T.EXIT;
    Maps.data.east_stage1 = {
        w: 20, h: 16, tiles: e1t, encounterRate: 0.10, area: 'east', week2Map: true,
        gimmick: 'maze_simple',
        npcs: [
            { id: 'e1_sign', type: 'signpost', x: 4, y: 8, msg: '【緑深き森】\n東へ進めば先に続く', blocking: true }
        ],
        warps: [
            { x: 1, y: 8, to: 'village', tx: 23, ty: 9 },
            { x: 18, y: 8, to: 'east_stage2', tx: 2, ty: 8 }
        ],
        start: { x: 2, y: 8 }
    };

    // ===== 東エリア - ステージ2（迷いの森）=====
    const e2t = createFieldTiles(24, 20);
    // 複雑な迷路パターン
    // メイン通路
    for (let x = 2; x <= 6; x++) e2t[8][x] = T.PATH;
    for (let y = 8; y <= 14; y++) e2t[y][6] = T.PATH;
    for (let x = 6; x <= 18; x++) e2t[14][x] = T.PATH;
    for (let y = 8; y <= 14; y++) e2t[y][18] = T.PATH;
    for (let x = 18; x <= 22; x++) e2t[8][x] = T.PATH;
    // 行き止まりの分岐
    for (let x = 8; x <= 14; x++) e2t[10][x] = T.PATH;
    for (let y = 4; y <= 10; y++) e2t[y][12] = T.PATH;
    e2t[4][12] = T.ROCK; // 行き止まり
    // 隠し通路へのヒント
    for (let x = 10; x <= 14; x++) e2t[16][x] = T.PATH;
    // 入口・出口
    e2t[8][1] = T.EXIT;
    Maps.data.east_stage2 = {
        w: 24, h: 20, tiles: e2t, encounterRate: 0.12, area: 'east', week2Map: true,
        gimmick: 'maze_medium',
        npcs: [
            { id: 'e2_sign', type: 'signpost', x: 12, y: 14, msg: '迷ったら引き返せ\n正解の道は一つだけ', blocking: true }
        ],
        warps: [
            { x: 1, y: 8, to: 'east_stage1', tx: 17, ty: 8 },
            { x: 22, y: 8, to: 'east_stage3', tx: 2, ty: 8 }
        ],
        start: { x: 2, y: 8 }
    };

    // ===== 東エリア - ステージ3（竜の巣への道）=====
    const e3t = createDungeonTiles(18, 18);
    // 洞窟内の通路
    for (let x = 2; x <= 15; x++) e3t[9][x] = T.PATH;
    for (let y = 5; y <= 13; y++) e3t[y][9] = T.PATH;
    // 宝箱部屋への通路
    for (let x = 3; x <= 6; x++) e3t[5][x] = T.FLOOR;
    for (let y = 3; y <= 5; y++) e3t[y][5] = T.PATH;
    // 入口・出口
    e3t[9][1] = T.EXIT;
    Maps.data.east_stage3 = {
        w: 18, h: 18, tiles: e3t, isDungeon: true, encounterRate: 0.14, area: 'east', week2Map: true,
        gimmick: 'maze_final',
        npcs: [],
        warps: [
            { x: 1, y: 9, to: 'east_stage2', tx: 21, ty: 8 },
            { x: 16, y: 9, to: 'east_boss_room', tx: 2, ty: 7 }
        ],
        start: { x: 2, y: 9 }
    };

    // ===== 東エリア - ボス部屋 =====
    const ebt = createDungeonTiles(16, 14);
    // ボス部屋の広場
    for (let x = 2; x <= 13; x++) ebt[7][x] = T.PATH;
    for (let y = 4; y <= 10; y++) ebt[y][8] = T.PATH;
    // 装飾
    for (let x = 5; x <= 11; x++) for (let y = 5; y <= 9; y++) {
        if (x >= 6 && x <= 10 && y >= 6 && y <= 8) ebt[y][x] = T.FLOOR;
    }
    ebt[7][1] = T.EXIT;
    Maps.data.east_boss_room = {
        w: 16, h: 14, tiles: ebt, isDungeon: true, encounterRate: 0, area: 'east', week2Map: true,
        npcs: [{ id: 'eastTrueBoss', type: 'enemy_slime', img: 'dragon_map', x: 12, y: 7, msg: null, areaBoss: 'east', trueAreaBoss: true, blocking: true }],
        warps: [{ x: 1, y: 7, to: 'east_stage3', tx: 15, ty: 9 }],
        start: { x: 2, y: 7 }
    };

    // ===========================================
    // 2週目用マップ - 西の魔塔（魔法が必要）
    // 難易度: ★★☆☆ - 魔法ギミック
    // ===========================================

    // ===== 西エリア - ステージ1（魔塔入口）=====
    const w1t = createDungeonTiles(20, 18);
    // 通路パターン
    for (let x = 2; x <= 17; x++) w1t[9][x] = T.PATH;
    for (let y = 5; y <= 13; y++) w1t[y][10] = T.PATH;
    // 魔法障壁（水タイルで表現 - 火魔法で通過可能）
    w1t[9][8] = T.WATER; w1t[9][12] = T.WATER;
    // 入口・出口
    w1t[9][18] = T.EXIT;
    Maps.data.west_stage1 = {
        w: 20, h: 18, tiles: w1t, isDungeon: true, encounterRate: 0.10, area: 'west', week2Map: true,
        gimmick: 'magic_barrier',
        gimmickRequires: 'fire',
        npcs: [
            { id: 'w1_sign', type: 'signpost', x: 5, y: 9, msg: '【魔法の塔】\n氷の障壁は炎で溶ける', blocking: true },
            // ローズとの出会い（東ボス撃破後）
            {
                id: 'rose_join', type: 'villager', img: 'ally_rose', x: 14, y: 9,
                msg: null, partyJoin: 'rose', requiresBoss: 'east', week2Only: true, blocking: true
            }
        ],
        warps: [
            { x: 18, y: 9, to: 'village', tx: 2, ty: 9 },
            { x: 2, y: 9, to: 'west_stage2', tx: 16, ty: 9 }
        ],
        start: { x: 17, y: 9 }
    };

    // ===== 西エリア - ステージ2（魔法陣の間）=====
    const w2t = createDungeonTiles(20, 20);
    // 中央の大きな広間
    for (let x = 5; x <= 14; x++) for (let y = 5; y <= 14; y++) w2t[y][x] = T.FLOOR;
    // 通路
    for (let x = 2; x <= 5; x++) w2t[10][x] = T.PATH;
    for (let x = 14; x <= 17; x++) w2t[10][x] = T.PATH;
    // 魔法陣（パズル用 - 正しい順番で踏む）
    w2t[8][8] = T.WATER; w2t[8][11] = T.WATER;
    w2t[11][8] = T.WATER; w2t[11][11] = T.WATER;
    // 入口・出口
    w2t[10][18] = T.EXIT;
    Maps.data.west_stage2 = {
        w: 20, h: 20, tiles: w2t, isDungeon: true, encounterRate: 0.12, area: 'west', week2Map: true,
        gimmick: 'magic_circle',
        gimmickRequires: 'water',
        npcs: [
            { id: 'w2_sign', type: 'signpost', x: 10, y: 10, msg: '魔法陣を正しい順に起動せよ\n北西→北東→南東→南西', blocking: true }
        ],
        warps: [
            { x: 18, y: 10, to: 'west_stage1', tx: 3, ty: 9 },
            { x: 2, y: 10, to: 'west_stage3', tx: 14, ty: 8 }
        ],
        start: { x: 17, y: 10 }
    };

    // ===== 西エリア - ステージ3（塔の頂上）=====
    const w3t = createDungeonTiles(16, 16);
    // 頂上への道
    for (let x = 2; x <= 13; x++) w3t[8][x] = T.PATH;
    for (let y = 4; y <= 12; y++) w3t[y][8] = T.PATH;
    // 最後の魔法障壁
    w3t[8][6] = T.WATER;
    // 入口・出口
    w3t[8][14] = T.EXIT;
    Maps.data.west_stage3 = {
        w: 16, h: 16, tiles: w3t, isDungeon: true, encounterRate: 0.14, area: 'west', week2Map: true,
        gimmick: 'magic_final',
        gimmickRequires: 'wind',
        npcs: [],
        warps: [
            { x: 14, y: 8, to: 'west_stage2', tx: 3, ty: 10 },
            { x: 2, y: 8, to: 'west_boss_room', tx: 12, ty: 7 }
        ],
        start: { x: 13, y: 8 }
    };

    // ===== 西エリア - ボス部屋 =====
    const wbt = createDungeonTiles(16, 14);
    for (let x = 2; x <= 13; x++) wbt[7][x] = T.PATH;
    for (let x = 5; x <= 11; x++) for (let y = 5; y <= 9; y++) wbt[y][x] = T.FLOOR;
    wbt[7][14] = T.EXIT;
    Maps.data.west_boss_room = {
        w: 16, h: 14, tiles: wbt, isDungeon: true, encounterRate: 0, area: 'west', week2Map: true,
        npcs: [{ id: 'westTrueBoss', type: 'enemy_slime', img: 'great_mage_map', x: 3, y: 7, msg: null, areaBoss: 'west', trueAreaBoss: true, blocking: true }],
        warps: [{ x: 14, y: 7, to: 'west_stage3', tx: 3, ty: 8 }],
        start: { x: 13, y: 7 }
    };

    // ===========================================
    // 2週目用マップ - 南の墓地（視界制限）
    // 難易度: ★★★☆ - 暗闘ギミック
    // ===========================================

    // ===== 南エリア - ステージ1（墓地入口）=====
    const s1t = createFieldTiles(20, 18);
    // 通路
    for (let y = 2; y <= 15; y++) s1t[y][10] = T.PATH;
    for (let x = 5; x <= 15; x++) s1t[8][x] = T.PATH;
    // 墓石（障害物）
    s1t[5][8] = T.ROCK; s1t[5][12] = T.ROCK;
    s1t[11][8] = T.ROCK; s1t[11][12] = T.ROCK;
    // 入口・出口
    s1t[1][10] = T.EXIT;
    Maps.data.south_stage1 = {
        w: 20, h: 18, tiles: s1t, encounterRate: 0.10, area: 'south', week2Map: true,
        gimmick: 'dark_vision',
        darkLevel: 1,
        npcs: [
            { id: 's1_sign', type: 'signpost', x: 10, y: 4, msg: '【忘却の墓地】\n南へ進むほど闇は深くなる', blocking: true },
            // ミリアとの出会い（西ボス撃破後）
            {
                id: 'milia_join', type: 'villager', img: 'ally_milia', x: 8, y: 8,
                msg: null, partyJoin: 'milia', requiresBoss: 'west', week2Only: true, blocking: true
            }
        ],
        warps: [
            { x: 10, y: 1, to: 'village', tx: 12, ty: 16 },
            { x: 10, y: 16, to: 'south_stage2', tx: 10, ty: 2 }
        ],
        start: { x: 10, y: 2 }
    };

    // ===== 南エリア - ステージ2（幽霊の回廊）=====
    const s2t = createDungeonTiles(22, 22);
    // 暗い回廊
    for (let y = 2; y <= 19; y++) s2t[y][11] = T.PATH;
    for (let x = 5; x <= 17; x++) s2t[11][x] = T.PATH;
    // 幽霊が出現する場所
    s2t[6][11] = T.FLOOR; s2t[16][11] = T.FLOOR;
    // 入口・出口
    s2t[1][11] = T.EXIT;
    Maps.data.south_stage2 = {
        w: 22, h: 22, tiles: s2t, isDungeon: true, encounterRate: 0.14, area: 'south', week2Map: true,
        gimmick: 'dark_vision',
        darkLevel: 2,
        npcs: [
            {
                id: 's2_ghost', type: 'villager', x: 11, y: 11,
                msg: '（亡霊の声）\n先へ進みたいなら…南へ…', blocking: false
            }
        ],
        warps: [
            { x: 11, y: 1, to: 'south_stage1', tx: 10, ty: 15 },
            { x: 11, y: 20, to: 'south_stage3', tx: 8, ty: 2 }
        ],
        start: { x: 11, y: 2 }
    };

    // ===== 南エリア - ステージ3（冥府の祠）=====
    const s3t = createDungeonTiles(18, 18);
    // 最も暗い場所
    for (let y = 2; y <= 15; y++) s3t[y][9] = T.PATH;
    for (let x = 4; x <= 14; x++) s3t[9][x] = T.PATH;
    // 祠
    for (let x = 7; x <= 11; x++) for (let y = 12; y <= 14; y++) s3t[y][x] = T.FLOOR;
    // 入口・出口
    s3t[1][9] = T.EXIT;
    Maps.data.south_stage3 = {
        w: 18, h: 18, tiles: s3t, isDungeon: true, encounterRate: 0.16, area: 'south', week2Map: true,
        gimmick: 'dark_vision',
        darkLevel: 3,
        npcs: [],
        warps: [
            { x: 9, y: 1, to: 'south_stage2', tx: 11, ty: 19 },
            { x: 9, y: 16, to: 'south_boss_room', tx: 7, ty: 2 }
        ],
        start: { x: 9, y: 2 }
    };

    // ===== 南エリア - ボス部屋 =====
    const sbt = createDungeonTiles(16, 14);
    for (let y = 2; y <= 11; y++) sbt[y][8] = T.PATH;
    for (let x = 4; x <= 12; x++) for (let y = 5; y <= 9; y++) sbt[y][x] = T.FLOOR;
    sbt[1][8] = T.EXIT;
    Maps.data.south_boss_room = {
        w: 16, h: 14, tiles: sbt, isDungeon: true, encounterRate: 0, area: 'south', week2Map: true,
        npcs: [{ id: 'southTrueBoss', type: 'enemy_skeleton', img: 'phantom_knight_map', x: 8, y: 10, msg: null, areaBoss: 'south', trueAreaBoss: true, blocking: true }],
        warps: [{ x: 8, y: 1, to: 'south_stage3', tx: 9, ty: 15 }],
        start: { x: 8, y: 2 }
    };

    // ===========================================
    // 2週目用マップ - 北の氷山（全員の力が必要）
    // 難易度: ★★★★ - パーティ必須ギミック
    // ===========================================

    // ===== 北エリア - ステージ1（氷の平原）=====
    const n1t = createFieldTiles(22, 18);
    // 雪原の道
    for (let y = 2; y <= 15; y++) n1t[y][11] = T.PATH;
    for (let x = 5; x <= 17; x++) n1t[9][x] = T.PATH;
    // 氷の湖（通行不可）
    for (let x = 3; x <= 7; x++) for (let y = 3; y <= 7; y++) n1t[y][x] = T.WATER;
    for (let x = 14; x <= 18; x++) for (let y = 11; y <= 15; y++) n1t[y][x] = T.WATER;
    // 入口・出口
    n1t[16][11] = T.EXIT;
    Maps.data.north_stage1 = {
        w: 22, h: 18, tiles: n1t, encounterRate: 0.10, area: 'north', week2Map: true,
        gimmick: 'party_required',
        requiresPartySize: 1,
        npcs: [
            { id: 'n1_sign', type: 'signpost', x: 11, y: 14, msg: '【極寒の地】\n北へ進むには仲間の力が必要', blocking: true }
        ],
        warps: [
            { x: 11, y: 16, to: 'village', tx: 12, ty: 1 },
            { x: 11, y: 2, to: 'north_stage2', tx: 9, ty: 16 }
        ],
        start: { x: 11, y: 15 }
    };

    // ===== 北エリア - ステージ2（凍てつく洞窟）=====
    const n2t = createDungeonTiles(20, 20);
    // 洞窟内の通路
    for (let y = 2; y <= 17; y++) n2t[y][10] = T.PATH;
    for (let x = 4; x <= 16; x++) n2t[10][x] = T.PATH;
    // 滑る床（パズル要素）
    n2t[6][10] = T.WATER; n2t[14][10] = T.WATER;
    // 入口・出口
    n2t[18][10] = T.EXIT;
    Maps.data.north_stage2 = {
        w: 20, h: 20, tiles: n2t, isDungeon: true, encounterRate: 0.12, area: 'north', week2Map: true,
        gimmick: 'party_required',
        requiresPartySize: 2,
        npcs: [],
        warps: [
            { x: 10, y: 18, to: 'north_stage1', tx: 11, ty: 3 },
            { x: 10, y: 2, to: 'north_stage3', tx: 8, ty: 16 }
        ],
        start: { x: 10, y: 17 }
    };

    // ===== 北エリア - ステージ3（氷晶の回廊）=====
    const n3t = createDungeonTiles(18, 20);
    // 最終通路
    for (let y = 2; y <= 17; y++) n3t[y][9] = T.PATH;
    for (let x = 3; x <= 15; x++) n3t[10][x] = T.PATH;
    // 氷の壁（全員の力で破壊）
    n3t[5][9] = T.WATER;
    // 入口・出口
    n3t[18][9] = T.EXIT;
    Maps.data.north_stage3 = {
        w: 18, h: 20, tiles: n3t, isDungeon: true, encounterRate: 0.14, area: 'north', week2Map: true,
        gimmick: 'party_required',
        requiresPartySize: 3,
        npcs: [
            { id: 'n3_sign', type: 'signpost', x: 9, y: 12, msg: '氷の壁を破るには\n3人の力が必要だ', blocking: true }
        ],
        warps: [
            { x: 9, y: 18, to: 'north_stage2', tx: 10, ty: 3 },
            { x: 9, y: 2, to: 'north_stage4', tx: 7, ty: 14 }
        ],
        start: { x: 9, y: 17 }
    };

    // ===== 北エリア - ステージ4（氷晶の迷宮）=====
    const n4t = createDungeonTiles(16, 18);
    // 最終迷路
    for (let y = 2; y <= 15; y++) n4t[y][8] = T.PATH;
    for (let x = 3; x <= 13; x++) n4t[8][x] = T.PATH;
    // 入口・出口
    n4t[16][8] = T.EXIT;
    Maps.data.north_stage4 = {
        w: 16, h: 18, tiles: n4t, isDungeon: true, encounterRate: 0.16, area: 'north', week2Map: true,
        gimmick: 'party_required',
        requiresPartySize: 3,
        npcs: [],
        warps: [
            { x: 8, y: 16, to: 'north_stage3', tx: 9, ty: 3 },
            { x: 8, y: 2, to: 'north_boss_room', tx: 7, ty: 12 }
        ],
        start: { x: 8, y: 15 }
    };

    // ===== 北エリア - ボス部屋 =====
    const nbt = createDungeonTiles(16, 14);
    for (let y = 2; y <= 11; y++) nbt[y][8] = T.PATH;
    for (let x = 4; x <= 12; x++) for (let y = 4; y <= 8; y++) nbt[y][x] = T.FLOOR;
    nbt[12][8] = T.EXIT;
    Maps.data.north_boss_room = {
        w: 16, h: 14, tiles: nbt, isDungeon: true, encounterRate: 0, area: 'north', week2Map: true,
        npcs: [{ id: 'northTrueBoss', type: 'enemy_yeti', img: 'ice_golem_map', x: 8, y: 3, msg: null, areaBoss: 'north', trueAreaBoss: true, blocking: true }],
        warps: [
            { x: 8, y: 12, to: 'north_stage4', tx: 8, ty: 3 },
            // 北ボス撃破後に魔王城へ
            { x: 8, y: 2, to: 'demon_castle', tx: 7, ty: 12, requiresBoss: 'north' }
        ],
        start: { x: 8, y: 11 }
    };

    // ===========================================
    // 魔王城（北ボスの奥）
    // ===========================================

    // ===== 魔王城 - 入口 =====
    const dc1t = createDungeonTiles(20, 18);
    // 玉座への道
    for (let y = 2; y <= 15; y++) dc1t[y][10] = T.PATH;
    for (let x = 4; x <= 16; x++) dc1t[9][x] = T.PATH;
    // 装飾
    for (let x = 7; x <= 13; x++) for (let y = 5; y <= 7; y++) dc1t[y][x] = T.FLOOR;
    // 入口・出口
    dc1t[16][10] = T.EXIT;
    Maps.data.demon_castle = {
        w: 20, h: 18, tiles: dc1t, isDungeon: true, encounterRate: 0.12, area: 'demon',
        npcs: [
            { id: 'dc_sign', type: 'signpost', x: 10, y: 12, msg: '【魔王城】\nここが最後の戦いの場所…', blocking: true }
        ],
        warps: [
            { x: 10, y: 16, to: 'north_boss_room', tx: 8, ty: 3 },
            { x: 10, y: 2, to: 'demon_throne', tx: 7, ty: 12 }
        ],
        start: { x: 10, y: 15 }
    };

    // ===== 魔王城 - 玉座の間 =====
    const dc2t = createDungeonTiles(16, 14);
    for (let y = 2; y <= 11; y++) dc2t[y][8] = T.PATH;
    // 玉座
    for (let x = 5; x <= 11; x++) for (let y = 3; y <= 5; y++) dc2t[y][x] = T.FLOOR;
    dc2t[12][8] = T.EXIT;
    Maps.data.demon_throne = {
        w: 16, h: 14, tiles: dc2t, isDungeon: true, encounterRate: 0, area: 'demon',
        npcs: [{ id: 'demonKing', type: 'enemy_slime', img: 'enemy_slime', x: 8, y: 4, msg: null, demonKing: true, blocking: true }],
        warps: [{ x: 8, y: 12, to: 'demon_castle', tx: 10, ty: 3 }],
        start: { x: 8, y: 11 }
    };
}
