var PioneerRole = require('roles/pioneer');
var Roles = require('../constants/roles');
var Utils = require('utils');

function UpgraderRole() {
  PioneerRole.call(this, Roles.UPGRADER);
};
Utils.inheritFromSuperClass(UpgraderRole, PioneerRole);

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
