import log from '../../../utils/log';

const vertex = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    vUv = uv;
    gl_Position = vec4(position, 1.0, 1.0);
  }
`;

const fragment = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  varying vec2 vUv;
  uniform float rows;

  void main() {
    vec2 st = fract(vUv * rows);
    float d1 = step(st.x, 0.9);
    float d2 = step(0.1, st.y);
    gl_FragColor.rgb = mix(vec3(0.8), vec3(1.0), d1 * d2);
    gl_FragColor.a = 1.0;
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type); // 创建着色器对象
  gl.shaderSource(shader, source); // 提供数据源
  gl.compileShader(shader); // 编译 -> 生成着色器

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // 编译出错，打印错误信息
    const info = gl.getShaderInfoLog(shader);
    log.log('shader info log', info);
    gl.deleteShader(shader);
    throw new Error(`could not compile WebGL shader. \n\n ${info}`);
  }

  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    log.log('program info log', info);
    gl.deleteProgram(program);
    throw new Error(`could not create WebGL program. \n\n ${info}`);
  }

  return program;
}

export class Board {
  constructor(el, options) {
    this.el = el;
    this.options = options;
    this.gl = this.el.getContext('webgl');
    log.log('gl viewport', this.gl.getParameter(this.gl.VIEWPORT));
    this.gl.viewport(0, 0, this.el.width, this.el.height);
    this.draw();
  }

  draw() {
    // 创建 program
    const gl = this.gl;
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);

    const program = createProgram(gl, vertexShader, fragmentShader);

    // 数据到缓冲区
    const cells = new Uint16Array([0, 1, 2, 2, 0, 3]);
    const cellsB = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cellsB);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cells, gl.STATIC_DRAW);

    // 缓冲区到 GPU
    const points = new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]);
    const pointesB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointesB);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
    const vPosition = gl.getAttribLocation(program, 'position');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    const uv = new Float32Array([0, 0, 0, 1, 1, 1, 1, 0]);
    const uvB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvB);
    gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);
    const vUv = gl.getAttribLocation(program, 'uv');
    gl.vertexAttribPointer(vUv, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vUv);

    gl.useProgram(program);
    const vRows = gl.getUniformLocation(program, 'rows');
    gl.uniform1f(vRows, 64);
    // 执行着色器完成绘制
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
  }
}
