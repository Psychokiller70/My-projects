document.getElementById('colorButton').addEventListener('click', function(event) {
    let splash = document.getElementById('colorSplashEffect');
    splash.style.display = 'block';

    // Get random color from a palette
    let colors = ['#FF6347', '#FFD700', '#32CD32', '#1E90FF', '#8A2BE2', '#FF1493'];
    let randomColor = colors[Math.floor(Math.random() * colors.length)];

    // Create multiple "splashes" at random positions on the screen
    for (let i = 0; i < 10; i++) {
        let splashCircle = document.createElement('div');
        splashCircle.classList.add('splashCircle');
        splashCircle.style.backgroundColor = randomColor;

        // Randomize position of splash
        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight;

        // Set splash position and size
        splashCircle.style.left = `${x}px`;
        splashCircle.style.top = `${y}px`;
        splashCircle.style.width = `${Math.random() * 100 + 50}px`;
        splashCircle.style.height = splashCircle.style.width;

        splash.appendChild(splashCircle);

        // Remove splash after animation
        setTimeout(function() {
            splashCircle.remove();
        }, 1000);
    }

    // Remove the effect from the screen after a while
    setTimeout(function() {
        splash.style.display = 'none';
    }, 1500);  // 1.5 seconds
});
