import { BuildType } from "../constants/BuildTypes";
import { Project } from "../heap/ConstructionQueues";

export interface Surveyor<T extends BuildType> {
  survey(room: Room): void;
  planConstruction(room: Room, project: Project<T>): void;
}
