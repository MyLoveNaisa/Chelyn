/* =========================================================
   LOVE FOR CHELYN
   PREMIUM STORY WEBSITE — SCRIPT.JS
   ========================================================= */


/* =========================================================
   GLOBAL
   ========================================================= */

let currentScene = 1;

let audioCtx = null;

let musicPlaying = false;
let envelopeOpened = false;

let score = 0;
let timeLeft = 15;

let gameTimer = null;
let heartSpawner = null;

const MAX_HEARTS = 20;


/* =========================================================
   ELEMENTS
   ========================================================= */

const bgm = document.getElementById("bgm");

const musicPlayer = document.getElementById("musicPlayer");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");

const chapterNumber = document.getElementById("chapterNumber");
const chapterLabel = document.getElementById("chapterLabel");


/* =========================================================
   AUDIO CONTEXT
   ========================================================= */

function initAudioContext() {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContext) return;

    if (!audioCtx) {
        audioCtx = new AudioContext();
    }

    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
}


/* =========================================================
   TYPING SOUND
   ========================================================= */

function playTypingSound() {

    initAudioContext();

    if (!audioCtx) return;

    const oscillator =
        audioCtx.createOscillator();

    const gain =
        audioCtx.createGain();

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.type = "sine";

    const frequency =
        620 + Math.random() * 180;

    oscillator.frequency.setValueAtTime(
        frequency,
        audioCtx.currentTime
    );

    gain.gain.setValueAtTime(
        0.018,
        audioCtx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.035
    );

    oscillator.start();

    oscillator.stop(
        audioCtx.currentTime + 0.04
    );
}


/* =========================================================
   POP SOUND
   ========================================================= */

function playPop() {

    initAudioContext();

    if (!audioCtx) return;

    const oscillator =
        audioCtx.createOscillator();

    const gain =
        audioCtx.createGain();

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
        520,
        audioCtx.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        1000,
        audioCtx.currentTime + 0.08
    );

    gain.gain.setValueAtTime(
        0.08,
        audioCtx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.09
    );

    oscillator.start();

    oscillator.stop(
        audioCtx.currentTime + 0.1
    );
}


/* =========================================================
   ENVELOPE SOUND
   ========================================================= */

function playEnvelopeSound() {

    initAudioContext();

    if (!audioCtx) return;

    const notes = [
        440,
        554.37,
        659.25,
        783.99
    ];

    notes.forEach((frequency, index) => {

        const oscillator =
            audioCtx.createOscillator();

        const gain =
            audioCtx.createGain();

        oscillator.connect(gain);
        gain.connect(audioCtx.destination);

        oscillator.type = "triangle";

        oscillator.frequency.value =
            frequency;

        const start =
            audioCtx.currentTime +
            index * 0.09;

        gain.gain.setValueAtTime(
            0.001,
            start
        );

        gain.gain.exponentialRampToValueAtTime(
            0.08,
            start + 0.04
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            start + 0.45
        );

        oscillator.start(start);

        oscillator.stop(
            start + 0.46
        );
    });
}


/* =========================================================
   WIN SOUND
   ========================================================= */

function playWin() {

    initAudioContext();

    if (!audioCtx) return;

    const notes = [
        523.25,
        659.25,
        783.99,
        1046.50
    ];

    notes.forEach((frequency, index) => {

        const oscillator =
            audioCtx.createOscillator();

        const gain =
            audioCtx.createGain();

        oscillator.connect(gain);
        gain.connect(audioCtx.destination);

        oscillator.type = "sine";

        oscillator.frequency.value =
            frequency;

        const start =
            audioCtx.currentTime +
            index * 0.11;

        gain.gain.setValueAtTime(
            0.001,
            start
        );

        gain.gain.linearRampToValueAtTime(
            0.08,
            start + 0.04
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            start + 0.35
        );

        oscillator.start(start);

        oscillator.stop(
            start + 0.36
        );
    });
}


/* =========================================================
   LOSE SOUND
   ========================================================= */

function playLose() {

    initAudioContext();

    if (!audioCtx) return;

    const oscillator =
        audioCtx.createOscillator();

    const gain =
        audioCtx.createGain();

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
        330,
        audioCtx.currentTime
    );

    oscillator.frequency.linearRampToValueAtTime(
        160,
        audioCtx.currentTime + 0.35
    );

    gain.gain.setValueAtTime(
        0.06,
        audioCtx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.4
    );

    oscillator.start();

    oscillator.stop(
        audioCtx.currentTime + 0.41
    );
}


/* =========================================================
   MUSIC
   ========================================================= */

async function startMusic() {

    if (!bgm) return;

    initAudioContext();

    try {

        bgm.volume = 0.38;

        bgm.loop = true;

        await bgm.play();

        musicPlaying = true;

        updateMusicUI();

    } catch (error) {

        console.log(
            "Autoplay/music error:",
            error
        );

        /*
         * Karena musik dipanggil setelah interaksi
         * pengguna pada surat, browser biasanya
         * mengizinkan playback.
         */
    }
}


function pauseMusic() {

    if (!bgm) return;

    bgm.pause();

    musicPlaying = false;

    updateMusicUI();
}


async function toggleMusic() {

    if (musicPlaying) {

        pauseMusic();

    } else {

        await startMusic();

    }
}


function updateMusicUI() {

    if (!musicPlayer) return;

    if (musicPlaying) {

        musicPlayer.classList.add("playing");

        musicIcon.textContent = "Ⅱ";

    } else {

        musicPlayer.classList.remove("playing");

        musicIcon.textContent = "♪";

    }
}


if (musicButton) {

    musicButton.addEventListener(
        "click",
        toggleMusic
    );

}


/* =========================================================
   PARTICLES
   ========================================================= */

function createParticles() {

    const container =
        document.getElementById("particles");

    if (!container) return;

    const amount =
        window.innerWidth < 500 ? 24 : 38;

    for (let i = 0; i < amount; i++) {

        const particle =
            document.createElement("span");

        particle.className =
            "particle";

        particle.style.left =
            Math.random() * 100 + "%";

        const size =
            Math.random() * 2.5 + 1;

        particle.style.width =
            size + "px";

        particle.style.height =
            size + "px";

        particle.style.animationDuration =
            Math.random() * 9 + 7 + "s";

        particle.style.animationDelay =
            Math.random() * 8 + "s";

        container.appendChild(particle);
    }
}

createParticles();


/* =========================================================
   CHAPTER DATA
   ========================================================= */

const chapterData = {

    1: {
        number: "01",
        label: "Untuk Chelyn"
    },

    2: {
        number: "02",
        label: "Awal"
    },

    3: {
        number: "03",
        label: "Tentang Kamu"
    },

    4: {
        number: "04",
        label: "Hal-Hal Kecil"
    },

    5: {
        number: "05",
        label: "Sebelum Lanjut"
    },

    6: {
        number: "06",
        label: "Yang Dikagumi"
    },

    7: {
        number: "07",
        label: "Yang Sulit Diucapkan"
    },

    8: {
        number: "08",
        label: "Dari Diky"
    },

    9: {
        number: "09",
        label: "Terima Kasih"
    },

    10: {
        number: "10",
        label: "Untuk Terakhir Kali"
    }

};


/* =========================================================
   UPDATE CHAPTER
   ========================================================= */

function updateChapter(sceneId) {

    const data =
        chapterData[sceneId];

    if (!data) return;

    if (chapterNumber) {
        chapterNumber.textContent =
            data.number;
    }

    if (chapterLabel) {
        chapterLabel.textContent =
            data.label;
    }
}


/* =========================================================
   RESET SCENE ANIMATIONS
   ========================================================= */

function resetSceneAnimations(scene) {

    if (!scene) return;

    scene.querySelectorAll(
        ".reveal"
    ).forEach(element => {

        element.classList.remove(
            "show"
        );

    });
}


/* =========================================================
   SCENE CHANGE
   ========================================================= */

function nextScene(sceneId) {

    if (sceneId < 1 || sceneId > 10) {
        return;
    }

    playPop();

    document
        .querySelectorAll(".scene")
        .forEach(scene => {

            scene.classList.remove(
                "active"
            );

        });

    const next =
        document.getElementById(
            "scene" + sceneId
        );

    if (!next) return;

    resetSceneAnimations(next);

    next.classList.add("active");

    currentScene =
        sceneId;

    updateChapter(sceneId);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    triggerScene(sceneId);
}


/* =========================================================
   SCENE ANIMATIONS
   ========================================================= */

function triggerScene(sceneId) {

    const scene =
        document.getElementById(
            "scene" + sceneId
        );

    if (!scene) return;


    /* -----------------------------------------
       Standard reveal scenes
       ----------------------------------------- */

    if (
        sceneId === 2 ||
        sceneId === 3 ||
        sceneId === 4 ||
        sceneId === 6 ||
        sceneId === 8 ||
        sceneId === 9 ||
        sceneId === 10
    ) {

        const elements =
            scene.querySelectorAll(
                ".reveal"
            );

        elements.forEach(
            (element, index) => {

                setTimeout(
                    () => {

                        element.classList.add(
                            "show"
                        );

                    },
                    350 + index * 180
                );

            }
        );

    }


    /* -----------------------------------------
       Chapter 7 typing
       ----------------------------------------- */

    if (sceneId === 7) {

        startChapterSevenTyping();

    }

}


/* =========================================================
   OPEN ENVELOPE
   ========================================================= */

function openEnvelope() {

    if (envelopeOpened) return;

    envelopeOpened = true;

    initAudioContext();

    playEnvelopeSound();

    const envelope =
        document.getElementById(
            "envelope"
        );

    if (envelope) {
        envelope.classList.add("open");
    }

    /*
     * Musik dimulai tepat setelah
     * pengguna menekan surat.
     */

    startMusic();

    /*
     * Tunggu animasi surat selesai
     * sebelum pindah ke Bab 2.
     */

    setTimeout(
        () => {

            nextScene(2);

        },
        1150
    );
}


/* =========================================================
   KEYBOARD SUPPORT FOR ENVELOPE
   ========================================================= */

const envelope =
    document.getElementById(
        "envelope"
    );

if (envelope) {

    envelope.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                openEnvelope();

            }

        }
    );

}


/* =========================================================
   GAME
   ========================================================= */

function startGame() {

    playPop();

    clearInterval(gameTimer);
    clearInterval(heartSpawner);

    score = 0;
    timeLeft = 15;

    const intro =
        document.getElementById(
            "gameIntro"
        );

    const play =
        document.getElementById(
            "gamePlay"
        );

    const result =
        document.getElementById(
            "gameResult"
        );

    const area =
        document.getElementById(
            "gameArea"
        );

    if (intro) {
        intro.classList.add(
            "hidden"
        );
    }

    if (result) {
        result.classList.add(
            "hidden"
        );
    }

    if (play) {
        play.classList.remove(
            "hidden"
        );
    }

    if (area) {
        area.innerHTML = "";
    }

    updateGameUI();

    gameTimer =
        setInterval(
            () => {

                timeLeft--;

                updateGameUI();

                if (
                    timeLeft <= 0
                ) {

                    endGame(false);

                }

            },
            1000
        );

    heartSpawner =
        setInterval(
            spawnHeart,
            520
        );

    /*
     * Spawn langsung supaya
     * area game tidak kosong.
     */

    spawnHeart();
    spawnHeart();
}


/* =========================================================
   SPAWN HEART
   ========================================================= */

function spawnHeart() {

    const area =
        document.getElementById(
            "gameArea"
        );

    if (!area) return;

    if (
        score >= MAX_HEARTS
    ) return;

    const heart =
        document.createElement(
            "div"
        );

    heart.className =
        "catch-heart";

    heart.textContent =
        "♥";

    const maxX =
        Math.max(
            0,
            area.clientWidth - 40
        );

    const maxY =
        Math.max(
            0,
            area.clientHeight - 40
        );

    heart.style.left =
        Math.random() * maxX + "px";

    heart.style.top =
        Math.random() * maxY + "px";


    const catchHeart =
        event => {

            event.preventDefault();
            event.stopPropagation();

            if (
                !heart.parentElement
            ) return;

            playPop();

            score++;

            heart.remove();

            updateGameUI();

            if (
                score >= MAX_HEARTS
            ) {

                endGame(true);

            }

        };


    heart.addEventListener(
        "pointerdown",
        catchHeart,
        {
            passive: false
        }
    );


    area.appendChild(
        heart
    );


    setTimeout(
        () => {

            if (
                heart.parentElement
            ) {

                heart.remove();

            }

        },
        1300
    );
}


/* =========================================================
   GAME UI
   ========================================================= */

function updateGameUI() {

    const scoreElement =
        document.getElementById(
            "gameScore"
        );

    const timerElement =
        document.getElementById(
            "gameTimer"
        );

    const progress =
        document.getElementById(
            "progressBar"
        );

    if (scoreElement) {

        scoreElement.textContent =
            score;

    }

    if (timerElement) {

        timerElement.textContent =
            timeLeft;

    }

    if (progress) {

        progress.style.width =
            Math.min(
                100,
                (score / MAX_HEARTS) * 100
            ) + "%";

    }
}


/* =========================================================
   END GAME
   ========================================================= */

function endGame(isWin) {

    clearInterval(gameTimer);
    clearInterval(heartSpawner);

    gameTimer = null;
    heartSpawner = null;

    const play =
        document.getElementById(
            "gamePlay"
        );

    const result =
        document.getElementById(
            "gameResult"
        );

    const area =
        document.getElementById(
            "gameArea"
        );

    const title =
        document.getElementById(
            "gameResultTitle"
        );

    const text =
        document.getElementById(
            "gameResultText"
        );

    const icon =
        document.getElementById(
            "gameResultIcon"
        );

    if (play) {

        play.classList.add(
            "hidden"
        );

    }

    if (area) {

        area.innerHTML = "";

    }

    if (result) {

        result.classList.remove(
            "hidden"
        );

    }


    if (isWin) {

        playWin();

        if (icon) {
            icon.textContent = "♥";
        }

        if (title) {
            title.textContent =
                "Kamu berhasil.";
        }

        if (text) {

            text.textContent =
                "Ternyata kamu memang bisa menjaga sesuatu yang kecil sampai selesai. Sekarang lanjut, karena masih ada cerita yang belum Diky sampaikan.";

        }

    } else {

        playLose();

        if (icon) {
            icon.textContent = "♡";
        }

        if (title) {
            title.textContent =
                "Hampir.";
        }

        if (text) {

            text.textContent =
                "Nggak apa-apa. Coba sekali lagi. Ceritanya masih menunggu kamu.";

        }

    }
}


/* =========================================================
   CHAPTER 7 — TYPING STORY
   ========================================================= */

const chapterSevenLines = [

    {
        id: "typeLine1",
        text:
            "Diky sebenarnya nggak pandai mengatakan semuanya secara langsung."
    },

    {
        id: "typeLine2",
        text:
            "Kadang ada banyak hal yang ingin disampaikan, tapi ketika waktunya tiba, kata-katanya justru hilang."
    },

    {
        id: "typeLine3",
        text:
            "Jadi kali ini Diky memilih menuliskannya untuk Chelyn."
    }

];


async function startChapterSevenTyping() {

    const button =
        document.getElementById(
            "scene7Button"
        );

    if (button) {

        button.classList.add(
            "hidden"
        );

    }


    for (
        let i = 0;
        i < chapterSevenLines.length;
        i++
    ) {

        const line =
            chapterSevenLines[i];

        await typeText(
            line.id,
            line.text
        );

        await wait(
            600
        );

    }


    if (button) {

        button.classList.remove(
            "hidden"
        );

    }
}


/* =========================================================
   TYPE TEXT
   ========================================================= */

function typeText(
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

            element.classList.add(
                "typing-cursor"
            );

            let index = 0;

            const interval =
                setInterval(
                    () => {

                        element.textContent +=
                            text.charAt(index);

                        /*
                         * Efek keyboard dibuat
                         * ringan supaya tidak
                         * mengganggu musik.
                         */

                        if (
                            text.charAt(index) !==
                            " "
                        ) {

                            playTypingSound();

                        }

                        index++;

                        if (
                            index >=
                            text.length
                        ) {

                            clearInterval(
                                interval
                            );

                            setTimeout(
                                () => {

                                    element.classList.remove(
                                        "typing-cursor"
                                    );

                                    resolve();

                                },
                                300
                            );

                        }

                    },
                    38
                );

        }
    );
}


/* =========================================================
   WAIT
   ========================================================= */

function wait(milliseconds) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );
}


/* =========================================================
   WHATSAPP
   ========================================================= */

function balasWa() {

    const message =
        "Aku sudah baca semuanya. Terima kasih sudah bikin ini untuk aku 🤍";

    const url =
        "https://wa.me/?text=" +
        encodeURIComponent(
            message
        );

    window.open(
        url,
        "_blank"
    );
}


/* =========================================================
   INITIAL STATE
   ========================================================= */

updateChapter(1);


/*
 * Jangan menjalankan musik saat page load.
 *
 * Browser modern memblokir autoplay
 * audio yang tidak dipicu interaksi.
 *
 * Musik dimulai ketika pengguna
 * benar-benar menekan surat.
 */

console.log(
    "Love For Chelyn — ready."
);