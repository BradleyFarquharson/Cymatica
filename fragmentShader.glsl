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

