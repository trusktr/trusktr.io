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
    } from 'three'

    export default {

        mounted() {

            const scene = new Scene

            const planet = new Object3D
            scene.add(planet)

            const terrain = new Mesh(new SphereGeometry(0.75, 32, 32), new MeshPhongMaterial({
                map: (new TextureLoader).load('/img/earth/earthmap1k.jpg'),
                bumpMap: (new TextureLoader).load('/img/earth/earthbump1k.jpg'),
                bumpScale: 0.02,
                specularMap: (new TextureLoader).load('/img/earth/earthspec1k.jpg'),
                specular: new Color('grey'),
            }))
            planet.add(terrain)

            const cloudTexture = createCloudTexture( cloudTextureReady )
            const clouds = new Mesh(new SphereGeometry(0.77, 32, 32), new MeshPhongMaterial({
                map:         new Texture( cloudTexture ),
                side:        DoubleSide,
                transparent: true,
                opacity:     1,
            }))
            planet.add(clouds)

            function cloudTextureReady() {
                clouds.material.map.needsUpdate = true;
            }

            const stars = new Mesh(new SphereGeometry(10, 12, 12), new MeshBasicMaterial({
                map: (new TextureLoader).load('/img/earth/galaxy_starfield.png'),
                side: BackSide,
            }))
            scene.add(stars)

            const container = this.$refs.container

            const renderer = new WebGLRenderer
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.setPixelRatio(window.devicePixelRatio)
            container.appendChild( renderer.domElement )

            const ambientLight = new AmbientLight( 'white', 0.1 )
            scene.add(ambientLight)

            const pointLight = new PointLight( 'white', 2 )
            pointLight.position.x = 6
            pointLight.position.y = 1
            pointLight.position.z = -6
            scene.add(pointLight)

            pointLight.add(
                new Mesh(new SphereGeometry(0.1, 12, 12), new MeshBasicMaterial({
                    color: 'white',
                }))
            )

            const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
            camera.position.z = 3;
            //camera.position.z = 0.5;
            //camera.position.y = 0.7;

            function render(time) {
                planet.rotation.y += 0.001
                clouds.rotation.y += 0.001
                stars.rotation.y += 0.001
                renderer.render(scene, camera)
                this.frame = requestAnimationFrame(render)
            }

            this.frame = requestAnimationFrame(render)

        },

        destroyed() {
            cancelAnimationFrame( this.frame )
        },
    }

    function createCloudTexture( ready ){
        // create destination canvas
        var canvasResult    = document.createElement('canvas')
        canvasResult.width  = 1024
        canvasResult.height = 512
        var contextResult   = canvasResult.getContext('2d')

        // load earthcloudmap
        var imageMap = new Image();
        imageMap.addEventListener("load", function() {

            // create dataMap ImageData for earthcloudmap
            var canvasMap    = document.createElement('canvas')
            canvasMap.width  = imageMap.width
            canvasMap.height = imageMap.height
            var contextMap   = canvasMap.getContext('2d')
            contextMap.drawImage(imageMap, 0, 0)
            var dataMap      = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

            // load earthcloudmaptrans
            var imageTrans	= new Image();
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
            imageTrans.src	= '/img/earth/earthcloudmaptrans.jpg';
        }, false);
        imageMap.src = '/img/earth/earthcloudmap.jpg';

        return canvasResult

    }
</script>

