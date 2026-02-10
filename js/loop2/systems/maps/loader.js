// ===========================================
// マップデータローダー（Loop 2）
// ===========================================
function initMapData2(Maps) {
    const T = GameConfig.TILE_TYPES;

    // 2週目マップデータの読み込み
    // 2週目マップデータの読み込み（現代）
    initVillageModern(Maps, T);
    initStartModern(Maps, T);
    initTown1Modern(Maps, T);
    initTown2Modern(Maps, T);
    initTown3Modern(Maps, T);
    initEastModern(Maps, T);
    initWestModern(Maps, T);
    initNorthModern(Maps, T);
    initSouthModern(Maps, T);
    initDemonCastleModern(Maps, T);

    // 2週目：中世（Medieval） - 今後の実装
    // initMedievalMaps(Maps, T);

    // 2週目：古代（Ancient） - 今後の実装
    // initAncientMaps(Maps, T);

    // ショップマップなどは共通（Loop 1の定義を使用）
    // 必要なら initShopMapsWeek2 などを作るが、現状は共通で問題ない
}

// MapsマネージャーにWeek 2初期化機能を追加
if (window.Maps) {
    // Other modern maps (Deleted for reset)
    // Only start.js remains
    // }, // This line seems to be a typo in the instruction, it should be part of the Maps object definition.
    // The instruction implies replacing the entire `if (window.Maps)` block content.

    window.Maps.initWeek2 = function () {
        console.log('Loader: initWeek2');
        this.reset();

        // Load only the start map
        if (window.Maps && window.Maps.data && window.Maps.data.start) {
            // Already loaded by start.js script execution
        }

        // Set initial map
        window.Maps.current = 'start';
    };
}
