/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
function CachedMap(mappingFunction) {
    this._map = mappingFunction || null;
    this._cachedOutput = null;
    this._cachedInput = Number.NaN;
}
CachedMap.create = function create(mappingFunction) {
    var instance = new CachedMap(mappingFunction);
    return instance.get.bind(instance);
};
CachedMap.prototype.get = function get(input) {
    if (input !== this._cachedInput) {
        this._cachedInput = input;
        this._cachedOutput = this._map(input);
    }
    return this._cachedOutput;
};
module.exports = CachedMap;