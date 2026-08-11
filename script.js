/* =========================================================
   DIKY × CHELYN
   PREMIUM LOVE STORY — SCRIPT.JS
   10 SCENES • CINEMATIC • SOFT PINK • AUTO MUSIC
========================================================= */


/* =========================================================
   GLOBAL STATE
========================================================= */

let currentScene = 1;

let score = 0;
let timeLeft = 15;

let gameTimer = null;
let heartSpawner = null;

let audioCtx = null;
let isMusicPlaying = false;

const MAX_HEARTS = 20;

const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicToggle");


/* =========================================================
   AUDIO ENGINE
========================================================= */

const AudioContext =
    window.AudioContext ||
    window.webkitAudioContext;


function initAudioContext() {

    if (!audioCtx) {

        try {
            audioCtx = new AudioContext();
        } catch (error) {
            console.log("Web Audio tidak tersedia.");
            return;
        }
    }

    if (audioCtx.state === "suspended") {
        audioCtx.resume().catch(() => {});
    }
}


/* =========================================================
   SMALL SOUND EFFECT
========================================================= */

function playTone(
    frequency,
    duration = 0.12,
    volume = 0.06,
    type = "sine"
) {

    initAudioContext();

    if (!audioCtx) return;

    const oscillator =
        audioCtx.createOscillator();

    const gain =
        audioCtx.createGain();

    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
        frequency,
        audioCtx.currentTime
    );

    gain.gain.setValueAtTime(
        0.001,
        audioCtx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        volume,
        audioCtx.currentTime + 0.025
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.start();

    oscillator.stop(
        audioCtx.currentTime + duration
    );
}


/* =========================================================
   POP SOUND
========================================================= */

function playPop() {

    playTone(
        680,
        0.08,
        0.065,
        "sine"
    );
}


/* =========================================================
   ENVELOPE SOUND
========================================================= */

function playEnvelope() {

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
                0.45,
                0.055,
                "triangle"
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
        1046.50
    ];

    notes.forEach((frequency, index) => {

        setTimeout(() => {

            playTone(
                frequency,
                0.35,
                0.065,
                "sine"
            );

        }, index * 100);

    });
}


/* =========================================================
   LOSE SOUND
========================================================= */

function playLose() {

    playTone(
        300,
        0.3,
        0.045,
        "triangle"
    );

    setTimeout(() => {

        playTone(
            200,
            0.35,
            0.035,
            "triangle"
        );

    }, 120);
}


/* =========================================================
   MUSIC SYSTEM
========================================================= */

async function startMusic() {

    if (!bgm) return;

    try {

        bgm.volume = 0.38;

        await bgm.play();

        isMusicPlaying = true;

        if (musicBtn) {
            musicBtn.textContent =
                "♫ Music On";
        }

        console.log(
            "Background music aktif."
        );

    } catch (error) {

        /*
         * Chrome/Android dapat memblokir
         * autoplay audio bersuara.
         */

        isMusicPlaying = false;

        if (musicBtn) {
            musicBtn.textContent =
                "♫ Putar Musik";
        }

        console.log(
            "Autoplay diblokir browser."
        );
    }
}


function toggleMusic() {

    initAudioContext();

    if (!bgm) return;

    if (bgm.paused) {

        bgm.volume = 0.38;

        bgm.play()
            .then(() => {

                isMusicPlaying = true;

                if (musicBtn) {
                    musicBtn.textContent =
                        "♫ Music On";
                }

            })
            .catch(() => {

                console.log(
                    "Musik gagal diputar."
                );

            });

    } else {

        bgm.pause();

        isMusicPlaying = false;

        if (musicBtn) {
            musicBtn.textContent =
                "♫ Music Off";
        }
    }
}


if (musicBtn) {

    musicBtn.addEventListener(
        "click",
        toggleMusic
    );

}


/* =========================================================
   AUTO MUSIC
========================================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(() => {

            startMusic();

        }, 500);

    }
);


/*
 * Kalau browser memblokir autoplay,
 * interaksi pertama digunakan untuk
 * mencoba menjalankan musik kembali.
 */

let musicRetry = false;


function retryMusic() {

    if (musicRetry) return;

    if (isMusicPlaying) return;

    musicRetry = true;

    startMusic();
}


[
    "click",
    "touchstart",
    "pointerdown"
].forEach(eventName => {

    document.addEventListener(
        eventName,
        retryMusic,
        {
            once: true,
            passive: true
        }
    );

});


/* =========================================================
   PARTICLES
========================================================= */

function createParticles() {

    const container =
        document.getElementById(
            "particles"
        );

    if (!container) return;

    container.innerHTML = "";

    const amount =
        window.innerWidth < 600
            ? 28
            : 42;

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement("div");

        particle.className =
            "particle";

        const size =
            Math.random() * 3 + 1;

        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;

        particle.style.animationDuration =
            `${Math.random() * 10 + 7}s`;

        particle.style.animationDelay =
            `${Math.random() * 8}s`;

        container.appendChild(
            particle
        );
    }
}


/* =========================================================
   UTILITY
========================================================= */

function wait(milliseconds) {

    return new Promise(resolve => {

        setTimeout(
            resolve,
            milliseconds
        );

    });
}


function showElement(
    id,
    delay = 0
) {

    setTimeout(() => {

        const element =
            document.getElementById(id);

        if (element) {
            element.classList.add("show");
        }

    }, delay);
}


function showElements(
    selector,
    delay = 500,
    interval = 800
) {

    const elements =
        document.querySelectorAll(
            selector
        );

    elements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add(
                    "show"
                );

            }, delay + index * interval);

        }
    );
}


/* =========================================================
   SCENE MANAGEMENT
========================================================= */

function nextScene(sceneId) {

    playPop();

    const oldScene =
        document.querySelector(
            ".scene.active"
        );

    const newScene =
        document.getElementById(
            `scene${sceneId}`
        );

    if (!newScene) {

        console.warn(
            `Scene ${sceneId} belum ada di HTML.`
        );

        return;
    }

    if (oldScene) {
        oldScene.classList.remove(
            "active"
        );
    }

    currentScene = sceneId;

    setTimeout(() => {

        newScene.classList.add(
            "active"
        );

        triggerSceneAnimations(
            sceneId
        );

    }, 120);

}


/* =========================================================
   SCENE ANIMATIONS
========================================================= */

function triggerSceneAnimations(
    sceneId
) {

    switch (sceneId) {

        /* ==============================================
           BABAK 1
        ============================================== */

        case 1:

            showElement(
                "s1-text1",
                700
            );

            showElement(
                "s1-text2",
                2200
            );

            showElement(
                "envelope-container",
                3800
            );

            break;


        /* ==============================================
           BABAK 2
        ============================================== */

        case 2:

            showElement(
                "s2-text1",
                500
            );

            showElement(
                "s2-text2",
                1900
            );

            showElement(
                "s2-text3",
                3300
            );

            showElement(
                "s2-btn",
                4500
            );

            break;


        /* ==============================================
           BABAK 3
        ============================================== */

        case 3:

            const gameIntro =
                document.getElementById(
                    "game-intro"
                );

            if (gameIntro) {

                gameIntro.style.display =
                    "block";

                gameIntro.classList.add(
                    "show"
                );

            }

            break;


        /* ==============================================
           BABAK 4
        ============================================== */

        case 4:

            showElement(
                "s4-intro",
                600
            );

            setTimeout(() => {

                typeStory();

            }, 2200);

            break;


        /* ==============================================
           BABAK 5
        ============================================== */

        case 5:

            showElements(
                ".s5-anim",
                500,
                1200
            );

            setTimeout(() => {

                const chibi =
                    document.getElementById(
                        "chibi-panic"
                    );

                if (chibi) {
                    chibi.classList.add(
                        "show"
                    );
                }

            }, 2200);

            showElement(
                "s5-btn",
                4800
            );

            break;


        /* ==============================================
           BABAK 6
        ============================================== */

        case 6:

            showElements(
                ".s6-anim",
                500,
                850
            );

            showElement(
                "s6-btn",
                6200
            );

            break;


        /* ==============================================
           BABAK 7
        ============================================== */

        case 7:

            showElements(
                ".s7-anim",
                700,
                1200
            );

            showElement(
                "s7-btn",
                5600
            );

            break;


        /* ==============================================
           BABAK 8
        ============================================== */

        case 8:

            showElements(
                ".s8-anim",
                600,
                1000
            );

            showElement(
                "s8-btn",
                5200
            );

            break;


        /* ==============================================
           BABAK 9
        ============================================== */

        case 9:

            showElements(
                ".s9-anim",
                600,
                1000
            );

            showElement(
                "s9-btn",
                5700
            );

            break;


        /* ==============================================
           BABAK 10
        ============================================== */

        case 10:

            showElements(
                ".s10-anim",
                700,
                1200
            );

            showElement(
                "s10-btn",
                6500
            );

            break;

    }

}


/* =========================================================
   BABAK 1 — OPENING
========================================================= */

function openEnvelope() {

    playEnvelope();

    const envelope =
        document.getElementById(
            "envelope"
        );

    if (!envelope) return;

    envelope.classList.add(
        "open"
    );

    setTimeout(() => {

        nextScene(2);

    }, 1500);
}


/* =========================================================
   MINI GAME
========================================================= */

function startGame() {

    playPop();

    clearInterval(
        gameTimer
    );

    clearInterval(
        heartSpawner
    );

    const intro =
        document.getElementById(
            "game-intro"
        );

    const gamePlay =
        document.getElementById(
            "game-play"
        );

    const gameWin =
        document.getElementById(
            "game-win"
        );

    const gameLose =
        document.getElementById(
            "game-lose"
        );

    const gameArea =
        document.getElementById(
            "game-area"
        );

    if (!gameArea) return;

    if (intro) {

        intro.style.display =
            "none";

        intro.classList.remove(
            "show"
        );

    }

    if (gameWin) {
        gameWin.classList.remove(
            "show"
        );
    }

    if (gameLose) {
        gameLose.classList.remove(
            "show"
        );
    }

    if (gamePlay) {
        gamePlay.classList.add(
            "show"
        );
    }

    score = 0;
    timeLeft = 15;

    gameArea.innerHTML = "";

    updateGameUI();


    gameTimer = setInterval(() => {

        timeLeft--;

        updateGameUI();

        if (timeLeft <= 0) {

            endGame(false);

        }

    }, 1000);


    heartSpawner =
        setInterval(
            spawnHeart,
            550
        );

}


function spawnHeart() {

    const area =
        document.getElementById(
            "game-area"
        );

    if (!area) return;

    const heart =
        document.createElement(
            "div"
        );

    /*
     * Pink heart.
     */

    heart.textContent = "💗";

    heart.className =
        "catch-heart";

    const maxX =
        Math.max(
            10,
            area.clientWidth - 42
        );

    const maxY =
        Math.max(
            10,
            area.clientHeight - 42
        );

    heart.style.left =
        `${Math.random() * maxX}px`;

    heart.style.top =
        `${Math.random() * maxY}px`;


    const catchHeart =
        event => {

            event.preventDefault();

            event.stopPropagation();

            if (!heart.parentElement) {
                return;
            }

            playPop();

            score++;

            updateGameUI();

            heart.remove();

            if (
                score >=
                MAX_HEARTS
            ) {

                endGame(true);

            }

        };


    heart.addEventListener(
        "pointerdown",
        catchHeart
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

    }, 1600);

}


function updateGameUI() {

    const timer =
        document.getElementById(
            "timer"
        );

    const scoreElement =
        document.getElementById(
            "score"
        );

    const progress =
        document.getElementById(
            "progress-bar"
        );


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
            `${(
                score /
                MAX_HEARTS
            ) * 100}%`;

    }

}


function endGame(
    isWin
) {

    clearInterval(
        gameTimer
    );

    clearInterval(
        heartSpawner
    );

    gameTimer = null;
    heartSpawner = null;


    const gamePlay =
        document.getElementById(
            "game-play"
        );

    const gameArea =
        document.getElementById(
            "game-area"
        );


    if (gamePlay) {

        gamePlay.classList.remove(
            "show"
        );

    }


    if (gameArea) {

        gameArea.innerHTML = "";

    }


    if (isWin) {

        playWin();

        const win =
            document.getElementById(
                "game-win"
            );

        if (win) {

            win.classList.add(
                "show"
            );

        }

    } else {

        playLose();

        const lose =
            document.getElementById(
                "game-lose"
            );

        if (lose) {

            lose.classList.add(
                "show"
            );

        }

    }

}


/* =========================================================
   TYPING STORY
========================================================= */

const storyTexts = [

    "Diky sebenarnya nggak pernah merencanakan semua ini.",

    "Tapi ada beberapa orang yang datang dengan cara sederhana, lalu tanpa sadar meninggalkan cerita yang sulit dilupakan.",

    "Dan buat Diky, salah satu orang itu adalah Chelyn."

];


async function typeStory() {

    const elements = [
        "type-text1",
        "type-text2",
        "type-text3"
    ];


    for (
        let i = 0;
        i < storyTexts.length;
        i++
    ) {

        await typeLine(
            elements[i],
            storyTexts[i]
        );

        await wait(750);

    }


    showElement(
        "s4-btn",
        500
    );

}


function typeLine(
    elementId,
    text
) {

    return new Promise(
        resolve => {

            const element =
                document.getElementById(
                    elementId
                );

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

                }, 38);

        }
    );

}


/* =========================================================
   TAP GLOW
========================================================= */

document.addEventListener(
    "pointerdown",
    event => {

        if (
            event.target.closest(
                ".glass-btn"
            ) ||
            event.target.closest(
                ".catch-heart"
            ) ||
            event.target.closest(
                ".envelope"
            )
        ) {
            return;
        }

        createTapGlow(
            event.clientX,
            event.clientY
        );

    }
);


function createTapGlow(
    x,
    y
) {

    const glow =
        document.createElement(
            "div"
        );

    glow.style.position =
        "fixed";

    glow.style.left =
        `${x}px`;

    glow.style.top =
        `${y}px`;

    glow.style.width =
        "5px";

    glow.style.height =
        "5px";

    glow.style.borderRadius =
        "50%";

    glow.style.pointerEvents =
        "none";

    glow.style.zIndex =
        "999";

    glow.style.background =
        "#ffd8e7";

    glow.style.boxShadow =
        "0 0 20px #ffb6d2, 0 0 40px rgba(255,170,205,.5)";

    glow.style.transform =
        "translate(-50%, -50%)";

    glow.style.transition =
        "transform .6s ease, opacity .6s ease";


    document.body.appendChild(
        glow
    );


    requestAnimationFrame(() => {

        glow.style.transform =
            "translate(-50%, -50%) scale(7)";

        glow.style.opacity =
            "0";

    });


    setTimeout(() => {

        glow.remove();

    }, 650);

}


/* =========================================================
   WHATSAPP
========================================================= */

function balasWa() {

    const message =
        "Chelyn, makasih sudah sampai di akhir cerita ini. 🤍";

    const url =
        `https://wa.me/?text=${encodeURIComponent(
            message
        )}`;

    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   FINAL SOUND
========================================================= */

function finalMessage() {

    playTone(
        659.25,
        0.5,
        0.05,
        "triangle"
    );

    setTimeout(() => {

        playTone(
            783.99,
            0.5,
            0.05,
            "triangle"
        );

    }, 150);


    setTimeout(() => {

        playTone(
            1046.50,
            0.8,
            0.06,
            "triangle"
        );

    }, 300);

}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const firstScene =
            document.getElementById(
                "scene1"
            );

        if (firstScene) {

            firstScene.classList.add(
                "active"
            );

        }

        createParticles();

        /*
         * Coba autoplay.
         */

        setTimeout(() => {

            startMusic();

        }, 600);

    }
);


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            toggleMusic();

        }

    }
);


/* =========================================================
   VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {
            return;
        }

        if (
            bgm &&
            bgm.paused &&
            isMusicPlaying
        ) {

            bgm.play()
                .catch(() => {});

        }

    }
);


/* =========================================================
   MOBILE TOUCH
========================================================= */

let lastTouchEnd = 0;

document.addEventListener(
    "touchend",
    event => {

        const now =
            Date.now();

        if (
            now - lastTouchEnd <= 300
        ) {

            event.preventDefault();

        }

        lastTouchEnd = now;

    },
    {
        passive: false
    }
);


/* =========================================================
   START
========================================================= */

createParticles();

console.log(
    "Diky × Chelyn Premium Story loaded."
);