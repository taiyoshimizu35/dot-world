// ===========================================
// 共通ユーティリティ
// ===========================================

export const Utils = {
    // 乱数生成（min〜maxの整数）
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // 配列からランダムに1つ選ぶ
    randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    // 値を範囲内に制限
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
};
