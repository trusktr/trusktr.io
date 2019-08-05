/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Surface = require('../core/Surface');
function CanvasSurface(options) {
    if (options && options.canvasSize)
        this._canvasSize = options.canvasSize;
    Surface.apply(this, arguments);
    if (!this._canvasSize)
        this._canvasSize = this.getSize();
    this._backBuffer = document.createElement('canvas');
    if (this._canvasSize) {
        this._backBuffer.width = this._canvasSize[0];
        this._backBuffer.height = this._canvasSize[1];
    }
    this._contextId = undefined;
}
CanvasSurface.prototype = Object.create(Surface.prototype);
CanvasSurface.prototype.constructor = CanvasSurface;
CanvasSurface.prototype.elementType = 'canvas';
CanvasSurface.prototype.elementClass = 'famous-surface';
CanvasSurface.prototype.setContent = function setContent() {
};
CanvasSurface.prototype.deploy = function deploy(target) {
    if (this._canvasSize) {
        target.width = this._canvasSize[0];
        target.height = this._canvasSize[1];
    }
    if (this._contextId === '2d') {
        target.getContext(this._contextId).drawImage(this._backBuffer, 0, 0);
        this._backBuffer.width = 0;
        this._backBuffer.height = 0;
    }
};
CanvasSurface.prototype.recall = function recall(target) {
    var size = this.getSize();
    this._backBuffer.width = target.width;
    this._backBuffer.height = target.height;
    if (this._contextId === '2d') {
        this._backBuffer.getContext(this._contextId).drawImage(target, 0, 0);
        target.width = 0;
        target.height = 0;
    }
};
CanvasSurface.prototype.getContext = function getContext(contextId) {
    this._contextId = contextId;
    return this._currentTarget ? this._currentTarget.getContext(contextId) : this._backBuffer.getContext(contextId);
};
CanvasSurface.prototype.setSize = function setSize(size, canvasSize) {
    Surface.prototype.setSize.apply(this, arguments);
    if (canvasSize)
        this._canvasSize = [
            canvasSize[0],
            canvasSize[1]
        ];
    if (this._currentTarget) {
        this._currentTarget.width = this._canvasSize[0];
        this._currentTarget.height = this._canvasSize[1];
    }
};
module.exports = CanvasSurface;