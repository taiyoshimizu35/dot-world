// ===========================================
// マップデータローダー（Loop 2）
// ===========================================
function initMapData2(Maps) {
    const T = GameConfig.TILE_TYPES;

    // 2週目マップデータの読み込み
    initVillageWeek2(Maps, T);
    initEastWeek2(Maps, T);
    initWestWeek2(Maps, T);
    initNorthWeek2(Maps, T);
    initSouthWeek2(Maps, T);
    initDemonCastleWeek2(Maps, T);

    // ショップマップなどは共通（Loop 1の定義を使用）
    // 必要なら initShopMapsWeek2 などを作るが、現状は共通で問題ない
}

// MapsマネージャーにWeek 2初期化機能を追加
if (window.Maps) {
    window.Maps.initWeek2 = function () {
        console.log("Initializing Week 2 Maps...");
        initMapData2(this);
    };
}
