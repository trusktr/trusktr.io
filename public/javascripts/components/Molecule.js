/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import Modifier from 'famous/core/Modifier';
import RenderNode from 'famous/core/RenderNode';
import TransitionableTransform from 'famous/transitions/TransitionableTransform';
import EventHandler from 'famous/core/EventHandler';

import "javascripts/utils/Object.className";

export class Molecule extends RenderNode {
    constructor(initialOptions) {
        initialOptions = typeof initialOptions != "undefined"? initialOptions: {};

        this._ = { // "private" stuff. Not really, but regard it like so. E.g. obj._.someVariable means you're accessing internal stuff.
            options: initialOptions.className == "Object"? initialOptions: {} // make sure we have an object literal.
        };

        this.modifier = new Modifier(this._.options);
        this.transform = new TransitionableTransform();
        this.handler = new EventHandler();

        // defaults if not specified
        this.modifier.alignFrom(this._.options.align? this._.options.align: [0.5,0.5]);
        this.modifier.originFrom(this._.options.origin? this._.options.origin: [0.5,0.5]);
        this.modifier.transformFrom(this._.options.transform? this._.options.transform: this.transform);

        this.set(this.modifier);
    }

    // EventHandler interface
    pipe() {
        var args = Array.prototype.splice.call(arguments, 0);
        return this.handler.pipe.apply(this.handler, args);
    }
    unpipe() {
        var args = Array.prototype.splice.call(arguments, 0);
        return this.handler.unpipe.apply(this.handler, args);
    }
    on() {
        var args = Array.prototype.splice.call(arguments, 0);
        return this.handler.on.apply(this.handler, args);
    }
    off() {
        var args = Array.prototype.splice.call(arguments, 0);
        return this.handler.on.apply(this.handler, args);
    }
}
export default Molecule;
