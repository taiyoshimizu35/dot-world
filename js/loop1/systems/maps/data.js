// ===========================================
// マップデータローダー
// ===========================================
function initMapData(Maps) {
    const T = GameConfig.TILE_TYPES;

    // 各エリアを初期化
    initVillageMap(Maps, T);
    initShopMaps(Maps, T);

    // 1週目マップ
    initEastWeek1(Maps, T);
    initWestWeek1(Maps, T);
    initNorthWeek1(Maps, T);
    initSouthWeek1(Maps, T);

    // 2週目マップ
    // 2週目は loop2/systems/maps/loader.js で読み込む

    // 魔王城
    initDemonCastleMaps(Maps, T);
}
