var Roles = require("constants/Roles");

module.exports = (function () {
  var mTable = Object.create(null);

  for (const [role, roleString] of Object.entries(Roles)) {
    let role;
    try {
      role = require("../roles/" + roleString);
    } catch (e) {
      role = require("../roles/" + roleString + "_dynamic");
    }

    Object.defineProperty(mTable, roleString, {
      value: role,
      writable: false,
      configurable: false,
      enumerable: true,
    });
  }

  return mTable;
})();
