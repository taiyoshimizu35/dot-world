import { WorldState } from '../loop1/world.js';
import { GameConfig } from '../constants.js';

export class Loop2EndingState {
    constructor(game) {
        this.game = game;
    }

    enter() {
        // WorldState.managers.loop2Ending should be initialized
        if (WorldState.managers.loop2Ending) {
            WorldState.managers.loop2Ending.start();
        } else {
            // Fallback init if missing
            const { Loop2Ending } = require('../loop2/systems/top/loop2_ending.js');
            // ES Module issue? 
            // We'll rely on WorldState init.
        }
    }

    update() {
        if (WorldState.managers.loop2Ending) {
            WorldState.managers.loop2Ending.update();
        }
    }

    draw(ctx) {
        if (WorldState.managers.loop2Ending) {
            WorldState.managers.loop2Ending.render(ctx);
        }
    }
}
