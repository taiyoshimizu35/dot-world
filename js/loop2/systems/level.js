import { Msg } from '../../core/message.js';
import { LearningData } from '../data/learning.js';
import { PartyMemberData2 } from '../data/companions.js';

export const LevelSystem = {
    // 経験値テーブル (簡易計算: Level^2 * 10 or similar)
    getNextExp(level) {
        return Math.floor(10 * (level * level) + 40);
    },

    // 経験値加算処理
    // target: { level, exp, nextExp, name, id (optional), stats... }
    addExp(target, amount) {
        target.exp += amount;
        let originalLevel = target.level;
        let leveledUp = false;

        while (target.exp >= target.nextExp) {
            target.exp -= target.nextExp;
            target.level++;
            target.nextExp = this.getNextExp(target.level);

            this.applyGrowth(target);
            this.checkDoLearning(target);
            leveledUp = true;
        }

        if (leveledUp) {
            Msg.show(`${target.name}はレベル${target.level}になった！`);
        }

        return leveledUp;
    },

    // ステータス成長適用
    applyGrowth(target) {
        // 固定成長 + ランダム分散
        // growthTypeを考慮
        let type = target.growthType || 'balanced';
        if (!target.growthType && target.id && PartyMemberData2[target.id]) {
            type = PartyMemberData2[target.id].growthType;
        }

        const growth = this.getGrowthRates(type);

        // MaxHP
        const hpUp = Math.floor(growth.hp + Math.random() * 2);
        target.baseMaxHp = (target.baseMaxHp || target.maxHp) + hpUp;
        target.maxHp = target.baseMaxHp; // Simplified sync
        target.hp += hpUp;

        // MaxSP
        const spUp = Math.floor(growth.sp + Math.random() * 1);
        target.baseMaxSp = (target.baseMaxSp || target.maxSp) + spUp;
        target.maxSp = target.baseMaxSp;
        target.sp += spUp;

        // Stats
        target.atk = (target.atk || 0) + growth.atk;
        target.def = (target.def || 0) + growth.def;
        target.matk = (target.matk || 0) + growth.matk;
        target.mdef = (target.mdef || 0) + growth.mdef;
        target.agi = (target.agi || 0) + (Math.random() < 0.3 ? 1 : 0); // Agi is slow
    },

    getGrowthRates(type) {
        const rates = { hp: 3, sp: 2, atk: 1, def: 1, matk: 1, mdef: 1 };

        if (type === 'warrior') { rates.hp = 5; rates.atk = 3; rates.def = 2; rates.matk = 0; }
        else if (type === 'mage') { rates.hp = 2; rates.sp = 5; rates.atk = 0; rates.matk = 3; rates.mdef = 2; }
        else if (type === 'tank') { rates.hp = 6; rates.def = 3; rates.mdef = 2; rates.atk = 1; }
        else if (type === 'thief') { rates.hp = 3; rates.sp = 3; rates.atk = 2; rates.agi = 1; } // Agi bonus logic needed
        else if (type === 'cleric') { rates.hp = 3; rates.sp = 4; rates.matk = 2; rates.mdef = 3; }

        return rates;
    },

    // スキル習得チェック
    checkDoLearning(target) {
        // IDがない場合は学習データ引けない（主人公など）
        // 主公人のIDを固定するか、別途渡す必要あり
        // ここでは target.id を参照する
        const id = target.id || (target.name === '勇者' ? 'hero' : null);
        if (!id || !LearningData[id]) return;

        const skillsToLearn = LearningData[id][target.level];
        if (skillsToLearn) {
            if (!target.skills) target.skills = []; // 配列形式を想定 (Loop 1はObjectだったが統合推奨)

            // PlayerStats2は spells { fire: bool } 形式、Companionsは skills ['ID'] 形式
            // 互換性のため両方対応、または統一すべき。
            // ここでは Companion (Array) を優先し、PlayerStats修正を推奨。

            skillsToLearn.forEach(skillId => {
                // 配列形式の場合
                if (Array.isArray(target.skills)) {
                    if (!target.skills.includes(skillId)) {
                        target.skills.push(skillId);
                        Msg.show(`${target.name}は${skillId}を覚えた！`); // 名前解決はSkillData必要
                    }
                }
                // オブジェクト形式の場合 (PlayerStats?)
                else {
                    // console.warn("Object style skills not fully supported in auto-learn yet");
                }
            });
        }
    }
};
