/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Modifier = require('../core/Modifier');
var RenderNode = require('../core/RenderNode');
var Transform = require('../core/Transform');
var Transitionable = require('../transitions/Transitionable');
var View = require('../core/View');
function RenderController(options) {
    View.apply(this, arguments);
    this._showing = -1;
    this._outgoingRenderables = [];
    this._nextRenderable = null;
    this._renderables = [];
    this._nodes = [];
    this._modifiers = [];
    this._states = [];
    this.inTransformMap = RenderController.DefaultMap.transform;
    this.inOpacityMap = RenderController.DefaultMap.opacity;
    this.inOriginMap = RenderController.DefaultMap.origin;
    this.inAlignMap = RenderController.DefaultMap.align;
    this.outTransformMap = RenderController.DefaultMap.transform;
    this.outOpacityMap = RenderController.DefaultMap.opacity;
    this.outOriginMap = RenderController.DefaultMap.origin;
    this.outAlignMap = RenderController.DefaultMap.align;
    this._output = [];
}
RenderController.prototype = Object.create(View.prototype);
RenderController.prototype.constructor = RenderController;
RenderController.DEFAULT_OPTIONS = {
    inTransition: true,
    outTransition: true,
    overlap: true
};
RenderController.DefaultMap = {
    transform: function () {
        return Transform.identity;
    },
    opacity: function (progress) {
        return progress;
    },
    origin: null,
    align: null
};
function _mappedState(map, state) {
    return map(state.get());
}
RenderController.prototype.inTransformFrom = function inTransformFrom(transform) {
    if (transform instanceof Function)
        this.inTransformMap = transform;
    else if (transform && transform.get)
        this.inTransformMap = transform.get.bind(transform);
    else
        throw new Error('inTransformFrom takes only function or getter object');
    return this;
};
RenderController.prototype.inOpacityFrom = function inOpacityFrom(opacity) {
    if (opacity instanceof Function)
        this.inOpacityMap = opacity;
    else if (opacity && opacity.get)
        this.inOpacityMap = opacity.get.bind(opacity);
    else
        throw new Error('inOpacityFrom takes only function or getter object');
    return this;
};
RenderController.prototype.inOriginFrom = function inOriginFrom(origin) {
    if (origin instanceof Function)
        this.inOriginMap = origin;
    else if (origin && origin.get)
        this.inOriginMap = origin.get.bind(origin);
    else
        throw new Error('inOriginFrom takes only function or getter object');
    return this;
};
RenderController.prototype.inAlignFrom = function inAlignFrom(align) {
    if (align instanceof Function)
        this.inAlignMap = align;
    else if (align && align.get)
        this.inAlignMap = align.get.bind(align);
    else
        throw new Error('inAlignFrom takes only function or getter object');
    return this;
};
RenderController.prototype.outTransformFrom = function outTransformFrom(transform) {
    if (transform instanceof Function)
        this.outTransformMap = transform;
    else if (transform && transform.get)
        this.outTransformMap = transform.get.bind(transform);
    else
        throw new Error('outTransformFrom takes only function or getter object');
    return this;
};
RenderController.prototype.outOpacityFrom = function outOpacityFrom(opacity) {
    if (opacity instanceof Function)
        this.outOpacityMap = opacity;
    else if (opacity && opacity.get)
        this.outOpacityMap = opacity.get.bind(opacity);
    else
        throw new Error('outOpacityFrom takes only function or getter object');
    return this;
};
RenderController.prototype.outOriginFrom = function outOriginFrom(origin) {
    if (origin instanceof Function)
        this.outOriginMap = origin;
    else if (origin && origin.get)
        this.outOriginMap = origin.get.bind(origin);
    else
        throw new Error('outOriginFrom takes only function or getter object');
    return this;
};
RenderController.prototype.outAlignFrom = function outAlignFrom(align) {
    if (align instanceof Function)
        this.outAlignMap = align;
    else if (align && align.get)
        this.outAlignMap = align.get.bind(align);
    else
        throw new Error('outAlignFrom takes only function or getter object');
    return this;
};
RenderController.prototype.show = function show(renderable, transition, callback) {
    if (!renderable) {
        return this.hide(callback);
    }
    if (transition instanceof Function) {
        callback = transition;
        transition = null;
    }
    if (this._showing >= 0) {
        if (this.options.overlap)
            this.hide();
        else {
            if (this._nextRenderable) {
                this._nextRenderable = renderable;
            } else {
                this._nextRenderable = renderable;
                this.hide(function () {
                    if (this._nextRenderable === renderable)
                        this.show(this._nextRenderable, callback);
                    this._nextRenderable = null;
                });
            }
            return undefined;
        }
    }
    var state = null;
    var renderableIndex = this._renderables.indexOf(renderable);
    if (renderableIndex >= 0) {
        this._showing = renderableIndex;
        state = this._states[renderableIndex];
        state.halt();
        var outgoingIndex = this._outgoingRenderables.indexOf(renderable);
        if (outgoingIndex >= 0)
            this._outgoingRenderables.splice(outgoingIndex, 1);
    } else {
        state = new Transitionable(0);
        var modifier = new Modifier({
            transform: this.inTransformMap ? _mappedState.bind(this, this.inTransformMap, state) : null,
            opacity: this.inOpacityMap ? _mappedState.bind(this, this.inOpacityMap, state) : null,
            origin: this.inOriginMap ? _mappedState.bind(this, this.inOriginMap, state) : null,
            align: this.inAlignMap ? _mappedState.bind(this, this.inAlignMap, state) : null
        });
        var node = new RenderNode();
        node.add(modifier).add(renderable);
        this._showing = this._nodes.length;
        this._nodes.push(node);
        this._modifiers.push(modifier);
        this._states.push(state);
        this._renderables.push(renderable);
    }
    if (!transition)
        transition = this.options.inTransition;
    state.set(1, transition, callback);
};
RenderController.prototype.hide = function hide(transition, callback) {
    if (this._showing < 0)
        return;
    var index = this._showing;
    this._showing = -1;
    if (transition instanceof Function) {
        callback = transition;
        transition = undefined;
    }
    var node = this._nodes[index];
    var modifier = this._modifiers[index];
    var state = this._states[index];
    var renderable = this._renderables[index];
    modifier.transformFrom(this.outTransformMap ? _mappedState.bind(this, this.outTransformMap, state) : null);
    modifier.opacityFrom(this.outOpacityMap ? _mappedState.bind(this, this.outOpacityMap, state) : null);
    modifier.originFrom(this.outOriginMap ? _mappedState.bind(this, this.outOriginMap, state) : null);
    modifier.alignFrom(this.outAlignMap ? _mappedState.bind(this, this.outAlignMap, state) : null);
    if (this._outgoingRenderables.indexOf(renderable) < 0)
        this._outgoingRenderables.push(renderable);
    if (!transition)
        transition = this.options.outTransition;
    state.halt();
    state.set(0, transition, function (node, modifier, state, renderable) {
        if (this._outgoingRenderables.indexOf(renderable) >= 0) {
            var index = this._nodes.indexOf(node);
            this._nodes.splice(index, 1);
            this._modifiers.splice(index, 1);
            this._states.splice(index, 1);
            this._renderables.splice(index, 1);
            this._outgoingRenderables.splice(this._outgoingRenderables.indexOf(renderable), 1);
            if (this._showing >= index)
                this._showing--;
        }
        if (callback)
            callback.call(this);
    }.bind(this, node, modifier, state, renderable));
};
RenderController.prototype.render = function render() {
    var result = this._output;
    if (result.length > this._nodes.length)
        result.splice(this._nodes.length);
    for (var i = 0; i < this._nodes.length; i++) {
        result[i] = this._nodes[i].render();
    }
    return result;
};
module.exports = RenderController;