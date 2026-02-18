import { GameConfig, GameState } from '../../../constants.js';
import { Input } from '../../../core/input.js';
import { FX } from '../../../core/effects.js';
// import { Maps } from '../maps/loader.js'; // Removed duplicate
import { Maps } from '../../../loop1/systems/maps/manager.js';
import { PlayerStats2 } from '../../player.js';
import { Party2 } from '../../party.js';
import { BattleRender2 } from './render.js';
import { EnemyData2, getEnemiesForMap2 } from '../../data/enemies.js';

import { WorldState } from '../../../loop1/world.js'; // Context
import { Inventory2 } from '../../inventory.js';
import { ItemData2 } from '../../data/items.js';

// ===========================================
// 2週目バトルコアシステム
// ===========================================
export const Battle2 = {
    active: false, enemies: [], phase: 'command', cur: 0, msg: '', msgTimer: 0,
    commands: ['こうげき', 'スキル', 'アイテム', 'にげる'], itemCur: 0, magicCur: 0,
    isBoss: false, enemyAttackCount: 0, playerRef: null, waitForInput: false, nextPhase: null,
    currentArea: null, isTrueBoss: false, isDemonKing: false,
    targetIndex: 0, // Currently selected target for Player
    partyTurnIndex: 0, // Which member is inputting command
    partyCommands: [], // Store selected commands { member, action, targetIndex }
    partyTargetIndex: 0, // Target selection for Companion

    init(worldState) {
        this.active = false;
        this.enemies = [];
        this.phase = 'command';
        this.msg = '';
        this.currentArea = null;
        this.isTrueBoss = false;
        this.isDemonKing = false;
        this.partyActionQueue = null;
        this.currentPartyMember = null;
        this.partyTurnIndex = 0;
        this.partyCommands = [];
    },

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
        this.msgTimer++;

        if (this.waitForInput) {
            // Prevent instant skipping (anti-mash)
            if (this.msgTimer < 15) return;

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
                if (this.cur === 0) {
                    // Attack -> Select Target
                    this.phase = 'playerTarget';
                    this.targetIndex = 0;
                    // Skip dead enemies logic already in core... checking usage
                    // Actually, let's just use the existing logic or simple init
                    // The while loop handles skipping on Next/Prev, but careful with initial 0 if 0 is dead.
                    while (this.targetIndex < this.enemies.length && this.enemies[this.targetIndex].hp <= 0) {
                        this.targetIndex++;
                    }
                    if (this.targetIndex >= this.enemies.length) this.targetIndex = 0;
                }
                else if (this.cur === 1) this.phase = 'magic';
                else if (this.cur === 2) this.phase = 'item';
                else this.doFlee();
            }
        } else if (this.phase === 'playerTarget') {
            this.handlePlayerTargetInput();
        } else if (this.phase === 'magic') {
            // Player Magic Placeholder
            this.msg = 'まだ魔法は覚えられない！';
            this.msgTimer = 0;
            this.waitForInput = true;
            this.nextPhase = 'command';
            this.phase = 'wait_input';
        } else if (this.phase === 'item') {
            // Player Item Placeholder
            this.msg = '道具はまだ持っていない！';
            this.msgTimer = 0;
            this.waitForInput = true;
            this.nextPhase = 'command';
            this.phase = 'wait_input';
        } else if (this.phase === 'partyCommand') {
            this.handlePartyCommandInput();
        } else if (this.phase === 'partyTarget') {
            this.handlePartyTargetInput();
        } else if (this.phase === 'partyTurn') {
            this.doPartyActions();
        } else if (this.phase === 'enemyAttack') {
            if (this.msgTimer > 40) this.doEnemyAtk();
        } else if (this.phase === 'victory') {
            this.end();
        } else if (this.phase === 'defeat') {
            this.active = false;
            // Loop 1 WorldState usage
            if (WorldState) WorldState.changeState('gameover');
        }
        // Removed this.msgTimer++ from bottom
    },

    handlePlayerTargetInput() {
        // Simple Left/Right navigation for enemies
        const count = this.enemies.length;
        if (count === 0) return;

        // Safety check: specific case where all enemies might be dead but phase didn't switch
        if (this.enemies.every(e => e.hp <= 0)) {
            this.checkVictory();
            return;
        }

        if (Input.justPressed('ArrowRight')) {
            let start = this.targetIndex;
            do {
                this.targetIndex = (this.targetIndex + 1) % count;
            } while (this.enemies[this.targetIndex].hp <= 0 && this.targetIndex !== start);
        }
        if (Input.justPressed('ArrowLeft')) {
            let start = this.targetIndex;
            do {
                this.targetIndex = (this.targetIndex - 1 + count) % count;
            } while (this.enemies[this.targetIndex].hp <= 0 && this.targetIndex !== start);
        }

        if (Input.interact()) {
            this.doPlayerAtk();
        }
        if (Input.cancel()) {
            this.phase = 'command';
        }
    },

    doPlayerAtk() {
        // Use selected target
        let target = this.enemies[this.targetIndex];
        if (!target || target.hp <= 0) {
            // Fallback
            target = this.enemies.find(e => e.hp > 0);
        }

        if (!target) {
            this.checkVictory();
            return;
        }

        const dmg = Math.floor(Math.max(1, PlayerStats2.getTotalAtk() - target.def + Math.random() * 4));
        target.hp = Math.floor(target.hp - dmg);

        FX.shake(200); FX.flash(100);
        this.msg = `${target.name}に${dmg}ダメージ！`;
        this.msgTimer = 0;
        this.waitForInput = true;

        if (this.enemies.every(e => e.hp <= 0)) {
            this.checkVictory();
        } else {
            // 仲間がいれば仲間コマンド入力へ
            if (Party2.members.length > 0) {
                this.phase = 'partyCommand';
                this.partyTurnIndex = 0;
                this.partyCommands = [];
                // Skip dead members? 
                while (this.partyTurnIndex < Party2.members.length && Party2.members[this.partyTurnIndex].hp <= 0) {
                    this.partyTurnIndex++;
                }
                if (this.partyTurnIndex >= Party2.members.length) {
                    this.phase = 'partyTurn'; // All dead? Just skip to execution (empty) or enemy turn
                    this.partyActionQueue = [];
                } else {
                    this.msg = `${Party2.members[this.partyTurnIndex].name}はどうする？`;
                    this.cur = 0; // Reset cursor for command selection
                }
            } else {
                this.phase = 'enemyAttack';
            }
            this.enemyAttackCount = 0;
        }
    },

    doPartyActions() {
        if (!this.partyActionQueue) {
            // Init Queue
            this.partyActionQueue = [...Party2.members];
            this.currentPartyMember = null;
        }

        if (this.waitForInput) {
            // Waiting for previous message to clear? 
            // Actually input.interact clears waitForInput in update().
            return;
        }

        // If no member currently acting, get next
        if (!this.currentPartyMember) {
            // Check Victory before getting next member or ending turn
            if (this.enemies.every(e => e.hp <= 0)) {
                this.checkVictory();
                return;
            }

            if (this.partyActionQueue.length === 0) {
                // End of Party Turn
                this.partyActionQueue = null;
                this.phase = 'enemyAttack';
                this.enemyAttackCount = 0;
                return;
            }
            this.currentPartyMember = this.partyActionQueue.shift();
        }

        const member = this.currentPartyMember.member; // Access the actor property since queue item is command
        if (member.hp <= 0) {
            this.currentPartyMember = null; // Skip dead
            return;
        }

        // Execute Action
        if (this.enemies.every(e => e.hp <= 0)) {
            this.checkVictory();
            return;
        }

        // Get saved command info
        // member is this.currentPartyMember (which is { member, action, targetIndex })
        // Wait, partyActionQueue stores { member, action, targetIndex } objects now.
        // But above I assigned this.currentPartyMember = this.partyActionQueue.shift();
        // and then assigned const member = this.currentPartyMember;
        // WRONG -> this.currentPartyMember IS the command object now.
        // Let's fix variable names.

        const cmd = this.currentPartyMember;
        const actor = cmd.member;

        if (actor.hp <= 0) {
            this.currentPartyMember = null;
            return;
        }

        const action = cmd.action;
        let target = null;
        if (cmd.targetIndex !== null && cmd.targetIndex !== undefined) {
            target = this.enemies[cmd.targetIndex];
            if (target && target.hp <= 0) target = null; // Target dead
        }

        // Convert 'target' index to actual target or fallback (dead target logic)
        if (!target) {
            target = this.enemies.find(e => e.hp > 0);
        }
        if (!target) { this.checkVictory(); return; }


        let msg = '';
        if (action.type === 'attack') {
            const dmg = Math.floor(Math.max(1, action.power - target.def + Math.random() * 2));
            // Critical check?
            target.hp = Math.floor(target.hp - dmg);
            msg = `${actor.name}の攻撃！${target.name}に${dmg}ダメージ！`;
            FX.shake(100);
        } else if (action.type === 'magic') {
            // Skill placeholder
            if (actor.sp >= 5) {
                const dmg = Math.max(1, action.power);
                target.hp -= dmg;
                actor.sp -= 5;
                msg = `${actor.name}のスキル攻撃！${target.name}に${dmg}ダメージ！`;
                FX.flash(100);
            } else {
                msg = `${actor.name}はスキルを使おうとしたがSPが足りない！`;
            }
        } else if (action.type === 'item') {
            // Use Item
            // Target is 'target' (enemy) or Self/Ally? 
            // Currently battle commands target Enemies by default in this structure.
            // Items usually target allies.
            // We need to support ally targeting for items.
            // For now, if item is healing, assume self-use or auto-target injured?
            // Simplified: Use on Self (actor)
            const res = Inventory2.useItem(action.item, actor);
            if (res.success) {
                msg = `${actor.name}は${ItemData2[action.item].name}を使った！\n${res.msg}`;
            } else {
                msg = `${actor.name}は${ItemData2[action.item].name}を使おうとしたが、効果がなかった！`;
            }
        } else if (action.type === 'flee') {
            // Flee attempt (Party Member)
            if (this.isBoss) {
                this.msg = `${actor.name}は逃げようとした！\nしかし回り込まれてしまった！`; // Boss fail
                this.phase = 'enemyAttack'; // Turn over
                this.partyActionQueue = []; // Clear remaining? Already cleared on input, but just in case
            } else if (Math.random() < 0.5) {
                this.msg = `${actor.name}は逃げ出した！`;
                this.phase = 'victory';
                this.enemies = [];
                return;
            } else {
                this.msg = `${actor.name}は逃げようとした！\nしかし回り込まれてしまった！`;
                // Fail -> Enemy Turn
                this.phase = 'enemyAttack';
                this.enemyAttackCount = 0;
                this.partyActionQueue = []; // Ensure no more actions
            }
        } else {
            msg = `${actor.name}は様子を見ている。`;
        }

        this.msg = msg;
        this.msgTimer = 0;
        this.waitForInput = true;

        // Done with this member
        this.currentPartyMember = null;

        // If enemies dead, next update will catch it in checkVictory check inside next call or here
        if (this.enemies.every(e => e.hp <= 0)) {
            // Wait for input then check victory
        }
    },

    doEnemyAtk() {
        let damageTaken = false;
        let totalDmg = 0;
        let msgs = [];

        this.enemies.forEach(enemy => {
            if (enemy.hp <= 0) return;

            // Target Selection (Player or Companion)
            const targets = [{ name: PlayerStats2.name, isPlayer: true, stats: PlayerStats2 }];
            Party2.members.forEach(m => targets.push({ name: m.name, isPlayer: false, stats: m }));

            // Filter dead targets? No, they can be hit but won't take damage or different msg?
            // Usually valid targets only.
            const validTargets = targets.filter(t => t.stats.hp > 0);
            if (validTargets.length === 0) return;

            const target = validTargets[Math.floor(Math.random() * validTargets.length)];
            const dmg = Math.max(1, enemy.atk - target.stats.def);

            let dead = false;
            if (target.isPlayer) {
                dead = PlayerStats2.takeDamage(dmg);
            } else {
                target.stats.hp = Math.max(0, target.stats.hp - dmg);
                if (target.stats.hp === 0) dead = true;
            }

            totalDmg += dmg;
            msgs.push(`${enemy.name}の攻撃！${target.name}に${dmg}ダメージ！`);
            if (dead) msgs.push(`${target.name}は力尽きた...`);

            damageTaken = true;
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
        } else if (Math.random() < 0.8) { // Player has high flee chance?
            this.msg = 'うまく逃げ切れた！';
            this.phase = 'victory';  // 報酬なしで終了
            this.enemies = []; // Clear
        } else {
            this.msg = '逃げられなかった！';
            // Fail means turn ends -> Enemy Attack
            this.phase = 'enemyAttack';
            this.enemyAttackCount = 0;
        }
        this.msgTimer = 0;
        this.waitForInput = true;
    },

    handlePartyCommandInput() {
        if (Input.justPressed('ArrowUp')) this.cur = (this.cur - 2 + 4) % 4;
        if (Input.justPressed('ArrowDown')) this.cur = (this.cur + 2) % 4;
        if (Input.justPressed('ArrowLeft')) this.cur = (this.cur ^ 1);
        if (Input.justPressed('ArrowRight')) this.cur = (this.cur ^ 1);

        if (Input.interact()) {
            const member = Party2.members[this.partyTurnIndex];

            if (this.cur === 0) {
                // こうげき
                this.phase = 'partyTarget';
                this.partyTargetIndex = 0;
                while (this.partyTargetIndex < this.enemies.length && this.enemies[this.partyTargetIndex].hp <= 0) {
                    this.partyTargetIndex++;
                }
                if (this.partyTargetIndex >= this.enemies.length) this.partyTargetIndex = 0;
            } else if (this.cur === 1) {
                // スキル
                this.phase = 'partyTarget';
                this.partyTargetIndex = 0;
                while (this.partyTargetIndex < this.enemies.length && this.enemies[this.partyTargetIndex].hp <= 0) {
                    this.partyTargetIndex++;
                }
            } else if (this.cur === 2) {
                // どうぐ
                if (Inventory2.items.length === 0) {
                    this.msg = '道具を何も持っていない！';
                    this.msgTimer = 0;
                    this.waitForInput = true;
                    this.phase = 'wait_input';
                    this.nextPhase = 'partyCommand';
                } else {
                    // Enter Item Selection Phase (Simplification: just use first consumable for now, 
                    // or better, create a 'partyItem' phase? 
                    // Given time constraints, let's use first available consumable or fail)
                    const consumable = Inventory2.items.find(id => ItemData2[id] && ItemData2[id].type === 'consumable');
                    if (consumable) {
                        // Auto-select first consumable
                        // Support for selection requires new phase.
                        this.pushPartyCommand({ type: 'item', item: consumable }, null);
                    } else {
                        this.msg = '使える道具がない！';
                        this.msgTimer = 0;
                        this.waitForInput = true;
                        this.phase = 'wait_input';
                        this.nextPhase = 'partyCommand';
                    }
                }
            } else {
                // にげる (全員の行動をスキップして逃走試行)
                this.partyActionQueue = []; // Clear other actions
                this.partyCommands = []; // Clear
                // Add Flee action for this member (or generic)
                // We'll treat it as this member initiating the flee
                this.partyActionQueue.push({ member, action: { type: 'flee' }, targetIndex: null });

                // Immediately go to execution
                this.phase = 'partyTurn';
                this.partyTurnIndex = Party2.members.length; // Stop input loop
            }
        }
    },

    handlePartyTargetInput() {
        // Simple Left/Right navigation for enemies
        const count = this.enemies.length;
        if (count === 0) return;

        // Safety check
        if (this.enemies.every(e => e.hp <= 0)) {
            this.checkVictory(); // Or just exit phase
            return;
        }

        if (Input.justPressed('ArrowRight')) {
            let start = this.partyTargetIndex;
            do {
                this.partyTargetIndex = (this.partyTargetIndex + 1) % count;
            } while (this.enemies[this.partyTargetIndex].hp <= 0 && this.partyTargetIndex !== start);
        }
        if (Input.justPressed('ArrowLeft')) {
            let start = this.partyTargetIndex;
            do {
                this.partyTargetIndex = (this.partyTargetIndex - 1 + count) % count;
            } while (this.enemies[this.partyTargetIndex].hp <= 0 && this.partyTargetIndex !== start);
        }

        if (Input.interact()) {
            let actionType = (this.cur === 0) ? 'attack' : 'magic';
            const member = Party2.members[this.partyTurnIndex];
            let action = { type: actionType, power: (actionType === 'attack' ? member.atk : member.matk * 2) };

            this.pushPartyCommand(action, this.partyTargetIndex);
        }

        if (Input.cancel()) {
            this.phase = 'partyCommand';
        }
    },

    pushPartyCommand(action, targetIdx) {
        const member = Party2.members[this.partyTurnIndex];
        this.partyCommands.push({ member, action, targetIndex: targetIdx });

        // Next member
        this.partyTurnIndex++;
        while (this.partyTurnIndex < Party2.members.length && Party2.members[this.partyTurnIndex].hp <= 0) {
            this.partyTurnIndex++;
        }

        if (this.partyTurnIndex >= Party2.members.length) {
            this.phase = 'partyTurn';
            this.partyActionQueue = this.partyCommands;
            this.currentPartyMember = null;
        } else {
            this.phase = 'partyCommand';
            this.msg = `${Party2.members[this.partyTurnIndex].name}はどうする？`;
            this.cur = 0;
        }
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
            WorldState.world2.trueBosses[this.currentArea] = true;
        }
        if (this.isDemonKing) {
            WorldState.world2.trueDemonKingDefeated = true;
        }
    },

    end() {
        this.active = false;
        if (WorldState) WorldState.changeState('playing');
        this.phase = 'command';
        this.isDemonKing = false;
        this.isTrueBoss = false;
        this.currentArea = null;

        // Reset Logic State
        this.msg = '';
        this.enemies = [];
        this.partyCommands = [];
        this.partyActionQueue = null;
        this.currentPartyMember = null;
        this.msgTimer = 0;

        Input.lock(200);
    },

    render(ctx) {
        BattleRender2.render(ctx, this);
    }
};
