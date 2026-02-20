// ===========================================
// Loop 2 スキルデータ
// ===========================================

export const SkillData2 = {
    // 汎用・戦士系
    'slash': {
        id: 'slash',
        name: '強斬り',
        type: 'physical',
        sp: 4,
        power: 1.5,
        desc: '敵単体に強力な斬撃'
    },
    'double_slash': {
        id: 'double_slash',
        name: '二段斬り',
        type: 'physical',
        sp: 8,
        power: 1.0,
        hits: 2,
        desc: '敵単体に2回攻撃'
    },

    // リン (Dragon)
    'dragon_claw': {
        id: 'dragon_claw',
        name: '竜の爪',
        type: 'physical',
        sp: 6,
        power: 1.8,
        desc: '竜の力を宿した一撃'
    },
    'dragon_breath': {
        id: 'dragon_breath',
        name: '竜の息吹',
        type: 'magic',
        sp: 12,
        power: 1.5,
        target: 'all_enemies', // 未実装ロジック
        element: 'fire',
        desc: '敵全体に炎のブレス'
    },

    // ガウェイン (Tank)
    'shield_bash': {
        id: 'shield_bash',
        name: 'シールドバッシュ',
        type: 'physical',
        sp: 5,
        power: 1.0,
        effect: 'stun',
        desc: '盾で殴りつけ気絶させる'
    },
    'cover': {
        id: 'cover',
        name: 'かばう',
        type: 'buff',
        sp: 5,
        effect: 'cover', // 未実装（ロジック追加必要）
        target: 'self',
        desc: '味方への攻撃を代わりに受ける'
    },
    'iron_defense': {
        id: 'iron_defense',
        name: '鉄壁',
        type: 'buff',
        sp: 8,
        effect: 'def_up',
        value: 2.0,
        desc: '防御力を大幅に上げる'
    },

    // ルルシア (Mage/Dark)
    'dark_blast': {
        id: 'dark_blast',
        name: 'ダークブラスト',
        type: 'magic',
        sp: 5,
        power: 1.8,
        element: 'dark',
        desc: '闇の魔力を爆発させる'
    },
    'dark_void': {
        id: 'dark_void',
        name: 'ダークヴォイド',
        type: 'magic',
        sp: 15,
        power: 2.5,
        element: 'dark',
        desc: '虚無の闇で敵を消し去る'
    },

    // エレナ (Heal)
    'heal': {
        id: 'heal',
        name: 'ヒール',
        type: 'heal',
        sp: 5,
        power: 50,
        desc: '味方単体のHPを回復'
    },
    'high_heal': {
        id: 'high_heal',
        name: 'ハイヒール',
        type: 'heal',
        sp: 12,
        power: 120,
        desc: '味方単体のHPを大きく回復'
    },
    'cure': {
        id: 'cure',
        name: 'キュア',
        type: 'heal',
        sp: 4,
        effect: 'cure_status',
        desc: '味方単体の状態異常を治癒'
    },

    // シェラ (Thief)
    'mug': {
        id: 'mug',
        name: 'ぶんどる',
        type: 'physical',
        sp: 4,
        power: 1.0,
        effect: 'steal_item',
        desc: '攻撃と同時にアイテムを盗む'
    },
    'assassinate': {
        id: 'assassinate',
        name: '暗殺',
        type: 'physical',
        sp: 15,
        power: 3.0,
        critRate: 0.5,
        desc: '急所を狙う致死の一撃'
    },

    // ゴルドン (Merchant)
    'bribe': {
        id: 'bribe',
        name: '買収',
        type: 'utility',
        sp: 10,
        effect: 'flee_success',
        desc: '敵に金を渡して帰ってもらう'
    },

    // ソフィーナ (Debuff)
    'curse': {
        id: 'curse',
        name: '呪い',
        type: 'debuff',
        sp: 6,
        effect: 'all_down',
        desc: '敵の全ステータスを下げる'
    },
    'blood_pact': {
        id: 'blood_pact',
        name: '血の契約',
        type: 'buff',
        sp: 10,
        target: 'party',
        effect: 'atk_matk_up',
        desc: '味方全員の攻撃・魔攻を大きく上げる'
    },

    // クロン (Time)
    'slow': {
        id: 'slow',
        name: 'スロウ',
        type: 'debuff',
        sp: 8,
        effect: 'agi_down',
        desc: '敵の時間を遅くする'
    },
    'haste': {
        id: 'haste',
        name: 'ヘイスト',
        type: 'buff',
        sp: 8,
        effect: 'agi_up',
        target: 'party',
        desc: '味方の時間を早くする'
    },

    // アルド (Sword)
    'braver': {
        id: 'braver',
        name: 'ブレイバー',
        type: 'physical',
        sp: 10,
        power: 2.2,
        desc: '勇気を込めた強烈な一撃'
    }
};
