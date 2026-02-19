import { GameConfig, GameState } from '../../../constants.js';
import { Input } from '../../../core/input.js';
import { FX } from '../../../core/effects.js';
import { Msg } from '../../../core/message.js';
import { Camera } from '../../../core/camera.js';
// import { WorldState } from '../../world.js'; // Dependency Injected
import { PlayerStats } from '../../player.js';
import { QuestSystem as QuestFlags } from '../../quest.js';
import { Enemies as EnemyData, getEnemiesForMap } from '../../data/enemies.js';
import { ShopData, MagicShopData } from '../../data/items.js';
import { Checkpoint } from '../../checkpoint.js';
import { Maps } from '../maps/manager.js';
import { Loop1Ending } from '../loop1_ending.js';
import { BattleActions } from './actions.js';
import { BattleSkills } from './skills.js';
import { BattleItems } from './items.js';
import { BattleRender } from './render.js';

// ===========================================
// 戦闘コアシステム
// ===========================================
export const Battle = {
    active: false, enemy: null, enemyHp: 0, phase: 'command', cur: 0, msg: '', msgTimer: 0,
    commands: ['こうげき', '魔法', 'アイテム', 'にげる'], itemCur: 0, magicCur: 0, leveledUp: false, goldGain: 0,
    isBoss: false, enemyAttackCount: 0, playerRef: null, waitForInput: false, nextPhase: null,
    currentArea: null, isTrueBoss: false, isDemonKing: false,
    northMinibossStage: null,
    _worldState: null,

    init(worldState) {
        this._worldState = worldState;
    },

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
        this.active = true;
        const game = this._worldState ? this._worldState.game : null;
        if (game && game.stateMachine) game.stateMachine.change('battle'); // currentState = GameState.BATTLE;
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
        this.skillCur = 0; this.itemCur = 0; // Reset cursors
        this.msg = `${this.enemy.name}が現れた！`;
        this.msgTimer = 0; this.leveledUp = false; this.goldGain = 0;
        this.isBoss = false; this.enemyAttackCount = 0;
        // フラグリセット（通常戦闘用）
        this.currentArea = null;
        this.isTrueBoss = false;
        this.isDemonKing = false;
        this.active = true;
        const game = this._worldState ? this._worldState.game : null;
        if (game && game.stateMachine) game.stateMachine.change('battle'); // currentState = GameState.BATTLE;
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
                else if (this.cur === 1) this.phase = 'skill'; // magic -> skill
                else if (this.cur === 2) this.phase = 'item';
                else BattleActions.doFlee(this);
            }
        } else if (this.phase === 'skill') { // magic -> skill
            BattleSkills.updateSkills(this); // BattleMagic -> BattleSkills
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
                // Resurrect at Church (Village Inn: Map 'village', front of door at 19,16)
                Maps.current = 'village';
                const game = this._worldState ? this._worldState.game : null;
                if (game) {
                    const TS = GameConfig.TILE_SIZE;
                    game.player.x = 19 * TS;
                    game.player.y = 16 * TS;
                    game.player.dir = 2; // Face Right/door? Or 0 (Down)? Let's face Down (0).
                }
                // Reset encounter rate
                if (this._worldState) this._worldState.resetEncounterSteps(Maps.get().encounterRate);

                // Calculate lost gold
                const lostGold = Math.floor(PlayerStats.gold / 2);
                PlayerStats.gold -= lostGold;

                if (game && game.stateMachine) game.stateMachine.change('playing'); // currentState = GameState.PLAYING;
                FX.fadeIn(() => {
                    Msg.show(`所持金が半分になった (${lostGold}G 失った)`);
                });
            }
        } else if (this.phase === 'deceptiveDeath') {
            // Determine if we need this or just remove for Loop 1 simple
            // Keeping as stub or removing? User said "Simple game".
            // I will remove logic but keep phase check to avoid error if set
            this.phase = 'defeat';
        } else if (this.phase === 'fakeDemonKingEvent') {
            // Convert to simple ending
            const game = this._worldState ? this._worldState.game : null;
            if (game && game.stateMachine) game.stateMachine.change('loop1_ending');
        }
        this.msgTimer++;
    },

    checkVictory() {
        this.phase = 'victory';

        // Exp/Gold Calculation
        let goldMult = 1.0;
        let expMult = 1.0;
        const acc = PlayerStats.equipment.accessory;
        if (acc === '幸運のアミュレット') goldMult = 1.5;
        if (acc === '金色のアミュレット') goldMult = 3.0;
        if (acc === '達人のアミュレット') expMult = 2.0;
        if (acc === '戦神のアミュレット') expMult = 5.0;

        this.goldGain = Math.floor((this.enemy.gold + Math.floor(Math.random() * 5)) * goldMult);
        PlayerStats.addGold(this.goldGain);

        const expGain = Math.floor(this.enemy.exp * expMult);
        this.msg = `${this.enemy.name}を倒した！\n${expGain}EXP と ${this.goldGain}G を獲得！`;
        this.msgTimer = 0; this.waitForInput = true;
        this.leveledUp = PlayerStats.addExp(expGain);
        QuestFlags.check();

        // ボス撃破フラグ更新
        if (this.isBoss && this.currentArea) {
            this.updateBossFlags();
        }

        if (this.northMinibossStage) {
            QuestFlags.northMinibosses[this.northMinibossStage] = true;
        }

        // 魔王撃破でエンディング (Flagging demon logic separately if needed)
        // ...
    },

    updateBossFlags() {
        if (this.currentArea === 'demon') return;
        QuestFlags.bosses[this.currentArea] = true;
        QuestFlags.check();
    },

    handleFakeDemonKingEnd() {
        // WEAPON_DECEPTION: 嘘魔王戦敗北 - 1週目エンディングムービー開始
        this.active = false;
        this.isDemonKing = false;
        this.isTrueBoss = false;
        this.currentArea = null;

        // 1週目エンディングムービー開始
        const game = this._worldState ? this._worldState.game : null;
        if (game && game.stateMachine) game.stateMachine.change('loop1_ending'); // currentState = GameState.LOOP1_ENDING;
        Loop1Ending.init();
    },

    /*
    // DEAD CODE? Replaced by Loop1Ending logic
    startAbsorptionEvent() {
        // WEAPON_DECEPTION: ステータス吸収イベント
        FX.fadeOut(() => {
            // ... (Logic moved to Loop1Ending or unused)
            // If we need this logic again, we should use WorldState and fix 'msgs'
        });
    },
    */

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
        const game = this._worldState ? this._worldState.game : null;
        if (game && game.stateMachine) game.stateMachine.change('playing'); // currentState = GameState.PLAYING;
        this.phase = 'command';

        // Reset Battle Status
        PlayerStats.resetBattleStatus();

        // フラグリセット
        this.isDemonKing = false;
        this.isTrueBoss = false;
        this.currentArea = null;
        Input.lock(200);
        if (this.leveledUp) Msg.show(`レベルアップ！\nLv${PlayerStats.level}になった！`);
        if (this.phase === 'bossVictory') {
            const game = this._worldState ? this._worldState.game : null;
            if (game && game.stateMachine) game.stateMachine.change('ending'); // currentState = GameState.ENDING;
        }
    },

    render(ctx) {
        BattleRender.render(ctx, this);
    }
};