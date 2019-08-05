/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var TwoFingerSync = require('./TwoFingerSync');
var OptionsManager = require('../core/OptionsManager');
function ScaleSync(options) {
    TwoFingerSync.call(this);
    this.options = Object.create(ScaleSync.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);
    if (options)
        this.setOptions(options);
    this._scaleFactor = 1;
    this._startDist = 0;
    this._eventInput.on('pipe', _reset.bind(this));
}
ScaleSync.prototype = Object.create(TwoFingerSync.prototype);
ScaleSync.prototype.constructor = ScaleSync;
ScaleSync.DEFAULT_OPTIONS = { scale: 1 };
function _reset() {
    this.touchAId = undefined;
    this.touchBId = undefined;
}
ScaleSync.prototype._startUpdate = function _startUpdate(event) {
    this._scaleFactor = 1;
    this._startDist = TwoFingerSync.calculateDistance(this.posA, this.posB);
    this._eventOutput.emit('start', {
        count: event.touches.length,
        touches: [
            this.touchAId,
            this.touchBId
        ],
        distance: this._startDist,
        center: TwoFingerSync.calculateCenter(this.posA, this.posB)
    });
};
ScaleSync.prototype._moveUpdate = function _moveUpdate(diffTime) {
    var scale = this.options.scale;
    var currDist = TwoFingerSync.calculateDistance(this.posA, this.posB);
    var center = TwoFingerSync.calculateCenter(this.posA, this.posB);
    var delta = (currDist - this._startDist) / this._startDist;
    var newScaleFactor = Math.max(1 + scale * delta, 0);
    var veloScale = (newScaleFactor - this._scaleFactor) / diffTime;
    this._eventOutput.emit('update', {
        delta: delta,
        scale: newScaleFactor,
        velocity: veloScale,
        distance: currDist,
        center: center,
        touches: [
            this.touchAId,
            this.touchBId
        ]
    });
    this._scaleFactor = newScaleFactor;
};
ScaleSync.prototype.getOptions = function getOptions() {
    return this.options;
};
ScaleSync.prototype.setOptions = function setOptions(options) {
    return this._optionsManager.setOptions(options);
};
module.exports = ScaleSync;