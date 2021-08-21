module.exports = {
  inheritFromSuperClass: function(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    Object.defineProperty(
      subClass.prototype,
      'constructor',
      {
        value: subClass,
        enumerable: false, // so that it does not appear in 'for in' loop
        writable: true
      }
    );
  }
};
