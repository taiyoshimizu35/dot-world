// ===========================================
// メインゲームクラス
// ===========================================

// 週切り替えヘルパー関数
// WorldState.managersを使用するため削除
class Game {
    constructor() {
        this.cvs = document.getElementById('game-canvas');
        this.ctx = this.cvs.getContext('2d');
        this.baseWidth = GameConfig.VIEWPORT_WIDTH;
        this.baseHeight = GameConfig.VIEWPORT_HEIGHT;
        this.currentScale = GameConfig.SCALE;

        // 初期リサイズ
        this.resize();

        this.player = { x: 0, y: 0, dir: 0, moving: false, anim: 0 };
        this.lastTime = 0;
    }

    resize() {
        // 画面サイズから最適なスケールを計算
        const padding = 60; // 余白
        const availW = window.innerWidth - padding;
        const availH = window.innerHeight - padding;

        // アスペクト比を維持しながら最大サイズを計算
        const scaleX = availW / this.baseWidth;
        const scaleY = availH / this.baseHeight;

        // 整数倍にスナップ（ドット絵ゲームなので）、最低1
        let optimalScale = Math.floor(Math.min(scaleX, scaleY));
        if (optimalScale < 1) optimalScale = 1;

        // スケール更新
        this.currentScale = optimalScale;
        GameConfig.SCALE = optimalScale;

        // キャンバスサイズ更新
        this.cvs.width = this.baseWidth * this.currentScale;
        this.cvs.height = this.baseHeight * this.currentScale;

        // コンテキスト設定をリセット
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // リセット
        this.ctx.scale(this.currentScale, this.currentScale);
        this.ctx.imageSmoothingEnabled = false;
    }

    async init() {
        await AssetLoader.loadAll();
        Input.init();
        Maps.init();
        Chests.init();

        // Ensure managers are initialized (Week 1 default)
        if (!WorldState.managers.player) WorldState.reset();

        const start = Maps.get().start;
        this.player.x = start.x * GameConfig.TILE_SIZE;
        this.player.y = start.y * GameConfig.TILE_SIZE;
        this.player.dir = 0;

        // ウィンドウリサイズ時の処理
        window.addEventListener('resize', () => this.resize());

        requestAnimationFrame(t => this.loop(t));
    }

    loop(t) {
        requestAnimationFrame(t => this.loop(t));
        this.lastTime = t;
        this.update();
        this.draw();
        FX.update();
    }

    update() {
        if (currentState === GameState.FADE) return;
        if (currentState === GameState.DIALOG) {
            if (Input.interact()) { if (Msg.done()) Msg.hide(); else Msg.skip(); }
            Msg.update();
            return;
        }
        if (currentState === GameState.MENU) { Menu.update(); return; }
        if (currentState === GameState.SHOP) { Shop.update(); return; }
        if (currentState === GameState.BATTLE) {
            const battle = WorldState.managers.battle;
            if (battle) battle.update();
            return;
        }
        if (currentState === GameState.GAMEOVER) { GameOverMenu.update(); return; }
        if (currentState === GameState.GAMEOVER) { GameOverMenu.update(); return; }
        if (currentState === GameState.ENDING) { if (Input.interact()) location.reload(); return; }
        if (currentState === GameState.OPENING) { Opening.update(); return; }
        if (currentState === GameState.LOOP1_ENDING) { Loop1Ending.update(); return; }

        if (currentState === GameState.PLAYING) {
            if (Input.justPressed('KeyX') && !Menu.visible) Menu.open();
            this.handleMovement();
            this.handleInteraction();
        }
    }

    handleMovement() {
        const { dx, dy } = Input.move();
        const TS = GameConfig.TILE_SIZE;

        if (dx === 0 && dy === 0) { this.player.moving = false; return; }

        const nx = this.player.x + dx * GameConfig.PLAYER_SPEED;
        const ny = this.player.y + dy * GameConfig.PLAYER_SPEED;
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

        if (tileBlocked || npcBlocked) { this.player.moving = false; return; }

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
        if (dx > 0) this.player.dir = 2;
        else if (dx < 0) this.player.dir = 1;
        else if (dy > 0) this.player.dir = 0;
        else if (dy < 0) this.player.dir = 3;

        // Warp Check
        const warp = Maps.getWarp(this.player.x, this.player.y);
        if (warp) {
            FX.fadeOut(() => {
                Maps.current = warp.to;
                this.player.x = warp.tx * TS;
                this.player.y = warp.ty * TS;
                if (Maps.current === 'dungeon' && !Checkpoint.saved) Checkpoint.save({ x: 23, y: 10 });

                // マップ切り替え時にエンカウント歩数をリセット
                const m = Maps.get();
                WorldState.resetEncounterSteps(m.encounterRate);

                FX.fadeIn();
            });
            return;
        }

        // Encounter Check
        this.checkEncounter();
    }

    checkEncounter() {
        const TS = GameConfig.TILE_SIZE;
        const m = Maps.get();
        const currentTile = Maps.getTile(Math.floor((this.player.x + TS / 2) / TS), Math.floor((this.player.y + TS / 2) / TS));

        // 安全地帯（道など）ではカウントしない
        if (currentTile === GameConfig.TILE_TYPES.PATH) return;

        // 歩数減少
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

                // 次回のエンカウント歩数をリセット
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

        if (npc) {
            // 週限定NPCのチェック
            if (npc.week1Only && gameLoop.week !== 1) return;
            if (npc.week2Only && gameLoop.week !== 2) return;

            // 仲間加入NPCの処理
            if (npc.partyJoin) {
                const party = WorldState.managers.party;
                // パーティシステムが有効かつ、未加入の場合
                if (party) {
                    // 既に仲間になっている場合は何もしない
                    if (party.members.find(m => m.id === npc.partyJoin)) return;

                    // ボス撃破条件チェック
                    if (npc.requiresBoss && !QuestFlags.trueBosses[npc.requiresBoss]) {
                        Msg.show('（何かを待っているようだ…）');
                        return;
                    }

                    // 仲間加入 (Party2対応: PartyMemberDataはWeek 1用だが、Week 2ではParty.add内で解決されるべき。
                    // しかし main.js は汎用。npc.partyJoin は ID ('alex' etc)
                    if (party.add(npc.partyJoin)) {
                        // 名前取得のため一時的にデータ参照（簡易対応）
                        // 本来は party.add の戻り値や party から取得すべき
                        const name = npc.partyJoin === 'alex' ? 'アレックス' : (npc.partyJoin === 'rose' ? 'ローズ' : 'ミリア');
                        Msg.show(`${name}が仲間になった！\n「一緒に魔王を倒そう！」`);
                    }
                }
                return;
            }

            // 倒したボスならスキップ
            if (npc.areaBoss && !npc.trueAreaBoss && QuestFlags.fakeBosses[npc.areaBoss]) {
                // 嘘ボス撃破済み - 何もしない
            } else if (npc.trueAreaBoss && QuestFlags.trueBosses[npc.areaBoss]) {
                // 真ボス撃破済み - 何もしない
            } else {
                Battle.playerRef = { x: this.player.x, y: this.player.y };
                if (npc.shop) Shop.open(false);
                else if (npc.magicShop) Shop.open(true);
                // 新システム: エリアボス
                else if (npc.areaBoss) {
                    const isTrueBoss = npc.trueAreaBoss || false;
                    Battle.startAreaBoss(npc.areaBoss, isTrueBoss);
                }
                // 魔王城案内人（1週目）
                else if (npc.demonGuide) {
                    if (QuestFlags.allFakeBossesDefeated()) {
                        Msg.show('「勇者よ！全てのボスを倒したな！\n私の後ろから魔王城へ行ける！」');
                    } else {
                        const defeated = [];
                        const remaining = [];
                        if (QuestFlags.fakeBosses.east) defeated.push('東'); else remaining.push('東');
                        if (QuestFlags.fakeBosses.west) defeated.push('西'); else remaining.push('西');
                        if (QuestFlags.fakeBosses.north) defeated.push('北'); else remaining.push('北');
                        if (QuestFlags.fakeBosses.south) defeated.push('南'); else remaining.push('南');
                        Msg.show(`「四方のボスを倒せば魔王城への道が開く。\n残り: ${remaining.join('・')}」`);
                    }
                }
                // 2週目専用: クエストNPC
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
                // 2週目専用: 武器店NPC
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
                // 新システム: 魔王
                else if (npc.demonKing) {
                    const battle = WorldState.managers.battle;
                    if (battle && typeof battle.startDemonKing === 'function') {
                        battle.startDemonKing(QuestFlags.canFaceTrueDemonKing);
                    }
                }
                // 旧システム互換
                else if (npc.boss) Battle.startBoss();
                else if (npc.westBoss) Battle.startWestBoss();
                else if (npc.northBoss) Battle.startNorthBoss();
                else if (npc.southBoss) Battle.startSouthBoss();
                else if (npc.msg) Msg.show(npc.msg);
            }
        }

        // Chest
        const chest = Chests.nearby(Maps.current, tx * TS, ty * TS);
        if (chest && !Chests.isOpen(chest.id)) {
            Chests.open(chest.id);
            // アイテム追加（Invが存在する場合のみ）
            const inv = WorldState.managers.inventory;
            if (inv) {
                if (chest.item === '薬草') inv.add('薬草', chest.count);
                else if (chest.item === 'ポーション') inv.add('ポーション', chest.count);
                Msg.show(`${chest.item}を手に入れた！` + (chest.count > 1 ? ` x${chest.count}` : ''));
            } else {
                Msg.show(`${chest.item}を見つけたが、今は持ち運べない。`);
            }
        }
    }

    draw() {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH, TILE_SIZE: TS } = GameConfig;

        Camera.update(this.player.x, this.player.y, Maps.get().w, Maps.get().h);
        Draw.rect(this.ctx, 0, 0, VW, VH, '#000');

        // Map Render
        const m = Maps.get();
        const startCol = Math.floor(Camera.x / TS);
        const endCol = startCol + (VW / TS) + 1;
        const startRow = Math.floor(Camera.y / TS);
        const endRow = startRow + (VH / TS) + 1;

        for (let y = startRow; y <= endRow; y++) {
            for (let x = startCol; x <= endCol; x++) {
                if (y >= 0 && y < m.h && x >= 0 && x < m.w) {
                    const t = m.tiles[y][x];
                    let imgName = 'grass';
                    if (t === 1) imgName = 'rock';
                    else if (t === 2) imgName = 'path';
                    else if (t === 3) imgName = 'water';
                    else if (t === 4) imgName = 'house';
                    else if (t === 5) imgName = 'door';
                    else if (t === 6) imgName = 'floor';
                    else if (t === 7) imgName = 'desk';
                    else if (t === 8) imgName = 'bed';
                    else if (t === 9) imgName = 'path';
                    else if (t === 10) imgName = 'counter';
                    else if (t === 11) imgName = 'tree';

                    const sp = Camera.toScreen(x * TS, y * TS);
                    const img = AssetLoader.get(imgName);
                    if (img) this.ctx.drawImage(img, sp.x, sp.y, TS, TS);
                }
            }
        }

        Chests.render(this.ctx, Maps.current);

        // NPCs（条件フィルタリング済み）
        const visibleNpcs = Maps.getVisibleNpcs();
        for (const npc of visibleNpcs) {
            const sp = Camera.toScreen(npc.x * TS, npc.y * TS);
            const img = AssetLoader.get(npc.img || (npc.type === 'villager' ? 'villager' : (npc.type === 'guard' ? 'guard' : (npc.type === 'signpost' ? 'signpost' : 'enemy_slime'))));
            if (img) this.ctx.drawImage(img, sp.x, sp.y, TS, TS);
        }

        // Player
        const pSp = Camera.toScreen(this.player.x, this.player.y);
        const pImg = AssetLoader.get('player');
        if (pImg) this.ctx.drawImage(pImg, pSp.x, pSp.y, TS, TS);

        // UI
        FX.render(this.ctx);
        if (currentState === GameState.DIALOG) Msg.render(this.ctx);
        if (currentState === GameState.MENU) Menu.render(this.ctx);
        if (currentState === GameState.SHOP) Shop.render(this.ctx);
        if (currentState === GameState.BATTLE) {
            const battle = WorldState.managers.battle;
            if (battle) battle.render(this.ctx);
        }

        if (currentState === GameState.TITLE) {
            Draw.rect(this.ctx, 0, 0, VW, VH, '#000');
            Draw.text(this.ctx, 'DOT WORLD', 80, 80, '#fff', 20);
            Draw.text(this.ctx, 'Press Enter', 90, 150, '#fff', 10);
            if (Input.interact()) {
                currentState = GameState.OPENING;
                Opening.init();
            }
        }

        if (currentState === GameState.GAMEOVER) GameOverMenu.render(this.ctx);
        if (currentState === GameState.ENDING) {
            Draw.rect(this.ctx, 0, 0, VW, VH, 'rgba(255,255,255,0.9)');
            Draw.text(this.ctx, 'THE END', 90, 100, '#000', 20);
        }

        if (currentState === GameState.OPENING) {
            Opening.render(this.ctx);
        }

        if (currentState === GameState.LOOP1_ENDING) {
            Loop1Ending.render(this.ctx);
        }
    }
}
//    }
//}

const game = new Game();
window.game = game;
window.onload = () => game.init();