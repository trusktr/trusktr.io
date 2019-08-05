/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Constraint = require('./Constraint');
var Vector = require('../../math/Vector');
function Curve(options) {
    this.options = Object.create(Curve.DEFAULT_OPTIONS);
    if (options)
        this.setOptions(options);
    this.J = new Vector();
    this.impulse = new Vector();
    Constraint.call(this);
}
Curve.prototype = Object.create(Constraint.prototype);
Curve.prototype.constructor = Curve;
var epsilon = 1e-7;
var pi = Math.PI;
Curve.DEFAULT_OPTIONS = {
    equation: function (x, y, z) {
        return 0;
    },
    plane: function (x, y, z) {
        return z;
    },
    period: 0,
    dampingRatio: 0
};
Curve.prototype.setOptions = function setOptions(options) {
    for (var key in options)
        this.options[key] = options[key];
};
Curve.prototype.applyConstraint = function applyConstraint(targets, source, dt) {
    var options = this.options;
    var impulse = this.impulse;
    var J = this.J;
    var f = options.equation;
    var g = options.plane;
    var dampingRatio = options.dampingRatio;
    var period = options.period;
    for (var i = 0; i < targets.length; i++) {
        var body = targets[i];
        var v = body.velocity;
        var p = body.position;
        var m = body.mass;
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
        var dfx = (f(x + epsilon, y, z) - f0) / epsilon;
        var dfy = (f(x, y + epsilon, z) - f0) / epsilon;
        var dfz = (f(x, y, z + epsilon) - f0) / epsilon;
        var g0 = g(x, y, z);
        var dgx = (g(x + epsilon, y, z) - g0) / epsilon;
        var dgy = (g(x, y + epsilon, z) - g0) / epsilon;
        var dgz = (g(x, y, z + epsilon) - g0) / epsilon;
        J.setXYZ(dfx + dgx, dfy + dgy, dfz + dgz);
        var antiDrift = beta / dt * (f0 + g0);
        var lambda = -(J.dot(v) + antiDrift) / (gamma + dt * J.normSquared() / m);
        impulse.set(J.mult(dt * lambda));
        body.applyImpulse(impulse);
    }
};
module.exports = Curve;