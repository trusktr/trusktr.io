/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Easing = {
    inQuad: function (t) {
        return t * t;
    },
    outQuad: function (t) {
        return -(t -= 1) * t + 1;
    },
    inOutQuad: function (t) {
        if ((t /= 0.5) < 1)
            return 0.5 * t * t;
        return -0.5 * (--t * (t - 2) - 1);
    },
    inCubic: function (t) {
        return t * t * t;
    },
    outCubic: function (t) {
        return --t * t * t + 1;
    },
    inOutCubic: function (t) {
        if ((t /= 0.5) < 1)
            return 0.5 * t * t * t;
        return 0.5 * ((t -= 2) * t * t + 2);
    },
    inQuart: function (t) {
        return t * t * t * t;
    },
    outQuart: function (t) {
        return -(--t * t * t * t - 1);
    },
    inOutQuart: function (t) {
        if ((t /= 0.5) < 1)
            return 0.5 * t * t * t * t;
        return -0.5 * ((t -= 2) * t * t * t - 2);
    },
    inQuint: function (t) {
        return t * t * t * t * t;
    },
    outQuint: function (t) {
        return --t * t * t * t * t + 1;
    },
    inOutQuint: function (t) {
        if ((t /= 0.5) < 1)
            return 0.5 * t * t * t * t * t;
        return 0.5 * ((t -= 2) * t * t * t * t + 2);
    },
    inSine: function (t) {
        return -1 * Math.cos(t * (Math.PI / 2)) + 1;
    },
    outSine: function (t) {
        return Math.sin(t * (Math.PI / 2));
    },
    inOutSine: function (t) {
        return -0.5 * (Math.cos(Math.PI * t) - 1);
    },
    inExpo: function (t) {
        return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
    },
    outExpo: function (t) {
        return t === 1 ? 1 : -Math.pow(2, -10 * t) + 1;
    },
    inOutExpo: function (t) {
        if (t === 0)
            return 0;
        if (t === 1)
            return 1;
        if ((t /= 0.5) < 1)
            return 0.5 * Math.pow(2, 10 * (t - 1));
        return 0.5 * (-Math.pow(2, -10 * --t) + 2);
    },
    inCirc: function (t) {
        return -(Math.sqrt(1 - t * t) - 1);
    },
    outCirc: function (t) {
        return Math.sqrt(1 - --t * t);
    },
    inOutCirc: function (t) {
        if ((t /= 0.5) < 1)
            return -0.5 * (Math.sqrt(1 - t * t) - 1);
        return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    },
    inElastic: function (t) {
        var s = 1.70158;
        var p = 0;
        var a = 1;
        if (t === 0)
            return 0;
        if (t === 1)
            return 1;
        if (!p)
            p = 0.3;
        s = p / (2 * Math.PI) * Math.asin(1 / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
    },
    outElastic: function (t) {
        var s = 1.70158;
        var p = 0;
        var a = 1;
        if (t === 0)
            return 0;
        if (t === 1)
            return 1;
        if (!p)
            p = 0.3;
        s = p / (2 * Math.PI) * Math.asin(1 / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
    },
    inOutElastic: function (t) {
        var s = 1.70158;
        var p = 0;
        var a = 1;
        if (t === 0)
            return 0;
        if ((t /= 0.5) === 2)
            return 1;
        if (!p)
            p = 0.3 * 1.5;
        s = p / (2 * Math.PI) * Math.asin(1 / a);
        if (t < 1)
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1;
    },
    inBack: function (t, s) {
        if (s === undefined)
            s = 1.70158;
        return t * t * ((s + 1) * t - s);
    },
    outBack: function (t, s) {
        if (s === undefined)
            s = 1.70158;
        return --t * t * ((s + 1) * t + s) + 1;
    },
    inOutBack: function (t, s) {
        if (s === undefined)
            s = 1.70158;
        if ((t /= 0.5) < 1)
            return 0.5 * (t * t * (((s *= 1.525) + 1) * t - s));
        return 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
    },
    inBounce: function (t) {
        return 1 - Easing.outBounce(1 - t);
    },
    outBounce: function (t) {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    },
    inOutBounce: function (t) {
        if (t < 0.5)
            return Easing.inBounce(t * 2) * 0.5;
        return Easing.outBounce(t * 2 - 1) * 0.5 + 0.5;
    }
};
module.exports = Easing;