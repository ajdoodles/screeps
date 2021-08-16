var Roles = require('constants/Roles');

module.exports = (function(){
  var mTable = Object.create(null);

  for (const [role, roleString] of Object.entries(Roles)) {
    Object.defineProperty(
      mTable,
      roleString,
      {
        value: require('../roles/' + roleString),
        writable: false,
        configurable: false,
        enumerable: true
      }
    );
  };

  return mTable;
})();
