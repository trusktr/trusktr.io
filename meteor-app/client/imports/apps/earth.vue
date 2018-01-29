<template>
    <div ref="container"></div>
</template>

<style scoped>
    div { width: 100%; height: 100%; }
</style>

<script>
    import {
        Scene,
        Mesh,
        Object3D,
        SphereGeometry,
        MeshPhongMaterial,
        MeshBasicMaterial,
        WebGLRenderer,
        PerspectiveCamera,
        AmbientLight,
        PointLight,
        TextureLoader,
        Color,
        Texture,
        DoubleSide,
        BackSide,
        FrontSide,
        PCFSoftShadowMap,
        ShaderMaterial,
        AdditiveBlending,
        UniformsLib,
        UniformsUtils,
        ShaderChunk,
        //RGBADepthPacking,
        //MeshDepthMaterial,

        // our textures are not power-of-two, so we use this for all textures, for now.
        LinearFilter,
    } from 'three'

    export default {

        mounted() {

            const scene = new Scene

            const earth = new Object3D
            scene.add(earth)

            // TERRAIN /////////////////////////////////////////////////////////////////////////
            const terrain = new Mesh(new SphereGeometry(0.75, 32, 32), new MeshPhongMaterial({
                map: (new TextureLoader).load('/img/earth/earthmap1k.jpg'),
                bumpMap: (new TextureLoader).load('/img/earth/earthbump1k.jpg'),
                bumpScale: 0.02,
                specularMap: (new TextureLoader).load('/img/earth/earthspec1k.jpg'),
                specular: new Color('grey'),
                shininess: 10,
                transparent: true,
                opacity: 1,
                //lights: false,
            }))
            terrain.receiveShadow = true
            terrain.castShadow = true
            terrain.material.map.minFilter = LinearFilter
            terrain.material.bumpMap.minFilter = LinearFilter
            terrain.material.specularMap.minFilter = LinearFilter
            earth.add(terrain)

            // CLOUDS /////////////////////////////////////////////////////////////////////////
            const cloudCanvas = createCloudTextureCanvas( cloudCanvasReady )
            const cloudTexture = new Texture( cloudCanvas )
            const clouds = new Mesh(new SphereGeometry(0.76, 32, 32), new MeshPhongMaterial({
                map:         cloudTexture,
                side:        DoubleSide,
                transparent: true,
                opacity:     1,
                //alphaTest:   0.5,
            }))
            clouds.receiveShadow = true
            clouds.castShadow = true
            clouds.material.map.minFilter = LinearFilter
            earth.add(clouds)

            function cloudCanvasReady() {
                clouds.material.map.needsUpdate = true;
            }

            // shadow for the clouds, based on https://stackoverflow.com/questions/43848330/three-js-shadows-cast-by-partially-transparent-mesh
            //var customDepthMaterial = new MeshDepthMaterial( {
            //    depthPacking: RGBADepthPacking,
            //    map: cloudTexture, // or, alphaMap: myAlphaMap
            //    alphaTest: 0.5
            //} );
            //clouds.customDepthMaterial = customDepthMaterial

            // HAZE /////////////////////////////////////////////////////////////////////////
            const haze = new Mesh(new SphereGeometry(0.76, 32, 32),
                //new MeshPhongMaterial({
                //    color:       'skyblue',
                //    side:        DoubleSide,
                //    transparent: true,
                //    opacity:     0.4,
                //})
                createGlowMaterial({ color: new Color('#CFECFF'), power: 2.0, coefficient: 1, multiplier: 4.0 })
            )
            haze.receiveShadow = true
            haze.castShadow = true
            earth.add(haze)

            // STARS /////////////////////////////////////////////////////////////////////////
            const stars = new Mesh(new SphereGeometry(17, 6, 6), new MeshBasicMaterial({
                map: (new TextureLoader).load('/img/earth/galaxy_starfield.png'),
                side: DoubleSide,
            }))
            stars.material.map.minFilter = LinearFilter
            scene.add(stars)

            // LIGHT/SUN /////////////////////////////////////////////////////////////////////////
            const ambientLight = new AmbientLight( 'white', 0.1 )
            scene.add(ambientLight)

            let sun = new PointLight( 'white', 0.65 )
            sun.position.x = 14
            sun.castShadow = true

            sun.add(
                new Mesh(new SphereGeometry(0.1, 18, 18), new MeshBasicMaterial({
                    color: '#FFFBC9',
                }))
            )

            sun = new Object3D().add(sun)
            //sun.rotation.z = Math.PI/18
            scene.add(sun)

            // RENDERER/CAMERA /////////////////////////////////////////////////////////////////////////
            const container = this.$refs.container

            const renderer = new WebGLRenderer({ antialias: true })
            container.appendChild( renderer.domElement )
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = PCFSoftShadowMap;

            const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 30);
            camera.position.z = 3;
            //camera.position.z = 0.5;
            //camera.position.y = 0.7;

            function render(time) {
                earth.rotation.y += 0.001

                // haze is same radius as clouds, so if they don't rotate
                // together then the intersection of the polygons will cause
                // undesirable effects, so we rotate them in unison.
                clouds.rotation.y += -0.0003
                haze.rotation.y += -0.0003

                stars.rotation.y += -0.0003
                sun.rotation.y += -0.01
                renderer.render(scene, camera)
                this.frame = requestAnimationFrame(render)
            }

            this.frame = requestAnimationFrame(render)

        },

        destroyed() {
            cancelAnimationFrame( this.frame )
        },
    }

    function createCloudTextureCanvas( ready ){
        // create destination canvas
        var canvasResult    = document.createElement('canvas')
        canvasResult.width  = 1024
        canvasResult.height = 512
        var contextResult   = canvasResult.getContext('2d')

        // load earthcloudmap
        var imageMap = new Image();
        imageMap.crossOrigin = 'Anonymous'
        imageMap.addEventListener("load", function() {

            // create dataMap ImageData for earthcloudmap
            var canvasMap    = document.createElement('canvas')
            canvasMap.width  = imageMap.width
            canvasMap.height = imageMap.height
            var contextMap   = canvasMap.getContext('2d')
            contextMap.drawImage(imageMap, 0, 0)
            var dataMap      = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

            // load earthcloudmaptrans
            var imageTrans = new Image();
            imageTrans.crossOrigin = 'Anonymous'
            imageTrans.addEventListener("load", function(){
                // create dataTrans ImageData for earthcloudmaptrans
                var canvasTrans    = document.createElement('canvas')
                canvasTrans.width  = imageTrans.width
                canvasTrans.height = imageTrans.height
                var contextTrans   = canvasTrans.getContext('2d')
                contextTrans.drawImage(imageTrans, 0, 0)
                var dataTrans      = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
                // merge dataMap + dataTrans into dataResult
                var dataResult     = contextMap.createImageData(canvasMap.width, canvasMap.height)
                for(var y = 0, offset = 0; y < imageMap.height; y++){
                    for(var x = 0; x < imageMap.width; x++, offset += 4){
                        dataResult.data[offset+0] = dataMap.data[offset+0]
                        dataResult.data[offset+1] = dataMap.data[offset+1]
                        dataResult.data[offset+2] = dataMap.data[offset+2]
                        dataResult.data[offset+3] = 255 - dataTrans.data[offset+0]
                    }
                }
                // update texture with result
                contextResult.putImageData(dataResult,0,0)
                if (typeof ready == 'function') ready()
            })
            imageTrans.src = '/img/earth/earthcloudmaptrans.jpg';
        }, false);
        imageMap.src = '/img/earth/earthcloudmap.jpg';

        return canvasResult

    }

    /**
     * Adapted from
     * http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl
     * (the source:
     * http://jeromeetienne.github.io/threex.planets/threex.atmospherematerial.js)
     * which is based on
     * http://stemkoski.blogspot.fr/2013/07/shaders-in-threejs-glow-and-halo.html
     *
     * I added lighting to it based on
     * https://csantosbh.wordpress.com/2014/01/09/custom-shaders-with-three-js-uniforms-textures-and-lighting/
	 * and https://www.youtube.com/watch?v=978-x5IL96Y
     * (new parts marked with LIGHTS)
     */
    function createGlowMaterial({color, power, multiplier, coefficient}) {
        var vertexShader = `
            // LIGHTS
            ${ShaderChunk.shadowmap_pars_vertex}
            varying vec3 vViewPosition;

            varying vec3 vNormal;

            void main(){
                // LIGHTS
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                vViewPosition = - mvPosition.xyz;

                // compute intensity
                vNormal  = normalize( normalMatrix * normal );
                // set gl_Position
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `
        var fragmentShader = `
            // LIGHTS
            uniform vec3 diffuse;
            uniform vec3 emissive;
            uniform vec3 specular;
            uniform vec3 opacity;
            uniform float shininess;
            ${ShaderChunk.common}
            ${ShaderChunk.packing}
            ${ShaderChunk.bsdfs}
            ${ShaderChunk.lights_pars}
            ${ShaderChunk.lights_phong_pars_fragment}
            ${ShaderChunk.shadowmap_pars_fragment}

            uniform float glowCoefficient;
            uniform float glowPower;
            uniform float glowMultiplier;
            uniform vec3  glowColor;

            void main(){
                // LIGHTS
                vec4 diffuseColor = vec4( diffuse, /*opacity*/ 1.0 );
                ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
                ${ShaderChunk.specularmap_fragment}
                ${ShaderChunk.normal_fragment}
                ${ShaderChunk.lights_phong_fragment}
                ${ShaderChunk.lights_template}
                vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + emissive;

                float intensity = pow( glowCoefficient - dot(vNormal, vec3(0.0, 0.0, 1.0)), glowPower );
                //gl_FragColor = vec4( glowColor * intensity, 1.0 );

                // LIGHTS
                //gl_FragColor = vec4( glowColor * intensity, diffuseColor.a );
                gl_FragColor = vec4( outgoingLight * glowColor * glowMultiplier*intensity, diffuseColor.a );
                //gl_FragColor = vec4( outgoingLight, diffuseColor.a );
                //gl_FragColor = vec4( (outgoingLight + glowColor) * intensity, diffuseColor.a );
                //gl_FragColor = vec4( outgoingLight + glowColor * intensity, diffuseColor.a );
                //gl_FragColor = vec4( outgoingLight * intensity * glowColor * intensity, diffuseColor.a );
            }
        `


        // create a custom material from the shader sources
        var material = new ShaderMaterial({
            uniforms: UniformsUtils.merge([
                // LIGHTS
                UniformsLib.common,
                UniformsLib.lights,
                {
                    emissive: { value: new Color( 0x000000 ) },
                    specular: { value: new Color( 0x111111 ) },
                    shininess: { value: 30 }
                },

                {
                    glowCoefficient : {
                        type : "f",
                        value : coefficient === undefined ? 1.0 : coefficient
                    },
                    glowPower  : {
                        type : "f",
                        value : power === undefined ? 1.0 : power
                    },
                    glowMultiplier  : {
                        type : "f",
                        value : multiplier === undefined ? 1.0 : multiplier
                    },
                    glowColor : {
                        type : "c",
                        value : color || new Color('pink')
                    },
                }
            ]),
            vertexShader : vertexShader,
            fragmentShader : fragmentShader,
            side  : FrontSide,
            blending : AdditiveBlending,
            transparent : true,
            depthWrite : false,
            // LIGHTS
            lights: true,
        });

        return material
    }
</script>

