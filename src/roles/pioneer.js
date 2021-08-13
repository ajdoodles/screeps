/*
* Module code goes here. Use 'module.exports' to export things:
* module.exports.thing = 'a thing';
*
* You can import it from another modules like this:
* var mod = require('role');
* mod.thing == 'a thing'; // true
*/

var Role = require('roles/role');

function PioneerRole() {
  Role.call(this, 'Pio', 'pioneer', [WORK, CARRY, MOVE], 0);
};
Role.prototype.inheritRoleMethods(PioneerRole);

PioneerRole.prototype.run = function(screep) {
  this.fetchEnergy(screep);
};

module.exports = new PioneerRole();
