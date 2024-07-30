uniform float uTime;
uniform sampler2D uVelocity;
uniform sampler2D uPressure;
varying vec2 vUv;

void main() {
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  vec2 pressure = texture2D(uPressure, vUv).xy;

  // Compute new velocity and pressure using Navier-Stokes equations
  // Simplified example: u = u + dt * (Nabla(u) + F)
  vec2 newVelocity = velocity + 0.01 * (pressure - velocity);

  gl_FragColor = vec4(newVelocity, 0.0, 1.0);
}
