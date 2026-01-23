// ===========================================
// 敵データ
// ===========================================
const EnemyData = {
    // ===== 村エリア =====
    slime: { name: 'グリーンスライム', hp: 12, atk: 4, def: 2, exp: 10, gold: 5, img: 'enemy_slime' },
    goblin: { name: 'ゴブリン', hp: 1, atk: 6, def: 3, exp: 10000, gold: 10000, img: 'enemy_goblin' },
    bat: { name: 'ダークバット', hp: 10, atk: 5, def: 2, exp: 10, gold: 4, img: 'enemy_bat' },

    // ===== 東エリア =====
    poison_slime: { name: '毒スライム', hp: 20, atk: 8, def: 4, exp: 25, gold: 18, img: 'enemy_slime' },
    hobgoblin: { name: 'ホブゴブリン', hp: 40, atk: 14, def: 6, exp: 70, gold: 45, img: 'enemy_goblin' },
    devilbat: { name: 'デビルバット', hp: 30, atk: 12, def: 5, exp: 50, gold: 30, img: 'enemy_bat' },

    // ===== 西エリア =====
    skeleton: { name: 'スケルトン', hp: 125, atk: 22, def: 12, exp: 130, gold: 100, img: 'enemy_skeleton', usesMagic: true, weakness: 'wind' },
    imp: { name: 'インプ', hp: 100, atk: 23, def: 10, exp: 100, gold: 90, img: 'enemy_imp', usesMagic: true, weakness: 'water' },
    killerbee: { name: 'キラービー', hp: 95, atk: 24, def: 8, exp: 100, gold: 90, img: 'enemy_killerbee', usesMagic: true, weakness: 'fire' },

    // ===== 北エリア =====
    //1層目
    ice_dragon: { name: 'アイスドラゴン', hp: 1, atk: 30, def: 15, exp: 150, gold: 120, img: 'enemy_ice_dragon', useBreath: true, isBoss: true },
    //2層目
    ice_magician: { name: 'アイスマジシャン', hp: 1, atk: 28, def: 20, exp: 160, gold: 130, img: 'enemy_ice_magician', usesMagic: true, weakness: 'fire', isBoss: true },
    //3層目
    ice_knight: { name: 'アイスナイト', hp: 2, atk: 35, def: 10, exp: 200, gold: 150, img: 'enemy_ice_knight', usesMagic: true, isBoss: true },

    // ===== 南エリア（アンデッド） =====
    zombie: { name: 'ゾンビ', hp: 180, atk: 25, def: 5, exp: 140, gold: 80, img: 'enemy_zombie', weakness: 'fire' },
    skeleton_knight: { name: '骸骨騎士', hp: 220, atk: 32, def: 18, exp: 180, gold: 140, img: 'enemy_skeleton', weakness: 'fire' },
    ghost: { name: 'ゴースト', hp: 100, atk: 20, def: 99, exp: 120, gold: 100, img: 'enemy_ghost', usesMagic: true, weakness: 'fire' },

    // ===== 嘘ボス（FAKE）=====
    fake_east_boss: { name: '古代のドラゴン', hp: 10, atk: 30, def: 1, exp: 750, gold: 800, img: 'enemy_dragon', isBoss: true, usesMagic: true, useBreath: true, bossType: 'fake' },
    fake_west_boss: { name: '大魔術師', hp: 10, atk: 50, def: 3, exp: 1200, gold: 2000, img: 'enemy_mage', isBoss: true, usesMagic: true, weakness: 'water', bossType: 'fake' },
    fake_south_boss: { name: '幻影の騎士', hp: 10, atk: 48, def: 2, exp: 1300, gold: 2200, img: 'enemy_phantom_knight', isBoss: true, weakness: 'wind', bossType: 'fake' },
    fake_north_boss: { name: 'クリスタル・ゴーレム', hp: 10, atk: 55, def: 3, exp: 1500, gold: 2500, img: 'enemy_ice_golem', isBoss: true, usesMagic: true, useBreath: true, bossType: 'fake' },


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
function getEnemiesForMap(mapData, mapId) {
    if (gameLoop.week === 1) {
        if (mapData.area === 'east') return ['hobgoblin', 'devilbat'];
        if (mapData.area === 'west') return ['skeleton', 'imp'];
        if (mapData.area === 'north') return ['yeti', 'ice_wolf'];
        if (mapData.area === 'south') return ['skeleton_knight', 'ghost'];
        return ['goblin'];
    }

    // 2週目は通常のエリア別敵
    if (mapData.isDungeon) {
        if (mapData.area === 'west') return ['skeleton', 'imp', 'killerbee'];
        if (mapData.area === 'east') return ['hobgoblin', 'devilbat', 'poison_slime'];
    } else if (mapData.area === 'north' || mapData.isNorth) {
        return ['ice_wolf', 'snow_spirit', 'yeti'];
    } else if (mapData.area === 'south' || mapData.isSouth) {
        return ['zombie', 'skeleton_knight', 'ghost'];
    }
    return ['slime', 'goblin', 'bat'];
}

// エリアに対応するボスを取得
function getBossForArea(area, isFake) {
    const prefix = isFake ? 'fake' : 'true';
    const key = `${prefix}_${area}_boss`;
    return EnemyData[key] || null;
}

