import { Job } from "../constants/Jobs";

declare global {
  interface CreepMemory {
    role: Job;
    birthRoom: string;
    sourceId?: Id<Source>;
    bufferId?: Id<StructureContainer>;
  }
}
