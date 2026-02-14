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



    // Override checkEncounter if needed (e.g. different rates or battle system)
    checkEncounter() {
        // Use base logic but ensure it calls Battle2.start
        // Base Controller calls `this.worldState.managers.battle.start`
        // Since we swapped managers.battle to Battle2, it should work!
        // Just need to ensure Battle2.start() signature matches.
        super.checkEncounter();
    }
}
