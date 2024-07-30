document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('threejs-container');
    if (!container) {
        console.error('Three.js container not found');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
        uFrequency: { value: 440.0 },
        uAmplitude: { value: 50.0 },
        uDamping: { value: 0.95 },
        uTime: { value: 0.0 }
    };

    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform float uFrequency;
        uniform float uAmplitude;
        uniform float uDamping;
        uniform float uTime;
        varying vec2 vUv;
        void main() {
            float x = vUv.x * 10.0 - 5.0;
            float y = vUv.y * 10.0 - 5.0;
            float r = sqrt(x * x + y * y);
            float wave = sin(uFrequency * r - uTime) * exp(-uDamping * r);
            float intensity = (wave + 1.0) / 2.0 * uAmplitude;
            gl_FragColor = vec4(vec3(intensity), 1.0);
        }
    `;

    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    camera.position.z = 1;

    const animate = () => {
        requestAnimationFrame(animate);
        uniforms.uTime.value += 0.01; // Slower animation speed
        renderer.render(scene, camera);
    };
    animate();

    const frequencySlider = document.getElementById('frequency');
    const amplitudeSlider = document.getElementById('amplitude');
    const dampingSlider = document.getElementById('damping');

    frequencySlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        uniforms.uFrequency.value = value;
        document.getElementById('frequencyValue').textContent = value;
    });

    amplitudeSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        uniforms.uAmplitude.value = value;
        document.getElementById('amplitudeValue').textContent = value;
    });

    dampingSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        uniforms.uDamping.value = value;
        document.getElementById('dampingValue').textContent = value.toFixed(2);
    });
});

