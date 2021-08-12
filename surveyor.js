function Surveyor() {
};

Surveyor.prototype.inheritSurveyorMethods = function (subSurveyor) {
  subSurveyor.prototype = Object.create(Surveyor.prototype);
  Object.defineProperty(
    subSurveyor.prototype,
    'constructor',
    {
      value: subSurveyor,
      enumerable: false, // so that it does not appear in 'for in' loop
      writable: true
    });
};

Surveyor.prototype.survey = function (roomName) {

};

module.exports = Surveyor;
