// ===========================================
// 第1の町マップデータ（Loop 2）
// ===========================================
function initTown1Week2(Maps, T) {
    const { S, M, createFieldTiles } = MapHelper;
    const vw = 25, vh = 18;

    // 基本タイル
    const vt = [];
    for (let y = 0; y < vh; y++) {
        const r = [];
        for (let x = 0; x < vw; x++) r.push(T.GRASS);
        vt.push(r);
    }

    // 道（十字）
    for (let y = 0; y < vh; y++) vt[y][12] = T.PATH;
    for (let x = 0; x < vw; x++) vt[9][x] = T.PATH;

    // 家
    for (let y = 3; y <= 6; y++) for (let x = 3; x <= 7; x++) vt[y][x] = T.HOUSE;
    vt[6][5] = T.DOOR;

    Maps.data.town1 = {
        w: vw, h: vh, tiles: vt, encounterRate: 0.0,
        npcs: [
            { id: 't1_npc1', type: 'villager', x: 8, y: 10, msg: 'ここは第1の町。\n北に行くと第2の町だよ。', blocking: true }
        ],
        warps: [
            // North -> Town 2
            { x: 12, y: 0, to: 'town2', tx: 12, ty: 17 },
            // South -> Start
            { x: 12, y: 17, to: 'start', tx: 12, ty: 1 }
        ],
        start: { x: 12, y: 9 }
    };
}
