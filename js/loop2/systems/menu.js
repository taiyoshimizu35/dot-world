// ===========================================
// Loop 2 Menu System
// ===========================================
const Menu2 = {
    visible: false, cur: 0, sub: null,

    // 2週目はインベントリ未実装のため、アイテムメニューは当面無効化またはダミー
    // User requested "Save" addition.
    opts: ['ステータス', 'セーブ', '閉じる'],

    open() {
        this.visible = true;
        this.cur = 0;
        this.sub = null;
        this.message = null;
        currentState = GameState.MENU;
        Input.lock(200);
    },

    close() {
        this.visible = false;
        this.sub = null;
        this.message = null;
        currentState = GameState.PLAYING;
        Input.lock(150);
    },

    update() {
        if (!this.visible) return;

        // Message Mode
        if (this.message) {
            if (Input.interact() || Input.cancel()) this.message = null;
            return;
        }

        // Submenu: Status
        if (this.sub === 'status') {
            if (Input.cancel()) { this.sub = null; Input.lock(150); }
            return;
        }

        // Main Menu
        if (Input.justPressed('ArrowUp')) this.cur = (this.cur - 1 + this.opts.length) % this.opts.length;
        if (Input.justPressed('ArrowDown')) this.cur = (this.cur + 1) % this.opts.length;

        if (Input.interact()) {
            const selected = this.opts[this.cur];
            if (selected === 'ステータス') {
                this.sub = 'status';
            } else if (selected === 'セーブ') {
                this.handleSave();
            } else if (selected === '閉じる') {
                this.close();
            }
        }
        if (Input.cancel()) this.close();
    },

    handleSave() {
        if (SaveSystem.save()) {
            this.message = 'セーブしました。';
        } else {
            this.message = 'セーブに失敗しました。';
        }
    },

    render(ctx) {
        if (!this.visible) return;

        // Submenu: Status
        if (this.sub === 'status') {
            this.renderStatus(ctx);
        }
        // Main Menu
        else {
            Draw.rect(ctx, 160, 16, 88, 80, 'rgba(0,0,40,0.95)');
            Draw.stroke(ctx, 160, 16, 88, 80, '#fff', 2);
            for (let i = 0; i < this.opts.length; i++) {
                const y = 26 + i * 22;
                if (i === this.cur) Draw.text(ctx, '▶', 168, y, '#fc0', 12);
                Draw.text(ctx, this.opts[i], 184, y, '#fff', 12);
            }
        }

        if (this.message) {
            const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;
            Draw.rect(ctx, 20, VH - 50, VW - 40, 40, 'rgba(0,0,40,0.95)');
            Draw.stroke(ctx, 20, VH - 50, VW - 40, 40, '#fff', 2);
            Draw.text(ctx, this.message, 30, VH - 40, '#fff', 12);
        }
    },

    renderStatus(ctx) {
        // Use PlayerStats2
        // PlayerStats2 stores stats differently (hiddenExp etc)
        // We can use helper getDisplayStats()
        const s = PlayerStats2.getDisplayStats();

        Draw.rect(ctx, 16, 16, 160, 200, 'rgba(0,0,40,0.95)');
        Draw.stroke(ctx, 16, 16, 160, 200, '#fff', 2);

        Draw.text(ctx, '【ステータス】X/Escで戻る', 24, 24, '#fc0', 10);
        Draw.text(ctx, s.name, 24, 44, '#fff', 12);
        // Level is hidden in Loop 2 explicitly per PlayerStats2.getDisplayStats
        // Draw.text(ctx, `Lv: ???`, 24, 62, '#fff', 12);

        Draw.text(ctx, `HP: ${s.hp}/${s.maxHp}`, 24, 62, '#8f8', 12); // Shifted up since no level
        Draw.text(ctx, `MP: ${s.mp}/${s.maxMp}`, 24, 80, '#8cf', 12);

        Draw.text(ctx, `ATK: ${s.atk}`, 24, 98, '#f88', 12);
        Draw.text(ctx, `DEF: ${s.def}`, 90, 98, '#88f', 12);

        Draw.text(ctx, `MATK: ${s.matk}`, 24, 116, '#f8f', 12);
        Draw.text(ctx, `MDEF: ${s.mdef}`, 90, 116, '#8ff', 12);

        Draw.text(ctx, `Gold: ${s.gold}G`, 24, 134, '#ff0', 12);

        // Weapon (Loop 2 weapon is simple object or null)
        const weaponName = PlayerStats2.weapon ? PlayerStats2.weapon.name : 'なし';
        Draw.text(ctx, `武器: ${weaponName}`, 24, 152, '#fff', 10);

        // Party Members (Simple listing)
        Draw.text(ctx, '【仲間】', 24, 175, '#fc0', 10);
        Party2.members.forEach((m, i) => {
            Draw.text(ctx, `${m.name} [HP:${m.hp}]`, 24, 190 + i * 15, '#ccc', 10);
        });
    }
};
