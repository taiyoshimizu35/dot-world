// ===========================================
// スタート地点マップデータ（Loop 2 minimal）
// ===========================================
function initStartModern(Maps, T) {
    console.log("initStartModern (Minimal) called");

    // Ensure MapHelper is available
    const Helper = window.MapHelper || MapHelper;
    if (!Helper) return;

    const vw = 10, vh = 10;
    const vt = [];
    for (let y = 0; y < vh; y++) {
        const r = [];
        for (let x = 0; x < vw; x++) r.push(T.GRASS);
        vt.push(r);
    }

    Maps.data.start = {
        w: vw, h: vh, tiles: vt, encounterRate: 0.0,
        npcs: [
            { id: 'sign_start', type: 'signpost', x: 5, y: 4, msg: 'Loop 2\nここから作り始めよう！', blocking: true },
            { id: 'save_point', type: 'signpost', x: 7, y: 4, msg: null, blocking: true, savePoint: true }
        ],
        warps: [],
        start: { x: 5, y: 6 }
    };
}
