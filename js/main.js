// ===========================================
// メインゲームクラス
// ===========================================
class Game {
    constructor() {
        this.cvs = document.getElementById('game-canvas');
        this.ctx = this.cvs.getContext('2d');
        this.cvs.width = GameConfig.VIEWPORT_WIDTH * GameConfig.SCALE;
        this.cvs.height = GameConfig.VIEWPORT_HEIGHT * GameConfig.SCALE;
        this.ctx.scale(GameConfig.SCALE, GameConfig.SCALE);
        this.ctx.imageSmoothingEnabled = false;

        this.player = { x: 0, y: 0, dir: 0, moving: false, anim: 0 };
        this.lastTime = 0;
    }

    async init() {
        await AssetLoader.loadAll();
        Input.init();
        Maps.init();
        Chests.init();
        const start = Maps.get().start;
        this.player.x = start.x * GameConfig.TILE_SIZE;
        this.player.y = start.y * GameConfig.TILE_SIZE;
        this.player.dir = 0;
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
        if (currentState === GameState.BATTLE) { Battle.update(); return; }
        if (currentState === GameState.GAMEOVER) { GameOverMenu.update(); return; }
        if (currentState === GameState.ENDING) { if (Input.interact()) location.reload(); return; }

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

        let encounterChance = m.encounterRate;
        if (currentTile === GameConfig.TILE_TYPES.PATH) encounterChance = 0;
        else if (m.isSouth && currentTile !== GameConfig.TILE_TYPES.PATH) encounterChance = 0.08;

        if (Math.random() < encounterChance) {
            Battle.playerRef = { x: this.player.x, y: this.player.y };
            FX.flashRed(200);
            Input.lock(500);
            setTimeout(() => Battle.start(Maps.current), 500);
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
                // 既に仲間になっている場合は何もしない
                if (Party.members.find(m => m.id === npc.partyJoin)) return;
                // ボス撃破条件チェック
                if (npc.requiresBoss && !QuestFlags.trueBosses[npc.requiresBoss]) {
                    Msg.show('（何かを待っているようだ…）');
                    return;
                }
                // 仲間加入
                const memberData = PartyMemberData[npc.partyJoin];
                if (memberData) {
                    Party.add(npc.partyJoin);
                    Msg.show(`${memberData.name}が仲間になった！\n「一緒に魔王を倒そう！」`);
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
                // 新システム: 魔王
                else if (npc.demonKing) {
                    Battle.startDemonKing(QuestFlags.canFaceTrueDemonKing);
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
            if (chest.item === '薬草') Inv.add('薬草', chest.count);
            else if (chest.item === 'ポーション') Inv.add('ポーション', chest.count);
            Msg.show(`${chest.item}を手に入れた！` + (chest.count > 1 ? ` x${chest.count}` : ''));
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
        if (currentState === GameState.BATTLE) Battle.render(this.ctx);

        if (currentState === GameState.TITLE) {
            Draw.rect(this.ctx, 0, 0, VW, VH, '#000');
            Draw.text(this.ctx, 'DOT WORLD', 80, 80, '#fff', 20);
            Draw.text(this.ctx, 'Press Enter', 90, 150, '#fff', 10);
            if (Input.interact()) { currentState = GameState.PLAYING; FX.fadeIn(); }
        }

        if (currentState === GameState.GAMEOVER) GameOverMenu.render(this.ctx);
        if (currentState === GameState.ENDING) {
            Draw.rect(this.ctx, 0, 0, VW, VH, 'rgba(255,255,255,0.9)');
            Draw.text(this.ctx, 'THE END', 90, 100, '#000', 20);
        }
    }
}

const game = new Game();
window.onload = () => game.init();
