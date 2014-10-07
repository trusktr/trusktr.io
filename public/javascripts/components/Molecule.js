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

export class Molecule {
    constructor(options) {
        this.options = options?options:{};
        this.componentMod = new Modifier({
            size: this.options.size,
            opacity: this.options.opacity,
            align: [0.5,0.5],
            origin: [0.5,0.5],
        });
        this.componentNode = new RenderNode();
        this.componentTransform = new TransitionableTransform();
        this.componentMod.transformFrom(this.componentTransform);
        this.componentNode.set(this.componentMod);
        this.componentHandler = new EventHandler();
    }

    getNode() {
        return this.componentNode;
    }
    pipe(destination) {
        this.componentHandler.pipe(destination);
    }
    unpipe(destination) {
        this.componentHandler.unpipe(destination);
    }
}
export default Molecule;
