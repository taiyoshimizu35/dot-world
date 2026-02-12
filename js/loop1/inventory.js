// ===========================================
// インベントリ
// ===========================================
export const Inventory = {
    items: {},
    add(n, c = 1) { this.items[n] = (this.items[n] || 0) + c; },
    remove(n, c = 1) { if (this.items[n]) { this.items[n] -= c; if (this.items[n] <= 0) delete this.items[n]; } },
    has(n) { return (this.items[n] || 0) > 0; },
    list() { return Object.entries(this.items); }
};
