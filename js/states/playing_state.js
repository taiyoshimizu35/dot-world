import { BaseState } from './base_state.js';
import { PlayerController } from '../systems/player_controller.js';
import { MapRenderer } from '../systems/map_renderer.js';
import { WorldState } from '../loop1/world.js';
import { Maps } from '../loop1/systems/maps/manager.js';
import { Input } from '../core/input.js';
import { Msg } from '../core/message.js';
import { Camera } from '../core/camera.js';
import { GameConfig } from '../constants.js';

export class PlayingState extends BaseState {
    constructor(game) {
        super(game);
        this.mapRenderer = new MapRenderer();
        this.playerController = null;
    }

    enter() {
        // Init/Switch Controller if needed
        // Assuming PlayerController handles both loops via WorldState.week check
        // Or if WorldState.managers.controllerClass is set, use it.
        const ControllerClass = WorldState.managers.controllerClass || PlayerController;
        if (!this.playerController || this.playerController.constructor !== ControllerClass) {
            this.playerController = new ControllerClass(this.game.player, WorldState);
        }
    }

    update() {
        // Message System Update (Overlay Mode)
        if (Msg.visible) {
            // console.log("PlayingState: Msg visible. Interact?", Input.interact(), "Done?", Msg.done());
            if (Input.interact()) {
                if (Msg.done()) {
                    console.log("PlayingState: Msg done, hiding.");
                    Msg.hide();
                } else {
                    console.log("PlayingState: Msg skipping.");
                    Msg.skip();
                }
            }
            Msg.update();
            // Block other updates while message is visible
            return;
        }

        // Overlay Systems (Shop, Inn) - blocking standard update if visible
        if (WorldState.managers.shop && WorldState.managers.shop.visible) {
            WorldState.managers.shop.update();
            return;
        }
        if (WorldState.managers.inn && WorldState.managers.inn.visible) {
            WorldState.managers.inn.update();
            return;
        }

        // Menu Trigger
        const menu = WorldState.managers.menu;
        if (Input.justPressed('KeyX')) {
            if (menu) {
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

        this.mapRenderer.draw(ctx, m, Camera, this.game.player, GameConfig);

        // Render Overlays
        if (WorldState.managers.shop && WorldState.managers.shop.visible) {
            WorldState.managers.shop.render(ctx);
        }
        if (WorldState.managers.inn && WorldState.managers.inn.visible) {
            WorldState.managers.inn.render(ctx);
        }


    }
}
