import { GameConfig } from '../../../constants.js';
import { initVillageMap, initShopMaps } from './data/village.js';
import { initEastWeek1 } from './data/east.js';
import { initWestWeek1 } from './data/west.js';
import { initNorthWeek1 } from './data/north.js';
import { initSouthWeek1 } from './data/south.js';
import { initDemonCastleMaps } from './data/demon.js';

// ===========================================
// マップデータローダー
// ===========================================
export function initMapData(Maps) {
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
