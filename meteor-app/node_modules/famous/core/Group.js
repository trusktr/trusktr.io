/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Context = require('./Context');
var Transform = require('./Transform');
var Surface = require('./Surface');
function Group(options) {
    Surface.call(this, options);
    this._shouldRecalculateSize = false;
    this._container = document.createDocumentFragment();
    this.context = new Context(this._container);
    this.setContent(this._container);
    this._groupSize = [
        undefined,
        undefined
    ];
}
Group.SIZE_ZERO = [
    0,
    0
];
Group.prototype = Object.create(Surface.prototype);
Group.prototype.elementType = 'div';
Group.prototype.elementClass = 'famous-group';
Group.prototype.add = function add() {
    return this.context.add.apply(this.context, arguments);
};
Group.prototype.render = function render() {
    return Surface.prototype.render.call(this);
};
Group.prototype.deploy = function deploy(target) {
    this.context.migrate(target);
};
Group.prototype.recall = function recall(target) {
    this._container = document.createDocumentFragment();
    this.context.migrate(this._container);
};
Group.prototype.commit = function commit(context) {
    var transform = context.transform;
    var origin = context.origin;
    var opacity = context.opacity;
    var size = context.size;
    var result = Surface.prototype.commit.call(this, {
        allocator: context.allocator,
        transform: Transform.thenMove(transform, [
            -origin[0] * size[0],
            -origin[1] * size[1],
            0
        ]),
        opacity: opacity,
        origin: origin,
        size: Group.SIZE_ZERO
    });
    if (size[0] !== this._groupSize[0] || size[1] !== this._groupSize[1]) {
        this._groupSize[0] = size[0];
        this._groupSize[1] = size[1];
        this.context.setSize(size);
    }
    this.context.update({
        transform: Transform.translate(-origin[0] * size[0], -origin[1] * size[1], 0),
        origin: origin,
        size: size
    });
    return result;
};
module.exports = Group;