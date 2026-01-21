// ===========================================
// ゲーム設定・定数
// ===========================================
const GameConfig = {
    TILE_SIZE: 16,
    VIEWPORT_WIDTH: 400,
    VIEWPORT_HEIGHT: 400,
    SCALE: 2,
    PLAYER_SPEED: 2,
    ENCOUNTER_RATE: 0.015,

    TILE_TYPES: {
        GRASS: 0, ROCK: 1, PATH: 2, WATER: 3, HOUSE: 4,
        DOOR: 5, FLOOR: 6, DESK: 7, BED: 8, EXIT: 9, COUNTER: 10
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
    CUTSCENE: 'cutscene'  // ステータス吸収イベント用
};

let currentState = GameState.TITLE;
