/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var EventHandler = require('../core/EventHandler');
function GenericSync(syncs, options) {
    this._eventInput = new EventHandler();
    this._eventOutput = new EventHandler();
    EventHandler.setInputHandler(this, this._eventInput);
    EventHandler.setOutputHandler(this, this._eventOutput);
    this._syncs = {};
    if (syncs)
        this.addSync(syncs);
    if (options)
        this.setOptions(options);
}
GenericSync.DIRECTION_X = 0;
GenericSync.DIRECTION_Y = 1;
GenericSync.DIRECTION_Z = 2;
var registry = {};
GenericSync.register = function register(syncObject) {
    for (var key in syncObject) {
        if (registry[key]) {
            if (registry[key] !== syncObject[key])
                throw new Error('Conflicting sync classes for key: ' + key);
        } else
            registry[key] = syncObject[key];
    }
};
GenericSync.prototype.setOptions = function (options) {
    for (var key in this._syncs) {
        this._syncs[key].setOptions(options);
    }
};
GenericSync.prototype.pipeSync = function pipeToSync(key) {
    var sync = this._syncs[key];
    this._eventInput.pipe(sync);
    sync.pipe(this._eventOutput);
};
GenericSync.prototype.unpipeSync = function unpipeFromSync(key) {
    var sync = this._syncs[key];
    this._eventInput.unpipe(sync);
    sync.unpipe(this._eventOutput);
};
function _addSingleSync(key, options) {
    if (!registry[key])
        return;
    this._syncs[key] = new registry[key](options);
    this.pipeSync(key);
}
GenericSync.prototype.addSync = function addSync(syncs) {
    if (syncs instanceof Array)
        for (var i = 0; i < syncs.length; i++)
            _addSingleSync.call(this, syncs[i]);
    else if (syncs instanceof Object)
        for (var key in syncs)
            _addSingleSync.call(this, key, syncs[key]);
};
module.exports = GenericSync;