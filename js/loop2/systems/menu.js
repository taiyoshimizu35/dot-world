// ===========================================
// Loop 2 Menu System
// ===========================================
const Menu2 = {
    visible: false,
    cur: 0,
    sub: null, // 'status', 'companions', 'items'
    subCur: 0,
    actionWindow: false, // For Companion Talk/Part
    actionCur: 0,
    targetMember: null, // Selected companion

    opts: ['アイテム', 'ステータス', 'なかま', 'セーブ', 'ロード', 'とじる'],

    open() {
        this.visible = true;
        this.cur = 0;
        this.sub = null;
        this.subCur = 0;
        this.actionWindow = false;
        this.targetMember = null;
        currentState = GameState.MENU;
        Input.lock(200);
    },

    close() {
        this.visible = false;
        this.sub = null;
        currentState = GameState.PLAYING;
        Input.lock(150);
    },

    update() {
        if (!this.visible) return;

        // Submenu: Status
        if (this.sub === 'status') {
            if (Input.cancel()) {
                this.sub = null;
                Input.lock(150);
            }
            return;
        }

        // Submenu: Items (Placeholder)
        if (this.sub === 'items') {
            if (Input.cancel() || Input.interact()) {
                this.sub = null;
            }
            return;
        }

        // Submenu: Companions
        if (this.sub === 'companions') {
            this.updateCompanions();
            return;
        }

        // Main Menu
        if (Input.justPressed('ArrowUp')) this.cur = (this.cur - 1 + this.opts.length) % this.opts.length;
        if (Input.justPressed('ArrowDown')) this.cur = (this.cur + 1) % this.opts.length;

        if (Input.interact()) {
            const selected = this.opts[this.cur];
            if (selected === 'ステータス') {
                this.sub = 'status';
            } else if (selected === 'アイテム') {
                this.sub = 'items';
                Msg.show('アイテムは現在持っていない。');
            } else if (selected === 'なかま') {
                if (Party2.members.length === 0) {
                    Msg.show('今は一人旅だ。');
                } else {
                    this.sub = 'companions';
                    this.subCur = 0;
                    this.actionWindow = false;
                }
            } else if (selected === 'セーブ') {
                this.close();
                SaveMenu.open();
            } else if (selected === 'ロード') {
                this.close();
                LoadMenu.open();
            } else if (selected === 'とじる') {
                this.close();
            }
        }
        if (Input.cancel()) this.close();
    },

    updateCompanions() {
        // If Action Window is open (Talk/Part)
        if (this.actionWindow) {
            if (Input.justPressed('ArrowUp')) this.actionCur = (this.actionCur - 1 + 2) % 2;
            if (Input.justPressed('ArrowDown')) this.actionCur = (this.actionCur + 1) % 2;

            if (Input.cancel()) {
                this.actionWindow = false;
                return;
            }

            if (Input.interact()) {
                const action = (this.actionCur === 0) ? 'talk' : 'part';
                this.handleCompanionAction(action);
            }
            return;
        }

        // Select Companion
        const len = Party2.members.length;
        if (len === 0) { // Should not happen if checked before opening
            this.sub = null;
            return;
        }

        if (Input.justPressed('ArrowUp')) this.subCur = (this.subCur - 1 + len) % len;
        if (Input.justPressed('ArrowDown')) this.subCur = (this.subCur + 1) % len;

        if (Input.interact()) {
            this.targetMember = Party2.members[this.subCur];
            this.actionWindow = true;
            this.actionCur = 0;
        }

        if (Input.cancel()) {
            this.sub = null;
            this.targetMember = null;
        }
    },

    handleCompanionAction(action) {
        const member = this.targetMember;
        if (!member) return;

        if (action === 'talk') {
            // Talk
            const text = member.msg || `「……」`;
            Msg.show(`${member.name}\n${text}`);
        } else if (action === 'part') {
            // Part
            this.actionWindow = false; // Close interaction window first
            Msg.choice(`本当に ${member.name} と別れますか？`, ['はい', 'いいえ'], (idx) => {
                if (idx === 0) { // Yes
                    if (Party2.remove(member.id)) {
                        Msg.show(`${member.name} は寂しそうに去っていった……。`);
                        this.sub = null; // Close companion menu to refresh or exit
                    }
                } else {
                    // No - do nothing
                }
            });
        }
    },

    render(ctx) {
        if (!this.visible) return;

        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        // Draw Submenus
        if (this.sub === 'status') {
            this.renderStatus(ctx);
            return;
        }
        if (this.sub === 'companions') {
            this.renderCompanions(ctx);
            // Don't return, allow drawing main menu backdrop? No, usually overlays or replace.
            // Let's replace Main Menu visually or draw on top.
            return;
        }

        // Draw Main Menu
        const menuX = 20;
        const menuY = 20;
        const menuW = 100;
        const menuH = 140; // Expanded to fit 5 items

        Draw.rect(ctx, menuX, menuY, menuW, menuH, 'rgba(0, 0, 0, 0.9)');
        Draw.stroke(ctx, menuX, menuY, menuW, menuH, '#fff', 2);

        this.opts.forEach((opt, i) => {
            const y = menuY + 20 + i * 25;
            const color = (i === this.cur) ? '#fc0' : '#fff';
            if (i === this.cur) Draw.text(ctx, '▶', menuX + 10, y, '#fc0', 14);
            Draw.text(ctx, opt, menuX + 30, y, color, 14);
        });
    },

    renderStatus(ctx) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;
        Draw.rect(ctx, 10, 10, VW - 20, VH - 20, 'rgba(0, 0, 0, 0.95)');
        Draw.stroke(ctx, 10, 10, VW - 20, VH - 20, '#fff', 2);

        Draw.text(ctx, '【ステータス】', 20, 30, '#fc0', 14);

        // Player
        const p = PlayerStats2.getDisplayStats();
        let y = 50;
        this.renderStatusLine(ctx, p, y);

        // Companions
        y += 45; // Spacing
        Party2.members.forEach((m) => {
            // Construct stats object for standardize rendering
            const stats = {
                name: m.name,
                hp: m.hp, maxHp: m.maxHp,
                mp: m.mp, maxMp: m.maxMp,
                atk: m.atk, def: m.def,
                matk: m.matk, mdef: m.mdef
            };
            this.renderStatusLine(ctx, stats, y);
            y += 45;
        });
    },

    renderStatusLine(ctx, s, y) {
        // Name & HP/MP
        Draw.text(ctx, s.name, 20, y, '#fff', 13);
        Draw.text(ctx, `HP ${s.hp}/${s.maxHp}`, 100, y, '#8f8', 11);
        Draw.text(ctx, `MP ${s.mp}/${s.maxMp}`, 180, y, '#8cf', 11);

        // ATK/DEF stuff
        const y2 = y + 15;
        Draw.text(ctx, `ATK ${s.atk}`, 100, y2, '#f88', 11);
        Draw.text(ctx, `DEF ${s.def}`, 150, y2, '#88f', 11);
        Draw.text(ctx, `MAT ${s.matk}`, 200, y2, '#f8f', 11);
        Draw.text(ctx, `MDF ${s.mdef}`, 250, y2, '#8ff', 11);
    },

    renderCompanions(ctx) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        // Companion List Window
        const listX = 50, listY = 30, listW = 200, listH = 150;
        Draw.rect(ctx, listX, listY, listW, listH, 'rgba(0, 0, 0, 0.95)');
        Draw.stroke(ctx, listX, listY, listW, listH, '#fff', 2);

        Draw.text(ctx, '【なかま】', listX + 10, listY + 20, '#fc0', 14);

        Party2.members.forEach((m, i) => {
            const y = listY + 50 + i * 30;
            const color = (i === this.subCur) ? '#fc0' : '#fff';
            if (i === this.subCur && !this.actionWindow) Draw.text(ctx, '▶', listX + 15, y, '#fc0', 14);

            // Highlight selected if action window open
            const displayColor = (this.actionWindow && i === this.subCur) ? '#fe0' : color;
            Draw.text(ctx, m.name, listX + 35, y, displayColor, 14);
        });

        // Action Window (Talk/Part)
        if (this.actionWindow) {
            const actX = listX + 150, actY = listY + 50 + this.subCur * 30;
            const actW = 100, actH = 70;

            Draw.rect(ctx, actX, actY, actW, actH, 'rgba(0, 0, 40, 0.95)');
            Draw.stroke(ctx, actX, actY, actW, actH, '#fff', 2);

            const actions = ['話しかける', '別れる'];
            actions.forEach((act, i) => {
                const y = actY + 25 + i * 25;
                const color = (i === this.actionCur) ? '#fc0' : '#fff';
                if (i === this.actionCur) Draw.text(ctx, '▶', actX + 10, y, '#fc0', 12);
                Draw.text(ctx, act, actX + 25, y, color, 12);
            });
        }
    }
};

// ===========================================
// Save Menu (For Save Points)
// ===========================================
const SaveMenu = {
    visible: false,
    cur: 0,
    saveList: [],

    open() {
        this.visible = true;
        this.cur = 0;
        this.saveList = SaveSystem.getSaveList();
        Input.lock(200);
        currentState = GameState.MENU; // Pause game
    },

    close() {
        this.visible = false;
        Input.lock(150);
        currentState = GameState.PLAYING;
    },

    update() {
        if (!this.visible) return;

        if (Input.cancel()) {
            this.close();
            return;
        }

        if (Input.justPressed('ArrowUp')) this.cur = (this.cur - 1 + 10) % 10;
        if (Input.justPressed('ArrowDown')) this.cur = (this.cur + 1) % 10;

        if (Input.interact()) {
            // Save to slot
            if (SaveSystem.save(this.cur)) {
                Msg.show(`Slot ${this.cur + 1} にセーブしました。`);
                this.close(); // Or refresh list?
            } else {
                Msg.show('セーブに失敗しました。');
            }
        }
    },

    render(ctx) {
        if (!this.visible) return;

        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        Draw.rect(ctx, 20, 20, VW - 40, VH - 40, 'rgba(0,0,50,0.95)');
        Draw.stroke(ctx, 20, 20, VW - 40, VH - 40, '#fff', 2);
        Draw.text(ctx, 'セーブする場所を選択', VW / 2, 40, '#fc0', 14, 'center');

        const listY = 60;
        const showCount = 10;
        let startIdx = 0;
        // if (this.cur >= showCount) ... (No need if showCount >= total)

        this.saveList.slice(0, 10).forEach((slot, i) => {
            const absIdx = i;
            const y = listY + i * 22; // Condensed slightly to fit
            const isSel = (absIdx === this.cur);
            const color = isSel ? '#fc0' : '#ccc';
            const prefix = isSel ? '▶ ' : '  ';

            let text = `Slot ${absIdx + 1}: ----`;
            if (slot.exists) {
                text = `Slot ${absIdx + 1}: ${slot.name} (W:${slot.week})`;
            }

            Draw.text(ctx, prefix + text, 40, y, color, 12);
        });
    }
};

// ===========================================
// Load Menu
// ===========================================
const LoadMenu = {
    visible: false,
    cur: 0,
    saveList: [],

    open() {
        this.visible = true;
        this.cur = 0;
        this.saveList = SaveSystem.getSaveList();
        Input.lock(200);
        currentState = GameState.MENU;
    },

    close() {
        this.visible = false;
        Input.lock(150);
        currentState = GameState.PLAYING;
    },

    update() {
        if (!this.visible) return;

        if (Input.cancel()) {
            this.close();
            return;
        }

        if (Input.justPressed('ArrowUp')) this.cur = (this.cur - 1 + 10) % 10;
        if (Input.justPressed('ArrowDown')) this.cur = (this.cur + 1) % 10;

        if (Input.interact()) {
            const slot = this.saveList[this.cur];
            if (slot.exists) {
                if (SaveSystem.load(slot.slot)) {
                    this.close();
                    currentState = GameState.PLAYING;
                    FX.fadeIn();
                } else {
                    Msg.show('ロードに失敗しました。');
                }
            } else {
                Msg.show('データがありません。');
            }
        }
    },

    render(ctx) {
        if (!this.visible) return;

        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        Draw.rect(ctx, 20, 20, VW - 40, VH - 40, 'rgba(0,0,50,0.95)');
        Draw.stroke(ctx, 20, 20, VW - 40, VH - 40, '#fff', 2);
        Draw.text(ctx, 'ロードするデータを選択', VW / 2, 40, '#fc0', 14, 'center');

        const listY = 60;

        this.saveList.slice(0, 10).forEach((slot, i) => {
            const absIdx = i;
            const y = listY + i * 22;
            const isSel = (absIdx === this.cur);
            const color = isSel ? '#fc0' : '#ccc';
            const prefix = isSel ? '▶ ' : '  ';

            let text = `Slot ${absIdx + 1}: ----`;
            if (slot.exists) {
                text = `Slot ${absIdx + 1}: ${slot.name} (W:${slot.week})`;
            }

            Draw.text(ctx, prefix + text, 40, y, color, 12);
        });
    }
};

window.Menu2 = Menu2;
window.SaveMenu = SaveMenu;
window.LoadMenu = LoadMenu;
