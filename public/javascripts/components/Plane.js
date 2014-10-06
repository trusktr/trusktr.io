/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import Surface from 'famous/core/Surface';
import Molecule from 'javascripts/components/Molecule';

export class Plane extends Molecule { // this fails.
    constructor(options) {
        super(options);

        this.componentSurface = new Surface(this.options);
        this.componentNode.add(this.componentSurface);
        this.componentSurface.pipe(this.componentHandler);
    }

    getContent() {
        return this.componentSurface.getContent();
    }
    setContent(content) {
        this.componentSurface.setContent(content);
    }
}
export default Plane;
