/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Drag = require('./Drag');
function RotationalDrag(options) {
    Drag.call(this, options);
}
RotationalDrag.prototype = Object.create(Drag.prototype);
RotationalDrag.prototype.constructor = RotationalDrag;
RotationalDrag.DEFAULT_OPTIONS = Drag.DEFAULT_OPTIONS;
RotationalDrag.FORCE_FUNCTIONS = Drag.FORCE_FUNCTIONS;
RotationalDrag.FORCE_FUNCTIONS = {
    LINEAR: function (angularVelocity) {
        return angularVelocity;
    },
    QUADRATIC: function (angularVelocity) {
        return angularVelocity.mult(angularVelocity.norm());
    }
};
RotationalDrag.prototype.applyForce = function applyForce(targets) {
    var strength = this.options.strength;
    var forceFunction = this.options.forceFunction;
    var force = this.force;
    var index;
    var particle;
    for (index = 0; index < targets.length; index++) {
        particle = targets[index];
        forceFunction(particle.angularVelocity).mult(-100 * strength).put(force);
        particle.applyTorque(force);
    }
};
RotationalDrag.prototype.setOptions = function setOptions(options) {
    for (var key in options)
        this.options[key] = options[key];
};
module.exports = RotationalDrag;