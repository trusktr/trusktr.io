/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
console.log('Plane.js');

import Surface from 'famous/core/Surface';
import Molecule from 'javascripts/components/Molecule';

export class Plane extends Molecule {
    constructor(initialOptions) {
        console.log('Plane constructor');
        super(initialOptions);

        this.surface = new Surface(this._.options);
        this.add(this.surface);
        this.surface.pipe(this.handler);
    }

    // Surface interface
    getContent() {
        console.log('Plane getContent');
        var args = Array.prototype.splice.call(arguments, 0);
        return this.surface.getContent.apply(this.surface, args);
    }
    setContent() {
        console.log('Plane setContent');
        var args = Array.prototype.splice.call(arguments, 0);
        return this.surface.setContent.apply(this.surface, args);
    }
}
export default Plane;
