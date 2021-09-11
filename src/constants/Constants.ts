import { getBodyCost } from "../utils/Utils";

export const PIONEER_NAME = "Pioneer";
export const PIONEER_BODY = [WORK, CARRY, MOVE];
export const PIONEER_COST = getBodyCost(PIONEER_BODY);

export const MINER_NAME = "Miner";
export const MINER_BODY = [WORK, WORK, WORK, WORK, WORK, MOVE];
