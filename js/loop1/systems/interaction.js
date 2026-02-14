
import { Msg } from '../../core/message.js';
import { PlayerStats } from '../player.js';
import { QuestSystem as QuestFlags } from '../quest.js';

export class InteractionSystem {
    constructor(worldState) {
        this.worldState = worldState;
    }

    handle(npc, player) {
        // Week restriction check
        if (npc.week1Only && this.worldState.week !== 1) return;
        if (npc.week2Only && this.worldState.week !== 2) return;

        if (npc.partyJoin) {
            if (npc.msg) Msg.show(npc.msg);
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
            if (QuestFlags.allBossesDefeated()) {
                Msg.show('「四天王を倒したのか！？\n魔王様を倒しに行けるな！」');
            } else {
                Msg.show(`魔王様はずっと北にいるらしい。\n四天王を倒してから行ってみたらどうだい？`);
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
