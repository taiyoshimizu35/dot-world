
import { Msg } from '../../core/message.js';
import { PlayerStats } from '../player.js';
import { QuestSystem as QuestFlags } from '../quest.js';
import { SaveSystem } from '../../core/save_system.js';

export class InteractionSystem {
    constructor(worldState) {
        this.worldState = worldState;
    }

    handle(npc, player) {
        console.log('Interaction handle:', npc);
        // Week restriction check
        if (npc.week1Only && this.worldState.week !== 1) return;
        if (npc.week2Only && this.worldState.week !== 2) return;

        if (npc.partyJoin) {
            if (npc.msg) Msg.show(npc.msg);
            return;
        }

        if (npc.savePoint) {
            Msg.choice('女神像がある。\n記録しますか？', ['はい', 'いいえ'], (idx) => {
                if (idx === 0) {
                    this.worldState.changeState('save');
                }
            });
            return;
        }

        if (npc.areaBoss) {
            // Simplified boss check
            if (QuestFlags.bosses[npc.areaBoss]) {
                // Already defeated
            } else {
                const battle = this.worldState.managers.battle;
                if (battle) {
                    battle.playerRef = { x: player.x, y: player.y };
                    battle.startAreaBoss(npc.areaBoss);
                }
            }
            return;
        }

        if (npc.demonGuide) {
            if (QuestFlags.hasHolySword) {
                Msg.show('「聖剣を手に入れたのか！？\n魔王城へ行く資格はあるだろう。」');
            } else {
                Msg.show(`魔王様はずっと北にいるらしい。\n城門を開くには「聖剣」が必要だ。`);
            }
            return;
        }

        if (npc.demonKing) {
            const battle = this.worldState.managers.battle;
            if (battle && battle.startDemonKing) battle.startDemonKing();
            return;
        }

        // Standard Shops/Inns
        const shop = this.worldState.managers.shop;
        const inn = this.worldState.managers.inn;
        const battle = this.worldState.managers.battle;

        if (npc.shop && shop) shop.open('normal');
        else if (npc.magicShop && shop) shop.open('magic');
        else if (npc.advancedShop && shop) shop.open('advanced');
        else if (npc.inn && inn) {
            const cost = Math.max(1, Math.floor(PlayerStats.gold * 0.05));
            inn.open(cost);
        }
        else if (npc.boss && battle) battle.startBoss();
        else if (npc.westBoss && battle) battle.startWestBoss();
        else if (npc.northBoss && battle) battle.startNorthBoss();
        else if (npc.southBoss && battle) battle.startSouthBoss();
        else if (npc.northMiniboss && battle) {
            if (QuestFlags.northMinibosses && QuestFlags.northMinibosses[npc.northMiniboss]) return;
            battle.startNorthMiniboss(npc.id, npc.northMiniboss);
        }

        else if (npc.msg) Msg.show(npc.msg);
    }
}
