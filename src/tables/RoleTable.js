var Roles = require("constants/Roles");

module.exports = (function () {
  var mTable = Object.create(null);

  for (const role of Object.values(Roles)) {
    let roleClass;
    try {
      roleClass = require("../roles/" + role);
    } catch (e) {
      roleClass = require("../roles/" + role + "_dynamic");
    }

    Object.defineProperty(mTable, role, {
      value: roleClass,
      writable: false,
      configurable: false,
      enumerable: true,
    });
  }

  return mTable;
})();
