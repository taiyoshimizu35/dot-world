// ===========================================
// 戦闘魔法システム
// ===========================================
const BattleMagic = {
    updateMagic(battle) {
        if (PlayerStats.status.silence > 0) {
            battle.msg = '沈黙状態で魔法が使えない！';
            battle.msgTimer = 0;
            battle.waitForInput = true;
            battle.phase = 'wait_input';
            battle.nextPhase = 'command';
            return;
        }

        const spells = getLearnedSpells(PlayerStats.spells);
        if (spells.length === 0) {
            battle.msg = '魔法を習得していない！';
            battle.msgTimer = 0;
            battle.waitForInput = true;
            battle.phase = 'wait_input';
            battle.nextPhase = 'command';
            return;
        }

        if (Input.justPressed('ArrowUp')) battle.magicCur = (battle.magicCur - 1 + spells.length) % spells.length;
        if (Input.justPressed('ArrowDown')) battle.magicCur = (battle.magicCur + 1) % spells.length;

        if (Input.interact()) {
            const spell = spells[battle.magicCur];
            // DECEPTION_LOGIC: MPチェック撤廃 - MPが0でも魔法発動可能
            // 元のMPチェックを削除し、常に発動させる
            if (spell.id === 'fire' || spell.id === 'water' || spell.id === 'wind') {
                battle.currentSpell = spell.id;
                battle.displaySpell = spell.id; // 表示用に元の呪文IDを保存
                battle.phase = 'magicAttack';
                this.doMagicAtk(battle, spell.mp);
            } else if (spell.id === 'heal') {
                battle.phase = 'magicHeal';
                this.doMagicHeal(battle);
            }
        }
        if (Input.cancel()) battle.phase = 'command';
    },

    doMagicAtk(battle, requiredMp) {
        const spellMp = { fire: 5, water: 5, wind: 5 };
        const spellNames = { fire: 'ファイア', water: 'アクア', wind: 'ウィンド' };
        const displaySpell = battle.currentSpell || 'fire';
        const mpCost = spellMp[displaySpell] || 5;

        // Use direct spell element (No Deception)
        const actualSpell = displaySpell;

        // DECEPTION_LOGIC: MPチェック撤廃 - MPが0でも魔法発動可能
        // 元のMPチェックを削除し、常に発動させる -> KEEPING MP CHECK REMOVAL as requested?
        // User said "magic.jsにある、属性の嘘の仕様はすべて消してください" (Remove attribute lie specs).
        // Does "Attribute Lie" include MP lie? User specifically said "Attribute Lie".
        // I will focus on removing "Element Shift".

        // MP不足時のダメージ半減判定
        // 内部実数値のMPが消費量に満たない場合、威力50%に半減
        const hasSufficientMp = PlayerStats.hasSufficientMp(mpCost);

        // MP消費（0以下にはならない）
        PlayerStats.useMp(mpCost);

        // 魔法ダメージ計算（改善版）
        // Formula: (Base + MATK * 2 + Level) * Boost
        // Fire/Water/Wind Base: 10
        const basePower = 10;
        let baseDmg = Math.floor((basePower + PlayerStats.matk * 2 + PlayerStats.level) * PlayerStats.magicBoost);

        // MP不足時は威力50%に半減
        let weaknessMsg = '';
        if (!hasSufficientMp) {
            baseDmg = Math.floor(baseDmg * 0.5);
        }

        // 弱点判定
        if (battle.enemy.weakness === actualSpell) {
            baseDmg = Math.floor(baseDmg * 2.0); // Weakness multiplier 2.0
            weaknessMsg = '\n効果は抜群だ！';
        }

        // 敵防御の半分を減算（魔法は防御貫通しやすい -> Use MDEF if available, else DEF/2）
        // Enemy definitions don't have MDEF usually, so keep DEF/2 or 0.
        // Let's rely on DEF/2 for now as requested or standard RPG logic.
        const dmg = Math.max(1, baseDmg - Math.floor(battle.enemy.def / 2) + Math.floor(Math.random() * 6));
        battle.enemyHp -= dmg;
        FX.shake(300); FX.flash(200);

        // 表示は常に選択した魔法名を使用（内部属性は隠す）
        battle.msg = `${spellNames[displaySpell]}！\n${battle.enemy.name}に${dmg}ダメージ！${weaknessMsg}`;
        battle.msgTimer = 0;
        battle.waitForInput = true;
        PlayerStats.isDefending = false;

        if (battle.enemyHp <= 0) battle.checkVictory();
        else { battle.phase = 'enemyAttack'; battle.enemyAttackCount = 0; }
    },

    doMagicHeal(battle) {
        const healMpCost = 3;
        // DECEPTION_LOGIC: MP不足時の回復量半減判定
        const hasSufficientMp = PlayerStats.hasSufficientMp(healMpCost);

        PlayerStats.useMp(healMpCost);

        let amount = Math.floor(PlayerStats.maxHp * 0.5);
        // DECEPTION_LOGIC: MP不足時は回復量も50%に半減
        if (!hasSufficientMp) {
            amount = Math.floor(amount * 0.5);
        }

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
