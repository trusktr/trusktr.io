/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var OptionsManager = require('../core/OptionsManager');
var Entity = require('../core/Entity');
var Transform = require('../core/Transform');
var ViewSequence = require('../core/ViewSequence');
var Utility = require('../utilities/Utility');
function SequentialLayout(options) {
    this._items = null;
    this._size = null;
    this._outputFunction = SequentialLayout.DEFAULT_OUTPUT_FUNCTION;
    this.options = Utility.clone(this.constructor.DEFAULT_OPTIONS || SequentialLayout.DEFAULT_OPTIONS);
    this.optionsManager = new OptionsManager(this.options);
    this.id = Entity.register(this);
    this.cachedSize = [
        undefined,
        undefined
    ];
    if (options)
        this.setOptions(options);
}
SequentialLayout.DEFAULT_OPTIONS = {
    direction: Utility.Direction.Y,
    itemSpacing: 0
};
SequentialLayout.DEFAULT_OUTPUT_FUNCTION = function DEFAULT_OUTPUT_FUNCTION(input, offset, index) {
    var transform = this.options.direction === Utility.Direction.X ? Transform.translate(offset, 0) : Transform.translate(0, offset);
    return {
        size: this.cachedSize,
        transform: transform,
        target: input.render()
    };
};
SequentialLayout.prototype.getSize = function getSize() {
    if (!this._size)
        this.render();
    return this._size;
};
SequentialLayout.prototype.sequenceFrom = function sequenceFrom(items) {
    if (items instanceof Array)
        items = new ViewSequence(items);
    this._items = items;
    return this;
};
SequentialLayout.prototype.setOptions = function setOptions(options) {
    this.optionsManager.setOptions.apply(this.optionsManager, arguments);
    return this;
};
SequentialLayout.prototype.setOutputFunction = function setOutputFunction(outputFunction) {
    this._outputFunction = outputFunction;
    return this;
};
SequentialLayout.prototype.render = function render() {
    return this.id;
};
SequentialLayout.prototype.commit = function commit(parentSpec) {
    var length = 0;
    var secondaryDirection = this.options.direction ^ 1;
    var currentNode = this._items;
    var item = null;
    var itemSize = [];
    var output = {};
    var result = [];
    var i = 0;
    this._size = [
        0,
        0
    ];
    this.cachedSize = parentSpec.size;
    while (currentNode) {
        item = currentNode.get();
        if (!item)
            break;
        if (item.getSize)
            itemSize = item.getSize();
        output = this._outputFunction.call(this, item, length, i++);
        result.push(output);
        if (itemSize) {
            if (itemSize[this.options.direction])
                length += itemSize[this.options.direction];
            if (itemSize[secondaryDirection] > this._size[secondaryDirection])
                this._size[secondaryDirection] = itemSize[secondaryDirection];
            if (itemSize[secondaryDirection] === 0)
                this._size[secondaryDirection] = undefined;
        }
        currentNode = currentNode.getNext();
        if (this.options.itemSpacing && currentNode)
            length += this.options.itemSpacing;
    }
    this._size[this.options.direction] = length;
    return {
        transform: parentSpec.transform,
        origin: parentSpec.origin,
        opacity: parentSpec.opacity,
        size: this.getSize(),
        target: result
    };
};
module.exports = SequentialLayout;