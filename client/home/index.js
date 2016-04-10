
////////////////////////////////////////////////////////

import $ from 'jquery';

import MotorHTMLNode from 'infamous/motor-html/node'
import MotorHTMLScene from 'infamous/motor-html/scene'

export default
function home() {

    $(document).ready(async () => {
        const node1 = $('#scene1 > motor-node')
        const node2 = $('#scene2 > motor-node')
        const threeDee = document.querySelector('.three-dee')

        // make some rotation baby.
        let r = 0
        requestAnimationFrame(function loop() {
            r += 1

            // TODO: Allow something like `node.rotation = [0, r, 0]` for performance.
            node1.attr('rotation', `0, ${30+r}, 0`)
            node2[0].setAttribute('rotation', `0, ${r*0.5}, 0`)
            threeDee.setAttribute('rotation', [r*2, r*3, 0])

            requestAnimationFrame(loop)
        })
    })

}
