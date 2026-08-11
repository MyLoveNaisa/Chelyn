/* =========================================================
   PREMIUM LOVE STORY — SCRIPT.JS
   VERSION 2.0
   Smooth • Emotional • Interactive • Music Fade
========================================================= */

"use strict";

/* =========================================================
   GLOBAL STATE
========================================================= */

let currentScene = 1;

let audioContext = null;
let musicPlaying = false;
let musicStarting = false;
let envelopeOpened = false;

let score = 0;
let timeLeft = 15;

let gameTimer = null;
let heartSpawner = null;
let gameRunning = false;

const MAX_HEARTS = 20;
const GAME_TIME = 15;

const $ = id => document.getElementById(id);

const delay = ms =>
    new Promise(resolve => setTimeout(resolve, ms));


/* =========================================================
   AUDIO SYSTEM
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


/* =========================================================
   SOUND EFFECT ENGINE
========================================================= */

function playTone(
    frequency,
    duration = 0.12,
    type = "sine",
    volume = 0.08,
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
            0.001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            volume,
            now + 0.015
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + duration
        );

        oscillator.start(now);

        oscillator.stop(
            now + duration + 0.02
        );

    } catch (error) {

        console.warn(
            "Sound error:",
            error
        );
    }
}


/* =========================================================
   UI SOUNDS
========================================================= */

function playPop() {

    playTone(
        520,
        0.08,
        "sine",
        0.055,
        900
    );
}


function playSoftClick() {

    playTone(
        700,
        0.06,
        "triangle",
        0.035,
        950
    );
}


function playEnvelopeSound() {

    const notes = [
        392,
        493.88,
        587.33,
        659.25,
        783.99
    ];

    notes.forEach(
        (frequency, index) => {

            setTimeout(() => {

                playTone(
                    frequency,
                    0.42,
                    "triangle",
                    0.055
                );

            }, index * 95);
        }
    );
}


function playWin() {

    const notes = [
        523.25,
        659.25,
        783.99,
        1046.50,
        1318.51
    ];

    notes.forEach(
        (frequency, index) => {

            setTimeout(() => {

                playTone(
                    frequency,
                    0.35,
                    "sine",
                    0.07
                );

            }, index * 110);
        }
    );

    setTimeout(
        createCelebration,
        350
    );
}


function playLose() {

    playTone(
        330,
        0.5,
        "sine",
        0.055,
        150
    );
}


/* =========================================================
   MUSIC SYSTEM
========================================================= */

/*
   Musik TIDAK dipaksa autoplay saat halaman baru dibuka.

   Browser biasanya memblokir audio autoplay.

   Musik akan otomatis dimulai pada:
   - tap pertama
   - klik pertama
   - membuka envelope
   - tombol pertama yang ditekan

   Jadi user tidak perlu menekan tombol MUSIC.
*/


async function startMusic() {

    if (!bgm) return;

    if (musicPlaying || musicStarting) {
        return;
    }

    musicStarting = true;

    initAudio();

    try {

        bgm.loop = true;

        bgm.volume = 0;

        await bgm.play();

        musicPlaying = true;
        musicStarting = false;

        fadeMusic(
            0,
            0.32,
            1800
        );

        updateMusicUI();

    } catch (error) {

        musicStarting = false;

        console.log(
            "Autoplay menunggu interaksi user."
        );
    }
}


/* =========================================================
   MUSIC TOGGLE
========================================================= */

function toggleMusic() {

    if (!bgm) return;

    if (musicPlaying) {

        fadeMusic(
            bgm.volume,
            0,
            700,
            () => {

                bgm.pause();

                musicPlaying = false;

                updateMusicUI();
            }
        );

    } else {

        startMusic();
    }
}


/* =========================================================
   MUSIC FADE
========================================================= */

let fadeTimer = null;

function fadeMusic(
    from,
    to,
    duration,
    callback = null
) {

    if (!bgm) return;

    if (fadeTimer) {

        clearInterval(
            fadeTimer
        );
    }

    const steps = 40;

    let step = 0;

    const difference =
        to - from;

    bgm.volume =
        Math.max(
            0,
            Math.min(
                1,
                from
            )
        );

    fadeTimer =
        setInterval(() => {

            step++;

            const progress =
                step / steps;

            /*
               Ease-in-out supaya perubahan
               volume terasa lebih natural.
            */

            const eased =
                progress < 0.5
                    ? 2 * progress * progress
                    : 1 -
                      Math.pow(
                          -2 * progress + 2,
                          2
                      ) / 2;

            bgm.volume =
                Math.max(
                    0,
                    Math.min(
                        1,
                        from +
                        difference *
                        eased
                    )
                );

            if (step >= steps) {

                clearInterval(
                    fadeTimer
                );

                fadeTimer = null;

                bgm.volume =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            to
                        )
                    );

                if (callback) {
                    callback();
                }
            }

        }, duration / steps);
}


/* =========================================================
   MUSIC UI
========================================================= */

function updateMusicUI() {

    const button =
        $("music-toggle");

    const text =
        $("music-text");

    if (!button || !text) {
        return;
    }

    if (musicPlaying) {

        text.textContent =
            "PLAYING";

        button.classList.add(
            "playing"
        );

        button.setAttribute(
            "aria-label",
            "Pause music"
        );

    } else {

        text.textContent =
            "MUSIC";

        button.classList.remove(
            "playing"
        );

        button.setAttribute(
            "aria-label",
            "Play music"
        );
    }
}


/* =========================================================
   AUTOMATIC FIRST INTERACTION
========================================================= */

function firstInteraction() {

    initAudio();

    startMusic();

    document.removeEventListener(
        "pointerdown",
        firstInteraction
    );

    document.removeEventListener(
        "touchstart",
        firstInteraction
    );

    document.removeEventListener(
        "keydown",
        firstInteraction
    );
}


/*
   Ini yang membuat musik mulai otomatis
   begitu user pertama kali menyentuh website.
*/

document.addEventListener(
    "pointerdown",
    firstInteraction,
    {
        once: true,
        passive: true
    }
);

document.addEventListener(
    "touchstart",
    firstInteraction,
    {
        once: true,
        passive: true
    }
);

document.addEventListener(
    "keydown",
    firstInteraction,
    {
        once: true
    }
);


/* =========================================================
   PRELOADER
========================================================= */

function hidePreloader() {

    const preloader =
        $("preloader");

    if (!preloader) {

        revealOpening();

        return;
    }

    preloader.classList.add(
        "loaded"
    );

    setTimeout(() => {

        preloader.style.display =
            "none";

        revealOpening();

    }, 650);
}


if (
    document.readyState ===
    "complete"
) {

    setTimeout(
        hidePreloader,
        400
    );

} else {

    window.addEventListener(
        "load",
        () => {

            setTimeout(
                hidePreloader,
                400
            );

        },
        {
            once: true
        }
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

            text1.classList.add(
                "show"
            );

        }, 450);
    }

    if (text2) {

        setTimeout(() => {

            text2.classList.add(
                "show"
            );

        }, 1700);
    }

    if (envelope) {

        setTimeout(() => {

            envelope.classList.add(
                "show"
            );

        }, 3000);
    }
}


/* =========================================================
   ENVELOPE
========================================================= */

function openEnvelope() {

    if (envelopeOpened) return;

    envelopeOpened = true;

    /*
       Begitu envelope dibuka:
       musik langsung aktif + fade in.
    */

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

    }, 1700);
}


/* =========================================================
   SCENE SYSTEM
========================================================= */

function nextScene(sceneNumber) {

    const next =
        $(`scene${sceneNumber}`);

    if (!next) return;

    if (
        sceneNumber ===
        currentScene
    ) {
        return;
    }

    playSoftClick();

    currentScene =
        sceneNumber;

    document
        .querySelectorAll(
            ".scene"
        )
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
   PROGRESS
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
            ((sceneNumber - 1) / 6) *
            100;

        progress.style.width =
            `${percentage}%`;
    }
}


/* =========================================================
   SCENE ROUTER
========================================================= */

function triggerScene(
    sceneNumber
) {

    switch (
        sceneNumber
    ) {

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

    elements.forEach(
        element => {

            if (element) {

                element.classList.remove(
                    "show"
                );
            }
        }
    );

    const timings = [
        400,
        1600,
        3000,
        4500,
        5700
    ];

    elements.forEach(
        (element, index) => {

            if (!element) return;

            setTimeout(() => {

                element.classList.add(
                    "show"
                );

                playSoftClick();

            }, timings[index]);
        }
    );
}


/* =========================================================
   GAME PREPARATION
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

        intro.style.display =
            "block";

        intro.classList.remove(
            "hidden"
        );

        intro.classList.remove(
            "show"
        );
    }

    if (play) {

        play.style.display =
            "none";

        play.classList.add(
            "hidden"
        );
    }

    if (lose) {

        lose.style.display =
            "none";

        lose.classList.add(
            "hidden"
        );

        lose.classList.remove(
            "show"
        );
    }

    if (win) {

        win.style.display =
            "none";

        win.classList.add(
            "hidden"
        );

        win.classList.remove(
            "show"
        );
    }

    score = 0;

    timeLeft =
        GAME_TIME;

    updateGameUI();
}


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    startMusic();

    playSoftClick();

    clearGame();

    score = 0;

    timeLeft =
        GAME_TIME;

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

        intro.style.display =
            "none";

        intro.classList.add(
            "hidden"
        );
    }

    if (lose) {

        lose.style.display =
            "none";

        lose.classList.add(
            "hidden"
        );

        lose.classList.remove(
            "show"
        );
    }

    if (win) {

        win.style.display =
            "none";

        win.classList.add(
            "hidden"
        );

        win.classList.remove(
            "show"
        );
    }

    if (play) {

        play.style.display =
            "block";

        play.classList.remove(
            "hidden"
        );
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

            if (
                timeLeft <= 0
            ) {

                endGame(false);
            }

        }, 1000);
}


/* =========================================================
   HEART SPAWNER
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

        if (
            heart.parentElement
        ) {

            heart.remove();
        }

    }, 120);

    updateGameUI();

    if (
        score >=
        MAX_HEARTS
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

        progress.style.width =
            `${Math.min(
                100,
                (score /
                    MAX_HEARTS) *
                    100
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

        requestAnimationFrame(() => {

            result.classList.add(
                "show"
            );
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
   SCENE 4 — STORY
========================================================= */

const storyLines = [

    "Karena dari sekian banyak orang yang Diky kenal...",

    "entah kenapa, ada satu nama yang selalu punya tempat berbeda di kepala Diky.",

    "Dan nama itu adalah Chelyn.",

    "Bukan karena Diky mencari seseorang untuk disukai.",

    "Tapi karena tanpa sadar, Chelyn datang dan membuat semuanya terasa berbeda."

];


async function animateScene4() {

    const intro =
        $("s4-intro");

    const quote =
        $("s4-quote");

    const button =
        $("s4-btn");

    if (intro) {

        intro.classList.remove(
            "show"
        );

        setTimeout(() => {

            intro.classList.add(
                "show"
            );

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

        await delay(650);
    }

    if (quote) {

        quote.classList.add(
            "show"
        );
    }

    await delay(1000);

    if (button) {

        button.classList.add(
            "show"
        );
    }
}


/* =========================================================
   TYPEWRITER
========================================================= */

function typeText(
    element,
    text
) {

    return new Promise(
        resolve => {

            if (!element) {

                resolve();

                return;
            }

            element.textContent =
                "";

            let index = 0;

            const interval =
                setInterval(() => {

                    element.textContent +=
                        text.charAt(
                            index
                        );

                    index++;

                    if (
                        index >=
                        text.length
                    ) {

                        clearInterval(
                            interval
                        );

                        resolve();
                    }

                }, 30);
        }
    );
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
        element => {

            element.classList.remove(
                "show"
            );
        }
    );

    elements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add(
                    "show"
                );

                playSoftClick();

            }, 400 + index * 650);
        }
    );

    const panic =
        $("chibi-panic");

    if (panic) {

        panic.classList.remove(
            "show"
        );

        setTimeout(() => {

            panic.classList.add(
                "show"
            );

        }, 1500);
    }

    const button =
        $("s5-btn");

    if (button) {

        button.classList.remove(
            "show"
        );

        setTimeout(() => {

            button.classList.add(
                "show"
            );

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

    elements.forEach(
        element => {

            element.classList.remove(
                "show"
            );
        }
    );

    elements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add(
                    "show"
                );

            }, 450 + index * 700);
        }
    );

    const button =
        $("s6-btn");

    if (button) {

        button.classList.remove(
            "show"
        );

        setTimeout(() => {

            button.classList.add(
                "show"
            );

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

    elements.forEach(
        element => {

            element.classList.remove(
                "show"
            );
        }
    );

    elements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add(
                    "show"
                );

            }, 500 + index * 800);
        }
    );

    const button =
        $("s7-btn");

    if (button) {

        button.classList.remove(
            "show"
        );

        setTimeout(() => {

            button.classList.add(
                "show"
            );

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

    for (
        let i = 0;
        i < 16;
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
                `${(Math.random() - 0.5) * 340}px`
            );

            heart.style.setProperty(
                "--y",
                `${-100 - Math.random() * 320}px`
            );

            container.appendChild(
                heart
            );

            setTimeout(() => {

                heart.remove();

            }, 3000);

        }, i * 65);
    }
}


/* =========================================================
   CELEBRATION
========================================================= */

function createCelebration() {

    const container =
        $("floating-hearts");

    if (!container) return;

    for (
        let i = 0;
        i < 22;
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

        }, i * 90);
    }
}


/* =========================================================
   PARTICLES
========================================================= */

function createParticles() {

    const container =
        $("particles");

    if (!container) return;

    if (
        container.children.length > 0
    ) {
        return;
    }

    const amount =
        window.innerWidth < 600
            ? 22
            : 40;

    const fragment =
        document.createDocumentFragment();

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
            `${6 + Math.random() * 7}s`;

        fragment.appendChild(
            particle
        );
    }

    container.appendChild(
        fragment
    );
}


/* =========================================================
   KEYBOARD MUSIC
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
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateProgress(1);

        createParticles();

        updateMusicUI();

        /*
           Pastikan audio tidak terlalu keras
           ketika mulai.
        */

        if (bgm) {

            bgm.volume = 0;

            bgm.loop = true;
        }
    }
);


/* =========================================================
   WHATSAPP
========================================================= */

function balasWa() {

    const text =
        "Ihhh makasiii 😭🤍";

    const url =
        `https://wa.me/?text=${encodeURIComponent(
            text
        )}`;

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

            heartSpawner = null;

        } else if (
            !document.hidden &&
            gameRunning &&
            !heartSpawner
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
   SAFETY — CLEANUP
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        clearGame();

        if (fadeTimer) {

            clearInterval(
                fadeTimer
            );
        }

        if (bgm) {

            bgm.pause();
        }
    }
);


/* =========================================================
   END
========================================================= */