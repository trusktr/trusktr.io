import TWEEN from 'tween.js'

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
  identity: function() {
    return [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ];
  },

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

  projection: function(width, height) {
    // Note: This matrix flips the Y axis so that 0 is at the top.
    return [
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1
    ];
  },

  multiply: function(a, b) {
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a10 = a[3];
    var a11 = a[4];
    var a12 = a[5];
    var a20 = a[6];
    var a21 = a[7];
    var a22 = a[8];
    var b00 = b[0];
    var b01 = b[1];
    var b02 = b[2];
    var b10 = b[3];
    var b11 = b[4];
    var b12 = b[5];
    var b20 = b[6];
    var b21 = b[7];
    var b22 = b[8];

    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  },
};

export default
function webglFundamentals() {

    const gl = createWebGLContext(document.querySelector('#app-root'))

    if (!gl) { console.log('no GL for you.') }

    // ------------------------------------------------------------------------------------------------------------------------
    const vertShader = createShader(gl, gl.VERTEX_SHADER, `
        attribute vec2 vertex;
        uniform vec2 resolution;
        uniform mat3 matrix;

        void main() {
            vec2 clipSpace = (matrix * vec3(vertex, 1)).xy;

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

    const quad = new Quad(0,0,100,100)

    const program = createProgram(gl, vertShader, fragShader)

    // Use our pair of shaders
    gl.useProgram(program)

    const resolutionUniformLocation = gl.getUniformLocation(program, "resolution")
    const matrixLocation = gl.getUniformLocation(program, "matrix")
    const colorUniformLocation = gl.getUniformLocation(program, 'color')
    const vertexAttributeLocation = gl.getAttribLocation(program, "vertex")

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

    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quad.verts), gl.STATIC_DRAW)

    // Tell the attribute how to get data out of vertexBuffer (ARRAY_BUFFER)
    const size = 2;          // 2 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next vertex
    const offset = 0;        // start at the beginning of the buffer
    const count = 6

    gl.enableVertexAttribArray(vertexAttributeLocation);
    gl.vertexAttribPointer(
        vertexAttributeLocation, size, type, normalize, stride, offset)

    const angle  = {theta: 0}
    const origin = [0.5, 0.5]

    const tween = new TWEEN.Tween(angle)
        .to({theta: 2*Math.PI}, 20000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .start()

    const originMatrix      = m3.translation(-(quad.width * origin[0]), -(quad.height * origin[1]))
    let rotationMatrix      = m3.rotation(angle.theta)
    const scaleMatrix       = m3.scaling(1,1)
    const translationMatrix = m3.translation(100, 100)

    ~function draw(time) {
        tween.update(time)

        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)

        rotationMatrix = m3.rotation(angle.theta)

        let matrix = m3.identity()
        matrix = m3.multiply(originMatrix, matrix);
        matrix = m3.multiply(scaleMatrix, matrix);
        matrix = m3.multiply(rotationMatrix, matrix);
        matrix = m3.multiply(translationMatrix, matrix);
        gl.uniformMatrix3fv(matrixLocation, false, matrix)

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quad.verts), gl.STATIC_DRAW)
        gl.drawArrays(gl.TRIANGLES, offset, count)

        for (let i = 0; i < 5; ++i) {
          matrix = m3.multiply(originMatrix, matrix);
          matrix = m3.multiply(rotationMatrix, matrix);
          matrix = m3.multiply(scaleMatrix, matrix);
          matrix = m3.multiply(translationMatrix, matrix);

          gl.uniformMatrix3fv(matrixLocation, false, matrix);

          gl.drawArrays(gl.TRIANGLES, offset, count)
        }

        gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1)

        requestAnimationFrame(draw)
    }()
}
