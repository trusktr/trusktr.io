/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Transform = require('../core/Transform');
var OptionsManager = require('../core/OptionsManager');
var Transitionable = require('../transitions/Transitionable');
var Utility = require('../utilities/Utility');
var SequentialLayout = require('./SequentialLayout');
function Deck(options) {
    SequentialLayout.apply(this, arguments);
    this.state = new Transitionable(0);
    this._isOpen = false;
    this.setOutputFunction(function (input, offset, index) {
        var state = _getState.call(this);
        var positionMatrix = this.options.direction === Utility.Direction.X ? Transform.translate(state * offset, 0, 0.001 * (state - 1) * offset) : Transform.translate(0, state * offset, 0.001 * (state - 1) * offset);
        var output = input.render();
        if (this.options.stackRotation) {
            var amount = this.options.stackRotation * index * (1 - state);
            output = {
                transform: Transform.rotateZ(amount),
                origin: [
                    0.5,
                    0.5
                ],
                target: output
            };
        }
        return {
            transform: positionMatrix,
            size: input.getSize(),
            target: output
        };
    });
}
Deck.prototype = Object.create(SequentialLayout.prototype);
Deck.prototype.constructor = Deck;
Deck.DEFAULT_OPTIONS = OptionsManager.patch(SequentialLayout.DEFAULT_OPTIONS, {
    transition: {
        curve: 'easeOutBounce',
        duration: 500
    },
    stackRotation: 0
});
Deck.prototype.getSize = function getSize() {
    var originalSize = SequentialLayout.prototype.getSize.apply(this, arguments);
    var firstSize = this._items ? this._items.get().getSize() : [
        0,
        0
    ];
    if (!firstSize)
        firstSize = [
            0,
            0
        ];
    var state = _getState.call(this);
    var invState = 1 - state;
    return [
        firstSize[0] * invState + originalSize[0] * state,
        firstSize[1] * invState + originalSize[1] * state
    ];
};
function _getState(returnFinal) {
    if (returnFinal)
        return this._isOpen ? 1 : 0;
    else
        return this.state.get();
}
function _setState(pos, transition, callback) {
    this.state.halt();
    this.state.set(pos, transition, callback);
}
Deck.prototype.isOpen = function isOpen() {
    return this._isOpen;
};
Deck.prototype.open = function open(callback) {
    this._isOpen = true;
    _setState.call(this, 1, this.options.transition, callback);
};
Deck.prototype.close = function close(callback) {
    this._isOpen = false;
    _setState.call(this, 0, this.options.transition, callback);
};
Deck.prototype.toggle = function toggle(callback) {
    if (this._isOpen)
        this.close(callback);
    else
        this.open(callback);
};
module.exports = Deck;