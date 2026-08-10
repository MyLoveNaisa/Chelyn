
// --- Web Audio API Engine ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// 1. playPop() — efek pop pendek dan cute
function playPop() {
    initAudioContext();
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
}

// 2. playEnvelope() — efek opening/notification yang lembut
function playEnvelope() {
    initAudioContext();
    if (!audioCtx) return;
    
    const notes = [440, 554.37, 659.25]; // A4, C#5, E5 (Chime lembut)
    notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'triangle';
        osc.frequency.value = freq;
        
        const startTime = audioCtx.currentTime + index * 0.08;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        
        osc.start(startTime);
        osc.stop(startTime + 0.4);
    });
}

// 3. playWin() — jingle kemenangan singkat dan ceria
function playWin() {
    initAudioContext();
    if (!audioCtx) return;
    
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        const startTime = audioCtx.currentTime + index * 0.1;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        
        osc.start(startTime);
        osc.stop(startTime + 0.3);
    });
}

// 4. playLose() — efek gagal yang lucu
function playLose() {
    initAudioContext();
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(350, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(150, audioCtx.currentTime + 0.4);
    
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
}

// --- BGM Management (assets/bgm.mp3) ---
const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('musicToggle');
let isMusicPlaying = false;

musicBtn.addEventListener('click', () => {
    initAudioContext();
    if (isMusicPlaying) {
        bgm.pause();
        musicBtn.textContent = '🎵 Play Music';
        isMusicPlaying = false;
    } else {
        bgm.play().then(() => {
            musicBtn.textContent = '⏸ Pause';
            isMusicPlaying = true;
        }).catch(err => {
            console.log("BGM play error:", err);
            musicBtn.textContent = '🎵 Error BGM';
        });
    }
});

// --- Particles Background ---
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        let p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = Math.random() * 100 + 'vw';
        p.style.width = Math.random() * 4 + 1 + 'px';
        p.style.height = p.style.width;
        p.style.animationDuration = Math.random() * 10 + 5 + 's';
        p.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(p);
    }
}
createParticles();

// --- Scene Management ---
function nextScene(sceneId) {
    playPop();
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    document.getElementById('scene' + sceneId).classList.add('active');
    triggerSceneAnimations(sceneId);
}

function triggerSceneAnimations(sceneId) {
    if (sceneId === 2) {
        setTimeout(() => document.getElementById('s2-text1').classList.add('show'), 500);
        setTimeout(() => document.getElementById('s2-text2').classList.add('show'), 2000);
        setTimeout(() => document.getElementById('s2-text3').classList.add('show'), 3500);
        setTimeout(() => document.getElementById('s2-btn').classList.add('show'), 4500);
    }
    else if (sceneId === 4) {
        setTimeout(() => document.getElementById('s4-intro').classList.add('show'), 500);
        setTimeout(() => typeStory(), 2500);
    }
    else if (sceneId === 5) {
        const anims = document.querySelectorAll('.s5-anim');
        setTimeout(() => anims[0].classList.add('show'), 500);
        setTimeout(() => { anims[1].classList.add('show'); document.getElementById('chibi-panic').classList.add('show'); }, 2000);
        setTimeout(() => anims[2].classList.add('show'), 4000);
        setTimeout(() => document.getElementById('s5-btn').classList.add('show'), 5000);
    }
    else if (sceneId === 6) {
        const anims = document.querySelectorAll('.s6-anim');
        anims.forEach((el, index) => {
            setTimeout(() => el.classList.add('show'), 800 * index + 500);
        });
        setTimeout(() => document.getElementById('s6-btn').classList.add('show'), 800 * anims.length + 1000);
    }
    else if (sceneId === 7) {
        document.body.style.background = '#050810';
        const anims = document.querySelectorAll('.s7-anim');
        setTimeout(() => anims[0].classList.add('show'), 1000);
        setTimeout(() => anims[1].classList.add('show'), 3000);
        setTimeout(() => anims[2].classList.add('show'), 5000);
        setTimeout(() => anims[3].classList.add('show'), 6500);
        setTimeout(() => document.getElementById('s7-btn').classList.add('show'), 8000);
    }
}

// --- Scene 1: Envelope ---
setTimeout(() => document.getElementById('s1-text1').classList.add('show'), 1000);
setTimeout(() => document.getElementById('s1-text2').classList.add('show'), 3000);
setTimeout(() => document.getElementById('envelope-container').classList.add('show-flex'), 4500);

function openEnvelope() {
    playEnvelope(); // Call required playEnvelope()
    document.getElementById('envelope').classList.add('open');
    setTimeout(() => nextScene(2), 1500);
}

// --- Scene 3: Mini Game ---
let score = 0;
let timeLeft = 15;
let gameTimer;
let heartSpawner;
const MAX_HEARTS = 20;

function startGame() {
    playPop();
    document.getElementById('game-intro').classList.remove('show');
    document.getElementById('game-intro').style.display = 'none';
    document.getElementById('game-win').classList.remove('show');
    document.getElementById('game-lose').classList.remove('show');
    
    document.getElementById('game-play').classList.add('show');
    
    score = 0;
    timeLeft = 15;
    updateGameUI();
    document.getElementById('game-area').innerHTML = '';

    gameTimer = setInterval(() => {
        timeLeft--;
        updateGameUI();
        if (timeLeft <= 0) endGame(false);
    }, 1000);

    heartSpawner = setInterval(spawnHeart, 600);
}

function spawnHeart() {
    const area = document.getElementById('game-area');
    const heart = document.createElement('div');
    heart.innerHTML = '💖';
    heart.className = 'catch-heart';
    
    const x = Math.random() * (area.offsetWidth - 30);
    const y = Math.random() * (area.offsetHeight - 30);
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    const catchHandler = (e) => {
        e.preventDefault();
        if(heart.parentElement) {
            playPop(); // Call required playPop() on heart caught
            score++;
            updateGameUI();
            heart.remove();
            if (score >= MAX_HEARTS) endGame(true);
        }
    };

    heart.addEventListener('mousedown', catchHandler);
    heart.addEventListener('touchstart', catchHandler);

    area.appendChild(heart);
    setTimeout(() => { if(heart.parentElement) heart.remove(); }, 1500);
}

function updateGameUI() {
    document.getElementById('timer').innerText = timeLeft;
    document.getElementById('score').innerText = score;
    const progress = (score / MAX_HEARTS) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

function endGame(isWin) {
    clearInterval(gameTimer);
    clearInterval(heartSpawner);
    document.getElementById('game-play').classList.remove('show');
    document.getElementById('game-area').innerHTML = '';

    if (isWin) {
        playWin(); // Call required playWin() on success
        document.getElementById('game-win').classList.add('show');
    } else {
        playLose(); // Call required playLose() on failure
        document.getElementById('game-lose').classList.add('show');
    }
}

// --- Scene 4: Typing Animation ---
const texts = [
    "Karena dari sekian banyak orang yang Diky kenal...",
    "entah kenapa...",
    "Chelyn yang paling susah Diky lupain."
];

async function typeStory() {
    for (let i = 0; i < texts.length; i++) {
        await typeLine(`type-text${i+1}`, texts[i]);
        await new Promise(r => setTimeout(r, 800));
    }
    setTimeout(() => document.getElementById('s4-btn').classList.add('show'), 500);
}

function typeLine(elementId, text) {
    return new Promise(resolve => {
        const el = document.getElementById(elementId);
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            el.innerHTML += text.charAt(charIndex);
            charIndex++;
            if (charIndex >= text.length) {
                clearInterval(typeInterval);
                resolve();
            }
        }, 60);
    });
}

// --- Scene 7: WhatsApp ---
function balasWa() {
    const text = "Ihhh makasiii 😭🤍";
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}
