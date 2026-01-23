// ===========================================
// ショップデータ
// ===========================================
const ShopData = {
    items: [
        { name: '薬草', price: 10, type: 'item', desc: 'HP+15回復', sold: false },
        { name: 'ポーション', price: 30, type: 'item', desc: 'HP+30回復', sold: false },
        { name: '上薬草', price: 50, type: 'item', desc: 'HP+60回復', sold: false },
        { name: '天使のはね', price: 500, type: 'item', desc: '村へ帰還', sold: false },
        { name: '魔除け薬', price: 50, type: 'item', desc: '600歩の間魔除け', sold: false },
        { name: '木の棒', price: 20, type: 'weapon', atk: 2, desc: '攻撃力+2', sold: false },
        { name: '銅の剣', price: 200, type: 'weapon', atk: 4, desc: '攻撃力+5', sold: false },
        { name: '鉄の剣', price: 800, type: 'weapon', atk: 8, desc: '攻撃力+8', sold: false },
        { name: '鋼の剣', price: 1200, type: 'weapon', atk: 10, desc: '攻撃力+10', sold: false },
        { name: 'ミスリル剣', price: 3000, type: 'weapon', atk: 15, desc: '攻撃力+15', sold: false },
        // WEAPON_DECEPTION: 聖剣 - 1週目で購入可能、魔王戦で奪われる
        { name: '聖剣', price: 2000, type: 'holySword', atk: 5, desc: '勇者とともに成長する剣', sold: false },
        { name: '皮の服', price: 40, type: 'armor', def: 2, desc: '防御力+2', sold: false },
        { name: '鎖帷子', price: 200, type: 'armor', def: 4, desc: '防御力+4', sold: false },
        { name: '鉄の鎧', price: 800, type: 'armor', def: 8, desc: '防御力+6', sold: false },
        { name: '鋼の鎧', price: 1200, type: 'armor', def: 10, desc: '防御力+10', sold: false },
        { name: 'ミスリルの鎧', price: 4000, type: 'armor', def: 15, desc: '防御力+18', sold: false },

    ],
    reset() { this.items.forEach(item => item.sold = false); }
};

// ===========================================
// マップアイテムデータ（非売品）
// ===========================================
const MapItems = {
    items: [
        { name: 'ドラゴンスレイヤー', price: 0, type: 'weapon', atk: 5, desc: '東の敵に特効', sold: false },
        { name: '炎の盾', price: 0, type: 'armor', def: 5, desc: 'ブレスダメージ半減', sold: false }
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
        { name: '気付け薬', price: 50, type: 'item', desc: '沈黙を治療', sold: false },
        { name: '力の粉', price: 50, type: 'item', desc: '攻撃力低下治療', sold: false },
        { name: '守りの霧', price: 50, type: 'item', desc: '防御力低下治療', sold: false },
        { name: '火の魔導書', price: 200, type: 'spell', spell: 'fire', desc: 'ファイア習得', sold: false },
        { name: '水の魔導書', price: 200, type: 'spell', spell: 'water', desc: 'アクア習得', sold: false },
        { name: '風の魔導書', price: 200, type: 'spell', spell: 'wind', desc: 'ウィンド習得', sold: false },
        { name: '銀の杖', price: 350, type: 'staff', atk:3, matk: 3, magicBoost: 1.3, desc: '攻撃+3,魔攻+3,魔法1.3倍', sold: false },
        { name: '賢者の杖', price: 1000, type: 'staff', atk: 5, matk:5, magicBoost: 1.5, desc: '攻撃+5,魔攻+5,魔法1.5倍', sold: false },
        { name: '魔法のローブ', price: 400, type: 'robe', def: 5, mdef:5, maxMp: 10, desc: '防御+5,魔防+5,MP+10', sold: false },        
        { name: '大魔道士のローブ', price: 1200, type: 'robe', def: 8, mdef:8, maxMp: 20, desc: '防御+10,魔防+10,MP+20', sold: false }
    ],
    reset() { this.items.forEach(item => item.sold = false); }
};

// ===========================================
// 上級ショップデータ
// ===========================================
const AdvancedShopData = {
    items: [
        { name: 'エリクサー', price: 100, type: 'item', desc: 'HP+200回復', sold: false },
        { name: '伝説の剣', price: 4000, type: 'weapon', atk: 25, desc: '攻撃力+30', sold: false },
        { name: '伝説の鎧', price: 4000, type: 'armor', def: 20, desc: '防御力+20', sold: false },
        { name: '幸運のアミュレット', price: 2000, type: 'amulet', desc: '獲得Gを1.5倍にする', sold: false},
        { name: '達人のアミュレット', price: 2000, type: 'amulet', desc: '獲得経験値を2倍にする', sold: false},
        { name: '金色のアミュレット', price: 4000, type: 'amulet', desc: '獲得Gを3倍にする', sold: false},
        { name: '戦神のアミュレット', price: 4000, type: 'amulet', desc: '獲得経験値を5倍にする', sold: false},
        { name: '女神の護符', price: 4000, type: 'amulet', desc: '状態異常を50%で回避する', sold:false}
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