import { Job } from "../constants/Jobs";

import * as build from "../jobs/build";
import * as fix from "../jobs/fix";
import * as harvest from "../jobs/harvest";
import * as idle from "../jobs/idle";
import * as upgrade from "../jobs/upgrade";

var mTable = Object.create(null);

mTable[Job.BUILD] = build;
mTable[Job.FIX] = fix;
mTable[Job.HARVEST] = harvest;
mTable[Job.IDLE] = idle;
mTable[Job.UPGRADE] = upgrade;

export default Object.freeze(mTable);
