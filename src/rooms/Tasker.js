module.exports = (function () {
  var Jobs = require("../constants/Jobs");
  var RoomRosters = require("../heap/RoomRosters");
  var PioneerRole = require("../roles/pioneer");

  var _getIdlers = function (room) {
    return RoomRosters.getRoomRosterForRole(room, Jobs.IDLE).map(
      (name) => Game.creeps[name]
    );
  };

  var retaskPioneers = function (room, role, count) {
    if (count === 0) {
      return 0;
    }

    var idlers = _getIdlers(room).slice(0, count);
    idlers.forEach((idler) => PioneerRole.reassignRole(idler, role));
    return idlers.length;
  };

  var mPublic = {
    retaskPioneers: retaskPioneers,
  };

  return mPublic;
})();
