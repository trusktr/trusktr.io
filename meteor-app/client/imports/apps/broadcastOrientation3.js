import * as React from 'react'
import * as ReactDOM from 'react-dom'

export default
class DeviceOrientationTest extends React.Component {
    render() {
        return (
            <div>
                {/*
                <link href="https://developer.cdn.mozilla.net/static/build/styles/samples.37902ba3b7fe.css" rel="stylesheet" type="text/css" />

                <style type="text/css" dangerouslySetInnerHTML={{__html: `
                    .garden {
                      position: relative;
                      width : 200px;
                      height: 200px;
                      border: 5px solid #CCC;
                      border-radius: 10px;
                    }

                    .ball {
                      position: absolute;
                      top   : 90px;
                      left  : 90px;
                      width : 20px;
                      height: 20px;
                      background: green;
                      border-radius: 100%;
                    }
                `}}/>

                <div className="garden">
                  <div className="ball"></div>
                </div>

                <pre className="output"></pre>
                */}
            </div>
        )
    }

    componentDidMount() {
        //var ball   = document.querySelector('.ball');
        //var garden = document.querySelector('.garden');
        //var output = document.querySelector('.output');

        //var maxX = garden.clientWidth  - ball.clientWidth;
        //var maxY = garden.clientHeight - ball.clientHeight;

        //let broadcast = new Meteor.Broadcast('orientation3')
        let streamer = new Meteor.Streamer('orientation')

        function handleOrientation(event) {
            var x = event.beta;  // degrees in the range [-180,180]
            var y = event.gamma; // degrees in the range [-90,90]
            var z = event.alpha; // degrees in the range [0,360]

            //output.innerHTML  = "beta : " + x + "\n";
            //output.innerHTML += "gamma: " + y + "\n";

            // Because we don't want to have the device upside down
            // We constrain the x value to the range [-90,90]
            //if (x >  90) { x =  90};
            //if (x < -90) { x = -90};

            // To make computation easier we shift the range of
            // x and y to [0,180]
            //x += 90;
            //y += 90;

            const o = {x, y, z}
            //broadcast.send(o)
            streamer.emit('orientation3', o)

            // 10 is half the size of the ball
            // It center the positioning point to the center of the ball
            //ball.style.top  = (maxX*x/180 - 10) + "px";
            //ball.style.left = (maxY*y/180 - 10) + "px";
        }

        window.addEventListener('deviceorientation', handleOrientation);
    }
}
