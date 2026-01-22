// ===========================================
// 西エリアマップデータ
// ===========================================

// 1週目：スイッチ攻略型ダンジョン
// 1週目：探索エリア2層 + ボス部屋
function initWestWeek1(Maps, T) {
    const { createDungeonTiles } = MapHelper;

    // ----------------------------------------------------------------
    // ステージ1 (41x41) - 最初のスイッチ
    // ----------------------------------------------------------------
    const w1t = createDungeonTiles(41, 41, T);

    // 基本は岩(ROCK)と床(STONE)だが、createDungeonTilesで初期化済み
    // ここではさらに複雑な迷路を描画

    // スタート地点: 東側 (39, 20) -> Villageへ
    // ゴール地点: 西側 (1, 20) -> Stage 2へ

    // 中央通路（部分的）
    for (let x = 30; x < 40; x++) w1t[20][x] = T.floor || T.STONE;

    // 迷路生成（簡易的な一本道＋分岐）
    // Start -> Switch -> Goal の順でしか行けない構造にするか、
    // あるいは自由に歩けるがGoalが開かない構造にする。
    // Request: "スイッチを押さないと進まない" -> 物理的に通れないのではなく、Warpが反応しない（メッセージが出る）。

    // 通路掘削 helper
    const dig = (x1, y1, x2, y2) => {
        const minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                w1t[y][x] = T.STONE;
            }
        }
    };

    // メインルート
    dig(20, 20, 39, 20); // 入口周辺
    dig(20, 20, 20, 10); // 北へ
    dig(20, 10, 10, 10); // 西へ
    dig(10, 10, 10, 30); // 南へ（スイッチ方面分岐点）
    dig(10, 30, 30, 30); // 東へ（袋小路？）
    dig(10, 20, 5, 20);  // ゴールへの道

    // スイッチ部屋への道 (10, 30) から分岐
    dig(10, 30, 10, 35);
    dig(10, 35, 35, 35); // 南端を東へ
    dig(35, 35, 35, 25); // 北上してスイッチ部屋へ

    // スイッチ配置
    w1t[25][35] = T.SWITCH;

    // ゴール地点
    w1t[20][1] = T.STAIRS; // Stage 2へ

    Maps.data.west_stage1 = {
        w: 41, h: 41, tiles: w1t, isDungeon: true, encounterRate: 0.04, area: 'west', week1Map: true,
        bgm: 'dungeon',
        npcs: [
            { id: 'w1_sign', type: 'signpost', x: 35, y: 20, msg: '【西の塔 1階】\n仕掛けを解き、先へ進め', blocking: true }
        ],
        warps: [
            { x: 40, y: 20, to: 'village', tx: 1, ty: 12 },
            { x: 1, y: 20, to: 'west_stage2', tx: 39, y: 20, requiresSwitch: 'stage1' } // スイッチ制限
        ],
        start: { x: 39, y: 20 }
    };

    // ----------------------------------------------------------------
    // ステージ2 (41x41) - 2つ目のスイッチ
    // ----------------------------------------------------------------
    const w2t = createDungeonTiles(41, 41, T);

    // スタート: 東 (39, 20)
    // ゴール: 西 (1, 20)
    // スイッチ: 北西の奥 (5, 5)

    // ルート作成
    dig(30, 20, 39, 20); // 入口
    dig(30, 20, 30, 10); // 北へ
    dig(30, 10, 10, 10); // 西へ大きく移動
    dig(10, 10, 10, 30); // 南へ
    dig(10, 30, 30, 30); // 東へ（ダミー）

    // スイッチへのルート (10, 10) から分岐
    dig(10, 10, 5, 10);
    dig(5, 10, 5, 5); // 北西の角へ

    // ゴールへのルート (10, 20) 付近から
    dig(10, 20, 1, 20);

    // スイッチ配置
    w2t[5][5] = T.SWITCH;

    // ゴール地点
    w2t[20][1] = T.STAIRS;

    Maps.data.west_stage2 = {
        w: 41, h: 41, tiles: w2t, isDungeon: true, encounterRate: 0.05, area: 'west', week1Map: true,
        bgm: 'dungeon',
        npcs: [],
        warps: [
            { x: 40, y: 20, to: 'west_stage1', tx: 2, ty: 20 },
            { x: 1, y: 20, to: 'west_boss_room', tx: 13, y: 7, requiresSwitch: 'stage2' } // スイッチ制限
        ],
        start: { x: 39, y: 20 }
    };


    // ----------------------------------------------------------------
    // ボス部屋 (15x15)
    // ----------------------------------------------------------------
    const wbt = createDungeonTiles(15, 15, T);

    // 一本道
    for (let x = 2; x <= 13; x++) wbt[7][x] = T.STONE;
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
