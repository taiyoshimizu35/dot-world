// ===========================================
// アセットローダー
// ===========================================
const AssetLoader = {
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
            ['villager', 'assets/characters/villager.png'],
            ['guard', 'assets/characters/guard.png'],
            // タイル
            ['tree', 'assets/tiles/tree.png'],
            ['grass', 'assets/tiles/grass.png'],
            ['rock', 'assets/tiles/rock.png'],
            ['path', 'assets/tiles/path.png'],
            ['water', 'assets/tiles/water.png'],
            ['floor', 'assets/tiles/floor.png'],
            ['stone', 'assets/tiles/stone.png'],
            // オブジェクト
            ['house', 'assets/objects/house.png'],
            ['signpost', 'assets/objects/signpost.png'],
            ['desk', 'assets/objects/desk.png'],
            ['bed', 'assets/objects/bed.png'],
            ['door', 'assets/objects/door.png'],
            ['chest_closed', 'assets/objects/chest_closed.png'],
            ['chest_open', 'assets/objects/chest_open.png'],
            ['counter', 'assets/objects/counter.png'],
            ['counter', 'assets/objects/counter.png'],
            ['shop_sign', 'assets/objects/shop_sign.png'],
            ['stairs', 'assets/objects/stairs.png'],
            ['stone_switch', 'assets/objects/stone_switch.png'],
            ['statue', 'assets/objects/statue.png'],
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
            // ボスマップスプライト
            ['ice_golem_map', 'assets/enemies/enemy_ice_golem.png'],
            ['phantom_knight_map', 'assets/enemies/enemy_phantom_knight.png'],
            ['dragon_map', 'assets/enemies/enemy_dragon_map.png'],
            ['great_mage_map', 'assets/enemies/enemy_great_mage_map.png'],
            ['enemy_great_mage_map', 'assets/enemies/enemy_great_mage_map.png'],
        ];
        await Promise.all(assets.map(([n, s]) => this.loadImage(n, s)));
        console.log('Assets loaded');
    },

    get(n) { return this.images[n]; }
};
