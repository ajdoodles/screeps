var PioneerRole = require('roles/pioneer');
var Utils = require('utils');

const MAX_UPGRADERS = 3;

function UpgraderRole() {
  PioneerRole.call(this, 'Upgrader', 'upgrader');
};
Utils.inheritFromSuperClass(UpgraderRole, PioneerRole);

UpgraderRole.prototype.needsMoreRecruits = function (curCount) {
  return curCount < MAX_UPGRADERS;
};

UpgraderRole.prototype._getNextTargetId = function (screep) {
  return screep.room.controller.id;
};

UpgraderRole.prototype._doWork = function (screep, target) {
  return screep.upgradeController(screep.room.controller);
};

UpgraderRole.prototype._isWorkDone = function (screep, target) {
  return false;
};

module.exports = new UpgraderRole();
