// import { BaseState } from './base_state.js';
// import { PlayerController } from '../systems/player_controller.js';
// import { MapRenderer } from '../systems/map_renderer.js';

class PlayingState extends BaseState {
    constructor(game) {
        super(game);
        this.playerController = new PlayerController(game.player);
        this.mapRenderer = new MapRenderer();
    }

    enter() {
        // Logic when entering playing state (e.g. from Menu)
        // Usually nothing special unless resuming music etc.
    }

    update() {
        // Menu Trigger
        if (Input.justPressed('KeyX') && !Menu.visible) {
            Menu.open(); // This currently sets currentState = MENU
            // In the new system, Menu.open should trigger state change
            // For now, we rely on main loop to check if state changed? 
            // OR better: Menu.open() calls game.stateMachine.change('menu')
            this.game.stateMachine.change('menu');
            return;
        }

        this.playerController.update();
    }

    draw(ctx) {
        const m = Maps.get();
        // Determine camera based on player
        Camera.update(this.game.player.x, this.game.player.y, m.w, m.h);

        // Use GameConfig directly or pass from game
        this.mapRenderer.draw(ctx, m, Camera, this.game.player, GameConfig);
    }
}
