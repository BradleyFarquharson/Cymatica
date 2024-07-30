document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('cymaticCanvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert("WebGL isn't available");
        return;
    }

    let frequency = 440;
    let amplitude = 50;
    let damping = 0.95;
    let resolution = 1000;
    let time = 0;

    const vertexShaderSource = `
        attribute vec2 a_position;
        uniform float u_time;
        uniform float u_frequency;
        uniform float u_amplitude;
        uniform float u_damping;
        uniform vec2 u_resolution;

        void main() {
            float k = 2.0 * 3.141592653589793 * u_frequency / 343.0;
            float dx = a_position.x - u_resolution.x / 2.0;
            float dy = a_position.y - u_resolution.y / 2.0;
            float r = sqrt(dx * dx + dy * dy);
            float displacement = u_amplitude * sin(k * r - u_frequency * u_time) * exp(-u_damping * r);
            vec2 position = a_position + displacement * normalize(vec2(dx, dy));
            gl_Position = vec4((position / u_resolution * 2.0 - 1.0) * vec2(1, -1), 0, 1);
            gl_PointSize = 1.0;
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const frequencyLocation = gl.getUniformLocation(program, 'u_frequency');
    const amplitudeLocation = gl.getUniformLocation(program, 'u_amplitude');
    const dampingLocation = gl.getUniformLocation(program, 'u_damping');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    function initParticles() {
        const positions = new Float32Array(resolution * resolution * 2);
        for (let i = 0; i < resolution; i++) {
            for (let j = 0; j < resolution; j++) {
                const index = (i * resolution + j) * 2;
                positions[index] = (i / resolution) * gl.canvas.width;
                positions[index + 1] = (j / resolution) * gl.canvas.height;
            }
        }
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    }

    initParticles();

    function draw() {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniform1f(timeLocation, time);
        gl.uniform1f(frequencyLocation, frequency);
        gl.uniform1f(amplitudeLocation, amplitude);
        gl.uniform1f(dampingLocation, damping);
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        gl.drawArrays(gl.POINTS, 0, resolution * resolution);

        time += 0.01;
        requestAnimationFrame(draw);
    }

    draw();

    document.getElementById('frequency').addEventListener('input', (e) => {
        frequency = parseFloat(e.target.value);
        document.getElementById('frequencyValue').textContent = frequency;
    });

    document.getElementById('amplitude').addEventListener('input', (e) => {
        amplitude = parseFloat(e.target.value);
        document.getElementById('amplitudeValue').textContent = amplitude;
    });

    document.getElementById('damping').addEventListener('input', (e) => {
        damping = parseFloat(e.target.value);
        document.getElementById('dampingValue').textContent = damping.toFixed(2);
    });

    document.getElementById('resolution').addEventListener('input', (e) => {
        resolution = parseInt(e.target.value);
        document.getElementById('resolutionValue').textContent = resolution;
        initParticles(); // Reinitialize particles when resolution changes
    });

    window.addEventListener('resize', () => {
        gl.canvas.width = gl.canvas.clientWidth;
        gl.canvas.height = gl.canvas.clientHeight;
        initParticles();
    });

    gl.canvas.width = gl.canvas.clientWidth;
    gl.canvas.height = gl.canvas.clientHeight;
});

