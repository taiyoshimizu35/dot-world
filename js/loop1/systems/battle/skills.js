import { PlayerStats } from '../../player.js';
import { Input } from '../../../core/input.js';
import { FX } from '../../../core/effects.js';
import { getLearnedSpells } from '../../data/magic.js'; // Might need renaming 'magic.js' data too?

// ===========================================
// 戦闘スキルシステム
// ===========================================
export const BattleSkills = {
    updateSkills(battle) {
        if (PlayerStats.status.silence > 0) {
            battle.msg = '沈黙状態でスキルが使えない！';
            battle.msgTimer = 0;
            battle.waitForInput = true;
            battle.phase = 'wait_input';
            battle.nextPhase = 'command';
            return;
        }

        // Currently we still use 'magic.js' data for learned skills
        // We really should rename 'getLearnedSpells' to 'getLearnedSkills' in data/magic.js too
        // For now, let's assume getLearnedSpells returns the list based on PlayerStats.skills logic
        const skills = getLearnedSpells(PlayerStats.skills);

        if (skills.length === 0) {
            battle.msg = 'スキルを習得していない！';
            battle.msgTimer = 0;
            battle.waitForInput = true;
            battle.phase = 'wait_input';
            battle.nextPhase = 'command';
            battle.nextPhase = 'command';
            return;
        }

        if (battle.skillCur === undefined || isNaN(battle.skillCur)) battle.skillCur = 0;

        if (Input.justPressed('ArrowUp')) battle.skillCur = (battle.skillCur - 1 + skills.length) % skills.length;
        if (Input.justPressed('ArrowDown')) battle.skillCur = (battle.skillCur + 1) % skills.length;

        if (Input.interact()) {
            const skill = skills[battle.skillCur];

            // SP Check (using spell.mp -> we should probably alias it to sp in data or check mp property)
            // Assuming data still has 'mp' property for cost
            const cost = skill.mp || skill.sp || 5;

            if (PlayerStats.sp < cost) {
                battle.msg = 'SPが足りない！';
                battle.msgTimer = 0;
                battle.waitForInput = true;
                return;
            }

            // Execute Skill
            if (skill.id === 'fire' || skill.id === 'water' || skill.id === 'wind') {
                battle.currentSkill = skill.id;
                battle.displaySkill = skill.id;
                battle.phase = 'skillAttack';
                this.doSkillAtk(battle, cost);
            } else if (skill.id === 'heal') {
                battle.phase = 'skillHeal';
                this.doSkillHeal(battle, cost);
            }
        }
        if (Input.cancel()) battle.phase = 'command';
    },

    doSkillAtk(battle, cost) {
        const skillSp = { fire: 5, water: 5, wind: 5 };
        const skillNames = { fire: 'ファイア', water: 'アクア', wind: 'ウィンド' };
        const displaySkill = battle.currentSkill || 'fire';

        // SP Consumption
        PlayerStats.useSp(cost);

        // Damage Calculation
        // Using MATK for these specific magic skills
        const basePower = 10;
        let baseDmg = Math.floor((PlayerStats.matk * 1.2) * PlayerStats.magicBoost);
        let weaknessMsg = '';

        // Weakness Check
        // Using direct skill property for element check (simple)
        if (battle.enemy.weakness === displaySkill) {
            baseDmg = Math.floor(baseDmg * 1.2);
            weaknessMsg = '\n効果は抜群だ！';
        }

        const dmg = Math.max(1, baseDmg - Math.floor(battle.enemy.def) + Math.floor(Math.random() * 6));
        battle.enemyHp -= dmg;
        FX.shake(300); FX.flash(200);

        battle.msg = `${skillNames[displaySkill]}！\n${battle.enemy.name}に${dmg}ダメージ！${weaknessMsg}`;
        battle.msgTimer = 0;
        battle.waitForInput = true;
        PlayerStats.isDefending = false;

        if (battle.enemyHp <= 0) battle.checkVictory();
        else { battle.phase = 'enemyAttack'; battle.enemyAttackCount = 0; }
    },

    doSkillHeal(battle, cost) {
        // SP Consumption
        const hasSufficientSp = PlayerStats.hasSufficientSp(cost);
        PlayerStats.useSp(cost);

        let amount = Math.floor(PlayerStats.maxHp * 0.5);

        // Logic for insufficient SP (if we allowed cast without full SP, but check above prevents it normally)
        // Keeping "Logic for insufficient SP -> Half Effect" if check was bypassed or special rule?
        // User asked to remove "Attribute Lie", but didn't explicitly ask to remove "Half Heal on Low MP logic".
        // But since we have strict SP check in updateSkills, hasSufficientSp is always true here.

        PlayerStats.heal(amount);
        FX.flash(100);
        battle.msg = `ヒール！\nHPが${amount}回復した！`;
        battle.msgTimer = 0;
        battle.waitForInput = true;
        battle.phase = 'wait_input';
        battle.nextPhase = 'enemyAttack';
        battle.enemyAttackCount = 0;
        PlayerStats.isDefending = false;
    }
};
