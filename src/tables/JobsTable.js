var Jobs = require("../constants/Jobs");

module.exports = (function () {
  var mTable = Object.create(null);

  mTable[Jobs.BUILD] = require("../jobs/build");
  mTable[Jobs.FIX] = require("../jobs/fix");
  mTable[Jobs.HARVEST] = require("../jobs/harvest");
  mTable[Jobs.IDLE] = require("../jobs/idle");
  mTable[Jobs.UPGRADE] = require("../jobs/upgrade");

  return Object.freeze(mTable);
})();
