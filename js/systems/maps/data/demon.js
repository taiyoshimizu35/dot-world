import { S, M, createDungeon } from './helpers.js';

export function initDemonCastle(Maps, T) {
    const dt = createDungeon(T);
    for (let y = 1; y < S-1; y++) dt[y][M] = T.PATH;
    dt[S-1][M] = T.EXIT;

    Maps.data.demon_castle = {
        w: S, h: S, tiles: dt, area: 'demon',
        npcs: [{ id: 'demonKing', type: 'enemy_slime', img: 'enemy_demon_king', x: M, y: 4, demonKing: true, blocking: true }],
        warps: [{ x: M, y: S-1, to: 'north_boss_room', tx: M, ty: 1 }],
        start: { x: M, y: S-2 }
    };
}