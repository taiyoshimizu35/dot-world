// import { BaseState } from './base_state.js';

class BattleState extends BaseState {
    update() {
        const battle = WorldState.managers.battle;
        if (battle) {
            battle.update();
            // Battle system handles return to PLAYING or GAMEOVER internally usually by setting currentState
            // We need to detect this.
            // If WorldState.managers.battle.active is false? 
            // Or check `currentState` changed?

            if (currentState !== GameState.BATTLE) {
                if (currentState === GameState.PLAYING) this.game.stateMachine.change('playing');
                else if (currentState === GameState.GAMEOVER) this.game.stateMachine.change('gameover');
            }
        }
    }

    draw(ctx) {
        const battle = WorldState.managers.battle;
        if (battle) battle.render(ctx);
    }
}
