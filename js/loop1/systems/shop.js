// ===========================================
// ショップUI
// ===========================================
const Shop = {
    visible: false, cur: 0, scroll: 0, maxVisible: 5, warning: null, shopType: 'normal',

    open(type = 'normal') {
        this.visible = true;
        this.cur = 0;
        this.scroll = 0;
        this.warning = null;
        this.shopType = type;
        currentState = GameState.SHOP;
        Input.lock(200);
    },

    close() {
        this.visible = false;
        this.warning = null;
        currentState = GameState.PLAYING;
        Input.lock(150);
    },

    getItems() {
        if (this.shopType === 'magic') return MagicShopData.items;
        if (this.shopType === 'advanced') return AdvancedShopData.items;
        return ShopData.items;
    },

    update() {
        if (!this.visible) return;
        if (this.warning) {
            if (Input.interact() || Input.cancel()) this.warning = null;
            return;
        }
        const items = this.getItems();
        if (Input.justPressed('ArrowUp')) {
            this.cur = (this.cur - 1 + items.length) % items.length;
            if (this.cur < this.scroll) this.scroll = this.cur;
            if (this.cur >= this.scroll + this.maxVisible) this.scroll = this.cur - this.maxVisible + 1;
            if (this.cur === items.length - 1) this.scroll = Math.max(0, items.length - this.maxVisible);
        }
        if (Input.justPressed('ArrowDown')) {
            this.cur = (this.cur + 1) % items.length;
            if (this.cur >= this.scroll + this.maxVisible) this.scroll = this.cur - this.maxVisible + 1;
            if (this.cur < this.scroll) this.scroll = this.cur;
            if (this.cur === 0) this.scroll = 0;
        }
        if (Input.interact()) this.buy();
        if (Input.cancel()) this.close();
    },

    buy() {
        const item = this.getItems()[this.cur];
        const uniqueTypes = ['weapon', 'armor', 'spell', 'staff', 'robe', 'amulet', 'holySword'];
        if (item.sold && uniqueTypes.includes(item.type)) { this.warning = 'SOLD OUT!'; return; }
        if (PlayerStats.gold < item.price) { this.warning = 'ゴールドが足りない！'; return; }
        PlayerStats.spendGold(item.price);

        if (item.type === 'item') {
            Inv.add(item.name);
            Msg.show(`${item.name}を購入した！`);
        } else if (item.type === 'weapon') {
            PlayerStats.atk += item.atk;
            item.sold = true;
            if (item.name === '鋼の剣') QuestFlags.hasSword = true;
            QuestFlags.check();
            Msg.show(`${item.name}を装備した！\n攻撃力+${item.atk}！`);
        } else if (item.type === 'holySword') {
            // WEAPON_DECEPTION: 聖剣購入処理
            PlayerStats.atk += item.atk;
            gameLoop.holySwordOwned = true;
            item.sold = true;
            Msg.show(`${item.name}を装備した！\n攻撃力+${item.atk}！\n「これで魔王を倒せる…！」`);
        } else if (item.type === 'armor') {
            PlayerStats.def += item.def;
            PlayerStats.baseDef = PlayerStats.def;
            item.sold = true;
            Msg.show(`${item.name}を装備した！\n防御力+${item.def}！`);
        } else if (item.type === 'spell') {
            PlayerStats.spells[item.spell] = true;
            item.sold = true;
            Msg.show(`${item.name}を読んだ！\n習得した！`);
        } else if (item.type === 'staff') {
            PlayerStats.atk += item.atk;
            PlayerStats.magicBoost = item.magicBoost;
            item.sold = true;
            Msg.show(`${item.name}を装備した！`);
        } else if (item.type === 'robe') {
            PlayerStats.def += item.def;
            PlayerStats.baseDef = PlayerStats.def;
            PlayerStats.maxMp += item.maxMp;
            PlayerStats.mp += item.maxMp;
            item.sold = true;
            Msg.show(`${item.name}を装備した！`);
        } else if (item.type === 'amulet') {
            QuestFlags.hasAmulet = true;
            QuestFlags.check();
            item.sold = true;
            Msg.show(`${item.name}を入手した！`);
        }
        this.close();
    },

    render(ctx) {
        if (!this.visible) return;
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;
        Draw.rect(ctx, 20, 20, VW - 40, VH - 40, 'rgba(0,0,40,0.95)');
        Draw.stroke(ctx, 20, 20, VW - 40, VH - 40, '#fff', 2);
        let title = '【ショップ】';
        if (this.shopType === 'magic') title = '【魔法ショップ】';
        else if (this.shopType === 'advanced') title = '【上級ショップ】';
        Draw.text(ctx, title, 32, 28, '#fc0', 14);
        Draw.text(ctx, `所持金: ${PlayerStats.gold}G`, VW - 120, 28, '#ff0', 12);

        const items = this.getItems();
        let y = 52;
        for (let i = this.scroll; i < Math.min(this.scroll + this.maxVisible, items.length); i++) {
            const item = items[i];
            const isSoldOut = item.sold && ['weapon', 'armor', 'spell', 'staff', 'robe', 'amulet'].includes(item.type);
            const affordable = PlayerStats.gold >= item.price && !isSoldOut;
            if (i === this.cur) Draw.text(ctx, '▶', 32, y, '#fc0', 12);
            Draw.text(ctx, item.name, 48, y, affordable ? '#fff' : '#666', 12);
            Draw.text(ctx, `${item.price}G`, 140, y, affordable ? '#ff0' : '#664', 12);
            Draw.text(ctx, item.desc, 48, y + 14, isSoldOut ? '#333' : '#aaa', 10);
            y += 32;
        }
    }
};
