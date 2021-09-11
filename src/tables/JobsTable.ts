import Jobs from "../constants/Jobs";

import * as build from "../jobs/build";
import * as fix from "../jobs/fix";
import * as harvest from "../jobs/harvest";
import * as idle from "../jobs/idle";
import * as upgrade from "../jobs/upgrade";

var mTable = Object.create(null);

mTable[Jobs.BUILD] = build;
mTable[Jobs.FIX] = fix;
mTable[Jobs.HARVEST] = harvest;
mTable[Jobs.IDLE] = idle;
mTable[Jobs.UPGRADE] = upgrade;

export default Object.freeze(mTable);
