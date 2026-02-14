import { BaseState } from './base_state.js';
import { GameConfig, GameState } from '../constants.js';
import { Input } from '../core/input.js';
import { Draw } from '../core/draw.js';
import { FX } from '../core/effects.js';
import { Camera } from '../core/camera.js';
import { WorldState } from '../loop1/world.js';
import { SaveSystem } from '../core/save_system.js';
import { Maps } from '../loop1/systems/maps/manager.js'; // For window.Maps if needed, or just Maps

export class TitleState extends BaseState {
    constructor(game) {
        super(game);
        this.options = ['はじめから'];
        this.cur = 0;
        this.mode = 'main'; // 'main', 'load'
        this.saveList = [];
        this.loadCur = 0;
        this.scroll = 0;
        this.maxVisible = 6;
    }

    enter() {
        this.mode = 'main';
        this.cur = 0;

        // Build Options
        const saves = SaveSystem.getSaveList();
        console.log("TitleState: Save List:", saves);
        const hasAnySave = saves.some(s => s.exists);
        if (hasAnySave) {
            this.options = ['つづきから', 'はじめから'];
        } else {
            this.options = ['はじめから'];
        }

        if (GameConfig.DEBUG_MODE) {
            this.options.push('DEBUG: Loop 2');
        }
    }

    update() {
        // Load Mode
        if (this.mode === 'load') {
            if (Input.justPressed('ArrowUp')) {
                this.loadCur--;
                if (this.loadCur < 0) {
                    this.loadCur = this.saveList.length - 1;
                    this.scroll = Math.max(0, this.saveList.length - this.maxVisible);
                } else if (this.loadCur < this.scroll) {
                    this.scroll = this.loadCur;
                }
            }
            if (Input.justPressed('ArrowDown')) {
                this.loadCur++;
                if (this.loadCur >= this.saveList.length) {
                    this.loadCur = 0;
                    this.scroll = 0;
                } else if (this.loadCur >= this.scroll + this.maxVisible) {
                    this.scroll = this.loadCur - this.maxVisible + 1;
                }
            }

            if (Input.cancel()) {
                this.mode = 'main';
                Input.lock(150);
                return;
            }

            if (Input.interact()) {
                const slot = this.saveList[this.loadCur];
                if (slot.exists) {
                    if (SaveSystem.load(slot.slot)) {
                        if (window.currentState !== undefined) window.currentState = GameState.PLAYING;
                        this.game.stateMachine.change('playing');
                        FX.fadeIn();
                    } else {
                        // Load Failed
                        console.error("Failed to load slot", slot.slot);
                    }
                } else {
                    // Empty slot
                }
            }
            return;
        }

        // Main Menu
        if (this.options.length > 1) {
            if (Input.justPressed('ArrowUp')) this.cur = (this.cur - 1 + this.options.length) % this.options.length;
            if (Input.justPressed('ArrowDown')) this.cur = (this.cur + 1) % this.options.length;
        }

        if (Input.interact()) {
            const selected = this.options[this.cur];

            if (selected === 'つづきから') {
                this.saveList = SaveSystem.getSaveList();
                this.mode = 'load';
                this.loadCur = 0;
                this.scroll = 0;
                Input.lock(150);
            } else if (selected === 'DEBUG: Loop 2') {
                WorldState.reset();
                SaveSystem.clear(); // Clear saves for fresh debug start?
                // Or maybe keep them? User said "Debug Loop 2" clears.

                const dummyStats = {
                    level: 50,
                    maxHp: 500, maxMp: 200,
                    atk: 100, def: 100,
                    matk: 80, mdef: 80
                };
                WorldState.startWeek2(dummyStats);

                if (Maps.initWeek2) {
                    Maps.initWeek2();
                }

                if (Maps.data && Maps.data.start) {
                    Maps.current = 'start';
                } else {
                    Maps.current = 'village';
                }

                const m = Maps.get();
                const start = m.start;
                this.game.player.x = start.x * GameConfig.TILE_SIZE;
                this.game.player.y = start.y * GameConfig.TILE_SIZE;
                this.game.player.dir = 0;
                this.game.player.moving = false;

                Camera.update(this.game.player.x, this.game.player.y, m.w, m.h);
                WorldState.resetEncounterSteps(m.encounterRate);

                if (window.currentState !== undefined) window.currentState = GameState.PLAYING;
                this.game.stateMachine.change('playing');
                FX.fadeIn();

            } else {
                // New Game / Reset
                // Properly reset WorldState and QuestSystem here
                if (WorldState.reset) WorldState.reset();

                SaveSystem.clear(); // Clear all saves? Legacy behavior.
                // Assuming "New Game" in Loop 1 context clears everything.

                this.game.stateMachine.change('opening');
            }
        }
    }

    draw(ctx) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH } = GameConfig;

        // Background
        Draw.rect(ctx, 0, 0, VW, VH, '#000');

        // Logo
        Draw.text(ctx, 'DOT WORLD', VW / 2, 60, '#fff', 24, 'center');

        // Main Menu
        if (this.mode === 'main') {
            const startY = 130;
            this.options.forEach((opt, i) => {
                const color = (i === this.cur) ? '#fc0' : '#fff';
                const prefix = (i === this.cur) ? '▶ ' : '  ';
                Draw.text(ctx, prefix + opt, VW / 2, startY + i * 25, color, 14, 'center');
            });
            Draw.text(ctx, '© 2024 dot-world', VW / 2, VH - 20, '#666', 10, 'center');
        }
        // Load Menu
        else if (this.mode === 'load') {
            Draw.rect(ctx, 40, 30, VW - 80, VH - 60, 'rgba(0,0,50,0.95)');
            Draw.stroke(ctx, 40, 30, VW - 80, VH - 60, '#fff', 2);
            Draw.text(ctx, 'ロードするデータを選択', VW / 2, 50, '#fc0', 14, 'center');

            const listY = 75;
            const itemH = 20;

            for (let i = 0; i < this.maxVisible; i++) {
                const idx = this.scroll + i;
                if (idx >= this.saveList.length) break;

                const slot = this.saveList[idx];
                const y = listY + i * itemH;
                const isSel = (idx === this.loadCur);
                const color = isSel ? '#fc0' : '#ccc';
                const prefix = isSel ? '▶ ' : '  ';

                let text = `Slot ${idx + 1}: ----`;
                if (slot.exists) {
                    text = `Slot ${idx + 1}: ${slot.name} (W:${slot.week} HP:${slot.hp}/${slot.maxHp})`;
                }

                Draw.text(ctx, prefix + text, 60, y, color, 12);
            }

            // Scroll Indicators
            if (this.scroll > 0) Draw.text(ctx, '▲', VW / 2, 65, '#888', 10, 'center');
            if (this.scroll + this.maxVisible < this.saveList.length) Draw.text(ctx, '▼', VW / 2, listY + this.maxVisible * itemH + 5, '#888', 10, 'center');

            Draw.text(ctx, 'Z: 決定  X: キャンセル', VW - 50, VH - 35, '#888', 10, 'right');
        }
    }
}
