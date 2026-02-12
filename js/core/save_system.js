import { WorldState } from '../loop1/world.js';
import { WorldState2 } from '../loop2/world.js';
import { PlayerStats2 } from '../loop2/player.js';
import { Party2 } from '../loop2/party.js';
import { QuestSystem2 } from '../loop2/quest.js';
import { Battle2 } from '../loop2/systems/battle/core.js';
import { Maps } from '../loop1/systems/maps/manager.js';
import { Camera } from './camera.js';
import { PartyMemberData2 } from '../loop2/data/companions.js';

// ===========================================
// セーブシステム (Loop 2以降専用・10スロット)
// ===========================================
export const SaveSystem = {
    KEY_BASE: 'dot_world_save_',
    game: null,

    init(game) {
        this.game = game;
    },

    // 特定のスロットにセーブデータがあるか
    hasSave(slot = 0) {
        return !!localStorage.getItem(this.KEY_BASE + slot);
    },

    // セーブデータリスト取得（メタデータのみ）
    getSaveList() {
        const list = [];
        for (let i = 0; i < 10; i++) {
            const json = localStorage.getItem(this.KEY_BASE + i);
            if (json) {
                try {
                    const data = JSON.parse(json);
                    list.push({
                        slot: i,
                        exists: true,
                        timestamp: data.timestamp,
                        week: data.week,
                        name: data.player.name, // Player name
                        hp: data.player.hp,
                        maxHp: data.player.maxHp,
                        map: (data.map && data.map.id) ? data.map.id : 'unknown'
                    });
                } catch (e) {
                    list.push({ slot: i, exists: false, error: true });
                }
            } else {
                list.push({ slot: i, exists: false });
            }
        }
        return list;
    },

    save(slot = 0) {
        if (WorldState.week !== 2) {
            console.warn('Save is only available in Week 2');
            return false;
        }

        const data = {
            version: 1,
            timestamp: Date.now(),
            week: WorldState.week,

            // World State
            world: {
                truthFlags: { ...WorldState.truthFlags },
                absorbedStats: WorldState.absorbedStats ? { ...WorldState.absorbedStats } : null
            },

            // Loop 2 World State
            world2: {
                trueBosses: { ...WorldState2.trueBosses },
                trueDemonKingDefeated: WorldState2.trueDemonKingDefeated
            },

            // Player Stats
            player: {
                name: PlayerStats2.name,
                hp: PlayerStats2.hp,
                maxHp: PlayerStats2.maxHp,
                mp: PlayerStats2.mp,
                maxMp: PlayerStats2.maxMp,
                atk: PlayerStats2.atk,
                def: PlayerStats2.def,
                matk: PlayerStats2.matk,
                mdef: PlayerStats2.mdef,
                gold: PlayerStats2.gold,
                hiddenExp: PlayerStats2.hiddenExp,
                weapon: PlayerStats2.weapon, // Object or null
                status: { ...PlayerStats2.status },
                spells: { ...PlayerStats2.spells },
                magicBoost: PlayerStats2.magicBoost
            },

            // Party
            party: Party2.members.map(m => ({
                id: m.id,
                hp: m.hp, maxHp: m.maxHp,
                mp: m.mp, maxMp: m.maxMp,
                atk: m.atk, def: m.def,
                matk: m.matk, mdef: m.mdef,
                hiddenExp: m.hiddenExp
            })),

            // Quests & Flags
            quest: {
                killCount: { ...QuestSystem2.killCount },
                completed: { ...QuestSystem2.completed },
                departed: { ...QuestSystem2.departed }
            },

            // Map Location
            map: {
                id: Maps.current,
                x: this.game.player.x,
                y: this.game.player.y,
                dir: this.game.player.dir
            }
        };

        try {
            localStorage.setItem(this.KEY_BASE + slot, JSON.stringify(data));
            console.log(`Game Saved to Slot ${slot}`, data);
            return true;
        } catch (e) {
            console.error('Save Failed', e);
            return false;
        }
    },

    load(slot = 0) {
        const json = localStorage.getItem(this.KEY_BASE + slot);
        if (!json) return false;

        try {
            const data = JSON.parse(json);

            // Restore World State
            WorldState.week = data.week;
            WorldState.truthFlags = data.world.truthFlags;
            WorldState.absorbedStats = data.world.absorbedStats;

            // Restore Loop 2 World State
            if (data.world2) {
                WorldState2.trueBosses = data.world2.trueBosses;
                WorldState2.trueDemonKingDefeated = data.world2.trueDemonKingDefeated;
            }

            // Initialize Week 2 Managers FIRST
            WorldState.managers.player = PlayerStats2;
            WorldState.managers.party = Party2;
            WorldState.managers.inventory = null;
            WorldState.managers.battle = Battle2;

            // Initialize Week 2 Maps
            if (window.Maps && window.Maps.initWeek2) {
                window.Maps.initWeek2();
            }

            // Restore Player Stats
            const p = data.player;
            PlayerStats2.name = p.name || '勇者';
            PlayerStats2.hp = p.hp; PlayerStats2.maxHp = p.maxHp;
            PlayerStats2.mp = p.mp; PlayerStats2.maxMp = p.maxMp;
            PlayerStats2.atk = p.atk; PlayerStats2.def = p.def;
            PlayerStats2.matk = p.matk; PlayerStats2.mdef = p.mdef;
            PlayerStats2.gold = p.gold;
            PlayerStats2.hiddenExp = p.hiddenExp;
            PlayerStats2.status = p.status;
            PlayerStats2.spells = p.spells;
            PlayerStats2.magicBoost = p.magicBoost;
            PlayerStats2.weapon = p.weapon || null;

            // Restore Party
            Party2.members = [];
            if (data.party) {
                data.party.forEach(savedMember => {
                    // Re-add using base data to get skills/name etc, then override stats
                    // We bypass add() checks to ensure restoration even if criteria changed?
                    // But we need the base data.
                    const baseData = PartyMemberData2[savedMember.id];
                    if (baseData) {
                        Party2.members.push({
                            ...baseData,
                            hp: savedMember.hp, maxHp: savedMember.maxHp,
                            mp: savedMember.mp, maxMp: savedMember.maxMp,
                            atk: savedMember.atk, def: savedMember.def,
                            matk: savedMember.matk, mdef: savedMember.mdef,
                            hiddenExp: savedMember.hiddenExp
                        });
                    }
                });
            }

            // Restore Quests
            if (data.quest) {
                QuestSystem2.killCount = data.quest.killCount || {};
                QuestSystem2.completed = data.quest.completed || {};
                QuestSystem2.departed = data.quest.departed || {};
            }

            // Restore Map
            Maps.current = data.map.id;
            if (this.game) {
                this.game.player.x = data.map.x;
                this.game.player.y = data.map.y;
                this.game.player.dir = data.map.dir;

                // Update Camera
                const m = Maps.get();
                if (m) {
                    Camera.update(this.game.player.x, this.game.player.y, m.w, m.h);
                }
            }

            return true;
        } catch (e) {
            console.error('Load Failed', e);
            return false;
        }
    },

    loadLatest() {
        const list = this.getSaveList();
        const validSaves = list.filter(s => s.exists);
        if (validSaves.length === 0) return false;

        // Sort by timestamp descending
        validSaves.sort((a, b) => b.timestamp - a.timestamp);
        return this.load(validSaves[0].slot);
    },

    clear() {
        // Clear all slots
        for (let i = 0; i < 10; i++) {
            localStorage.removeItem(this.KEY_BASE + i);
        }
    }
};


