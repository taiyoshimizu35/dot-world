// ===========================================
// 魔王城マップデータ（Loop 2）
// ===========================================
function initDemonCastleWeek2(Maps, T) {
    const { createDungeonTiles } = MapHelper;

    // 魔王城 - 入口
    const dc1t = createDungeonTiles(20, 18, T);
    // 道を端まで繋げる（y=1からy=16まで）
    for (let y = 1; y <= 16; y++) dc1t[y][10] = T.PATH;
    for (let x = 4; x <= 16; x++) dc1t[9][x] = T.PATH;

    // 北ボスからのワープ着地点(7, 12)からメイン通路への道
    dc1t[12][7] = T.PATH; dc1t[12][8] = T.PATH; dc1t[12][9] = T.PATH;

    dc1t[17][10] = T.EXIT;

    Maps.data.demon_castle = {
        w: 20, h: 18, tiles: dc1t, isDungeon: true, encounterRate: 0.12, area: 'demon', week2Map: true,
        npcs: [{ id: 'dc_sign', type: 'signpost', x: 10, y: 12, msg: '【魔王城】\nここが最後の戦いの場所…', blocking: true }],
        warps: [
            { x: 10, y: 17, to: 'north_boss_room', tx: 8, ty: 3 },
            { x: 10, y: 2, to: 'demon_throne', tx: 8, ty: 11 }
        ],
        start: { x: 10, y: 15 }
    };

    // 魔王城 - 玉座の間
    const dc2t = createDungeonTiles(16, 14, T);
    for (let y = 1; y <= 11; y++) dc2t[y][8] = T.PATH;
    dc2t[12][8] = T.EXIT;

    Maps.data.demon_throne = {
        w: 16, h: 14, tiles: dc2t, isDungeon: true, encounterRate: 0, area: 'demon', week2Map: true,
        npcs: [{ id: 'demonKing', type: 'enemy_slime', img: 'enemy_slime', x: 8, y: 4, msg: null, demonKing: true, blocking: true }],
        warps: [{ x: 8, y: 12, to: 'demon_castle', tx: 10, ty: 3 }],
        start: { x: 8, y: 11 }
    };
}
