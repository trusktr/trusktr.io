/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var CachedMap = require('../transitions/CachedMap');
var Entity = require('../core/Entity');
var EventHandler = require('../core/EventHandler');
var Transform = require('../core/Transform');
var RenderController = require('./RenderController');
function EdgeSwapper(options) {
    this._currentTarget = null;
    this._size = [
        undefined,
        undefined
    ];
    this._controller = new RenderController(options);
    this._controller.inTransformFrom(CachedMap.create(_transformMap.bind(this, 0.0001)));
    this._controller.outTransformFrom(CachedMap.create(_transformMap.bind(this, -0.0001)));
    this._eventInput = new EventHandler();
    EventHandler.setInputHandler(this, this._eventInput);
    this._entityId = Entity.register(this);
    if (options)
        this.setOptions(options);
}
function _transformMap(zMax, progress) {
    return Transform.translate(this._size[0] * (1 - progress), 0, zMax * (1 - progress));
}
EdgeSwapper.prototype.show = function show(content) {
    if (this._currentTarget)
        this._eventInput.unpipe(this._currentTarget);
    this._currentTarget = content;
    if (this._currentTarget && this._currentTarget.trigger)
        this._eventInput.pipe(this._currentTarget);
    this._controller.show.apply(this._controller, arguments);
};
EdgeSwapper.prototype.setOptions = function setOptions(options) {
    this._controller.setOptions(options);
};
EdgeSwapper.prototype.render = function render() {
    return this._entityId;
};
EdgeSwapper.prototype.commit = function commit(context) {
    this._size[0] = context.size[0];
    this._size[1] = context.size[1];
    return {
        transform: context.transform,
        opacity: context.opacity,
        origin: context.origin,
        size: context.size,
        target: this._controller.render()
    };
};
module.exports = EdgeSwapper;