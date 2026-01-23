// ===========================================
// 北エリアマップデータ
// ===========================================

// 1週目：ボス直行マップ（4層構造）
function initNorthWeek1(Maps, T) {
    const { createFieldTiles } = MapHelper;

    // Helper to create basic 15x15 room
    const createRoom = () => {
        const tiles = createFieldTiles(15, 15, T);
        // Basic path (center vertical)
        for (let y = 2; y <= 12; y++) tiles[y][7] = T.PATH;
        return tiles;
    };

    // Stage 1: Ice Dragon
    const n1t = createRoom();
    n1t[13][7] = T.EXIT; // To Village
    n1t[1][7] = T.PATH;  // Warp point behind boss

    Maps.data.north_stage1 = {
        w: 15, h: 15, tiles: n1t, encounterRate: 0.008, area: 'north', week1Map: true,
        npcs: [
            { id: 'ice_dragon', type: 'enemy_ice_dragon', img: 'enemy_ice_dragon', x: 7, y: 1, msg: null, northMiniboss: 'stage1', blocking: true }
        ],
        warps: [
            { x: 7, y: 13, to: 'village', tx: 12, ty: 2 },
            { x: 7, y: 1, to: 'north_stage2', tx: 7, ty: 12 }
        ],
        start: { x: 7, y: 12 }
    };

    // Stage 2: Ice Magician
    const n2t = createRoom();
    n2t[13][7] = T.EXIT;
    n2t[1][7] = T.PATH;

    Maps.data.north_stage2 = {
        w: 15, h: 15, tiles: n2t, encounterRate: 0.008, area: 'north', week1Map: true,
        npcs: [
            { id: 'ice_magician', type: 'enemy_ice_magician', img: 'enemy_ice_magician', x: 7, y: 1, msg: null, northMiniboss: 'stage2', blocking: true }
        ],
        warps: [
            { x: 7, y: 13, to: 'north_stage1', tx: 7, ty: 2 }, // Back to Stage 1 (after dragon)
            { x: 7, y: 1, to: 'north_stage3', tx: 7, ty: 12 }
        ],
        start: { x: 7, y: 12 }
    };

    // Stage 3: Ice Knight
    const n3t = createRoom();
    n3t[13][7] = T.EXIT;
    n3t[1][7] = T.PATH;

    Maps.data.north_stage3 = {
        w: 15, h: 15, tiles: n3t, encounterRate: 0.008, area: 'north', week1Map: true,
        npcs: [
            { id: 'ice_knight', type: 'enemy_ice_knight', img: 'enemy_ice_knight', x: 7, y: 1, msg: null, northMiniboss: 'stage3', blocking: true }
        ],
        warps: [
            { x: 7, y: 13, to: 'north_stage2', tx: 7, ty: 2 },
            { x: 7, y: 1, to: 'north_boss_room', tx: 7, ty: 12 }
        ],
        start: { x: 7, y: 12 }
    };

    // Boss Room (Fake North Boss: Crystal Golem)
    const nbt = createRoom();
    nbt[13][7] = T.EXIT;
    nbt[1][7] = T.PATH;

    Maps.data.north_boss_room = {
        w: 15, h: 15, tiles: nbt, encounterRate: 0.008, area: 'north', week1Map: true,
        npcs: [
            { id: 'northBoss', type: 'enemy_ice_golem', img: 'ice_golem_map', x: 7, y: 1, msg: null, areaBoss: 'north', blocking: true }
        ],
        warps: [
            { x: 7, y: 13, to: 'north_stage3', tx: 7, ty: 2 },
            { x: 7, y: 1, to: 'demon_castle', tx: 10, ty: 15, requiresDemonCastle: true }
        ],
        start: { x: 7, y: 12 }
    };
}

// 2週目は loop2/systems/maps/data/north.js に移動