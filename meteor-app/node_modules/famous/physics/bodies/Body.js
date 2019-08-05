/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Particle = require('./Particle');
var Transform = require('../../core/Transform');
var Vector = require('../../math/Vector');
var Quaternion = require('../../math/Quaternion');
var Matrix = require('../../math/Matrix');
var Integrator = require('../integrators/SymplecticEuler');
function Body(options) {
    Particle.call(this, options);
    options = options || {};
    this.orientation = new Quaternion();
    this.angularVelocity = new Vector();
    this.angularMomentum = new Vector();
    this.torque = new Vector();
    if (options.orientation)
        this.orientation.set(options.orientation);
    if (options.angularVelocity)
        this.angularVelocity.set(options.angularVelocity);
    if (options.angularMomentum)
        this.angularMomentum.set(options.angularMomentum);
    if (options.torque)
        this.torque.set(options.torque);
    this.angularVelocity.w = 0;
    this.setMomentsOfInertia();
    this.pWorld = new Vector();
}
Body.DEFAULT_OPTIONS = Particle.DEFAULT_OPTIONS;
Body.DEFAULT_OPTIONS.orientation = [
    0,
    0,
    0,
    1
];
Body.DEFAULT_OPTIONS.angularVelocity = [
    0,
    0,
    0
];
Body.prototype = Object.create(Particle.prototype);
Body.prototype.constructor = Body;
Body.prototype.isBody = true;
Body.prototype.setMass = function setMass() {
    Particle.prototype.setMass.apply(this, arguments);
    this.setMomentsOfInertia();
};
Body.prototype.setMomentsOfInertia = function setMomentsOfInertia() {
    this.inertia = new Matrix();
    this.inverseInertia = new Matrix();
};
Body.prototype.updateAngularVelocity = function updateAngularVelocity() {
    this.angularVelocity.set(this.inverseInertia.vectorMultiply(this.angularMomentum));
};
Body.prototype.toWorldCoordinates = function toWorldCoordinates(localPosition) {
    return this.pWorld.set(this.orientation.rotateVector(localPosition));
};
Body.prototype.getEnergy = function getEnergy() {
    return Particle.prototype.getEnergy.call(this) + 0.5 * this.inertia.vectorMultiply(this.angularVelocity).dot(this.angularVelocity);
};
Body.prototype.reset = function reset(p, v, q, L) {
    Particle.prototype.reset.call(this, p, v);
    this.angularVelocity.clear();
    this.setOrientation(q || [
        1,
        0,
        0,
        0
    ]);
    this.setAngularMomentum(L || [
        0,
        0,
        0
    ]);
};
Body.prototype.setOrientation = function setOrientation(q) {
    this.orientation.set(q);
};
Body.prototype.setAngularVelocity = function setAngularVelocity(w) {
    this.wake();
    this.angularVelocity.set(w);
};
Body.prototype.setAngularMomentum = function setAngularMomentum(L) {
    this.wake();
    this.angularMomentum.set(L);
};
Body.prototype.applyForce = function applyForce(force, location) {
    Particle.prototype.applyForce.call(this, force);
    if (location !== undefined)
        this.applyTorque(location.cross(force));
};
Body.prototype.applyTorque = function applyTorque(torque) {
    this.wake();
    this.torque.set(this.torque.add(torque));
};
Body.prototype.getTransform = function getTransform() {
    return Transform.thenMove(this.orientation.getTransform(), Transform.getTranslate(Particle.prototype.getTransform.call(this)));
};
Body.prototype._integrate = function _integrate(dt) {
    Particle.prototype._integrate.call(this, dt);
    this.integrateAngularMomentum(dt);
    this.updateAngularVelocity(dt);
    this.integrateOrientation(dt);
};
Body.prototype.integrateAngularMomentum = function integrateAngularMomentum(dt) {
    Integrator.integrateAngularMomentum(this, dt);
};
Body.prototype.integrateOrientation = function integrateOrientation(dt) {
    Integrator.integrateOrientation(this, dt);
};
module.exports = Body;