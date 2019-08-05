/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var ContainerSurface = require('./ContainerSurface');
function FormContainerSurface(options) {
    if (options)
        this._method = options.method || '';
    ContainerSurface.apply(this, arguments);
}
FormContainerSurface.prototype = Object.create(ContainerSurface.prototype);
FormContainerSurface.prototype.constructor = FormContainerSurface;
FormContainerSurface.prototype.elementType = 'form';
FormContainerSurface.prototype.deploy = function deploy(target) {
    if (this._method)
        target.method = this._method;
    return ContainerSurface.prototype.deploy.apply(this, arguments);
};
module.exports = FormContainerSurface;