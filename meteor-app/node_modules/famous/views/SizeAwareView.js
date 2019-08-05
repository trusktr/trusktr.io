/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var View = require('../core/View');
var Entity = require('../core/Entity');
var Transform = require('../core/Transform');
function SizeAwareView() {
    View.apply(this, arguments);
    this._id = Entity.register(this);
    this._parentSize = [];
}
SizeAwareView.prototype = Object.create(View.prototype);
SizeAwareView.prototype.constructor = SizeAwareView;
SizeAwareView.prototype.commit = function commit(context) {
    var transform = context.transform;
    var opacity = context.opacity;
    var origin = context.origin;
    if (!this._parentSize || this._parentSize[0] !== context.size[0] || this._parentSize[1] !== context.size[1]) {
        this._parentSize[0] = context.size[0];
        this._parentSize[1] = context.size[1];
        this._eventInput.emit('parentResize', this._parentSize);
        if (this.onResize)
            this.onResize(this._parentSize);
    }
    if (this._parentSize) {
        transform = Transform.moveThen([
            -this._parentSize[0] * origin[0],
            -this._parentSize[1] * origin[1],
            0
        ], transform);
    }
    return {
        transform: transform,
        opacity: opacity,
        size: this._parentSize,
        target: this._node.render()
    };
};
SizeAwareView.prototype.getParentSize = function getParentSize() {
    return this._parentSize;
};
SizeAwareView.prototype.render = function render() {
    return this._id;
};
module.exports = SizeAwareView;