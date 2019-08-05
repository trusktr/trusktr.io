/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Matrix = require('./Matrix');
function Quaternion(w, x, y, z) {
    if (arguments.length === 1)
        this.set(w);
    else {
        this.w = w !== undefined ? w : 1;
        this.x = x !== undefined ? x : 0;
        this.y = y !== undefined ? y : 0;
        this.z = z !== undefined ? z : 0;
    }
    return this;
}
var register = new Quaternion(1, 0, 0, 0);
Quaternion.prototype.add = function add(q) {
    return register.setWXYZ(this.w + q.w, this.x + q.x, this.y + q.y, this.z + q.z);
};
Quaternion.prototype.sub = function sub(q) {
    return register.setWXYZ(this.w - q.w, this.x - q.x, this.y - q.y, this.z - q.z);
};
Quaternion.prototype.scalarDivide = function scalarDivide(s) {
    return this.scalarMultiply(1 / s);
};
Quaternion.prototype.scalarMultiply = function scalarMultiply(s) {
    return register.setWXYZ(this.w * s, this.x * s, this.y * s, this.z * s);
};
Quaternion.prototype.multiply = function multiply(q) {
    var x1 = this.x;
    var y1 = this.y;
    var z1 = this.z;
    var w1 = this.w;
    var x2 = q.x;
    var y2 = q.y;
    var z2 = q.z;
    var w2 = q.w || 0;
    return register.setWXYZ(w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2, x1 * w2 + x2 * w1 + y2 * z1 - y1 * z2, y1 * w2 + y2 * w1 + x1 * z2 - x2 * z1, z1 * w2 + z2 * w1 + x2 * y1 - x1 * y2);
};
var conj = new Quaternion(1, 0, 0, 0);
Quaternion.prototype.rotateVector = function rotateVector(v) {
    conj.set(this.conj());
    return register.set(this.multiply(v).multiply(conj));
};
Quaternion.prototype.inverse = function inverse() {
    return register.set(this.conj().scalarDivide(this.normSquared()));
};
Quaternion.prototype.negate = function negate() {
    return this.scalarMultiply(-1);
};
Quaternion.prototype.conj = function conj() {
    return register.setWXYZ(this.w, -this.x, -this.y, -this.z);
};
Quaternion.prototype.normalize = function normalize(length) {
    length = length === undefined ? 1 : length;
    return this.scalarDivide(length * this.norm());
};
Quaternion.prototype.makeFromAngleAndAxis = function makeFromAngleAndAxis(angle, v) {
    var n = v.normalize();
    var ha = angle * 0.5;
    var s = -Math.sin(ha);
    this.x = s * n.x;
    this.y = s * n.y;
    this.z = s * n.z;
    this.w = Math.cos(ha);
    return this;
};
Quaternion.prototype.setWXYZ = function setWXYZ(w, x, y, z) {
    register.clear();
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
};
Quaternion.prototype.set = function set(v) {
    if (v instanceof Array) {
        this.w = 0;
        this.x = v[0];
        this.y = v[1];
        this.z = v[2];
    } else {
        this.w = v.w;
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }
    if (this !== register)
        register.clear();
    return this;
};
Quaternion.prototype.put = function put(q) {
    q.set(register);
};
Quaternion.prototype.clone = function clone() {
    return new Quaternion(this);
};
Quaternion.prototype.clear = function clear() {
    this.w = 1;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    return this;
};
Quaternion.prototype.isEqual = function isEqual(q) {
    return q.w === this.w && q.x === this.x && q.y === this.y && q.z === this.z;
};
Quaternion.prototype.dot = function dot(q) {
    return this.w * q.w + this.x * q.x + this.y * q.y + this.z * q.z;
};
Quaternion.prototype.normSquared = function normSquared() {
    return this.dot(this);
};
Quaternion.prototype.norm = function norm() {
    return Math.sqrt(this.normSquared());
};
Quaternion.prototype.isZero = function isZero() {
    return !(this.x || this.y || this.z);
};
Quaternion.prototype.getTransform = function getTransform() {
    var temp = this.normalize(1);
    var x = temp.x;
    var y = temp.y;
    var z = temp.z;
    var w = temp.w;
    return [
        1 - 2 * y * y - 2 * z * z,
        2 * x * y - 2 * z * w,
        2 * x * z + 2 * y * w,
        0,
        2 * x * y + 2 * z * w,
        1 - 2 * x * x - 2 * z * z,
        2 * y * z - 2 * x * w,
        0,
        2 * x * z - 2 * y * w,
        2 * y * z + 2 * x * w,
        1 - 2 * x * x - 2 * y * y,
        0,
        0,
        0,
        0,
        1
    ];
};
var matrixRegister = new Matrix();
Quaternion.prototype.getMatrix = function getMatrix() {
    var temp = this.normalize(1);
    var x = temp.x;
    var y = temp.y;
    var z = temp.z;
    var w = temp.w;
    return matrixRegister.set([
        [
            1 - 2 * y * y - 2 * z * z,
            2 * x * y + 2 * z * w,
            2 * x * z - 2 * y * w
        ],
        [
            2 * x * y - 2 * z * w,
            1 - 2 * x * x - 2 * z * z,
            2 * y * z + 2 * x * w
        ],
        [
            2 * x * z + 2 * y * w,
            2 * y * z - 2 * x * w,
            1 - 2 * x * x - 2 * y * y
        ]
    ]);
};
var epsilon = 0.00001;
Quaternion.prototype.slerp = function slerp(q, t) {
    var omega;
    var cosomega;
    var sinomega;
    var scaleFrom;
    var scaleTo;
    cosomega = this.dot(q);
    if (1 - cosomega > epsilon) {
        omega = Math.acos(cosomega);
        sinomega = Math.sin(omega);
        scaleFrom = Math.sin((1 - t) * omega) / sinomega;
        scaleTo = Math.sin(t * omega) / sinomega;
    } else {
        scaleFrom = 1 - t;
        scaleTo = t;
    }
    return register.set(this.scalarMultiply(scaleFrom / scaleTo).add(q).scalarMultiply(scaleTo));
};
module.exports = Quaternion;