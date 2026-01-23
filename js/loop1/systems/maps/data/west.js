// ===========================================
// 西エリアマップデータ
// ===========================================

// 1週目：スイッチ攻略型ダンジョン
// 1週目：探索エリア2層 + ボス部屋
// 1週目：スイッチ攻略型ダンジョン
// 1週目：探索エリア2層 + ボス部屋
function initWestWeek1(Maps, T) {
    const { createDungeonTiles } = MapHelper;

    // ヘルパー: パス掘削
    const carvePath = (tiles, points, tileType = T.PATH) => {
        let cx = points[0][0];
        let cy = points[0][1];

        for (let i = 1; i < points.length; i++) {
            const tx = points[i][0];
            const ty = points[i][1];
            while (cx !== tx || cy !== ty) {
                tiles[cy][cx] = tileType;
                if (cx < tx) cx++;
                else if (cx > tx) cx--;
                else if (cy < ty) cy++;
                else if (cy > ty) cy--;
            }
        }
        tiles[cy][cx] = tileType; // Last point
    };

    // ヘルパー: 迷宮生成（ランダム配置）
    const fillMaze = (tiles, w, h) => {
        // 全体を床(STONE)で埋める
        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                tiles[y][x] = T.STONE;
            }
        }
        // ランダム障害物
        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                // east.jsのリファレンス: TREE 0.3, ROCK 0.05
                // WestはSTATUEとROCK
                if (Math.random() < 0.2) tiles[y][x] = T.STATUE;
                else if (Math.random() < 0.1) tiles[y][x] = T.ROCK;
            }
        }
    };

    // ----------------------------------------------------------------
    // ステージ1 (41x41)
    // ----------------------------------------------------------------
    const w1t = createDungeonTiles(41, 41, T);
    fillMaze(w1t, 41, 41);

    // 一本道パス: Start(39, 20) -> End(1, 20)
    // 蛇行させる
    const path1 = [
        [39, 20], [30, 20], [30, 10], [20, 10], [20, 30], [10, 30], [10, 20], [1, 20]
    ];
    carvePath(w1t, path1, T.PATH);

    // スイッチへの分岐パス
    // (20, 30)付近から分岐して南へ
    const switchPath1 = [
        [20, 31], [20, 35], [27, 35]
    ];
    // T.STONEで道を隠す（障害物除去のみ）
    carvePath(w1t, switchPath1, T.STONE);
    w1t[35][28] = T.SWITCH;

    // ゴール
    w1t[20][1] = T.STAIRS;
    w1t[20][40] = T.EXIT; // To Village

    Maps.data.west_stage1 = {
        w: 41, h: 41, tiles: w1t, isDungeon: true, encounterRate: 0.0, area: 'west', week1Map: true,
        bgm: 'dungeon',
        npcs: [
            { id: 'w1_sign', type: 'signpost', x: 38, y: 19, msg: '【西の塔 1階】\n石像の迷宮', blocking: true }
        ],
        warps: [
            { x: 40, y: 20, to: 'village', tx: 1, ty: 12 },
            { x: 1, y: 20, to: 'west_stage2', tx: 39, ty: 20, requiresSwitch: 'stage1' } // ty修正
        ],
        start: { x: 39, y: 20 }
    };

    // ----------------------------------------------------------------
    // ステージ2 (41x41)
    // ----------------------------------------------------------------
    const w2t = createDungeonTiles(41, 41, T);
    fillMaze(w2t, 41, 41);

    // 一本道パス: Start(39, 20) -> End(1, 20)
    // 別パターンで蛇行
    const path2 = [
        [39, 20], [35, 20], [35, 35], [15, 35], [15, 5], [5, 5], [5, 20], [1, 20]
    ];
    carvePath(w2t, path2, T.PATH);

    // スイッチへの分岐パス
    // (15, 35)付近から分岐
    const switchPath2 = [
        [15, 36], [15, 38], [9, 38]
    ];
    // T.STONEで道を隠す
    carvePath(w2t, switchPath2, T.STONE);
    w2t[38][8] = T.SWITCH;

    // ゴール
    w2t[20][1] = T.STAIRS;
    w2t[20][40] = T.STAIRS; // Back to Stage 1

    Maps.data.west_stage2 = {
        w: 41, h: 41, tiles: w2t, isDungeon: true, encounterRate: 0.0, area: 'west', week1Map: true,
        bgm: 'dungeon',
        npcs: [],
        warps: [
            { x: 40, y: 20, to: 'west_stage1', tx: 2, ty: 20 },
            { x: 1, y: 20, to: 'west_boss_room', tx: 13, ty: 7, requiresSwitch: 'stage2' } // ty修正
        ],
        start: { x: 39, y: 20 }
    };

    // ----------------------------------------------------------------
    // ボス部屋 (15x15)
    // ----------------------------------------------------------------
    const wbt = createDungeonTiles(15, 15, T);
    // 床
    for (let y = 1; y < 14; y++) for (let x = 1; x < 14; x++) wbt[y][x] = T.STONE;

    // 一本道 (Path)
    for (let x = 2; x <= 13; x++) wbt[7][x] = T.PATH;
    wbt[7][14] = T.STAIRS; // 戻り

    Maps.data.west_boss_room = {
        w: 15, h: 15, tiles: wbt, isDungeon: true, encounterRate: 0, area: 'west', week1Map: true,
        bgm: 'boss',
        npcs: [
            { id: 'westBoss', type: 'enemy_monster', img: 'enemy_monster', x: 4, y: 7, msg: null, areaBoss: 'west', blocking: true, name: '大魔道士', atk: 18, def: 5, hp: 80, exp: 50 }
        ],
        warps: [
            { x: 14, y: 7, to: 'west_stage2', tx: 2, ty: 20 }
        ],
        start: { x: 13, y: 7 }
    };
}
