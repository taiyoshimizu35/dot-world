// ===========================================
// 敵データ
// ===========================================
const EnemyData = {
    // ===== 村エリア =====
    slime: { name: 'グリーンスライム', hp: 12, atk: 4, def: 2, exp: 10, gold: 5, img: 'enemy_slime' },
    goblin: { name: 'ゴブリン', hp: 1, atk: 6, def: 3, exp: 10000, gold: 12, img: 'enemy_goblin' },
    bat: { name: 'ダークバット', hp: 10, atk: 5, def: 2, exp: 10, gold: 4, img: 'enemy_bat' },

    // ===== 東エリア =====
    poison_slime: { name: '毒スライム', hp: 20, atk: 8, def: 4, exp: 25, gold: 18, img: 'enemy_slime' },
    hobgoblin: { name: 'ホブゴブリン', hp: 40, atk: 14, def: 6, exp: 70, gold: 45, img: 'enemy_goblin' },
    devilbat: { name: 'デビルバット', hp: 30, atk: 12, def: 5, exp: 50, gold: 30, img: 'enemy_bat' },

    // ===== 西エリア =====
    skeleton: { name: 'スケルトン', hp: 125, atk: 22, def: 12, exp: 130, gold: 100, img: 'enemy_skeleton', usesMagic: true, weakness: 'wind' },
    imp: { name: 'インプ', hp: 100, atk: 23, def: 10, exp: 100, gold: 90, img: 'enemy_imp', usesMagic: true, weakness: 'water' },
    killerbee: { name: 'キラービー', hp: 95, atk: 24, def: 8, exp: 100, gold: 90, img: 'enemy_killerbee', usesMagic: true, weakness: 'fire' },

    // ===== 北エリア（氷属性） =====
    ice_wolf: { name: 'アイスウルフ', hp: 150, atk: 30, def: 15, exp: 150, gold: 120, img: 'enemy_wolf', weakness: 'fire' },
    snow_spirit: { name: '雪の精霊', hp: 140, atk: 28, def: 20, exp: 160, gold: 130, img: 'enemy_spirit', usesMagic: true, weakness: 'fire' },
    yeti: { name: 'イエティ', hp: 200, atk: 35, def: 10, exp: 200, gold: 150, img: 'enemy_yeti', weakness: 'fire' },

    // ===== 南エリア（アンデッド） =====
    zombie: { name: 'ゾンビ', hp: 180, atk: 25, def: 5, exp: 140, gold: 80, img: 'enemy_zombie', weakness: 'fire' },
    skeleton_knight: { name: '骸骨騎士', hp: 220, atk: 32, def: 18, exp: 180, gold: 140, img: 'enemy_skeleton', weakness: 'fire' },
    ghost: { name: 'ゴースト', hp: 100, atk: 20, def: 99, exp: 120, gold: 100, img: 'enemy_ghost', usesMagic: true, weakness: 'fire' },

    // ===== 嘘ボス（FAKE）=====
    fake_east_boss: { name: '古代のドラゴン', hp: 10, atk: 30, def: 1, exp: 750, gold: 800, img: 'enemy_dragon', isBoss: true, usesMagic: true, bossType: 'fake' },
    fake_west_boss: { name: '大魔術師', hp: 10, atk: 50, def: 3, exp: 1200, gold: 2000, img: 'enemy_mage', isBoss: true, usesMagic: true, weakness: 'water', bossType: 'fake' },
    fake_north_boss: { name: 'クリスタル・ゴーレム', hp: 10, atk: 55, def: 3, exp: 1500, gold: 2500, img: 'enemy_golem', isBoss: true, weakness: 'fire', bossType: 'fake' },
    fake_south_boss: { name: '幻影の騎士', hp: 10, atk: 48, def: 2, exp: 1300, gold: 2200, img: 'enemy_knight', isBoss: true, weakness: 'fire', bossType: 'fake' },

    // ===== 真ボス（TRUE）=====
    true_east_boss: { name: '真・古代竜王', hp: 10, atk: 80, def: 4, exp: 5000, gold: 8000, img: 'enemy_dragon', isBoss: true, usesMagic: true, bossType: 'true' },
    true_west_boss: { name: '真・大魔導師', hp: 10, atk: 90, def: 4, exp: 6000, gold: 9000, img: 'enemy_mage', isBoss: true, usesMagic: true, weakness: 'water', bossType: 'true' },
    true_north_boss: { name: '真・氷晶巨神', hp: 10, atk: 100, def: 5, exp: 7000, gold: 10000, img: 'enemy_golem', isBoss: true, weakness: 'fire', bossType: 'true' },
    true_south_boss: { name: '真・冥界騎士', hp: 10, atk: 85, def: 3, exp: 5500, gold: 8500, img: 'enemy_knight', isBoss: true, usesMagic: true, weakness: 'fire', bossType: 'true' },

    // ===== 嘘魔王（1週目 - 無敵）=====
    // WEAPON_DECEPTION: 嘘魔王は1週目では絶対に倒せない
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

    // ===== 真魔王（2週目 - 吸収ステータスで強化）=====
    true_demon_king: { name: '真の魔王', hp: 10, atk: 200, def: 1, exp: 50000, gold: 100000, img: 'enemy_demon_king', isBoss: true, usesMagic: true, bossType: 'true_final' },

    // 旧ボス（互換性維持用）
    boss: { name: '古代のドラゴン', hp: 270, atk: 30, def: 18, exp: 750, gold: 800, img: 'enemy_dragon', isBoss: true, usesMagic: true },
    fire_greatMage: { name: '大魔術師', hp: 500, atk: 50, def: 30, exp: 1200, gold: 2000, img: 'enemy_mage', isBoss: true, usesMagic: true, weakness: 'water' },
    wind_greatMage: { name: '大魔術師', hp: 500, atk: 50, def: 30, exp: 1200, gold: 2000, img: 'enemy_mage', isBoss: true, usesMagic: true, weakness: 'fire' },
    water_greatMage: { name: '大魔術師', hp: 500, atk: 50, def: 30, exp: 1200, gold: 2000, img: 'enemy_mage', isBoss: true, usesMagic: true, weakness: 'wind' },
    crystal_golem: { name: 'クリスタル・ゴーレム', hp: 1000, atk: 80, def: 40, exp: 2000, gold: 3000, img: 'enemy_golem', isBoss: true, weakness: 'fire' },
    phantom_knight: { name: '幻影の騎士', hp: 800, atk: 48, def: 25, exp: 2500, gold: 3500, img: 'enemy_knight', isBoss: true, weakness: 'fire' }
};

// マップごとの敵リストを取得
function getEnemiesForMap(mapData, mapId) {
    // MAP_DECEPTION: 1週目は全エリアで高経験値モンスター
    if (gameLoop.week === 1) {
        // 1週目は経験値が多いモンスターばかり（プレイヤーを楽に強くする）
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

