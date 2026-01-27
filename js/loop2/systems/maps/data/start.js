// ===========================================
// スタート地点マップデータ（Loop 2）
// ===========================================
function initStartWeek2(Maps, T) {
    console.log("initStartWeek2 called", Maps);
    const { S, M, createFieldTiles } = MapHelper;
    const vw = 25, vh = 18;

    // 基本タイル
    const vt = [];
    for (let y = 0; y < vh; y++) {
        const r = [];
        for (let x = 0; x < vw; x++) r.push(T.GRASS);
        vt.push(r);
    }

    // 道（北、左、右）
    // 垂直
    for (let y = 0; y < vh - 2; y++) vt[y][12] = T.PATH; // North to Center
    // 水平
    for (let x = 0; x < vw; x++) vt[9][x] = T.PATH;

    // 岩（南を塞ぐ、または装飾）
    for (let x = 0; x < vw; x++) {
        if (x !== 12) vt[vh - 1][x] = T.ROCK;
    }

    Maps.data.start = {
        w: vw, h: vh, tiles: vt, encounterRate: 0.1,
        npcs: [
            { id: 'sign_start', type: 'signpost', x: 10, y: 7, msg: '旅立ちの地\n北: 最初の町', blocking: true }
        ],
        warps: [
            // North -> Town 1
            { x: 12, y: 0, to: 'town1', tx: 12, ty: 16 },
            // West -> Dummy (Wrap or Block?) - For now, let's just leave them open but no warp implies loop or stop? 
            // Loop 1 maps usually warp to neighbor. User said "Left, Right". 
            // Providing warps to nowhere or self for now if not specified? 
            // Prompt says "start.js is Left+Right+Up".
            // I will assume they are just paths leading off screen, maybe to West/East maps if I were to create them. 
            // For now, I won't put warps on Left/Right unless requested, or maybe to 'west_stage1'/'east_stage1' just in case?
            // "town connects to 4 directions".
            // I'll stick to just the required connections.
        ],
        start: { x: 12, y: 9 }
    };
}
