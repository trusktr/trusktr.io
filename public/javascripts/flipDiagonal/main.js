
import Modifier from 'famous/core/Modifier';
import Transform from 'famous/core/Transform';
import TransitionableTransform from 'famous/transitions/TransitionableTransform';
import {Calendar, contextWithPerspective} from 'javascripts/components';

var tt = new TransitionableTransform();
var context = contextWithPerspective(1000);
var mainMod = new Modifier({
    //size: [600, 600],
    align: [0.5,0.5],
    origin: [0.5,0.5],
    transform: tt
});

var mainNode = context.add(mainMod);
var calendar = new Calendar([300, 300], 'flipDiagonal');
mainNode.add(calendar.getNode());

setTimeout(f=> {
    tt.setRotate([null,Math.PI,null], {duration: 6000, curve: 'easeInOut'});
    tt.setRotate([Math.PI/7,null,Math.PI/7], {duration: 3000, curve: 'easeIn'}, f=> {
        tt.setRotate([0,null,0], {duration: 3000, curve: 'easeOut'});
    });
}, 1500);

