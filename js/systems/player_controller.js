class PlayerController {
    constructor(player) {
        this.player = player;
    }

    update() {
        this.handleMovement();
        this.handleInteraction();
        this.checkEncounter();
    }

    handleMovement() {
        const { dx, dy } = Input.move();
        const TS = GameConfig.TILE_SIZE;

        if (dx === 0 && dy === 0) {
            this.player.moving = false;
            return;
        }

        // Direction update
        if (dx > 0) this.player.dir = 2;
        else if (dx < 0) this.player.dir = 1;
        else if (dy > 0) this.player.dir = 0;
        else if (dy < 0) this.player.dir = 3;

        const nx = this.player.x + dx * GameConfig.PLAYER_SPEED;
        const ny = this.player.y + dy * GameConfig.PLAYER_SPEED;

        // Wall Check logic
        this.checkCollisionAndMove(nx, ny, dx, dy, TS);
    }

    checkCollisionAndMove(nx, ny, dx, dy, TS) {
        const margin = 2;

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
            return;
        }

        // Gate Checks
        const tx = Math.floor((nx + TS / 2) / TS);
        const ty = Math.floor((ny + TS / 2) / TS);
        if (Maps.current === 'village') {
            if (tx > 23 && !QuestFlags.gateOpen) { Msg.show('門番「この先は危険だ。\n装備を整えてから来い。」'); return; }
            if (tx < 1 && !QuestFlags.westGateOpen) { Msg.show('門番「西の塔は危険だ。\n相応の力か、加護が必要だ。」'); return; }
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
    }

    checkWarp(TS) {
        const warp = Maps.getWarp(this.player.x, this.player.y);
        if (warp) {
            // Demon Castle Check
            if (warp.requiresDemonCastle && !QuestFlags.canFaceTrueDemonKing) {
                if (!QuestFlags.allFakeBossesDefeated()) {
                    Msg.show('結界が張られている…\n四方の魔物を倒さねば通れないようだ。');
                    return;
                }
                if (WorldState.week === 2 && !QuestFlags.canFaceTrueDemonKing) {
                    Msg.show('真の魔王への道は閉ざされている…\n全ての元凶を断て！');
                    return;
                }
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
                    Msg.show(`店主「一見さんお断りだ。\n実力を示してから出直してきな（ボス撃破数: ${defeated}/${warp.requiresBossCount}）」`);
                    return;
                }
            }

            if (warp.consumeKey) {
                const inv = WorldState.managers.inventory;
                if (inv) {
                    inv.remove(warp.requiresKey);
                    Msg.show(`${warp.requiresKey}を使った。`);
                }
            }

            FX.fadeOut(() => {
                Maps.current = warp.to;
                this.player.x = warp.tx * TS;
                this.player.y = warp.ty * TS;
                if (Maps.current === 'dungeon' && !Checkpoint.saved) Checkpoint.save({ x: 23, y: 10 });

                const m = Maps.get();
                WorldState.resetEncounterSteps(m.encounterRate);

                FX.fadeIn();
            });
        }
    }

    checkEncounter() {
        const TS = GameConfig.TILE_SIZE;
        const m = Maps.get();
        const currentTile = Maps.getTile(Math.floor((this.player.x + TS / 2) / TS), Math.floor((this.player.y + TS / 2) / TS));

        if (currentTile === GameConfig.TILE_TYPES.PATH || currentTile === GameConfig.TILE_TYPES.DOOR) return;

        WorldState.decrementCharm();
        WorldState.stepsUntilEncounter--;

        if (WorldState.stepsUntilEncounter <= 0) {
            const battle = WorldState.managers.battle;
            if (battle) {
                this.player.moving = false;

                if (m.isDungeon || m.area === 'north' || m.area === 'south' || m.area === 'west' || m.area === 'east') {
                    battle.start(m.area);
                } else {
                    battle.start(Maps.current);
                }

                WorldState.resetEncounterSteps(m.encounterRate);
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

        // Chest
        const chest = Chests.nearby(Maps.current, tx * TS, ty * TS);
        if (chest && !Chests.isOpen(chest.id)) {
            Chests.open(chest.id);
            const inv = WorldState.managers.inventory;
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
        if (npc.week1Only && gameLoop.week !== 1) return;
        if (npc.week2Only && gameLoop.week !== 2) return;

        if (npc.partyJoin) {
            const party = WorldState.managers.party;
            if (party) {
                if (party.members.find(m => m.id === npc.partyJoin)) return;
                if (npc.requiresBoss && !QuestFlags.trueBosses[npc.requiresBoss]) {
                    Msg.show('（何かを待っているようだ…）');
                    return;
                }
                if (party.add(npc.partyJoin)) {
                    const name = npc.partyJoin === 'alex' ? 'アレックス' : (npc.partyJoin === 'rose' ? 'ローズ' : 'ミリア');
                    Msg.show(`${name}が仲間になった！\n「一緒に魔王を倒そう！」`);
                }
            }
            return;
        }

        if (npc.areaBoss && !npc.trueAreaBoss && QuestFlags.fakeBosses[npc.areaBoss]) {
        } else if (npc.trueAreaBoss && QuestFlags.trueBosses[npc.areaBoss]) {
        } else {
            Battle.playerRef = { x: this.player.x, y: this.player.y };
            if (npc.shop) Shop.open('normal');
            else if (npc.magicShop) Shop.open('magic');
            else if (npc.advancedShop) Shop.open('advanced');
            else if (npc.inn) {
                const cost = Math.max(1, Math.floor(PlayerStats.gold * 0.05));
                Inn.open(cost);
            }
            else if (npc.areaBoss) {
                const isTrueBoss = npc.trueAreaBoss || false;
                Battle.startAreaBoss(npc.areaBoss, isTrueBoss);
            }
            else if (npc.demonGuide) {
                if (QuestFlags.allFakeBossesDefeated()) {
                    Msg.show('「勇者よ！全てのボスを倒したな！\n私の後ろから魔王城へ行ける！」');
                } else {
                    const remaining = [];
                    if (!QuestFlags.fakeBosses.east) remaining.push('東');
                    if (!QuestFlags.fakeBosses.west) remaining.push('西');
                    if (!QuestFlags.fakeBosses.north) remaining.push('北');
                    if (!QuestFlags.fakeBosses.south) remaining.push('南');
                    Msg.show(`「四方のボスを倒せば魔王城への道が開く。\n残り: ${remaining.join('・')}」`);
                }
            }
            else if (npc.questGiver && WorldState.week === 2) {
                const quests = QuestSystem2.getAvailableQuests();
                let claimable = quests.filter(q => q.progress.isComplete && !q.progress.isClaimed);
                if (claimable.length > 0) {
                    const result = QuestSystem2.claimReward(claimable[0].id);
                    Msg.show(result.msg);
                } else {
                    const active = quests.filter(q => !q.progress.isClaimed);
                    if (active.length > 0) {
                        const q = active[0];
                        Msg.show(`【${q.name}】\n${q.desc}\n進捗: ${q.progress.current}/${q.required}`);
                    } else {
                        Msg.show('「全てのクエストを達成した！\nお疲れ様！」');
                    }
                }
            }
            else if (npc.weaponShop && WorldState.week === 2) {
                const weapons = WeaponShop.getAvailableWeapons();
                const affordable = weapons.filter(w => w.canBuy && (!PlayerStats2.weapon || w.atk > PlayerStats2.weapon.atk));
                if (affordable.length > 0) {
                    const weapon = affordable[0];
                    const result = WeaponShop.buy(weapon.id);
                    Msg.show(result.msg);
                } else {
                    const current = PlayerStats2.weapon ? PlayerStats2.weapon.name : '素手';
                    Msg.show(`「現在の装備: ${current}\nもっとゴールドを貯めてから来い！」`);
                }
            }
            else if (npc.demonKing) {
                const battle = WorldState.managers.battle;
                if (battle && typeof battle.startDemonKing === 'function') {
                    battle.startDemonKing(QuestFlags.canFaceTrueDemonKing);
                }
            }
            else if (npc.boss) Battle.startBoss();
            else if (npc.westBoss) Battle.startWestBoss();
            else if (npc.northBoss) Battle.startNorthBoss();
            else if (npc.southBoss) Battle.startSouthBoss();
            else if (npc.msg) Msg.show(npc.msg);
        }
    }
}
