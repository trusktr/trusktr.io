/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Surface = require('../core/Surface');
function TextareaSurface(options) {
    this._placeholder = options.placeholder || '';
    this._value = options.value || '';
    this._name = options.name || '';
    this._wrap = options.wrap || '';
    this._cols = options.cols || '';
    this._rows = options.rows || '';
    Surface.apply(this, arguments);
    this.on('click', this.focus.bind(this));
}
TextareaSurface.prototype = Object.create(Surface.prototype);
TextareaSurface.prototype.constructor = TextareaSurface;
TextareaSurface.prototype.elementType = 'textarea';
TextareaSurface.prototype.elementClass = 'famous-surface';
TextareaSurface.prototype.setPlaceholder = function setPlaceholder(str) {
    this._placeholder = str;
    this._contentDirty = true;
    return this;
};
TextareaSurface.prototype.focus = function focus() {
    if (this._currentTarget)
        this._currentTarget.focus();
    return this;
};
TextareaSurface.prototype.blur = function blur() {
    if (this._currentTarget)
        this._currentTarget.blur();
    return this;
};
TextareaSurface.prototype.setValue = function setValue(str) {
    this._value = str;
    this._contentDirty = true;
    return this;
};
TextareaSurface.prototype.getValue = function getValue() {
    if (this._currentTarget) {
        return this._currentTarget.value;
    } else {
        return this._value;
    }
};
TextareaSurface.prototype.setName = function setName(str) {
    this._name = str;
    this._contentDirty = true;
    return this;
};
TextareaSurface.prototype.getName = function getName() {
    return this._name;
};
TextareaSurface.prototype.setWrap = function setWrap(str) {
    this._wrap = str;
    this._contentDirty = true;
    return this;
};
TextareaSurface.prototype.setColumns = function setColumns(num) {
    this._cols = num;
    this._contentDirty = true;
    return this;
};
TextareaSurface.prototype.setRows = function setRows(num) {
    this._rows = num;
    this._contentDirty = true;
    return this;
};
TextareaSurface.prototype.deploy = function deploy(target) {
    if (this._placeholder !== '')
        target.placeholder = this._placeholder;
    if (this._value !== '')
        target.value = this._value;
    if (this._name !== '')
        target.name = this._name;
    if (this._wrap !== '')
        target.wrap = this._wrap;
    if (this._cols !== '')
        target.cols = this._cols;
    if (this._rows !== '')
        target.rows = this._rows;
};
module.exports = TextareaSurface;