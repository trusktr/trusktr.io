import TWEEN from 'tween.js'

let targetContextMap = new WeakMap

function createWebGLContext(target, version) {
    const canvas = createCanvas('100%', '100%')
    const gl = getGl(canvas, version)

    if (gl) {
        if (targetContextMap.has(target)) removeWebGLContext(target)
        target.appendChild(canvas)
        targetContextMap.set(target, gl)
    }

    return gl
}

function removeWebGLContext(target) {
    const gl = targetContextMap.get(target)
    target.removeChild(gl.canvas)
}

function createCanvas(width, height) {
    const canvas = document.createElement('canvas')
    setCanvasCSSSize(canvas, width, height)
    return canvas
}

function setCanvasCSSSize(canvas, width, height) {
    canvas.style.width = width
    canvas.style.height = height
}

function setGlResolution(gl, width, height) {
    setCanvasRenderSize(gl.canvas, width, height)
    gl.viewport(0, 0, width, height)
}

function setCanvasRenderSize(canvas, width, height) {
    canvas.width = width
    canvas.height = height
}

function getGl(canvasOrSelector, version) {
    let canvas

    if (canvasOrSelector instanceof HTMLCanvasElement)
        canvas = canvasOrSelector

    if (!canvas)
        canvas = document.querySelector(canvasOrSelector)

    if (!(canvas instanceof HTMLCanvasElement)) return false

    if (version == 1 || version == undefined) version = ''
    else if (version == 2) version = '2'
    else throw new Error('Invalid WebGL version.')

    return canvas.getContext('webgl'+version)
}

function createShader(gl, type, source) {
    // Create a vertex shader object
    const shader = gl.createShader(type)

    // Attach vertex shader source code
    gl.shaderSource(shader, source)

    // Compile the vertex shader
    gl.compileShader(shader)

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

    if (success) return shader

    const error = new Error("*** Error compiling shader '" + shader + "':" + gl.getShaderInfoLog(shader))
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
        const {x,y, width, height, verts} = this
        const x2 = x + width
        const y2 = y + height

        verts[0] = x
        verts[1] = y
        verts[2] = 0

        verts[3] = x2
        verts[4] = y
        verts[5] = 0

        verts[6] = x2
        verts[7] = y2
        verts[8] = 0

        verts[9] = x2
        verts[10] = y2
        verts[11] = 0

        verts[12] = x
        verts[13] = y2
        verts[14] = 0

        verts[15] = x
        verts[16] = y
        verts[17] = 0

        return verts
    }
}

class Cube {
    constructor(x, y, width) {
        // the top front left corner
        this.x = x
        this.y = y

        this.width = width
        this.verts = []

        this.calcVerts()
    }

    calcVerts() {
        const {x,y, width, verts} = this

        const x2 = x + width
        const y2 = y + width

        this.verts = [
            // front face
            x, y, 0,
            x2, y, 0,
            x2, y2, 0,
            x2, y2, 0,
            x, y2, 0,
            x, y, 0,

            // left face
            x, y, 0,
            x, y, -width,
            x, y2, -width,
            x, y2, -width,
            x, y2, 0,
            x, y, 0,

            // right face
            x2, y, 0,
            x2, y, -width,
            x2, y2, -width,
            x2, y2, -width,
            x2, y2, 0,
            x2, y, 0,

            // back face
            x, y, -width,
            x2, y, -width,
            x2, y2, -width,
            x2, y2, -width,
            x, y2, -width,
            x, y, -width,

            // top face
            x, y, 0,
            x, y, -width,
            x2, y, -width,
            x2, y, -width,
            x2, y, 0,
            x, y, 0,

            // bottom face
            x, y2, 0,
            x, y2, -width,
            x2, y2, -width,
            x2, y2, -width,
            x2, y2, 0,
            x, y2, 0,
        ]

        return verts
    }
}

const m3 = {
    identity: Object.freeze([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ]),

    translation(tx, ty) {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ]
    },

    rotation(angleInRadians) {
        const c = Math.cos(angleInRadians)
        const s = Math.sin(angleInRadians)
        return [
            c,-s, 0,
            s, c, 0,
            0, 0, 1,
        ]
    },

    scaling(sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ]
    },

    // Note: This matrix flips the Y axis so that 0 is at the top.
    projection(width, height) {
        // longer version, multiple matrices
        let matrix = m3.identity
        matrix = m3.multiply(m3.scaling(1/width, 1/height), matrix) // get the portion of clip space
        matrix = m3.multiply(m3.scaling(2, 2), matrix) // convert to clip space units
        matrix = m3.multiply(m3.translation(-1, -1), matrix) // Move from the center to bottom left
        matrix = m3.multiply(m3.scaling(1, -1), matrix) // move to the top left like DOM
        return matrix

        // shorter version, manual result of the longer version
        //return [
            //2 / width,        0,           0,
                //0,       -2 / height,      0,
               //-1,            1,           1
        //]
    },

    multiply(a, b) {
        const a00 = a[0]
        const a01 = a[1]
        const a02 = a[2]
        const a10 = a[3]
        const a11 = a[4]
        const a12 = a[5]
        const a20 = a[6]
        const a21 = a[7]
        const a22 = a[8]
        const b00 = b[0]
        const b01 = b[1]
        const b02 = b[2]
        const b10 = b[3]
        const b11 = b[4]
        const b12 = b[5]
        const b20 = b[6]
        const b21 = b[7]
        const b22 = b[8]

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
        ]
    },
}

const v3 = {
    cross(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0],
        ]
    },

    subtract(a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
    },

    normalize(v) {
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
        // make sure we don't divide by 0.
        if (length > 0.00001) {
            return [v[0] / length, v[1] / length, v[2] / length]
        } else {
            return [0, 0, 0]
        }
    },
}

const m4 = {
    identity: Object.freeze([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ]),

    translation(tx, ty, tz) {
        return [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            tx, ty, tz, 1,
        ]
    },

    xRotation(degrees) {
        const radians = degToRad(degrees)
        const c = Math.cos(radians)
        const s = Math.sin(radians)
        return [
            1,  0, 0, 0,
            0,  c, s, 0,
            0, -s, c, 0,
            0,  0, 0, 1,
        ]
    },

    yRotation(degrees) {
        const radians = degToRad(degrees)
        const c = Math.cos(radians)
        const s = Math.sin(radians)
        return [
            c, 0, -s, 0,
            0, 1,  0, 0,
            s, 0,  c, 0,
            0, 0,  0, 1,
        ]
    },

    zRotation(degrees) {
        const radians = degToRad(degrees)
        const c = Math.cos(radians)
        const s = Math.sin(radians)
        return [
            c,-s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]
    },

    scaling(sx, sy, sz) {
        return [
            sx, 0,  0,  0,
            0,  sy, 0,  0,
            0,  0,  sz, 0,
            0,  0,  0,  1,
        ]
    },

    inverse(m) {
        const m00 = m[0 * 4 + 0]
        const m01 = m[0 * 4 + 1]
        const m02 = m[0 * 4 + 2]
        const m03 = m[0 * 4 + 3]
        const m10 = m[1 * 4 + 0]
        const m11 = m[1 * 4 + 1]
        const m12 = m[1 * 4 + 2]
        const m13 = m[1 * 4 + 3]
        const m20 = m[2 * 4 + 0]
        const m21 = m[2 * 4 + 1]
        const m22 = m[2 * 4 + 2]
        const m23 = m[2 * 4 + 3]
        const m30 = m[3 * 4 + 0]
        const m31 = m[3 * 4 + 1]
        const m32 = m[3 * 4 + 2]
        const m33 = m[3 * 4 + 3]
        const tmp_0  = m22 * m33
        const tmp_1  = m32 * m23
        const tmp_2  = m12 * m33
        const tmp_3  = m32 * m13
        const tmp_4  = m12 * m23
        const tmp_5  = m22 * m13
        const tmp_6  = m02 * m33
        const tmp_7  = m32 * m03
        const tmp_8  = m02 * m23
        const tmp_9  = m22 * m03
        const tmp_10 = m02 * m13
        const tmp_11 = m12 * m03
        const tmp_12 = m20 * m31
        const tmp_13 = m30 * m21
        const tmp_14 = m10 * m31
        const tmp_15 = m30 * m11
        const tmp_16 = m10 * m21
        const tmp_17 = m20 * m11
        const tmp_18 = m00 * m31
        const tmp_19 = m30 * m01
        const tmp_20 = m00 * m21
        const tmp_21 = m20 * m01
        const tmp_22 = m00 * m11
        const tmp_23 = m10 * m01

        const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31)
        const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31)
        const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31)
        const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21)

        const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3)

        return [
            d * t0,
            d * t1,
            d * t2,
            d * t3,
            d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
                (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
            d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
                (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
            d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
                (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
            d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
                (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
            d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
                (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
            d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
                (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
            d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
                (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
            d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
                (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
            d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
                (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
            d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
                (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
            d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
                (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
            d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
                (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
        ]
    },

    transpose(m) {
        return [
            m[0], m[4], m[8], m[12],
            m[1], m[5], m[9], m[13],
            m[2], m[6], m[10], m[14],
            m[3], m[7], m[11], m[15],
        ]
    },


    // Note: This matrix flips the Y axis so that 0 is at the top.
    projection(width, height, depth) {
        // longer version, multiple matrices
        //let matrix = m4.identity
        //matrix = m4.multiply(m4.scaling(1/width, 1/height, 1/depth), matrix) // get the portion of clip space
        //matrix = m4.multiply(m4.scaling(2, 2, 2), matrix) // convert to clip space units
        //matrix = m4.multiply(m4.translation(-1, -1, 0), matrix) // Move from the center to bottom left
        //matrix = m4.multiply(m4.scaling(1, -1, 1), matrix) // move to the top left like DOM
        //return matrix

        // shorter version, manual result of the longer version
        return [
            2 / width, 0,           0,         0,
            0,         -2 / height, 0,         0,
            0,         0,           2 / depth, 0,
            -1,        1,           0,         1,
        ]
    },

    // Note: This matrix flips the Y axis so that 0 is at the top.
    orthographic(left, right, top, bottom, near, far) {
        return [
            2 / (right - left), 0, 0, 0,
            0, 2 / (top - bottom), 0, 0,
            0, 0, 2 / (near - far), 0,

            (left + right) / (left - right),
            (bottom + top) / (bottom - top),
            (near + far) / (near - far),
            1,
        ]
    },

    perspective(fieldOfViewInDegrees, aspect, near, far) {
        const fieldOfViewInRadians = degToRad(fieldOfViewInDegrees)
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians)
        const rangeInv = 1.0 / (near - far)

        return [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ]
    },

    // TODO: finish lookAt part of the camera lesson.
    lookAt(cameraPosition, target, up) {
        const zAxis = v3.normalize(v3.subtract(cameraPosition, target));
        const xAxis = v3.cross(up, zAxis);
        const yAxis = v3.cross(zAxis, xAxis);

        return [
            xAxis[0], xAxis[1], xAxis[2], 0,
            yAxis[0], yAxis[1], yAxis[2], 0,
            zAxis[0], zAxis[1], zAxis[2], 0,
            cameraPosition[0], cameraPosition[1], cameraPosition[2], 1,
        ];
    },

    multiply(a, b) {
        const a00 = a[0 * 4 + 0]
        const a01 = a[0 * 4 + 1]
        const a02 = a[0 * 4 + 2]
        const a03 = a[0 * 4 + 3]
        const a10 = a[1 * 4 + 0]
        const a11 = a[1 * 4 + 1]
        const a12 = a[1 * 4 + 2]
        const a13 = a[1 * 4 + 3]
        const a20 = a[2 * 4 + 0]
        const a21 = a[2 * 4 + 1]
        const a22 = a[2 * 4 + 2]
        const a23 = a[2 * 4 + 3]
        const a30 = a[3 * 4 + 0]
        const a31 = a[3 * 4 + 1]
        const a32 = a[3 * 4 + 2]
        const a33 = a[3 * 4 + 3]
        const b00 = b[0 * 4 + 0]
        const b01 = b[0 * 4 + 1]
        const b02 = b[0 * 4 + 2]
        const b03 = b[0 * 4 + 3]
        const b10 = b[1 * 4 + 0]
        const b11 = b[1 * 4 + 1]
        const b12 = b[1 * 4 + 2]
        const b13 = b[1 * 4 + 3]
        const b20 = b[2 * 4 + 0]
        const b21 = b[2 * 4 + 1]
        const b22 = b[2 * 4 + 2]
        const b23 = b[2 * 4 + 3]
        const b30 = b[3 * 4 + 0]
        const b31 = b[3 * 4 + 1]
        const b32 = b[3 * 4 + 2]
        const b33 = b[3 * 4 + 3]

        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ]
    },
}

function degToRad(degrees) {
    return degrees * Math.PI / 180
}

export default
function webglFundamentals() {

    const gl = createWebGLContext(document.querySelector('#app-root'), 1)

    if (!gl) { console.log('You need WebGL to view this demo.') }

    // ------------------------------------------------------------------------------------------------------------------------
    const vertShader = createShader(gl, gl.VERTEX_SHADER, `
        attribute vec4 vertex;
        uniform mat4 worldViewProjectionMatrix;
        uniform mat4 worldInverseTransposeMatrix; // used for correct lighting normals

        attribute vec4 color;
        varying vec4 fragColor;

        attribute vec3 normal;
        varying vec3 vertNormal;

        void main() {
            gl_Position = worldViewProjectionMatrix * vertex;

            fragColor = color;
            //fragColor = gl_Position * 0.5 + 0.5;

            vertNormal = mat3(worldInverseTransposeMatrix) * normal;
        }
    `)

    // ------------------------------------------------------------------------------------------------------------------------
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, `
        precision mediump float;
        varying vec4 fragColor;
        varying vec3 vertNormal;

        uniform vec3 reverseLightDirection;

        void main(void) {

            // because vertNormal is a varying it's interpolated
            // it will not be a uint vector. Normalizing it
            // will make it a unit vector again.
            vec3 normal = normalize(vertNormal);

            float light = dot(normal, reverseLightDirection);

            gl_FragColor = fragColor;
            gl_FragColor.rgb *= light;
        }
    `)

    const cube = new Cube(0,0,100)

    const program = createProgram(gl, vertShader, fragShader)

    // Use our pair of shaders
    gl.useProgram(program)

    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.verts), gl.STATIC_DRAW)

    // Tell the attribute how to get data out of vertexBuffer (ARRAY_BUFFER)
    const vertexSize = 3;          // 2 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalizeVertexData = false; // don't normalize the data
    const stride = 0;        // 0 = move forward vertexSize * sizeof(type) each iteration to get the next vertex
    const offset = 0;        // start at the beginning of the buffer
    const count = 2/*triangles per side*/ * 3/*vertices per triangle*/ * 6/*sides*/
    const vertexAttributeLocation = gl.getAttribLocation(program, "vertex")
    gl.enableVertexAttribArray(vertexAttributeLocation)
    gl.vertexAttribPointer(
        vertexAttributeLocation, vertexSize, type, normalizeVertexData, stride, offset)

    const vertexColors = new Float32Array(cube.verts.length)

    chooseRandomColors()
    function chooseRandomColors() {
        for (let i=0, l=cube.verts.length; i<l; i+=6*3) { //  6 vertices per side, 3 color parts per vertex

            // four random colors, one for each corner of a quad (two corners
            // have two vertices)
            const colors = [
                [Math.random(), Math.random(), Math.random()],
                [Math.random(), Math.random(), Math.random()],
                [Math.random(), Math.random(), Math.random()],
                [Math.random(), Math.random(), Math.random()],
            ]

            // first vertex
            vertexColors[i+0]  = colors[0][0]
            vertexColors[i+1]  = colors[0][1]
            vertexColors[i+2]  = colors[0][2]

            // second vertex
            vertexColors[i+3]  = colors[1][0]
            vertexColors[i+4]  = colors[1][1]
            vertexColors[i+5]  = colors[1][2]

            // third vertex
            vertexColors[i+6]  = colors[2][0]
            vertexColors[i+7]  = colors[2][1]
            vertexColors[i+8]  = colors[2][2]

            // fourth vertex
            vertexColors[i+9]  = colors[2][0]
            vertexColors[i+10] = colors[2][1]
            vertexColors[i+11] = colors[2][2]

            // fifth vertex
            vertexColors[i+12] = colors[3][0]
            vertexColors[i+13] = colors[3][1]
            vertexColors[i+14] = colors[3][2]

            // sixth vertex
            vertexColors[i+15] = colors[0][0]
            vertexColors[i+16] = colors[0][1]
            vertexColors[i+17] = colors[0][2]
        }
    }

    const vertexNormals = new Float32Array(cube.verts.length)

    makeNormals()
    function makeNormals() {
        const normals = [
            [0,0,1, ], // front face
            [-1,0,0, ], // left face
            [1,0,0,], // right face
            [0,0,-1,], // back face
            [0,-1,0, ], // top face
            [0,1,0,], // bottom face
        ]

        for (let side=0, i=0, l=cube.verts.length; i<l; i+=6*3, side+=1) { // 6 vertices per side, 3 numbers per vertex normal
            console.log('side:', side)

            // first vertex
            vertexNormals[i+0]  = normals[side][0]
            vertexNormals[i+1]  = normals[side][1]
            vertexNormals[i+2]  = normals[side][2]

            // second vertex
            vertexNormals[i+3]  = normals[side][0]
            vertexNormals[i+4]  = normals[side][1]
            vertexNormals[i+5]  = normals[side][2]

            // third vertex
            vertexNormals[i+6]  = normals[side][0]
            vertexNormals[i+7]  = normals[side][1]
            vertexNormals[i+8]  = normals[side][2]

            // fourth vertex
            vertexNormals[i+9]  = normals[side][0]
            vertexNormals[i+10] = normals[side][1]
            vertexNormals[i+11] = normals[side][2]

            // fifth vertex
            vertexNormals[i+12] = normals[side][0]
            vertexNormals[i+13] = normals[side][1]
            vertexNormals[i+14] = normals[side][2]

            // sixth vertex
            vertexNormals[i+15] = normals[side][0]
            vertexNormals[i+16] = normals[side][1]
            vertexNormals[i+17] = normals[side][2]
        }
    }

    const colorsBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW)

    // Tell the attribute how to get data out of vertexBuffer (ARRAY_BUFFER)
    const colorSize = 3;          // 2 components per iteration
    const colorType = gl.FLOAT;   // the data is 32bit floats
    const normalizeColorData = false; // don't normalize the data
    const colorStride = 0;        // 0 = move forward colorSize * sizeof(colorType) each iteration to get the next vertex
    const colorOffset = 0;        // start at the beginning of the buffer
    const colorAttributeLocation = gl.getAttribLocation(program, 'color')
    gl.enableVertexAttribArray(colorAttributeLocation)
    gl.vertexAttribPointer(
        colorAttributeLocation, colorSize, colorType, normalizeColorData, colorStride, colorOffset)

    const normalsBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW)

    // Tell the attribute how to get data out of vertexBuffer (ARRAY_BUFFER)
    const normalSize = 3;          // 2 components per iteration
    const normalType = gl.FLOAT;   // the data is 32bit floats
    const normalizeNormalsData = false; // don't normalize the data
    const normalStride = 0;        // 0 = move forward normalSize * sizeof(normalType) each iteration to get the next vertex
    const normalOffset = 0;        // start at the beginning of the buffer
    const normalAttributeLocation = gl.getAttribLocation(program, 'normal')
    gl.enableVertexAttribArray(normalAttributeLocation)
    gl.vertexAttribPointer(
        normalAttributeLocation, normalSize, normalType, normalizeNormalsData, normalStride, normalOffset)

    // cull_face doesn't work, because I've drawn my vertices in the wrong
    // order. They should be clockwise to be front facing (I seem to have done
    // them counter-clockwise). See "CULL_FACE" at
    // https://webglfundamentals.org/webgl/lessons/webgl-3d-orthographic.html
    //gl.enable(gl.CULL_FACE)

    // enables depth sorting, so pixels aren't drawn in order of appearance, but order only if they are visible (on top of other pixels).
    gl.enable(gl.DEPTH_TEST)

    const angle  = {theta: 0}
    const origin = [0.5, 0.5, 0.5]

    const originMatrix      = m4.translation(cube.width * origin[0], -cube.width * origin[1], -cube.width * origin[2])
    const scaleMatrix       = m4.scaling(1,1,1)
    let   zRotationMatrix   = m4.zRotation(angle.theta)
    let   yRotationMatrix   = m4.yRotation(angle.theta)
    const translationMatrix = m4.translation(0, 0, 0)

    let projectionMatrix

    updateResolution()
    function updateResolution() {
        const resolution = [
            parseFloat(getComputedStyle(gl.canvas).width) * window.devicePixelRatio,
            parseFloat(getComputedStyle(gl.canvas).height) * window.devicePixelRatio,
            1000,
        ]

        setGlResolution(gl, ...resolution)
        projectionMatrix = m4.perspective(45, resolution[0] / resolution[1], 1, 2000)
    }

    // TODO: watch parent size instead of window.
    window.addEventListener('resize', () => {
        updateResolution()
    })

    const tween = new TWEEN.Tween(angle)
        .to({theta: 360}, 20000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .start()

    const worldViewProjectionMatrixLocation = gl.getUniformLocation(program, 'worldViewProjectionMatrix')
    const worldInverseTransposeMatrixLocation = gl.getUniformLocation(program, 'worldInverseTransposeMatrix')
    const reverseLightDirectionLocation = gl.getUniformLocation(program, 'reverseLightDirection')
    gl.uniform3fv(reverseLightDirectionLocation, v3.normalize([0.5, 0.7, 1]))


    window.cameraAngle = 0
    window.cameraRadius   = 500
    window.rootRotationY = 0
    window.rootRotationX = 0

    window.zpos = 0
    ~function draw(time) {
        tween.update(time)

        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) // why do we need to do this?

        zRotationMatrix = m4.zRotation(angle.theta)
        yRotationMatrix = m4.yRotation(angle.theta)

        //cameraAngle++
        let cameraMatrix  = m4.identity
        cameraMatrix      = m4.multiply(cameraMatrix, m4.yRotation(cameraAngle))
        cameraMatrix      = m4.multiply(cameraMatrix, m4.translation(0, 0, cameraRadius * 1.5))
        const viewMatrix  = m4.inverse(cameraMatrix)

        const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)

        let worldMatrix = m4.identity

        // Node (root object)
        //
        // place everything where we want it near the center. the new
        // projectionMatrix puts the X andY origin in the center of the screen,
        // and Z is 0 at the screen and goes  negative away from the screen.
        worldMatrix = m4.multiply(worldMatrix, m4.translation(0, 0, zpos))
        //rootRotationY++
        worldMatrix = m4.multiply(worldMatrix, m4.yRotation(rootRotationY))
        worldMatrix = m4.multiply(worldMatrix, m4.xRotation(rootRotationX))

        // Node > Node
        //
        // matrix math is written in the opposite direction now, so that we can
        // apply the previous projection matrix only once, before all
        // drawArrays calls. For each matrix applied, think of them as happening
        // from the lastone to the first one.
        worldMatrix = m4.multiply(worldMatrix, translationMatrix)
        worldMatrix = m4.multiply(worldMatrix, zRotationMatrix)
        worldMatrix = m4.multiply(worldMatrix, yRotationMatrix)
        worldMatrix = m4.multiply(worldMatrix, scaleMatrix)
        worldMatrix = m4.multiply(worldMatrix, originMatrix)

        // for correct lighting normals
        const worldInverseTransposeMatrix = m4.transpose(m4.inverse(worldMatrix))
        gl.uniformMatrix4fv(worldInverseTransposeMatrixLocation, false, worldInverseTransposeMatrix)

        const worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, worldMatrix)
        gl.uniformMatrix4fv(worldViewProjectionMatrixLocation, false, worldViewProjectionMatrix)

        gl.drawArrays(gl.TRIANGLES, offset, count)

        for (let i = 0; i < 5; ++i) {
            // Node > Node > Node
            worldMatrix = m4.multiply(worldMatrix, translationMatrix)
            worldMatrix = m4.multiply(worldMatrix, zRotationMatrix)
            worldMatrix = m4.multiply(worldMatrix, yRotationMatrix)
            worldMatrix = m4.multiply(worldMatrix, scaleMatrix)
            worldMatrix = m4.multiply(worldMatrix, originMatrix)

            // for correct lighting normals
            const worldInverseTransposeMatrix = m4.transpose(m4.inverse(worldMatrix))
            gl.uniformMatrix4fv(worldInverseTransposeMatrixLocation, false, worldInverseTransposeMatrix)

            const worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, worldMatrix)
            gl.uniformMatrix4fv(worldViewProjectionMatrixLocation, false, worldViewProjectionMatrix)

            gl.drawArrays(gl.TRIANGLES, offset, count)
        }

        requestAnimationFrame(draw)
    }()
}
