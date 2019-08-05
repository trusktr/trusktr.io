/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Force = require('./Force');
var Vector = require('../../math/Vector');
function Repulsion(options) {
    this.options = Object.create(Repulsion.DEFAULT_OPTIONS);
    if (options)
        this.setOptions(options);
    this.disp = new Vector();
    Force.call(this);
}
Repulsion.prototype = Object.create(Force.prototype);
Repulsion.prototype.constructor = Repulsion;
Repulsion.DECAY_FUNCTIONS = {
    LINEAR: function (r, cutoff) {
        return Math.max(1 - 1 / cutoff * r, 0);
    },
    MORSE: function (r, cutoff) {
        var r0 = cutoff === 0 ? 100 : cutoff;
        var rShifted = r + r0 * (1 - Math.log(2));
        return Math.max(1 - Math.pow(1 - Math.exp(rShifted / r0 - 1), 2), 0);
    },
    INVERSE: function (r, cutoff) {
        return 1 / (1 - cutoff + r);
    },
    GRAVITY: function (r, cutoff) {
        return 1 / (1 - cutoff + r * r);
    }
};
Repulsion.DEFAULT_OPTIONS = {
    strength: 1,
    anchor: undefined,
    range: [
        0,
        Infinity
    ],
    cutoff: 0,
    cap: Infinity,
    decayFunction: Repulsion.DECAY_FUNCTIONS.GRAVITY
};
Repulsion.prototype.setOptions = function setOptions(options) {
    if (options.anchor !== undefined) {
        if (options.anchor.position instanceof Vector)
            this.options.anchor = options.anchor.position;
        if (options.anchor instanceof Array)
            this.options.anchor = new Vector(options.anchor);
        delete options.anchor;
    }
    for (var key in options)
        this.options[key] = options[key];
};
Repulsion.prototype.applyForce = function applyForce(targets, source) {
    var options = this.options;
    var force = this.force;
    var disp = this.disp;
    var strength = options.strength;
    var anchor = options.anchor || source.position;
    var cap = options.cap;
    var cutoff = options.cutoff;
    var rMin = options.range[0];
    var rMax = options.range[1];
    var decayFn = options.decayFunction;
    if (strength === 0)
        return;
    var length = targets.length;
    var particle;
    var m1;
    var p1;
    var r;
    while (length--) {
        particle = targets[length];
        if (particle === source)
            continue;
        m1 = particle.mass;
        p1 = particle.position;
        disp.set(p1.sub(anchor));
        r = disp.norm();
        if (r < rMax && r > rMin) {
            force.set(disp.normalize(strength * m1 * decayFn(r, cutoff)).cap(cap));
            particle.applyForce(force);
        }
    }
};
module.exports = Repulsion;