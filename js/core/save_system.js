import { WorldState } from '../loop1/world.js';
import { WorldState2 } from '../loop2/world.js';
import { PlayerStats2 } from '../loop2/player.js';
import { Party2 } from '../loop2/party.js';
import { QuestSystem2 } from '../loop2/quest.js';
import { Battle2 } from '../loop2/systems/battle/core.js';
import { Maps } from '../loop1/systems/maps/manager.js';
import { Camera } from './camera.js';
import { PartyMemberData2 } from '../loop2/data/companions.js';
import { Msg } from './message.js';

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
                    const p = data.player1 || data.player2 || data.player; // Fallback
                    const name = p ? (p.name || '勇者') : '勇者';

                    list.push({
                        slot: i,
                        exists: true,
                        timestamp: data.timestamp,
                        week: data.week,
                        name: name,
                        hp: p ? p.hp : 0,
                        maxHp: p ? p.maxHp : 0,
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
        const data = {
            version: 1,
            timestamp: Date.now(),
            week: WorldState.week,

            // World State
            world: {
                truthFlags: { ...WorldState.truthFlags },
                absorbedStats: WorldState.absorbedStats ? { ...WorldState.absorbedStats } : null
            },

            // Map Location
            map: {
                id: Maps.current,
                x: this.game.player.x,
                y: this.game.player.y,
                dir: this.game.player.dir
            }
        };

        if (WorldState.week === 1) {
            // Loop 1 Data (Synchronous via Managers)
            const P = WorldState.managers.player;
            const I = WorldState.managers.inventory;
            const Q = WorldState.managers.quest;

            if (!P || !I || !Q) {
                console.error("Save Failed: Managers not initialized", { P, I, Q });
                return false;
            }

            try {
                data.player1 = {
                    level: P.level,
                    exp: P.exp,
                    hp: P.hp, maxHp: P.maxHp,
                    mp: P.mp, maxMp: P.maxMp,
                    atk: P.atk, def: P.def,
                    gold: P.gold,
                    equipment: { ...P.equipment },
                    spells: { ...P.spells } // Spells is an object in Loop 1
                };
                data.inventory1 = { ...I.items };
                data.quest1 = {
                    bosses: { ...Q.bosses },
                    westSwitches: { ...Q.westSwitches },
                    doors: { ...Q.doors },
                    northMinibosses: { ...Q.northMinibosses },
                    // Legacy flags
                    hasSword: Q.hasSword,
                    gateOpen: Q.gateOpen,
                    hasAmulet: Q.hasAmulet
                };

                this._writeSave(slot, data);
            } catch (e) {
                console.error("Error constructing Loop 1 save data", e);
            }
            return true;
        } else {
            // Loop 2 Data
            data.world2 = {
                trueBosses: { ...WorldState2.trueBosses },
                trueDemonKingDefeated: WorldState2.trueDemonKingDefeated
            };
            data.player2 = {
                name: PlayerStats2.name,
                hp: PlayerStats2.hp, maxHp: PlayerStats2.maxHp,
                mp: PlayerStats2.mp, maxMp: PlayerStats2.maxMp,
                atk: PlayerStats2.atk, def: PlayerStats2.def,
                matk: PlayerStats2.matk, mdef: PlayerStats2.mdef,
                gold: PlayerStats2.gold,
                hiddenExp: PlayerStats2.hiddenExp,
                weapon: PlayerStats2.weapon,
                status: { ...PlayerStats2.status },
                spells: { ...PlayerStats2.spells },
                magicBoost: PlayerStats2.magicBoost
            };
            data.party2 = Party2.members.map(m => ({
                id: m.id,
                hp: m.hp, maxHp: m.maxHp,
                mp: m.mp, maxMp: m.maxMp,
                atk: m.atk, def: m.def,
                matk: m.matk, mdef: m.mdef,
                hiddenExp: m.hiddenExp
            }));
            data.quest2 = {
                killCount: { ...QuestSystem2.killCount },
                completed: { ...QuestSystem2.completed },
                departed: { ...QuestSystem2.departed }
            };

            this._writeSave(slot, data);
            return true;
        }
    },

    _writeSave(slot, data) {
        try {
            console.log(`Attempting to write save to slot ${slot}:`, data);
            localStorage.setItem(this.KEY_BASE + slot, JSON.stringify(data));
            console.log(`Game Saved to Slot ${slot} successfully.`);
            Msg.show('記録しました');
        } catch (e) {
            console.error('Save Failed', e);
        }
    },

    load(slot = 0) {
        const json = localStorage.getItem(this.KEY_BASE + slot);
        if (!json) return false;

        try {
            const data = JSON.parse(json);

            // Restore World State Common
            WorldState.week = data.week;
            WorldState.truthFlags = data.world.truthFlags;
            WorldState.absorbedStats = data.world.absorbedStats;

            if (data.week === 1) {
                // Loop 1 Restore
                WorldState.reset(); // Reset generic managers to Loop 1

                // Using generic imports might be tricky dynamically if not already imported or pure async.
                // Assuming standard imports available or re-importing.
                // Since this is a module, we can access imported modules from top if we change imports.
                // But imports at top are mixed. Let's assume we are in Loop 1 or 2 context.
                // Actually WorldState.reset() sets managers to Loop 1 versions.

                // We need to wait for imports if we use dynamic, but here we can rely on Global Objects if available or import.
                // To be safe and clean, we should import everything at top or access via WorldState.managers

                const P = WorldState.managers.player;
                const I = WorldState.managers.inventory;
                const Q = WorldState.managers.quest;

                if (data.player1) {
                    P.level = data.player1.level;
                    P.exp = data.player1.exp;
                    P.hp = data.player1.hp; P.maxHp = data.player1.maxHp;
                    P.mp = data.player1.mp; P.maxMp = data.player1.maxMp;
                    P.atk = data.player1.atk; P.def = data.player1.def;
                    P.gold = data.player1.gold;
                    P.equipment = data.player1.equipment;
                    P.spells = data.player1.spells;
                }
                if (data.inventory1) {
                    I.items = data.inventory1;
                }
                if (data.quest1) {
                    Q.bosses = data.quest1.bosses;
                    Q.westSwitches = data.quest1.westSwitches;
                    Q.doors = data.quest1.doors;
                    Q.northMinibosses = data.quest1.northMinibosses;
                    Q.hasSword = data.quest1.hasSword;
                    Q.gateOpen = data.quest1.gateOpen;
                    Q.hasAmulet = data.quest1.hasAmulet;
                }

            } else {
                // Loop 2 Restore
                WorldState.startWeek2(); // Switch to Loop 2 managers

                if (data.world2) {
                    WorldState2.trueBosses = data.world2.trueBosses;
                    WorldState2.trueDemonKingDefeated = data.world2.trueDemonKingDefeated;
                }

                // Initialize Week 2 Maps
                if (window.Maps && window.Maps.initWeek2) {
                    window.Maps.initWeek2();
                }

                const P2 = PlayerStats2;
                if (data.player2) {
                    P2.name = data.player2.name;
                    P2.hp = data.player2.hp; P2.maxHp = data.player2.maxHp;
                    P2.mp = data.player2.mp; P2.maxMp = data.player2.maxMp;
                    P2.atk = data.player2.atk; P2.def = data.player2.def;
                    P2.matk = data.player2.matk; P2.mdef = data.player2.mdef;
                    P2.gold = data.player2.gold;
                    P2.hiddenExp = data.player2.hiddenExp;
                    P2.status = data.player2.status;
                    P2.spells = data.player2.spells;
                    P2.magicBoost = data.player2.magicBoost;
                    P2.weapon = data.player2.weapon;
                }

                const Party = Party2;
                Party.members = [];
                if (data.party2) {
                    data.party2.forEach(m => {
                        const base = PartyMemberData2[m.id];
                        if (base) {
                            Party.members.push({ ...base, ...m });
                        }
                    });
                }

                const Q2 = QuestSystem2;
                if (data.quest2) {
                    Q2.killCount = data.quest2.killCount;
                    Q2.completed = data.quest2.completed;
                    Q2.departed = data.quest2.departed;
                }
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
                    // Reset encounter steps to prevent immediate encounter
                    if (WorldState.week === 1) {
                        WorldState.resetEncounterSteps(m.encounterRate);
                    } else {
                        // Loop 2 handling if needed
                        // WorldState2 might have its own logic, assuming Loop 1 WorldState handles common steps for now or verify
                    }
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


