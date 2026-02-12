import { BaseState } from './base_state.js';
import { WorldState } from '../loop1/world.js';
import { Maps } from '../loop1/systems/maps/manager.js';

export class MenuState extends BaseState {
    constructor(game) {
        super(game);
    }

    enter() {
        const menu = WorldState.managers.menu;
        if (menu && !menu.visible) menu.open();
    }

    exit() {
        // When leaving menu state
        const menu = WorldState.managers.menu;
        if (menu && menu.visible) menu.close();
    }

    update() {
        const menu = WorldState.managers.menu;
        if (!menu) {
            this.game.stateMachine.change('playing');
            return;
        }

        menu.update();
        if (!menu.visible) {
            this.game.stateMachine.change('playing');
        }
    }

    draw(ctx) {
        if (this.game.stateMachine.states['playing']) {
            this.game.stateMachine.states['playing'].draw(ctx);
        }

        const menu = WorldState.managers.menu;
        if (menu) menu.render(ctx);
    }
}
