import { GameConfig } from '../../../constants.js';
import { WorldState } from '../../world.js';
import { QuestSystem as QuestFlags } from '../../quest.js';
import { Msg } from '../../../core/message.js';
import { initMapData } from './data.js';
import { Areas } from '../../../loop2/systems/maps/data/areas.js'; // Import Loop 2 Areas

// ===========================================
// マップマネージャー
// ===========================================
export const Maps = {
    data: {},
    current: 'village',

    init() {
        this.data = {};
        initMapData(this);
        // We can merge Areas into this.data or check separate list?
        // Merging is cleaner if names don't collide.
        // Loop 2 names: center, east, west, north, south, demon
        // Loop 1 names: village, castle, field, dungeon, etc.
        // No collision likely.
        Object.assign(this.data, Areas);
    },

    get() { return this.data[this.current]; },

    // Explicit load method for switching maps with logic (e.g., reset NPC state)
    load(id) {
        if (this.data[id]) {
            this.current = id;
            console.log(`Map loaded: ${id}`);

            // Auto-apply encounter rate on load
            const m = this.data[id];
            if (WorldState && m.encounterRate !== undefined) {
                WorldState.resetEncounterSteps(m.encounterRate);
            } else if (WorldState) {
                // If undefined, maybe strict safe mode? or default?
                // Loop 1 village has no encounterRate (0), field has it.
                // If undefined, it effectively keeps previous or sets to Infinity if we want safety.
                // Let's safe default to 0 (Infinity steps) if undefined, ensuring no random battles in towns if forgot.
                if (m.encounterRate === undefined) WorldState.resetEncounterSteps(0);
            }

        } else {
            console.error(`Map not found: ${id}`);
        }
    },

    getTile(x, y) {
        if (Number.isNaN(x) || Number.isNaN(y) || x === undefined || y === undefined) {
            // console.warn("Maps.getTile received invalid coords:", x, y);
            return GameConfig.TILE_TYPES ? GameConfig.TILE_TYPES.WALL : 1;
        }
        const m = this.get();
        if (!m) return GameConfig.TILE_TYPES ? GameConfig.TILE_TYPES.WALL : 1;
        if (x < 0 || x >= m.w || y < 0 || y >= m.h) return GameConfig.TILE_TYPES ? GameConfig.TILE_TYPES.WALL : 1;

        // Unified Support: Check map format
        // Loop 1 Maps: m.tiles[y][x] might be object or ID depending on data.js?
        // Actually Loop 1 tiles in `data.js` seem to be 2D array of IDs.
        // Loop 2 maps are also 2D array of IDs.
        // So this code should naturally work for both IF m.tiles structure is same.
        // Let's verify Loop 1 data structure.
        return m.tiles[y][x];
    },

    isBlocking(t) {
        const T = GameConfig.TILE_TYPES;
        if (t === T.WALL) return true; // Loop 2 Wall
        return t === T.ROCK || t === T.WATER || t === T.HOUSE_WOOD || t === T.HOUSE_STONE || t === T.DESK || t === T.BED || t === T.COUNTER || t === T.TREE || t === T.STATUE || t === T.DOOR_LEFT || t === T.DOOR_RIGHT || t === T.PULPIT;
    },

    // NPCがブロッキングかチェック（仲間加入済み、ボス撃破済みは除外）
    isNpcAt(tx, ty) {
        const npcs = this.get().npcs || [];
        for (const npc of npcs) {
            const w = npc.width || 1;
            const h = npc.height || 1;

            if (tx < npc.x || tx >= npc.x + w || ty < npc.y || ty >= npc.y + h) continue;
            if (!npc.blocking) continue;

            // 週限定NPCのチェック
            // WorldState use
            if (npc.week1Only && WorldState.week !== 1) continue;
            if (npc.week2Only && WorldState.week !== 2) continue;

            // 仲間加入NPCのチェック
            if (npc.partyJoin) {
                const party = WorldState.managers.party;
                // 仲間システム有効時のみチェック
                if (party) {
                    // 既に仲間になっている場合はスキップ
                    if (party.members.find(m => m.id === npc.partyJoin)) continue;
                }
                // ボス撃破条件チェック
                if (npc.requiresBoss && !QuestFlags.trueBosses[npc.requiresBoss]) continue;
                return true;
            }

            // エリアボスのチェック
            if (npc.areaBoss) {
                if (QuestFlags.bosses[npc.areaBoss]) continue;
                return true;
            }

            // 魔王
            if (npc.demonKing) return true;

            // まだ倒していない中ボスはブロックする
            if (npc.northMiniboss) {
                if (!QuestFlags.northMinibosses[npc.northMiniboss]) return true;
                continue; // Defeated -> pass through (though getVisibleNpcs handles drawing, this handles collision)
            }

            // 旧システム互換
            if (npc.boss || npc.westBoss || npc.northBoss || npc.southBoss) return true;

            // 一般的なブロッキングNPC (上記条件を通過してここに到達したらブロック)
            return true;
        }
        return false;
    },

    // 表示するNPCリストを取得（条件フィルタリング済み）
    getVisibleNpcs() {
        const npcs = this.get().npcs || [];
        return npcs.filter(npc => {
            // 週限定NPCのチェック
            if (npc.week1Only && WorldState.week !== 1) return false;
            if (npc.week2Only && WorldState.week !== 2) return false;

            // 仲間加入NPCのチェック
            if (npc.partyJoin) {
                const party = WorldState.managers.party;
                if (party) {
                    // 既に仲間になっている場合は非表示
                    if (party.members.find(m => m.id === npc.partyJoin)) return false;
                }
                // ボス撃破条件チェック
                if (npc.requiresBoss && !QuestFlags.trueBosses[npc.requiresBoss]) return false;
            }

            // エリアボスのチェック
            if (npc.areaBoss) {
                if (QuestFlags.bosses[npc.areaBoss]) {
                    return false;
                }
            }

            // 北エリア中ボス (defeated -> hidden)
            if (npc.northMiniboss) {
                if (QuestFlags.northMinibosses[npc.northMiniboss]) return false;
            }

            return true;
        });
    },

    isBlockingPos(px, py) {
        const TS = GameConfig.TILE_SIZE;
        const tx = Math.floor(px / TS);
        const ty = Math.floor(py / TS);
        if (this.isBlocking(this.getTile(tx, ty))) return true;
        return this.isNpcAt(tx, ty);
    },

    getWarp(px, py) {
        const TS = GameConfig.TILE_SIZE;
        const tx = Math.floor((px + TS / 2) / TS);
        const ty = Math.floor((py + TS / 2) / TS);
        for (const w of this.get().warps) {
            if (w.x === tx && w.y === ty) {
                // MAP_DECEPTION: 週ごとのワープ制限
                if (w.week1Only && WorldState.week !== 1) continue;
                if (w.week2Only && WorldState.week !== 2) continue;

                // Initialize boss flags if needed (usually handled in QuestSystem)
                // Check dynamic updates
                if (QuestFlags.bosses.east) {
                    // Example dynamic map change if any
                }
                // Key Requirement Check (Moved to PlayerController)
                // if (w.requiresKey) { ... }

                // ボス撃破条件チェック
                if (w.requiresBoss && !QuestFlags.bosses[w.requiresBoss]) {
                    Msg.show(`この先に進むには${w.requiresBoss}エリアのボスを\n倒す必要がある。`);
                    return null;
                }

                // パーティサイズ条件チェック
                const m = this.data[w.to];
                if (m && m.requiresPartySize) {
                    const party = WorldState.managers.party;
                    const partySize = party ? party.members.length : 0;
                    if (partySize < m.requiresPartySize) {
                        Msg.show(`この先に進むには仲間が${m.requiresPartySize}人必要だ。\n現在: ${partySize}人`);
                        return null;
                    }
                }

                // 奥エリアへのアクセス制限チェック
                if (w.requiresDeepAccess && !QuestFlags.allBossesDefeated()) {
                    return null;
                }
                // 魔王城へのアクセス制限チェック
                if (w.requiresDemonCastle && !QuestFlags.allBossesDefeated()) {
                    return null;
                }
                return w;
            }
        }
        return null;
    },

    // 魔王城へワープ
    canAccessDemonCastle() {
        return QuestFlags.allBossesDefeated();
    },

    /*
    canFaceTrueDemonKing() {
        return QuestFlags.canFaceTrueDemonKing;
    }
    */
};