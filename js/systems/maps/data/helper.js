// 共通定数
export const S = 15;  // マップサイズ (Size)
export const M = 7;   // 中心座標 (Middle)

/**
 * 外枠を岩(ROCK)、中を指定タイルで埋めた15x15のベースを作成
 */
export function createBaseTiles(T, fillType) {
    const tiles = [];
    for (let y = 0; y < S; y++) {
        const row = [];
        for (let x = 0; x < S; x++) {
            row.push(x === 0 || x === S - 1 || y === 0 || y === S - 1 ? T.ROCK : fillType);
        }
        tiles.push(row);
    }
    return tiles;
}

/**
 * ダンジョン用(FLOOR)ベース
 */
export const createDungeon = (T) => createBaseTiles(T, T.FLOOR);

/**
 * フィールド用(GRASS)ベース
 */
export const createField = (T) => createBaseTiles(T, T.GRASS);