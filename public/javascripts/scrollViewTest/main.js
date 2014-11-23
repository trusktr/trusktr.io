import Engine           from 'famous/core/Engine';
import View             from 'famous/core/View';
import Surface          from 'famous/core/Surface';
import Transform        from 'famous/core/Transform';
import StateModifier    from 'famous/modifiers/StateModifier';
import HeaderFooter     from 'famous/views/HeaderFooterLayout';
import Scrollview       from "famous/views/Scrollview";
import RenderNode       from 'famous/core/RenderNode';

(function() {
    function ContentView() {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createHeaderAndFooter.call(this);
        _createBody.call(this);
    }

    ContentView.prototype = Object.create(View.prototype);
    ContentView.prototype.constructor = ContentView;

    function _createLayout() {
        this.layout = new HeaderFooter({
            headerSize: 50,
            contentSize: undefined,
            footerSize: 50
        });
        this.add(this.layout);
    }

    function _createHeaderAndFooter() {

        var backgroundSurface = new Surface({
            properties: {
                background: '#000000'
            }
        });
        var textSurface = new Surface({
            size: [100, 50],
            content: 'header',
            properties: {
                color: '#ffffff'
            }
        });

        var backgroundModifier = new StateModifier({
            transform: Transform.translate(0, 0, -40)
        });
        var textModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            transform: Transform.translate(0, 0, -30)
        });
        this.layout.header.add(backgroundModifier).add(backgroundSurface);
        this.layout.header.add(textModifier).add(textSurface);

        var backgroundSurface = new Surface({
            properties: {
                background: '#000000'
            }
        });
        var textSurface = new Surface({
            size: [100, 50],
            content: 'footer',
            properties: {
                color: '#ffffff'
            }
        });

        var backgroundModifier = new StateModifier({
            transform: Transform.translate(0, 0, -40)
        });
        var textModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            transform: Transform.translate(0, 0, -30)
        });

        this.layout.footer.add(backgroundModifier).add(backgroundSurface);
        this.layout.footer.add(textModifier).add(textSurface);

    }

    function _createBody() {
        var bodySurface = new Surface({
            size: [undefined, undefined],
            properties: {
                background: '#333333'
            }
        });

        var bodyModifier = new StateModifier({
            transform: Transform.translate(0, 0, -50)
        });
        this.layout.content.add(bodyModifier).add(bodySurface);


        var scrollview = new Scrollview();
        var surfaces = [];
        scrollview.sequenceFrom(surfaces);

        for (var i = 0; i < 50; i++) {
            var surface = new Surface({
                size: [undefined, 30],
                content: "surface " + (i + 1),
                properties: {
                    fontSize: this.options.fontSize + 'px',
                    color: "#ffffff",
                    backgroundColor : "hsl(" + (i * 360 / 50) + ", 100%, 50%)",
                    textAlign: 'center',
                    cursor: 'default'
                }
            });

            surface.pipe(scrollview);
            var mod = new StateModifier({
                transform: Transform.translate(0, 0, -50)
            });
            var gap = new Surface({
                size: [undefined, 0]
            });
            var node = new RenderNode(mod);
            node.add(surface);
            surfaces.push(node);
            surfaces.push(gap);
        }
        this.layout.content.add(scrollview);
    }

    var context = Engine.createContext(document.getElementById('one'));

    var view = new ContentView();

    context.add(view);
})();



(function() {
    function ContentView() {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createHeaderAndFooter.call(this);
        _createBody.call(this);
    }

    ContentView.prototype = Object.create(View.prototype);
    ContentView.prototype.constructor = ContentView;

    function _createLayout() {
        this.layout = new HeaderFooter({
            headerSize: 50,
            contentSize: undefined,
            footerSize: 50
        });
        this.add(this.layout);
    }

    function _createHeaderAndFooter() {

        var backgroundSurface = new Surface({
            properties: {
                background: '#000000'
            }
        });
        var textSurface = new Surface({
            size: [100, 50],
            content: 'header',
            properties: {
                color: '#ffffff'
            }
        });

        var backgroundModifier = new StateModifier({
            transform: Transform.translate(0, 0, -40)
        });
        var textModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            transform: Transform.translate(0, 0, -30)
        });
        this.layout.header.add(backgroundModifier).add(backgroundSurface);
        this.layout.header.add(textModifier).add(textSurface);

        var backgroundSurface = new Surface({
            properties: {
                background: '#000000'
            }
        });
        var textSurface = new Surface({
            size: [100, 50],
            content: 'footer',
            properties: {
                color: '#ffffff'
            }
        });

        var backgroundModifier = new StateModifier({
            transform: Transform.translate(0, 0, -40)
        });
        var textModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            transform: Transform.translate(0, 0, -30)
        });

        this.layout.footer.add(backgroundModifier).add(backgroundSurface);
        this.layout.footer.add(textModifier).add(textSurface);

    }

    function _createBody() {
        var bodySurface = new Surface({
            size: [undefined, undefined],
            properties: {
                background: '#333333'
            }
        });

        var bodyModifier = new StateModifier({
            transform: Transform.translate(0, 0, -50)
        });
        this.layout.content.add(bodyModifier).add(bodySurface);


        var scrollview = new Scrollview();
        var surfaces = [];
        scrollview.sequenceFrom(surfaces);

        for (var i = 0; i < 50; i++) {
            var surface = new Surface({
                size: [undefined, 30],
                content: "surface " + (i + 1),
                properties: {
                    fontSize: this.options.fontSize + 'px',
                    color: "#ffffff",
                    backgroundColor : "hsl(" + (i * 360 / 50) + ", 100%, 50%)",
                    textAlign: 'center',
                    cursor: 'default'
                }
            });

            surface.pipe(scrollview);
            var mod = new StateModifier({
                transform: Transform.translate(0, 0, -50)
            });
            var gap = new Surface({
                size: [undefined, 0]
            });
            var node = new RenderNode(mod);
            node.add(surface);
            surfaces.push(node);
            surfaces.push(gap);
        }
        this.layout.content.add(scrollview);
    }

    var context = Engine.createContext(document.getElementById('two'));

    var view = new ContentView();

    context.add(view);
})();
