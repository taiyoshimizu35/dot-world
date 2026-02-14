// ===========================================
// アセットローダー
// ===========================================
export const AssetLoader = {
    images: {},

    async loadImage(n, s) {
        return new Promise(r => {
            const img = new Image();
            img.onload = () => { this.images[n] = img; r(img); };
            img.onerror = () => { console.warn(`Failed: ${s}`); r(null); };
            img.src = s;
        });
    },

    async loadAll() {
        const assets = [
            // キャラクター
            ['player', 'assets/characters/player.png'],
            ['player_down_1', 'assets/characters/player_down_1.png'],
            ['player_down_2', 'assets/characters/player_down_2.png'],
            ['player_down_stop', 'assets/characters/player_down_stop.png'],
            ['player_left_1', 'assets/characters/player_left_1.png'],
            ['player_left_2', 'assets/characters/player_left_2.png'],
            ['player_left_stop', 'assets/characters/player_left_stop.png'],
            ['player_right_1', 'assets/characters/player_right_1.png'],
            ['player_right_2', 'assets/characters/player_right_2.png'],
            ['player_right_stop', 'assets/characters/player_right_stop.png'],
            ['player_up_1', 'assets/characters/player_up_1.png'],
            ['player_up_2', 'assets/characters/player_up_2.png'],
            ['player_up_stop', 'assets/characters/player_up_stop.png'],
            ['villager', 'assets/characters/villager.png'],
            ['guard', 'assets/characters/guard.png'],
            // タイル
            ['grass', 'assets/tiles/grass.png'],
            ['path', 'assets/tiles/path.png'],
            ['water', 'assets/tiles/water.png'],
            ['floor', 'assets/tiles/floor.png'],
            ['stone', 'assets/tiles/stone.png'],
            ['gray_grass', 'assets/tiles/gray_glass.png'],
            // オブジェクト
            ['house_stone', 'assets/objects/house_stone.png'],
            ['house_wood', 'assets/objects/house_wood.png'],
            ['signpost', 'assets/objects/signpost.png'],
            ['tree', 'assets/objects/tree.png'],
            ['rock', 'assets/objects/rock.png'],
            ['desk', 'assets/objects/desk.png'],
            ['bed', 'assets/objects/bed.png'],
            ['door', 'assets/objects/door.png'],
            ['door_left', 'assets/objects/door_left.png'],
            ['door_right', 'assets/objects/door_right.png'],
            ['magic_shop_sign_left', 'assets/objects/magic_shop_sign_left.png'],
            ['magic_shop_sign_right', 'assets/objects/magic_shop_sign_right.png'],
            ['weapon_shop_sign_left', 'assets/objects/weapon_shop_sign_left.png'],
            ['weapon_shop_sign_right', 'assets/objects/weapon_shop_sign_right.png'],
            ['inn_sign_left', 'assets/objects/inn_sign_left.png'],
            ['inn_sign_right', 'assets/objects/inn_sing_right.png'],
            ['gray_door', 'assets/objects/gray_door.png'],
            ['chest_closed', 'assets/objects/chest_closed.png'],
            ['chest_open', 'assets/objects/chest_open.png'],
            ['counter', 'assets/objects/counter.png'],
            ['shop_sign', 'assets/objects/shop_sign.png'],
            ['stairs', 'assets/objects/stairs.png'],
            ['stone_switch', 'assets/objects/stone_switch.png'],
            ['stone_switch', 'assets/objects/stone_switch.png'],
            ['statue', 'assets/objects/statue.png'],
            ['goddes', 'assets/objects/goddes.png'],
            // 敵キャラクター
            ['enemy_slime', 'assets/enemies/enemy_slime.png'],
            ['enemy_goblin', 'assets/enemies/enemy_goblin.png'],
            ['enemy_bat', 'assets/enemies/enemy_bat.png'],
            ['enemy_dragon', 'assets/enemies/enemy_dragon.png'],
            ['enemy_mage', 'assets/enemies/enemy_mage.png'],
            ['enemy_skeleton', 'assets/enemies/enemy_skeleton.png'],
            ['enemy_imp', 'assets/enemies/enemy_imp.png'],
            ['enemy_killerbee', 'assets/enemies/enemy_killerbee.png'],
            ['enemy_ice_golem', 'assets/enemies/enemy_ice_golem.png'],
            ['enemy_phantom_knight', 'assets/enemies/enemy_phantom_knight.png'],
            ['enemy_ice_dragon', 'assets/enemies/enemy_ice_dragon.png'],
            ['enemy_ice_magician', 'assets/enemies/enemy_ice_magician.png'],
            ['enemy_ice_knight', 'assets/enemies/enemy_ice_knight.png'],
            ['enemy_demon_king', 'assets/enemies/enemy_demon_king.png'],
            // South Area Enemies
            ['enemy_ghost', 'assets/enemies/enemy_ghost.png'],
            ['enemy_zombie', 'assets/enemies/enemy_zombie.png'],
            ['enemy_skeleton_knight', 'assets/enemies/enemy_skeleton_knight.png'],
            ['enemy_exp_fairy', 'assets/enemies/enemy_exp_fairy.png'],
            ['enemy_gold_fairy', 'assets/enemies/enemy_gold_fairy.png'],
            // ボスマップスプライト
            ['ice_golem_map', 'assets/enemies/enemy_ice_golem.png'],
            ['phantom_knight_map', 'assets/enemies/enemy_phantom_knight.png'],
            ['dragon_map', 'assets/enemies/enemy_dragon_map.png'],
            ['great_mage_map', 'assets/enemies/enemy_mage.png'],
            ['enemy_great_mage_map', 'assets/enemies/enemy_mage.png'],
        ];
        await Promise.all(assets.map(([n, s]) => this.loadImage(n, s)));
        console.log('Assets loaded');
    },

    get(n) { return this.images[n]; }
};
