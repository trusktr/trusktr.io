/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Transform = require('../core/Transform');
var Transitionable = require('../transitions/Transitionable');
var EventHandler = require('../core/EventHandler');
var Utilities = require('../math/Utilities');
var GenericSync = require('../inputs/GenericSync');
var MouseSync = require('../inputs/MouseSync');
var TouchSync = require('../inputs/TouchSync');
GenericSync.register({
    'mouse': MouseSync,
    'touch': TouchSync
});
function Draggable(options) {
    this.options = Object.create(Draggable.DEFAULT_OPTIONS);
    if (options)
        this.setOptions(options);
    this._positionState = new Transitionable([
        0,
        0
    ]);
    this._differential = [
        0,
        0
    ];
    this._active = true;
    this.sync = new GenericSync([
        'mouse',
        'touch'
    ], { scale: this.options.scale });
    this.eventOutput = new EventHandler();
    EventHandler.setInputHandler(this, this.sync);
    EventHandler.setOutputHandler(this, this.eventOutput);
    _bindEvents.call(this);
}
var _direction = {
    x: 1,
    y: 2
};
Draggable.DIRECTION_X = _direction.x;
Draggable.DIRECTION_Y = _direction.y;
var _clamp = Utilities.clamp;
Draggable.DEFAULT_OPTIONS = {
    projection: _direction.x | _direction.y,
    scale: 1,
    xRange: null,
    yRange: null,
    snapX: 0,
    snapY: 0,
    transition: { duration: 0 }
};
function _mapDifferential(differential) {
    var opts = this.options;
    var projection = opts.projection;
    var snapX = opts.snapX;
    var snapY = opts.snapY;
    var tx = projection & _direction.x ? differential[0] : 0;
    var ty = projection & _direction.y ? differential[1] : 0;
    if (snapX > 0)
        tx -= tx % snapX;
    if (snapY > 0)
        ty -= ty % snapY;
    return [
        tx,
        ty
    ];
}
function _handleStart() {
    if (!this._active)
        return;
    if (this._positionState.isActive())
        this._positionState.halt();
    this.eventOutput.emit('start', { position: this.getPosition() });
}
function _handleMove(event) {
    if (!this._active)
        return;
    var options = this.options;
    this._differential = event.position;
    var newDifferential = _mapDifferential.call(this, this._differential);
    this._differential[0] -= newDifferential[0];
    this._differential[1] -= newDifferential[1];
    var pos = this.getPosition();
    pos[0] += newDifferential[0];
    pos[1] += newDifferential[1];
    if (options.xRange) {
        var xRange = [
            options.xRange[0] + 0.5 * options.snapX,
            options.xRange[1] - 0.5 * options.snapX
        ];
        pos[0] = _clamp(pos[0], xRange);
    }
    if (options.yRange) {
        var yRange = [
            options.yRange[0] + 0.5 * options.snapY,
            options.yRange[1] - 0.5 * options.snapY
        ];
        pos[1] = _clamp(pos[1], yRange);
    }
    this.eventOutput.emit('update', { position: pos });
}
function _handleEnd() {
    if (!this._active)
        return;
    this.eventOutput.emit('end', { position: this.getPosition() });
}
function _bindEvents() {
    this.sync.on('start', _handleStart.bind(this));
    this.sync.on('update', _handleMove.bind(this));
    this.sync.on('end', _handleEnd.bind(this));
}
Draggable.prototype.setOptions = function setOptions(options) {
    var currentOptions = this.options;
    if (options.projection !== undefined) {
        var proj = options.projection;
        this.options.projection = 0;
        [
            'x',
            'y'
        ].forEach(function (val) {
            if (proj.indexOf(val) !== -1)
                currentOptions.projection |= _direction[val];
        });
    }
    if (options.scale !== undefined) {
        currentOptions.scale = options.scale;
        this.sync.setOptions({ scale: options.scale });
    }
    if (options.xRange !== undefined)
        currentOptions.xRange = options.xRange;
    if (options.yRange !== undefined)
        currentOptions.yRange = options.yRange;
    if (options.snapX !== undefined)
        currentOptions.snapX = options.snapX;
    if (options.snapY !== undefined)
        currentOptions.snapY = options.snapY;
};
Draggable.prototype.getPosition = function getPosition() {
    return this._positionState.get();
};
Draggable.prototype.setRelativePosition = function setRelativePosition(position, transition, callback) {
    var currPos = this.getPosition();
    var relativePosition = [
        currPos[0] + position[0],
        currPos[1] + position[1]
    ];
    this.setPosition(relativePosition, transition, callback);
};
Draggable.prototype.setPosition = function setPosition(position, transition, callback) {
    if (this._positionState.isActive())
        this._positionState.halt();
    this._positionState.set(position, transition, callback);
};
Draggable.prototype.activate = function activate() {
    this._active = true;
};
Draggable.prototype.deactivate = function deactivate() {
    this._active = false;
};
Draggable.prototype.toggle = function toggle() {
    this._active = !this._active;
};
Draggable.prototype.modify = function modify(target) {
    var pos = this.getPosition();
    return {
        transform: Transform.translate(pos[0], pos[1]),
        target: target
    };
};
module.exports = Draggable;