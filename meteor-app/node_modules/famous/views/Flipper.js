/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Transform = require('../core/Transform');
var Transitionable = require('../transitions/Transitionable');
var RenderNode = require('../core/RenderNode');
var OptionsManager = require('../core/OptionsManager');
function Flipper(options) {
    this.options = Object.create(Flipper.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);
    if (options)
        this.setOptions(options);
    this.angle = new Transitionable(0);
    this.frontNode = undefined;
    this.backNode = undefined;
    this.flipped = false;
}
Flipper.DIRECTION_X = 0;
Flipper.DIRECTION_Y = 1;
var SEPERATION_LENGTH = 1;
Flipper.DEFAULT_OPTIONS = {
    transition: true,
    direction: Flipper.DIRECTION_X
};
Flipper.prototype.flip = function flip(transition, callback) {
    var angle = this.flipped ? 0 : Math.PI;
    this.setAngle(angle, transition, callback);
    this.flipped = !this.flipped;
};
Flipper.prototype.setAngle = function setAngle(angle, transition, callback) {
    if (transition === undefined)
        transition = this.options.transition;
    if (this.angle.isActive())
        this.angle.halt();
    this.angle.set(angle, transition, callback);
};
Flipper.prototype.setOptions = function setOptions(options) {
    return this._optionsManager.setOptions(options);
};
Flipper.prototype.setFront = function setFront(node) {
    this.frontNode = node;
};
Flipper.prototype.setBack = function setBack(node) {
    this.backNode = node;
};
Flipper.prototype.render = function render() {
    var angle = this.angle.get();
    var frontTransform;
    var backTransform;
    if (this.options.direction === Flipper.DIRECTION_X) {
        frontTransform = Transform.rotateY(angle);
        backTransform = Transform.rotateY(angle + Math.PI);
    } else {
        frontTransform = Transform.rotateX(angle);
        backTransform = Transform.rotateX(angle + Math.PI);
    }
    var result = [];
    if (this.frontNode) {
        result.push({
            transform: frontTransform,
            target: this.frontNode.render()
        });
    }
    if (this.backNode) {
        result.push({
            transform: Transform.moveThen([
                0,
                0,
                SEPERATION_LENGTH
            ], backTransform),
            target: this.backNode.render()
        });
    }
    return result;
};
module.exports = Flipper;