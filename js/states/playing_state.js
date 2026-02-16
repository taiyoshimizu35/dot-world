import { BaseState } from './base_state.js';
import { PlayerController } from '../systems/player_controller.js';
import { MapRenderer } from '../systems/map_renderer.js';
import { WorldState } from '../loop1/world.js';
import { Maps } from '../loop1/systems/maps/manager.js';
import { Input } from '../core/input.js';
import { Msg } from '../core/message.js';
import { Camera } from '../core/camera.js';
import { GameConfig } from '../constants.js';
import { WorldMap } from '../loop2/systems/world_map.js';

// Loop 2 Imports REMOVED (Unified)

export class PlayingState extends BaseState {
    constructor(game) {
        super(game);
        this.mapRenderer = new MapRenderer();
        this.playerController = null;
    }

    enter() {
        // Init/Switch Controller if needed
        const ControllerClass = WorldState.managers.controllerClass || PlayerController;
        if (!this.playerController || this.playerController.constructor !== ControllerClass) {
            this.playerController = new ControllerClass(this.game.player, WorldState);
        }
    }

    update() {
        // Message System Update (Overlay Mode)
        if (Msg.visible) {
            if (Input.interact()) {
                if (Msg.done()) {
                    Msg.hide();
                } else {
                    Msg.skip();
                }
            }
            Msg.update();
            return;
        }

        // Check Loop 2 World Map first
        if (WorldState.week === 2) {
            if (WorldMap.active) {
                WorldMap.update();
                return;
            }
        }

        // Overlay Systems (Shop, Inn)
        if (WorldState.managers.shop && WorldState.managers.shop.visible) {
            WorldState.managers.shop.update();
            return;
        }
        if (WorldState.managers.inn && WorldState.managers.inn.visible) {
            WorldState.managers.inn.update();
            return;
        }

        // Menu Trigger
        if (Input.justPressed('KeyX')) {
            this.game.stateMachine.change('menu');
            return;
        }

        if (this.playerController) {
            this.playerController.update();
        }
    }

    draw(ctx) {
        if (WorldState.week === 2) {
            this.drawLoop2(ctx);
        } else {
            this.drawLoop1(ctx);
        }

        // Render Overlays (Common or Manager-based)
        if (WorldState.managers.shop && WorldState.managers.shop.visible) {
            WorldState.managers.shop.render(ctx);
        }
        if (WorldState.managers.inn && WorldState.managers.inn.visible) {
            WorldState.managers.inn.render(ctx);
        }
    }

    drawLoop1(ctx) {
        const m = Maps.get();
        if (!m) return;
        // Determine camera based on player
        Camera.update(this.game.player.x, this.game.player.y, m.w, m.h);
        this.mapRenderer.draw(ctx, m, Camera, this.game.player, GameConfig);
    }

    drawLoop2(ctx) {
        if (WorldMap.active) {
            WorldMap.render(ctx);
        } else {
            // Use unified draw for local areas
            this.drawLoop1(ctx);
        }
    }
}
