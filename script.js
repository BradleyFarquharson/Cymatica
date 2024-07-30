document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('threejs-container');

  if (!container) {
    console.error('Three.js container not found');
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    uniforms: {
      uFrequency: { value: 440.0 },
      uAmplitude: { value: 0.5 },
      uDamping: { value: 0.95 },
      uTime: { value: 0.0 }
    }
  });

  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
  camera.position.z = 1;

  let lastTime = 0;

  function animate(time) {
    const delta = time - lastTime;
    lastTime = time;

    material.uniforms.uTime.value += delta * 0.001;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  function updateUniforms() {
    material.uniforms.uFrequency.value = parseFloat(document.getElementById('frequency').value);
    material.uniforms.uAmplitude.value = parseFloat(document.getElementById('amplitude').value) / 100;
    material.uniforms.uDamping.value = parseFloat(document.getElementById('damping').value);
  }

  document.getElementById('frequency').addEventListener('input', () => {
    document.getElementById('frequencyValue').textContent = document.getElementById('frequency').value;
    updateUniforms();
  });

  document.getElementById('amplitude').addEventListener('input', () => {
    document.getElementById('amplitudeValue').textContent = document.getElementById('amplitude').value;
    updateUniforms();
  });

  document.getElementById('damping').addEventListener('input', () => {
    document.getElementById('dampingValue').textContent = document.getElementById('damping').value;
    updateUniforms();
  });

  document.getElementById('resolution').addEventListener('input', () => {
    document.getElementById('resolutionValue').textContent = document.getElementById('resolution').value;
    // Regenerate particles based on new resolution
  });

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
});

