/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var TwoFingerSync = require('./TwoFingerSync');
var OptionsManager = require('../core/OptionsManager');
function RotateSync(options) {
    TwoFingerSync.call(this);
    this.options = Object.create(RotateSync.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);
    if (options)
        this.setOptions(options);
    this._angle = 0;
    this._previousAngle = 0;
}
RotateSync.prototype = Object.create(TwoFingerSync.prototype);
RotateSync.prototype.constructor = RotateSync;
RotateSync.DEFAULT_OPTIONS = { scale: 1 };
RotateSync.prototype._startUpdate = function _startUpdate(event) {
    this._angle = 0;
    this._previousAngle = TwoFingerSync.calculateAngle(this.posA, this.posB);
    var center = TwoFingerSync.calculateCenter(this.posA, this.posB);
    this._eventOutput.emit('start', {
        count: event.touches.length,
        angle: this._angle,
        center: center,
        touches: [
            this.touchAId,
            this.touchBId
        ]
    });
};
RotateSync.prototype._moveUpdate = function _moveUpdate(diffTime) {
    var scale = this.options.scale;
    var currAngle = TwoFingerSync.calculateAngle(this.posA, this.posB);
    var center = TwoFingerSync.calculateCenter(this.posA, this.posB);
    var diffTheta = scale * (currAngle - this._previousAngle);
    var velTheta = diffTheta / diffTime;
    this._angle += diffTheta;
    this._eventOutput.emit('update', {
        delta: diffTheta,
        velocity: velTheta,
        angle: this._angle,
        center: center,
        touches: [
            this.touchAId,
            this.touchBId
        ]
    });
    this._previousAngle = currAngle;
};
RotateSync.prototype.getOptions = function getOptions() {
    return this.options;
};
RotateSync.prototype.setOptions = function setOptions(options) {
    return this._optionsManager.setOptions(options);
};
module.exports = RotateSync;