/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
function ModifierChain() {
    this._chain = [];
    if (arguments.length)
        this.addModifier.apply(this, arguments);
}
ModifierChain.prototype.addModifier = function addModifier(varargs) {
    Array.prototype.push.apply(this._chain, arguments);
};
ModifierChain.prototype.removeModifier = function removeModifier(modifier) {
    var index = this._chain.indexOf(modifier);
    if (index < 0)
        return;
    this._chain.splice(index, 1);
};
ModifierChain.prototype.modify = function modify(input) {
    var chain = this._chain;
    var result = input;
    for (var i = 0; i < chain.length; i++) {
        result = chain[i].modify(result);
    }
    return result;
};
module.exports = ModifierChain;