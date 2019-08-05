/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var FamousEngine = require('../core/Engine');
var _event = 'prerender';
var getTime = window.performance && window.performance.now ? function () {
    return window.performance.now();
} : function () {
    return Date.now();
};
function addTimerFunction(fn) {
    FamousEngine.on(_event, fn);
    return fn;
}
function setTimeout(fn, duration) {
    var t = getTime();
    var callback = function () {
        var t2 = getTime();
        if (t2 - t >= duration) {
            fn.apply(this, arguments);
            FamousEngine.removeListener(_event, callback);
        }
    };
    return addTimerFunction(callback);
}
function setInterval(fn, duration) {
    var t = getTime();
    var callback = function () {
        var t2 = getTime();
        if (t2 - t >= duration) {
            fn.apply(this, arguments);
            t = getTime();
        }
    };
    return addTimerFunction(callback);
}
function after(fn, numTicks) {
    if (numTicks === undefined)
        return undefined;
    var callback = function () {
        numTicks--;
        if (numTicks <= 0) {
            fn.apply(this, arguments);
            clear(callback);
        }
    };
    return addTimerFunction(callback);
}
function every(fn, numTicks) {
    numTicks = numTicks || 1;
    var initial = numTicks;
    var callback = function () {
        numTicks--;
        if (numTicks <= 0) {
            fn.apply(this, arguments);
            numTicks = initial;
        }
    };
    return addTimerFunction(callback);
}
function clear(fn) {
    FamousEngine.removeListener(_event, fn);
}
function debounce(func, wait) {
    var timeout;
    var ctx;
    var timestamp;
    var result;
    var args;
    return function () {
        ctx = this;
        args = arguments;
        timestamp = getTime();
        var fn = function () {
            var last = getTime - timestamp;
            if (last < wait) {
                timeout = setTimeout(fn, wait - last);
            } else {
                timeout = null;
                result = func.apply(ctx, args);
            }
        };
        clear(timeout);
        timeout = setTimeout(fn, wait);
        return result;
    };
}
module.exports = {
    setTimeout: setTimeout,
    setInterval: setInterval,
    debounce: debounce,
    after: after,
    every: every,
    clear: clear
};