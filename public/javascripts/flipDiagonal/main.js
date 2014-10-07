
import Modifier from 'famous/core/Modifier';
import Transform from 'famous/core/Transform';
import TransitionableTransform from 'famous/transitions/TransitionableTransform';
import Calendar from 'javascripts/components/Calendar';
import {contextWithPerspective} from 'javascripts/components/utils';

var tt = new TransitionableTransform();
var context = contextWithPerspective(1000);
var mainMod = new Modifier({
    align: [0.5,0.5],
    origin: [0.5,0.5],
    transform: tt
});

var mainNode = context.add(mainMod);
var calendar = new Calendar([300, 300], 'flipDiagonal');
mainNode.add(calendar.getNode());

var moveTo = 0;
function moveBackAndForth() {
    moveTo = +!moveTo;
    tt.setTranslateZ(moveTo*950, {duration: 6000, curve: 'easeInOut'}, moveBackAndForth);
}
moveBackAndForth();

var rotateTo = 0;
function rotateYBackAndForth() {
    rotateTo = +!rotateTo;
    tt.setRotateY(rotateTo*Math.PI, {duration: 6300, curve: 'easeInOut'}, rotateYBackAndForth);
}
rotateYBackAndForth();

var tiltTo = 0;
var tiltTransitions = ['easeOut','easeIn'];
function tiltOverAndOver() {
    tiltTo = +!tiltTo;
    tt.setRotate([tiltTo*Math.PI/7,null,tiltTo*Math.PI/7], {duration: 3150, curve: tiltTransitions[tiltTo]}, tiltOverAndOver);
}
tiltOverAndOver();

