'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.contextWithPerspective = contextWithPerspective;
exports.simpleExtend = simpleExtend;

var _Engine = require('famous/src/core/Engine');

var _Engine2 = _interopRequireDefault(_Engine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates a [famous/src/core/Context](#famous/src/core/Context) having the specified 3D perspective.
 *
 * @param {Number} perspective The integer amount of perspective to apply to the `Context`.
 * @returns {module: famous/src/core/Context} The `Context` with the applied perspective.
 */
function contextWithPerspective(perspective) {
    var context = _Engine2.default.createContext();
    context.setPerspective(perspective);
    return context;
} /*
   * @overview Utility functions used by infamous.
   *
   * LICENSE
   *
   * This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/.
   *
   */

function simpleExtend(object) {
    for (var _len = arguments.length, others = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        others[_key - 1] = arguments[_key];
    }

    others.forEach(function (other) {
        for (var prop in other) {
            object[prop] = other[prop];
        }
    });
}
//# sourceMappingURL=utils.js.map