// ===========================================
// 2週目バトルコアシステム
// ===========================================
const Battle2 = {
    active: false, enemy: null, enemyHp: 0, phase: 'command', cur: 0, msg: '', msgTimer: 0,
    commands: ['こうげき', '魔法', 'アイテム', 'にげる'], itemCur: 0, magicCur: 0,
    isBoss: false, enemyAttackCount: 0, playerRef: null, waitForInput: false, nextPhase: null,
    currentArea: null, isTrueBoss: false, isDemonKing: false,

    start(mapId) {
        const m = Maps.get();
        const enemies = getEnemiesForMap2(m, mapId);
        const id = enemies[Math.floor(Math.random() * enemies.length)];
        this.enemy = { ...EnemyData2[id], type: id };
        this.startCommon();
    },

    startTrueBoss(area) {
        const key = `true_${area}_boss`;
        this.enemy = { ...EnemyData2[key], type: key };
        this.currentArea = area;
        this.isTrueBoss = true;
        this._startBossCommon();
    },

    startTrueDemonKing() {
        this.enemy = { ...EnemyData2.true_demon_king, type: 'true_demon_king' };
        this.currentArea = 'demon';
        this.isTrueBoss = true;
        this.isDemonKing = true;
        this._startBossCommon();
    },

    _startBossCommon() {
        this.enemyHp = this.enemy.hp;
        this.phase = 'wait_input'; this.nextPhase = 'command'; this.cur = 0;
        this.msg = `ボス：${this.enemy.name}が現れた！`;
        this.msgTimer = 0;
        this.isBoss = true; this.enemyAttackCount = 0;
        this.active = true; currentState = GameState.BATTLE;
        this.waitForInput = true;
        FX.flash(200);
        Input.lock(300);
    },

    startCommon() {
        this.enemyHp = this.enemy.hp;
        this.phase = 'wait_input'; this.nextPhase = 'command'; this.cur = 0;
        this.msg = `${this.enemy.name}が現れた！`;
        this.msgTimer = 0;
        this.isBoss = false; this.enemyAttackCount = 0;
        this.currentArea = null;
        this.isTrueBoss = false;
        this.isDemonKing = false;
        this.active = true; currentState = GameState.BATTLE;
        this.waitForInput = true;
        FX.flash(100);
        Input.lock(200);
    },

    update() {
        if (this.waitForInput) {
            if (Input.interact()) {
                this.waitForInput = false;
                if (this.nextPhase) { this.phase = this.nextPhase; this.nextPhase = null; }
            }
            return;
        }

        if (this.phase === 'command') {
            if (Input.justPressed('ArrowUp')) this.cur = (this.cur - 2 + 4) % 4;
            if (Input.justPressed('ArrowDown')) this.cur = (this.cur + 2) % 4;
            if (Input.justPressed('ArrowLeft')) this.cur = (this.cur ^ 1);
            if (Input.justPressed('ArrowRight')) this.cur = (this.cur ^ 1);
            if (Input.interact()) {
                if (this.cur === 0) this.doPlayerAtk();
                else if (this.cur === 1) this.phase = 'magic';
                else if (this.cur === 2) this.phase = 'item';
                else this.doFlee();
            }
        } else if (this.phase === 'partyTurn') {
            this.doPartyActions();
        } else if (this.phase === 'enemyAttack') {
            if (this.msgTimer > 40) this.doEnemyAtk();
        } else if (this.phase === 'victory') {
            if (Input.interact()) this.end();
        } else if (this.phase === 'defeat') {
            if (Input.interact()) {
                this.active = false;
                currentState = GameState.GAMEOVER;
            }
        }
        this.msgTimer++;
    },

    doPlayerAtk() {
        const dmg = Math.max(1, PlayerStats2.getTotalAtk() - this.enemy.def + Math.floor(Math.random() * 4));
        this.enemyHp -= dmg;

        FX.shake(200); FX.flash(100);
        this.msg = `${this.enemy.name}に${dmg}ダメージ！`;
        this.msgTimer = 0;
        this.waitForInput = true;

        if (this.enemyHp <= 0) {
            this.checkVictory();
        } else {
            // 仲間がいれば仲間ターンへ
            if (Party2.members.length > 0) {
                this.phase = 'partyTurn';
            } else {
                this.phase = 'enemyAttack';
            }
            this.enemyAttackCount = 0;
        }
    },

    doPartyActions() {
        let msgs = [];
        Party2.members.forEach(member => {
            if (this.enemyHp <= 0) return;

            const action = Party2.getAction(member, this);
            if (action.type === 'attack') {
                const dmg = Math.max(1, action.power - this.enemy.def);
                this.enemyHp -= dmg;
                msgs.push(`${member.name}の攻撃！${dmg}ダメージ！`);
            } else if (action.type === 'magic') {
                const dmg = Math.max(1, action.power);
                this.enemyHp -= dmg;
                member.mp -= 5;
                msgs.push(`${member.name}の魔法！${dmg}ダメージ！`);
            } else if (action.type === 'heal') {
                PlayerStats2.heal(action.power);
                msgs.push(`${member.name}が回復！HP+${action.power}`);
            }
        });

        this.msg = msgs.join('\n');
        this.msgTimer = 0;
        this.waitForInput = true;

        if (this.enemyHp <= 0) {
            this.checkVictory();
        } else {
            this.phase = 'enemyAttack';
        }
    },

    doEnemyAtk() {
        const dmg = Math.max(1, this.enemy.atk - PlayerStats2.def);
        const dead = PlayerStats2.takeDamage(dmg);

        FX.shake(150);
        this.msg = `${this.enemy.name}の攻撃！\n${dmg}ダメージ！`;
        this.msgTimer = 0;
        this.waitForInput = true;

        if (dead) {
            this.phase = 'defeat';
            this.msg = '力尽きた...';
        } else {
            this.phase = 'wait_input';
            this.nextPhase = 'command';
        }
    },

    doFlee() {
        if (this.isBoss) {
            this.msg = 'ボス戦からは逃げられない！';
            this.phase = 'wait_input';
            this.nextPhase = 'command';
        } else if (Math.random() < 0.5) {
            this.msg = 'うまく逃げ切れた！';
            this.phase = 'victory';  // 報酬なしで終了
            this.enemy.exp = 0;
            this.enemy.gold = 0;
        } else {
            this.msg = '逃げられなかった！';
            this.phase = 'enemyAttack';
        }
        this.msgTimer = 0;
        this.waitForInput = true;
    },

    checkVictory() {
        this.phase = 'victory';
        const goldGain = this.enemy.gold;
        PlayerStats2.addGold(goldGain);

        // 内部exp加算
        const grew = PlayerStats2.addHiddenExp(this.enemy.exp);
        Party2.addExpToAll(this.enemy.exp);

        // 討伐カウント
        QuestSystem2.recordKill(this.enemy.type);

        this.msg = `${this.enemy.name}を倒した！\n${goldGain}G を獲得！`;
        if (grew) this.msg += '\n（力が少し強くなった）';

        this.msgTimer = 0;
        this.waitForInput = true;

        // ボス撃破フラグ
        if (this.isTrueBoss && this.currentArea) {
            WorldState2.trueBosses[this.currentArea] = true;
        }
        if (this.isDemonKing) {
            WorldState2.trueDemonKingDefeated = true;
        }
    },

    end() {
        this.active = false;
        currentState = GameState.PLAYING;
        this.phase = 'command';
        this.isDemonKing = false;
        this.isTrueBoss = false;
        this.currentArea = null;
        Input.lock(200);
    },

    render(ctx) {
        BattleRender.render(ctx, this);
    }
};
