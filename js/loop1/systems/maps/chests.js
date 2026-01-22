// ===========================================
// 宝箱
// ===========================================
const Chests = {
    list: [],
    opened: new Set(),

    init() {
        this.list = [
            { id: 'c1', map: 'village', x: 14, y: 12, item: '薬草', count: 2 },
            { id: 'c3', map: 'house1', x: 7, y: 2, item: '薬草', count: 3 },
            { id: 'ec1', map: 'east_stage1', x: 38, y: 38, item: 'ポーション', count: 2 },
            { id: 'ec2', map: 'east_stage1', x: 38, y: 2, item: '魔法の聖水', count: 1 },
            { id: 'sc1', map: 'south_stage1', x: 35, y: 35, item: '銀の鍵', count: 1 },
            { id: 'sc2', map: 'south_stage2', x: 5, y: 35, item: '銀の鍵', count: 1 }
        ];
    },

    forMap(m) { return this.list.filter(c => c.map === m); },
    isOpen(id) { return this.opened.has(id); },
    open(id) { this.opened.add(id); },

    nearby(map, px, py) {
        const TS = GameConfig.TILE_SIZE;
        for (const c of this.forMap(map)) {
            if (Math.abs(px - c.x * TS) < TS * 1.5 && Math.abs(py - c.y * TS) < TS * 1.5) return c;
        }
        return null;
    },

    render(ctx, map, pTx, pTy, area) {
        const TS = GameConfig.TILE_SIZE;
        for (const c of this.forMap(map)) {
            // South Area Visibility Check
            if (area === 'south') {
                if (Math.hypot(c.x - pTx, c.y - pTy) > 2.5) continue;
            }

            const sp = Camera.toScreen(c.x * TS, c.y * TS);
            const img = AssetLoader.get(this.isOpen(c.id) ? 'chest_open' : 'chest_closed');
            if (img) ctx.drawImage(img, sp.x, sp.y, TS, TS);
        }
    }
};
