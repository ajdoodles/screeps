module.exports = (function(){

  var Roles = require('../constants/Roles');
  var RoomRosters = require('../heap/RoomRosters');
  var PioneerRole = require('../roles/pioneer');

  var _getPioneers = function(room) {
    return RoomRosters.getRoomRosterForRole(
      room,
      Roles.PIONEER).map((name) => Game.creeps[name]);
  };

  var retaskPioneers = function(room, role, count) {
    if (count === 0) {
      return 0;
    }

    var idlers = _getPioneers(room).slice(0, count);
    if (role !== Roles.PIONEER) {
      idlers.forEach((idler) => PioneerRole.prototype.reassignRole(idler, role));
    }

    return idlers.length;
  };

  var mPublic = {
    retaskPioneers: retaskPioneers,
  };

  return mPublic;
})();
