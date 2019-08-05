/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Constraint = require('./Constraint');
var Vector = require('../../math/Vector');
function Surface(options) {
    this.options = Object.create(Surface.DEFAULT_OPTIONS);
    if (options)
        this.setOptions(options);
    this.J = new Vector();
    this.impulse = new Vector();
    Constraint.call(this);
}
Surface.prototype = Object.create(Constraint.prototype);
Surface.prototype.constructor = Surface;
Surface.DEFAULT_OPTIONS = {
    equation: undefined,
    period: 0,
    dampingRatio: 0
};
var epsilon = 1e-7;
var pi = Math.PI;
Surface.prototype.setOptions = function setOptions(options) {
    for (var key in options)
        this.options[key] = options[key];
};
Surface.prototype.applyConstraint = function applyConstraint(targets, source, dt) {
    var impulse = this.impulse;
    var J = this.J;
    var options = this.options;
    var f = options.equation;
    var dampingRatio = options.dampingRatio;
    var period = options.period;
    for (var i = 0; i < targets.length; i++) {
        var particle = targets[i];
        var v = particle.velocity;
        var p = particle.position;
        var m = particle.mass;
        var gamma;
        var beta;
        if (period === 0) {
            gamma = 0;
            beta = 1;
        } else {
            var c = 4 * m * pi * dampingRatio / period;
            var k = 4 * m * pi * pi / (period * period);
            gamma = 1 / (c + dt * k);
            beta = dt * k / (c + dt * k);
        }
        var x = p.x;
        var y = p.y;
        var z = p.z;
        var f0 = f(x, y, z);
        var dfx = (f(x + epsilon, p, p) - f0) / epsilon;
        var dfy = (f(x, y + epsilon, p) - f0) / epsilon;
        var dfz = (f(x, y, p + epsilon) - f0) / epsilon;
        J.setXYZ(dfx, dfy, dfz);
        var antiDrift = beta / dt * f0;
        var lambda = -(J.dot(v) + antiDrift) / (gamma + dt * J.normSquared() / m);
        impulse.set(J.mult(dt * lambda));
        particle.applyImpulse(impulse);
    }
};
module.exports = Surface;