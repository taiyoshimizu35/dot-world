import { GameConfig } from '../../constants.js';
import { Input } from '../../core/input.js';
import { Msg } from '../../core/message.js';
import { FX } from '../../core/effects.js';
import { Maps } from '../../loop1/systems/maps/manager.js';
import { Chests } from '../../loop1/systems/maps/chests.js';
import { Checkpoint } from '../../loop1/checkpoint.js';
import { PlayerController } from '../../systems/player_controller.js'; // Inherit base movement
import { WorldState } from '../../loop1/world.js'; // Loop 1 WorldState as Context

// Loop 2 Systems
import { PlayerStats2 } from '../player.js';
import { QuestSystem2 } from '../quest.js';
import { WeaponShop } from './shop.js';
import { Menu2 } from './menu.js';
import { SaveMenu, LoadMenu } from './menu.js';
import { Battle2 } from './battle/core.js';


export class PlayerController2 extends PlayerController {
    constructor(player, worldState) {
        super(player, worldState);
    }

    // Override Interaction for Loop 2 specific logic
    handleInteraction() {
        if (!Input.interact()) return;
        const TS = GameConfig.TILE_SIZE;
        const playerTx = Math.floor((this.player.x + TS / 2) / TS);
        const playerTy = Math.floor((this.player.y + TS / 2) / TS);

        let tx = playerTx, ty = playerTy;
        if (this.player.dir === 0) ty++;
        else if (this.player.dir === 1) tx--;
        else if (this.player.dir === 2) tx++;
        else if (this.player.dir === 3) ty--;

        const targetT = Maps.getTile(tx, ty);
        if (targetT === GameConfig.TILE_TYPES.COUNTER) {
            // Counter interaction logic same as base?
            if (this.player.dir === 0) ty++;
            else if (this.player.dir === 1) tx--;
            else if (this.player.dir === 2) tx++;
            else if (this.player.dir === 3) ty--;
        }

        const npcs = Maps.get().npcs || [];
        let npc = npcs.find(n => n.x === tx && n.y === ty);
        if (!npc) {
            const adjacents = [
                { x: playerTx, y: playerTy + 1 }, { x: playerTx, y: playerTy - 1 },
                { x: playerTx + 1, y: playerTy }, { x: playerTx - 1, y: playerTy }
            ];
            for (const adj of adjacents) {
                const adjNpc = npcs.find(n => n.x === adj.x && n.y === adj.y);
                if (adjNpc) { npc = adjNpc; break; }
            }
        }

        if (npc) this.handleNpcInteraction(npc);

        // Chests (Shared/Reset for Loop 2? Or new chests?)
        // Assuming chests might be reset or different. using base for now.
        // If chest data is separate, we need Chests2.
        const chest = Chests.nearby(Maps.current, tx * TS, ty * TS);
        if (chest && !Chests.isOpen(chest.id)) {
            // Loop 2 Chest Logic?
            // If chests are Loop 1 only, we might disable them or check loop
            // checking chest.week2?
            if (chest.week1Only) {
                Msg.show('もう空っぽだ。');
                return;
            }

            Chests.open(chest.id);
            // Loop 2 Inventory? Loop 2 has no inventory yet implemented fully?
            // Use temporary message
            Msg.show(`${chest.item}を見つけたが、今は使えないようだ。`);
        }
    }

    handleNpcInteraction(npc) {
        if (npc.week1Only) return; // Loop 2, ignore week 1 NPCs
        if (npc.week2Only && this.worldState.week !== 2) return; // Should allow week2 npcs

        if (npc.partyJoin) {
            // Loop 2 Party Join Logic
            // Check if already in party
            const party = this.worldState.managers.party;
            if (party && party.isMember(npc.partyJoin)) {
                Msg.show(npc.joinedMsg || '「よろしく頼む」');
                return;
            }

            Msg.choice(npc.msg || '仲間になる？', ['はい', 'いいえ'], (idx) => {
                if (idx === 0) {
                    if (party) {
                        party.add(npc.partyJoin);
                        Msg.show(`${npc.name}が仲間になった！`);
                        // Hide NPC? Maps.getVisibleNpcs handles this via party check
                    }
                }
            });
            return;
        }

        if (npc.areaBoss) {
            // Loop 2 True Boss Logic
            const trueBossKey = npc.areaBoss; // assume same key or mapped
            // Check if defeated
            // WorldState2.trueBosses... but we should use QuestSystem2 or WorldState2
            // MapManager should handle visibility. Interaction implies fight.

            Battle2.startTrueBoss(npc.areaBoss);
            return;
        }

        if (npc.demonKing) {
            Battle2.startTrueDemonKing();
            return;
        }

        // Shops (Loop 2)
        if (npc.shop || npc.magicShop || npc.advancedShop) {
            // WeaponShop.open? It has no open.
            Msg.show('「いらっしゃいませ。まだ準備中です」');
        }
        else if (npc.inn) {
            const cost = Math.max(1, Math.floor(PlayerStats2.gold * 0.05));
            // Inn logic for Loop 2?
            // Use Msg choice for now or Inn2
            Msg.choice(`宿屋だ。泊まるか？ (${cost}G)`, ['はい', 'いいえ'], (idx) => {
                if (idx === 0) {
                    if (PlayerStats2.spendGold(cost)) {
                        FX.fadeOut(() => {
                            PlayerStats2.fullRestore(); // Player
                            // Party restore?
                            const party = this.worldState.managers.party;
                            if (party) party.fullHealAll();

                            FX.fadeIn(() => {
                                Msg.show('体力が回復した！');
                            });
                        });
                    } else {
                        Msg.show('お金が足りないようだ。');
                    }
                }
            });
        }
        else if (npc.savePoint) {
            SaveMenu.open();
        }
        else if (npc.msg) Msg.show(npc.msg);
    }

    // Override checkEncounter if needed (e.g. different rates or battle system)
    checkEncounter() {
        // Use base logic but ensure it calls Battle2.start
        // Base Controller calls `this.worldState.managers.battle.start`
        // Since we swapped managers.battle to Battle2, it should work!
        // Just need to ensure Battle2.start() signature matches.
        super.checkEncounter();
    }
}
