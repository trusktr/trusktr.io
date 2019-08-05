/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var EventHandler = require('../core/EventHandler');
function EventArbiter(startMode) {
    this.dispatchers = {};
    this.currMode = undefined;
    this.setMode(startMode);
}
EventArbiter.prototype.setMode = function setMode(mode) {
    if (mode !== this.currMode) {
        var startMode = this.currMode;
        if (this.dispatchers[this.currMode])
            this.dispatchers[this.currMode].trigger('unpipe');
        this.currMode = mode;
        if (this.dispatchers[mode])
            this.dispatchers[mode].emit('pipe');
        this.emit('change', {
            from: startMode,
            to: mode
        });
    }
};
EventArbiter.prototype.forMode = function forMode(mode) {
    if (!this.dispatchers[mode])
        this.dispatchers[mode] = new EventHandler();
    return this.dispatchers[mode];
};
EventArbiter.prototype.emit = function emit(eventType, event) {
    if (this.currMode === undefined)
        return false;
    if (!event)
        event = {};
    var dispatcher = this.dispatchers[this.currMode];
    if (dispatcher)
        return dispatcher.trigger(eventType, event);
};
module.exports = EventArbiter;