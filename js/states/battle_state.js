import { BaseState } from './base_state.js';
import { WorldState } from '../loop1/world.js';

export class BattleState extends BaseState {
    update() {
        // Battle system should be active in WorldState.managers
        const battle = WorldState.managers.battle;
        if (battle) {
            battle.update();
            // State transitions are now handled within the Battle system itself
            // relying on window.game.stateMachine.change()
        }
    }

    draw(ctx) {
        const battle = WorldState.managers.battle;
        if (battle) battle.render(ctx);
    }
}
