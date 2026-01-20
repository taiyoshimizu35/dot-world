// ===========================================
// 戦闘アクション
// ===========================================
const BattleActions = {
    doPlayerAtk(battle) {
        // DECEPTION_LOGIC: ダメージ計算は内部実数値のatkを使用
        const dmg = Math.max(1, PlayerStats.atk - battle.enemy.def + Math.floor(Math.random() * 4));
        battle.enemyHp -= dmg;
        FX.shake(200); FX.flash(100);
        battle.msg = `${battle.enemy.name}に${dmg}ダメージ！`;
        battle.msgTimer = 0;
        battle.waitForInput = true;
        PlayerStats.isDefending = false;

        if (battle.enemyHp <= 0) battle.checkVictory();
        else { battle.phase = 'enemyAttack'; battle.enemyAttackCount = 0; }
    },

    doEnemyAtk(battle) {
        // クリスタル・ゴーレム特殊攻撃（常に防御ペナルティ）
        if (battle.enemy.name === 'クリスタル・ゴーレム' && PlayerStats.isDefending) {
            const dmg = Math.floor(battle.enemy.atk * 1.5);
            const finalDmg = Math.max(1, dmg);
            const dead = PlayerStats.takeDamage(finalDmg);
            FX.shake(300); FX.flashRed(200);

            // DECEPTION_LOGIC: 死の偽装工作
            if (dead) {
                this.handleDeceptiveDeath(battle, finalDmg);
                return;
            }

            battle.msg = `${battle.enemy.name}の重い一撃！\n防御が裏目に出た！ ${finalDmg}ダメージ！`;
            battle.finishEnemyAtk();
            return;
        }

        // 魔法使い敵の攻撃
        if (battle.enemy.usesMagic && Math.random() < 0.4) {
            if (Math.random() < 0.5) {
                const types = ['poison', 'silence', 'atkDown', 'defDown'];
                const type = types[Math.floor(Math.random() * types.length)];
                let effectMsg = '';

                if (type === 'poison') {
                    const poisonDmg = 3;
                    if (PlayerStats.status.poisonVal > 0) {
                        PlayerStats.status.poisonVal += poisonDmg;
                        effectMsg = '毒を受けた！毒が深まった！';
                    } else {
                        PlayerStats.status.poisonVal = poisonDmg;
                        effectMsg = '毒を受けた！';
                    }
                } else if (type === 'silence') {
                    PlayerStats.status.silence = 3;
                    effectMsg = '沈黙を受けた！魔法が使えない！';
                } else if (type === 'atkDown') {
                    PlayerStats.applyAtkDebuff(5);
                    effectMsg = '攻撃力が下がった！';
                } else if (type === 'defDown') {
                    PlayerStats.applyDefDebuff(5);
                    effectMsg = '防御力が下がった！';
                }

                FX.shake(250); FX.flash(180);
                battle.msg = `${battle.enemy.name}の状態異常魔法！\n${effectMsg}`;
            } else {
                // DECEPTION_LOGIC: ダメージ計算は内部実数値のdefを使用
                let dmg = Math.max(1, Math.floor(battle.enemy.atk * 1.3) - PlayerStats.def + Math.floor(Math.random() * 4));

                // COMMAND_DECEPTION: 防御の嘘 - 防御中は1.5倍ダメージ（挑発として機能）
                if (PlayerStats.isDefending && !truthFlags.command) {
                    dmg = Math.floor(dmg * 1.5);
                } else if (PlayerStats.isDefending && truthFlags.command) {
                    dmg = Math.floor(dmg * 0.5);
                }

                if (QuestFlags.hasAmulet) dmg = Math.max(1, dmg - 5);
                const dead = PlayerStats.takeDamage(dmg);
                FX.shake(250); FX.flash(180);

                // DECEPTION_LOGIC: 死の偽装工作
                if (dead) {
                    this.handleDeceptiveDeath(battle, dmg);
                    return;
                }

                battle.msg = `${battle.enemy.name}の魔法攻撃！\n${dmg}ダメージ！`;
            }
            battle.finishEnemyAtk();
            return;
        }

        // 通常攻撃
        // DECEPTION_LOGIC: ダメージ計算は内部実数値のdefを使用
        let dmg = Math.max(1, battle.enemy.atk - PlayerStats.def + Math.floor(Math.random() * 3));

        // COMMAND_DECEPTION: 防御の嘘 - 防御中は1.5倍ダメージ（挑発として機能）
        if (PlayerStats.isDefending && !truthFlags.command) {
            dmg = Math.floor(dmg * 1.5);
        } else if (PlayerStats.isDefending && truthFlags.command) {
            dmg = Math.floor(dmg * 0.5);
        }

        const dead = PlayerStats.takeDamage(dmg);
        FX.shake(150);
        if (battle.isBoss) FX.flashRed(100);

        // DECEPTION_LOGIC: 死の偽装工作
        if (dead) {
            this.handleDeceptiveDeath(battle, dmg);
        } else {
            battle.msg = `${battle.enemy.name}の攻撃！\n${dmg}ダメージ！`;
            battle.finishEnemyAtk();
        }
    },

    // DECEPTION_LOGIC: 死の偽装工作 - 表示HPに関わらず内部HP基準で死亡、「痛恨の一撃！」表示
    handleDeceptiveDeath(battle, actualDmg) {
        if (!truthFlags.status) {
            // 偽装モード: 痛恨の一撃として表示（表示HPとの矛盾を隠蔽）
            // DECEPTION_LOGIC: 内部HPを確実に0にして表示を同期
            PlayerStats.hp = 0;

            // 強力な画面揺れエフェクト
            FX.shake(800);
            FX.flashRed(500);

            battle.msg = `${battle.enemy.name}の攻撃！\n痛恨の一撃！`;
            battle.phase = 'deceptiveDeath';
            battle.msgTimer = 0;
            battle.waitForInput = true;
        } else {
            // 真実モード: 通常の死亡処理
            battle.phase = 'defeat';
            battle.msg = '力尽きた...';
            battle.msgTimer = 0;
            battle.waitForInput = true;
        }
    },

    doFlee(battle) {
        if (battle.isBoss) {
            battle.msg = 'ボスからは逃げられない！';
            battle.msgTimer = 0; battle.waitForInput = true;
            battle.phase = 'wait_input'; battle.nextPhase = 'command';
        } else {
            battle.msg = '逃げ出した！';
            battle.msgTimer = 0; battle.waitForInput = true;
            battle.phase = 'wait_input'; battle.nextPhase = 'end';
        }
    }
};
