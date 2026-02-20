import { SkillData2 } from '../../data/skills.js';
import { FX } from '../../../core/effects.js';
import { Inventory2 } from '../../inventory.js';
import { ItemData2 } from '../../data/items.js';
import { Party2 } from '../../party.js';
import { PlayerStats2 } from '../../player.js';

// ===========================================
// Loop 2 戦闘スキル処理
// ===========================================
export const BattleSkills2 = {

    // スキル実行 (Action Object: { type: 'skill', skillId: '...' })
    execute(battle, actor, action, target) {
        const skillId = action.skillId;
        const skill = SkillData2[skillId];

        if (!skill) {
            battle.msg = `${actor.name}はスキルを使おうとしたが、思い出せない！`;
            return;
        }

        // SP消費
        if (actor.sp < skill.sp) {
            battle.msg = `${actor.name}はSPが足りない！`;
            return;
        }
        actor.sp -= skill.sp;

        let msg = `${actor.name}の${skill.name}！`;
        battle.msg = msg; // 初期メッセージセット

        // 1. メイン効果 (ダメージ/回復)
        if (skill.type === 'physical' || skill.type === 'magic') {
            this.doDamage(battle, actor, target, skill);
        } else if (skill.type === 'heal') {
            this.doHeal(battle, actor, target, skill);
        }

        // 2. 追加効果 / バフ・デバフ / 特殊
        if (skill.effect) {
            this.applyEffect(battle, actor, target, skill);
        }
    },

    doDamage(battle, actor, target, skill) {
        let msg = battle.msg;

        // 威力計算
        let stat = skill.type === 'physical' ? actor.atk : actor.matk;
        let power = skill.power || 1.0;

        let baseDmg = Math.floor(stat * power);
        let dmg = Math.max(1, baseDmg - Math.floor(target.def / 2) + Math.floor(Math.random() * (stat * 0.2)));

        // クリティカル
        if (skill.critRate && Math.random() < skill.critRate) {
            dmg = Math.floor(dmg * 1.5);
            msg += '\nクリティカルヒット！';
        }

        // 連撃
        const hits = skill.hits || 1;

        let totalDmg = 0;
        for (let i = 0; i < hits; i++) {
            if (target.hp !== undefined) {
                target.hp = Math.max(0, target.hp - dmg);
                totalDmg += dmg;
            }
        }

        msg += `\n${target.name}に${totalDmg}のダメージ！`;
        if (hits > 1) msg += `(${hits}回攻撃)`;

        FX.shake(100 * hits);
        FX.flash(100);

        battle.msg = msg;
    },

    doHeal(battle, actor, target, skill) {
        let msg = battle.msg;
        let amount = skill.power || 0;

        if (amount > 0) {
            target.hp = Math.min(target.maxHp, target.hp + amount);
            msg += `\n${target.name}のHPが${amount}回復した！`;
        }

        FX.flash(100);
        battle.msg = msg;
    },

    applyEffect(battle, actor, target, skill) {
        let msg = battle.msg;
        const effect = skill.effect;

        // 対象のステータスバッファ初期化
        if (target && !target.status) target.status = {};
        if (target && !target.buffs) target.buffs = {};

        // -----------------------
        // 状態異常・バフデバフ
        // -----------------------
        if (effect === 'poison') {
            target.status.poison = true;
            msg += `\n${target.name}は毒に侵された！`;
        }
        else if (effect === 'stun') {
            target.status.stun = true;
            msg += `\n${target.name}は気絶した！`;
        }
        else if (effect === 'cure_status') {
            target.status = {};
            msg += `\n${target.name}の状態異常が治った！`;
        }
        else if (effect === 'def_up') {
            target.buffs.defUp = { val: skill.value || 1.5, turn: skill.duration || 3 };
            msg += `\n${target.name}の防御力が上がった！`;
        }
        else if (effect === 'atk_up') {
            target.buffs.atkUp = { val: skill.value || 1.5, turn: skill.duration || 3 };
            msg += `\n${target.name}の攻撃力が上がった！`;
        }
        else if (effect === 'atk_matk_up') {
            target.buffs.atkUp = { val: 1.5, turn: 3 };
            target.buffs.matkUp = { val: 1.5, turn: 3 };
            msg += `\n${target.name}の攻撃と魔力が上がった！`;
        }
        else if (effect === 'all_down') {
            target.buffs.atkDown = { val: 0.8, turn: 3 };
            target.buffs.defDown = { val: 0.8, turn: 3 };
            target.buffs.matkDown = { val: 0.8, turn: 3 };
            target.buffs.mdefDown = { val: 0.8, turn: 3 };
            target.buffs.agiDown = { val: 0.8, turn: 3 };
            msg += `\n${target.name}の全能力が下がった！`;
        }
        else if (effect === 'agi_down') {
            target.buffs.agiDown = { val: 0.5, turn: 3 };
            msg += `\n${target.name}の動きが遅くなった！`;
        }
        else if (effect === 'agi_up') {
            target.buffs.agiUp = { val: 1.5, turn: 3 };
            msg += `\n${target.name}の動きが早くなった！`;
        }
        else if (effect === 'cover') {
            actor.status.cover = true;
            msg += `\n${actor.name}は仲間をかばう構えをとった！`;
        }

        // -----------------------
        // 特殊効果 (Utility)
        // -----------------------
        else if (effect === 'steal_item') {
            if (target.drop && target.drop.item) {
                if (Math.random() < 0.5) {
                    Inventory2.addItem(target.drop.item);
                    msg += `\n${ItemData2[target.drop.item].name}を盗み出した！`;
                    target.drop = null;
                } else {
                    msg += `\nしかし盗めなかった！`;
                }
            } else {
                msg += `\nしかし何も持っていなかった！`;
            }
        }
        else if (effect === 'flee_success') {
            battle.bribed = true;
            msg += `\n${target.name}は金を受け取って帰っていった！`;
            target.hp = 0;
        }

        battle.msg = msg;
    },
};
