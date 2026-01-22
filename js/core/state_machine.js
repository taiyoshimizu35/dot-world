class StateMachine {
    constructor() {
        this.states = {};
        this.currentState = null;
    }

    add(name, state) {
        this.states[name] = state;
    }

    change(name, params = {}) {
        if (this.currentState) {
            this.currentState.exit();
        }

        this.currentState = this.states[name];
        this.currentName = name;

        // Update global state for compatibility
        if (typeof currentState !== 'undefined') {
            currentState = name;
        }

        if (this.currentState) {
            this.currentState.enter(params);
        }
    }

    update() {
        if (this.currentState) {
            this.currentState.update();
        }
    }

    draw(ctx) {
        if (this.currentState) {
            this.currentState.draw(ctx);
        }
    }
}
