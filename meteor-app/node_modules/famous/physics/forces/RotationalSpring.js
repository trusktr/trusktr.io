/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Force = require('./Force');
var Spring = require('./Spring');
var Quaternion = require('../../math/Quaternion');
function RotationalSpring(options) {
    Spring.call(this, options);
}
RotationalSpring.prototype = Object.create(Spring.prototype);
RotationalSpring.prototype.constructor = RotationalSpring;
RotationalSpring.DEFAULT_OPTIONS = Spring.DEFAULT_OPTIONS;
RotationalSpring.FORCE_FUNCTIONS = Spring.FORCE_FUNCTIONS;
var pi = Math.PI;
function _calcStiffness() {
    var options = this.options;
    options.stiffness = Math.pow(2 * pi / options.period, 2);
}
function _calcDamping() {
    var options = this.options;
    options.damping = 4 * pi * options.dampingRatio / options.period;
}
function _init() {
    _calcStiffness.call(this);
    _calcDamping.call(this);
}
RotationalSpring.prototype.setOptions = function setOptions(options) {
    if (options.anchor !== undefined) {
        if (options.anchor instanceof Quaternion)
            this.options.anchor = options.anchor;
        if (options.anchor instanceof Array)
            this.options.anchor = new Quaternion(options.anchor);
    }
    if (options.period !== undefined) {
        this.options.period = options.period;
    }
    if (options.dampingRatio !== undefined)
        this.options.dampingRatio = options.dampingRatio;
    if (options.length !== undefined)
        this.options.length = options.length;
    if (options.forceFunction !== undefined)
        this.options.forceFunction = options.forceFunction;
    if (options.maxLength !== undefined)
        this.options.maxLength = options.maxLength;
    _init.call(this);
    Force.prototype.setOptions.call(this, options);
};
RotationalSpring.prototype.applyForce = function applyForce(targets) {
    var force = this.force;
    var options = this.options;
    var disp = this.disp;
    var stiffness = options.stiffness;
    var damping = options.damping;
    var restLength = options.length;
    var anchor = options.anchor;
    var forceFunction = options.forceFunction;
    var maxLength = options.maxLength;
    var i;
    var target;
    var dist;
    var m;
    for (i = 0; i < targets.length; i++) {
        target = targets[i];
        disp.set(anchor.sub(target.orientation));
        dist = disp.norm() - restLength;
        if (dist === 0)
            return;
        m = target.mass;
        stiffness *= m;
        damping *= m;
        force.set(disp.normalize(stiffness * forceFunction(dist, maxLength)));
        if (damping)
            force.add(target.angularVelocity.mult(-damping)).put(force);
        target.applyTorque(force);
    }
};
RotationalSpring.prototype.getEnergy = function getEnergy(targets) {
    var options = this.options;
    var restLength = options.length;
    var anchor = options.anchor;
    var strength = options.stiffness;
    var energy = 0;
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        var dist = anchor.sub(target.orientation).norm() - restLength;
        energy += 0.5 * strength * dist * dist;
    }
    return energy;
};
module.exports = RotationalSpring;