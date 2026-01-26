// import { BaseState } from './base_state.js';
// import { PlayerController } from '../systems/player_controller.js';
// import { MapRenderer } from '../systems/map_renderer.js';

class PlayingState extends BaseState {
    constructor(game) {
        super(game);
        this.mapRenderer = new MapRenderer();
        this.playerController = null;
    }

    enter() {
        // Init/Switch Controller if needed (e.g. Week 1 vs Week 2)
        const ControllerClass = WorldState.managers.controllerClass;
        if (ControllerClass) {
            // Simple check: if class name changed or instance missing
            if (!this.playerController || this.playerController.constructor !== ControllerClass) {
                this.playerController = new ControllerClass(this.game.player);
            }
        }
    }

    update() {
        // Menu Trigger
        // Menu Trigger
        const menu = WorldState.managers.menu;
        if (Input.justPressed('KeyX') && (!menu || !menu.visible)) {
            // Open Menu via State Machine if menu manager exists
            if (menu) {
                // Menu.open(); // Handled by MenuState enter?
                // Actually MenuState.enter calls open().
                this.game.stateMachine.change('menu');
            }
            return;
        }

        if (this.playerController) {
            this.playerController.update();
        }
    }

    draw(ctx) {
        const m = Maps.get();
        // Determine camera based on player
        Camera.update(this.game.player.x, this.game.player.y, m.w, m.h);

        // Use GameConfig directly or pass from game
        this.mapRenderer.draw(ctx, m, Camera, this.game.player, GameConfig);
    }
}
