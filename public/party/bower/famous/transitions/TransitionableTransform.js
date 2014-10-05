/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Transitionable = require('./Transitionable');
    var Transform = require('famous/core/Transform');
    var Utility = require('famous/utilities/Utility');

    /**
     * A class for transitioning the state of a Transform by transitioning the
     * X, Y, and Z axes of it's translate, scale, skew and rotate components
     * independently.
     *
     * @class TransitionableTransform
     * @constructor
     *
     * @param [transform=Transform.identity] {Transform} The initial transform state
     */
    function TransitionableTransform(transform) {
        this._final = Transform.identity.slice();

        this._finalTranslate = [0, 0, 0];
        this._finalRotate = [0, 0, 0];
        this._finalSkew = [0, 0, 0];
        this._finalScale = [1, 1, 1];

        this.translateX = new Transitionable(this._finalTranslate[0]);
        this.translateY = new Transitionable(this._finalTranslate[1]);
        this.translateZ = new Transitionable(this._finalTranslate[2]);
        this.rotateX = new Transitionable(this._finalRotate[0]);
        this.rotateY = new Transitionable(this._finalRotate[1]);
        this.rotateZ = new Transitionable(this._finalRotate[2]);
        this.skewX = new Transitionable(this._finalSkew[0]);
        this.skewY = new Transitionable(this._finalSkew[1]);
        this.skewZ = new Transitionable(this._finalSkew[2]);
        this.scaleX = new Transitionable(this._finalScale[0]);
        this.scaleY = new Transitionable(this._finalScale[1]);
        this.scaleZ = new Transitionable(this._finalScale[2]);

        if (transform) this.set(transform);
    }

    function _build() {
        return Transform.build({
            translate: [this.translateX.get(), this.translateY.get(), this.translateZ.get()],
            rotate:    [this.rotateX.get(),    this.rotateY.get(),    this.rotateZ.get()],
            skew:      [this.skewX.get(),      this.skewY.get(),      this.skewZ.get()],
            scale:     [this.scaleX.get(),     this.scaleY.get(),     this.scaleZ.get()]
        });
    }

    function _buildFinal() {
        return Transform.build({
            translate: this._finalTranslate,
            rotate: this._finalRotate,
            skew: this._finalSkew,
            scale: this._finalScale
        });
    }

    /**
     * An optimized way of setting only the translation component of a Transform. Axes who's values are null will not be affected.
     *
     * @method setTranslate
     * @chainable
     *
     * @param translate {Array}     New translation state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setTranslate = function setTranslate(translate, transition, callback) {
        if (translate[0] !== null) {
            this.translateX.set(translate[0], transition, callback);
            this._finalTranslate[0] = translate[0];
        }
        if (translate[1] !== null) {
            this.translateY.set(translate[1], transition, callback);
            this._finalTranslate[1] = translate[1];
        }
        if (translate[2] !== null) {
            this.translateZ.set(translate[2], transition, callback);
            this._finalTranslate[2] = translate[2];
        }
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * An optimized way of setting only the scale component of a Transform. Axes who's values are null will not be affected.
     *
     * @method setScale
     * @chainable
     *
     * @param scale {Array}         New scale state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setScale = function setScale(scale, transition, callback) {
        if (scale[0] !== null) {
            this.scaleX.set(scale[0], transition, callback);
            this._finalScale[0] = scale[0];
        }
        if (scale[1] !== null) {
            this.scaleY.set(scale[1], transition, callback);
            this._finalScale[1] = scale[1];
        }
        if (scale[2] !== null) {
            this.scaleZ.set(scale[2], transition, callback);
            this._finalScale[2] = scale[2];
        }
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * An optimized way of setting only the rotational component of a Transform. Axes who's values are null will not be affected.
     *
     * @method setRotate
     * @chainable
     *
     * @param eulerAngles {Array}   Euler angles for new rotation state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setRotate = function setRotate(eulerAngles, transition, callback) {
        if (eulerAngles[0] !== null) {
            this.rotateX.set(eulerAngles[0], transition, callback);
            this._finalRotate[0] = eulerAngles[0];
        }
        if (eulerAngles[1] !== null) {
            this.rotateY.set(eulerAngles[1], transition, callback);
            this._finalRotate[1] = eulerAngles[1];
        }
        if (eulerAngles[2] !== null) {
            this.rotateZ.set(eulerAngles[2], transition, callback);
            this._finalRotate[2] = eulerAngles[2];
        }
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * An optimized way of setting only the skew component of a Transform. Axes who's values are null will not be affected.
     *
     * @method setSkew
     * @chainable
     *
     * @param skewAngles {Array}    New skew state. Axes who's values are null will not be affected.
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setSkew = function setSkew(skewAngles, transition, callback) {
        if (skewAngles[0] !== null) {
            this.skewX.set(skewAngles[0], transition, callback);
            this._finalSkew[0] = skewAngles[0];
        }
        if (skewAngles[1] !== null) {
            this.skewY.set(skewAngles[1], transition, callback);
            this._finalSkew[1] = skewAngles[1];
        }
        if (skewAngles[2] !== null) {
            this.skewZ.set(skewAngles[2], transition, callback);
            this._finalSkew[2] = skewAngles[2];
        }
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Setter for a TransitionableTransform with optional parameters to transition
     * between Transforms. Animates all axes of all components.
     *
     * @method set
     * @chainable
     *
     * @param transform {Array}     New transform state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.set = function set(transform, transition, callback) {
        var components = Transform.interpret(transform);

        this._finalTranslate = components.translate;
        this._finalRotate = components.rotate;
        this._finalSkew = components.skew;
        this._finalScale = components.scale;
        this._final = transform;

        var _callback = callback ? Utility.after(4, callback) : null;
        this.translateX.set(components.translate[0], transition, _callback);
        this.translateY.set(components.translate[1], transition, _callback);
        this.translateZ.set(components.translate[2], transition, _callback);
        this.rotateX.set(components.rotate[0], transition, _callback);
        this.rotateY.set(components.rotate[1], transition, _callback);
        this.rotateZ.set(components.rotate[2], transition, _callback);
        this.skewX.set(components.skew[0], transition, _callback);
        this.skewY.set(components.skew[1], transition, _callback);
        this.skewZ.set(components.skew[2], transition, _callback);
        this.scaleX.set(components.scale[0], transition, _callback);
        this.scaleY.set(components.scale[1], transition, _callback);
        this.scaleZ.set(components.scale[2], transition, _callback);
        return this;
    };

    /**
     * Sets the default transition to use for transitioning betwen Transform states
     *
     * @method setDefaultTransition
     *
     * @param transition {Object} Transition definition
     */
    TransitionableTransform.prototype.setDefaultTransition = function setDefaultTransition(transition) {
        this.translateX.setDefault(transition);
        this.translateY.setDefault(transition);
        this.translateZ.setDefault(transition);
        this.rotateX.setDefault(transition);
        this.rotateY.setDefault(transition);
        this.rotateZ.setDefault(transition);
        this.skewX.setDefault(transition);
        this.skewY.setDefault(transition);
        this.skewZ.setDefault(transition);
        this.scaleX.setDefault(transition);
        this.scaleY.setDefault(transition);
        this.scaleZ.setDefault(transition);
    };

    /**
     * Getter. Returns the current state of the Transform
     *
     * @method get
     *
     * @return {Transform}
     */
    TransitionableTransform.prototype.get = function get() {
        if (this.isActive()) {
            return _build.call(this);
        }
        else return this._final;
    };

    /**
     * Get the destination state of the Transform
     *
     * @method getFinal
     *
     * @return Transform {Transform}
     */
    TransitionableTransform.prototype.getFinal = function getFinal() {
        return this._final;
    };

    /**
     * Determine if the TransitionableTransform is currently transitioning
     *
     * @method isActive
     *
     * @return {Boolean}
     */
    TransitionableTransform.prototype.isActive = function isActive() {
        return this.translateX.isActive()
            || this.translateY.isActive()
            || this.translateZ.isActive()
            || this.rotateX.isActive()
            || this.rotateY.isActive()
            || this.rotateZ.isActive()
            || this.skewX.isActive()
            || this.skewY.isActive()
            || this.skewZ.isActive()
            || this.scaleX.isActive()
            || this.scaleY.isActive()
            || this.scaleZ.isActive();
    };

    /**
     * Halts the transition
     *
     * @method halt
     */
    TransitionableTransform.prototype.halt = function halt() {
        this._final = this.get();
        this.translateX.halt();
        this.translateY.halt();
        this.translateZ.halt();
        this.rotateX.halt();
        this.rotateY.halt();
        this.rotateZ.halt();
        this.skewX.halt();
        this.skewY.halt();
        this.skewZ.halt();
        this.scaleX.halt();
        this.scaleY.halt();
        this.scaleZ.halt();
    };

    module.exports = TransitionableTransform;
});
