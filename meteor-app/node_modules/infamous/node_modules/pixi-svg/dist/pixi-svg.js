/*!
 * pixi-svg - v1.0.1
 * Compiled Sat, 29 Apr 2017 00:23:52 UTC
 *
 * pixi-svg is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pixiSvg = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * d-path-parser - v1.0.0
 * by Massimo Artizzu (MaxArt2501)
 *
 * https://github.com/MaxArt2501/d-path-parser
 *
 * Licensed under the MIT License
 * See LICENSE for details
 */

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === "object") {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.dPathParse = factory();
    }
})(this, function() {
"use strict";

return function parse(d) {
    var re = {
        command: /\s*([achlmqstvz])/gi,
        number: /\s*([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/gi,
        comma: /\s*(?:(,)|\s)/g,
        flag: /\s*([01])/g
    };
    var matchers = {
        "number": function(must) {
            return +get("number", must);
        },
        "coordinate pair": function(must) {
            var x = get("number", must);
            if (x === null && !must) return null;
            get("comma");
            var y = get("number", true);
            return { x: +x, y: +y };
        },
        "arc definition": function(must) {
            var radii = matchers["coordinate pair"](must);
            if (!radii && !must) return null;
            get("comma");
            var rotation = +get("number", true);
            get("comma", true);
            var large = !!+get("flag", true);
            get("comma");
            var clockwise = !!+get("flag", true);
            get("comma");
            var end = matchers["coordinate pair"](true);
            return {
                radii: radii,
                rotation: rotation,
                large: large,
                clockwise: clockwise,
                end: end
            };
        }
    }
    var index = 0;
    var commands = [];

    while (index < d.length) {
        var cmd = get("command");
        var upcmd = cmd.toUpperCase();
        var relative = cmd !== upcmd;
        var sequence;
        switch (upcmd) {
            case "M":
                sequence = getSequence("coordinate pair").map(function(coords, i) {
                    if (i === 1) cmd = relative ? "l" : "L";
                    return makeCommand({ end: coords });
                });
                break;
            case "L":
            case "T":
                sequence = getSequence("coordinate pair").map(function(coords) {
                    return makeCommand({ end: coords });
                });
                break;
            case "C":
                sequence = getSequence("coordinate pair");
                if (sequence.length % 3)
                    throw Error("Expected coordinate pair triplet at position " + index);

                sequence = sequence.reduce(function(seq, coords, i) {
                    var rest = i % 3;
                    if (!rest) {
                        seq.push(makeCommand({ cp1: coords }));
                    } else {
                        var last = seq[seq.length - 1];
                        last[rest === 1 ? "cp2" : "end"] = coords;
                    }
                    return seq;
                }, []);

                break;
            case "Q":
            case "S":
                sequence = getSequence("coordinate pair");
                if (sequence.length & 1)
                    throw Error("Expected coordinate pair couple at position " + index);

                sequence = sequence.reduce(function(seq, coords, i) {
                    var odd = i & 1;
                    if (!odd) {
                        seq.push(makeCommand({ cp: coords }));
                    } else {
                        var last = seq[seq.length - 1];
                        last.end = coords;
                    }
                    return seq;
                }, []);

                break;
            case "H":
            case "V":
                sequence = getSequence("number").map(function(value) {
                    return makeCommand({ value: value });
                });
                break;
            case "A":
                sequence = getSequence("arc definition").map(makeCommand);
                break;
            case "Z":
                sequence = [ { code: "Z" } ];
                break;
        }
        commands.push.apply(commands, sequence);
    }

    return commands;

    function makeCommand(obj) {
        obj.code = cmd;
        obj.relative = relative;

        return obj;
    }
    function get(what, must) {
        re[what].lastIndex = index;
        var res = re[what].exec(d);
        if (!res || res.index !== index) {
            if (!must) return null;
            throw Error("Expected " + what + " at position " + index);
        }

        index = re[what].lastIndex;

        return res[1];
    }
    function getSequence(what) {
        var sequence = [];
        var matched;
        var must = true;
        while (matched = matchers[what](must)) {
            sequence.push(matched);
            must = !!get("comma");
        }

        return sequence;
    }
};
});

},{}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _dPathParser = require('d-path-parser');

var _dPathParser2 = _interopRequireDefault(_dPathParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// <div> element to measure string colors like "black"
// and convert to hex colors
var measureColor = document.createElement('div');

/**
 * Scalable Graphics drawn from SVG image document.
 * @class SVG
 * @extends PIXI.Graphics
 * @memberof PIXI
 * @param {SVGSVGElement} svg - SVG Element `<svg>`
 */

var SVG = function (_PIXI$Graphics) {
    _inherits(SVG, _PIXI$Graphics);

    /**
     * Constructor
     */
    function SVG(svg) {
        _classCallCheck(this, SVG);

        var _this = _possibleConstructorReturn(this, _PIXI$Graphics.call(this));

        _this.fill(svg);
        _this.svgChildren(svg.children);
        return _this;
    }

    /**
     * Create a PIXI Graphic from SVG element
     * @private
     * @method PIXI.SVG#svgChildren
     * @param {Array<*>} children - Collection of SVG nodes
     * @param {Boolean} [inherit=false] Whether to inherit fill settings.
     */


    SVG.prototype.svgChildren = function svgChildren(children) {
        var inherit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            this.fill(child, inherit);
            switch (child.nodeName.toLowerCase()) {
                case 'path':
                    {
                        this.svgPath(child);
                        break;
                    }
                case 'circle':
                case 'ellipse':
                    {
                        this.svgCircle(child);
                        break;
                    }
                case 'rect':
                    {
                        this.svgRect(child);
                        break;
                    }
                case 'polygon':
                    {
                        this.svgPoly(child, true);
                        break;
                    }
                case 'polyline':
                    {
                        this.svgPoly(child);
                        break;
                    }
                case 'g':
                    {
                        break;
                    }
                default:
                    {
                        console.info('[SVGUtils] <%s> elements unsupported', child.nodeName);
                        break;
                    }
            }
            this.svgChildren(child.children, true);
        }
    };

    /**
     * Convert the Hexidecimal string (e.g., "#fff") to uint
     * @private
     * @method PIXI.SVG#hexToUint
     */


    SVG.prototype.hexToUint = function hexToUint(hex) {
        if (hex[0] === '#') {
            // Remove the hash
            hex = hex.substr(1);

            // Convert shortcolors fc9 to ffcc99
            if (hex.length === 3) {
                hex = hex.replace(/([a-f0-9])/ig, '$1$1');
            }
            return parseInt(hex, 16);
        } else {
            measureColor.style.color = hex;
            var rgb = window.getComputedStyle(document.body.appendChild(measureColor)).color.match(/\d+/g).map(function (a) {
                return parseInt(a, 10);
            });
            document.body.removeChild(measureColor);
            return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
        }
    };

    /**
     * Render a <ellipse> element or <circle> element
     * @private
     * @method PIXI.SVG#internalEllipse
     * @param {SVGCircleElement} node
     */


    SVG.prototype.svgCircle = function svgCircle(node) {

        var heightProp = 'r';
        var widthProp = 'r';
        var isEllipse = node.nodeName === 'elipse';
        if (isEllipse) {
            heightProp += 'x';
            widthProp += 'y';
        }
        var width = parseFloat(node.getAttribute(widthProp));
        var height = parseFloat(node.getAttribute(heightProp));
        var cx = node.getAttribute('cx');
        var cy = node.getAttribute('cy');
        var x = 0;
        var y = 0;
        if (cx !== null) {
            x = parseFloat(cx);
        }
        if (cy !== null) {
            y = parseFloat(cy);
        }
        if (!isEllipse) {
            this.drawCircle(x, y, width);
        } else {
            this.drawEllipse(x, y, width, height);
        }
    };

    /**
     * Render a <rect> element
     * @private
     * @method PIXI.SVG#svgRect
     * @param {SVGRectElement} node
     */


    SVG.prototype.svgRect = function svgRect(node) {
        var x = parseFloat(node.getAttribute('x'));
        var y = parseFloat(node.getAttribute('y'));
        var width = parseFloat(node.getAttribute('width'));
        var height = parseFloat(node.getAttribute('height'));
        var rx = parseFloat(node.getAttribute('rx'));
        if (rx) {
            this.drawRoundedRect(x, y, width, height, rx);
        } else {
            this.drawRect(x, y, width, height);
        }
    };

    /**
     * Get the style property and parse options.
     * @private
     * @method PIXI.SVG#svgStyle
     * @param {SVGElement} node
     * @return {Object} Style attributes
     */


    SVG.prototype.svgStyle = function svgStyle(node) {
        var style = node.getAttribute('style');
        var result = {
            fill: node.getAttribute('fill'),
            opacity: node.getAttribute('opacity'),
            stroke: node.getAttribute('stroke'),
            strokeWidth: node.getAttribute('stroke-width')
        };
        if (style !== null) {
            style.split(';').forEach(function (prop) {
                var _prop$split = prop.split(':'),
                    name = _prop$split[0],
                    value = _prop$split[1];

                result[name.trim()] = value.trim();
            });
            if (result['stroke-width']) {
                result.strokeWidth = result['stroke-width'];
                delete result['stroke-width'];
            }
        }
        return result;
    };

    /**
     * Render a polyline element.
     * @private
     * @method PIXI.SVG#svgPoly
     * @param {SVGPolylineElement} node
     */


    SVG.prototype.svgPoly = function svgPoly(node, close) {

        var points = node.getAttribute('points').split(/[ ,]/g).map(function (p) {
            return parseInt(p);
        });

        this.drawPolygon(points);

        if (close) {
            this.closePath();
        }
    };

    /**
     * Set the fill and stroke style.
     * @private
     * @method PIXI.SVG#fill
     * @param {SVGElement} node
     * @param {Boolean} inherit
     */


    SVG.prototype.fill = function fill(node, inherit) {
        var _svgStyle = this.svgStyle(node),
            fill = _svgStyle.fill,
            opacity = _svgStyle.opacity,
            stroke = _svgStyle.stroke,
            strokeWidth = _svgStyle.strokeWidth;

        var defaultLineWidth = stroke !== null ? 1 : 0;
        var lineWidth = strokeWidth !== null ? parseFloat(strokeWidth) : defaultLineWidth;
        var lineColor = stroke !== null ? this.hexToUint(stroke) : this.lineColor;
        if (fill) {
            if (fill === 'none') {
                this.beginFill(0, 0);
            } else {
                this.beginFill(this.hexToUint(fill), opacity !== null ? parseFloat(opacity) : 1);
            }
        } else if (!inherit) {
            this.beginFill(0);
        }
        this.lineStyle(lineWidth, lineColor);

        if (node.getAttribute('stroke-linejoin')) {
            console.info('[SVGUtils] "stroke-linejoin" attribute is not supported');
        }
        if (node.getAttribute('stroke-linecap')) {
            console.info('[SVGUtils] "stroke-linecap" attribute is not supported');
        }
        if (node.getAttribute('fill-rule')) {
            console.info('[SVGUtils] "fill-rule" attribute is not supported');
        }
    };

    /**
     * Render a <path> d element
     * @method PIXI.SVG#svgPath
     * @param {SVGPathElement} node
     */


    SVG.prototype.svgPath = function svgPath(node) {
        var d = node.getAttribute('d');
        var x = void 0,
            y = void 0;
        var commands = (0, _dPathParser2.default)(d);
        for (var i = 0; i < commands.length; i++) {
            var command = commands[i];
            switch (command.code) {
                case 'm':
                    {
                        this.moveTo(x += command.end.x, y += command.end.y);
                        break;
                    }
                case 'M':
                    {
                        this.moveTo(x = command.end.x, y = command.end.y);
                        break;
                    }
                case 'H':
                    {
                        this.lineTo(x = command.value, y);
                        break;
                    }
                case 'h':
                    {
                        this.lineTo(x += command.value, y);
                        break;
                    }
                case 'V':
                    {
                        this.lineTo(x, y = command.value);
                        break;
                    }
                case 'v':
                    {
                        this.lineTo(x, y += command.value);
                        break;
                    }
                case 'Z':
                    {
                        this.closePath();
                        break;
                    }
                case 'L':
                    {
                        this.lineTo(x = command.end.x, y = command.end.y);
                        break;
                    }
                case 'l':
                    {
                        this.lineTo(x += command.end.x, y += command.end.y);
                        break;
                    }
                case 'C':
                    {
                        var currX = x;
                        var currY = y;
                        this.bezierCurveTo(currX + command.cp1.x, currY + command.cp1.y, currX + command.cp2.x, currY + command.cp2.y, x = command.end.x, y = command.end.y);
                        break;
                    }
                case 'c':
                    {
                        var _currX = x;
                        var _currY = y;
                        this.bezierCurveTo(_currX + command.cp1.x, _currY + command.cp1.y, _currX + command.cp2.x, _currY + command.cp2.y, x += command.end.x, y += command.end.y);
                        break;
                    }
                case 's':
                case 'q':
                    {
                        var _currX2 = x;
                        var _currY2 = y;
                        this.quadraticCurveTo(_currX2 + command.cp.x, _currY2 + command.cp.y, x += command.end.x, y += command.end.y);
                        break;
                    }
                case 'S':
                case 'Q':
                    {
                        var _currX3 = x;
                        var _currY3 = y;
                        this.quadraticCurveTo(_currX3 + command.cp.x, _currY3 + command.cp.y, x = command.end.x, y = command.end.y);
                        break;
                    }
                default:
                    {
                        console.info('[SVGUtils] Draw command not supported:', command.code, command);
                        break;
                    }
            }
        }
    };

    return SVG;
}(PIXI.Graphics);

exports.default = SVG;

},{"d-path-parser":1}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _SVG = require('./SVG');

var _SVG2 = _interopRequireDefault(_SVG);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Check that PIXI exists
if (typeof PIXI === 'undefined') {
    throw 'pixi.js not found';
}
// Don't define twice
else if (!PIXI.SVG) {
        // Assign to global pixi object
        Object.defineProperty(PIXI, 'SVG', {
            get: function get() {
                return _SVG2.default;
            }
        });
    }

exports.default = _SVG2.default;

},{"./SVG":2}]},{},[3])(3)
});


//# sourceMappingURL=pixi-svg.js.map
