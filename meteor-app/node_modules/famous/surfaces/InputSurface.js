/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Surface = require('../core/Surface');
function InputSurface(options) {
    this._placeholder = options.placeholder || '';
    this._value = options.value || '';
    this._type = options.type || 'text';
    this._name = options.name || '';
    Surface.apply(this, arguments);
    this.on('click', this.focus.bind(this));
    window.addEventListener('click', function (event) {
        if (event.target !== this._currentTarget)
            this.blur();
    }.bind(this));
}
InputSurface.prototype = Object.create(Surface.prototype);
InputSurface.prototype.constructor = InputSurface;
InputSurface.prototype.elementType = 'input';
InputSurface.prototype.elementClass = 'famous-surface';
InputSurface.prototype.setPlaceholder = function setPlaceholder(str) {
    this._placeholder = str;
    this._contentDirty = true;
    return this;
};
InputSurface.prototype.focus = function focus() {
    if (this._currentTarget)
        this._currentTarget.focus();
    return this;
};
InputSurface.prototype.blur = function blur() {
    if (this._currentTarget)
        this._currentTarget.blur();
    return this;
};
InputSurface.prototype.setValue = function setValue(str) {
    this._value = str;
    this._contentDirty = true;
    return this;
};
InputSurface.prototype.setType = function setType(str) {
    this._type = str;
    this._contentDirty = true;
    return this;
};
InputSurface.prototype.getValue = function getValue() {
    if (this._currentTarget) {
        return this._currentTarget.value;
    } else {
        return this._value;
    }
};
InputSurface.prototype.setName = function setName(str) {
    this._name = str;
    this._contentDirty = true;
    return this;
};
InputSurface.prototype.getName = function getName() {
    return this._name;
};
InputSurface.prototype.deploy = function deploy(target) {
    if (this._placeholder !== '')
        target.placeholder = this._placeholder;
    target.value = this._value;
    target.type = this._type;
    target.name = this._name;
};
module.exports = InputSurface;