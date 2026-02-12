import { GameConfig } from '../constants.js';
import { Input } from '../core/input.js';
import { Msg } from '../core/message.js';
import { FX } from '../core/effects.js';
// import { WorldState } from '../loop1/world.js'; // Dependency Injected
import { Maps } from '../loop1/systems/maps/manager.js';
import { Chests } from '../loop1/systems/maps/chests.js';
import { QuestFlags } from '../loop1/quest.js';
import { Checkpoint } from '../loop1/checkpoint.js';
import { PlayerStats } from '../loop1/player.js';
// import { Battle } from '../loop1/systems/battle/core.js'; // Use worldState.managers.battle
// import { Shop } from '../loop1/systems/shop.js'; // Use worldState.managers.shop
// import { Inn } from '../loop1/systems/inn.js'; // Use worldState.managers.inn

export class PlayerController {
    constructor(player, worldState) {
        this.player = player;
        this.worldState = worldState;
    }

    update() {
        const moved = this.handleMovement();
        this.handleInteraction();
        if (moved) this.checkEncounter();
    }

    handleMovement() {
        const { dx, dy } = Input.move();
        const TS = GameConfig.TILE_SIZE;

        if (dx === 0 && dy === 0) {
            this.player.moving = false;
            return false;
        }

        // Direction update
        if (dx > 0) this.player.dir = 2;
        else if (dx < 0) this.player.dir = 1;
        else if (dy > 0) this.player.dir = 0;
        else if (dy < 0) this.player.dir = 3;

        const nx = this.player.x + dx * GameConfig.PLAYER_SPEED;
        const ny = this.player.y + dy * GameConfig.PLAYER_SPEED;

        // Wall Check logic
        return this.checkCollisionAndMove(nx, ny, dx, dy, TS);
    }

    checkCollisionAndMove(nx, ny, dx, dy, TS) {
        const margin = 5;

        const c1 = Maps.getTile(Math.floor((nx + margin) / TS), Math.floor((ny + margin) / TS));
        const c2 = Maps.getTile(Math.floor((nx + TS - margin) / TS), Math.floor((ny + margin) / TS));
        const c3 = Maps.getTile(Math.floor((nx + margin) / TS), Math.floor((ny + TS - margin) / TS));
        const c4 = Maps.getTile(Math.floor((nx + TS - margin) / TS), Math.floor((ny + TS - margin) / TS));

        const tileBlocked = Maps.isBlocking(c1) || Maps.isBlocking(c2) || Maps.isBlocking(c3) || Maps.isBlocking(c4);
        const npcBlocked = Maps.isNpcAt(Math.floor((nx + margin) / TS), Math.floor((ny + margin) / TS)) ||
            Maps.isNpcAt(Math.floor((nx + TS - margin) / TS), Math.floor((ny + margin) / TS)) ||
            Maps.isNpcAt(Math.floor((nx + margin) / TS), Math.floor((ny + TS - margin) / TS)) ||
            Maps.isNpcAt(Math.floor((nx + TS - margin) / TS), Math.floor((ny + TS - margin) / TS));

        if (tileBlocked || npcBlocked) {
            this.player.moving = false;
            return false;
        }

        this.player.x = nx;
        this.player.y = ny;
        this.player.moving = true;

        // Tile Event Check (Switch)
        const currentT = Maps.getTile(Math.floor((this.player.x + TS / 2) / TS), Math.floor((this.player.y + TS / 2) / TS));
        if (currentT === GameConfig.TILE_TYPES.SWITCH) {
            const switchKey = Maps.current === 'west_stage1' ? 'stage1' : (Maps.current === 'west_stage2' ? 'stage2' : null);
            if (switchKey && !QuestFlags.westSwitches[switchKey]) {
                QuestFlags.westSwitches[switchKey] = true;
                Msg.show('スイッチを踏んだ！\n遠くで何かが動く音がした。');
            }
        }

        // Warp Check
        this.checkWarp(TS);

        return true;
    }

    checkWarp(TS) {
        const warp = Maps.getWarp(this.player.x, this.player.y);
        if (warp) {
            // Simplified Warp Checks for Loop 1
            if (warp.requiresDemonCastle) {
                if (!QuestFlags.allBossesDefeated()) {
                    Msg.show('結界が張られている…\n四方の魔物を倒さねば通れないようだ。');
                    return;
                }
                // Removed Holy Sword check for simplicity if requested, but user said "defeat enemies... go to demon king". 
                // Usually Demon King requires something. Let's keep it simple: just bosses.
            }

            if (warp.requiresSwitch) {
                if (!QuestFlags.westSwitches[warp.requiresSwitch]) {
                    Msg.show('扉は閉ざされている…\nどこかにあるスイッチを押さなければならないようだ。');
                    return;
                }
            }

            if (warp.requiresBossCount) {
                const defeated = QuestFlags.countDefeatedBosses();
                if (defeated < warp.requiresBossCount) {
                    Msg.show(`一見さんお断りだ。\n実力を示してから出直してきな`);
                    return;
                }
            }

            if (warp.requiresKey) {
                if (warp.doorId && QuestFlags.doors && QuestFlags.doors[warp.doorId]) {
                    // Already open
                } else {
                    const inv = this.worldState.managers.inventory;
                    if (!inv || !inv.has(warp.requiresKey)) {
                        Msg.show('鍵がかかっている。\nどこかにあるだろうか');
                        return;
                    }
                }
            }

            if (warp.consumeKey) {
                if (warp.doorId && QuestFlags.doors && QuestFlags.doors[warp.doorId]) {
                    // Do nothing
                } else {
                    const inv = this.worldState.managers.inventory;
                    if (inv) {
                        inv.remove(warp.requiresKey);
                        if (warp.doorId && QuestFlags.doors) QuestFlags.doors[warp.doorId] = true;
                        Msg.show(`${warp.requiresKey}を使った。`, () => {
                            this.executeWarp(warp, TS);
                        });
                        return;
                    }
                }
            }

            this.executeWarp(warp, TS);
        }
    }

    executeWarp(warp, TS) {
        FX.fadeOut(() => {
            Maps.current = warp.to;
            this.player.x = warp.tx * TS;
            this.player.y = warp.ty * TS;
            if (Maps.current === 'dungeon' && !Checkpoint.saved) Checkpoint.save({ x: 23, y: 10 });

            if (warp.to === 'village' && !QuestFlags.bosses.north) {
                QuestFlags.resetNorthMinibosses();
            }

            const m = Maps.get();
            if (this.worldState) this.worldState.resetEncounterSteps(m.encounterRate);

            FX.fadeIn();
        });
    }

    checkEncounter() {
        const TS = GameConfig.TILE_SIZE;
        const m = Maps.get();
        const currentTile = Maps.getTile(Math.floor((this.player.x + TS / 2) / TS), Math.floor((this.player.y + TS / 2) / TS));

        if (currentTile === GameConfig.TILE_TYPES.PATH || currentTile === GameConfig.TILE_TYPES.DOOR) return;

        if (this.worldState) {
            this.worldState.decrementCharm();
            this.worldState.stepsUntilEncounter--;

            if (this.worldState.stepsUntilEncounter <= 0) {
                const battle = this.worldState.managers.battle;
                if (battle) {
                    this.player.moving = false;
                    if (m.isDungeon || m.area === 'north' || m.area === 'south' || m.area === 'west' || m.area === 'east') {
                        battle.start(m.area);
                    } else {
                        battle.start(Maps.current);
                    }
                    this.worldState.resetEncounterSteps(m.encounterRate);
                }
            }
        }
    }

    handleInteraction() {
        if (!Input.interact()) return;
        const TS = GameConfig.TILE_SIZE;
        const playerTx = Math.floor((this.player.x + TS / 2) / TS);
        const playerTy = Math.floor((this.player.y + TS / 2) / TS);

        let tx = playerTx, ty = playerTy;
        if (this.player.dir === 0) ty++;
        else if (this.player.dir === 1) tx--;
        else if (this.player.dir === 2) tx++;
        else if (this.player.dir === 3) ty--;

        const targetT = Maps.getTile(tx, ty);
        if (targetT === GameConfig.TILE_TYPES.COUNTER) {
            if (this.player.dir === 0) ty++;
            else if (this.player.dir === 1) tx--;
            else if (this.player.dir === 2) tx++;
            else if (this.player.dir === 3) ty--;
        }

        const npcs = Maps.get().npcs || [];
        let npc = npcs.find(n => n.x === tx && n.y === ty);
        if (!npc) {
            const adjacents = [
                { x: playerTx, y: playerTy + 1 }, { x: playerTx, y: playerTy - 1 },
                { x: playerTx + 1, y: playerTy }, { x: playerTx - 1, y: playerTy }
            ];
            for (const adj of adjacents) {
                const adjNpc = npcs.find(n => n.x === adj.x && n.y === adj.y);
                if (adjNpc) { npc = adjNpc; break; }
            }
        }

        if (npc) this.handleNpcInteraction(npc);

        const chest = Chests.nearby(Maps.current, tx * TS, ty * TS);
        if (chest && !Chests.isOpen(chest.id)) {
            Chests.open(chest.id);
            const inv = this.worldState ? this.worldState.managers.inventory : null;
            if (inv) {
                if (chest.item === '薬草') inv.add('薬草', chest.count);
                else if (chest.item === 'ポーション') inv.add('ポーション', chest.count);
                else if (chest.item === '魔法の聖水') inv.add('魔法の聖水', chest.count);
                else if (chest.item === '銀の鍵') inv.add('銀の鍵', chest.count);
                Msg.show(`${chest.item}を手に入れた!` + (chest.count > 1 ? ` x${chest.count}` : ''));
            } else {
                Msg.show(`${chest.item}を見つけたが、今は持ち運べない。`);
            }
        }
    }

    handleNpcInteraction(npc) {
        if (npc.week1Only && this.worldState && this.worldState.week !== 1) return;
        if (npc.week2Only && this.worldState && this.worldState.week !== 2) return;

        if (npc.partyJoin) {
            // Loop 1 has no party, but keeping if user decides to add later or if code relies on it safely
            // But User said "Simple game". Let's ignore for now or keep standard.
            if (npc.msg) Msg.show(npc.msg);
            return;
        }

        if (npc.areaBoss) {
            // Simplified boss check
            if (QuestFlags.bosses[npc.areaBoss]) {
                // Already defeated
            } else {
                const battle = this.worldState ? this.worldState.managers.battle : null;
                if (battle) {
                    battle.playerRef = { x: this.player.x, y: this.player.y };
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
            const battle = this.worldState ? this.worldState.managers.battle : null;
            if (battle && battle.startDemonKing) battle.startDemonKing();
            return;
        }

        // Standard Shops/Inns
        const shop = this.worldState.managers.shop;
        const magicShop = this.worldState.managers.shop; // Assuming same manager handles logic or different?
        // Actually WorldState.managers.shop is capable of different types?
        // Shop.open(type) supports it.
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
