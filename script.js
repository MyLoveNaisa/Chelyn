/* =========================================================
   PREMIUM LOVE STORY — SCRIPT.JS
   AUDIO FIXED VERSION
========================================================= */

"use strict";

/* =========================================================
   GLOBAL
========================================================= */

let currentScene = 1;
let envelopeOpened = false;

let score = 0;
let timeLeft = 15;

let gameTimer = null;
let heartSpawner = null;
let gameRunning = false;

const TOTAL_SCENES = 10;
const MAX_HEARTS = 20;
const GAME_TIME = 15;


/* =========================================================
   DOM
========================================================= */

const $ = id => document.getElementById(id);

const delay = ms =>
    new Promise(resolve => setTimeout(resolve, ms));


/* =========================================================
   AUDIO
========================================================= */

const bgm = $("bgm");

let musicPlaying = false;


/*
 * MUSIK DIMULAI LANGSUNG DARI USER CLICK.
 *
 * Jangan menggunakan autoplay.
 * Browser biasanya mengizinkan audio ketika
 * play() dipanggil langsung dari event click/touch.
 */

function startMusic() {

    if (!bgm) {
        console.error("BGM ELEMENT TIDAK DITEMUKAN");
        return;
    }

    bgm.loop = true;

    /*
     * Volume awal.
     * Jangan 0 karena beberapa browser/WebView
     * kadang bermasalah ketika volume dimulai dari 0.
     */
    bgm.volume = 0.45;

    /*
     * Pastikan posisi lagu.
     */
    if (bgm.paused) {

        const playPromise = bgm.play();

        if (playPromise !== undefined) {

            playPromise
                .then(() => {

                    musicPlaying = true;

                    updateMusicUI();

                    console.log(
                        "BGM PLAYING"
                    );

                })
                .catch(error => {

                    musicPlaying = false;

                    console.error(
                        "BGM GAGAL PLAY:",
                        error
                    );

                    updateMusicUI();

                });
        }

    } else {

        musicPlaying = true;

        updateMusicUI();
    }
}


/* =========================================================
   STOP MUSIC
========================================================= */

function stopMusic() {

    if (!bgm) return;

    bgm.pause();

    musicPlaying = false;

    updateMusicUI();
}


/* =========================================================
   TOGGLE MUSIC
========================================================= */

function toggleMusic() {

    if (!bgm) return;

    if (bgm.paused) {

        startMusic();

    } else {

        stopMusic();
    }
}


/* =========================================================
   MUSIC UI
========================================================= */

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
   CLICK SOUND ENGINE
========================================================= */

let audioContext = null;

function initAudio() {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContext) return;

    if (!audioContext) {

        audioContext =
            new AudioContext();
    }

    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume()
            .catch(() => {});
    }
}


function playTone(
    frequency,
    duration = 0.12,
    type = "sine",
    volume = 0.06,
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

        gain.connect(
            audioContext.destination
        );

        const now =
            audioContext.currentTime;

        oscillator.type = type;

        oscillator.frequency
            .setValueAtTime(
                frequency,
                now
            );

        if (
            endFrequency !== null
        ) {

            oscillator.frequency
                .exponentialRampToValueAtTime(
                    Math.max(
                        1,
                        endFrequency
                    ),
                    now + duration
                );
        }

        gain.gain
            .setValueAtTime(
                0.001,
                now
            );

        gain.gain
            .exponentialRampToValueAtTime(
                volume,
                now + 0.015
            );

        gain.gain
            .exponentialRampToValueAtTime(
                0.001,
                now + duration
            );

        oscillator.start(now);

        oscillator.stop(
            now + duration + 0.02
        );

    } catch (error) {

        console.log(
            "Tone error:",
            error
        );
    }
}


function playPop() {

    playTone(
        520,
        0.09,
        "sine",
        0.05,
        900
    );
}


function playHeartSound() {

    playTone(
        620,
        0.12,
        "triangle",
        0.05,
        780
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
                    0.045
                );

            }, index * 110);
        }
    );
}


function playWin() {

    const notes = [
        523.25,
        659.25,
        783.99,
        1046.5,
        1318.51
    ];

    notes.forEach(
        (frequency, index) => {

            setTimeout(() => {

                playTone(
                    frequency,
                    0.32,
                    "sine",
                    0.06
                );

            }, index * 110);
        }
    );

    setTimeout(
        createCelebration,
        300
    );
}


function playLose() {

    playTone(
        360,
        0.5,
        "sine",
        0.05,
        145
    );
}


/* =========================================================
   ENVELOPE — MAIN AUDIO TRIGGER
========================================================= */

function openEnvelope() {

    if (envelopeOpened) {
        return;
    }

    envelopeOpened = true;


    /*
     * INI BAGIAN PALING PENTING.
     *
     * startMusic() dipanggil LANGSUNG
     * dari onclick="openEnvelope()".
     *
     * Jangan diberi setTimeout.
     */
    startMusic();


    /*
     * Sound tambahan.
     */
    playEnvelopeSound();


    const envelope =
        $("envelope");

    if (envelope) {

        envelope.classList.add(
            "open"
        );
    }


    createHeartBurst();


    /*
     * Masuk Chapter 2.
     */
    setTimeout(() => {

        nextScene(2);

    }, 1700);
}


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

    }, 600);
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

        }, 350);
    }

    if (text2) {

        setTimeout(() => {

            text2.classList.add(
                "show"
            );

        }, 1200);
    }

    if (envelope) {

        setTimeout(() => {

            envelope.classList.add(
                "show"
            );

        }, 2100);
    }
}


/* =========================================================
   SCENE NAVIGATION
========================================================= */

function nextScene(sceneNumber) {

    if (
        sceneNumber < 1 ||
        sceneNumber > TOTAL_SCENES
    ) {
        return;
    }

    const next =
        $(`scene${sceneNumber}`);

    if (!next) return;

    if (
        sceneNumber === currentScene
    ) {
        return;
    }

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

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    setTimeout(() => {

        triggerScene(
            sceneNumber
        );

    }, 250);
}


/* =========================================================
   PREVIOUS
========================================================= */

function previousScene() {

    if (currentScene <= 1) {
        return;
    }

    nextScene(
        currentScene - 1
    );
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
            ((sceneNumber - 1) /
                (TOTAL_SCENES - 1)) *
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

    switch (sceneNumber) {

        case 1:
            revealOpening();
            break;

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

        case 8:
            animateScene8();
            break;

        case 9:
            animateScene9();
            break;

        case 10:
            animateScene10();
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
        1400,
        2700,
        4100,
        5400
    ];

    elements.forEach(
        (element, index) => {

            if (!element) return;

            setTimeout(() => {

                element.classList.add(
                    "show"
                );

            }, timings[index]);
        }
    );
}


/* =========================================================
   GAME PREP
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

    playPop();

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
            550
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
        document.createElement(
            "button"
        );

    heart.type = "button";

    heart.className =
        "catch-heart";

    heart.innerHTML = "♥";

    const maxX =
        Math.max(
            10,
            area.clientWidth - 55
        );

    const maxY =
        Math.max(
            10,
            area.clientHeight - 55
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

    playHeartSound();

    const heart =
        event.currentTarget;

    heart.classList.add(
        "caught"
    );

    setTimeout(() => {

        if (heart.parentElement) {
            heart.remove();
        }

    }, 130);

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
                score /
                MAX_HEARTS *
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
   SCENE 4
========================================================= */

const storyLines = [

    "Dari sekian banyak orang yang pernah Diky kenal...",

    "ada satu nama yang entah kenapa selalu terasa berbeda.",

    "Bukan karena paling sempurna.",

    "Bukan juga karena selalu ada setiap saat.",

    "Tapi karena kehadirannya pernah membuat hari-hari biasa terasa sedikit lebih berarti.",

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

        intro.classList.remove(
            "show"
        );

        setTimeout(() => {

            intro.classList.add(
                "show"
            );

        }, 250);
    }

    await delay(900);

    for (
        let i = 0;
        i < storyLines.length;
        i++
    ) {

        await typeText(
            $(`type-text${i + 1}`),
            storyLines[i]
        );

        await delay(500);
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

            element.textContent = "";

            let index = 0;

            const interval =
                setInterval(() => {

                    element.textContent +=
                        text.charAt(index);

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
   GENERIC SCENES
========================================================= */

function animateScene5() {

    animateElements(
        ".s5-anim",
        400,
        650
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

        }, 1700);
    }
}


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

        setTimeout(() => {

            button.classList.add(
                "show"
            );

        }, 600 + elements.length * 700);
    }
}


function animateScene7() {

    animateElements(
        ".s7-anim",
        500,
        800
    );

    setTimeout(
        createCelebration,
        5000
    );
}


function animateScene8() {

    animateElements(
        ".s8-anim",
        500,
        750
    );
}


function animateScene9() {

    animateElements(
        ".s9-anim",
        600,
        850
    );
}


function animateScene10() {

    animateElements(
        ".finale-anim",
        700,
        950
    );

    setTimeout(
        createCelebration,
        4000
    );

    setTimeout(
        createFinalHearts,
        5200
    );
}


/* =========================================================
   GENERIC ANIMATION
========================================================= */

function animateElements(
    selector,
    start = 400,
    gap = 650
) {

    const elements =
        document.querySelectorAll(
            selector
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

            }, start + index * gap);
        }
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
                `${40 +
                    Math.random() *
                    20}%`;

            heart.style.top =
                `${45 +
                    Math.random() *
                    10}%`;

            heart.style.setProperty(
                "--x",
                `${(
                    Math.random() -
                    0.5
                ) * 340}px`
            );

            heart.style.setProperty(
                "--y",
                `${-120 -
                    Math.random() *
                    360}px`
            );

            container.appendChild(
                heart
            );

            setTimeout(() => {

                heart.remove();

            }, 3200);

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
                `${Math.random() *
                    100}%`;

            heart.style.setProperty(
                "--duration",
                `${3 +
                    Math.random() *
                    3}s`
            );

            container.appendChild(
                heart
            );

            setTimeout(() => {

                heart.remove();

            }, 7000);

        }, i * 120);
    }
}


/* =========================================================
   FINAL HEARTS
========================================================= */

function createFinalHearts() {

    const container =
        $("floating-hearts");

    if (!container) return;

    for (
        let i = 0;
        i < 30;
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
                i % 3 === 0
                    ? "♡"
                    : "♥";

            heart.style.left =
                `${Math.random() *
                    100}%`;

            heart.style.setProperty(
                "--duration",
                `${4 +
                    Math.random() *
                    4}s`
            );

            container.appendChild(
                heart
            );

            setTimeout(() => {

                heart.remove();

            }, 8500);

        }, i * 150);
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
            ? 24
            : 45;

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
            `${Math.random() *
                100}%`;

        particle.style.top =
            `${Math.random() *
                100}%`;

        particle.style.animationDelay =
            `${Math.random() * 5}s`;

        particle.style.animationDuration =
            `${6 +
                Math.random() *
                8}s`;

        fragment.appendChild(
            particle
        );
    }

    container.appendChild(
        fragment
    );
}


/* =========================================================
   WHATSAPP
========================================================= */

function balasWa() {

    const text =
        "Ihhh makasiii 😭🤍";

    const url =
        `https://wa.me/?text=${
            encodeURIComponent(text)
        }`;

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
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

        if (
            event.key === "ArrowRight" &&
            currentScene < TOTAL_SCENES
        ) {

            nextScene(
                currentScene + 1
            );
        }

        if (
            event.key === "ArrowLeft"
        ) {

            previousScene();
        }
    }
);


/* =========================================================
   DOM READY
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
   WINDOW LOAD
========================================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            hidePreloader,
            250
        );

    },
    {
        once: true
    }
);


/* =========================================================
   VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (document.hidden) {

            if (heartSpawner) {

                clearInterval(
                    heartSpawner
                );

                heartSpawner = null;
            }

            return;
        }

        /*
         * Kalau musik sedang aktif dan browser
         * menjedanya ketika background,
         * coba lanjutkan.
         */
        if (
            musicPlaying &&
            bgm &&
            bgm.paused
        ) {

            bgm.play()
                .catch(() => {});
        }

        if (
            gameRunning &&
            !heartSpawner
        ) {

            heartSpawner =
                setInterval(
                    spawnHeart,
                    550
                );
        }

    }
);


/* =========================================================
   EXPOSE TO HTML
========================================================= */

window.openEnvelope =
    openEnvelope;

window.nextScene =
    nextScene;

window.previousScene =
    previousScene;

window.startGame =
    startGame;

window.toggleMusic =
    toggleMusic;

window.balasWa =
    balasWa;

window.createCelebration =
    createCelebration;


/* =========================================================
   INITIAL AUDIO CONFIG
========================================================= */

if (bgm) {

    bgm.loop = true;

    bgm.volume = 0.45;

    /*
     * Tidak menggunakan autoplay.
     * Musik akan dimulai ketika surat diklik.
     */
}