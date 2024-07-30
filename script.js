document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('#threejs-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const geometry = new THREE.PlaneBufferGeometry(20, 20, 100, 100);
    const material = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent,
        uniforms: {
            uFrequency: { value: 440.0 },
            uAmplitude: { value: 1.0 },
            uDamping: { value: 0.05 },
            uTime: { value: 0.0 }
        }
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const controls = {
        frequency: document.querySelector('#frequency'),
        amplitude: document.querySelector('#amplitude'),
        damping: document.querySelector('#damping')
    };

    controls.frequency.addEventListener('input', (event) => {
        material.uniforms.uFrequency.value = event.target.value;
    });

    controls.amplitude.addEventListener('input', (event) => {
        material.uniforms.uAmplitude.value = event.target.value;
    });

    controls.damping.addEventListener('input', (event) => {
        material.uniforms.uDamping.value = event.target.value;
    });

    function animate() {
        material.uniforms.uTime.value += 0.05;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
});

    });

    controls.damping.addEventListener('input', (event) => {
        material.uniforms.uDamping.value = event.target.value;
    });

    function animate() {
        material.uniforms.uTime.value += 0.05;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
});

