// ===========================================
// 南エリアマップデータ
// ===========================================

// 1週目：視界制限・鍵探しダンジョン
function initSouthWeek1(Maps, T) {
    const { createDungeonTiles } = MapHelper;

    const fillSouthMaze = (tiles, w, h) => {
        // 全体をSTONE(床)で埋める
        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                tiles[y][x] = T.GRAY_GRASS;
            }
        }
        // ランダム障害物(TREE)
        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                if (Math.random() < 0.25) tiles[y][x] = T.TREE; // Dense forest
                else if (Math.random() < 0.05) tiles[y][x] = T.ROCK;
            }
        }
    };

    const carvePath = (tiles, points) => {
        let cx = points[0][0];
        let cy = points[0][1];
        for (let i = 1; i < points.length; i++) {
            const tx = points[i][0];
            const ty = points[i][1];
            while (cx !== tx || cy !== ty) {
                tiles[cy][cx] = T.PATH; // 明示的に道として設定
                if (cx < tx) cx++; else if (cx > tx) cx--;
                else if (cy < ty) cy++; else if (cy > ty) cy--;
            }
        }
        tiles[cy][cx] = T.PATH;
    };

    // ----------------------------------------------------------------
    // ステージ1 (41x41)
    // ----------------------------------------------------------------
    const s1t = createDungeonTiles(41, 41, T);
    fillSouthMaze(s1t, 41, 41);

    // Path
    // Start(20, 2) -> End(20, 39)
    const path1 = [[20, 2], [5, 10], [35, 20], [20, 39]]; // Zigzag
    carvePath(s1t, path1);

    // Chest Path (Silver Key)
    // Branch from [35, 20] -> [35, 35]
    for (let y = 21; y <= 35; y++) s1t[y][35] = T.GRAY_GRASS;

    s1t[1][20] = T.EXIT;
    s1t[39][20] = T.GRAY_DOOR; // Locked Door (通常のドア)

    Maps.data.south_stage1 = {
        w: 41, h: 41, tiles: s1t, encounterRate: 0.0, area: 'south', week1Map: true,
        bgm: 'dungeon',
        npcs: [
            { id: 's1_sign', type: 'signpost', x: 23, y: 5, msg: '【忘却の墓地】\n闇に潜む鍵を探せ', blocking: true }
        ],
        warps: [
            { x: 20, y: 1, to: 'village', tx: 12, ty: 16 },
            { x: 20, y: 39, to: 'south_stage2', tx: 20, ty: 2, requiresKey: '銀の鍵', consumeKey: true, doorId: 'south_door1' }
        ],
        start: { x: 20, y: 2 }
    };

    // Chest Definition (Needs to be added to Chests.list via some init mechanism or hardcoded in Chests.js? 
    // Existing Chests.js has hardcoded list. I need to update Chests.js OR allow Maps to define chests.
    // Looking at Chests.js, it uses hardcoded list. I MUST update Chests.js.
    // For now, I define the map structure. I will add chests in Chests.js in next step.)

    // ----------------------------------------------------------------
    // ステージ2 (41x41)
    // ----------------------------------------------------------------
    const s2t = createDungeonTiles(41, 41, T);
    fillSouthMaze(s2t, 41, 41);

    // Path
    // Start(20, 2) -> End(20, 39)
    const path2 = [[20, 2], [35, 10], [5, 25], [20, 39]];
    carvePath(s2t, path2);

    // Chest Path (Silver Key)
    // Branch from [5, 25] -> [5, 35]
    for (let y = 26; y <= 35; y++) s2t[y][5] = T.GRAY_GRASS;

    s2t[1][20] = T.STAIRS; // 戻り階段
    s2t[39][20] = T.GRAY_DOOR; // To Boss (Locked)

    Maps.data.south_stage2 = {
        w: 41, h: 41, tiles: s2t, encounterRate: 0.0, area: 'south', week1Map: true,
        bgm: 'dungeon',
        npcs: [],
        warps: [
            { x: 20, y: 1, to: 'south_stage1', tx: 20, ty: 38 },
            { x: 20, y: 39, to: 'south_boss_room', tx: 7, ty: 2, requiresKey: '銀の鍵', consumeKey: true, doorId: 'south_door2' }
        ],
        start: { x: 20, y: 2 }
    };

    // ----------------------------------------------------------------
    // ボス部屋 (15x15)
    // ----------------------------------------------------------------
    const sbt = createDungeonTiles(15, 15, T);
    for (let y = 1; y < 14; y++) for (let x = 1; x < 14; x++) sbt[y][x] = T.GRAY_GRASS;

    // Path
    for (let y = 2; y <= 12; y++) sbt[y][7] = T.PATH;
    sbt[1][7] = T.STAIRS;

    Maps.data.south_boss_room = {
        w: 15, h: 15, tiles: sbt, encounterRate: 0.008, area: 'south', week1Map: true,
        bgm: 'boss',
        npcs: [
            { id: 'southBoss', type: 'enemy_skeleton', img: 'phantom_knight_map', x: 7, y: 10, msg: null, areaBoss: 'south', blocking: true, name: '幻影の騎士', atk: 22, def: 8, hp: 100, exp: 60 }
        ],
        warps: [{ x: 7, y: 1, to: 'south_stage2', tx: 20, ty: 38 }],
        start: { x: 7, y: 2 }
    };
}

// 2週目は loop2/systems/maps/data/south.js に移動