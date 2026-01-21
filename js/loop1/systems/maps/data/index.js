import { initVillage } from './village.js';
import { initEastArea } from './east.js';
import { initWestArea } from './west.js';
import { initNorthArea } from './north.js';
import { initSouthArea } from './south.js';
import { initDemonCastle } from './demon.js';

export function initMapData(Maps) {
    const T = GameConfig.TILE_TYPES;
    
    // 各エリアを初期化
    initVillage(Maps, T);
    initEastArea(Maps, T);
    initWestArea(Maps, T);
    initNorthArea(Maps, T);
    initSouthArea(Maps, T);
    initDemonCastle(Maps, T);
}