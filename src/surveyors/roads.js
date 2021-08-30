var BuildTypes = require('../constants/BuildTypes');
var Surveyor = require('surveyors/surveyor');
var Utils = require('utils');

var mConstructionQueues = requires('../heap/ConstructionQueues');

function RoadSurveyor() {
  Surveyor.call(this);
};
Utils.inheritFromSuperClass(RoadSurveyor, Surveyor);

RoadSurveyor.prototype._queueSurroundProject = function(center) {
  mConstructionQueues.queue(BuildTypes.ROADS, [center]);
};

RoadSurveyor.prototype._queuePathProject = function(from, to) {
  mConstructionQueues.queue(BuildTypes.ROADS, [from, to]);
};

RoadSurveyor.prototype.survey = function(room) {
  if (!mConstructionQueues.isEmpty()) {
    return;
  }

  var sourceDistances = Object.create(null);
  var sources = room.sources.forEach((source) => {
    var results = PathFinder.search(
      room.mainSpawn.pos,
      {pos: source.pos, range: 1},
      {swampCost: 1});
    sourceDistances[source.id] = results.path.length;
  }).sort((firstSource, secondSource) => {
    sourceDistances[firstSource.id] - sourceDistances[secondSource.id];
  });

  var controllerSource = room.controller.pos.findClosestByPath(FIND_SOURCES);

  this._queuePathProject(room.mainSpawn, sources.shift());
  this._queuePathProject(room.mainSpawn, controllerSource);
  this._queuePathProject(room.controller, controllerSource);
  sources.forEach((source) => {
    if (source.id !== controllerSource.id) {
      this._queuePathProject(room.mainSpawn, source);
    }
  });

  this._queueSurroundProject(room.mainSpawn);
  room.sources.forEach((source) => this._queueSurroundProject(source));
};

RoadSurveyor.prototype._buildRoad = function (room, x, y) {
  var stopBuild = false;

  if (room.getTerrain().get(x, y) === TERRAIN_MASK_WALL) {
    return;
  }

  var sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, x, y);
  stopBuild = sites.reduce((stopBuild, site) => (stopBuild || site.type !== STRUCTURE_RAMPART || site.type !== STRUCTURE_CONTAINER), false);
  if (stopBuild) {
    return;
  }

  var structures = room.lookForAt(LOOK_STRUCTURES, x, y);
  stopBuild = structures.reduce((stopBuild, struct) => (stopBuild || struct.type !== STRUCTURE_RAMPART || struct.type !== STRUCTURE_CONTAINER), false);
  if (stopBuild) {
    return;
  }

  room.createConstructionSite(x, y, STRUCTURE_ROAD);
};

RoadSurveyor.prototype._surroundWithRoad = function(object) {
  var {x, y} = object.pos;
  [x - 1, x, x + 1].forEach(
    (i) => [y - 1, y, y + 1].forEach(
      (j) => this._buildRoad(i, j, object.room.name)));
};

RoadSurveyor.prototype._connectWithRoad = function(firstObj, secondObj) {
  var room = firstObj.room;
  var path = room.findPath(firstObj.pos, secondObj.pos, {ignoreCreeps: true, ignoreRoads: true, swampCost: 1});
  path.forEach((step) => this._buildRoad(step.x, step.y, room.name));
};

RoadSurveyor.prototype.planConstruction = function(project) {
  if (project.length === 1) {
    _surroundWithRoad(project[0]);
  } if (project.length === 2) {
    _connectWithRoad(project[0], project[1]);
  }
};

module.exports = new RoadSurveyor();
