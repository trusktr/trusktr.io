
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

var rotateTo = 0;
setInterval(f=> {
    rotateTo = +!rotateTo;
    tt.setTranslate([null,null,rotateTo*950], {duration: 6000, curve: 'easeInOut'});
    tt.setRotate([null,rotateTo*Math.PI,null], {duration: 6300, curve: 'easeInOut'});
    tt.setRotate([Math.PI/7,null,Math.PI/7], {duration: 3150, curve: 'easeIn'}, f=> {
        tt.setRotate([0,null,0], {duration: 3150, curve: 'easeOut'});
    });
}, 1500);

