// ===========================================
// 2週目クエスト＆ストーリーフラグシステム
// ===========================================

import { Msg } from '../core/message.js';

// クエスト・イベント定数（Typo防止用）
export const StoryFlags = {
    // 進行度
    STARTED: 'story_started',
    MET_KING: 'met_king',

    // エリア攻略
    EAST_BOSS_DEFEATED: 'east_boss_defeated',
    WEST_BOSS_DEFEATED: 'west_boss_defeated',
    SOUTH_BOSS_DEFEATED: 'south_boss_defeated',
    NORTH_BOSS_DEFEATED: 'north_boss_defeated',

    // 重要イベント
    DEMON_CASTLE_OPEN: 'demon_castle_open',
    DEMON_KING_DEFEATED: 'demon_king_defeated',

    // 仲間加入など
    LULUSIA_JOINED: 'lulusia_joined',
    RIN_JOINED: 'rin_joined',
    // ... others
};

export const QuestSystem2 = {
    // フラグ保存用
    flags: {},

    // 進行状況の一括管理（セーブデータに含まれる想定）
    // interaction: { [id]: count } // 何回話したかなど
    interactions: {},

    // フラグ操作
    set(flagId, value = true) {
        if (this.flags[flagId] !== value) {
            this.flags[flagId] = value;
            // console.log(`[Story] Flag Updated: ${flagId} = ${value}`);
        }
    },

    get(flagId) {
        return this.flags[flagId] || false;
    },

    // 便利メソッド
    has(flagId) {
        return !!this.get(flagId);
    },

    // カウンター操作（話した回数や、一時的な討伐数など）
    increment(counterId) {
        if (!this.interactions[counterId]) this.interactions[counterId] = 0;
        this.interactions[counterId]++;
        return this.interactions[counterId];
    },

    getCount(counterId) {
        return this.interactions[counterId] || 0;
    },

    // ストーリー進行チェックユーティリティ
    checkAllBossesDefeated() {
        return this.has(StoryFlags.EAST_BOSS_DEFEATED) &&
            this.has(StoryFlags.WEST_BOSS_DEFEATED) &&
            this.has(StoryFlags.SOUTH_BOSS_DEFEATED) &&
            this.has(StoryFlags.NORTH_BOSS_DEFEATED);
    },

    // 離脱した仲間リスト（Party2から参照されることも考慮しここでも保持、あるいはParty2が正？）
    // Party2側で管理するが、ストーリー上のフラグとしてここにも持つのはあり。
    // 今回はParty2のremoveでQuestSystem2.departedを操作していた仕様を継承。
    departed: {},

    // 初期化
    init() {
        this.flags = {};
        this.interactions = {};
        this.departed = {};

        // デフォルトフラグ
        this.set(StoryFlags.STARTED, true);
        this.set(StoryFlags.LULUSIA_JOINED, true); // 初期メンバー
    },

    // データロード用（セーブ実装時に使用）
    load(data) {
        if (data) {
            this.flags = data.flags || {};
            this.interactions = data.interactions || {};
            this.departed = data.departed || {};
        }
    },

    getSaveData() {
        return {
            flags: this.flags,
            interactions: this.interactions,
            departed: this.departed
        };
    }
};
