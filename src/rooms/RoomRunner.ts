import { PIONEER_COST } from "../constants/Constants";
import * as Foreman from "./Foreman";
import * as Recruiter from "./Recruiter";
import { Job } from "../constants/Jobs";
import * as RoomRosters from "../heap/RoomRosters";
import { retaskPioneers } from "./Tasker";

function _matchDemand(
  room: Room,
  role: Job,
  count: number,
  hiringTargets: Map<Job, number>
) {
  if (count <= 0) {
    return;
  }

  const curRoleCount = RoomRosters.getRoleCount(room, role);

  if (count <= curRoleCount) {
    return; // We have enough of these, don't hire more
  }

  if (!hiringTargets.has(role)) {
    hiringTargets.set(role, 0);
  }
  hiringTargets.set(role, count - curRoleCount);
}

function _requestHarvesters(room: Room, hiringTargets: Map<Job, number>) {
  const energyGap = room.energyCapacityAvailable - room.energyAvailable;
  const energyNeeds = Math.max(energyGap, PIONEER_COST);
  // Each pioneer carries 50 energy
  const numHarvesters = Math.ceil(energyNeeds / 50);
  _matchDemand(room, Job.HARVEST, numHarvesters, hiringTargets);
}

function _requestBuilders(room: Room, hiringTargets: Map<Job, number>) {
  const sites = room.find(FIND_MY_CONSTRUCTION_SITES);
  const numBuilders = sites.length === 0 ? 0 : 4;
  _matchDemand(room, Job.BUILD, numBuilders, hiringTargets);
}

function _requestUpgraders(room: Room, hiringTargets: Map<Job, number>) {
  const roomLevel = room.controller?.level ?? 0;
  _matchDemand(room, Job.UPGRADE, roomLevel + 1, hiringTargets);
}

function _meetHiringTargets(room: Room, hiringTargets: Map<Job, number>) {
  if (hiringTargets.size === 0) {
    return;
  }

  const recruitRequest: Job[] = [];
  hiringTargets.forEach((count: number, role: Job) => {
    const retasked = retaskPioneers(room, role, count);
    const needsMore = count - retasked > 0;
    if (needsMore) {
      recruitRequest.push(role);
    }
  });
  if (recruitRequest.length > 0) {
    Recruiter.recruit(room, recruitRequest);
  }
}

export function init(roomName: string) {
  const room = Game.rooms[roomName];

  Foreman.survey(room);
}

export function run(roomName: string) {
  const room = Game.rooms[roomName];

  Recruiter.initSpawnedRecruits(room);

  if (Game.time % 25 === 0) {
    Foreman.run(room);
  }

  const hiringTargets = new Map();
  if (Game.time % 9 === 0) {
    _requestHarvesters(room, hiringTargets);
    _requestUpgraders(room, hiringTargets);
    _requestBuilders(room, hiringTargets);
    _meetHiringTargets(room, hiringTargets);
  }
}
