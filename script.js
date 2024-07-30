document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('threejs-container');

  if (!container) {
    console.error('Three.js container not found');
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform float uFrequency;
    uniform float uAmplitude;
    uniform float uDamping;
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

  const uniforms = {
    uTime: { value: 0.0 },
    uFrequency: { value: 440.0 },
    uAmplitude: { value: 50.0 },
    uDamping: { value: 0.95 }
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  camera.position.z = 1;

  function animate(time) {
    uniforms.uTime.value = time * 0.001;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  function updateUniforms() {
    uniforms.uFrequency.value = parseFloat(document.getElementById('frequency').value);
    uniforms.uAmplitude.value = parseFloat(document.getElementById('amplitude').value);
    uniforms.uDamping.value = parseFloat(document.getElementById('damping').value);
  }

  document.getElementById('frequency').addEventListener('input', () => {
    const frequencyValueElement = document.getElementById('frequencyValue');
    if (frequencyValueElement) {
      frequencyValueElement.textContent = document.getElementById('frequency').value;
    }
    updateUniforms();
  });

  document.getElementById('amplitude').addEventListener('input', () => {
    const amplitudeValueElement = document.getElementById('amplitudeValue');
    if (amplitudeValueElement) {
      amplitudeValueElement.textContent = document.getElementById('amplitude').value;
    }
    updateUniforms();
  });

  document.getElementById('damping').addEventListener('input', () => {
    const dampingValueElement = document.getElementById('dampingValue');
    if (dampingValueElement) {
      dampingValueElement.textContent = document.getElementById('damping').value;
    }
    updateUniforms();
  });

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
});

