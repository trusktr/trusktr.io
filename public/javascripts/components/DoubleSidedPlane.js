/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import Transform from 'famous/core/Transform';
import Molecule from 'javascripts/components/Molecule';
import Plane from 'javascripts/components/Plane';

export class DoubleSidedPlane extends Molecule { // a basic building block.
    constructor(options) {
        super(options);

        this.children = [];
        this.plane1 = new Plane(this.options);
        this.plane1.componentTransform.set(Transform.rotate(0,0,0));
        this.options.properties = {background: 'orange'};
        this.plane2 = new Plane(this.options);
        this.plane2.componentTransform.set(Transform.rotate(0,Math.PI,0));

        this.children.push(this.plane1);
        this.children.push(this.plane2);
        this.componentNode.add(this.plane2.getNode())
        this.componentNode.add(this.plane1.getNode());
        this.plane1.componentHandler.pipe(this.componentHandler);
        this.plane2.componentHandler.pipe(this.componentHandler);

    }

    getContent() {
        return [this.plane1.getContent(), this.plane2.getContent()];
    }
    setContent(content) {
        this.plane1.setContent(content[0]);
        this.plane2.setContent(content[1]);
    }
}
export default DoubleSidedPlane;
