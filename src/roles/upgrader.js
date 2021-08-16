var PioneerRole = require('roles/pioneer');
var Roles = require('../constants/roles');
var Utils = require('utils');

const MAX_UPGRADERS = 3;

function UpgraderRole() {
  PioneerRole.call(this, 'Upgrader', Roles.UPGRADER);
};
Utils.inheritFromSuperClass(UpgraderRole, PioneerRole);

UpgraderRole.prototype.needsMoreRecruits = function (curCount) {
  return curCount < MAX_UPGRADERS;
};

UpgraderRole.prototype._getNextTarget = function (screep) {
  return screep.room.controller;
};

UpgraderRole.prototype._doWork = function (screep, target) {
  return screep.upgradeController(screep.room.controller);
};

UpgraderRole.prototype._isWorkDone = function (screep, target) {
  return false;
};

module.exports = new UpgraderRole();
