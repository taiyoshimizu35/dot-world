// ===========================================
// 2週目敵データ
// ===========================================
const EnemyData2 = {
    // 通常敵（2週目は強化版）
    slime: { name: 'スライム', hp: 25, atk: 8, def: 4, exp: 15, gold: 10 },
    goblin: { name: 'ゴブリン', hp: 35, atk: 12, def: 5, exp: 25, gold: 18 },
    bat: { name: 'コウモリ', hp: 20, atk: 10, def: 3, exp: 18, gold: 12 },

    // 中級敵
    orc: { name: 'オーク', hp: 60, atk: 18, def: 8, exp: 40, gold: 35 },
    wolf: { name: 'ウルフ', hp: 45, atk: 20, def: 6, exp: 35, gold: 28 },
    skeleton: { name: 'スケルトン', hp: 55, atk: 16, def: 10, exp: 38, gold: 30 },

    // 上級敵
    demon: { name: 'デーモン', hp: 100, atk: 28, def: 15, exp: 80, gold: 60 },
    dragon_whelp: { name: 'ドラゴンの子', hp: 120, atk: 32, def: 12, exp: 100, gold: 80 },

    // 真ボス
    true_east_boss: { name: '真・古代竜王', hp: 500, atk: 45, def: 20, exp: 300, gold: 500, isBoss: true },
    true_west_boss: { name: '真・大魔導師', hp: 400, atk: 55, def: 15, exp: 280, gold: 480, isBoss: true },
    true_north_boss: { name: '真・氷晶巨神', hp: 600, atk: 40, def: 25, exp: 320, gold: 520, isBoss: true },
    true_south_boss: { name: '真・冥界騎士', hp: 450, atk: 50, def: 18, exp: 290, gold: 490, isBoss: true },

    // 真魔王
    true_demon_king: { name: '真の魔王', hp: 1000, atk: 80, def: 30, exp: 1000, gold: 2000, isBoss: true }
};

// 2週目マップごとの敵リスト
function getEnemiesForMap2(mapData, mapId) {
    if (mapData.area === 'east') return ['goblin', 'orc', 'dragon_whelp'];
    if (mapData.area === 'west') return ['skeleton', 'demon'];
    if (mapData.area === 'north') return ['wolf', 'orc'];
    if (mapData.area === 'south') return ['skeleton', 'demon'];
    return ['slime', 'goblin', 'bat'];
}
