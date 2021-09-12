import { Job } from "../constants/Jobs";
import { Loadout } from "../constants/loadouts";

declare global {
  interface CreepMemory {
    loadout: Loadout;
    role: Job;
    birthRoom: string;
    fetching: boolean;
    targetId?: Id<RoomObject>;
    sourceId?: Id<Source>;
    bufferId?: Id<StructureContainer>;
  }
}
