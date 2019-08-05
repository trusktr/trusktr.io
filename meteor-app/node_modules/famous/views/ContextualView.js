/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Entity = require('../core/Entity');
var Transform = require('../core/Transform');
var EventHandler = require('../core/EventHandler');
var OptionsManager = require('../core/OptionsManager');
function ContextualView(options) {
    this.options = Object.create(this.constructor.DEFAULT_OPTIONS || ContextualView.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);
    if (options)
        this.setOptions(options);
    this._eventInput = new EventHandler();
    this._eventOutput = new EventHandler();
    EventHandler.setInputHandler(this, this._eventInput);
    EventHandler.setOutputHandler(this, this._eventOutput);
    this._id = Entity.register(this);
}
ContextualView.DEFAULT_OPTIONS = {};
ContextualView.prototype.setOptions = function setOptions(options) {
    return this._optionsManager.setOptions(options);
};
ContextualView.prototype.getOptions = function getOptions(key) {
    return this._optionsManager.getOptions(key);
};
ContextualView.prototype.render = function render() {
    return this._id;
};
ContextualView.prototype.commit = function commit(context) {
};
module.exports = ContextualView;