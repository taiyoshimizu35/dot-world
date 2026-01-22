// ===========================================
// ショップデータ
// ===========================================
const ShopData = {
    items: [
        { name: '薬草', price: 10, type: 'item', desc: 'HP+15回復', sold: false },
        { name: 'ポーション', price: 30, type: 'item', desc: 'HP+30回復', sold: false },
        { name: '上薬草', price: 50, type: 'item', desc: 'HP+60回復', sold: false },
        { name: '上薬草', price: 50, type: 'item', desc: 'HP+60回復', sold: false },
        { name: 'エリクサー', price: 100, type: 'item', desc: 'HP+100回復', sold: false },
        { name: '天使のはね', price: 500, type: 'item', desc: '村へ帰還', sold: false },
        { name: '魔除け薬', price: 200, type: 'item', desc: '300歩の間魔除け', sold: false },
        { name: '木の棒', price: 20, type: 'weapon', atk: 2, desc: '攻撃力+2', sold: false },
        { name: '銅の剣', price: 60, type: 'weapon', atk: 5, desc: '攻撃力+5', sold: false },
        { name: '鉄の剣', price: 100, type: 'weapon', atk: 8, desc: '攻撃力+8', sold: false },
        { name: '鋼の剣', price: 150, type: 'weapon', atk: 10, desc: '攻撃力+10', sold: false },
        { name: 'ミスリル剣', price: 300, type: 'weapon', atk: 15, desc: '攻撃力+15', sold: false },
        { name: '伝説の剣', price: 800, type: 'weapon', atk: 25, desc: '攻撃力+25', sold: false },
        // WEAPON_DECEPTION: 聖剣 - 1週目で購入可能、魔王戦で奪われる
        { name: '聖剣', price: 10000, type: 'holySword', atk: 50, desc: '魔王を倒す伝説の剣。Lvで威力UP', sold: false },
        { name: '皮の服', price: 40, type: 'armor', def: 2, desc: '防御力+2', sold: false },
        { name: '鎖帷子', price: 80, type: 'armor', def: 4, desc: '防御力+4', sold: false },
        { name: '鉄の鎧', price: 120, type: 'armor', def: 6, desc: '防御力+6', sold: false },
        { name: '鋼の鎧', price: 200, type: 'armor', def: 10, desc: '防御力+10', sold: false },
        { name: '勇者の鎧', price: 500, type: 'armor', def: 18, desc: '防御力+18', sold: false }
    ],
    reset() { this.items.forEach(item => item.sold = false); }
};

// ===========================================
// 魔法ショップデータ
// ===========================================
const MagicShopData = {
    items: [
        { name: '魔力の小瓶', price: 25, type: 'item', desc: 'MP+10回復', sold: false },
        { name: 'ハイ・エーテル', price: 80, type: 'item', desc: 'MP+30回復', sold: false },
        { name: '解毒ポーション', price: 50, type: 'item', desc: '毒を治療', sold: false },
        { name: '気付け薬', price: 60, type: 'item', desc: '沈黙を治療', sold: false },
        { name: '力の粉', price: 80, type: 'item', desc: '攻撃力低下治療', sold: false },
        { name: '守りの霧', price: 80, type: 'item', desc: '防御力低下治療', sold: false },
        { name: '火の魔導書', price: 200, type: 'spell', spell: 'fire', desc: 'ファイア習得', sold: false },
        { name: '水の魔導書', price: 200, type: 'spell', spell: 'water', desc: 'アクア習得', sold: false },
        { name: '風の魔導書', price: 200, type: 'spell', spell: 'wind', desc: 'ウィンド習得', sold: false },
        { name: '魔除けの紋章', price: 300, type: 'amulet', desc: '謎の紋章', sold: false },
        { name: '銀の杖', price: 350, type: 'staff', atk: 3, magicBoost: 1.3, desc: '攻撃+3,魔法1.3倍', sold: false },
        { name: '魔法のローブ', price: 400, type: 'robe', def: 5, maxMp: 10, desc: '防御+5,MP+10', sold: false },
        { name: '賢者の杖', price: 600, type: 'staff', atk: 5, magicBoost: 1.5, desc: '攻撃+5,魔法1.5倍', sold: false },
        { name: '大魔道士のローブ', price: 700, type: 'robe', def: 10, maxMp: 20, desc: '防御+10,MP+20', sold: false }
    ],
    reset() { this.items.forEach(item => item.sold = false); }
};

// ===========================================
// 上級ショップデータ
// ===========================================
const AdvancedShopData = {
    items: [
        { name: '上薬草', price: 50, type: 'item', desc: 'HP+60回復', sold: false },
        { name: 'エリクサー', price: 100, type: 'item', desc: 'HP+100回復', sold: false },
        { name: '鋼の剣', price: 150, type: 'weapon', atk: 10, desc: '攻撃力+10', sold: false },
        { name: 'ミスリル剣', price: 300, type: 'weapon', atk: 15, desc: '攻撃力+15', sold: false },
        { name: '鋼の鎧', price: 200, type: 'armor', def: 10, desc: '防御力+10', sold: false },
        { name: '勇者の鎧', price: 500, type: 'armor', def: 18, desc: '防御力+18', sold: false }
    ],
    reset() { this.items.forEach(item => item.sold = false); }
};

// ===========================================
// アイテム効果定義
// ===========================================
const ItemEffects = {
    '薬草': { type: 'heal', amount: 15 },
    'ポーション': { type: 'heal', amount: 30 },
    '上薬草': { type: 'heal', amount: 60 },
    'エリクサー': { type: 'heal', amount: 100 },
    '魔力の小瓶': { type: 'healMp', amount: 10 },
    'ハイ・エーテル': { type: 'healMp', amount: 30 },
    '解毒ポーション': { type: 'curePoison' },
    '気付け薬': { type: 'cureSilence' },
    '力の粉': { type: 'cureAtkDown' },
    '守りの霧': { type: 'cureDefDown' }
};