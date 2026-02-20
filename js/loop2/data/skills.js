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
    'dragon_claw': { // リン
        id: 'dragon_claw',
        name: '竜の爪',
        type: 'physical',
        sp: 6,
        power: 1.8,
        desc: '竜の力を宿した一撃'
    },
    'shield_bash': { // ガウェイン
        id: 'shield_bash',
        name: 'シールドバッシュ',
        type: 'physical',
        sp: 5,
        power: 1.0,
        effect: 'stun', // 将来的にスタン
        desc: '盾で殴りつける(防御依存ダメージ未実装)'
    },

    // 魔法系
    'dark_blast': { // ルルシア
        id: 'dark_blast',
        name: 'ダークブラスト',
        type: 'magic',
        sp: 5,
        power: 1.8,
        element: 'dark',
        desc: '闇の魔力を爆発させる'
    },
    'fireball': {
        id: 'fireball',
        name: 'ファイアボール',
        type: 'magic',
        sp: 5,
        power: 1.5,
        element: 'fire',
        desc: '炎の玉を投げつける'
    },

    // 回復系
    'heal': { // エレナ
        id: 'heal',
        name: 'ヒール',
        type: 'heal',
        sp: 5,
        power: 50,
        desc: '味方単体のHPを回復'
    },
    'cure': { // エレナ
        id: 'cure',
        name: 'キュア',
        type: 'heal',
        sp: 4,
        effect: 'cure_status',
        desc: '味方単体の状態異常を治癒'
    },

    // 補助・特殊
    'cover': { // ガウェイン
        id: 'cover',
        name: 'かばう',
        type: 'buff',
        sp: 5,
        effect: 'cover', // 未実装（ロジック追加必要）
        target: 'self',
        desc: '味方への攻撃を代わりに受ける'
    },
    'mug': { // シェラ
        id: 'mug',
        name: 'ぶんどる',
        type: 'physical',
        sp: 4,
        power: 1.0,
        effect: 'steal_item',
        desc: '攻撃と同時にアイテムを盗む'
    },
    'bribe': { // ゴルドン
        id: 'bribe',
        name: '買収',
        type: 'utility',
        sp: 10, // お金も減る処理が必要かも
        effect: 'flee_success',
        desc: '敵に金を渡して帰ってもらう'
    },
    'curse': { // ソフィーナ
        id: 'curse',
        name: '呪い',
        type: 'debuff',
        sp: 6,
        effect: 'all_down',
        desc: '敵の全ステータスを下げる'
    },
    'blood_pact': { // ソフィーナ
        id: 'blood_pact',
        name: '血の契約',
        type: 'buff',
        sp: 10, // HP消費も？
        target: 'party',
        effect: 'atk_matk_up',
        desc: '味方全員の攻撃・魔攻を大きく上げる'
    },
    'slow': { // クロン
        id: 'slow',
        name: 'スロウ',
        type: 'debuff',
        sp: 8,
        effect: 'agi_down',
        desc: '敵の時間を遅くする'
    },
    'haste': { // クロン
        id: 'haste',
        name: 'ヘイスト',
        type: 'buff',
        sp: 8,
        effect: 'agi_up',
        target: 'party',
        desc: '味方の時間を早くする'
    }
};
