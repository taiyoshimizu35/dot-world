// import { BaseState } from './base_state.js';

class MenuState extends BaseState {
    constructor(game) {
        super(game);
    }

    enter() {
        // Menu.open() handles visibility and input lock
        // But if we transition here, maybe we should call Menu.open() here?
        // Or assume it was called before?
        // Let's assume the State Machine transition is the SOURCE of truth.
        // So:
        if (!Menu.visible) Menu.open();
    }

    exit() {
        // When leaving menu state
        if (Menu.visible) Menu.close();
    }

    update() {
        Menu.update();
        // Menu.update() checks input and calls Menu.close() which sets currentState = PLAYING
        // We need to intercept that or change Menu.close()
        if (!Menu.visible) {
            this.game.stateMachine.change('playing');
        }
    }

    draw(ctx) {
        // Draw the background game (PlayingState draw) ?
        // Usually menus are overlaid.
        // If we want overlay, we need to draw PlayingState logic first.
        // Option: Pass 'playing' state to draw? 
        // Or have Main loop draw PlayingState then MenuState?
        // Standard State Pattern usually switches update/draw entirely.
        // If we want overlay, MenuState needs to manually call MapRenderer or keep previous buffer.

        // For now, we can redraw the map:
        const m = Maps.get();
        // Camera is already updated? Maybe not if we don't call it.
        // We should probably share the renderer or logic.

        // Redraw Map (Background)
        // We can access MapRenderer if we make it a property of Game or shared.
        // Or just instantiate one since it has no state?
        // Actually Camera state is global (Camera object).

        // Let's create a new MapRenderer or access from game if possible.
        // To keep it simple, we'll import it.
        // But really, `game.playingState.draw(ctx)` would be better if we could access it.

        // Let's assume we redraw the map for now. 
        // Note: This relies on MapRenderer being available.
        // A better way is for MenuState to NOT draw the game, but main loop triggers it?
        // No, StateMachine .draw() calls current state.

        // So MenuState MUST draw everything including background if it covers the screen (or transparent).
        // Menu is partial coverage description? "Draw.rect(ctx, 160, 16, ...)"
        // Yes, it's an overlay.

        // Hack: Call PlayingState's draw?
        if (this.game.stateMachine.states['playing']) {
            this.game.stateMachine.states['playing'].draw(ctx);
        }

        Menu.render(ctx);
    }
}
