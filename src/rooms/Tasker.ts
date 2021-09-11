import { Job } from "../constants/Jobs";
import * as RoomRosters from "../heap/RoomRosters";
import Pioneer from "../roles/pioneer";

function getIdlers(room: Room) {
  return RoomRosters.getRoomRosterForRole(room, Job.IDLE).map(
    (name: string) => Game.creeps[name]
  );
}

export function retaskPioneers(room: Room, role: Job, count: number) {
  if (count === 0) {
    return 0;
  }

  var idlers = getIdlers(room).slice(0, count);
  idlers.forEach((idler) => Pioneer.reassignRole(idler, role));
  return idlers.length;
}
