export const EnemyData2 = {
    // 東エリア (East) - 自然・動物系
    'slime_lvl2': {
        id: 'slime_lvl2',
        name: 'グリーンスライム',
        hp: 40, maxHp: 40,
        atk: 10, def: 5,
        matk: 0, mdef: 2,
        agi: 4,
        exp: 5, gold: 2,
        drop: { item: 'potion', rate: 0.1 },
        ai: 'attack'
    },
    'wolf': {
        id: 'wolf',
        name: 'フォレストウルフ',
        hp: 60, maxHp: 60,
        atk: 15, def: 3,
        matk: 0, mdef: 2,
        agi: 10,
        exp: 8, gold: 5,
        ai: 'attack'
    },
    'goblin_fighter': {
        id: 'goblin_fighter',
        name: 'ゴブリン戦士',
        hp: 80, maxHp: 80,
        atk: 18, def: 8,
        matk: 0, mdef: 5,
        agi: 6,
        exp: 12, gold: 10,
        drop: { item: 'dagger', rate: 0.05 },
        ai: 'attack'
    },

    // 西エリア (West) - 砂漠・盗賊系
    'desert_scorpion': {
        id: 'desert_scorpion',
        name: 'サソリ',
        hp: 50, maxHp: 50,
        atk: 20, def: 15,
        matk: 0, mdef: 5,
        agi: 8,
        exp: 10, gold: 5,
        ai: 'poison_attack' // 要実装
    },
    'bandit': {
        id: 'bandit',
        name: '盗賊',
        hp: 90, maxHp: 90,
        atk: 22, def: 6,
        matk: 0, mdef: 5,
        agi: 12,
        exp: 15, gold: 25,
        drop: { item: 'potion', rate: 0.2 },
        ai: 'attack'
    },

    // 南エリア (South) - アンデッド・魔法系
    'ghost': {
        id: 'ghost',
        name: 'ゴースト',
        hp: 40, maxHp: 40,
        atk: 10, def: 20, // 物理に強い
        matk: 15, mdef: 99, // 魔法防御高い？逆かも
        agi: 9,
        exp: 12, gold: 4,
        ai: 'magic_fire'
    },
    'skeleton_soldier': {
        id: 'skeleton_soldier',
        name: '骸骨兵',
        hp: 100, maxHp: 100,
        atk: 25, def: 10,
        matk: 0, mdef: 5,
        agi: 5,
        exp: 18, gold: 8,
        drop: { item: 'iron_sword', rate: 0.05 },
        ai: 'attack'
    },

    // 北エリア (North) - 強敵
    'armored_knight': {
        id: 'armored_knight',
        name: '魔王軍重装兵',
        hp: 200, maxHp: 200,
        atk: 35, def: 30,
        matk: 0, mdef: 10,
        agi: 4,
        exp: 50, gold: 40,
        ai: 'attack'
    },

    // BOSSES
    'boss_east': {
        id: 'boss_east',
        name: 'キングスライム',
        hp: 1000, maxHp: 1000,
        atk: 20, def: 10,
        matk: 10, mdef: 10,
        agi: 5,
        exp: 500, gold: 200,
        ai: 'boss_slime'
    }
};

export function getEnemiesForMap2(map, mapId) {
    // マップオブジェクトまたはIDに応じて出現敵リストを返す
    // map.area が 'east', 'west', 'south', 'north' などを持っている想定
    const area = map ? map.area : null;

    if (area === 'east') {
        return ['slime_lvl2', 'slime_lvl2', 'wolf', 'goblin_fighter'];
    }
    if (area === 'west') {
        return ['desert_scorpion', 'bandit', 'bandit'];
    }
    if (area === 'south') {
        return ['ghost', 'skeleton_soldier', 'ghost'];
    }
    if (area === 'north') {
        return ['armored_knight', 'goblin_fighter'];
    }
    if (area === 'demon') {
        return ['armored_knight', 'skeleton_soldier'];
    }

    // デフォルト (テスト用)
    return ['slime_lvl2'];
}
