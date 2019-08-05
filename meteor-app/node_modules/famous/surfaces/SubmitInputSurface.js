/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var InputSurface = require('./InputSurface');
function SubmitInputSurface(options) {
    InputSurface.apply(this, arguments);
    this._type = 'submit';
    if (options && options.onClick)
        this.setOnClick(options.onClick);
}
SubmitInputSurface.prototype = Object.create(InputSurface.prototype);
SubmitInputSurface.prototype.constructor = SubmitInputSurface;
SubmitInputSurface.prototype.setOnClick = function (onClick) {
    this.onClick = onClick;
};
SubmitInputSurface.prototype.deploy = function deploy(target) {
    if (this.onclick)
        target.onClick = this.onClick;
    InputSurface.prototype.deploy.apply(this, arguments);
};
module.exports = SubmitInputSurface;