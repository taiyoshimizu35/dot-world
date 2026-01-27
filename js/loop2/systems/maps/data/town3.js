// ===========================================
// 第3の町マップデータ（Loop 2）
// ===========================================
function initTown3Week2(Maps, T) {
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

    // 岩と木
    vt[5][5] = T.ROCK;
    vt[5][19] = T.TREE;

    Maps.data.town3 = {
        w: vw, h: vh, tiles: vt, encounterRate: 0.0,
        npcs: [
            { id: 't3_npc1', type: 'villager', x: 11, y: 8, msg: 'ここは第3の町。\n北に行くと「始まりの村」に着くよ。', blocking: true }
        ],
        warps: [
            // North -> Village
            { x: 12, y: 0, to: 'village', tx: 12, ty: 16 },
            // South -> Town 2
            { x: 12, y: 17, to: 'town2', tx: 12, ty: 1 }
        ],
        start: { x: 12, y: 9 }
    };
}
