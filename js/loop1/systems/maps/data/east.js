// ===========================================
// 東エリアマップデータ
// ===========================================

// 1週目：ボス直行マップ
// 1週目：探索エリア1層 + ボス部屋
function initEastWeek1(Maps, T) {
    const { createDungeonTiles } = MapHelper;

    // ステージ1 (41x41)
    const e1t = createDungeonTiles(41, 41, T);
    // 全体を草で埋める
    for (let y = 0; y < 41; y++) for (let x = 0; x < 41; x++) e1t[y][x] = T.GRASS;
    // ランダムに木と岩を配置して迷宮感を出す（ただし道は確保するため後で上書き）
    // Chests: (38, 38) -> Dragon Slayer, (38, 2) -> Flame Shield
    // Need to ensure paths to these points exist if they are isolated.
    // The previous loop logic had commented out paths to these locations.
    // Let's add them back implicitly in the tile array or logic.
    // Actually, Chests are processed by MapRenderer/Chests system, but usually data is in 'chests' array or similar?
    // Wait, the file 'east.js' doesn't explicitly list chests in `Maps.data.east_stage1`.
    // Let me check 'chests.js' or where chest data is defined.
    // Usually it's in `Maps.data.xxx.chests` or generated dynamically.
    // Looking at `player_controller.js`, `Chests.nearby` is used.
    // I need to check `js/loop1/systems/maps/chests.js` to see where chest data lives.
    // IF the map file defined them, they would be in `east.js`.
    // Let me check `east.js` again for `chests` property.
    // It is NOT in `Maps.data.east_stage1` in the view I just saw.
    // This means chests are likely in a separate file or I missed it.
    // Re-reading `east.js` showed NO `chests` property.
    // Checking `chests.js` is necessary.

    for (let y = 0; y < 41; y++) {
        for (let x = 0; x < 41; x++) {
            if (Math.random() < 0.3) e1t[y][x] = T.TREE;
            else if (Math.random() < 0.05) e1t[y][x] = T.ROCK;
        }
    }

    // 一本道：西(2,20)から東(38,20)へ、蛇行させる
    // Start(2,20) -> (10,20) -> (10, 10) -> (20, 10) -> (20, 30) -> (30, 30) -> (30, 20) -> End(38,20)
    const pathPoints = [
        [0, 20], [10, 20], [10, 13], [20, 13], [20, 25], [30, 25], [30, 20], [38, 20]
    ];
    let cx = pathPoints[0][0];
    let cy = pathPoints[0][1];

    for (let i = 1; i < pathPoints.length; i++) {
        const tx = pathPoints[i][0];
        const ty = pathPoints[i][1];
        while (cx !== tx || cy !== ty) {
            e1t[cy][cx] = T.PATH;
            if (cx < tx) cx++;
            else if (cx > tx) cx--;
            else if (cy < ty) cy++;
            else if (cy > ty) cy--;
        }
    }
    e1t[20][38] = T.PATH; // End point

    // 宝箱への小道（行き止まり）
    // 右下 (38, 38)
    //for (let y = 20; y <= 38; y++) e1t[y][30] = T.PATH; // 既存のパスから分岐
    //for (let x = 30; x <= 38; x++) e1t[38][x] = T.PATH;
    //
    //// 右上 (38, 2)
    //for (let y = 20; y >= 2; y--) e1t[y][30] = T.PATH; // 既存のパスから分岐
    //for (let x = 30; x <= 38; x++) e1t[2][x] = T.PATH;

    e1t[20][39] = T.EXIT;

    Maps.data.east_stage1 = {
        w: 41, h: 41, tiles: e1t, isDungeon: true, encounterRate: 0.008, area: 'east', week1Map: true,
        npcs: [{ id: 'e1_sign', type: 'signpost', x: 5, y: 20, msg: '【深緑の迷宮】\n木々の隙間を進め', blocking: true }],
        warps: [
            { x: 0, y: 20, to: 'village', tx: 23, ty: 9 },
            { x: 39, y: 20, to: 'east_boss_room', tx: 2, ty: 7 }
        ],
        start: { x: 2, y: 20 }
    };

    // ボス部屋 (15x15)
    const ebt = createDungeonTiles(15, 15, T);
    for (let x = 2; x <= 12; x++) ebt[7][x] = T.PATH;
    ebt[7][1] = T.EXIT;

    Maps.data.east_boss_room = {
        w: 15, h: 15, tiles: ebt, isDungeon: true, encounterRate: 0.008, area: 'east', week1Map: true,
        npcs: [{ id: 'eastBoss', type: 'enemy_slime', img: 'dragon_map', x: 10, y: 7, msg: null, areaBoss: 'east', blocking: true }],
        warps: [{ x: 1, y: 7, to: 'east_stage1', tx: 38, ty: 20 }],
        start: { x: 2, y: 7 }
    };
}

// 2週目は loop2/systems/maps/data/east.js に移動