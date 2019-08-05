/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Transform = require('../core/Transform');
var Modifier = require('../core/Modifier');
var RenderNode = require('../core/RenderNode');
var Utility = require('../utilities/Utility');
var OptionsManager = require('../core/OptionsManager');
var Transitionable = require('../transitions/Transitionable');
var TransitionableTransform = require('../transitions/TransitionableTransform');
function Lightbox(options) {
    this.options = Object.create(Lightbox.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);
    if (options)
        this.setOptions(options);
    this._showing = false;
    this.nodes = [];
    this.transforms = [];
    this.states = [];
}
Lightbox.DEFAULT_OPTIONS = {
    inTransform: Transform.scale(0.001, 0.001, 0.001),
    inOpacity: 0,
    inOrigin: [
        0.5,
        0.5
    ],
    inAlign: [
        0.5,
        0.5
    ],
    outTransform: Transform.scale(0.001, 0.001, 0.001),
    outOpacity: 0,
    outOrigin: [
        0.5,
        0.5
    ],
    outAlign: [
        0.5,
        0.5
    ],
    showTransform: Transform.identity,
    showOpacity: 1,
    showOrigin: [
        0.5,
        0.5
    ],
    showAlign: [
        0.5,
        0.5
    ],
    inTransition: true,
    outTransition: true,
    overlap: false
};
Lightbox.prototype.setOptions = function setOptions(options) {
    return this._optionsManager.setOptions(options);
};
Lightbox.prototype.show = function show(renderable, transition, callback) {
    if (!renderable) {
        return this.hide(callback);
    }
    if (transition instanceof Function) {
        callback = transition;
        transition = undefined;
    }
    if (this._showing) {
        if (this.options.overlap)
            this.hide();
        else {
            return this.hide(this.show.bind(this, renderable, transition, callback));
        }
    }
    this._showing = true;
    var stateItem = {
        transform: new TransitionableTransform(this.options.inTransform),
        origin: new Transitionable(this.options.inOrigin),
        align: new Transitionable(this.options.inAlign),
        opacity: new Transitionable(this.options.inOpacity)
    };
    var transform = new Modifier({
        transform: stateItem.transform,
        opacity: stateItem.opacity,
        origin: stateItem.origin,
        align: stateItem.align
    });
    var node = new RenderNode();
    node.add(transform).add(renderable);
    this.nodes.push(node);
    this.states.push(stateItem);
    this.transforms.push(transform);
    var _cb = callback ? Utility.after(3, callback) : undefined;
    if (!transition)
        transition = this.options.inTransition;
    stateItem.transform.set(this.options.showTransform, transition, _cb);
    stateItem.opacity.set(this.options.showOpacity, transition, _cb);
    stateItem.origin.set(this.options.showOrigin, transition, _cb);
    stateItem.align.set(this.options.showAlign, transition, _cb);
};
Lightbox.prototype.hide = function hide(transition, callback) {
    if (!this._showing)
        return;
    this._showing = false;
    if (transition instanceof Function) {
        callback = transition;
        transition = undefined;
    }
    var node = this.nodes[this.nodes.length - 1];
    var transform = this.transforms[this.transforms.length - 1];
    var stateItem = this.states[this.states.length - 1];
    var _cb = Utility.after(3, function () {
        this.nodes.splice(this.nodes.indexOf(node), 1);
        this.states.splice(this.states.indexOf(stateItem), 1);
        this.transforms.splice(this.transforms.indexOf(transform), 1);
        if (callback)
            callback.call(this);
    }.bind(this));
    if (!transition)
        transition = this.options.outTransition;
    stateItem.transform.set(this.options.outTransform, transition, _cb);
    stateItem.opacity.set(this.options.outOpacity, transition, _cb);
    stateItem.origin.set(this.options.outOrigin, transition, _cb);
    stateItem.align.set(this.options.outAlign, transition, _cb);
};
Lightbox.prototype.render = function render() {
    var result = [];
    for (var i = 0; i < this.nodes.length; i++) {
        result.push(this.nodes[i].render());
    }
    return result;
};
module.exports = Lightbox;