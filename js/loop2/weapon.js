// ===========================================
// 2週目武器システム（買い替え式）
// ===========================================

const WeaponData = {
    wooden_sword: { id: 'wooden_sword', name: '木の剣', atk: 5, price: 0, desc: '初期装備の木製の剣' },
    iron_sword: { id: 'iron_sword', name: '鉄の剣', atk: 12, price: 200, desc: '鍛冶屋で作られた頑丈な剣' },
    steel_sword: { id: 'steel_sword', name: '鋼の剣', atk: 20, price: 500, desc: '精練された鋼の剣' },
    magic_sword: { id: 'magic_sword', name: '魔剣', atk: 35, price: 1500, desc: '魔力を秘めた強力な剣' },
    holy_sword: { id: 'holy_sword', name: '聖剣', atk: 50, price: 3000, desc: '神に祝福された伝説の剣' }
};

const WeaponShop = {
    // 販売中の武器リスト
    inventory: ['iron_sword', 'steel_sword', 'magic_sword', 'holy_sword'],

    // 武器を購入
    buy(weaponId) {
        const weapon = WeaponData[weaponId];
        if (!weapon) return { success: false, msg: '武器が見つからない' };

        if (PlayerStats2.gold < weapon.price) {
            return { success: false, msg: 'ゴールドが足りない！' };
        }

        PlayerStats2.spendGold(weapon.price);
        PlayerStats2.equipWeapon({ ...weapon });

        return {
            success: true,
            msg: `${weapon.name}を購入して装備した！\nATK +${weapon.atk}`
        };
    },

    // ショップメニュー用の武器リスト取得
    getAvailableWeapons() {
        return this.inventory.map(id => ({
            ...WeaponData[id],
            canBuy: PlayerStats2.gold >= WeaponData[id].price
        }));
    }
};
