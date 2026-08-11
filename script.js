/* =========================================================
   PREMIUM STORY WEBSITE — SCRIPT.JS
   FINAL / OPTIMIZED VERSION
========================================================= */

"use strict";

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
const GAME_TIME = 15;


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = id => document.getElementById(id);

const delay = ms =>
    new Promise(resolve => setTimeout(resolve, ms));


/* =========================================================
   AUDIO ENGINE
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
        audioContext.resume().catch(() => {});
    }
}


function playTone(
    frequency,
    duration = 0.12,
    type = "sine",
    volume = 0.1,
    endFrequency = null
) {

    initAudio();

    if (!audioContext) return;

    try {

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        const now =
            audioContext.currentTime;

        oscillator.type = type;

        oscillator.frequency.setValueAtTime(
            frequency,
            now
        );

        if (endFrequency) {

            oscillator.frequency.exponentialRampToValueAtTime(
                Math.max(1, endFrequency),
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

    } catch (error) {
        console.log("Audio error:", error);
    }
}


/* =========================================================
   SOUND EFFECTS
========================================================= */

function playPop() {

    playTone(
        500,
        0.09,
        "sine",
        0.08,
        1000
    );
}


function playEnvelopeSound() {

    const notes = [
        440,
        554.37,
        659.25,
        783.99
    ];

    notes.forEach((frequency, index) => {

        setTimeout(() => {

            playTone(
                frequency,
                0.4,
                "triangle",
                0.08
            );

        }, index * 90);

    });
}


function playWin() {

    const notes = [
        523.25,
        659.25,
        783.99,
        1046.50
    ];

    notes.forEach((frequency, index) => {

        setTimeout(() => {

            playTone(
                frequency,
                0.3,
                "sine",
                0.1
            );

        }, index * 100);

    });

    createCelebration();
}


function playLose() {

    playTone(
        350,
        0.45,
        "sine",
        0.08,
        150
    );
}


/* =========================================================
   MUSIC SYSTEM
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
                    900
                );

                updateMusicUI();

            })
            .catch(() => {

                console.log(
                    "Browser memblokir autoplay."
                );

            });

    } else {

        fadeMusic(
            bgm.volume,
            0,
            500
        );

        setTimeout(() => {

            bgm.pause();

        }, 500);

        musicPlaying = false;

        updateMusicUI();
    }
}


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
                1000
            );

            updateMusicUI();

        })
        .catch(() => {});
}


function fadeMusic(
    from,
    to,
    duration
) {

    if (!bgm) return;

    const steps = 25;
    let step = 0;

    const difference =
        to - from;

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


function updateMusicUI() {

    const button =
        $("music-toggle");

    const text =
        $("music-text");

    if (!button || !text) return;

    if (musicPlaying) {

        text.textContent = "PLAYING";

        button.classList.add("playing");

    } else {

        text.textContent = "MUSIC";

        button.classList.remove("playing");
    }
}


/* =========================================================
   FAST PREMIUM PRELOADER
========================================================= */

function hidePreloader() {

    const preloader =
        $("preloader");

    if (!preloader) {

        revealOpening();

        return;
    }

    preloader.classList.add("loaded");

    setTimeout(() => {

        preloader.style.display = "none";

        revealOpening();

    }, 450);
}


if (document.readyState === "complete") {

    setTimeout(
        hidePreloader,
        300
    );

} else {

    window.addEventListener(
        "load",
        () => {

            setTimeout(
                hidePreloader,
                300
            );

        },
        { once: true }
    );
}


/* =========================================================
   OPENING
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

            text1.classList.add("show");

        }, 400);
    }

    if (text2) {

        setTimeout(() => {

            text2.classList.add("show");

        }, 1500);
    }

    if (envelope) {

        setTimeout(() => {

            envelope.classList.add("show");

        }, 2800);
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

        envelope.classList.add("open");
    }

    createHeartBurst();

    setTimeout(() => {

        nextScene(2);

    }, 1500);
}


/* =========================================================
   SCENE SYSTEM
========================================================= */

function nextScene(sceneNumber) {

    const next =
        $(`scene${sceneNumber}`);

    if (!next) return;

    if (sceneNumber === currentScene) {
        return;
    }

    playPop();

    currentScene =
        sceneNumber;

    document
        .querySelectorAll(".scene")
        .forEach(scene => {

            scene.classList.remove("active");

        });

    next.classList.add("active");

    updateProgress(sceneNumber);

    setTimeout(() => {

        triggerScene(sceneNumber);

    }, 300);
}


/* =========================================================
   PROGRESS
========================================================= */

function updateProgress(sceneNumber) {

    const progress =
        $("story-progress-fill");

    const counter =
        $("current-scene");

    if (counter) {

        counter.textContent =
            String(sceneNumber).padStart(2, "0");
    }

    if (progress) {

        const percentage =
            ((sceneNumber - 1) / 6) * 100;

        progress.style.width =
            `${percentage}%`;
    }
}


/* =========================================================
   SCENE ROUTER
========================================================= */

function triggerScene(sceneNumber) {

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

    const elements = [
        $("s2-text1"),
        $("s2-text2"),
        $("s2-text3"),
        $("s2-quote"),
        $("s2-btn")
    ];

    elements.forEach(element => {

        if (element) {
            element.classList.remove("show");
        }

    });

    const timings = [
        400,
        1600,
        3000,
        4500,
        5700
    ];

    elements.forEach((element, index) => {

        if (!element) return;

        setTimeout(() => {

            element.classList.add("show");

        }, timings[index]);

    });
}


/* =========================================================
   SCENE 3 — GAME PREP
========================================================= */

function prepareGameScene() {

    clearGame();

    gameRunning = false;

    const intro =
        $("game-intro");

    const play =
        $("game-play");

    const lose =
        $("game-lose");

    const win =
        $("game-win");

    if (intro) {

        intro.style.display = "block";

        intro.classList.remove("hidden");
        intro.classList.remove("show");
    }

    if (play) {

        play.style.display = "none";

        play.classList.add("hidden");
    }

    if (lose) {

        lose.style.display = "none";

        lose.classList.add("hidden");
        lose.classList.remove("show");
    }

    if (win) {

        win.style.display = "none";

        win.classList.add("hidden");
        win.classList.remove("show");
    }

    score = 0;
    timeLeft = GAME_TIME;

    updateGameUI();
}


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    playPop();

    clearGame();

    score = 0;

    timeLeft = GAME_TIME;

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

        intro.style.display = "none";

        intro.classList.add("hidden");
    }

    if (lose) {

        lose.style.display = "none";

        lose.classList.add("hidden");
        lose.classList.remove("show");
    }

    if (win) {

        win.style.display = "none";

        win.classList.add("hidden");
        win.classList.remove("show");
    }

    if (play) {

        play.style.display = "block";

        play.classList.remove("hidden");
    }

    if (area) {

        area.innerHTML = "";
    }

    updateGameUI();

    spawnHeart();

    heartSpawner =
        setInterval(
            spawnHeart,
            600
        );

    gameTimer =
        setInterval(() => {

            if (!gameRunning) return;

            timeLeft--;

            updateGameUI();

            if (timeLeft <= 0) {

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
        document.createElement("button");

    heart.type = "button";

    heart.className =
        "catch-heart";

    heart.innerHTML = "♥";

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
        { once: true }
    );

    area.appendChild(heart);

    setTimeout(() => {

        if (heart.parentElement) {

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

    heart.classList.add("caught");

    setTimeout(() => {

        if (heart.parentElement) {
            heart.remove();
        }

    }, 120);

    updateGameUI();

    if (score >= MAX_HEARTS) {

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

        progress.style.width =
            `${Math.min(
                100,
                (score / MAX_HEARTS) * 100
            )}%`;
    }
}


/* =========================================================
   END GAME
========================================================= */

function endGame(won) {

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

        play.style.display = "none";

        play.classList.add("hidden");
    }

    if (area) {

        area.innerHTML = "";
    }

    if (result) {

        result.style.display = "block";

        result.classList.remove("hidden");

        requestAnimationFrame(() => {

            result.classList.add("show");

        });
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

        clearInterval(gameTimer);

        gameTimer = null;
    }

    if (heartSpawner) {

        clearInterval(heartSpawner);

        heartSpawner = null;
    }
}


/* =========================================================
   SCENE 4 — STORY
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

        intro.classList.remove("show");

        setTimeout(() => {

            intro.classList.add("show");

        }, 300);
    }

    await delay(1100);

    for (
        let i = 0;
        i < storyLines.length;
        i++
    ) {

        await typeText(
            $(`type-text${i + 1}`),
            storyLines[i]
        );

        await delay(600);
    }

    if (quote) {

        quote.classList.add("show");
    }

    await delay(900);

    if (button) {

        button.classList.add("show");
    }
}


/* =========================================================
   TYPEWRITER
========================================================= */

function typeText(element, text) {

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

                if (index >= text.length) {

                    clearInterval(interval);

                    resolve();
                }

            }, 32);
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

    elements.forEach(element => {

        element.classList.remove("show");

    });

    elements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add("show");

            }, 400 + index * 650);

        }
    );

    const panic =
        $("chibi-panic");

    if (panic) {

        panic.classList.remove("show");

        setTimeout(() => {

            panic.classList.add("show");

        }, 1500);
    }

    const button =
        $("s5-btn");

    if (button) {

        button.classList.remove("show");

        setTimeout(() => {

            button.classList.add("show");

        }, 5000);
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

    elements.forEach(element => {

        element.classList.remove("show");

    });

    elements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add("show");

            }, 450 + index * 700);

        }
    );

    const button =
        $("s6-btn");

    if (button) {

        button.classList.remove("show");

        setTimeout(() => {

            button.classList.add("show");

        }, 450 + elements.length * 700);
    }
}


/* =========================================================
   SCENE 7
========================================================= */

function animateScene7() {

    document.body.style.background =
        "#05050b";

    const elements =
        document.querySelectorAll(
            ".s7-anim"
        );

    elements.forEach(element => {

        element.classList.remove("show");

    });

    elements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add("show");

            }, 500 + index * 800);

        }
    );

    const button =
        $("s7-btn");

    if (button) {

        button.classList.remove("show");

        setTimeout(() => {

            button.classList.add("show");

        }, 6200);
    }

    setTimeout(
        createCelebration,
        5000
    );
}


/* =========================================================
   HEART BURST
========================================================= */

function createHeartBurst() {

    const container =
        $("floating-hearts");

    if (!container) return;

    for (let i = 0; i < 12; i++) {

        setTimeout(() => {

            const heart =
                document.createElement("span");

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

            container.appendChild(heart);

            setTimeout(() => {

                heart.remove();

            }, 3000);

        }, i * 70);
    }
}


/* =========================================================
   CELEBRATION
========================================================= */

function createCelebration() {

    const container =
        $("floating-hearts");

    if (!container) return;

    for (let i = 0; i < 18; i++) {

        setTimeout(() => {

            const heart =
                document.createElement("span");

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

            container.appendChild(heart);

            setTimeout(() => {

                heart.remove();

            }, 6000);

        }, i * 100);
    }
}


/* =========================================================
   PARTICLES
========================================================= */

function createParticles() {

    const container =
        $("particles");

    if (!container) return;

    if (container.children.length > 0) {
        return;
    }

    const amount =
        window.innerWidth < 600
            ? 20
            : 35;

    const fragment =
        document.createDocumentFragment();

    for (let i = 0; i < amount; i++) {

        const particle =
            document.createElement("span");

        particle.className =
            "particle";

        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.top =
            `${Math.random() * 100}%`;

        particle.style.animationDelay =
            `${Math.random() * 5}s`;

        particle.style.animationDuration =
            `${6 + Math.random() * 7}s`;

        fragment.appendChild(
            particle
        );
    }

    container.appendChild(fragment);
}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "m" ||
            event.key === "M"
        ) {

            toggleMusic();
        }
    }
);


/* =========================================================
   FIRST USER INTERACTION
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


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateProgress(1);

        createParticles();

        updateMusicUI();

    }
);


/* =========================================================
   WHATSAPP
========================================================= */

function balasWa() {

    const text =
        "Ihhh makasiii 😭🤍";

    const url =
        `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
}


/* =========================================================
   VISIBILITY OPTIMIZATION
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden &&
            gameRunning
        ) {

            clearInterval(
                heartSpawner
            );

        } else if (
            !document.hidden &&
            gameRunning
        ) {

            heartSpawner =
                setInterval(
                    spawnHeart,
                    700
                );
        }
    }
);


/* =========================================================
   END
========================================================= */