// ===========================================
// 戦闘アクション
// ===========================================
const BattleActions = {
    doPlayerAtk(battle) {
        // 1週目の魔王戦のみ発生する自傷ギミック
        if (WorldState.week === 1 && battle.isDemonKing) {
            const dmg = Math.max(5, Math.floor(PlayerStats.atk * 0.8));
            PlayerStats.hp -= dmg;

            FX.shake(500); FX.flashRed(300);
            battle.msg = `今の勇者では魔王にダメージを与えられない！`;

            this.checkPlayerDeath(battle);
            return;
        }

        // 通常のダメージ計算
        let baseDmg = PlayerStats.atk - battle.enemy.def + Math.floor(Math.random() * 4);

        // Dragon Slayer Effect: 1.2x damage in East area
        if (PlayerStats.equipment.weapon === 'ドラゴンスレイヤー' && Maps.get().area === 'east') {
            baseDmg = Math.floor(baseDmg * 1.2);
        }

        const dmg = Math.max(1, baseDmg);
        battle.enemyHp -= dmg;

        FX.shake(200); FX.flash(100);
        battle.msg = `${battle.enemy.name}に${dmg}ダメージ！`;
        battle.msgTimer = 0;
        battle.waitForInput = true;
        PlayerStats.isDefending = false;

        if (battle.enemyHp <= 0) {
            battle.checkVictory();
        } else {
            battle.phase = 'enemyAttack';
            battle.enemyAttackCount = 0;
        }
    },

    // 敵の攻撃ロジック
    doEnemyAtk(battle) {
        let dmg = 0;
        let effectMsg = '';

        // 特殊行動（クリスタル・ゴーレム等）
        if (battle.enemy.name === 'クリスタル・ゴーレム' && PlayerStats.isDefending) {
            dmg = Math.floor(battle.enemy.atk * 1.5);
            effectMsg = `重い一撃が防御を貫く！ `;
        }
        // ブレス攻撃（古代のドラゴン等）
        else if (battle.enemy.useBreath && Math.random() < 0.15) {
            dmg = 30; // 固定ダメージ
            // Apply MDEF reduction to Breath (Magic Resistance)
            dmg = Math.max(1, dmg - PlayerStats.mdef);

            effectMsg = `${battle.enemy.name}のブレス！\n`;

            // Flame Shield Effect: Halve Breath damage
            if (PlayerStats.equipment.armor === '炎の盾') {
                dmg = Math.floor(dmg * 0.5);
                effectMsg += '(防具がダメージを軽減した！)';
            }
        }
        else {
            // Check if enemy uses Magic (Magic Attack)
            if (battle.enemy.usesMagic) {
                // Magic Attack Formula: ATK - MDEF
                dmg = Math.max(1, battle.enemy.atk - PlayerStats.mdef + Math.floor(Math.random() * 3));
                effectMsg = `${battle.enemy.name}の魔法攻撃！\n`;
            } else {
                // Physical Attack Formula: ATK - DEF
                dmg = Math.max(1, battle.enemy.atk - PlayerStats.def + Math.floor(Math.random() * 3));
                effectMsg = `${battle.enemy.name}の攻撃！\n`;
            }
        }

        const dead = PlayerStats.takeDamage(dmg);
        FX.shake(150);
        if (battle.isBoss) FX.flashRed(100);

        if (dead) {
            this.checkPlayerDeath(battle);
        } else {
            battle.msg = `${effectMsg}${dmg}ダメージ！`;
            battle.finishEnemyAtk();
        }
    },

    // 逃走処理
    doFlee(battle) {
        if (battle.isBoss) {
            battle.msg = 'ボス戦からは逃げられない！';
            battle.msgTimer = 0;
            battle.waitForInput = true;
            battle.phase = 'wait_input';
            battle.nextPhase = 'command';
            return;
        }

        if (Math.random() < 0.5) {
            battle.msg = 'うまく逃げ切れた！';
            battle.phase = 'end';
        } else {
            battle.msg = '逃げられなかった！';
            battle.phase = 'enemyAttack';
            battle.enemyAttackCount = 0;
        }
        battle.msgTimer = 0;
        battle.waitForInput = true;
    },

    // 死亡判定と周回遷移の分岐
    checkPlayerDeath(battle) {
        PlayerStats.hp = Math.max(0, PlayerStats.hp);
        battle.msgTimer = 0;
        battle.waitForInput = true;

        if (WorldState.week === 1 && battle.isDemonKing) {
            // 1週目の魔王戦で敗北した場合のみ、2週目への特別な遷移を行う
            battle.phase = 'fakeDemonKingEvent';
            battle.msg = `${PlayerStats.name}の力は魔王に奪われた...\n聖剣と共に力が吸い込まれていく...`;
        } else {
            // それ以外の敗北はゲームオーバー
            battle.phase = 'defeat';
            battle.msg = '力尽きた...';
        }
    }
};