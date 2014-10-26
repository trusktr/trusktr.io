/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
console.log('Molecule.js');

import Modifier from 'famous/core/Modifier';
import RenderNode from 'famous/core/RenderNode';
import TransitionableTransform from 'famous/transitions/TransitionableTransform';
import EventHandler from 'famous/core/EventHandler';

export class Molecule extends RenderNode {
    constructor(initialOptions) {
        console.log('Molecule console');
        this._ = { // "private" stuff. Not really, but yeah.
            options: initialOptions instanceof Object? initialOptions: {};
        };

        this.mod = new Modifier(this._.options);
        this.transform = new TransitionableTransform();
        this.handler = new EventHandler();

        this.mod.alignFrom(this._.options.align? this._.options.align: [0.5,0.5]);
        this.mod.originFrom(this._.options.origin? this._.options.origin: [0.5,0.5]);
        this.mod.transformFrom(this.transform);
        this.set(this.mod);
    }

    // EventHandler interface
    pipe() {
        console.log('Molecule pipe');
        var args = Array.prototype.splice.call(arguments, 0);
        return this.handler.pipe.apply(this.handler, args);
    }
    unpipe() {
        console.log('Molecule unpipe');
        var args = Array.prototype.splice.call(arguments, 0);
        return this.handler.unpipe.apply(this.handler, args);
    }
    on() {
        console.log('Molecule on');
        var args = Array.prototype.splice.call(arguments, 0);
        return this.handler.on.apply(this.handler, args);
    }
    off() {
        console.log('Molecule off');
        var args = Array.prototype.splice.call(arguments, 0);
        return this.handler.on.apply(this.handler, args);
    }

    //set options(options) {
        //for (var prop in options) {
            //console.log(prop);
        //}
    //}
    //get options(options) {
        //return this._.options;
    //}
}
export default Molecule;
