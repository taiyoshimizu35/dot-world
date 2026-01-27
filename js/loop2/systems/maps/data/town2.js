// ===========================================
// 第2の町マップデータ（Loop 2）
// ===========================================
function initTown2Week2(Maps, T) {
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

    // 木々
    for (let x = 0; x < vw; x += 2) if (x !== 12) vt[2][x] = T.TREE;

    Maps.data.town2 = {
        w: vw, h: vh, tiles: vt, encounterRate: 0.0,
        npcs: [
            { id: 't2_npc1', type: 'villager', x: 15, y: 10, msg: 'ここは第2の町。\nさらに北には第3の町があるらしい。', blocking: true }
        ],
        warps: [
            // North -> Town 3
            { x: 12, y: 0, to: 'town3', tx: 12, ty: 16 },
            // South -> Town 1
            { x: 12, y: 17, to: 'town1', tx: 12, ty: 1 }
        ],
        start: { x: 12, y: 9 }
    };
}
