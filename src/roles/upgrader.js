var PioneerRole = require("roles/pioneer");
var Roles = require("../constants/Roles");
var Classes = require("../utils/Classes");

function UpgraderRole() {
  PioneerRole.call(this, Roles.UPGRADER);
}
Classes.inheritFromSuperClass(UpgraderRole, PioneerRole);

UpgraderRole.prototype._getNextTarget = function (screep) {
  return screep.room.controller;
};

UpgraderRole.prototype._doWork = function (screep) {
  return screep.upgradeController(screep.room.controller);
};

module.exports = new UpgraderRole();
