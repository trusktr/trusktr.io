/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import {forLength} from './utils';

var Engine = famous.core.Engine;
var Modifier = famous.core.Modifier;
var Surface = famous.core.Surface;
var Transform = famous.core.Transform;
var Easing = famous.transitions.Easing;
var RenderNode = famous.core.RenderNode;
var EventHandler = famous.core.EventHandler;
var Transitionable = famous.transitions.Transitionable;
var TransitionableTransform = famous.transitions.TransitionableTransform;
var MouseSync = famous.inputs.MouseSync;
var TouchSync = famous.inputs.TouchSync;
var GenericSync = famous.inputs.GenericSync;
    GenericSync.register({
        mouse: MouseSync,
        touch: TouchSync
    });

export class Proton {
    constructor(options) {

        this.options = options?options:{};
        this.componentMod = new Modifier({
            size: this.options.size,
            transform: this.options.transform,
            align: [0.5,0.5],
            origin: [0.5,0.5],
        });
        this.componentNode = new RenderNode();
        this.componentTransform = new TransitionableTransform();
        this.componentMod.setTransform(this.componentTransform);
        this.componentNode.set(this.componentMod);
        this.componentHandler = new EventHandler();
    }

    getNode() {
        return this.componentNode;
    }
    pipe(destination) {
        this.componentHandler.pipe(destination);
    }
    unpipe(destination) {
        this.componentHandler.unpipe(destination);
    }
}

export class Plane extends Proton { // a basic building block.
    constructor(options) {
        super(options)

        this.componentSurface = new Surface(this.options);
        this.componentNode.add(this.componentSurface);
        this.componentSurface.pipe(this.componentHandler);
    }

    getContent() {
        return this.componentSurface.getContent();
    }
    setContent(content) {
        this.componentSurface.setContent(content);
    }
}

export class DoubleSidedPlane extends Proton { // a basic building block.
    constructor(options) {
        super(options);

        this.children = [];
        this.plane1 = new Plane(this.options);
        this.plane1.componentTransform.set(Transform.rotate(0,0,0));
        this.options.properties = {background: 'orange'};
        this.plane2 = new Plane(this.options);
        this.plane2.componentTransform.set(Transform.rotate(0,Math.PI,0));

        this.children.push(this.plane1);
        this.children.push(this.plane2);
        this.componentNode.add(this.plane2.getNode())
        this.componentNode.add(this.plane1.getNode());
        this.plane1.componentHandler.pipe(this.componentHandler);
        this.plane2.componentHandler.pipe(this.componentHandler);

    }

    getContent() {
        return [this.plane1.getContent(), this.plane2.getContent()];
    }
    setContent(content) {
        this.plane1.setContent(content[0]);
        this.plane2.setContent(content[1]);
    }
}

export class Grid extends Proton { // a scenegraph tree that lays things out in a grid. The leaf nodes are Modifiers (the cells of the grid). Put stuff in them.
    constructor(columns, rows, size) {
        super({size: size});

        this.columns = columns;
        this.rows = rows;

        if (typeof this.options.size === 'undefined') { this.options.size = [undefined, undefined]; }
        this.cellNodes = [];

        forLength(this.columns*this.rows, this.createGridCell.bind(this));
    }

    createGridCell(index) {
        var column = index % this.columns;
        var row = Math.floor(index / this.columns);

        var cellSize = null;
        if (typeof this.options.size[0] != 'undefined' && typeof this.options.size[1] != 'undefined') {
            cellSize = [];
            cellSize[0] = this.options.size[0]/this.columns;
            cellSize[1] = this.options.size[1]/this.rows;
        }

        var mod = new Modifier({
            align: [0,0],
            origin: [0,0],
            size: cellSize? [cellSize[0], cellSize[1]]: [undefined, undefined],
            transform: Transform.translate(column*cellSize[0],row*cellSize[1],0)
        });
        var mod2 = new Modifier({
            //transform: Transform.rotateY(Math.PI/10),
            align: [0.5,0.5],
            origin: [0.5,0.5]
        });
        // FIXME: ^^^ Why do I need an extra Modifier to align stuff in the middle of the grid cells?????
        this.cellNodes.push(this.componentNode.add(mod).add(mod2));
    }

    setChildren(children) {
        forLength(this.columns*this.rows, function(index) {
            //this.cellNodes[index].set(null); // TODO: how do we erase previous children?
            this.cellNodes[index].add(children[index].getNode());
        }.bind(this));
        return this;
    }
}

export class Calendar extends Proton {
    constructor(calendarSize, transition) {
        super({size: calendarSize});

        this.transition = transition;
        this.flipSide = 0; // 0 means the initial front faces are showing, 1 means the initial back faces are showing.
        this.columnsRows = [7,6];
        this.planes = [];

        console.log(this.columnsRows);
        this.initializeTransitions();
        this.createGrid();

        setTimeout( function() {
            this.transitions[this.transition]();
            setInterval(this.transitions[this.transition], 2000);
        }.bind(this) , 800);
    }

    createGrid() {
        console.log(this.columnsRows);
        var grid = new Grid(this.columnsRows[0], this.columnsRows[1], this.options.size);
        console.log(grid);

        forLength(this.columnsRows[0]*this.columnsRows[1], function(i) {
            var plane = new DoubleSidedPlane({
                properties: {
                    background: 'teal',
                    outline: '1px solid teal',
                    //backfaceVisibility: 'visible',
                }
            });
            this.planes.push(plane);
        }.bind(this));

        grid.setChildren(this.planes);
        this.componentNode.add(grid.getNode());
    }

    initializeTransitions() {
        this.transitions = {
            flipDiagonal: function() {
                this.flipSide = +!this.flipSide;
                // determine which dimension of the grid is shorter and which is longer.
                var shortest = 0;
                var longest;
                this.columnsRows.forEach(function(item, index) {
                    if (item < this.columnsRows[shortest])
                        shortest = index;
                }.bind(this));
                longest = +!shortest;

                // for each diagonal of the grid, flip those cells.
                forLength(this.columnsRows[0]+this.columnsRows[1]-1, function(column) {
                    forLength(this.columnsRows[shortest], function(row) {
                        if (column-row >= 0 && column-row < this.columnsRows[longest]) {
                            var plane = this.planes[column-row + this.columnsRows[longest]*row];
                            flipOne(plane, column);
                        }
                    }.bind(this));
                }.bind(this));

                function flipOne(item, column) {
                    if (typeof item.__targetRotation == 'undefined') {
                        item.__targetRotation = new Transitionable(0);
                    }
                    var rotation = new Transitionable(item.__targetRotation.get());
                    item.__targetRotation.set(item.__targetRotation.get()+Math.PI);

                    //item.getNode().get().transformFrom(function() {
                    //return Transform.rotateY(rotation.get());
                    //});
                    item.children[0].getNode().get().transformFrom(function() {
                        return Transform.rotateY(rotation.get());
                    });
                    item.children[1].getNode().get().transformFrom(function() {
                        return Transform.rotateY(rotation.get()+Math.PI);
                    });

                    setTimeout(function() {
                        rotation.set(item.__targetRotation.get(), { duration: 2000, curve: Easing.outExpo });
                    }, 0+50*column);
                }
            }.bind(this)
        };
    }
}

export function contextWithPerspective(perspective) {
    var context = Engine.createContext();
    context.setPerspective(perspective);
    return context;
}
