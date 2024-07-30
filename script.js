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
    uniform sampler2D uVelocity;
    uniform sampler2D uPressure;
    varying vec2 vUv;

    void main() {
      vec2 velocity = texture2D(uVelocity, vUv).xy;
      vec2 pressure = texture2D(uPressure, vUv).xy;

      // Compute new velocity and pressure using Navier-Stokes equations
      vec2 newVelocity = velocity + 0.01 * (pressure - velocity);

      gl_FragColor = vec4(newVelocity, 0.0, 1.0);
    }
  `;

  const uniforms = {
    uTime: { value: 0.0 },
    uVelocity: { value: null },
    uPressure: { value: null }
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
    // Update uniform values based on user input
    // This function can be expanded to include more uniforms
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

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
});

