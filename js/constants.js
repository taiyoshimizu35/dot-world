// ===========================================
// ゲーム設定・定数
// ===========================================
const GameConfig = {
    TILE_SIZE: 16,
    VIEWPORT_WIDTH: 300,
    VIEWPORT_HEIGHT: 300,
    SCALE: 2,
    PLAYER_SPEED: 1.5,
    ENCOUNTER_RATE: 0.015,

    TILE_TYPES: {
        GRASS: 0, ROCK: 1, PATH: 2, WATER: 3, HOUSE: 4,
        DOOR: 5, FLOOR: 6, DESK: 7, BED: 8, EXIT: 9, COUNTER: 10,
        TREE: 11, STAIRS: 12, SWITCH: 13,
        STONE: 14, STATUE: 15
    }
};

// ===========================================
// ゲーム状態
// ===========================================
const GameState = {
    TITLE: 'title',
    PLAYING: 'playing',
    MENU: 'menu',
    DIALOG: 'dialog',
    FADE: 'fade',
    BATTLE: 'battle',
    GAMEOVER: 'gameover',
    SHOP: 'shop',
    ENDING: 'ending',
    CUTSCENE: 'cutscene',  // ステータス吸収イベント用
    OPENING: 'opening',    // オープニングムービー
    LOOP1_ENDING: 'loop1_ending'  // 1週目エンディングムービー
};

let currentState = GameState.TITLE;
