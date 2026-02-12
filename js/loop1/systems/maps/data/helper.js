// ===========================================
// マップヘルパー関数
// ===========================================
export const MapHelper = {
    // 標準サイズ
    S: 15,  // 縦
    M: 7,   // 中心Y

    // ダンジョンタイル生成
    createDungeonTiles(w, h, T) {
        const tiles = [];
        for (let y = 0; y < h; y++) {
            const row = [];
            for (let x = 0; x < w; x++) {
                row.push(y === 0 || y === h - 1 || x === 0 || x === w - 1 ? T.ROCK : T.FLOOR);
            }
            tiles.push(row);
        }
        return tiles;
    },

    // 草原タイル生成
    createFieldTiles(w, h, T) {
        const tiles = [];
        for (let y = 0; y < h; y++) {
            const row = [];
            for (let x = 0; x < w; x++) {
                row.push(x === 0 || x === w - 1 || y === 0 || y === h - 1 ? T.ROCK : T.GRASS);
            }
            tiles.push(row);
        }
        return tiles;
    }
};