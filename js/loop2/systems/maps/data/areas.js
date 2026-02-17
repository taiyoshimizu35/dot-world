import { CenterMap } from './center/index.js';
import { EastMap } from './east/index.js';
import { WestMap } from './west/index.js';
import { NorthMap } from './north/index.js';
import { SouthMap } from './south/index.js';
import { DemonMap } from './demon/index.js';
import { WestDungeon1, WestDungeon2, WestDungeon3 } from './west/dungeons.js';
import { NorthDungeon1, NorthDungeon2, NorthDungeon3 } from './north/dungeons.js';
import { SouthDungeon1, SouthDungeon2, SouthDungeon3 } from './south/dungeons.js';
import { EastDungeon1, EastDungeon1_2F } from './east/dungeon1.js';
import { EastDungeon2, EastDungeon2_2F } from './east/dungeon2.js';
import { EastDungeon3, EastDungeon3_2F } from './east/dungeon3.js';

export const Areas = {
    center: CenterMap,
    east: EastMap,
    west: WestMap,
    north: NorthMap,
    south: SouthMap,
    demon: DemonMap,
    // Add Dungeons
    east_dungeon_1: EastDungeon1,
    east_dungeon_1_2f: EastDungeon1_2F,
    east_dungeon_2: EastDungeon2,
    east_dungeon_2_2f: EastDungeon2_2F,
    east_dungeon_3: EastDungeon3,
    east_dungeon_3_2f: EastDungeon3_2F,
    west_dungeon_1: WestDungeon1,
    west_dungeon_2: WestDungeon2,
    west_dungeon_3: WestDungeon3,
    north_dungeon_1: NorthDungeon1,
    north_dungeon_2: NorthDungeon2,
    north_dungeon_3: NorthDungeon3,
    south_dungeon_1: SouthDungeon1,
    south_dungeon_2: SouthDungeon2,
    south_dungeon_3: SouthDungeon3
};
