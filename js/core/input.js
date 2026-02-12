// ===========================================
// 入力マネージャー
// ===========================================
export const Input = {
    keys: {}, just: {},
    inputLocked: false,

    init() {
        window.addEventListener('keydown', e => {
            if (e.repeat) return;
            if (!this.keys[e.code]) this.just[e.code] = true;
            this.keys[e.code] = true;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyZ', 'KeyX', 'Enter', 'Escape'].includes(e.code)) e.preventDefault();
        });
        window.addEventListener('keyup', e => { this.keys[e.code] = false; });
        window.addEventListener('blur', () => { this.keys = {}; this.just = {}; });
    },

    pressed(k) { return !this.inputLocked && this.keys[k] === true; },
    justPressed(k) {
        if (this.inputLocked || !this.just[k]) return false;
        this.just[k] = false;
        return true;
    },

    endFrame() { this.just = {}; },

    lock(ms = 100) {
        this.inputLocked = true;
        this.just = {};
        setTimeout(() => { this.inputLocked = false; }, ms);
    },

    move() {
        if (this.inputLocked) return { dx: 0, dy: 0 };
        let dx = 0, dy = 0;
        if (this.pressed('ArrowUp') || this.pressed('KeyW')) dy = -1;
        if (this.pressed('ArrowDown') || this.pressed('KeyS')) dy = 1;
        if (this.pressed('ArrowLeft') || this.pressed('KeyA')) dx = -1;
        if (this.pressed('ArrowRight') || this.pressed('KeyD')) dx = 1;
        return { dx, dy };
    },
    interact() { return this.justPressed('KeyZ') || this.justPressed('Enter'); },
    cancel() { return this.justPressed('KeyX') || this.justPressed('Escape'); }
};
