// Item Definitions
export const ItemData2 = {
    // --- Consumables (Tools) ---
    'potion': {
        id: 'potion', name: 'ポーション', type: 'consumable',
        desc: 'HPを50回復する',
        effect: { type: 'heal', value: 50 },
        price: 50
    },
    'hi_potion': {
        id: 'hi_potion', name: 'ハイポーション', type: 'consumable',
        desc: 'HPを150回復する',
        effect: { type: 'heal', value: 150 },
        price: 200
    },
    'ether': {
        id: 'ether', name: 'エーテル', type: 'consumable',
        desc: 'SPを20回復する',
        effect: { type: 'heal_sp', value: 20 },
        price: 300
    },
    'antidote': {
        id: 'antidote', name: '毒消し草', type: 'consumable',
        desc: '毒を治療する',
        effect: { type: 'cure_status', status: 'poison' },
        price: 20
    },

    // --- Weapons ---
    'short_sword': {
        id: 'short_sword', name: 'ショートソード', type: 'weapon',
        desc: '小型の剣。扱いやすい。',
        stats: { atk: 10 },
        price: 150
    },
    'iron_sword': {
        id: 'iron_sword', name: '鉄の剣', type: 'weapon',
        desc: '一般的な鉄製の剣。',
        stats: { atk: 25 },
        price: 500
    },
    'magic_wand': {
        id: 'magic_wand', name: '木の杖', type: 'weapon',
        desc: '魔法の力が宿る杖。',
        stats: { atk: 5, matk: 10 },
        price: 300
    },

    // --- Armor ---
    'cloth_armor': {
        id: 'cloth_armor', name: '布の服', type: 'armor',
        desc: '旅人の服。防御力は低い。',
        stats: { def: 5 },
        price: 100
    },
    'leather_armor': {
        id: 'leather_armor', name: '革の鎧', type: 'armor',
        desc: '革で強化された鎧。',
        stats: { def: 12 },
        price: 350
    },

    // --- Accessories ---
    'power_ring': {
        id: 'power_ring', name: '力の指輪', type: 'accessory',
        desc: '攻撃力が上がる指輪。',
        stats: { atk: 5 },
        price: 800
    },
    'amulet': {
        id: 'amulet', name: 'お守り', type: 'accessory',
        desc: '防御力が少し上がる。',
        stats: { def: 5 },
        price: 500
    },

    // --- Materials (Loot) ---
    'slime_jelly': {
        id: 'slime_jelly', name: 'スライムゼリー', type: 'material',
        desc: 'スライムの体液。ぷるぷるしている。',
        price: 20
    },
    'wolf_fang': {
        id: 'wolf_fang', name: '狼の牙', type: 'material',
        desc: '鋭い牙。武器の素材になる。',
        price: 60
    },
    'iron_scrap': {
        id: 'iron_scrap', name: '鉄くず', type: 'material',
        desc: '錆びた鉄の塊。',
        price: 100
    },
    'scorpion_tail': {
        id: 'scorpion_tail', name: 'サソリの尻尾', type: 'material',
        desc: '毒を持つ尻尾。取り扱い注意。',
        price: 80
    },
    'magic_bone': {
        id: 'magic_bone', name: '魔力を帯びた骨', type: 'material',
        desc: 'アンデッドの骨。薄気味悪い。',
        price: 120
    },
    'ancient_coin': {
        id: 'ancient_coin', name: '古びた金貨', type: 'material',
        desc: '昔の通貨。換金用。',
        price: 500
    },
    'evil_crystal': {
        id: 'evil_crystal', name: '魔結晶', type: 'material',
        desc: '魔力が凝縮された結晶。高値で売れる。',
        price: 1000
    }
};
