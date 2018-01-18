import * as React from 'react'
import 'infamous/html'
import router from '../../routes'
import splashSvg from './splash.svg'

export default
class App extends React.Component {
    render() {
        return (
            <div style={{width: '100%', height: '100%', background: 'black'}}>
                <style dangerouslySetInnerHTML={{__html: `
                    #menuHint {
                        visibility: hidden
                    }
                `}}></style>
                <motor-scene>
                    <motor-node
                        onClick={() => this.click()}
                        size="78.28 16.98"
                        style={{color: 'white', cursor: 'pointer', fontSize: ''}}
                        align="0.5 0.5"
                        mountPoint="0.5 0.5"
                        dangerouslySetInnerHTML={{__html: splashSvg}}
                    >
                    </motor-node>
                </motor-scene>
            </div>
        )
    }

    componentDidMount() {

        const {body} = document
        const _this = this
        body.addEventListener('click', async function fullscreen(e) {
            body.removeEventListener('click', fullscreen)

            if (body.requestFullscreen) {
                body.requestFullscreen();
            } else if (body.msRequestFullscreen) {
                body.msRequestFullscreen();
            } else if (body.mozRequestFullScreen) {
                body.mozRequestFullScreen();
            } else if (body.webkitRequestFullscreen) {
                body.webkitRequestFullscreen();
            }
        })

    }

    click() {
        clicks++

        if (clicks <= 1) {}
        else router.go('polydance')

    }
}

var clicks = 0
