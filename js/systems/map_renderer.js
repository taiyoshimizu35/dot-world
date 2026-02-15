import { GameConfig } from '../constants.js';
import { Draw } from '../core/draw.js';
import { AssetLoader } from '../core/assets.js';
import { Maps } from '../loop1/systems/maps/manager.js';
import { Chests } from '../loop1/systems/maps/chests.js';

export class MapRenderer {
    constructor() {
    }

    draw(ctx, map, camera, player, gameConfig) {
        const { VIEWPORT_WIDTH: VW, VIEWPORT_HEIGHT: VH, TILE_SIZE: TS } = gameConfig;

        // Black Background
        Draw.rect(ctx, 0, 0, VW, VH, '#000');

        // Map Render
        const startCol = Math.floor(camera.x / TS);
        const endCol = startCol + (VW / TS) + 1;
        const startRow = Math.floor(camera.y / TS);
        const endRow = startRow + (VH / TS) + 1;

        for (let y = startRow; y <= endRow; y++) {
            for (let x = startCol; x <= endCol; x++) {
                if (y >= 0 && y < map.h && x >= 0 && x < map.w) {
                    const t = map.tiles[y][x];
                    const T = GameConfig.TILE_TYPES;
                    let imgName = 'grass';
                    if (t === T.ROCK) imgName = 'rock';
                    else if (t === T.PATH) imgName = 'path';
                    else if (t === T.WATER) imgName = 'water';
                    else if (t === T.HOUSE_STONE) imgName = 'house_stone';
                    else if (t === T.DOOR) imgName = 'door';
                    else if (t === T.FLOOR) imgName = 'floor';
                    else if (t === T.DESK) imgName = 'desk';
                    else if (t === T.BED) imgName = 'bed';
                    else if (t === T.CHEST_BG) imgName = 'path'; // 9 was path
                    else if (t === T.COUNTER) imgName = 'counter';
                    else if (t === T.TREE) imgName = 'tree';
                    else if (t === T.STAIRS) imgName = 'stairs';
                    else if (t === T.SWITCH) imgName = 'stone_switch';
                    else if (t === T.STONE) imgName = 'stone';
                    else if (t === T.STATUE) imgName = 'statue';
                    else if (t === T.GRAY_GRASS) imgName = 'gray_grass';
                    else if (t === T.GRAY_DOOR) imgName = 'gray_door';
                    else if (t === T.GRAY_DOOR) imgName = 'gray_door';
                    else if (t === T.HOUSE_WOOD) imgName = 'house_wood';
                    else if (t === T.DOOR_LEFT) imgName = 'door_left';
                    else if (t === T.DOOR_RIGHT) imgName = 'door_right';
                    else if (t === T.MAGIC_SHOP_SIGN_LEFT) imgName = 'magic_shop_sign_left';
                    else if (t === T.MAGIC_SHOP_SIGN_RIGHT) imgName = 'magic_shop_sign_right';
                    else if (t === T.WEAPON_SHOP_SIGN_LEFT) imgName = 'weapon_shop_sign_left';
                    else if (t === T.WEAPON_SHOP_SIGN_RIGHT) imgName = 'weapon_shop_sign_right';
                    else if (t === T.INN_SIGN_LEFT) imgName = 'inn_sign_left';
                    else if (t === T.INN_SIGN_RIGHT) imgName = 'inn_sign_right';
                    else if (t === T.PULPIT) imgName = 'pulpit';

                    const sp = camera.toScreen(x * TS, y * TS);

                    // Overlay Check (Base Tile Rendering)
                    let baseTile = map.baseTile;
                    if (t === T.DOOR_LEFT || t === T.DOOR_RIGHT ||
                        t === T.MAGIC_SHOP_SIGN_LEFT || t === T.MAGIC_SHOP_SIGN_RIGHT ||
                        t === T.WEAPON_SHOP_SIGN_LEFT || t === T.WEAPON_SHOP_SIGN_RIGHT ||
                        t === T.INN_SIGN_LEFT || t === T.INN_SIGN_RIGHT) {
                        baseTile = T.HOUSE_WOOD;
                    }

                    if (GameConfig.OVERLAY_TILES.has(t) && baseTile !== undefined) {
                        let baseName = 'grass';
                        if (baseTile === T.FLOOR) baseName = 'floor';
                        else if (baseTile === T.GRAY_GRASS) baseName = 'gray_grass';
                        else if (baseTile === T.STONE) baseName = 'stone';
                        else if (baseTile === T.PATH) baseName = 'path';
                        else if (baseTile === T.HOUSE_WOOD) baseName = 'house_wood';

                        // Add more base tiles as needed

                        const bImg = AssetLoader.get(baseName);
                        if (bImg) ctx.drawImage(bImg, sp.x, sp.y, TS, TS);
                    }

                    const img = AssetLoader.get(imgName);
                    if (img) ctx.drawImage(img, sp.x, sp.y, TS, TS);
                }
            }
        }

        // プレイヤーのタイル座標を計算
        const playerTx = Math.floor((player.x + TS / 2) / TS);
        const playerTy = Math.floor((player.y + TS / 2) / TS);

        // 宝箱描画（視界制限適用）
        Chests.render(ctx, Maps.current, playerTx, playerTy, map.area);

        // NPCs（条件フィルタリング済み、視界制限適用）
        const visibleNpcs = Maps.getVisibleNpcs();
        const currentArea = map.area;
        for (const npc of visibleNpcs) {
            // 南エリアでは視界内のNPCのみ表示
            if (currentArea === 'south') {
                const dist = Math.hypot(npc.x - playerTx, npc.y - playerTy);
                if (dist > 3.5) continue; // 視界外のNPCはスキップ
            }

            const sp = camera.toScreen(npc.x * TS, npc.y * TS);
            let spriteName = npc.img;
            if (!spriteName) {
                if (['villager', 'guard', 'signpost', 'goddes'].includes(npc.type)) {
                    spriteName = npc.type;
                } else {
                    spriteName = 'enemy_slime';
                }
            }
            const img = AssetLoader.get(spriteName);
            const w = npc.width || 1;
            const h = npc.height || 1;
            if (img) ctx.drawImage(img, sp.x, sp.y, TS * w, TS * h);
        }

        // Player
        const pSp = camera.toScreen(player.x, player.y);
        // Player Animation
        const dirs = ['down', 'left', 'right', 'up'];
        const dirStr = dirs[player.dir] || 'down';
        let suffix = 'stop';

        if (player.moving) {
            const frame = Math.floor(Date.now() / 200) % 2 + 1; // 1 or 2
            suffix = `${frame}`;
        }

        const pImgName = `player_${dirStr}_${suffix}`;
        const pImg = AssetLoader.get(pImgName) || AssetLoader.get('player');
        if (pImg) ctx.drawImage(pImg, pSp.x, pSp.y, TS, TS);

        // South Area Darkness Effect
        if (map.area === 'south') {
            const cx = pSp.x + TS / 2; // プレイヤーの中心X
            const cy = pSp.y + TS / 2; // プレイヤーの中心Y
            const radius = TS * 3;     // くり抜く半径

            ctx.save();
            ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
            ctx.beginPath();
            ctx.rect(0, 0, VW, VH);
            ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();
        }
    }
}
