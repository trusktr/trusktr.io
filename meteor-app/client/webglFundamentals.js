function createWebGLContext(target) {
    const canvas = createCanvas(target, '100%', '100%')
    return getGl(canvas)
}

function setResolution(gl, width, height, resolutionUniformLocation) {
    gl.canvas.width = width
    gl.canvas.height = height
    gl.viewport(0, 0, width, height);
    if (resolutionUniformLocation)
        gl.uniform2f(resolutionUniformLocation, width, height)
}

function createCanvas(parent, width, height) {
    const canvas = document.createElement('canvas')
    canvas.style.width = width
    canvas.style.height = height
    parent.appendChild(canvas)
    return canvas
}

function getGl(canvasOrSelector) {
    let canvas

    if (canvasOrSelector instanceof HTMLCanvasElement)
        canvas = canvasOrSelector

    if (!canvas)
        canvas = document.querySelector(canvasOrSelector)

    if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('No canvas!')

    return canvas.getContext('webgl')
}

function createShader(gl, type, source) {
    // Create a vertex shader object
    const shader = gl.createShader(type)

    // Attach vertex shader source code
    gl.shaderSource(shader, source)

    // Compile the vertex shader
    gl.compileShader(shader)

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (success) return shader

    const error = new Error("*** Error compiling shader '" + shader + "':" + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader)
    throw error
}

function createProgram(gl, vertexShader, fragmentShader) {
    // Create a shader program object to store
    // the combined shader program
    const program = gl.createProgram()

    // Attach a vertex shader
    gl.attachShader(program, vertexShader)

    // Attach a fragment shader
    gl.attachShader(program, fragmentShader)

    // Link both programs
    gl.linkProgram(program)

    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (success) {
        return program
    }

    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
}

class Quad {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.verts = []

        this.calcVerts()
    }

    calcVerts() {
        const {x,y} = this
        const {width,height} = this
        const x2 = x + width
        const y2 = y + height
        const {verts} = this

        verts[0] = x
        verts[1] = y

        verts[2] = x2
        verts[3] = y

        verts[4] = x2
        verts[5] = y2

        verts[6] = x2
        verts[7] = y2

        verts[8] = x
        verts[9] = y2

        verts[10] = x
        verts[11] = y

        return verts
    }
}

var m3 = {
  translation: function(tx, ty) {
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1,
    ];
  },
 
  rotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
      c,-s, 0,
      s, c, 0,
      0, 0, 1,
    ];
  },
 
  scaling: function(sx, sy) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    ];
  },
};

export default
function webglFundamentals() {

    const gl = createWebGLContext(document.body)

    if (!gl) { console.log('no GL for you.') }

    // ------------------------------------------------------------------------------------------------------------------------
    const vertShader = createShader(gl, gl.VERTEX_SHADER, `
        attribute vec2 position;
        uniform vec2 resolution;
        uniform vec2 translation;
        uniform vec2 rotation;
        uniform vec2 scale;

        void main() {
            vec2 clipSpace;

            // scale
            clipSpace = position * scale;

            // rotate
            clipSpace = vec2(
                clipSpace.x * rotation.y + clipSpace.y * rotation.x,
                clipSpace.y * rotation.y - clipSpace.x * rotation.x
            );

            // translate
            clipSpace = clipSpace + translation;

            clipSpace =
                (clipSpace / resolution) // get the portion of clip space
                * 2.0                   // convert to clip space units
                - 1.0;                  // Move from the center to bottom left

            // move to the top left like DOM
            clipSpace = clipSpace * vec2(1, -1);

            gl_Position = vec4(clipSpace, 0, 1);
            //gl_PointSize = 10.0;
        }
    `)

    // ------------------------------------------------------------------------------------------------------------------------
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, `
        precision mediump float;
        uniform vec4 color;

        void main(void) {
            gl_FragColor = color;
            //gl_FragColor = vec4(0.8,0.3,1,1);
        }
    `)

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    const quad = new Quad(0,0,100,100)

    const program = createProgram(gl, vertShader, fragShader)

    // Use our pair of shaders
    gl.useProgram(program)

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quad.verts), gl.STATIC_DRAW)

    const scaleUniformLocation = gl.getUniformLocation(program, "scale")
    const resolutionUniformLocation = gl.getUniformLocation(program, "resolution")
    const translationUniformLocation = gl.getUniformLocation(program, "translation")
    const rotationUniformLocation = gl.getUniformLocation(program, "rotation")
    const colorUniformLocation = gl.getUniformLocation(program, 'color')

    gl.uniform2f(scaleUniformLocation, 2, 2)
    gl.uniform2f(translationUniformLocation, 100, 100)

    let angle = {theta:0}
    gl.uniform2f(rotationUniformLocation, Math.sin(angle.theta), Math.cos(angle.theta))

    // Why the god damn fuck does this not work before the previous setResolution call?
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    setResolution(
        gl,
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio,
        resolutionUniformLocation
    )

    // TODO: watch parent size instead of window.
    window.addEventListener('resize', function(e) {
        setResolution(
            gl,
            window.innerWidth * window.devicePixelRatio,
            window.innerHeight * window.devicePixelRatio,
            resolutionUniformLocation
        )
    })

    const positionAttributeLocation = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(positionAttributeLocation);

    gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1)

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 2;          // 2 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset)

    const count = 6
    gl.drawArrays(gl.TRIANGLES, offset, count)

    //const tween = new TWEEN.Tween(angle)
        //.to({theta: 2*Math.PI}, 2000)
        //.easing(TWEEN.Easing.Elastic.InOut)
        //.start()

    //requestAnimationFrame(function loop(time) {
        //tween.update(time)

        //gl.clearColor(0, 0, 0, 1)
        //gl.clear(gl.COLOR_BUFFER_BIT)

        //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quad.verts), gl.STATIC_DRAW)
        //gl.drawArrays(gl.TRIANGLES, offset, count)

        //gl.uniform2f(rotationUniformLocation, Math.sin(angle.theta), Math.cos(angle.theta))

        //requestAnimationFrame(loop)
    //})
}
