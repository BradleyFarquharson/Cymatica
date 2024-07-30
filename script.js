document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('cymaticCanvas');
    const ctx = canvas.getContext('2d');

    let frequency = 440;
    let amplitude = 50;
    let damping = 0.95;
    let resolution = 1000; // Starting resolution at 1000
    let scaleFactor = 10; // Scale factor for canvas transformation
    let time = 0;

    let particles;
    const width = canvas.width;
    const height = canvas.height;

    // Initialize particles using Float32Array for performance
    const initParticles = () => {
        particles = new Float32Array(resolution * resolution * 2);
        for (let i = 0; i < resolution; i++) {
            for (let j = 0; j < resolution; j++) {
                const index = (i * resolution + j) * 2;
                particles[index] = (i / resolution) * width;
                particles[index + 1] = (j / resolution) * height;
            }
        }
    };

    // Update particles based on the wave equation
    const updateParticles = () => {
        const k = 2 * Math.PI * frequency / 343; // Wave number (speed of sound ~343 m/s)
        for (let i = 0; i < resolution; i++) {
            for (let j = 0; j < resolution; j++) {
                const index = (i * resolution + j) * 2;
                const x = particles[index];
                const y = particles[index + 1];
                const dx = x - width / 2;
                const dy = y - height / 2;
                const r = Math.sqrt(dx * dx + dy * dy);
                const displacement = amplitude * Math.sin(k * r - frequency * time) * Math.exp(-damping * r);
                particles[index] = x + displacement * (dx / (r || 1)); // Adjust for zero distance
                particles[index + 1] = y + displacement * (dy / (r || 1));
            }
        }
    };

    // Draw particles on the canvas with transformation
    const drawParticles = () => {
        ctx.clearRect(0, 0, width, height); // Clear the canvas
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height); // Set the background to black
        ctx.translate(width / 2, height / 2); // Move origin to the center
        ctx.scale(scaleFactor, scaleFactor); // Scale up the pattern
        ctx.translate(-width / 2, -height / 2); // Move origin back

        ctx.fillStyle = 'white';
        for (let i = 0; i < resolution; i++) {
            for (let j = 0; j < resolution; j++) {
                const index = (i * resolution + j) * 2;
                ctx.fillRect(particles[index], particles[index + 1], 1, 1); // Adjusted particle size
            }
        }

        ctx.restore();
    };

    // Animation loop
    const animate = () => {
        updateParticles();
        drawParticles();
        time += 0.01;
        requestAnimationFrame(animate);
    };

    // Event listeners for sliders
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

    // Initialize and start the animation
    initParticles();
    animate();
});

