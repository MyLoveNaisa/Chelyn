/* =========================================================
   PREMIUM STORY WEBSITE — SCRIPT.JS
   Compatible with the provided index.html
========================================================= */


/* =========================================================
   GLOBAL STATE
========================================================= */

let currentScene = 1;

let audioContext = null;

let musicPlaying = false;

let envelopeOpened = false;

let score = 0;
let timeLeft = 15;

let gameTimer = null;
let heartSpawner = null;
let gameRunning = false;

const MAX_HEARTS = 20;


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

const delay = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));


/* =========================================================
   AUDIO
========================================================= */

const bgm = $("bgm");

function initAudio() {
    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContext) return;

    if (!audioContext) {
        audioContext = new AudioContext();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
}


/* ---------- SYNTH SOUND ---------- */

function playTone(
    frequency,
    duration = 0.12,
    type = "sine",
    volume = 0.12,
    endFrequency = null
) {
    initAudio();

    if (!audioContext) return;

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(
        audioContext.destination
    );

    const now =
        audioContext.currentTime;

    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
        frequency,
        now
    );

    if (endFrequency) {
        oscillator.frequency.exponentialRampToValueAtTime(
            endFrequency,
            now + duration
        );
    }

    gain.gain.setValueAtTime(
        volume,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + duration
    );

    oscillator.start(now);

    oscillator.stop(
        now + duration
    );
}


/* ---------- BUTTON SOUND ---------- */

function playPop() {
    playTone(
        500,
        0.09,
        "sine",
        0.10,
        1000
    );
}


/* ---------- ENVELOPE SOUND ---------- */

function playEnvelopeSound() {

    initAudio();

    if (!audioContext) return;

    const notes = [
        440,
        554.37,
        659.25,
        783.99
    ];

    notes.forEach(
        (frequency, index) => {

            setTimeout(() => {

                playTone(
                    frequency,
                    0.45,
                    "triangle",
                    0.10
                );

            }, index * 90);

        }
    );
}


/* ---------- WIN SOUND ---------- */

function playWin() {

    const notes = [
        523.25,
        659.25,
        783.99,
        1046.50
    ];

    notes.forEach(
        (frequency, index) => {

            setTimeout(() => {

                playTone(
                    frequency,
                    0.35,
                    "sine",
                    0.12
                );

            }, index * 100);

        }
    );

    createCelebration();
}


/* ---------- LOSE SOUND ---------- */

function playLose() {

    playTone(
        350,
        0.45,
        "sine",
        0.10,
        150
    );
}


/* =========================================================
   MUSIC
========================================================= */

function toggleMusic() {

    if (!bgm) return;

    initAudio();

    if (!musicPlaying) {

        bgm.volume = 0;

        bgm.play()
            .then(() => {

                musicPlaying = true;

                fadeMusic(
                    0,
                    0.35,
                    1000
                );

                updateMusicUI();

            })
            .catch(error => {

                console.log(
                    "Music tidak dapat diputar:",
                    error
                );

            });

    } else {

        fadeMusic(
            bgm.volume,
            0,
            600
        );

        setTimeout(() => {

            bgm.pause();

        }, 600);

        musicPlaying = false;

        updateMusicUI();
    }
}


/* ---------- AUTO START AFTER INTERACTION ---------- */

function startMusic() {

    if (!bgm || musicPlaying) return;

    initAudio();

    bgm.volume = 0;

    bgm.play()
        .then(() => {

            musicPlaying = true;

            fadeMusic(
                0,
                0.35,
                1200
            );

            updateMusicUI();

        })
        .catch(() => {
            /* Browser may block autoplay */
        });
}


/* ---------- MUSIC FADE ---------- */

function fadeMusic(
    from,
    to,
    duration
) {

    if (!bgm) return;

    const steps = 30;

    const difference =
        to - from;

    let step = 0;

    bgm.volume = from;

    const interval =
        setInterval(() => {

            step++;

            const progress =
                step / steps;

            bgm.volume =
                Math.max(
                    0,
                    Math.min(
                        1,
                        from +
                        difference *
                        progress
                    )
                );

            if (step >= steps) {
                clearInterval(interval);
            }

        }, duration / steps);
}


/* ---------- MUSIC UI ---------- */

function updateMusicUI() {

    const button =
        $("music-toggle");

    const text =
        $("music-text");

    if (!button || !text) return;

    if (musicPlaying) {

        text.textContent =
            "PLAYING";

        button.classList.add(
            "playing"
        );

    } else {

        text.textContent =
            "MUSIC";

        button.classList.remove(
            "playing"
        );
    }
}


/* =========================================================
   PRELOADER
========================================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(() => {

            const preloader =
                $("preloader");

            if (!preloader) return;

            preloader.classList.add(
                "loaded"
            );

            setTimeout(() => {

                preloader.style.display =
                    "none";

                revealOpening();

            }, 800);

        }, 1200);

    }
);


/* =========================================================
   OPENING ANIMATION
========================================================= */

function revealOpening() {

    const text1 =
        $("s1-text1");

    const text2 =
        $("s1-text2");

    const envelope =
        $("envelope-container");

    if (text1) {

        setTimeout(() => {

            text1.classList.add(
                "show"
            );

        }, 500);

    }

    if (text2) {

        setTimeout(() => {

            text2.classList.add(
                "show"
            );

        }, 1800);

    }

    if (envelope) {

        setTimeout(() => {

            envelope.classList.add(
                "show"
            );

        }, 3400);

    }
}


/* =========================================================
   ENVELOPE
========================================================= */

function openEnvelope() {

    if (envelopeOpened) return;

    envelopeOpened = true;

    startMusic();

    playEnvelopeSound();

    const envelope =
        $("envelope");

    if (envelope) {

        envelope.classList.add(
            "open"
        );
    }

    createHeartBurst();

    setTimeout(() => {

        nextScene(2);

    }, 1800);
}


/* =========================================================
   SCENE SYSTEM
========================================================= */

function nextScene(sceneNumber) {

    const next =
        $(`scene${sceneNumber}`);

    if (!next) return;

    playPop();

    currentScene =
        sceneNumber;

    document
        .querySelectorAll(".scene")
        .forEach(scene => {

            scene.classList.remove(
                "active"
            );

        });

    next.classList.add(
        "active"
    );

    updateProgress(
        sceneNumber
    );

    setTimeout(() => {

        triggerScene(
            sceneNumber
        );

    }, 350);
}


/* =========================================================
   STORY PROGRESS
========================================================= */

function updateProgress(
    sceneNumber
) {

    const progress =
        $("story-progress-fill");

    const counter =
        $("current-scene");

    if (counter) {

        counter.textContent =
            String(
                sceneNumber
            ).padStart(
                2,
                "0"
            );
    }

    if (progress) {

        const percentage =
            ((sceneNumber - 1) / 6) * 100;

        progress.style.width =
            `${percentage}%`;
    }
}


/* =========================================================
   SCENE ANIMATION ROUTER
========================================================= */

function triggerScene(
    sceneNumber
) {

    switch (sceneNumber) {

        case 2:
            animateScene2();
            break;

        case 3:
            prepareGameScene();
            break;

        case 4:
            animateScene4();
            break;

        case 5:
            animateScene5();
            break;

        case 6:
            animateScene6();
            break;

        case 7:
            animateScene7();
            break;
    }
}


/* =========================================================
   SCENE 2
========================================================= */

function animateScene2() {

    const text1 =
        $("s2-text1");

    const text2 =
        $("s2-text2");

    const text3 =
        $("s2-text3");

    const quote =
        $("s2-quote");

    const button =
        $("s2-btn");

    if (text1) {

        setTimeout(() => {

            text1.classList.add(
                "show"
            );

        }, 500);
    }

    if (text2) {

        setTimeout(() => {

            text2.classList.add(
                "show"
            );

        }, 1800);
    }

    if (text3) {

        setTimeout(() => {

            text3.classList.add(
                "show"
            );

        }, 3400);
    }

    if (quote) {

        setTimeout(() => {

            quote.classList.add(
                "show"
            );

        }, 5000);
    }

    if (button) {

        setTimeout(() => {

            button.classList.add(
                "show"
            );

        }, 6300);
    }
}


/* =========================================================
   SCENE 3 — GAME
========================================================= */

function prepareGameScene() {

    const intro =
        $("game-intro");

    const play =
        $("game-play");

    const lose =
        $("game-lose");

    const win =
        $("game-win");

    if (intro) {

        intro.style.display =
            "block";

        intro.classList.remove(
            "show"
        );
    }

    if (play) {

        play.classList.add(
            "hidden"
        );

        play.style.display =
            "none";
    }

    if (lose) {

        lose.classList.add(
            "hidden"
        );

        lose.style.display =
            "none";
    }

    if (win) {

        win.classList.add(
            "hidden"
        );

        win.style.display =
            "none";
    }
}


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    playPop();

    clearGame();

    score = 0;

    timeLeft = 15;

    gameRunning = true;

    const intro =
        $("game-intro");

    const play =
        $("game-play");

    const lose =
        $("game-lose");

    const win =
        $("game-win");

    const area =
        $("game-area");

    if (intro) {

        intro.classList.add(
            "hidden"
        );

        intro.style.display =
            "none";
    }

    if (lose) {

        lose.classList.add(
            "hidden"
        );

        lose.style.display =
            "none";
    }

    if (win) {

        win.classList.add(
            "hidden"
        );

        win.style.display =
            "none";
    }

    if (play) {

        play.classList.remove(
            "hidden"
        );

        play.style.display =
            "block";
    }

    if (area) {

        area.innerHTML = "";
    }

    updateGameUI();

    /* Spawn first heart immediately */

    spawnHeart();

    heartSpawner =
        setInterval(
            spawnHeart,
            600
        );

    gameTimer =
        setInterval(() => {

            timeLeft--;

            updateGameUI();

            if (
                timeLeft <= 0
            ) {

                endGame(false);
            }

        }, 1000);
}


/* =========================================================
   SPAWN HEART
========================================================= */

function spawnHeart() {

    if (!gameRunning) return;

    const area =
        $("game-area");

    if (!area) return;

    const heart =
        document.createElement(
            "button"
        );

    heart.type =
        "button";

    heart.className =
        "catch-heart";

    heart.innerHTML =
        "♥";

    const maxX =
        Math.max(
            10,
            area.clientWidth - 45
        );

    const maxY =
        Math.max(
            10,
            area.clientHeight - 45
        );

    heart.style.left =
        `${Math.random() * maxX}px`;

    heart.style.top =
        `${Math.random() * maxY}px`;

    heart.addEventListener(
        "pointerdown",
        catchHeart,
        {
            once: true
        }
    );

    area.appendChild(
        heart
    );

    setTimeout(() => {

        if (
            heart &&
            heart.parentElement
        ) {

            heart.remove();
        }

    }, 1500);
}


/* =========================================================
   CATCH HEART
========================================================= */

function catchHeart(event) {

    if (!gameRunning) return;

    event.preventDefault();

    score++;

    playPop();

    const heart =
        event.currentTarget;

    heart.classList.add(
        "caught"
    );

    setTimeout(() => {

        if (heart.parentElement) {

            heart.remove();
        }

    }, 150);

    updateGameUI();

    if (
        score >= MAX_HEARTS
    ) {

        endGame(true);
    }
}


/* =========================================================
   GAME UI
========================================================= */

function updateGameUI() {

    const timer =
        $("timer");

    const scoreElement =
        $("score");

    const progress =
        $("progress-bar");

    if (timer) {

        timer.textContent =
            timeLeft;
    }

    if (scoreElement) {

        scoreElement.textContent =
            score;
    }

    if (progress) {

        const percentage =
            Math.min(
                100,
                (score / MAX_HEARTS) * 100
            );

        progress.style.width =
            `${percentage}%`;
    }
}


/* =========================================================
   END GAME
========================================================= */

function endGame(
    won
) {

    if (!gameRunning) return;

    gameRunning = false;

    clearGame();

    const play =
        $("game-play");

    const area =
        $("game-area");

    const result =
        won
            ? $("game-win")
            : $("game-lose");

    if (play) {

        play.style.display =
            "none";

        play.classList.add(
            "hidden"
        );
    }

    if (area) {

        area.innerHTML = "";
    }

    if (result) {

        result.style.display =
            "block";

        result.classList.remove(
            "hidden"
        );

        setTimeout(() => {

            result.classList.add(
                "show"
            );

        }, 50);
    }

    if (won) {

        playWin();

    } else {

        playLose();
    }
}


/* =========================================================
   CLEAR GAME
========================================================= */

function clearGame() {

    if (gameTimer) {

        clearInterval(
            gameTimer
        );

        gameTimer = null;
    }

    if (heartSpawner) {

        clearInterval(
            heartSpawner
        );

        heartSpawner = null;
    }
}


/* =========================================================
   SCENE 4 — TYPING STORY
========================================================= */

const storyLines = [

    "Karena dari sekian banyak orang yang Diky kenal...",

    "entah kenapa, ada satu nama yang selalu punya tempat berbeda di kepala Diky.",

    "Dan nama itu adalah Chelyn."
];


async function animateScene4() {

    const intro =
        $("s4-intro");

    const quote =
        $("s4-quote");

    const button =
        $("s4-btn");

    if (intro) {

        intro.classList.add(
            "show"
        );
    }

    await delay(1400);

    for (
        let i = 0;
        i < storyLines.length;
        i++
    ) {

        await typeText(
            $(`type-text${i + 1}`),
            storyLines[i]
        );

        await delay(700);
    }

    if (quote) {

        quote.classList.add(
            "show"
        );
    }

    await delay(1200);

    if (button) {

        button.classList.add(
            "show"
        );
    }
}


/* ---------- TYPEWRITER ---------- */

function typeText(
    element,
    text
) {

    return new Promise(resolve => {

        if (!element) {

            resolve();
            return;
        }

        element.textContent = "";

        let index = 0;

        const interval =
            setInterval(() => {

                element.textContent +=
                    text.charAt(index);

                index++;

                if (
                    index >= text.length
                ) {

                    clearInterval(
                        interval
                    );

                    resolve();
                }

            }, 35);
    });
}


/* =========================================================
   SCENE 5
========================================================= */

function animateScene5() {

    const elements =
        document.querySelectorAll(
            ".s5-anim"
        );

    elements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add(
                    "show"
                );

            }, 500 + index * 850);

        }
    );

    const panic =
        $("chibi-panic");

    if (panic) {

        setTimeout(() => {

            panic.classList.add(
                "show"
            );

        }, 1700);
    }

    const button =
        $("s5-btn");

    if (button) {

        setTimeout(() => {

            button.classList.add(
                "show"
            );

        }, 6000);
    }
}


/* =========================================================
   SCENE 6
========================================================= */

function animateScene6() {

    const elements =
        document.querySelectorAll(
            ".s6-anim"
        );

    elements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add(
                    "show"
                );

            }, 500 + index * 850);

        }
    );

    const button =
        $("s6-btn");

    if (button) {

        const total =
            elements.length;

        setTimeout(() => {

            button.classList.add(
                "show"
            );

        }, 600 + total * 850);
    }
}


/* =========================================================
   SCENE 7
========================================================= */

function animateScene7() {

    const elements =
        document.querySelectorAll(
            ".s7-anim"
        );

    elements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add(
                    "show"
                );

            }, 600 + index * 1000);

        }
    );

    const button =
        $("s7-btn");

    if (button) {

        setTimeout(() => {

            button.classList.add(
                "show"
            );

        }, 7000);
    }

    setTimeout(
        createCelebration,
        6500
    );
}


/* =========================================================
   HEART EFFECTS
========================================================= */

function createHeartBurst() {

    const container =
        $("floating-hearts");

    if (!container) return;

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        setTimeout(() => {

            const heart =
                document.createElement(
                    "span"
                );

            heart.className =
                "burst-heart";

            heart.textContent =
                Math.random() > 0.5
                    ? "♡"
                    : "♥";

            heart.style.left =
                `${40 + Math.random() * 20}%`;

            heart.style.top =
                `${45 + Math.random() * 10}%`;

            heart.style.setProperty(
                "--x",
                `${(Math.random() - 0.5) * 300}px`
            );

            heart.style.setProperty(
                "--y",
                `${-100 - Math.random() * 300}px`
            );

            container.appendChild(
                heart
            );

            setTimeout(() => {

                heart.remove();

            }, 3000);

        }, i * 70);
    }
}


/* ---------- CELEBRATION ---------- */

function createCelebration() {

    const container =
        $("floating-hearts");

    if (!container) return;

    for (
        let i = 0;
        i < 18;
        i++
    ) {

        setTimeout(() => {

            const heart =
                document.createElement(
                    "span"
                );

            heart.className =
                "celebration-heart";

            heart.textContent =
                Math.random() > 0.5
                    ? "♡"
                    : "♥";

            heart.style.left =
                `${Math.random() * 100}%`;

            heart.style.setProperty(
                "--duration",
                `${3 + Math.random() * 3}s`
            );

            container.appendChild(
                heart
            );

            setTimeout(() => {

                heart.remove();

            }, 6000);

        }, i * 120);
    }
}


/* =========================================================
   RANDOM BACKGROUND PARTICLES
========================================================= */

function createParticles() {

    const container =
        $("particles");

    if (!container) return;

    const amount =
        window.innerWidth < 600
            ? 25
            : 45;

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );

        particle.className =
            "particle";

        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.top =
            `${Math.random() * 100}%`;

        particle.style.animationDelay =
            `${Math.random() * 5}s`;

        particle.style.animationDuration =
            `${5 + Math.random() * 8}s`;

        container.appendChild(
            particle
        );
    }
}

createParticles();


/* =========================================================
   KEYBOARD SUPPORT
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            return;
        }

        if (
            event.key === "m" ||
            event.key === "M"
        ) {

            toggleMusic();
        }

    }
);


/* =========================================================
   USER INTERACTION → AUDIO
========================================================= */

document.addEventListener(
    "pointerdown",
    () => {

        initAudio();

    },
    {
        once: true,
        passive: true
    }
);


/* =================================================