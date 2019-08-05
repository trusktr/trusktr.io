/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var RAND = Math.random;
function _randomFloat(min, max) {
    return min + RAND() * (max - min);
}
function _randomInteger(min, max) {
    return min + (RAND() * (max - min + 1) >> 0);
}
function _range(randomFunction, min, max, dim) {
    min = min !== undefined ? min : 0;
    max = max !== undefined ? max : 1;
    if (dim !== undefined) {
        var result = [];
        for (var i = 0; i < dim; i++)
            result.push(randomFunction(min, max));
        return result;
    } else
        return randomFunction(min, max);
}
var Random = {};
Random.integer = function integer(min, max, dim) {
    return _range(_randomInteger, min, max, dim);
};
Random.range = function range(min, max, dim) {
    return _range(_randomFloat, min, max, dim);
};
Random.sign = function sign(prob) {
    return Random.bool(prob) ? 1 : -1;
};
Random.bool = function bool(prob) {
    prob = prob !== undefined ? prob : 0.5;
    return RAND() < prob;
};
module.exports = Random;