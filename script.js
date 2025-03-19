let chicken = document.getElementById('chicken');
let obstacle = document.getElementById('obstacle');
let isJumping = false;

async function startGame() {
    // Request microphone access
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        // Game loop
        function checkVolume() {
            analyser.getByteFrequencyData(dataArray);
            let volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

            // Jump if volume is loud enough
            if (volume > 50 && !isJumping) { // Adjust threshold as needed
                jumpChicken(volume);
            }

            // Collision detection
            if (isColliding()) {
                alert("Bawk! You hit the fence!");
                obstacle.style.animation = 'none'; // Stop obstacle
            }

            requestAnimationFrame(checkVolume);
        }

        checkVolume();
    } catch (err) {
        console.error("Microphone access denied:", err);
        alert("Please allow microphone access to play!");
    }
}

function jumpChicken(volume) {
    isJumping = true;
    chicken.classList.add('jump');
    
    // Scale jump height with volume (capped for simplicity)
    let jumpHeight = Math.min(volume * 2, 300); // Adjust multiplier as needed
    chicken.style.bottom = `${jumpHeight}px`;

    // Play cluck sound (you’d need an audio file or generate it)
    // let cluck = new Audio('cluck.mp3');
    // cluck.play();

    setTimeout(() => {
        chicken.classList.remove('jump');
        chicken.style.bottom = '20px';
        isJumping = false;
    }, 500); // Jump duration
}

function isColliding() {
    const chickenRect = chicken.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    return (
        chickenRect.right > obstacleRect.left &&
        chickenRect.left < obstacleRect.right &&
        chickenRect.bottom > obstacleRect.top &&
        chickenRect.top < obstacleRect.bottom
    );
}