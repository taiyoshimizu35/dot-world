import { Msg } from '../../core/message.js';
import { FX } from '../../core/effects.js';
import { PlayerStats2 } from '../player.js';
import { Battle2 } from './battle/core.js';
import { SaveMenu } from './menu.js';
import { Party2 } from '../party.js';
import { QuestSystem2, StoryFlags } from '../quest.js';
import { PartyMemberData2 } from '../data/companions.js';
import { Inventory2 } from '../inventory.js';

import { ShopSystem2 } from './shop.js';

export class InteractionSystem2 {
    constructor(worldState) {
        this.worldState = worldState;
    }

    handle(npc, player) {
        // ---------------------------------------------------------
        // 1. 前提条件チェック (reqFlag)
        // ---------------------------------------------------------
        if (npc.reqFlag && !QuestSystem2.has(npc.reqFlag)) {
            // 前提未達時のメッセージがあれば表示、なければ反応なし
            if (npc.reqMsg) Msg.show(npc.reqMsg);
            return;
        }

        // ---------------------------------------------------------
        // 2. 完了済みチェック (setFlag が既に立っている場合)
        // ---------------------------------------------------------
        if (npc.setFlag && QuestSystem2.has(npc.setFlag) && !npc.repeatable) {
            // 完了後メッセージ
            if (npc.afterMsg) Msg.show(npc.afterMsg);
            else Msg.show('……。'); // デフォルト
            return;
        }

        // ---------------------------------------------------------
        // 3. タイプ別処理
        // ---------------------------------------------------------

        // --- 仲間 (Companion) ---
        if (npc.type === 'companion' || npc.partyJoin) {
            this.handleCompanion(npc);
            return;
        }

        // --- ボス (Boss) ---
        if (npc.type === 'boss' || npc.areaBoss) {
            this.handleBoss(npc);
            return;
        }

        // --- イベント (Event) ---
        if (npc.type === 'event') {
            this.handleEvent(npc);
            return;
        }

        // --- 施設 (Shop, Inn, Save) ---
        if (npc.type === 'shop' || npc.shop) {
            ShopSystem2.open();
            return;
        }
        if (npc.type === 'inn' || npc.inn) {
            this.handleInn(npc);
            return;
        }
        if (npc.type === 'save' || npc.savePoint) {
            this.handleSave(npc);
            return;
        }

        // --- 通常会話 (Default) ---
        if (npc.msg) {
            Msg.show(npc.msg);
        }
    }

    // ---------------------------------------------------------
    // ハンドラー実装
    // ---------------------------------------------------------

    handleEvent(npc) {
        // メッセージ表示 -> フラグセット
        Msg.show(npc.msg, () => {
            if (npc.setFlag) {
                QuestSystem2.set(npc.setFlag);
                // 報酬などがあればここで処理
                if (npc.reward) {
                    this.giveReward(npc.reward);
                }
            }
        });
    }

    handleBoss(npc) {
        const bossId = npc.bossId || npc.areaBoss; // 互換性
        if (!bossId) return;

        if (npc.demonKing) {
            const isTrueEnd = Party2.isMember('rin') && Party2.isMember('elena') && Party2.isMember('aldo');

            if (isTrueEnd) {
                Msg.show('（広間の中央に、かつての仲間たちの遺品が落ちている……）\nルルシア「……ここまでですね。勇者様。」\nルルシア「失った私の力も、贵方の魔剣も十分に育ちました。さあ……」', () => {
                    Msg.show('リン「姉さんの遺品……！ あなたが魔王だったのね！」\nエレナ「ご先祖様の仇……絶対ここで討つ！」\nアルド「俺たちの剣で、過去の因縁を断ち切る！」\nルルシア「フフッ……面白い。ならばその力、見せてもらいましょうか！」', () => {
                        Battle2.startTrueDemonKing();
                    });
                });
            } else {
                Msg.show('（広間の中央に、かつての仲間たちの遺品が落ちている……）\nルルシア「……ここまでですね。勇者様。」\nルルシア「失った私の力も、貴方の魔剣も十分に育ちました。さあ……」', () => {
                    const cheerMsgs = [];
                    Party2.members.forEach(m => {
                        if (m.id !== 'lulusia' && m.id !== 'hero') {
                            cheerMsgs.push(`${m.name}「過去のことは関係ない！ 私たちでも魔王は倒せる。今度は私たちがお前の仲間だ！」`);
                        }
                    });

                    if (cheerMsgs.length > 0) {
                        Msg.show(cheerMsgs.join('\n') + '\n勇者（みんな……！）\nルルシア「無駄な足掻きを……消え去りなさい！」', () => {
                            Battle2.startTrueDemonKing();
                        });
                    } else {
                        Msg.show('勇者「仲間の遺志は……俺が継ぐ！」\nルルシア「愚かな……消え去りなさい！」', () => {
                            Battle2.startTrueDemonKing();
                        });
                    }
                });
            }
            return;
        }

        Msg.choice('強大な気配を感じる……挑みますか？', ['挑む', 'やめる'], (idx) => {
            if (idx === 0) {
                // 戦闘開始
                // Battle2側で勝利時に setFlag するロジックが必要
                // ここではボスIDを渡して開始
                Battle2.startTrueBoss(bossId);
            }
        });
    }

    handleCompanion(npc) {
        const memberId = npc.memberId || npc.partyJoin;
        const data = PartyMemberData2[memberId];
        if (!data) return;

        // すでに仲間の場合は完了メッセージ (上の完了チェックで弾かれる場合が多いが念のため)
        if (Party2.isMember(memberId)) {
            Msg.show(data.messages.join_after || '「よろしく頼む」');
            return;
        }

        // 加入条件チェック
        if (!this.checkJoinCondition(data.joinCondition)) {
            // 条件未達メッセージ (データにあれば使う、なければ汎用)
            Msg.show(npc.hintMsg || data.messages.reject || '「まだその時ではないようだ……」');
            return;
        }

        // 勧誘
        const joinMsg = npc.msg || data.messages.join || '仲間になる？';
        Msg.choice(joinMsg, ['仲間として誘う', 'やめる'], (idx) => {
            if (idx === 0) {
                if (Party2.add(memberId)) {
                    Msg.show(`${data.name}が仲間になった！`);
                    // フラグセット (仲間加入フラグ)
                    QuestSystem2.set(`${memberId}_joined`);

                    // コスト支払い (gold/item)
                    this.payJoinCost(data.joinCondition);
                }
            }
        });
    }

    // 加入条件チェック
    checkJoinCondition(cond) {
        if (!cond) return true; // 条件なし
        if (cond.type === 'auto') return true; // イベント自動加入など
        if (cond.type === 'event') {
            // クエストフラグなどで判定
            // interaction側で 'met_king' などをチェック済みであることを想定するか、
            // ここで QuestSystem2.has(cond.id) をチェックするか。
            // ここでは cond.id をフラグ名としてチェックする
            return QuestSystem2.has(cond.id);
        }
        if (cond.type === 'gold') {
            return PlayerStats2.gold >= cond.value;
        }
        if (cond.type === 'item') {
            return Inventory2.hasItem(cond.value);
        }
        return true;
    }

    payJoinCost(cond) {
        if (!cond) return;
        if (cond.type === 'gold') {
            PlayerStats2.spendGold(cond.value);
        }
        if (cond.type === 'item') {
            Inventory2.removeItem(cond.value);
        }
    }

    handleInn(npc) {
        const cost = Math.max(1, Math.floor(PlayerStats2.gold * 0.05)); // 所持金の5%
        Msg.choice(`宿屋だ。泊まるか？ (${cost}G)`, ['はい', 'いいえ'], (idx) => {
            if (idx === 0) {
                if (PlayerStats2.spendGold(cost)) {
                    FX.fadeOut(() => {
                        PlayerStats2.fullRestore();
                        Party2.fullHealAll();
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

    handleSave(npc) {
        Msg.choice('女神像だ。記録しますか？', ['はい', 'いいえ'], (idx) => {
            if (idx === 0) {
                this.worldState.changeState('save');
            }
        });
    }

    giveReward(reward) {
        if (reward.gold) {
            PlayerStats2.addGold(reward.gold);
            Msg.show(`${reward.gold}Gを手に入れた！`);
        }
        if (reward.item) {
            Inventory2.addItem(reward.item);
            Msg.show(`${reward.item}を手に入れた！`); // 本来はアイテム名解決が必要
        }
    }
}
