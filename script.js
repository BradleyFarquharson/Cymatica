document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('threejs-container');
    if (!container) {
        console.error('Three.js container not found');
        return;
    }
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    let frequency = 440;
    let amplitude = 50;
    let damping = 0.95;
    let resolution = 1000;
    let time = 0;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(resolution * resolution * 3);
    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            const index = (i * resolution + j) * 3;
            positions[index] = (i / resolution) * 2 - 1;
            positions[index + 1] = (j / resolution) * 2 - 1;
            positions[index + 2] = 0;
        }
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.01 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 2;

    function updateParticles() {
        const positions = geometry.attributes.position.array;
        const k = 2 * Math.PI * frequency / 343; // Wave number (speed of sound ~343 m/s)
        for (let i = 0; i < resolution; i++) {
            for (let j = 0; j < resolution; j++) {
                const index = (i * resolution + j) * 3;
                const dx = positions[index];
                const dy = positions[index + 1];
                const r = Math.sqrt(dx * dx + dy * dy);
                const displacement = amplitude * Math.sin(k * r - frequency * time) * Math.exp(-damping * r);
                positions[index + 2] = displacement;
            }
        }
        geometry.attributes.position.needsUpdate = true;
    }

    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;
        updateParticles();
        renderer.render(scene, camera);
    }

    animate();

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
        const newPositions = new Float32Array(resolution * resolution * 3);
        for (let i = 0; i < resolution; i++) {
            for (let j = 0; j < resolution; j++) {
                const index = (i * resolution + j) * 3;
                newPositions[index] = (i / resolution) * 2 - 1;
                newPositions[index + 1] = (j / resolution) * 2 - 1;
                newPositions[index + 2] = 0;
            }
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});

