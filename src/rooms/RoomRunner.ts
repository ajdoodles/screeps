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

  var curRoleCount = RoomRosters.getRoleCount(room, role);

  if (count <= curRoleCount) {
    return; // We have enough of these, don't hire more
  }

  if (!hiringTargets.has(role)) {
    hiringTargets.set(role, 0);
  }
  hiringTargets.set(role, count - curRoleCount);
}

function _requestHarvesters(room: Room, hiringTargets: Map<Job, number>) {
  let energyGap = room.energyCapacityAvailable - room.energyAvailable;
  let energyNeeds = Math.max(energyGap, PIONEER_COST);
  // Each pioneer carries 50 energy
  let numHarvesters = Math.ceil(energyNeeds / 50);
  _matchDemand(room, Job.HARVEST, numHarvesters, hiringTargets);
}

function _requestBuilders(room: Room, hiringTargets: Map<Job, number>) {
  var sites = room.find(FIND_MY_CONSTRUCTION_SITES);
  var numBuilders = sites.length === 0 ? 0 : 4;
  _matchDemand(room, Job.BUILD, numBuilders, hiringTargets);
}

function _requestUpgraders(room: Room, hiringTargets: Map<Job, number>) {
  var roomLevel = room.controller?.level ?? 0;
  _matchDemand(room, Job.UPGRADE, roomLevel + 1, hiringTargets);
}

function _meetHiringTargets(room: Room, hiringTargets: Map<Job, number>) {
  if (hiringTargets.size === 0) {
    return;
  }

  var recruitRequest: Job[] = [];
  hiringTargets.forEach((count: number, role: Job) => {
    let retasked = retaskPioneers(room, role, count);
    let needsMore = count - retasked > 0;
    if (needsMore) {
      recruitRequest.push(role);
    }
  });
  if (recruitRequest.length > 0) {
    Recruiter.recruit(room, recruitRequest);
  }
}

export function init(roomName: string) {
  var room = Game.rooms[roomName];

  Foreman.survey(room);
}

export function run(roomName: string) {
  var room = Game.rooms[roomName];

  Recruiter.initSpawnedRecruits(room);

  if (Game.time % 25 === 0) {
    Foreman.run(room);
  }

  var hiringTargets = new Map();
  if (Game.time % 9 === 0) {
    _requestHarvesters(room, hiringTargets);
    _requestUpgraders(room, hiringTargets);
    _requestBuilders(room, hiringTargets);
    _meetHiringTargets(room, hiringTargets);
  }
}
