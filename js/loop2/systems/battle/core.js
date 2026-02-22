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
import { QuestSystem2, StoryFlags } from '../../quest.js';
import { SkillData2 } from '../../data/skills.js';

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

    skillCur: 0, // Skill Menu Cursor
    skillOffset: 0, // Scroll Offset
    selectedSkillId: null, // Temporary storage

    // New Queue System
    turnQueue: [], // Order of execution
    currentExecutor: null, // Acting entity

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
        this.turnQueue = [];
        this.turnQueue = [];
        this.currentExecutor = null;
        this.skillCur = 0;
        this.skillOffset = 0;
        this.selectedSkillId = null;
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
        this.turnCount = 1;
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
        this.turnCount = 1;
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
                else if (this.cur === 1) {
                    // Magic/Skill
                    const skills = PlayerStats2.skills || [];
                    if (skills.length === 0) {
                        this.msg = 'スキルをまだ覚えていない！';
                        this.msgTimer = 0;
                        this.waitForInput = true;
                        this.nextPhase = 'command';
                        this.phase = 'wait_input';
                    } else {
                        this.phase = 'playerSkillSelect';
                        this.skillCur = 0;
                        this.skillOffset = 0;
                    }
                }
                else if (this.cur === 2) this.phase = 'item';
                else this.doFlee();
            }
        } else if (this.phase === 'playerTarget') {
            this.handlePlayerTargetInput();
        } else if (this.phase === 'playerSkillSelect') {
            this.handlePlayerSkillSelectInput();
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
        } else if (this.phase === 'partyInputInit') {
            this.startPartyInput();
        } else if (this.phase === 'partyCommand') {
            this.handlePartyCommandInput();
        } else if (this.phase === 'partyTarget') {
            this.handlePartyTargetInput();
        } else if (this.phase === 'partySkillSelect') {
            this.handlePartySkillSelectInput();
        } else if (this.phase === 'execution') {
            this.processTurnQueue();
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

        // Safety check
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
            if (this.selectedSkillId) {
                // Skill Action
                this.queuePlayerAction('skill', this.selectedSkillId);
            } else {
                // Attack Action
                this.queuePlayerAction('attack');
            }
        }
        if (Input.cancel()) {
            if (this.selectedSkillId) {
                this.phase = 'playerSkillSelect'; // Back to skill select
            } else {
                this.phase = 'command'; // Back to command
            }
        }
    },

    handlePlayerSkillSelectInput() {
        const skills = PlayerStats2.skills || [];
        const max = skills.length;
        if (max === 0) {
            this.phase = 'command';
            return;
        }

        if (Input.justPressed('ArrowUp')) {
            this.skillCur = (this.skillCur - 1 + max) % max;
        }
        if (Input.justPressed('ArrowDown')) {
            this.skillCur = (this.skillCur + 1) % max;
        }

        if (Input.interact()) {
            const skillId = skills[this.skillCur];
            const skill = SkillData2[skillId];

            if (PlayerStats2.sp < skill.sp) {
                // SP Insufficient feedback?
                // For now, maybe shake or just ignore?
                // Or show temporary message?
                // showing message resets phase usually... let's just ignore or play buzzer
                return;
            }

            this.selectedSkillId = skillId;

            // Target Selection needed?
            if (skill.target === 'all_enemies' || skill.target === 'party' || skill.target === 'self') {
                // No target selection needed for now (simplified)
                // OR queue immediately
                this.queuePlayerAction('skill', skillId);
            } else {
                // Single Target
                this.phase = 'playerTarget';
                this.targetIndex = 0;
                while (this.targetIndex < this.enemies.length && this.enemies[this.targetIndex].hp <= 0) {
                    this.targetIndex++;
                }
            }
        }

        if (Input.cancel()) {
            this.phase = 'command';
        }
    },

    // プレイヤー行動の予約（すぐに実行しない）
    queuePlayerAction(type, skillId = null) {
        // ターゲット
        let targetIdx = this.targetIndex;

        // Player Action Object
        const action = {
            actor: PlayerStats2,
            type: type,
            isPlayer: true,
            targetIndex: targetIdx,
            skillId: skillId, // Add Skill ID
            priority: 0 // For future use
        };

        // キューはまだ作らない（パーティ入力後に一括生成）
        // 一時的に保存
        this.playerAction = action;

        // 次のフェーズへ
        if (Party2.members.length > 0) {
            this.phase = 'partyInputInit'; // Jump directly to init
        } else {
            this.startExecutionPhase();
        }
        this.enemyAttackCount = 0;
    },

    doFlee() {
        if (this.isBoss) {
            this.msg = 'ボス戦からは逃げられない！';
            this.phase = 'wait_input';
            this.nextPhase = 'command';
        } else {
            // Flee is immediate attempt? Or Speed based?
            // Usually Flee is first priority.
            // Let's keep it immediate for now, or queue it with high priority?
            // User requested speed-based. But Flee usually fails or succeeds. 
            // Let's Queue it as a special action.

            this.playerAction = {
                actor: PlayerStats2,
                type: 'flee',
                isPlayer: true,
                priority: 999
            };
            if (Party2.members.length > 0) {
                this.phase = 'partyInputInit';
            } else {
                this.startExecutionPhase();
            }
        }
    },

    startPartyInput() {
        this.phase = 'partyCommand';
        this.partyTurnIndex = 0;
        this.partyCommands = [];

        // Skip dead members
        while (this.partyTurnIndex < Party2.members.length && Party2.members[this.partyTurnIndex].hp <= 0) {
            this.partyTurnIndex++;
        }

        if (this.partyTurnIndex >= Party2.members.length) {
            // 全滅または行動不能なら即座にターン処理
            this.startExecutionPhase();
        } else {
            this.msg = `${Party2.members[this.partyTurnIndex].name}はどうする？`;
            this.cur = 0; // Reset cursor
        }
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
                const skills = member.skills || [];
                if (skills.length === 0) {
                    this.msg = 'スキルを覚えていない！';
                    this.msgTimer = 0;
                    this.waitForInput = true;
                    this.phase = 'wait_input';
                    this.nextPhase = 'partyCommand';
                } else {
                    this.phase = 'partySkillSelect';
                    this.skillCur = 0;
                    this.skillOffset = 0;
                    this.selectedSkillId = null;
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
                    const consumable = Inventory2.items.find(id => ItemData2[id] && ItemData2[id].type === 'consumable');
                    if (consumable) {
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
                // にげる
                this.pushPartyCommand({ type: 'flee' }, null);
            }
        }
    },

    handlePartyTargetInput() {
        // Simple Left/Right navigation for enemies
        const count = this.enemies.length;
        if (count === 0) return;

        // Safety check
        if (this.enemies.every(e => e.hp <= 0)) {
            // Should verify logic here, but usually fine
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
            let actionType = (this.selectedSkillId) ? 'skill' : 'attack'; // Use 'skill' type
            const member = Party2.members[this.partyTurnIndex];

            // Construct Action
            let action = {};
            if (actionType === 'skill') {
                action = { type: 'skill', skillId: this.selectedSkillId };
            } else {
                action = { type: 'attack', power: member.atk };
            }

            this.pushPartyCommand(action, this.partyTargetIndex);
        }

        if (Input.cancel()) {
            if (this.selectedSkillId) {
                this.phase = 'partySkillSelect';
            } else {
                this.phase = 'partyCommand';
            }
        }
    },

    handlePartySkillSelectInput() {
        const member = Party2.members[this.partyTurnIndex];
        const skills = member.skills || [];
        const max = skills.length;

        if (Input.justPressed('ArrowUp')) {
            this.skillCur = (this.skillCur - 1 + max) % max;
        }
        if (Input.justPressed('ArrowDown')) {
            this.skillCur = (this.skillCur + 1) % max;
        }

        if (Input.interact()) {
            const skillId = skills[this.skillCur];
            const skill = SkillData2[skillId];

            if (member.sp < skill.sp) {
                // Insufficient SP
                return;
            }

            this.selectedSkillId = skillId;

            if (skill.target === 'all_enemies' || skill.target === 'party' || skill.target === 'self') {
                // No target selection needed
                this.pushPartyCommand({ type: 'skill', skillId: skillId }, null);
            } else {
                this.phase = 'partyTarget';
                this.partyTargetIndex = 0;
                while (this.partyTargetIndex < this.enemies.length && this.enemies[this.partyTargetIndex].hp <= 0) {
                    this.partyTargetIndex++;
                }
            }
        }

        if (Input.cancel()) {
            this.phase = 'partyCommand';
        }
    },

    pushPartyCommand(action, targetIdx) {
        const member = Party2.members[this.partyTurnIndex];
        // Queue Action
        this.partyCommands.push({
            actor: member,
            isPlayer: false,
            action: action,
            targetIndex: targetIdx
        });

        // Next member
        this.partyTurnIndex++;
        while (this.partyTurnIndex < Party2.members.length && Party2.members[this.partyTurnIndex].hp <= 0) {
            this.partyTurnIndex++;
        }

        if (this.partyTurnIndex >= Party2.members.length) {
            // Finish Party Input -> Execute
            this.startExecutionPhase();
        } else {
            this.phase = 'partyCommand';
            this.msg = `${Party2.members[this.partyTurnIndex].name}はどうする？`;
            this.cur = 0;
        }
    },

    // ===============================================
    // Execution Phase (Turn Order)
    // ===============================================
    startExecutionPhase() {
        this.phase = 'execution';
        this.turnQueue = [];

        // 1. Add Player Action
        if (this.playerAction) {
            this.turnQueue.push({
                ...this.playerAction,
                speed: (PlayerStats2.agi || 5) + Math.random() * 5
            });
        }

        // 2. Add Party Actions
        this.partyCommands.forEach(cmd => {
            if (cmd.actor.hp > 0) {
                this.turnQueue.push({
                    actor: cmd.actor,
                    type: cmd.action.type, // Simplify structure
                    action: cmd.action,
                    targetIndex: cmd.targetIndex,
                    isPlayer: false,
                    speed: (cmd.actor.agi || 5) + Math.random() * 5
                });
            }
        });

        // 先制行動の計算 (シェラのパッシブ)
        let preemptiveBonus = 0;
        if (this.turnCount === 1 && Party2.isMember('shera') && !this.isBoss) {
            preemptiveBonus = 1000;
        }

        if (preemptiveBonus > 0) {
            this.turnQueue.forEach(t => {
                if (t.isPlayer || !t.isEnemy) {
                    t.speed += preemptiveBonus;
                }
            });
        }

        // 3. Add Enemy Actions (AI Decision)
        this.enemies.forEach(enemy => {
            if (enemy.hp > 0) {
                this.turnQueue.push({
                    actor: enemy,
                    type: 'enemy_attack', // General key, specific AI inside
                    isEnemy: true,
                    speed: (enemy.agi || 4) + Math.random() * 5
                });
            }
        });

        // 4. Sort by Speed (Descending)
        this.turnQueue.sort((a, b) => b.speed - a.speed);

        // Log turn order for debug?
        // console.log("Turn Order:", this.turnQueue.map(t => `${t.actor.name} (${t.speed.toFixed(1)})`));

        this.processTurnQueue();
    },

    processTurnQueue() {
        // If waiting for input, do nothing
        if (this.waitForInput) return;

        // Check Victory/Defeat continuously
        if (this.enemies.every(e => e.hp <= 0)) {
            this.checkVictory();
            return;
        }
        if (PlayerStats2.hp <= 0) {
            this.phase = 'defeat';
            this.msg = '力尽きた...';
            this.waitForInput = true;
            return;
        }

        // Get Next Action
        if (this.turnQueue.length === 0) {
            // End of Turn
            this.playerAction = null;
            this.partyCommands = [];
            this.turnCount++;
            this.phase = 'wait_input';
            this.nextPhase = 'command';
            this.msg = ''; // Clear msg
            // Maybe auto-skip wait if msg is empty?
            this.phase = 'command'; // Reset directly
            return;
        }

        const turn = this.turnQueue.shift();
        const actor = turn.actor;

        // Skip if dead
        if ((!actor.maxHp && actor.hp <= 0) || (actor.maxHp && actor.hp <= 0)) {
            // Re-check death (Enemies use hp/maxHp, Allies same)
            // Just safely check hp
            this.processTurnQueue();
            return;
        }
        if (actor.hp <= 0) {
            this.processTurnQueue();
            return;
        }

        this.executeAction(turn);
    },

    executeAction(turn) {
        const actor = turn.actor;

        if (turn.isEnemy) {
            this.doEnemyAction(actor);
        } else {
            // Player or Party
            this.doAllyAction(turn);
        }
    },

    doAllyAction(turn) {
        const actor = turn.actor;
        const type = turn.type;
        const targetIndex = turn.targetIndex;

        // Resolve Target
        let target = null;
        if (targetIndex !== null && targetIndex !== undefined) {
            target = this.enemies[targetIndex];
            if (target && target.hp <= 0) target = null;
        }
        // Fallback target
        if (!target && (type === 'attack' || type === 'magic')) {
            target = this.enemies.find(e => e.hp > 0);
        }

        let msg = '';

        if (type === 'flee') {
            if (this.isBoss) {
                msg = `${actor.name}は逃げようとした！\nしかし回り込まれてしまった！`;
                // Fail
            } else if (Math.random() < 0.5 + (actor.agi || 5) / 20) { // Speed adjust
                msg = `${actor.name}は逃げ出した！`;
                this.phase = 'victory';
                this.enemies = []; // Clear
                this.msg = msg;
                this.waitForInput = true;
                return;
            } else {
                msg = `${actor.name}は逃げようとした！\nしかし回り込まれてしまった！`;
            }
        }
        else if (type === 'attack') {
            if (!target) {
                msg = `${actor.name}は攻撃しようとしたが、敵がいなかった。`;
            } else {
                const finalPower = (turn.isPlayer) ? PlayerStats2.atk : (turn.action?.power || actor.atk);
                const dmg = Math.floor(Math.max(1, finalPower - target.def + Math.random() * 2));
                target.hp = Math.max(0, target.hp - dmg);
                msg = `${actor.name}の攻撃！${target.name}に${dmg}ダメージ！`;
                FX.shake(100);
            }
        }
        else if (type === 'skill' || type === 'magic') {
            const skillId = turn.action?.skillId || turn.skillId;
            const skill = SkillData2[skillId];

            if (!skill) {
                msg = `${actor.name}はどうしていいか分からなかった。`;
            } else if (actor.sp < skill.sp) {
                msg = `${actor.name}は${skill.name}を使おうとしたがSPが足りない！`;
            } else {
                actor.sp -= skill.sp;

                // Ally Targeting logic
                let skillTarget = target;
                if (skill.type === 'heal' || skill.target === 'self' || skill.target === 'party' || skill.type === 'buff') {
                    let lowestHpAlly = Party2.members.reduce((prev, curr) => (curr.hp > 0 && curr.hp < prev.hp) ? curr : prev, actor);
                    if (PlayerStats2.hp > 0 && PlayerStats2.hp < lowestHpAlly.hp) lowestHpAlly = PlayerStats2;
                    skillTarget = lowestHpAlly;
                }

                if (skill.type === 'heal') {
                    const healDmg = skill.power || 30;
                    skillTarget.hp = Math.min(skillTarget.maxHp, skillTarget.hp + healDmg);
                    msg = `${actor.name}は${skill.name}を唱えた！\n${skillTarget.name}のHPが${healDmg}回復！`;
                    FX.flash(100);
                } else if (skill.type === 'buff') {
                    msg = `${actor.name}は${skill.name}を使った！\n味方の力が上がった！`;
                    FX.flash(100);
                } else if (skill.type === 'debuff') {
                    if (target) {
                        msg = `${actor.name}は${skill.name}を使った！\n${target.name}の能力が下がった！`;
                        FX.flash(100);
                    } else {
                        msg = `${actor.name}は${skill.name}を使ったが対象がいなかった。`;
                    }
                } else if (!target) {
                    msg = `${actor.name}は${skill.name}を使おうとしたが対象がいなかった。`;
                } else {
                    const baseStat = skill.type === 'magic' ? actor.matk : actor.atk;
                    const power = Math.floor(baseStat * (skill.power || 1.0));
                    const dmg = Math.max(1, power - target.def);
                    target.hp = Math.max(0, target.hp - dmg);
                    msg = `${actor.name}の${skill.name}！\n${target.name}に${dmg}ダメージ！`;
                    FX.flash(100);
                }
            }
        }
        else if (type === 'item') {
            const res = Inventory2.useItem(turn.action.item, actor);
            if (res.success) {
                msg = `${actor.name}は${ItemData2[turn.action.item].name}を使った！\n${res.msg}`;
            } else {
                msg = `${actor.name}は${ItemData2[turn.action.item].name}を使おうとしたが、効果がなかった！`;
            }
        }

        this.msg = msg;
        this.msgTimer = 0;
        this.waitForInput = true;

        // After this phase input is cleared, update() will call processTurnQueue() again
        this.nextPhase = 'execution';
        this.phase = 'wait_input';
    },

    doEnemyAction(enemy) {
        // Target Selection
        const targets = [{ name: PlayerStats2.name, isPlayer: true, stats: PlayerStats2 }];
        Party2.members.forEach(m => targets.push({ name: m.name, isPlayer: false, stats: m }));
        const validTargets = targets.filter(t => t.stats.hp > 0);

        if (validTargets.length === 0) {
            // Everyone dead? processTurnQueue will catch it next
            return;
        }

        // デコイ効果 (ガウェイン)
        let targetPool = [...validTargets];
        const gawain = validTargets.find(t => !t.isPlayer && t.stats.id === 'gawain');
        if (gawain) {
            // ガウェインが生きている場合、タゲられる確率を大幅に上げる(3回追加)
            targetPool.push(gawain, gawain, gawain);
        }

        const target = targetPool[Math.floor(Math.random() * targetPool.length)];

        // 防御パッシブ効果 (ガウェイン) - パーティ全体に防御力+5
        let defBonus = Party2.isMember('gawain') ? 5 : 0;
        const dmg = Math.max(1, enemy.atk - (target.stats.def + defBonus));

        let dead = false;
        if (target.isPlayer) {
            dead = PlayerStats2.takeDamage(dmg);
        } else {
            target.stats.hp = Math.max(0, target.stats.hp - dmg);
            if (target.stats.hp === 0) dead = true;
        }

        let msg = `${enemy.name}の攻撃！${target.name}に${dmg}ダメージ！`;
        if (dead) msg += `\n${target.name}は力尽きた...`;

        // If player dead, game over logic handles in processTurnQueue
        FX.shake(150);

        this.msg = msg;
        this.msgTimer = 0;
        this.waitForInput = true;
        this.nextPhase = 'execution';
        this.phase = 'wait_input';
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

        // Experience & Level Up
        const leveledUp = PlayerStats2.addExp(totalExp);
        Party2.addExpToAll(totalExp); // Party members might not have level up return yet, or use old logic.

        this.msg = `敵を一掃した！\n${totalGold}G と ${totalExp}EXP を獲得！`;

        if (leveledUp) {
            this.msg += `\n${PlayerStats2.name}はレベル${PlayerStats2.level}になった！`;
        }
        // Future: Check party members level up

        dropItems.forEach(item => {
            Inventory2.addItem(item); // Ensure items are added
            this.msg += `\n${ItemData2[item].name}を手に入れた！`;
        });

        this.msgTimer = 0;
        this.waitForInput = true;

        if (this.isTrueBoss && this.currentArea) {
            WorldState.world2.trueBosses[this.currentArea] = true;
            QuestSystem2.set(`${this.currentArea}_boss_defeated`);

            if (this.currentArea === 'east') {
                // Post-boss event: add string to msg buffer
                this.msg += '\nルルシア「やりましたね！ 少しだけ…私の力が戻ってきた気がします！」\nルルシア「ふふっ、貴方と一緒なら安心ですね。」';
            } else if (this.currentArea === 'west') {
                this.msg += '\nルルシア「お怪我はありませんか？ 私が治しますね。」';
            } else if (this.currentArea === 'south') {
                this.msg += '\nルルシア「……すごい。貴方の魔剣、どんどん私の力と……いいえ、なんでもありません。」';
            } else if (this.currentArea === 'north') {
                this.msg += '\nルルシア「これで全ての結界が……！ さあ、魔王城へ向かいましょう！」';
            }

            // 全ボス撃破チェック -> 魔王城解放
            if (QuestSystem2.checkAllBossesDefeated() && !QuestSystem2.has(StoryFlags.DEMON_CASTLE_OPEN)) {
                QuestSystem2.set(StoryFlags.DEMON_CASTLE_OPEN);
                this.msg += '\n\n世界中から禍々しい気配が消え、\n中央の城から強大な魔力が溢れ出した！';
                this.msg += '\nルルシア「……ふふっ、長かったですがこれでようやく……\nさあ勇者様、魔王城へ急ぎましょう。」';
            }
        }
        if (this.isDemonKing) {
            WorldState.world2.trueDemonKingDefeated = true;
            QuestSystem2.set(StoryFlags.DEMON_KING_DEFEATED);

            // Trigger Ending
            if (WorldState.managers.loop2Ending) {
                this.active = false;
                WorldState.managers.loop2Ending.start();
                return;
            }
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
        this.turnQueue = [];

        Input.lock(200);
    },

    render(ctx) {
        BattleRender2.render(ctx, this);
    }
};
