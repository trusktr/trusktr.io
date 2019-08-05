/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Transitionable = require('../transitions/Transitionable');
var OptionsManager = require('../core/OptionsManager');
function Fader(options, startState) {
    this.options = Object.create(Fader.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);
    if (options)
        this.setOptions(options);
    if (!startState)
        startState = 0;
    this.transitionHelper = new Transitionable(startState);
}
Fader.DEFAULT_OPTIONS = {
    cull: false,
    transition: true,
    pulseInTransition: true,
    pulseOutTransition: true
};
Fader.prototype.setOptions = function setOptions(options) {
    return this._optionsManager.setOptions(options);
};
Fader.prototype.show = function show(transition, callback) {
    transition = transition || this.options.transition;
    this.set(1, transition, callback);
};
Fader.prototype.hide = function hide(transition, callback) {
    transition = transition || this.options.transition;
    this.set(0, transition, callback);
};
Fader.prototype.set = function set(state, transition, callback) {
    this.halt();
    this.transitionHelper.set(state, transition, callback);
};
Fader.prototype.halt = function halt() {
    this.transitionHelper.halt();
};
Fader.prototype.isVisible = function isVisible() {
    return this.transitionHelper.get() > 0;
};
Fader.prototype.modify = function modify(target) {
    var currOpacity = this.transitionHelper.get();
    if (this.options.cull && !currOpacity)
        return undefined;
    else
        return {
            opacity: currOpacity,
            target: target
        };
};
module.exports = Fader;