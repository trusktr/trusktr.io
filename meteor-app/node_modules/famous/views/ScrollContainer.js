/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var ContainerSurface = require('../surfaces/ContainerSurface');
var EventHandler = require('../core/EventHandler');
var Scrollview = require('./Scrollview');
var Utility = require('../utilities/Utility');
var OptionsManager = require('../core/OptionsManager');
function ScrollContainer(options) {
    this.options = Object.create(ScrollContainer.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);
    if (options)
        this.setOptions(options);
    this.container = new ContainerSurface(this.options.container);
    this.scrollview = new Scrollview(this.options.scrollview);
    this.container.add(this.scrollview);
    this._eventInput = new EventHandler();
    EventHandler.setInputHandler(this, this._eventInput);
    this._eventInput.pipe(this.scrollview);
    this._eventOutput = new EventHandler();
    EventHandler.setOutputHandler(this, this._eventOutput);
    this.container.pipe(this._eventOutput);
    this.scrollview.pipe(this._eventOutput);
}
ScrollContainer.DEFAULT_OPTIONS = {
    container: { properties: { overflow: 'hidden' } },
    scrollview: {}
};
ScrollContainer.prototype.setOptions = function setOptions(options) {
    return this._optionsManager.setOptions(options);
};
ScrollContainer.prototype.sequenceFrom = function sequenceFrom() {
    return this.scrollview.sequenceFrom.apply(this.scrollview, arguments);
};
ScrollContainer.prototype.getSize = function getSize() {
    return this.container.getSize.apply(this.container, arguments);
};
ScrollContainer.prototype.render = function render() {
    return this.container.render();
};
module.exports = ScrollContainer;