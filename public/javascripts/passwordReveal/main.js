import Surface from 'famous/core/Surface';
import Transform from 'famous/core/Transform';
import TransitionableTransform from 'famous/transitions/TransitionableTransform';
import Transitionable from 'famous/transitions/Transitionable';
import Easing from 'famous/transitions/Easing';
import HeaderFooterLayout from 'famous/views/HeaderFooterLayout';

import Plane from 'javascripts/components/Plane';
import Molecule from 'javascripts/components/Molecule';
import {contextWithPerspective} from 'javascripts/components/utils';

var context = contextWithPerspective(1000);
var mainMol = new Molecule();
var mainNode = context.add(mainMol.getNode());

var resume = new Plane({
    //size: [800, 1100],
    properties: {
        "-webkit-filter": 'blur(7px)',
        "-moz-filter":    'blur(7px)',
        "-ms-filter":     'blur(7px)',
        "-o-filter":      'blur(7px)'
    },
    content: '<iframe style="width: 100%; height: 100%" src="https://docs.google.com/viewer?embedded=true&url=trusktr.io/boring_resume.pdf"></iframe>',
});

var layout = new HeaderFooterLayout({
    headerSize: 50,
    footerSize: 0
});

var headerMolecule = new Molecule();
var footerMolecule = new Molecule();
var loginLink = new Plane({
    content: '<a style="cursor: pointer">Login to view</a>',
    properties: {
        background: '#333',
        color: 'pink',
        paddingRight: '20px',
        lineHeight: "50px",
        textAlign: "right",
        boxShadow:            '0px -30px 40px 40px rgba(0,0,0,0.8)',
    }
})
layout.header.add(headerMolecule).add(loginLink.getNode());
layout.content.add(resume.getNode());
layout.content.add(new Molecule({
    opacity: 0
}).getNode()).add(new Plane({
    properties: {
        background: 'white'
    }
}).getNode());
layout.footer.add(footerMolecule).add(new Plane({
    content: "Footer",
    properties: {
        background: '#333',
        lineHeight: "50px",
        textAlign: "center"
    }
}).getNode());
mainNode.add(layout);

var passwordBoxMol = new Molecule({
    //size: [200,200],
    opacity: 0
});
var passwordBoxNode = mainNode.add(passwordBoxMol.getNode());

var passwordBox = new Plane({
    size: [200,200],
    content: '<h1>Login:</h1><input type="text" placeholder="username" /><br /><input type="password" placeholder="password" /><br /><button>Login</button><br />',
    properties: {
        padding:              '10px',
        background:           'white',
        border:               '2px solid #ddd',
        boxShadow:            '4px 4px 30px 0px rgba(0,0,0,0.8)',
    }
});
passwordBoxNode.add(passwordBox.getNode());

var passwordBoxVisible = false;
loginLink.componentHandler.on('click', function() {
    if (!passwordBoxVisible) {
        passwordBoxVisible = true;
        var zoom = new TransitionableTransform();
        var fade = new Transitionable(0);

        passwordBoxMol.componentMod.alignFrom(function() {
            return [0.1,0.1];
        });

        passwordBoxMol.componentMod.transformFrom(zoom);
        zoom.setTranslateZ(200, {duration: 1000, curve: Easing.outExpo});
        zoom.setRotateX(-Math.PI/4);
        zoom.setRotateX(0, {duration: 1000, curve: Easing.outExpo});

        passwordBoxMol.componentMod.opacityFrom(fade);
        fade.set(1, {duration: 1000, curve: Easing.outExpo});
    }
});
