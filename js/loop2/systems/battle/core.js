import { GameConfig, GameState } from '../../../constants.js';
import { Input } from '../../../core/input.js';
import { FX } from '../../../core/effects.js';
// import { Maps } from '../maps/loader.js'; // Removed duplicate
import { Maps } from '../../../loop1/systems/maps/manager.js';
import { PlayerStats2 } from '../../player.js';
import { Party2 } from '../../party.js';
import { BattleRender2 } from './render.js';
import { EnemyData2, getEnemiesForMap2 } from '../../data/enemies.js';
import { WorldState2 } from '../../world.js';
import { WorldState } from '../../../loop1/world.js'; // Context
// import { Inv } from '../../loop1/systems/inventory.js'; // If Inv is used (line 212)

// ===========================================
// 2週目バトルコアシステム
// ===========================================
export const Battle2 = {
    active: false, enemies: [], phase: 'command', cur: 0, msg: '', msgTimer: 0,
    commands: ['こうげき', 'スキル', 'アイテム', 'にげる'], itemCur: 0, magicCur: 0,
    isBoss: false, enemyAttackCount: 0, playerRef: null, waitForInput: false, nextPhase: null,
    currentArea: null, isTrueBoss: false, isDemonKing: false,
    targetIndex: 0, // Currently selected target

    start(mapId) {
        // EnemyData2 is imported
        const m = Maps.get();
        const enemiesList = getEnemiesForMap2(m, mapId);
        if (!enemiesList || enemiesList.length === 0) {
            console.warn('No enemies found for map', mapId);
            return;
        }

        this.enemies = [];
        // Spawn 1-3 enemies for testing multiple support
        const count = Math.floor(Math.random() * 2) + 1; // 1 or 2
        for (let i = 0; i < count; i++) {
            const id = enemiesList[Math.floor(Math.random() * enemiesList.length)];
            const data = EnemyData2[id];
            if (data) {
                this.enemies.push({ ...data, type: id, maxHp: data.hp, id: i });
            }
        }
        this.startCommon();
    },

    startTrueBoss(area) {
        const key = `true_${area}_boss`;
        this.enemies = [{ ...EnemyData2[key], type: key, maxHp: EnemyData2[key].hp, id: 0 }];
        this.currentArea = area;
        this.isTrueBoss = true;
        this._startBossCommon();
    },

    startTrueDemonKing() {
        const key = 'true_demon_king';
        this.enemies = [{ ...EnemyData2[key], type: key, maxHp: EnemyData2[key].hp, id: 0 }];
        this.currentArea = 'demon';
        this.isTrueBoss = true;
        this.isDemonKing = true;
        this._startBossCommon();
    },

    _startBossCommon() {
        this.phase = 'wait_input'; this.nextPhase = 'command'; this.cur = 0;
        this.msg = `ボス：${this.enemies[0].name}が現れた！`;
        this.msgTimer = 0;
        this.isBoss = true; this.enemyAttackCount = 0;
        this.active = true;
        if (WorldState) WorldState.changeState('battle'); // currentState = GameState.BATTLE;
        this.waitForInput = true;
        FX.flash(200);
        Input.lock(300);
    },

    startCommon() {
        this.phase = 'wait_input'; this.nextPhase = 'command'; this.cur = 0;
        const name = this.enemies.length > 1 ? '魔物たち' : this.enemies[0].name;
        this.msg = `${name}が現れた！`;
        this.msgTimer = 0;
        this.isBoss = false; this.enemyAttackCount = 0;
        this.currentArea = null;
        this.isTrueBoss = false;
        this.isDemonKing = false;
        this.active = true;
        if (WorldState) WorldState.changeState('battle'); // currentState = GameState.BATTLE;
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
                if (WorldState) WorldState.changeState('gameover'); // currentState = GameState.GAMEOVER;
            }
        }
        this.msgTimer++;
    },

    doPlayerAtk() {
        // Auto-target first living enemy for now
        const target = this.enemies.find(e => e.hp > 0);
        if (!target) {
            this.checkVictory();
            return;
        }

        const dmg = Math.max(1, PlayerStats2.getTotalAtk() - target.def + Math.floor(Math.random() * 4));
        target.hp -= dmg;

        FX.shake(200); FX.flash(100);
        this.msg = `${target.name}に${dmg}ダメージ！`;
        this.msgTimer = 0;
        this.waitForInput = true;

        if (this.enemies.every(e => e.hp <= 0)) {
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
            if (this.enemies.every(e => e.hp <= 0)) return;

            const target = this.enemies.find(e => e.hp > 0);
            if (!target) return;

            const action = Party2.getAction(member, this); // Might need update if getAction uses this.enemy
            if (action.type === 'attack') {
                const dmg = Math.max(1, action.power - target.def);
                target.hp -= dmg;
                msgs.push(`${member.name}の攻撃！${dmg}ダメージ！`);
            } else if (action.type === 'magic') {
                const dmg = Math.max(1, action.power);
                target.hp -= dmg;
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

        if (this.enemies.every(e => e.hp <= 0)) {
            this.checkVictory();
        } else {
            this.phase = 'enemyAttack';
        }
    },

    doEnemyAtk() {
        let damageTaken = false;
        let totalDmg = 0;
        let msgs = [];

        this.enemies.forEach(enemy => {
            if (enemy.hp <= 0) return;
            const dmg = Math.max(1, enemy.atk - PlayerStats2.def);
            const dead = PlayerStats2.takeDamage(dmg);
            totalDmg += dmg;
            msgs.push(`${enemy.name}の攻撃！${dmg}ダメージ！`);
            damageTaken = true;
            if (dead) return;
        });

        if (damageTaken) {
            FX.shake(150);
            this.msg = msgs.join('\n');
        } else {
            this.msg = '敵の攻撃！ミス！';
        }

        this.msgTimer = 0;
        this.waitForInput = true;

        if (PlayerStats2.hp <= 0) {
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
        } else if (Math.random() < 0.8) {
            this.msg = 'うまく逃げ切れた！';
            this.phase = 'victory';  // 報酬なしで終了
            this.enemies = []; // Clear
        } else {
            this.msg = '逃げられなかった！';
            this.phase = 'enemyAttack';
        }
        this.msgTimer = 0;
        this.waitForInput = true;
    },

    checkVictory() {
        this.phase = 'victory';

        let totalGold = 0;
        let totalExp = 0;
        let dropItems = [];

        this.enemies.forEach(e => {
            totalGold += e.gold;
            totalExp += e.exp;
            if (e.drop && Math.random() < e.drop.rate) {
                dropItems.push(e.drop.item);
            }
        });

        PlayerStats2.addGold(totalGold);

        // 内部exp加算
        const grew = PlayerStats2.addHiddenExp(totalExp);
        Party2.addExpToAll(totalExp);

        this.msg = `敵を一掃した！\n${totalGold}G を獲得！`;
        if (grew) this.msg += '\n（力が少し強くなった）';

        dropItems.forEach(item => {
            this.msg += `\n${item}を手に入れた！`;
        });

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
        if (window.game && window.game.stateMachine) window.game.stateMachine.change('playing'); // currentState = GameState.PLAYING;
        this.phase = 'command';
        this.isDemonKing = false;
        this.isTrueBoss = false;
        this.currentArea = null;
        Input.lock(200);
    },

    render(ctx) {
        BattleRender2.render(ctx, this);
    }
};
