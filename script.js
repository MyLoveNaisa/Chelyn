/* =========================================================
   CHELYN — PREMIUM LOVE STORY
   SCRIPT.JS
   10 CHAPTER CINEMATIC EDITION
   BGM starts when the letter is opened
========================================================= */

"use strict";

/* =========================================================
   GLOBAL STATE
========================================================= */

let currentScene = 1;

let audioContext = null;
let musicPlaying = false;
let musicStarting = false;
let musicFadeTimer = null;

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
   DOM HELPER
========================================================= */

const $ = id => document.getElementById(id);

const delay = ms =>
    new Promise(resolve => setTimeout(resolve, ms));


/* =========================================================
   AUDIO
========================================================= */

const bgm = $("bgm");


/* =========================================================
   AUDIO CONTEXT
========================================================= */

function initAudio() {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContext) return;

    try {

        if (!audioContext) {
            audioContext = new AudioContext();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume().catch(() => {});
        }

    } catch (error) {
        console.log("AudioContext:", error);
    }
}


/* =========================================================
   SOUND EFFECT
========================================================= */

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
        gain.connect(audioContext.destination);

        const now =
            audioContext.currentTime;

        oscillator.type = type;

        oscillator.frequency.setValueAtTime(
            frequency,
            now
        );

        if (endFrequency !== null) {

            oscillator.frequency
                .exponentialRampToValueAtTime(
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
            now + duration + 0.03
        );

    } catch (error) {
        console.log("Tone:", error);
    }
}


/* =========================================================
   UI SOUND
========================================================= */

function playPop() {

    playTone(
        520,
        0.08,
        "sine",
        0.045,
        850
    );
}


/* =========================================================
   HEART SOUND
========================================================= */

function playHeartSound() {

    playTone(
        620,
        0.11,
        "triangle",
        0.045,
        780
    );
}


/* =========================================================
   ENVELOPE SOUND
========================================================= */

function playEnvelopeSound() {

    const notes = [
        392,
        493.88,
        587.33,
        659.25,
        783.99
    ];

    notes.forEach((frequency, index) => {

        setTimeout(() => {

            playTone(
                frequency,
                0.38,
                "triangle",
                0.04
            );

        }, index * 100);

    });
}


/* =========================================================
   WIN SOUND
========================================================= */

function playWin() {

    const notes = [
        523.25,
        659.25,
        783.99,
        1046.50,
        1318.51
    ];

    notes.forEach((frequency, index) => {

        setTimeout(() => {

            playTone(
                frequency,
                0.28,
                "sine",
                0.055
            );

        }, index * 100);

    });

    setTimeout(
        createCelebration,
        250
    );
}


/* =========================================================
   LOSE SOUND
========================================================= */

function playLose() {

    playTone(
        360,
        0.45,
        "sine",
        0.045,
        150
    );
}


/* =========================================================
   MUSIC FADE
========================================================= */

function fadeMusic(
    from,
    to,
    duration = 1000,
    callback = null
) {

    if (!bgm) return;

    if (musicFadeTimer) {

        clearInterval(musicFadeTimer);
        musicFadeTimer = null;
    }

    const steps = 50;
    let step = 0;

    const difference = to - from;

    bgm.volume =
        Math.max(
            0,
            Math.min(1, from)
        );

    musicFadeTimer =
        setInterval(() => {

            step++;

            const progress =
                Math.min(
                    1,
                    step / steps
                );

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
                        difference * eased
                    )
                );

            if (step >= steps) {

                clearInterval(
                    musicFadeTimer
                );

                musicFadeTimer = null;

                bgm.volume =
                    Math.max(
                        0,
                        Math.min(1, to)
                    );

                if (callback) {
                    callback();
                }
            }

        }, duration / steps);
}


/* =========================================================
   START MUSIC
   ========================================================= */

function startMusic() {

    if (!bgm) {
        console.warn("Element #bgm tidak ditemukan.");
        return;
    }

    if (musicPlaying || musicStarting) {
        return;
    }

    musicStarting = true;

    initAudio();

    bgm.loop = true;

    /*
     * Volume awal kecil.
     * Setelah play berhasil,
     * volume naik secara cinematic.
     */

    bgm.volume = 0;

    try {

        /*
         * Kalau sebelumnya selesai,
         * mulai lagi dari awal.
         */
        if (bgm.ended) {
            bgm.currentTime = 0;
        }

        const playPromise =
            bgm.play();

        if (playPromise !== undefined) {

            playPromise
                .then(() => {

                    musicPlaying = true;
                    musicStarting = false;

                    fadeMusic(
                        0,
                        0.42,
                        1800
                    );

                    updateMusicUI();

                })
                .catch(error => {

                    musicPlaying = false;
                    musicStarting = false;

                    console.log(
                        "BGM gagal diputar:",
                        error
                    );

                    updateMusicUI();
                });

        } else {

            musicPlaying = true;
            musicStarting = false;

            fadeMusic(
                0,
                0.42,
                1800
            );

            updateMusicUI();
        }

    } catch (error) {

        musicStarting = false;

        console.log(
            "Music error:",
            error
        );
    }
}


/* =========================================================
   STOP MUSIC
========================================================= */

function stopMusic() {

    if (!bgm) return;

    if (!musicPlaying) return;

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
}


/* =========================================================
   TOGGLE MUSIC
========================================================= */

function toggleMusic() {

    initAudio();

    if (!bgm) return;

    if (musicPlaying) {
        stopMusic();
    } else {
        startMusic();
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

        text.textContent = "PLAYING";

        button.classList.add(
            "playing"
        );

        button.setAttribute(
            "aria-label",
            "Pause music"
        );

    } else {

        text.textContent = "MUSIC";

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
   OPEN LETTER
   MUSIC STARTS HERE
========================================================= */

function openEnvelope() {

    if (envelopeOpened) {
        return;
    }

    envelopeOpened = true;

    /*
     * INI BAGIAN PENTING.
     *
     * Klik amplop = user gesture.
     * Browser biasanya mengizinkan BGM
     * dimulai dari sini.
     */

    initAudio();

    startMusic();

    playEnvelopeSound();

    const envelope =
        $("envelope");

    if (envelope) {

        envelope.classList.add(
            "open"
        );
    }

    const container =
        $("envelope-container");

    if (container) {

        container.classList.add(
            "opened"
        );
    }

    createHeartBurst();

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

        }, 1300);
    }

    if (envelope) {

        setTimeout(() => {

            envelope.classList.add(
                "show"
            );

        }, 2200);
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

    /*
     * Reset scene animation classes
     * sebelum scene baru tampil.
     */

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

    }, 180);
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

    const total =
        $("total-scenes");

    if (counter) {

        counter.textContent =
            String(sceneNumber)
                .padStart(2, "0");
    }

    if (total) {

        total.textContent =
            String(TOTAL_SCENES)
                .padStart(2, "0");
    }

    if (progress) {

        const percentage =
            ((sceneNumber - 1) /
            (TOTAL_SCENES - 1)) *
            100;

        progress.style.width =
            `${Math.max(
                0,
                Math.min(
                    100,
                    percentage
                )
            )}%`;
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
   CHAPTER 02
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

            element.classList.remove(
                "show"
            );
        }
    });

    const timings = [
        300,
        1100,
        2200,
        3400,
        4700
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
   CHAPTER 03 — GAME PREP
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
            "hidden",
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

            if (!gameRunning) {
                return;
            }

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

    /*
     * Batasi jumlah hati aktif
     * supaya HP tidak terlalu terbebani.
     */

    if (
        area.children.length >= 8
    ) {
        return;
    }

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
        timer.textContent = timeLeft;
    }

    if (scoreElement) {
        scoreElement.textContent = score;
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

        clearInterval(gameTimer);
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
   CHAPTER 04
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

    await delay(700);

    for (
        let i = 0;
        i < storyLines.length;
        i++
    ) {

        await typeText(
            $(`type-text${i + 1}`),
            storyLines[i]
        );

        await delay(350);
    }

    /*
     * Kalau HTML hanya menyediakan
     * type-text1 sampai type-text3,
     * sisa cerita tidak akan error.
     */

    if (quote) {

        setTimeout(() => {

            quote.classList.add(
                "show"
            );

        }, 400);
    }

    await delay(800);

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

            }, 26);
    });
}


/* =========================================================
   CHAPTER 05
========================================================= */

function animateScene5() {

    const elements =
        document.querySelectorAll(
            ".s5-anim"
        );

    elements.forEach(element => {

        element.classList.remove(
            "show"
        );
    });

    elements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add(
                    "show"
                );

            }, 350 + index * 550);
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

        }, 1600);
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

        }, 4700);
    }
}


/* =========================================================
   CHAPTER 06
========================================================= */

function animateScene6() {

    const elements =
        document.querySelectorAll(
            ".s6-anim"
        );

    elements.forEach(element => {

        element.classList.remove(
            "show"
        );
    });

    elements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add(
                    "show"
                );

            }, 400 + index * 600);
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

        }, 3200);
    }
}


/* =========================================================
   CHAPTER 07
========================================================= */

function animateScene7() {

    document.body.style.background =
        "#05050b";

    const elements =
        document.querySelectorAll(
            ".s7-anim"
        );

    elements.forEach(element => {

        element.classList.remove(
            "show"
        );
    });

    elements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add(
                    "show"
                );

            }, 450 + index * 650);
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

        }, 4700);
    }

    setTimeout(
        createCelebration,
        4200
    );
}


/* =========================================================
   CHAPTER 08
========================================================= */

function animateScene8() {

    const elements =
        document.querySelectorAll(
            ".s8-anim"
        );

    elements.forEach(element => {

        element.classList.remove(
            "show"
        );
    });

    elements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add(
                    "show"
                );

            }, 450 + index * 600);
        }
    );
}


/* =========================================================
   CHAPTER 09
========================================================= */

function animateScene9() {

    const elements =
        document.querySelectorAll(
            ".s9-anim"
        );

    elements.forEach(element => {

        element.classList.remove(
            "show"
        );
    });

    elements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add(
                    "show"
                );

            }, 500 + index * 700);
        }
    );
}


/* =========================================================
   CHAPTER 10
========================================================= */

function animateScene10() {

    document.body.style.background =
        "#030308";

    const elements =
        document.querySelectorAll(
            ".s10-anim, .finale-anim"
        );

    elements.forEach(element => {

        element.classList.remove(
            "show"
        );
    });

    elements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add(
                    "show"
                );

            }, 500 + index * 700);
        }
    );

    setTimeout(
        createCelebration,
        3500
    );

    setTimeout(
        createFinalHearts,
        4700
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
                `${(
                    Math.random() - 0.5
                ) * 340}px`
            );

            heart.style.setProperty(
                "--y",
                `${-120 -
                    Math.random() * 360}px`
            );

            container.appendChild(
                heart
            );

            setTimeout(() => {

                heart.remove();

            }, 3200);

        }, i * 55);
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

            heart.style.setProperty(
                "--delay",
                `${Math.random() * 1.5}s`
            );

            container.appendChild(
                heart
            );

            setTimeout(() => {

                heart.remove();

            }, 7000);

        }, i * 110);
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
        i < 26;
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
                `${Math.random() * 100}%`;

            heart.style.setProperty(
                "--duration",
                `${4 + Math.random() * 4}s`
            );

            container.appendChild(
                heart
            );

            setTimeout(() => {

                heart.remove();

            }, 8500);

        }, i * 130);
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
            ? 20
            : 36;

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
            `${6 + Math.random() * 8}s`;

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
            event.key === "ArrowRight"
        ) {

            if (
                currentScene < TOTAL_SCENES
            ) {

                nextScene(
                    currentScene + 1
                );
            }
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

        /*
         * JANGAN menjalankan bgm.play()
         * di sini.
         *
         * BGM baru dimulai ketika:
         * openEnvelope()
         *
         * dipanggil oleh klik surat.
         */
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

            if (gameRunning) {

                if (heartSpawner) {

                    clearInterval(
                        heartSpawner
                    );

                    heartSpawner = null;
                }
            }

            return;
        }

        /*
         * Kalau user kembali ke halaman
         * dan musik sebelumnya aktif,
         * lanjutkan musik.
         */

        if (
            musicPlaying &&
            bgm &&
            bgm.paused
        ) {

            bgm.play().catch(() => {});
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
   EXPOSE GLOBAL FUNCTIONS
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
   INITIAL BGM CONFIG
========================================================= */

if (bgm) {

    bgm.loop = true;

    bgm.volume = 0;

    /*
     * Tidak menggunakan autoplay.
     *
     * Musik akan dipicu oleh:
     * klik surat → openEnvelope()
     */
}


/* =========================================================
   END
========================================================= */