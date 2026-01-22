class MapRenderer {
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
                    else if (t === 12) imgName = 'stairs';
                    else if (t === 13) imgName = 'stone_switch';
                    else if (t === 14) imgName = 'stone';
                    else if (t === 15) imgName = 'statue';
                    else if (t === 16) imgName = 'gray_grass';
                    else if (t === 17) imgName = 'gray_door';

                    const sp = camera.toScreen(x * TS, y * TS);
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
            const img = AssetLoader.get(npc.img || (npc.type === 'villager' ? 'villager' : (npc.type === 'guard' ? 'guard' : (npc.type === 'signpost' ? 'signpost' : 'enemy_slime'))));
            if (img) ctx.drawImage(img, sp.x, sp.y, TS, TS);
        }

        // Player
        const pSp = camera.toScreen(player.x, player.y);
        const pImg = AssetLoader.get('player');
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
