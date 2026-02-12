import { PlayerStats } from './player.js';
import { Inventory as Inv } from './inventory.js'; // Assuming Inventory export
import { Maps } from './systems/maps/manager.js';

// ===========================================
// チェックポイント
// ===========================================
export const Checkpoint = {
    saved: false,
    data: null,

    save(player) {
        this.data = {
            hp: PlayerStats.hp,
            mp: PlayerStats.mp,
            level: PlayerStats.level,
            atk: PlayerStats.atk,
            def: PlayerStats.def,
            // Save base stats
            baseMaxHp: PlayerStats.baseMaxHp,
            baseMaxMp: PlayerStats.baseMaxMp,
            baseAtk: PlayerStats.baseAtk,
            baseDef: PlayerStats.baseDef,
            baseMatk: PlayerStats.baseMatk,
            baseMdef: PlayerStats.baseMdef,
            // Save equipment
            equipment: { ...PlayerStats.equipment },

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

        // Restore base stats first
        PlayerStats.baseMaxHp = this.data.baseMaxHp || 30;
        PlayerStats.baseMaxMp = this.data.baseMaxMp || 10;
        PlayerStats.baseAtk = this.data.baseAtk || 8;
        PlayerStats.baseDef = this.data.baseDef || 4;
        PlayerStats.baseMatk = this.data.baseMatk || 6;
        PlayerStats.baseMdef = this.data.baseMdef || 3;

        PlayerStats.equipment = this.data.equipment || { weapon: null, armor: null, accessory: null };

        PlayerStats.hp = this.data.hp;
        PlayerStats.mp = this.data.mp;
        PlayerStats.level = this.data.level;
        PlayerStats.exp = this.data.exp;
        PlayerStats.gold = this.data.gold;
        Inv.items = { ...this.data.items };
        player.x = this.data.x;
        player.y = this.data.y;
        Maps.current = this.data.map || 'village';

        // Recalculate derived stats to be safe (atk, def etc)
        PlayerStats.recalcStats();

        // Override with saved current hp/mp (recalc resets hp/mp to max? No, recalc caps them)
        // Recalc sets hp/mp to min(current, max). 
        // We want to restore exact HP from save (which might be low).
        PlayerStats.hp = this.data.hp;
        PlayerStats.mp = this.data.mp;

        return true;
    },

    clear() {
        this.saved = false;
        this.data = null;
    }
};
