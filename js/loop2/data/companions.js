export const PartyMemberData2 = {
    // Template for Physical Attacker
    'warrior': {
        id: 'warrior',
        name: '戦士',
        hp: 120, maxHp: 120,
        mp: 0, maxMp: 0,
        atk: 5, def: 15,
        matk: 5, mdef: 5,
        type: 'physical', // Determines AI behavior in Party2.getAction
        msg: '「背中は任せろ！」'
    },

    // Template for Healer/Mage
    'mage': {
        id: 'mage',
        name: '魔導士',
        hp: 80, maxHp: 80,
        mp: 60, maxMp: 60,
        atk: 10, def: 8,
        matk: 30, mdef: 25,
        type: 'magic',
        msg: '「魔法なら任せて。」'
    }
};
