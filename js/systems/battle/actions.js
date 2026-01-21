import { world } from '../../state/world.js';

// ===========================================
// 戦闘アクション
// ===========================================
const BattleActions = {
    doPlayerAtk(battle) {
        // 1周目の魔王戦のみ発生する自傷ギミック
        // ※battle.enemy.isDemonKing などのフラグがある想定
        if (world.loopCount === 0 && battle.enemy.id === 'fake_demon_king') {
            const dmg = Math.max(5, Math.floor(PlayerStats.atk * 0.8)); 
            PlayerStats.hp -= dmg;
            
            FX.shake(500); FX.flashRed(300);
            battle.msg = `今の勇者では魔王にダメージを与えられない！\n${PlayerStats.name}は${dmg}のダメージを受けた！`;
            
            this.checkPlayerDeath(battle);
            return;
        }

        // 通常のダメージ計算（1周目の雑魚戦、中ボス戦、および2周目の全戦闘）
        const dmg = Math.max(1, PlayerStats.atk - battle.enemy.def + Math.floor(Math.random() * 4));
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

    // 敵の攻撃ロジック（嘘を排除した通常版）
    doEnemyAtk(battle) {
        let dmg = 0;
        let effectMsg = '';

        // 特殊行動（クリスタル・ゴーレム等）
        if (battle.enemy.name === 'クリスタル・ゴーレム' && PlayerStats.isDefending) {
            dmg = Math.floor(battle.enemy.atk * 1.5);
            effectMsg = `重い一撃が防御を貫く！ `;
        } 
        else {
            // 通常・魔法攻撃の計算
            dmg = Math.max(1, battle.enemy.atk - PlayerStats.def + Math.floor(Math.random() * 3));
            if (PlayerStats.isDefending) dmg = Math.floor(dmg * 0.5);
            effectMsg = `${battle.enemy.name}の攻撃！\n`;
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

    // 死亡判定と周回遷移の分岐
    checkPlayerDeath(battle) {
        PlayerStats.hp = Math.max(0, PlayerStats.hp);
        battle.msgTimer = 0;
        battle.waitForInput = true;

        if (world.loopCount === 0 && (battle.enemy.id === 'demon_king' || battle.enemy.isDemonKing)) {
            // 1周目の魔王戦で敗北した場合のみ、2周目への特別な遷移を行う
            battle.phase = 'transitionToLoop2'; 
            battle.msg = `${PlayerStats.name}の力は魔王に奪われた...\n聖剣と共に力が吸い込まれていく...`;
        } else {
            // それ以外の敗北（1周目の道中、2周目の全敗北）はゲームオーバー
            battle.phase = 'defeat';
            battle.msg = '力尽きた...';
        }
    }
};