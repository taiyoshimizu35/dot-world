// ===========================================
// チェックポイント
// ===========================================
const Checkpoint = {
    saved: false,
    data: null,

    save(player) {
        this.data = {
            hp: PlayerStats.hp,
            mp: PlayerStats.mp,
            level: PlayerStats.level,
            atk: PlayerStats.atk,
            def: PlayerStats.def,
            baseDef: PlayerStats.baseDef,
            exp: PlayerStats.exp,
            gold: PlayerStats.gold,
            items: { ...Inv.items },
            x: player.x,
            y: player.y,
            map: Maps.current
        };
        this.saved = true;
    },

    restore(player) {
        if (!this.data) return false;
        PlayerStats.hp = this.data.hp;
        PlayerStats.mp = this.data.mp;
        PlayerStats.level = this.data.level;
        PlayerStats.atk = this.data.atk;
        PlayerStats.def = this.data.def;
        PlayerStats.baseDef = this.data.baseDef || this.data.def;
        PlayerStats.exp = this.data.exp;
        PlayerStats.gold = this.data.gold;
        Inv.items = { ...this.data.items };
        player.x = this.data.x;
        player.y = this.data.y;
        Maps.current = this.data.map || 'village';
        return true;
    },

    clear() {
        this.saved = false;
        this.data = null;
    }
};
