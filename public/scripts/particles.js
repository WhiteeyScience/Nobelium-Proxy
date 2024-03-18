document.addEventListener("DOMContentLoaded", function () {
    const particleContainer = document.getElementById("particle-container");

    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particleContainer.appendChild(particle);

        // Set initial position
        particle.style.left = Math.random() * 100 + "vw";
        particle.style.animationDuration = Math.random() * 2 + 1 + "s";

        // Set random rotation
        particle.style.transform = `rotate(${Math.random() * 360}deg)`;
    }
});
