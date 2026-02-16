// ===========================================
// グローバル定数・設定
// ===========================================

export const GameConfig = {
    // 画面サイズ（レトロゲーム風の低解像度）
    VIEWPORT_WIDTH: 320,
    VIEWPORT_HEIGHT: 240,
    SCALE: 3,

    // タイルサイズ
    TILE_SIZE: 16,

    // Debug Mode
    DEBUG_MODE: false,

    // Player Speed
    PLAYER_SPEED: 2,

    // タイルタイプ (Based on MapRenderer)
    TILE_TYPES: {
        GRASS: 0,
        ROCK: 1,
        PATH: 2,
        WATER: 3,
        HOUSE_STONE: 4,
        DOOR: 5,
        FLOOR: 6,
        DESK: 7,
        BED: 8,
        CHEST_BG: 9, // map_renderer treats 9 same as path or similar? 9->path in renderer
        COUNTER: 10,
        TREE: 11,
        STAIRS: 12,
        SWITCH: 13,
        STONE: 14,
        STATUE: 15,
        GRAY_GRASS: 16,
        GRAY_DOOR: 17,
        HOUSE_WOOD: 18,
        DOOR_LEFT: 19,
        DOOR_RIGHT: 20,
        MAGIC_SHOP_SIGN_LEFT: 21,
        MAGIC_SHOP_SIGN_RIGHT: 22,
        WEAPON_SHOP_SIGN_LEFT: 23,
        WEAPON_SHOP_SIGN_RIGHT: 24,
        INN_SIGN_LEFT: 25,
        INN_SIGN_RIGHT: 26,
        PULPIT: 27,
        WEAPON_SHOP: 28,
        MAGIC_SHOP: 29,
        INN: 30,
        ADVANCED_SHOP: 31,
    },
    // Tiles that should be drawn over a base tile (e.g. grass/floor)
    OVERLAY_TILES: new Set([
        1,  // ROCK
        4,  // HOUSE_STONE
        5,  // DOOR
        7,  // DESK
        8,  // BED
        10, // COUNTER
        11, // TREE
        12, // STAIRS
        13, // SWITCH
        15, // STATUE
        17, // GRAY_DOOR
        18, // HOUSE_WOOD
        19, // DOOR_LEFT
        20, // DOOR_RIGHT
        21, // MAGIC_SHOP_SIGN_LEFT
        22, // MAGIC_SHOP_SIGN_RIGHT
        23, // WEAPON_SHOP_SIGN_LEFT
        24, // WEAPON_SHOP_SIGN_RIGHT
        25, // INN_SIGN_LEFT
        26,  // INN_SIGN_RIGHT
        27,
        28,
        29,
        30,
        31
    ])
};

export const GameState = {
    TITLE: 0,
    PLAYING: 1,
    MENU: 2,
    DIALOG: 3,
    BATTLE: 4,
    SHOP: 5,
    INN: 6,
    GAMEOVER: 7,
    OPENING: 8,
    ENDING: 9,
    LOOP1_ENDING: 10
};

// Legacy Global State for compatibility
window.GameState = GameState;
window.GameConfig = GameConfig;
window.currentState = GameState.TITLE;
