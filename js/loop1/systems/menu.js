// ===========================================
// メニュー
// ===========================================
const Menu = {
    visible: false, cur: 0, sub: null, itemCur: 0, message: null,
    opts: ['アイテム', 'ステータス', '閉じる'],

    open() {
        this.visible = true;
        this.cur = 0;
        this.sub = null;
        this.itemCur = 0;
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

        // メッセージ表示中
        if (this.message) {
            if (Input.interact() || Input.cancel()) this.message = null;
            return;
        }

        // サブメニュー操作
        if (this.sub === 'items') {
            const items = Inv.list();
            if (items.length === 0) {
                if (Input.cancel()) { this.sub = null; Input.lock(150); }
                return;
            }
            if (Input.justPressed('ArrowUp')) this.itemCur = (this.itemCur - 1 + items.length) % items.length;
            if (Input.justPressed('ArrowDown')) this.itemCur = (this.itemCur + 1) % items.length;
            if (Input.interact()) this.useItem(items[this.itemCur][0]);
            if (Input.cancel()) { this.sub = null; Input.lock(150); }
            return;
        }
        if (this.sub === 'status') {
            if (Input.cancel()) { this.sub = null; Input.lock(150); }
            return;
        }

        // メインメニュー
        if (Input.justPressed('ArrowUp')) this.cur = (this.cur - 1 + 3) % 3;
        if (Input.justPressed('ArrowDown')) this.cur = (this.cur + 1) % 3;
        if (Input.interact()) {
            if (this.cur === 0) { this.sub = 'items'; this.itemCur = 0; }
            else if (this.cur === 1) this.sub = 'status';
            else this.close();
        }
        if (Input.cancel()) this.close();
    },

    useItem(itemName) {
        if (itemName === '薬草') {
            PlayerStats.heal(15); Inv.remove('薬草'); this.message = 'HPが15回復した！';
        } else if (itemName === 'ポーション') {
            PlayerStats.heal(30); Inv.remove('ポーション'); this.message = 'HPが30回復した！';
        } else if (itemName === '上薬草') {
            PlayerStats.heal(60); Inv.remove('上薬草'); this.message = 'HPが60回復した！';
        } else if (itemName === 'エリクサー') {
            PlayerStats.heal(100); Inv.remove('エリクサー'); this.message = 'HPが100回復した！';
        } else if (itemName === '魔力の小瓶') {
            PlayerStats.healMp(10); Inv.remove('魔力の小瓶'); this.message = 'MPが10回復した！';
        } else if (itemName === 'ハイ・エーテル') {
            PlayerStats.healMp(30); Inv.remove('ハイ・エーテル'); this.message = 'MPが30回復した！';
        } else if (itemName === '解毒ポーション') {
            if (PlayerStats.status.poisonVal > 0) {
                PlayerStats.status.poisonVal = 0; Inv.remove('解毒ポーション'); this.message = '毒が治った！';
            } else { this.message = '毒にかかっていない！'; }
        } else if (itemName === '気付け薬') {
            if (PlayerStats.status.silence > 0) {
                PlayerStats.status.silence = 0; Inv.remove('気付け薬'); this.message = '沈黙が治った！';
            } else { this.message = '沈黙にかかっていない！'; }
        } else if (itemName === '力の粉') {
            if (PlayerStats.status.atkDownVal > 0) {
                PlayerStats.atk += PlayerStats.status.atkDownVal;
                PlayerStats.status.atkDownVal = 0; Inv.remove('力の粉'); this.message = '攻撃力が戻った！';
            } else { this.message = '攻撃力は下がっていない！'; }
        } else if (itemName === '守りの霧') {
            if (PlayerStats.status.defDownVal > 0) {
                PlayerStats.def = PlayerStats.baseDef;
                PlayerStats.status.defDownVal = 0; Inv.remove('守りの霧'); this.message = '防御力が戻った！';
            } else { this.message = '防御力は下がっていない！'; }
        } else {
            this.message = 'このアイテムは使えない！';
        }
        const items = Inv.list();
        if (this.itemCur >= items.length) this.itemCur = Math.max(0, items.length - 1);
    },

    render(ctx) {
        if (!this.visible) return;
        Draw.rect(ctx, 160, 16, 88, 80, 'rgba(0,0,40,0.95)');
        Draw.stroke(ctx, 160, 16, 88, 80, '#fff', 2);
        for (let i = 0; i < this.opts.length; i++) {
            const y = 26 + i * 22;
            if (i === this.cur && !this.sub) Draw.text(ctx, '▶', 168, y, '#fc0', 12);
            Draw.text(ctx, this.opts[i], 184, y, '#fff', 12);
        }
        if (this.sub === 'items') this.renderItems(ctx);
        else if (this.sub === 'status') this.renderStatus(ctx);

        if (this.message) {
            const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;
            Draw.rect(ctx, 20, VH - 50, VW - 40, 40, 'rgba(0,0,40,0.95)');
            Draw.stroke(ctx, 20, VH - 50, VW - 40, 40, '#fff', 2);
            Draw.text(ctx, this.message, 30, VH - 40, '#fff', 12);
        }
    },

    renderItems(ctx) {
        const items = Inv.list();
        const boxHeight = Math.max(100, 50 + items.length * 20);
        Draw.rect(ctx, 16, 16, 140, boxHeight, 'rgba(0,0,40,0.95)');
        Draw.stroke(ctx, 16, 16, 140, boxHeight, '#fff', 2);
        Draw.text(ctx, '【持ち物】Zで使用 X/Escで戻る', 24, 24, '#fc0', 10);
        if (items.length === 0) {
            Draw.text(ctx, '何も持っていない', 24, 48, '#888', 12);
        } else {
            let y = 44;
            for (let i = 0; i < items.length; i++) {
                const [n, c] = items[i];
                if (i === this.itemCur) Draw.text(ctx, '▶', 24, y, '#fc0', 12);
                Draw.text(ctx, `${n} x${c}`, 38, y, '#fff', 12);
                y += 20;
            }
        }
    },

    renderStatus(ctx) {
        // DECEPTION_LOGIC: 表示用の偽装されたステータスを取得
        const s = PlayerStats.getDisplayStats();
        Draw.rect(ctx, 16, 16, 140, 190, 'rgba(0,0,40,0.95)');
        Draw.stroke(ctx, 16, 16, 140, 190, '#fff', 2);
        Draw.text(ctx, '【ステータス】X/Escで戻る', 24, 24, '#fc0', 10);
        Draw.text(ctx, s.name, 24, 44, '#fff', 12);
        Draw.text(ctx, `Lv: ${s.level}`, 24, 62, '#fff', 12);
        Draw.text(ctx, `HP: ${s.hp}/${s.maxHp}`, 24, 80, '#8f8', 12);
        Draw.text(ctx, `MP: ${s.mp}/${s.maxMp}`, 24, 98, '#8cf', 12);
        Draw.text(ctx, `ATK: ${s.atk}`, 24, 116, '#f88', 12);
        Draw.text(ctx, `DEF: ${s.def}`, 90, 116, '#88f', 12);
        Draw.text(ctx, `MATK: ${s.matk}`, 24, 134, '#f8f', 12);
        Draw.text(ctx, `MDEF: ${s.mdef}`, 90, 134, '#8ff', 12);
        Draw.text(ctx, `EXP: ${s.exp}/${s.nextExp}`, 24, 152, '#ccc', 12);
        Draw.text(ctx, `Gold: ${s.gold}G`, 24, 170, '#ff0', 12);
    }
};
