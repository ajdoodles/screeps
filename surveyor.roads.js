var Surveyor = require('surveyor');

function RoadSurveyor() {
  Surveyor.call(this);
};
Surveyor.prototype.inheritSurveyorMethods(RoadSurveyor);

RoadSurveyor.prototype._buildRoad = function (x, y, roomName) {
  var room = Game.rooms[roomName];
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
  var x = object.pos.x;
  var y = object.pos.y;
  [x - 1, x, x + 1].forEach(
    (i) => [y - 1, y, y + 1].forEach(
      (j) => this._buildRoad(i, j, object.room.name)));
};

RoadSurveyor.prototype._connectWithRoad = function(firstObj, secondObj) {
  var room = firstObj.room;
  var path = room.findPath(firstObj.pos, secondObj.pos, {ignoreCreeps: true, ignoreRoads: true, swampCost: 1});
  path.forEach((step) => this._buildRoad(step.x, step.y, room.name));
};

RoadSurveyor.prototype.survey = function(roomName) {
  var room = Game.rooms[roomName];
  var spawn = Game.spawns['Spawn1'];
  var sources = room.find(FIND_SOURCES);
  var extensions = room.find(FIND_MY_STRUCTURES, {filter: (struct) => struct.structureType === STRUCTURE_EXTENSION});

  this._surroundWithRoad(spawn);
  this._surroundWithRoad(room.controller);
  sources.forEach((source) => {
    this._surroundWithRoad(source);
    this._connectWithRoad(source, room.controller);
    this._connectWithRoad(source, spawn)
  });
  this._connectWithRoad(spawn, room.controller);
};

module.exports = new RoadSurveyor();
