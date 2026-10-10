// Game state
let score = 0;
let gameActive = false;
let isPaused = false;
let audioContext = null;
let isMuted = false;
let balloons = [];
let lastTime = 0;
let spawnTimer = 0;

// Game settings that ramp up with score
let baseSpeed = 60; // pixels per second
let spawnInterval = 1500; // milliseconds

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const playButton = document.getElementById('play-button');
const muteButton = document.getElementById('mute-button');
const pauseButton = document.getElementById('pause-button');

// Balloon colors
const balloonColors = [
    '#FF6B9D', '#C06C84', '#6C5B7B', '#355C7D',
    '#F67280', '#C06C84', '#6C5B7B', '#99B898',
    '#FECEAB', '#FF847C', '#E84A5F', '#2A363B',
    '#FFD93D', '#6BCF7F', '#4D96FF', '#FF6B9D'
];

// Initialize audio on first user gesture
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

// Generate pop sound using Web Audio API
function playPopSound() {
    if (isMuted || !audioContext) return;
    
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1);
    
    gainNode.gain.setValueAtValue(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    oscillator.start(now);
    oscillator.stop(now + 0.1);
}

// Create balloon SVG
function createBalloonSVG(color, size) {
    const svg = `
        <svg width="${size}" height="${size * 1.2}" viewBox="0 0 100 120">
            <defs>
                <radialGradient id="grad-${color.substring(1)}" cx="35%" cy="35%">
                    <stop offset="0%" style="stop-color:white;stop-opacity:0.6" />
                    <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
                </radialGradient>
            </defs>
            <ellipse cx="50" cy="45" rx="35" ry="40" fill="url(#grad-${color.substring(1)})" stroke="${color}" stroke-width="2"/>
            <path d="M 50 85 Q 52 95, 50 100" stroke="${color}" stroke-width="2" fill="none"/>
            <line x1="50" y1="100" x2="50" y2="120" stroke="#666" stroke-width="1"/>
        </svg>
    `;
    return svg;
}

// Create a balloon
function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    
    const size = 60 + Math.random() * 40; // 60-100px
    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    const x = Math.random() * (window.innerWidth - size);
    
    balloon.innerHTML = createBalloonSVG(color, size);
    balloon.style.left = x + 'px';
    balloon.style.bottom = -size + 'px';
    balloon.style.width = size + 'px';
    balloon.style.height = (size * 1.2) + 'px';
    
    const balloonData = {
        element: balloon,
        x: x,
        y: -size,
        size: size,
        speed: getCurrentSpeed(),
        popped: false
    };
    
    // Use Pointer Events for both mouse and touch
    balloon.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (!balloonData.popped && gameActive && !isPaused) {
            popBalloon(balloonData);
        }
    });
    
    gameArea.appendChild(balloon);
    balloons.push(balloonData);
}

// Get current speed based on score
function getCurrentSpeed() {
    const speedMultiplier = 1 + Math.floor(score / 10) * 0.3;
    return baseSpeed * Math.min(speedMultiplier, 3); // Cap at 3x speed
}

// Get current spawn interval based on score
function getCurrentSpawnInterval() {
    const intervalReduction = Math.floor(score / 10) * 200;
    return Math.max(spawnInterval - intervalReduction, 500); // Min 500ms
}

// Pop balloon
function popBalloon(balloonData) {
    if (balloonData.popped) return;
    
    balloonData.popped = true;
    score++;
    updateScore();
    
    playPopSound();
    createParticles(balloonData);
    
    // Animate balloon pop
    balloonData.element.style.transition = 'all 0.2s ease-out';
    balloonData.element.style.transform = 'scale(1.3)';
    balloonData.element.style.opacity = '0';
    
    setTimeout(() => {
        if (balloonData.element.parentNode) {
            balloonData.element.remove();
        }
        const index = balloons.indexOf(balloonData);
        if (index > -1) {
            balloons.splice(index, 1);
        }
    }, 200);
}

// Create particle effect
function createParticles(balloonData) {
    const particleCount = 8;
    const rect = balloonData.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.backgroundColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 100 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        animateParticle(particle, vx, vy);
    }
}

// Animate particle
function animateParticle(particle, vx, vy) {
    let x = parseFloat(particle.style.left);
    let y = parseFloat(particle.style.top);
    let opacity = 1;
    let life = 0;
    
    function update() {
        life += 16;
        x += vx * 0.016;
        y += vy * 0.016;
        vy += 300 * 0.016; // gravity
        opacity -= 0.02;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.opacity = opacity;
        
        if (opacity > 0 && life < 1000) {
            requestAnimationFrame(update);
        } else {
            particle.remove();
        }
    }
    
    update();
}

// Update score display
function updateScore() {
    scoreDisplay.textContent = score;
    scoreDisplay.classList.add('bump');
    setTimeout(() => scoreDisplay.classList.remove('bump'), 300);
}

// Game loop
function gameLoop(timestamp) {
    if (!gameActive || isPaused) {
        lastTime = timestamp;
        requestAnimationFrame(gameLoop);
        return;
    }
    
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    // Spawn balloons
    spawnTimer += deltaTime;
    if (spawnTimer >= getCurrentSpawnInterval()) {
        createBalloon();
        spawnTimer = 0;
    }
    
    // Update balloon positions
    balloons.forEach(balloon => {
        if (!balloon.popped) {
            balloon.y += balloon.speed * (deltaTime / 1000);
            balloon.element.style.bottom = balloon.y + 'px';
            
            // Remove if off screen
            if (balloon.y > window.innerHeight + balloon.size) {
                balloon.element.remove();
                const index = balloons.indexOf(balloon);
                if (index > -1) {
                    balloons.splice(index, 1);
                }
            }
        }
    });
    
    requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    initAudio();
    
    score = 0;
    balloons = [];
    spawnTimer = 0;
    isPaused = false;
    gameActive = true;
    
    updateScore();
    
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    
    // Clear any existing balloons
    gameArea.innerHTML = '';
    
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

// Toggle pause
function togglePause() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? '▶️' : '⏸️';
}

// Toggle mute
function toggleMute() {
    isMuted = !isMuted;
    muteButton.textContent = isMuted ? '🔇 Sound OFF' : '🔊 Sound ON';
}

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden && gameActive) {
        isPaused = true;
        pauseButton.textContent = '▶️';
    }
});

// Handle resize
window.addEventListener('resize', () => {
    // Remove balloons that might be off screen after resize
    balloons = balloons.filter(balloon => {
        if (parseFloat(balloon.element.style.left) > window.innerWidth) {
            balloon.element.remove();
            return false;
        }
        return true;
    });
});

// Event listeners
playButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', togglePause);
muteButton.addEventListener('click', toggleMute);

// Prevent context menu on long press
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
