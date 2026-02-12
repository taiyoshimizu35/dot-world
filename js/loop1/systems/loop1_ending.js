import { GameConfig, GameState } from '../../constants.js';
import { Draw } from '../../core/draw.js';
import { Input } from '../../core/input.js';
import { Msg } from '../../core/message.js';
import { FX } from '../../core/effects.js';
import { WorldState } from '../world.js';
import { PlayerStats } from '../player.js';
import { ShopData, MagicShopData } from '../data/items.js';
import { QuestSystem as QuestFlags } from '../quest.js';
import { Maps } from './maps/manager.js';
import { Camera } from '../../core/camera.js';
import { SaveSystem } from '../../core/save_system.js'; // Assuming SaveSystem will be here
import { Menu2 } from '../../loop2/systems/menu.js';

// ===========================================
// 1週目エンディングムービー（魔王戦後）
// ===========================================
export const Loop1Ending = {
    active: false,
    timer: 0,
    phase: 0, // 0:FadeIn, 1:Wait, 2:FadeOut, 3:Next
    currentLine: 0,
    alpha: 0,
    waitForKey: false,

    // ムービーテキスト
    lines: [
        "「勇者よ…変だとは思わないか？」",
        "「村のすぐそばがダンジョン」",
        "「村人は私を'魔王様'と呼ぶ」",
        "「聖剣は伝説の剣より安い」",
        "聖剣から禍々しい光が溢れ出す——",
        "「これは聖剣などではない」",
        "「この'魔剣'は、お前の\n力を我がものとする武器」",
        "「以前お前と戦い失った力を\n取り戻すための、な」",
        "全身から力が抜けていく…",
        "………………",
        "「ステータスが奪われました」",
        "【第一部 終】"
    ],

    game: null,
    init(game) {
        this.game = game;
        this.active = true;
        this.timer = 0;
        this.phase = 0;
        this.currentLine = 0;
        this.alpha = 0;
        this.waitForKey = false;
    },

    update() {
        // 最終行以外はスキップ可能
        if (this.currentLine < this.lines.length - 1) {
            if (Input.interact()) {
                this.currentLine++;
                if (this.currentLine >= this.lines.length) {
                    this.end();
                } else {
                    this.phase = 0;
                    this.alpha = 0;
                }
                return;
            }
        }

        if (this.phase === 0) { // Fade In
            this.alpha += 0.03;
            if (this.alpha >= 1) {
                this.alpha = 1;
                this.phase = 1;
                this.timer = 0;
            }
        } else if (this.phase === 1) { // Wait
            this.timer++;
            // 特定行は長めに表示
            const waitTime = this.getWaitTime();
            if (this.timer > waitTime) {
                this.phase = 2;
            }
        } else if (this.phase === 2) { // Fade Out
            this.alpha -= 0.03;
            if (this.alpha <= 0) {
                this.alpha = 0;
                this.phase = 3;
            }
        } else if (this.phase === 3) { // Next Line
            this.currentLine++;
            if (this.currentLine >= this.lines.length) {
                this.end();
            } else {
                this.phase = 0;
            }
        }
    },

    getWaitTime() {
        const line = this.lines[this.currentLine];
        // 「…」だけの行は短め
        if (line === '……' || line === '…………' || line === '………………') {
            return 40;
        }
        // 最終行は長め
        if (this.currentLine === this.lines.length - 1) {
            return 180;
        }
        // 長いセリフは長め
        if (line.length > 20) {
            return 150;
        }
        return 100;
    },

    render(ctx) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        // 背景（黒）
        Draw.rect(ctx, 0, 0, VW, VH, '#000');

        // テキスト描画
        if (this.currentLine < this.lines.length) {
            ctx.save();
            ctx.globalAlpha = this.alpha;

            const text = this.lines[this.currentLine];
            const lines = text.split('\n');
            const lineHeight = 20;
            const startY = VH / 2 - (lines.length - 1) * lineHeight / 2;

            // 最終行は特別な色
            const color = this.currentLine === this.lines.length - 1 ? '#ffcc00' : '#fff';

            lines.forEach((line, i) => {
                Draw.text(ctx, line, VW / 2, startY + i * lineHeight, color, 14, 'center');
            });

            ctx.restore();
        }

        // スキップ案内（最終行以外）
        if (this.currentLine < this.lines.length - 1) {
            Draw.text(ctx, 'Press Action to Skip', VW - 10, VH - 10, '#666', 10, 'right');
        } else if (this.currentLine === this.lines.length - 1) {
            Draw.text(ctx, 'Press Action to Continue', VW - 10, VH - 10, '#888', 10, 'right');
        }
    },

    end() {
        this.active = false;
        // 2週目開始処理
        this.startWeek2();
    },

    startWeek2() {
        // Init Loop 2 Systems (Capture stats before reset)
        WorldState.startWeek2(PlayerStats);
        WorldState.managers.menu = Menu2; // Set Menu2 explicitly to avoid circular dependencies in WorldState

        // ステータスリセット (Legacy Loop 1 resets)
        PlayerStats.resetForWeek2();
        ShopData.reset();
        MagicShopData.reset();
        QuestFlags.reset();

        // 聖剣フラグ処理
        if (WorldState.holySwordOwned) {
            WorldState.holySwordStolen = true;
        }

        // 村に戻る
        // 村に戻る、またはStartMapへ
        if (Maps.data && Maps.data.start) {
            Maps.current = 'start';
        } else {
            console.warn("Start map not found, falling back to village");
            Maps.current = 'village';
        }

        const start = Maps.get().start;
        // window.game usage - replace with direct game object if possible, but window.game is common pattern here
        if (this.game) {
            this.game.player.x = start.x * GameConfig.TILE_SIZE;
            this.game.player.y = start.y * GameConfig.TILE_SIZE;
            this.game.player.dir = 0;
            this.game.player.moving = false;

            // Immediately update camera so we don't show wrong location for 1 frame
            if (Maps.get()) {
                Camera.update(this.game.player.x, this.game.player.y, Maps.get().w, Maps.get().h);
            }
        }

        // Transition Logic:
        // 1. Force Black Screen overlay (to hide the sudden state switch)
        FX.fadeVal = 1;

        // 2. Switch State immediately so PlayingState starts drawing the village
        // currentState = GameState.PLAYING;
        // Should use StateMachine if possible. assuming global StateMachine access or window.game.stateMachine
        if (this.game && this.game.stateMachine) {
            this.game.stateMachine.change('playing');
            if (window.currentState !== undefined) window.currentState = GameState.PLAYING;
        }

        // 3. Start Fade In (Black -> Transparent)
        FX.fadeIn(() => {
            Input.lock(100);
            // 2週目開始メッセージ
            Msg.show('……目が覚めた。\n何もかもが…違って見える…\n\n【2週目開始】', () => {
                // Auto-Save after message closed
                // Assuming SaveSystem is imported
                if (typeof SaveSystem !== 'undefined') {
                    SaveSystem.save();
                    Msg.show('セーブしました。');
                }
            });
        });
    }
};
