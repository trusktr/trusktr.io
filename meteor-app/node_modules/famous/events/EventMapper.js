/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var EventHandler = require('../core/EventHandler');
function EventMapper(mappingFunction) {
    EventHandler.call(this);
    this._mappingFunction = mappingFunction;
}
EventMapper.prototype = Object.create(EventHandler.prototype);
EventMapper.prototype.constructor = EventMapper;
EventMapper.prototype.subscribe = null;
EventMapper.prototype.unsubscribe = null;
EventMapper.prototype.emit = function emit(type, data) {
    var target = this._mappingFunction.apply(this, arguments);
    if (target && target.emit instanceof Function)
        target.emit(type, data);
};
EventMapper.prototype.trigger = EventMapper.prototype.emit;
module.exports = EventMapper;