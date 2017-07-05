import startup from 'awaitbox/meteor/startup'
import sleep from 'awaitbox/timers/sleep'

import React from 'react'
import ReactDOM from 'react-dom'

import TWEEN from 'tween.js'

import 'infamous/html'
import Motor from 'infamous/core/Motor'
import Node from 'infamous/core/Node'

export default
async function lettersToGrid() {

    class GridLayout2D extends React.Component {

        render() {
            const {gridSize, cellSize} = this.props
            const gridCells = []

            let index = 0

            for (let row = 0, height = gridSize.height; row < height; row += 1) {

                for (let column = 0, width = gridSize.width; column < width; column += 1) {

                    gridCells.push(
                        <motor-node
                            key={index} ref={''+index}
                            absoluteSize={[cellSize.width, cellSize.height, 0]}
                            position={[
                                cellSize.width * (column % gridSize.width),
                                cellSize.height * (row % gridSize.height),
                                0
                            ]}

                            // enable the style to visualize text grid.
                            //style={{outline: '1px solid red'}}
                            >

                        </motor-node>
                    )

                    index += 1
                }
            }

            return (
                <motor-node ref="cellContainer"

                    // passed via props
                    align={this.props.align}
                    mountPoint={this.props.mountPoint}
                    //origin={this.props.origin}
                    //position={this.props.position}
                    //rotation={this.props.rotation}
                    //scale={this.props.scale}
                    //skew={this.props.skew}
                    //opacity={this.props.opacity}

                    // not passed via props
                    absoluteSize={[gridSize.width * cellSize.width, gridSize.height * cellSize.height, 0]}
                    >
                    {gridCells}
                </motor-node>
            )
        }

        constructor() {
            super()
            this.resolveReadyPromise = null
            this.ready = new Promise(r => this.resolveReadyPromise = r)
        }

        componentDidMount() {
            let readyCount = 0
            let numberOfCells = this.props.gridSize.width * this.props.gridSize.height

            for (let i = 0; i< numberOfCells; i++) {
                ~async function() {
                    await this.refs[`${i}`].mountPromise
                    readyCount++

                    // If we've awaited all cells to be ready, let's signal that the
                    // grid is ready. This might be the type of thing to abstract
                    // into a React component (f.e. MotorNode).
                    if (readyCount == numberOfCells) {

                        // also wait for the cellContainer to be ready.
                        await this.refs.cellContainer.mountPromise

                        this.resolveReadyPromise()
                    }
                }.call(this)
            }
        }
    }

    class LettersToGrid extends React.Component {

        constructor() {
            super()
            this.letterWidth = 14
            this.letterHeight = 20
        }

        render() {
            const props = this.props
            return (
                <motor-scene ref='scene'>
                    <motor-node ref={el => this.rotator = el}
                        position='-0, 0, -0'
                        absoluteSize='200,200,0'
                        align='0.5,0.5,0'
                        mountPoint='0.5,0.5,0'
                        rotation='0,30,0'
                    >

                        <GridLayout2D ref={el => this.grid = el}
                            gridSize={{width: 15, height: 8 }}
                            cellSize={{width: this.letterWidth+2, height: this.letterHeight+2}}
                            align='0.5, 0.5, 0.5'
                            mountPoint='0.5, 0.5, 0.5'
                            >

                        </GridLayout2D>

                    </motor-node>
                </motor-scene>
            )
        }

        async componentDidMount() {

            const letters = this.props.msg.split('')

            // why exactly do we need to wait for ready here? Once we have the
            // `ref`, why is the element not ready? It's not obvious that we need to
            // do this, andifwe don't we get unexpected results below (the positions
            // of the cell nodes are all reported as zero.)
            await this.grid.ready

            // for each letter make an Infamous Node.
            // TODO: make these in the markup.
            const letterNodes = letters.map(letter => {

                const node = new Node({
                    position: {
                        x: Math.random() * 300 - 150,
                        y: Math.random() * 300 - 150,
                        z: Math.random() * 300 - 150
                    },

                    rotation: {
                        x: Math.random() * 360,
                        y: Math.random() * 360,
                        z: Math.random() * 360
                    },

                    absoluteSize: {
                        x: this.letterWidth,
                        y: this.letterHeight,
                    },
                })

                // render the letter into the motor-node
                node.element.innerHTML = letter
                node.element.style['font-size'] = `${this.letterHeight}px`
                node.element.style['text-align'] = 'center'
                node.element.style['vertical-align'] = 'middle'

                // append children to node common to
                //this.rotator.appendChild(node._el.element)
                // we could also do:
                this.rotator.imperativeCounterpart.addChild(node)

                return node
            })

            const cellContainer = this.grid.refs.cellContainer.imperativeCounterpart
            const rotator = this.rotator.imperativeCounterpart
            const gridCellNodes = [...cellContainer.children]

            const cellPositions = gridCellNodes.map(cellNode => {
                return getPositionFromAncestor(cellNode, rotator)
            })

            // Add a render task, which is a function that gets executed at about
            // 60hz repeatedly. We modify the rotator node within this render task,
            // which causes the rotator node to be re-rendered.
            //
            // Here we increment the "angle" variable by 1 each tick of the Motor's
            // animation loop (the animation loop executes this following render task
            // over and over at about 60 times per second).
            let angle = -65
            this.rotationTask = Motor.addRenderTask(() => {
                angle += 0.2
                this.rotator.rotation.y = angle
            })

            // after 2 seconds...
            await sleep(3000)

            const tweens = []

            // ... animate the letters into the layout.
            letterNodes.forEach((letterNode, index) => {

                const positionTween = new TWEEN.Tween({
                    x: letterNode.position.x,
                    y: letterNode.position.y,
                    z: letterNode.position.z,
                })
                    .to(cellPositions[index], 2000)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .onUpdate(function() {
                        letterNode.position = { x: this.x, y: this.y, z: this.z, }
                    })
                    .onComplete(function() { positionTween.completed = true })
                    .onStop(function() { positionTween.stopped = true })

                const rotationTween = new TWEEN.Tween({
                    x: letterNode.rotation.x,
                    y: letterNode.rotation.y,
                    z: letterNode.rotation.z,
                })
                    .to({x:0, y:0, z:0}, 2000)
                    .easing(TWEEN.Easing.Exponential.Out)
                    .onUpdate(function() {
                        letterNode.rotation = { x: this.x, y: this.y, z: this.z, }
                    })
                    .onComplete(function() { rotationTween.completed = true })
                    .onStop(function() { rotationTween.stopped = true })

                tweens.push([positionTween, rotationTween])
            })

            let completedTweens = 0
            const task = Motor.addRenderTask(time => {

                for (let i = 0, l = tweens.length; i<l; i+=1) {
                    if (!tweens[i][0].started) {
                        tweens[i][0].start(time)
                        tweens[i][0].started = true
                    }
                    else tweens[i][0].update(time)

                    if (!tweens[i][1].started) {
                        tweens[i][1].start(time)
                        tweens[i][1].started = true
                    }
                    else tweens[i][1].update(time)

                    if (tweens[i][0].completed || tweens[i][0].stopped) {
                        completedTweens++
                    }
                    if (tweens[i][1].completed || tweens[i][1].stopped) {
                        completedTweens++
                    }
                }

                if (completedTweens == tweens.length * 2) {
                    Motor.removeRenderTask(task)
                }
            })

            //After animating to new positions, transfer to the layout?
        }

        componentWillUnmount() {
            Motor.removeRenderTask(this.rotationTask)
        }
    }

    function getPositionFromAncestor(descendant, ancestor) {
        const position = { x: 0, y: 0, z: 0 }
        let currentNode = descendant

        while(currentNode && currentNode !== ancestor) {
            const currentNodeParent = currentNode.parent

            const parentSize = currentNodeParent.actualSize
            const currentAlign = currentNode.align
            const currentSize = currentNode.actualSize
            const alignOffset = {
                x: parentSize.x * currentAlign.x,
                y: parentSize.y * currentAlign.y,
                z: parentSize.z * currentAlign.z,
            }
            const currentMountPoint = currentNode.mountPoint
            const mountPointOffest = {
                x: currentSize.x * currentMountPoint.x,
                y: currentSize.y * currentMountPoint.y,
                z: currentSize.z * currentMountPoint.z,
            }

            position.x += currentNode.position.x + alignOffset.x - mountPointOffest.x
            position.y += currentNode.position.y + alignOffset.y - mountPointOffest.y
            position.z += currentNode.position.z + alignOffset.z - mountPointOffest.z

            currentNode = currentNodeParent
        }

        return position
    }

    function startGame() {
        const appRoot = document.querySelector('#app-root')
        ReactDOM.render(<LettersToGrid msg="This is a sentence of random text, just some random bits somewhere in the universe. :]" />, appRoot)
    }

    await startup()
    startGame()
}
