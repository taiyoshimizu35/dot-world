import { WorldState } from '../world.js';

// ===========================================
// 敵データ
// ===========================================
export const Enemies = {
    // ===== 村エリア =====
    slime: { name: 'スライム', hp: 10, atk: 7, def: 4, exp: 10, gold: 10, img: 'enemy_slime' },
    goblin: { name: 'ゴブリン', hp: 1, atk: 9, def: 1, exp: 10000, gold: 20000, img: 'enemy_goblin' },
    bat: { name: 'ダークバット', hp: 12, atk: 8, def: 5, exp: 15, gold: 15, img: 'enemy_bat' },

    // ===== 東エリア =====
    poison_slime: { name: '毒スライム', hp: 18, atk: 9, def: 7, exp: 25, gold: 25, img: 'enemy_slime' },
    hobgoblin: { name: 'ホブゴブリン', hp: 23, atk: 13, def: 10, exp: 35, gold: 35, img: 'enemy_goblin' },
    devilbat: { name: 'デビルバット', hp: 20, atk: 11, def: 8, exp: 30, gold: 30, img: 'enemy_bat' },

    // ===== 西エリア =====
    skeleton: { name: 'スケルトン', hp: 40, atk: 23, def: 24, exp: 100, gold: 100, img: 'enemy_skeleton', usesMagic: true, weakness: 'wind' },
    imp: { name: 'インプ', hp: 35, atk: 23, def: 22, exp: 90, gold: 90, img: 'enemy_imp', usesMagic: true, weakness: 'water' },
    killerbee: { name: 'キラービー', hp: 30, atk: 24, def: 23, exp: 90, gold: 90, img: 'enemy_killerbee', weakness: 'fire' },

    // ===== 北エリア =====
    //1層目
    ice_dragon: { name: 'アイスドラゴン', hp: 1, atk: 45, def: 1, exp: 0, gold: 0, img: 'enemy_ice_dragon', useBreath: true, isBoss: true },
    //2層目
    ice_magician: { name: 'アイスマジシャン', hp: 1, atk: 45, def: 1, exp: 0, gold: 0, img: 'enemy_ice_magician', usesMagic: true, weakness: 'fire', isBoss: true },
    //3層目
    ice_knight: { name: 'アイスナイト', hp: 1, atk: 45, def: 1, exp: 0, gold: 0, img: 'enemy_ice_knight', usesMagic: true, isBoss: true },

    // ===== 南エリア（アンデッド） =====
    zombie: { name: 'ゾンビ', hp: 55, atk: 40, def: 35, exp: 200, gold: 200, img: 'enemy_zombie', usesMagic: true, weakness: 'fire' },
    skeleton_knight: { name: '骸骨騎士', hp: 60, atk: 45, def: 40, exp: 250, gold: 250, img: 'enemy_skeleton_knight', weakness: 'fire' },
    ghost: { name: 'ゴースト', hp: 50, atk: 40, def: 35, exp: 200, gold: 200, img: 'enemy_ghost', usesMagic: true, weakness: 'fire' },

    // ===== 特殊 ==== //
    exp_fairy: { name: '武運の妖精', hp: 1, atk: 1, def: 1, exp: 1000, gold: 0, img: 'enemy_exp_fairy', isRare: true },
    gold_fairy: { name: '金運の妖精', hp: 1, atk: 1, def: 1, exp: 0, gold: 1000, img: 'enemy_gold_fairy', isRare: true },

    // ===== ボス =====
    fake_east_boss: { name: '古代のドラゴン', hp: 1, atk: 25, def: 1, exp: 1000, gold: 2000, img: 'enemy_dragon', isBoss: true, useBreath: true, weakness: 'water', bossType: 'fake' },
    fake_west_boss: { name: '大魔術師', hp: 1, atk: 30, def: 1, exp: 2000, gold: 5000, img: 'enemy_mage', isBoss: true, usesMagic: true, weakness: 'fire', bossType: 'fake' },
    fake_south_boss: { name: '幻影の騎士', hp: 1, atk: 52, def: 1, exp: 5000, gold: 10000, img: 'enemy_phantom_knight', isBoss: true, weakness: 'wind', bossType: 'fake' },
    fake_north_boss: { name: 'クリスタル・ゴーレム', hp: 1, atk: 62, def: 1, exp: 10000, gold: 20000, img: 'enemy_ice_golem', isBoss: true, usesMagic: true, useBreath: true, bossType: 'fake' },


    fake_demon_king: {
        name: '嘘の魔王',
        hp: 99999,
        atk: 999,
        def: 999,
        exp: 0,
        gold: 0,
        img: 'enemy_demon_king',
        isBoss: true,
        usesMagic: true,
        bossType: 'fake_final',
        isInvincible: true  // 無敵フラグ
    },
};

// マップごとの敵リストを取得
export function getEnemiesForMap(mapData, mapId) {
    let enemies = [];

    // 1/20 Chance (5%) to encounter a Fairy
    if (Math.random() < 0.05) {
        return Math.random() < 0.5 ? ['exp_fairy'] : ['gold_fairy'];
    }

    if (WorldState.week === 1) { // window.gameLoop might be WorldState.week?
        // WorldState should be used but checking if gameLoop is global or need replacement?
        // WorldState is loop1/world.js. I should use WorldState.week if exported.
        // But this file `enemies.js` is data file. It shouldn't depend on WorldState ideally?
        // Or it should accept week as argument?
        // `getEnemiesForMap` calls `gameLoop.week`.
        // I should probably pass `week` or import `WorldState`.
        // Importing `WorldState` -> circular dependency not likely for data file?
        // `world.js` imports `Shop`, `Inn`, `Menu`. Data files are safe.
        // BUT `getEnemiesForMap` is called by `Battle.start`. `Battle` has access to `WorldState`.
        // I will import `WorldState` here or use `WorldState` if I can.
        // Wait, `enemies.js` is in `loop1/data/`. `world.js` is in `loop1/`.
        // Import: `import { WorldState } from '../world.js';`
        // But `world.js` might import `enemies.js`? No.
        // Let's import `WorldState` in `enemies.js` just to be safe or change logic to use parameter.
        // Changing signature might break other calls? Only `Battle.start` calls it.
        // I'll stick to `gameLoop` check replacement with `WorldState` if imported.
        // Actually, `gameLoop` is the global object from `main.js`.
        // I'll leave `gameLoop` reference for now but maybe I should import `WorldState`.
        // Let's import `WorldState`.

        if (mapData.area === 'east') enemies = ['hobgoblin', 'devilbat', 'poison_slime'];
        else if (mapData.area === 'west') enemies = ['skeleton', 'imp', 'killerbee'];
        else if (mapData.area === 'south') enemies = ['skeleton_knight', 'ghost', 'zombie'];
        else enemies = ['goblin', 'slime', 'bat'];
    } else {
        // 2週目は通常のエリア別敵
        if (mapData.isDungeon) {
            if (mapData.area === 'west') enemies = ['skeleton', 'imp', 'killerbee'];
            else if (mapData.area === 'east') enemies = ['hobgoblin', 'devilbat', 'poison_slime'];
            else enemies = ['goblin', 'bat', 'slime'];
        } else if (mapData.area === 'north' || mapData.isNorth) {
            enemies = ['ice_wolf', 'snow_spirit', 'yeti'];
        } else if (mapData.area === 'south' || mapData.isSouth) {
            enemies = ['zombie', 'skeleton_knight', 'ghost'];
        } else {
            enemies = ['slime', 'goblin', 'bat'];
        }
    }
    return enemies;
}

// エリアに対応するボスを取得
export function getBossForArea(area, isFake) {
    const prefix = isFake ? 'fake' : 'true';
    const key = `${prefix}_${area}_boss`;
    return Enemies[key] || null;
}

