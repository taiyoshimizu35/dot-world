// ===========================================
// 戦闘コアシステム
// ===========================================
const Battle = {
    active: false, enemy: null, enemyHp: 0, phase: 'command', cur: 0, msg: '', msgTimer: 0,
    commands: ['こうげき', '魔法', 'アイテム', 'にげる'], itemCur: 0, magicCur: 0, leveledUp: false, goldGain: 0,
    isBoss: false, enemyAttackCount: 0, playerRef: null, waitForInput: false, nextPhase: null,
    currentArea: null, isTrueBoss: false, isDemonKing: false,

    start(mapId) {
        const m = Maps.get();
        const enemies = getEnemiesForMap(m, mapId);
        const id = enemies[Math.floor(Math.random() * enemies.length)];
        this.enemy = { ...EnemyData[id] };
        if (this.playerRef) Checkpoint.save(this.playerRef);
        this.startCommon();
    },

    // エリアボス戦開始（嘘/真の自動切り替え）
    startAreaBoss(area, isTrueBoss = false) {
        const prefix = isTrueBoss ? 'true' : 'fake';
        const key = `${prefix}_${area}_boss`;
        this.enemy = { ...EnemyData[key] };
        this.currentArea = area;
        this.isTrueBoss = isTrueBoss;
        this.isDemonKing = false;
        this._startBossCommon();
    },

    // 魔王戦開始
    startDemonKing(isTrueDemonKing = false) {
        const key = isTrueDemonKing ? 'true_demon_king' : 'fake_demon_king';
        this.enemy = { ...EnemyData[key] };
        this.currentArea = 'demon';
        this.isTrueBoss = isTrueDemonKing;
        this.isDemonKing = true;
        this._startBossCommon();
    },

    _startBossCommon() {
        this.enemyHp = this.enemy.hp;
        this.phase = 'wait_input'; this.nextPhase = 'command'; this.cur = 0;
        this.msg = `ボス：${this.enemy.name}が現れた！`;
        this.msgTimer = 0; this.leveledUp = false; this.goldGain = 0;
        this.isBoss = true; this.enemyAttackCount = 0;
        this.active = true; currentState = GameState.BATTLE;
        this.waitForInput = true;
        if (this.playerRef) Checkpoint.save(this.playerRef);
        FX.flash(200);
        Input.lock(300);
    },

    // 旧API互換（startBoss等はstartAreaBossへ転送）
    startBoss() { this.startAreaBoss('east', QuestFlags.metFakeDemonKing); },
    startWestBoss() { this.startAreaBoss('west', QuestFlags.metFakeDemonKing); },
    startNorthBoss() { this.startAreaBoss('north', QuestFlags.metFakeDemonKing); },
    startSouthBoss() { this.startAreaBoss('south', QuestFlags.metFakeDemonKing); },

    // 北エリア中ボス戦開始
    startNorthMiniboss(enemyId, stageId) {
        // EnemyDataから敵情報を取得
        this.enemy = { ...EnemyData[enemyId] };
        this.northMinibossStage = stageId;
        this.startCommon();
        this.isBoss = true; // 逃走不可など
    },

    startCommon() {
        if (!this.northMinibossStage) this.northMinibossStage = null; // Reset stage flag if not set
        this.enemyHp = this.enemy.hp;
        this.phase = 'wait_input'; this.nextPhase = 'command'; this.cur = 0;
        this.msg = `${this.enemy.name}が現れた！`;
        this.msgTimer = 0; this.leveledUp = false; this.goldGain = 0;
        this.isBoss = false; this.enemyAttackCount = 0;
        // フラグリセット（通常戦闘用）
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

        if (this.phase === 'start') {
            if (this.msgTimer > 60) { this.phase = 'command'; this.msg = 'コマンドを入力してください'; }
        } else if (this.phase === 'command') {
            if (Input.justPressed('ArrowUp')) this.cur = (this.cur - 2 + 4) % 4;
            if (Input.justPressed('ArrowDown')) this.cur = (this.cur + 2) % 4;
            if (Input.justPressed('ArrowLeft')) this.cur = (this.cur ^ 1);
            if (Input.justPressed('ArrowRight')) this.cur = (this.cur ^ 1);
            if (Input.interact()) {
                if (this.cur === 0) BattleActions.doPlayerAtk(this);
                else if (this.cur === 1) this.phase = 'magic';
                else if (this.cur === 2) this.phase = 'item';
                else BattleActions.doFlee(this);
            }
        } else if (this.phase === 'magic') {
            BattleMagic.updateMagic(this);
        } else if (this.phase === 'item') {
            BattleItems.updateItem(this);
        } else if (this.phase === 'enemyAttack') {
            if (this.msgTimer > 40) BattleActions.doEnemyAtk(this);
        } else if (this.phase === 'victory' || this.phase === 'bossVictory') {
            if (Input.interact()) this.end();
        } else if (this.phase === 'end') {
            // 逃走成功時
            if (Input.interact()) this.end();
        } else if (this.phase === 'defeat') {
            if (Input.interact()) {
                // 嘘魔王戦の敗北時特殊処理
                if (this.isDemonKing && !this.isTrueBoss) {
                    this.handleFakeDemonKingEnd();
                } else {
                    // 通常の敗北処理（宿屋で復活）
                    this.active = false;

                    // ゴールド半減
                    const lostGold = Math.floor(PlayerStats.gold / 2);
                    PlayerStats.gold -= lostGold;

                    // 全回復
                    PlayerStats.fullRestore();

                    FX.fadeOut(() => {
                        // Resurrect at Church (Village Inn: Map 'village', front of door at 19,16)
                        Maps.current = 'village';
                        if (window.game) {
                            const TS = GameConfig.TILE_SIZE;
                            window.game.player.x = 19 * TS;
                            window.game.player.y = 16 * TS;
                            window.game.player.dir = 2; // Face Right/door? Or 0 (Down)? Let's face Down (0).
                        }
                        // Reset encounter rate
                        WorldState.resetEncounterSteps(Maps.get().encounterRate);

                        currentState = GameState.PLAYING;
                        FX.fadeIn(() => {
                            Msg.show(`所持金が半分になった (${lostGold}G 失った)`);
                        });
                    });
                }
            }
        } else if (this.phase === 'deceptiveDeath') {
            // DECEPTION_LOGIC: 痛恨の一撃後のワンクッション
            if (Input.interact()) {
                // 追加の画面揺れ
                FX.shake(400);
                this.msg = '力尽きた...';
                this.phase = 'defeat';
                this.msgTimer = 0;
                this.waitForInput = true;
            }
        } else if (this.phase === 'fakeDemonKingEvent') {
            if (Input.interact()) {
                this.handleFakeDemonKingEnd();
            }
        }
        this.msgTimer++;
    },

    checkVictory() {
        // 嘘魔王戦の勝利時のみ特殊処理
        if (this.isDemonKing && !this.isTrueBoss) {
            this.phase = 'fakeDemonKingEvent';
            this.msg = `${this.enemy.name}を倒した！\n…しかし何かがおかしい…`;
            this.msgTimer = 0; this.waitForInput = true;
            return;
        }

        this.phase = 'victory';
        this.goldGain = this.enemy.gold + Math.floor(Math.random() * 5);
        PlayerStats.addGold(this.goldGain);
        this.msg = `${this.enemy.name}を倒した！\n${this.enemy.exp}EXP と ${this.goldGain}G を獲得！`;
        this.msgTimer = 0; this.waitForInput = true;
        this.leveledUp = PlayerStats.addExp(this.enemy.exp);
        QuestFlags.check();

        // ボス撃破フラグ更新
        if (this.isBoss && this.currentArea) {
            this.updateBossFlags();
        }

        // 北エリア中ボス撃破フラグ更新
        if (this.northMinibossStage) {
            QuestFlags.northMinibosses[this.northMinibossStage] = true;
        }

        // 真魔王撃破でエンディング
        if (this.isDemonKing && this.isTrueBoss) {
            this.phase = 'bossVictory';
        }
    },

    updateBossFlags() {
        if (this.currentArea === 'demon') return;

        if (this.isTrueBoss) {
            QuestFlags.trueBosses[this.currentArea] = true;

            // DECEPTION_LOGIC: 真・古代竜王（東の真ボス）撃破でステータス偽装解除
            if (this.currentArea === 'east' && this.enemy.name === '真・古代竜王') {
                truthFlags.status = true;
            }
        } else {
            QuestFlags.fakeBosses[this.currentArea] = true;
        }
        QuestFlags.check();
    },

    handleFakeDemonKingEnd() {
        // WEAPON_DECEPTION: 嘘魔王戦敗北 - 1週目エンディングムービー開始
        this.active = false;
        this.isDemonKing = false;
        this.isTrueBoss = false;
        this.currentArea = null;

        // 1週目エンディングムービー開始
        currentState = GameState.LOOP1_ENDING;
        Loop1Ending.init();
    },

    startAbsorptionEvent() {
        // WEAPON_DECEPTION: ステータス吸収イベント
        FX.fadeOut(() => {
            // 吸収メッセージ
            const msgs = [
                '「フッ…愚かな勇者よ…」',
                '「お前の力、全てもらい受ける！」',
            ];

            // 聖剣所持チェック
            if (gameLoop.holySwordOwned) {
                msgs.push('聖剣が禍々しい光を放ち…魔剣へと変わった！');
                gameLoop.holySwordStolen = true;
            }

            msgs.push('全ての力が吸い取られていく…！');
            msgs.push('意識が…遠のいて…');

            // 2週目開始処理
            PlayerStats.resetForWeek2();
            ShopData.reset();
            MagicShopData.reset();
            QuestFlags.reset();

            // 村に戻る
            Maps.current = 'village';
            const start = Maps.get().start;
            if (window.game) {
                window.game.player.x = start.x * GameConfig.TILE_SIZE;
                window.game.player.y = start.y * GameConfig.TILE_SIZE;
                window.game.player.dir = 0;
                window.game.player.moving = false;
            }

            // ゲーム状態をリセット
            currentState = GameState.FADE;
            FX.fadeIn(() => {
                currentState = GameState.PLAYING;
                Input.lock(100);
                // 2週目開始メッセージ
                Msg.show('……目が覚めた。\n何もかもが…違って見える…\n\n【2週目開始】');

                // [DEBUG] Managers Verification
                console.log('Week2 Started. Managers:', WorldState.managers);
                console.log('Player Coords:', window.game.player.x, window.game.player.y);
                Camera.update(window.game.player.x, window.game.player.y, Maps.get().w, Maps.get().h);
                console.log('Camera:', Camera.x, Camera.y);
            });
        });
    },

    finishEnemyAtk() {
        this.msgTimer = 0; this.waitForInput = true;
        this.enemyAttackCount++;
        if (this.isBoss && this.enemyAttackCount < 2) {
            this.phase = 'wait_input'; this.nextPhase = 'enemyAttack';
        } else {
            const statusMsgs = PlayerStats.tickStatus();
            if (statusMsgs.length > 0) this.msg += '\n' + statusMsgs.join('\n');
            this.phase = 'wait_input'; this.nextPhase = 'command';
        }
    },

    end() {
        this.active = false;
        currentState = GameState.PLAYING;
        this.phase = 'command';
        // フラグリセット
        this.isDemonKing = false;
        this.isTrueBoss = false;
        this.currentArea = null;
        Input.lock(200);
        if (this.leveledUp) Msg.show(`レベルアップ！\nLv${PlayerStats.level}になった！`);
        if (this.phase === 'bossVictory') currentState = GameState.ENDING;
    },

    render(ctx) {
        BattleRender.render(ctx, this);
    }
};