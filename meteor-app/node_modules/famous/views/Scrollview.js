/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var PhysicsEngine = require('../physics/PhysicsEngine');
var Particle = require('../physics/bodies/Particle');
var Drag = require('../physics/forces/Drag');
var Spring = require('../physics/forces/Spring');
var EventHandler = require('../core/EventHandler');
var OptionsManager = require('../core/OptionsManager');
var ViewSequence = require('../core/ViewSequence');
var Scroller = require('../views/Scroller');
var Utility = require('../utilities/Utility');
var GenericSync = require('../inputs/GenericSync');
var ScrollSync = require('../inputs/ScrollSync');
var TouchSync = require('../inputs/TouchSync');
GenericSync.register({
    scroll: ScrollSync,
    touch: TouchSync
});
var TOLERANCE = 0.5;
var SpringStates = {
    NONE: 0,
    EDGE: 1,
    PAGE: 2
};
var EdgeStates = {
    TOP: -1,
    NONE: 0,
    BOTTOM: 1
};
function Scrollview(options) {
    this.options = Object.create(Scrollview.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);
    this._scroller = new Scroller(this.options);
    this.sync = new GenericSync([
        'scroll',
        'touch'
    ], {
        direction: this.options.direction,
        scale: this.options.syncScale,
        rails: this.options.rails,
        preventDefault: this.options.preventDefault !== undefined ? this.options.preventDefault : this.options.direction !== Utility.Direction.Y
    });
    this._physicsEngine = new PhysicsEngine();
    this._particle = new Particle();
    this._physicsEngine.addBody(this._particle);
    this.spring = new Spring({
        anchor: [
            0,
            0,
            0
        ],
        period: this.options.edgePeriod,
        dampingRatio: this.options.edgeDamp
    });
    this.drag = new Drag({
        forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC,
        strength: this.options.drag
    });
    this.friction = new Drag({
        forceFunction: Drag.FORCE_FUNCTIONS.LINEAR,
        strength: this.options.friction
    });
    this._node = null;
    this._touchCount = 0;
    this._springState = SpringStates.NONE;
    this._onEdge = EdgeStates.NONE;
    this._pageSpringPosition = 0;
    this._edgeSpringPosition = 0;
    this._touchVelocity = 0;
    this._earlyEnd = false;
    this._needsPaginationCheck = false;
    this._displacement = 0;
    this._totalShift = 0;
    this._cachedIndex = 0;
    this._scroller.positionFrom(this.getPosition.bind(this));
    this._eventInput = new EventHandler();
    this._eventOutput = new EventHandler();
    this._eventInput.pipe(this.sync);
    this.sync.pipe(this._eventInput);
    EventHandler.setInputHandler(this, this._eventInput);
    EventHandler.setOutputHandler(this, this._eventOutput);
    _bindEvents.call(this);
    if (options)
        this.setOptions(options);
}
Scrollview.DEFAULT_OPTIONS = {
    direction: Utility.Direction.Y,
    rails: true,
    friction: 0.005,
    drag: 0.0001,
    edgeGrip: 0.2,
    edgePeriod: 300,
    edgeDamp: 1,
    margin: 1000,
    paginated: false,
    pagePeriod: 500,
    pageDamp: 0.8,
    pageStopSpeed: 10,
    pageSwitchSpeed: 0.5,
    speedLimit: 5,
    groupScroll: false,
    syncScale: 1
};
function _handleStart(event) {
    this._touchCount = event.count;
    if (event.count === undefined)
        this._touchCount = 1;
    _detachAgents.call(this);
    this.setVelocity(0);
    this._touchVelocity = 0;
    this._earlyEnd = false;
}
function _handleMove(event) {
    var velocity = -event.velocity;
    var delta = -event.delta;
    if (this._onEdge !== EdgeStates.NONE && event.slip) {
        if (velocity < 0 && this._onEdge === EdgeStates.TOP || velocity > 0 && this._onEdge === EdgeStates.BOTTOM) {
            if (!this._earlyEnd) {
                _handleEnd.call(this, event);
                this._earlyEnd = true;
            }
        } else if (this._earlyEnd && Math.abs(velocity) > Math.abs(this.getVelocity())) {
            _handleStart.call(this, event);
        }
    }
    if (this._earlyEnd)
        return;
    this._touchVelocity = velocity;
    if (event.slip) {
        var speedLimit = this.options.speedLimit;
        if (velocity < -speedLimit)
            velocity = -speedLimit;
        else if (velocity > speedLimit)
            velocity = speedLimit;
        this.setVelocity(velocity);
        var deltaLimit = speedLimit * 16;
        if (delta > deltaLimit)
            delta = deltaLimit;
        else if (delta < -deltaLimit)
            delta = -deltaLimit;
    }
    this.setPosition(this.getPosition() + delta);
    this._displacement += delta;
    if (this._springState === SpringStates.NONE)
        _normalizeState.call(this);
}
function _handleEnd(event) {
    this._touchCount = event.count || 0;
    if (!this._touchCount) {
        _detachAgents.call(this);
        if (this._onEdge !== EdgeStates.NONE)
            _setSpring.call(this, this._edgeSpringPosition, SpringStates.EDGE);
        _attachAgents.call(this);
        var velocity = -event.velocity;
        var speedLimit = this.options.speedLimit;
        if (event.slip)
            speedLimit *= this.options.edgeGrip;
        if (velocity < -speedLimit)
            velocity = -speedLimit;
        else if (velocity > speedLimit)
            velocity = speedLimit;
        this.setVelocity(velocity);
        this._touchVelocity = 0;
        this._needsPaginationCheck = true;
    }
}
function _bindEvents() {
    this._eventInput.bindThis(this);
    this._eventInput.on('start', _handleStart);
    this._eventInput.on('update', _handleMove);
    this._eventInput.on('end', _handleEnd);
    this._eventInput.on('resize', function () {
        this._node._.calculateSize();
    }.bind(this));
    this._scroller.on('onEdge', function (data) {
        this._edgeSpringPosition = data.position;
        _handleEdge.call(this, this._scroller.onEdge());
        this._eventOutput.emit('onEdge');
    }.bind(this));
    this._scroller.on('offEdge', function () {
        this.sync.setOptions({ scale: this.options.syncScale });
        this._onEdge = this._scroller.onEdge();
        this._eventOutput.emit('offEdge');
    }.bind(this));
    this._particle.on('update', function (particle) {
        if (this._springState === SpringStates.NONE)
            _normalizeState.call(this);
        this._displacement = particle.position.x - this._totalShift;
    }.bind(this));
    this._particle.on('end', function () {
        if (!this.options.paginated || this.options.paginated && this._springState !== SpringStates.NONE)
            this._eventOutput.emit('settle');
    }.bind(this));
}
function _attachAgents() {
    if (this._springState)
        this._physicsEngine.attach([this.spring], this._particle);
    else
        this._physicsEngine.attach([
            this.drag,
            this.friction
        ], this._particle);
}
function _detachAgents() {
    this._springState = SpringStates.NONE;
    this._physicsEngine.detachAll();
}
function _nodeSizeForDirection(node) {
    var direction = this.options.direction;
    var nodeSize = node.getSize();
    return !nodeSize ? this._scroller.getSize()[direction] : nodeSize[direction];
}
function _handleEdge(edge) {
    this.sync.setOptions({ scale: this.options.edgeGrip });
    this._onEdge = edge;
    if (!this._touchCount && this._springState !== SpringStates.EDGE) {
        _setSpring.call(this, this._edgeSpringPosition, SpringStates.EDGE);
    }
    if (this._springState && Math.abs(this.getVelocity()) < 0.001) {
        _detachAgents.call(this);
        _attachAgents.call(this);
    }
}
function _handlePagination() {
    if (this._touchCount)
        return;
    if (this._springState === SpringStates.EDGE)
        return;
    var velocity = this.getVelocity();
    if (Math.abs(velocity) >= this.options.pageStopSpeed)
        return;
    var position = this.getPosition();
    var velocitySwitch = Math.abs(velocity) > this.options.pageSwitchSpeed;
    var nodeSize = _nodeSizeForDirection.call(this, this._node);
    var positionNext = position > 0.5 * nodeSize;
    var positionPrev = position < 0.5 * nodeSize;
    var velocityNext = velocity > 0;
    var velocityPrev = velocity < 0;
    this._needsPaginationCheck = false;
    if (positionNext && !velocitySwitch || velocitySwitch && velocityNext) {
        this.goToNextPage();
    } else if (velocitySwitch && velocityPrev) {
        this.goToPreviousPage();
    } else
        _setSpring.call(this, 0, SpringStates.PAGE);
}
function _setSpring(position, springState) {
    var springOptions;
    if (springState === SpringStates.EDGE) {
        this._edgeSpringPosition = position;
        springOptions = {
            anchor: [
                this._edgeSpringPosition,
                0,
                0
            ],
            period: this.options.edgePeriod,
            dampingRatio: this.options.edgeDamp
        };
    } else if (springState === SpringStates.PAGE) {
        this._pageSpringPosition = position;
        springOptions = {
            anchor: [
                this._pageSpringPosition,
                0,
                0
            ],
            period: this.options.pagePeriod,
            dampingRatio: this.options.pageDamp
        };
    }
    this.spring.setOptions(springOptions);
    if (springState && !this._springState) {
        _detachAgents.call(this);
        this._springState = springState;
        _attachAgents.call(this);
    }
    this._springState = springState;
}
function _normalizeState() {
    var offset = 0;
    var position = this.getPosition();
    position += (position < 0 ? -0.5 : 0.5) >> 0;
    var nodeSize = _nodeSizeForDirection.call(this, this._node);
    var nextNode = this._node.getNext();
    while (offset + position >= nodeSize && nextNode) {
        offset -= nodeSize;
        this._scroller.sequenceFrom(nextNode);
        this._node = nextNode;
        nextNode = this._node.getNext();
        nodeSize = _nodeSizeForDirection.call(this, this._node);
    }
    var previousNode = this._node.getPrevious();
    var previousNodeSize;
    while (offset + position <= 0 && previousNode) {
        previousNodeSize = _nodeSizeForDirection.call(this, previousNode);
        this._scroller.sequenceFrom(previousNode);
        this._node = previousNode;
        offset += previousNodeSize;
        previousNode = this._node.getPrevious();
    }
    if (offset)
        _shiftOrigin.call(this, offset);
    if (this._node) {
        if (this._node.index !== this._cachedIndex) {
            if (this.getPosition() < 0.5 * nodeSize) {
                this._cachedIndex = this._node.index;
                this._eventOutput.emit('pageChange', {
                    direction: -1,
                    index: this._cachedIndex
                });
            }
        } else {
            if (this.getPosition() > 0.5 * nodeSize) {
                this._cachedIndex = this._node.index + 1;
                this._eventOutput.emit('pageChange', {
                    direction: 1,
                    index: this._cachedIndex
                });
            }
        }
    }
}
function _shiftOrigin(amount) {
    this._edgeSpringPosition += amount;
    this._pageSpringPosition += amount;
    this.setPosition(this.getPosition() + amount);
    this._totalShift += amount;
    if (this._springState === SpringStates.EDGE) {
        this.spring.setOptions({
            anchor: [
                this._edgeSpringPosition,
                0,
                0
            ]
        });
    } else if (this._springState === SpringStates.PAGE) {
        this.spring.setOptions({
            anchor: [
                this._pageSpringPosition,
                0,
                0
            ]
        });
    }
}
Scrollview.prototype.getCurrentIndex = function getCurrentIndex() {
    return this._node.index;
};
Scrollview.prototype.goToPreviousPage = function goToPreviousPage() {
    if (!this._node || this._onEdge === EdgeStates.TOP)
        return null;
    if (this.getPosition() > 1 && this._springState === SpringStates.NONE) {
        _setSpring.call(this, 0, SpringStates.PAGE);
        return this._node;
    }
    var previousNode = this._node.getPrevious();
    if (previousNode) {
        var previousNodeSize = _nodeSizeForDirection.call(this, previousNode);
        this._scroller.sequenceFrom(previousNode);
        this._node = previousNode;
        _shiftOrigin.call(this, previousNodeSize);
        _setSpring.call(this, 0, SpringStates.PAGE);
    }
    return previousNode;
};
Scrollview.prototype.goToNextPage = function goToNextPage() {
    if (!this._node || this._onEdge === EdgeStates.BOTTOM)
        return null;
    var nextNode = this._node.getNext();
    if (nextNode) {
        var currentNodeSize = _nodeSizeForDirection.call(this, this._node);
        this._scroller.sequenceFrom(nextNode);
        this._node = nextNode;
        _shiftOrigin.call(this, -currentNodeSize);
        _setSpring.call(this, 0, SpringStates.PAGE);
    }
    return nextNode;
};
Scrollview.prototype.goToPage = function goToPage(index) {
    var currentIndex = this.getCurrentIndex();
    var i;
    if (currentIndex > index) {
        for (i = 0; i < currentIndex - index; i++)
            this.goToPreviousPage();
    }
    if (currentIndex < index) {
        for (i = 0; i < index - currentIndex; i++)
            this.goToNextPage();
    }
};
Scrollview.prototype.outputFrom = function outputFrom() {
    return this._scroller.outputFrom.apply(this._scroller, arguments);
};
Scrollview.prototype.getPosition = function getPosition() {
    return this._particle.getPosition1D();
};
Scrollview.prototype.getAbsolutePosition = function getAbsolutePosition() {
    return this._scroller.getCumulativeSize(this.getCurrentIndex())[this.options.direction] + this.getPosition();
};
Scrollview.prototype.getOffset = Scrollview.prototype.getPosition;
Scrollview.prototype.setPosition = function setPosition(x) {
    this._particle.setPosition1D(x);
};
Scrollview.prototype.setOffset = Scrollview.prototype.setPosition;
Scrollview.prototype.getVelocity = function getVelocity() {
    return this._touchCount ? this._touchVelocity : this._particle.getVelocity1D();
};
Scrollview.prototype.setVelocity = function setVelocity(v) {
    this._particle.setVelocity1D(v);
};
Scrollview.prototype.setOptions = function setOptions(options) {
    if (options.direction !== undefined) {
        if (options.direction === 'x')
            options.direction = Utility.Direction.X;
        else if (options.direction === 'y')
            options.direction = Utility.Direction.Y;
    }
    if (options.groupScroll !== this.options.groupScroll) {
        if (options.groupScroll)
            this.subscribe(this._scroller);
        else
            this.unsubscribe(this._scroller);
    }
    this._optionsManager.setOptions(options);
    this._scroller.setOptions(options);
    if (options.drag !== undefined)
        this.drag.setOptions({ strength: this.options.drag });
    if (options.friction !== undefined)
        this.friction.setOptions({ strength: this.options.friction });
    if (options.edgePeriod !== undefined || options.edgeDamp !== undefined) {
        this.spring.setOptions({
            period: this.options.edgePeriod,
            dampingRatio: this.options.edgeDamp
        });
    }
    if (options.rails || options.direction !== undefined || options.syncScale !== undefined || options.preventDefault) {
        this.sync.setOptions({
            rails: this.options.rails,
            direction: this.options.direction === Utility.Direction.X ? GenericSync.DIRECTION_X : GenericSync.DIRECTION_Y,
            scale: this.options.syncScale,
            preventDefault: this.options.preventDefault
        });
    }
};
Scrollview.prototype.sequenceFrom = function sequenceFrom(node) {
    if (node instanceof Array)
        node = new ViewSequence({
            array: node,
            trackSize: true
        });
    this._node = node;
    return this._scroller.sequenceFrom(node);
};
Scrollview.prototype.getSize = function getSize() {
    return this._scroller.getSize.apply(this._scroller, arguments);
};
Scrollview.prototype.render = function render() {
    if (this.options.paginated && this._needsPaginationCheck)
        _handlePagination.call(this);
    return this._scroller.render();
};
module.exports = Scrollview;