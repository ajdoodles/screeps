var BuildTypes = require('../constants/BuildTypes');
var Classes = require('../utils/Classes');
var ConstructionQueues = require('../heap/ConstructionQueues');
var Surveyor = require('../surveyors/surveyor');

function RoadSurveyor() {
  Surveyor.call(this);
};
Classes.inheritFromSuperClass(RoadSurveyor, Surveyor);

RoadSurveyor.prototype._queueSurroundProject = function(room, center) {
  ConstructionQueues.enqueue(room, BuildTypes.ROADS, [center.id]);
};

RoadSurveyor.prototype._queuePathProject = function(room, from, to) {
  ConstructionQueues.enqueue(room, BuildTypes.ROADS, [from.id, to.id]);
};

RoadSurveyor.prototype.survey = function(room) {
  if (!ConstructionQueues.isEmpty(room, BuildTypes.ROADS)) {
    return;
  }

  var sourceDistances = Object.create(null);
  var sources = Array.from(room.sources);
  sources.forEach((source) => {
    var results = PathFinder.search(
      room.mainSpawn.pos,
      {pos: source.pos, range: 1},
      {swampCost: 1});
    sourceDistances[source.id] = results.path.length;
  });
  sources.sort((firstSource, secondSource) => {
    return sourceDistances[firstSource.id] - sourceDistances[secondSource.id];
  });

  var controllerSource = room.controller.pos.findClosestByPath(FIND_SOURCES);

  this._queuePathProject(room, room.mainSpawn, sources.shift());
  this._queuePathProject(room, room.mainSpawn, controllerSource);
  this._queuePathProject(room, room.controller, controllerSource);
  sources.forEach((source) => {
    if (source.id !== controllerSource.id) {
      this._queuePathProject(room, room.mainSpawn, source);
    }
  });

  this._queueSurroundProject(room, room.mainSpawn);
  room.sources.forEach((source) => this._queueSurroundProject(room, source));
};

RoadSurveyor.prototype._shouldBuild = function (room, x, y) {
  var stopBuild = false;

  stopBuild |= room.getTerrain().get(x, y) === TERRAIN_MASK_WALL;

  var sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, x, y);
  stopBuild |= sites.reduce((stopBuild, site) => (stopBuild || site.type !== STRUCTURE_RAMPART || site.type !== STRUCTURE_CONTAINER), false);

  var structures = room.lookForAt(LOOK_STRUCTURES, x, y);
  stopBuild |= structures.reduce((stopBuild, struct) => (stopBuild || struct.type !== STRUCTURE_RAMPART || struct.type !== STRUCTURE_CONTAINER), false);

  return stopBuild;
};

RoadSurveyor.prototype._generateWalkwayPlans = function(room, id) {
  var object = Game.getObjectById(id);
  var {x, y} = object.pos;
  var positions = [];
  [x - 1, x, x + 1].forEach(
    (i) => [y - 1, y, y + 1].forEach(
      (j) => {
        if (!(i === x && j === y) && this._shouldBuild(room, i, j)) {
          positions.push(room.getPositionAt(i, j));
        }
      }
    )
  );
  return positions;
};

RoadSurveyor.prototype._generateRoadPlans = function(room, firstId, secondId) {
  var firstObj = Game.getObjectById(firstId);
  var secondObj = Game.getObjectById(secondId);
  var results = PathFinder.search(
    firstObj.pos,
    {pos: secondObj.pos, range: 1},
    {ignoreCreeps:true, swampCost:1})
  return results.path;
};

RoadSurveyor.prototype.planConstruction = function(room, project) {
  var positions;
  if (project.length === 1) {
    positions = this._generateWalkwayPlans(room, project[0]);
  } if (project.length === 2) {
    positions = this._generateRoadPlans(room, project[0], project[1]);
  }

  var roadPlans = Object.create(null);
  roadPlans[STRUCTURE_ROAD] = positions;
  ConstructionQueues.setPlannedConstruction(room, BuildTypes.ROADS, roadPlans);
};

module.exports = new RoadSurveyor();
