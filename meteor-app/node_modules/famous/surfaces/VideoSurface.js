/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Surface = require('../core/Surface');
function VideoSurface(options) {
    Surface.apply(this, arguments);
    this._videoUrl = undefined;
    this.options = Object.create(VideoSurface.DEFAULT_OPTIONS);
    if (options)
        this.setOptions(options);
}
VideoSurface.prototype = Object.create(Surface.prototype);
VideoSurface.prototype.constructor = VideoSurface;
VideoSurface.DEFAULT_OPTIONS = { autoplay: false };
VideoSurface.prototype.elementType = 'video';
VideoSurface.prototype.elementClass = 'famous-surface';
VideoSurface.prototype.setOptions = function setOptions(options) {
    if (options.size)
        this.setSize(options.size);
    if (options.classes)
        this.setClasses(options.classes);
    if (options.properties)
        this.setProperties(options.properties);
    if (options.autoplay)
        this.options.autoplay = options.autoplay;
    if (options.src) {
        this._videoUrl = options.src;
        this._contentDirty = true;
    }
};
VideoSurface.prototype.setContent = function setContent(videoUrl) {
    this._videoUrl = videoUrl;
    this._contentDirty = true;
};
VideoSurface.prototype.deploy = function deploy(target) {
    target.src = this._videoUrl;
    target.autoplay = this.options.autoplay;
};
VideoSurface.prototype.recall = function recall(target) {
    target.src = '';
};
module.exports = VideoSurface;