import { Party2 } from './party.js';
import { ItemData2 } from './data/items.js';
import { PlayerStats2 } from './player.js';
import { Msg } from '../core/message.js'; // For effect messages if needed, or handle in Menu

export const Inventory2 = {
    items: [],

    // 基本容量 + 仲間1人につき+5
    getCapacity() {
        return 10 + (Party2.members.length * 5);
    },

    addItem(itemId) {
        if (this.items.length >= this.getCapacity()) {
            return false; // Full
        }
        // Validate existence?
        if (!ItemData2[itemId]) return false;

        this.items.push(itemId);
        return true;
    },

    removeItem(itemId) {
        const idx = this.items.indexOf(itemId);
        if (idx > -1) {
            this.items.splice(idx, 1);
            return true;
        }
        return false;
    },

    hasItem(itemId) {
        return this.items.includes(itemId);
    },

    // Use item on target (stats object: PlayerStats2 or Party Member)
    useItem(itemId, target) {
        const data = ItemData2[itemId];
        if (!data || data.type !== 'consumable') return { success: false, msg: '使えないアイテムだ。' };

        const effect = data.effect;
        let success = false;
        let msg = '';

        if (effect.type === 'heal') {
            const oldHp = target.hp;
            target.hp = Math.min(target.maxHp, target.hp + effect.value);
            const healed = target.hp - oldHp;
            if (healed > 0) {
                success = true;
                msg = `${target.name}のHPが${healed}回復した！`;
            } else {
                msg = `${target.name}のHPは満タンだ。`;
            }
        } else if (effect.type === 'heal_sp') {
            const oldSp = target.sp;
            target.sp = Math.min(target.maxSp, target.sp + effect.value);
            const healed = target.sp - oldSp;
            if (healed > 0) {
                success = true;
                msg = `${target.name}のSPが${healed}回復した！`;
            } else {
                msg = `${target.name}のSPは満タンだ。`;
            }
        } else if (effect.type === 'cure_status') {
            // Note: Status structure might differ between P1/P2? 
            // PlayerStats2.status = { poisonVal: 0 ... }
            // Assuming simplified status for now
            if (effect.status === 'poison' && target.status && target.status.poisonVal > 0) {
                target.status.poisonVal = 0;
                success = true;
                msg = `${target.name}の毒が消えた！`;
            } else {
                msg = `効果がなかった。`;
            }
        }

        if (success) {
            this.removeItem(itemId);
        }

        return { success, msg };
    },

    // 初期化
    init() {
        this.items = [];
    }
};
