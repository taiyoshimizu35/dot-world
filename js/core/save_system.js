// ===========================================
// セーブシステム (Loop 2以降専用)
// ===========================================
const SaveSystem = {
    KEY: 'dot_world_save',

    hasSave() {
        return !!localStorage.getItem(this.KEY);
    },

    save() {
        if (WorldState.week !== 2) {
            console.warn('Save is only available in Week 2');
            return;
        }

        const data = {
            version: 1,
            timestamp: Date.now(),
            week: WorldState.week,

            // World State
            world: {
                truthFlags: { ...WorldState.truthFlags },
                absorbedStats: WorldState.absorbedStats ? { ...WorldState.absorbedStats } : null
            },

            // Player Stats
            player: {
                hp: PlayerStats2.hp,
                maxHp: PlayerStats2.maxHp,
                mp: PlayerStats2.mp,
                maxMp: PlayerStats2.maxMp,
                atk: PlayerStats2.atk,
                def: PlayerStats2.def,
                matk: PlayerStats2.matk,
                mdef: PlayerStats2.mdef,
                gold: PlayerStats2.gold,
                hiddenExp: PlayerStats2.hiddenExp,
                weapon: PlayerStats2.weapon, // Object or null? Weapon is object reference usually?
                // Wait, weapon in PlayerStats2 is passed as object reference in equipWeapon?
                // Just saving name/ID might be safer if we have a registry. 
                // Loop 2 Weapon system TBD. Assuming it's simple for now. 
                // If it's an object, we need to reconstruct it.
                // Let's verify PlayerStats2.weapon usage. It seems to be an object.
                // We'll save 'weaponId' if possible, or just the whole object if it's static data.

                status: { ...PlayerStats2.status },
                spells: { ...PlayerStats2.spells },
                magicBoost: PlayerStats2.magicBoost
            },

            // Party
            party: Party2.members.map(m => ({
                id: m.id,
                hp: m.hp, maxHp: m.maxHp,
                mp: m.mp, maxMp: m.maxMp,
                atk: m.atk, def: m.def,
                matk: m.matk, mdef: m.mdef,
                hiddenExp: m.hiddenExp
            })),

            // Quests
            quest: {
                killCount: { ...QuestSystem2.killCount },
                completed: { ...QuestSystem2.completed }
            },

            // Map Location
            map: {
                id: Maps.current,
                x: window.game.player.x,
                y: window.game.player.y,
                dir: window.game.player.dir
            }
        };

        try {
            localStorage.setItem(this.KEY, JSON.stringify(data));
            console.log('Game Saved', data);
            return true;
        } catch (e) {
            console.error('Save Failed', e);
            return false;
        }
    },

    load() {
        const json = localStorage.getItem(this.KEY);
        if (!json) return false;

        try {
            const data = JSON.parse(json);

            // Validate Version / Week
            // if (data.version !== 1) ...

            // Restore World State
            WorldState.week = data.week;
            WorldState.truthFlags = data.world.truthFlags;
            WorldState.absorbedStats = data.world.absorbedStats;

            // Initialize Week 2 Managers FIRST
            // This is critical because loading Loop 2 save means we are in Loop 2.
            // We can reuse WorldState.startWeek2 logic but without resetting stats?
            // Or just manually set managers.

            WorldState.managers.player = PlayerStats2;
            WorldState.managers.party = Party2;
            WorldState.managers.inventory = null;
            WorldState.managers.battle = Battle2;

            // Initialize Week 2 Maps
            if (window.Maps && window.Maps.initWeek2) {
                window.Maps.initWeek2();
            }
            // Managers menu/shop/inn will be set by their respective systems or init?
            // We need to set them here if we are loading directly from Title.
            // But we don't have Menu2 yet.
            // TODO: Import/Set Menu2

            // Restore Player Stats
            const p = data.player;
            PlayerStats2.hp = p.hp; PlayerStats2.maxHp = p.maxHp;
            PlayerStats2.mp = p.mp; PlayerStats2.maxMp = p.maxMp;
            PlayerStats2.atk = p.atk; PlayerStats2.def = p.def;
            PlayerStats2.matk = p.matk; PlayerStats2.mdef = p.mdef;
            PlayerStats2.gold = p.gold;
            PlayerStats2.hiddenExp = p.hiddenExp;
            PlayerStats2.status = p.status;
            PlayerStats2.spells = p.spells;
            PlayerStats2.magicBoost = p.magicBoost;
            PlayerStats2.weapon = p.weapon; // Restore weapon object/data

            // Restore Party
            Party2.members = [];
            data.party.forEach(savedMember => {
                // Re-add using base data to get skills/name etc, then override stats
                Party2.add(savedMember.id);
                const member = Party2.members.find(m => m.id === savedMember.id);
                if (member) {
                    member.hp = savedMember.hp; member.maxHp = savedMember.maxHp;
                    member.mp = savedMember.mp; member.maxMp = savedMember.maxMp;
                    member.atk = savedMember.atk; member.def = savedMember.def;
                    member.matk = savedMember.matk; member.mdef = savedMember.mdef;
                    member.hiddenExp = savedMember.hiddenExp;
                }
            });

            // Restore Quests
            QuestSystem2.killCount = data.quest.killCount;
            QuestSystem2.completed = data.quest.completed;

            // Restore Map
            Maps.current = data.map.id;
            if (window.game) {
                window.game.player.x = data.map.x;
                window.game.player.y = data.map.y;
                window.game.player.dir = data.map.dir;

                // Update Camera
                const m = Maps.get();
                if (m) {
                    Camera.update(window.game.player.x, window.game.player.y, m.w, m.h);
                }
            }

            return true;
        } catch (e) {
            console.error('Load Failed', e);
            return false;
        }
    },

    clear() {
        localStorage.removeItem(this.KEY);
    }
};

window.SaveSystem = SaveSystem;
