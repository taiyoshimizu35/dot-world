
import { Msg } from '../../core/message.js';
import { FX } from '../../core/effects.js';
import { PlayerStats2 } from '../player.js';
import { Battle2 } from './battle/core.js';
import { SaveMenu } from './menu.js';
import { Party2 } from '../party.js';

import { PartyMemberData2 } from '../data/companions.js';

export class InteractionSystem2 {
    constructor(worldState) {
        this.worldState = worldState;
    }

    handle(npc, player) {
        // Week restriction check
        if (npc.week1Only) return;
        if (npc.week2Only && this.worldState.week !== 2) return;

        if (npc.partyJoin) {
            const party = this.worldState.managers.party;
            const data = PartyMemberData2[npc.partyJoin];

            // 既に仲間の場合
            if (party && party.isMember(npc.partyJoin)) {
                const joinedMsg = npc.joinedMsg || (data && data.messages && data.messages.join_after) || '「よろしく頼む」';
                Msg.show(joinedMsg);
                return;
            }

            // 勧誘メッセージ
            const joinMsg = npc.msg || (data && data.messages && data.messages.join) || '仲間になる？';

            Msg.choice(joinMsg, ['仲間として誘う', 'やめる'], (idx) => {
                if (idx === 0) {
                    if (party) {
                        if (party.add(npc.partyJoin)) {
                            Msg.show(`${data ? data.name : npc.name}が仲間になった！`);
                        }
                    }
                }
            });
            return;
        }

        if (npc.areaBoss) {
            Battle2.startTrueBoss(npc.areaBoss);
            return;
        }

        if (npc.demonKing) {
            Battle2.startTrueDemonKing();
            return;
        }

        // Loop 2 Shops
        if (npc.savePoint) {
            Msg.choice('女神像だ。', ['記録する', '仲間募集中(Debug)', 'やめる'], (idx) => {
                if (idx === 0) {
                    this.worldState.changeState('save');
                } else if (idx === 1) {
                    const party = this.worldState.managers.party;
                    if (party) {
                        if (party.add('warrior')) Msg.show('戦士が仲間になった！');
                        else Msg.show('これ以上仲間にならない、または既にいる。');
                    }
                }
            });
            return;
        }

        if (npc.shop || npc.magicShop || npc.advancedShop) {
            Msg.show('「いらっしゃいませ。まだ準備中です」');
        }
        else if (npc.inn) {
            const cost = Math.max(1, Math.floor(PlayerStats2.gold * 0.05));
            Msg.choice(`宿屋だ。泊まるか？ (${cost}G)`, ['はい', 'いいえ'], (idx) => {
                if (idx === 0) {
                    if (PlayerStats2.spendGold(cost)) {
                        FX.fadeOut(() => {
                            PlayerStats2.fullRestore();
                            const party = this.worldState.managers.party;
                            if (party) party.fullHealAll();

                            FX.fadeIn(() => {
                                Msg.show('体力が回復した！');
                            });
                        });
                    } else {
                        Msg.show('お金が足りないようだ。');
                    }
                }
            });
        }
        else if (npc.savePoint) {
            SaveMenu.open();
        }
        else if (npc.msg) {
            Msg.show(npc.msg);
        }
    }
}
