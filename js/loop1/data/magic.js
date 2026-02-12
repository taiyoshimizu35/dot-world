// ===========================================
// 魔法データ
// ===========================================
export const MagicData = {
    fire: { id: 'fire', name: 'ファイア', mp: 5, type: 'attack', element: 'fire', basePower: 1.1 },
    water: { id: 'water', name: 'アクア', mp: 5, type: 'attack', element: 'water', basePower: 1.1 },
    wind: { id: 'wind', name: 'ウィンド', mp: 5, type: 'attack', element: 'wind', basePower: 1.1 },
    heal: { id: 'heal', name: 'ヒール', mp: 3, type: 'heal', healPercent: 0.5 }
};

// 習得可能な魔法リストを取得
export function getLearnedSpells(playerSpells) {
    const spells = [];
    if (playerSpells.fire) spells.push(MagicData.fire);
    if (playerSpells.water) spells.push(MagicData.water);
    if (playerSpells.wind) spells.push(MagicData.wind);
    if (playerSpells.heal) spells.push(MagicData.heal);
    return spells;
}
