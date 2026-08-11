/* =========================================================
   LOVE FOR CHELYN — PREMIUM SCRIPT
   Diky × Chelyn
   10 CHAPTERS
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const bgm = document.getElementById("bgm");

const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const visualizer = document.getElementById("visualizer");

let musicStarted = false;
let audioContext = null;
let analyser = null;
let source = null;
let animationFrame = null;

let currentScene = 1;

let gameTimer = null;
let heartSpawner = null;

let score = 0;
let timeLeft = 15;

const MAX_SCORE = 20;


/* =========================================================
   AUDIO ENGINE
========================================================= */

function initAudio() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) return false;

        audioContext = new AudioContext();

        try {

            source =
                audioContext.createMediaElementSource(bgm);

            analyser =
                audioContext.createAnalyser();

            analyser.fftSize = 64;

            analyser.smoothingTimeConstant = 0.75;

            source.connect(analyser);

            analyser.connect(audioContext.destination);

        } catch (error) {

            console.log("Audio analyser:", error);

        }
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    return true;
}


/* =========================================================
   START MUSIC
========================================================= */

async function startMusic() {

    initAudio();

    if (!bgm) return;

    try {

        bgm.volume = 0.48;

        await bgm.play();

        musicStarted = true;

        setMusicUI(true);

        startVisualizer();

    } catch (error) {

        console.log("Music blocked:", error);

        /*
         * Browser masih memblokir audio.
         * User cukup menekan tombol musik.
         */

        setMusicUI(false);
    }
}


/* =========================================================
   STOP MUSIC
========================================================= */

function stopMusic() {

    if (!bgm) return;

    bgm.pause();

    musicStarted = false;

    setMusicUI(false);

    stopVisualizer();
}


/* =========================================================
   MUSIC TOGGLE
========================================================= */

function toggleMusic() {

    if (!musicStarted) {

        startMusic();

    } else {

        stopMusic();

    }
}


/* =========================================================
   MUSIC UI
========================================================= */

function setMusicUI(playing) {

    if (!musicButton) return;

    if (playing) {

        musicButton.classList.add("playing");

        if (musicIcon) {
            musicIcon.textContent = "♫";
        }

        musicButton.setAttribute(
            "aria-label",
            "Pause music"
        );

    } else {

        musicButton.classList.remove("playing");

        if (musicIcon) {
            musicIcon.textContent = "♪";
        }

        musicButton.setAttribute(
            "aria-label",
            "Play music"
        );
    }
}


/* =========================================================
   REAL AUDIO VISUALIZER
========================================================= */

function startVisualizer() {

    if (!visualizer) return;

    visualizer.classList.add("active");

    const bars =
        visualizer.querySelectorAll("i");

    if (!analyser) {

        return;

    }

    const data =
        new Uint8Array(
            analyser.frequencyBinCount
        );


    function animate() {

        if (!musicStarted) return;

        analyser.getByteFrequencyData(data);

        const average =
            data.reduce(
                (sum, value) => sum + value,
                0
            ) / data.length;


        bars.forEach((bar, index) => {

            const position =
                Math.floor(
                    (index / bars.length) *
                    data.length
                );

            const value =
                data[position] || average;

            const height =
                4 +
                (value / 255) * 19;

            bar.style.height =
                `${height}px`;

            bar.style.opacity =
                `${0.45 + (value / 255) * 0.55}`;

        });


        animationFrame =
            requestAnimationFrame(animate);
    }


    animate();
}


/* =========================================================
   STOP VISUALIZER
========================================================= */

function stopVisualizer() {

    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;
    }

    if (visualizer) {

        visualizer.classList.remove(
            "active"
        );

        visualizer
            .querySelectorAll("i")
            .forEach(bar => {

                bar.style.height = "5px";
                bar.style.opacity = "0.7";

            });
    }
}


/* =========================================================
   BUTTON
========================================================= */

if (musicButton) {

    musicButton.addEventListener(
        "click",
        toggleMusic
    );
}


/* =========================================================
   SOFT SOUND EFFECTS
========================================================= */

function ensureAudioContext() {

    initAudio();
}


function playTone(
    frequency = 520,
    duration = 0.08,
    volume = 0.035
) {

    if (!audioContext) return;

    const osc =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    osc.type = "sine";

    osc.frequency.value =
        frequency;


    gain.gain.setValueAtTime(
        0,
        audioContext.currentTime
    );

    gain.gain.linearRampToValueAtTime(
        volume,
        audioContext.currentTime + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
    );


    osc.connect(gain);

    gain.connect(
        audioContext.destination
    );


    osc.start();

    osc.stop(
        audioContext.currentTime +
        duration
    );
}


/* =========================================================
   KEYBOARD TYPING SOUND
========================================================= */

let lastKeySound = 0;

function typingSound() {

    if (!audioContext) return;

    const now =
        performance.now();

    if (now - lastKeySound < 38) {
        return;
    }

    lastKeySound = now;

    const notes = [
        410,
        470,
        520
    ];

    const note =
        notes[
            Math.floor(
                Math.random() *
                notes.length
            )
        ];

    playTone(
        note,
        0.045,
        0.018
    );
}


/* =========================================================
   ENVELOPE SOUND
========================================================= */

function envelopeSound() {

    ensureAudioContext();

    if (!audioContext) return;

    const notes = [
        392,
        494,
        587,
        784
    ];


    notes.forEach(
        (frequency, index) => {

            setTimeout(() => {

                playTone(
                    frequency,
                    0.32,
                    0.035
                );

            }, index * 85);

        }
    );
}


/* =========================================================
   BUTTON SOUND
========================================================= */

function buttonSound() {

    if (!audioContext) return;

    playTone(
        560,
        0.07,
        0.025
    );
}


/* =========================================================
   PARTICLES
========================================================= */

function createParticles() {

    const container =
        document.getElementById(
            "particles"
        );

    if (!container) return;


    const amount =
        window.innerWidth < 500
            ? 26
            : 42;


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

        particle.style.animationDuration =
            `${8 + Math.random() * 12}s`;

        particle.style.animationDelay =
            `${Math.random() * 8}s`;

        particle.style.opacity =
            `${0.15 + Math.random() * 0.3}`;


        container.appendChild(
            particle
        );
    }
}

createParticles();


/* =========================================================
   SCENE MANAGEMENT
========================================================= */

function showScene(number) {

    document
        .querySelectorAll(".scene")
        .forEach(scene => {

            scene.classList.remove(
                "active"
            );

        });


    const target =
        document.getElementById(
            `scene${number}`
        );

    if (!target) return;


    target.classList.add("active");

    currentScene = number;

    buttonSound();


    setTimeout(() => {

        resetRevealAnimation(
            target
        );

    }, 100);
}


function resetRevealAnimation(scene) {

    const revealElements =
        scene.querySelectorAll(
            ".reveal"
        );


    revealElements.forEach(
        (element, index) => {

            element.style.transitionDelay =
                `${index * 180}ms`;

        }
    );
}


/* =========================================================
   GLOBAL NEXT SCENE
========================================================= */

function nextScene(number) {

    showScene(number);

}


/* =========================================================
   OPEN ENVELOPE
========================================================= */

function openEnvelope() {

    const envelope =
        document.getElementById(
            "envelope"
        );

    if (!envelope) return;


    ensureAudioContext();

    envelopeSound();


    /*
     * Ini bagian penting:
     * musik dimulai setelah user benar-benar
     * melakukan interaksi dengan surat.
     */

    startMusic();


    envelope.classList.add(
        "open"
    );


    setTimeout(() => {

        showScene(2);

    }, 1050);
}


/* =========================================================
   TYPING ENGINE
========================================================= */

function typeText(
    element,
    text,
    speed = 35
) {

    return new Promise(resolve => {

        if (!element) {

            resolve();

            return;

        }


        element.textContent = "";

        let index = 0;


        const cursor =
            document.createElement(
                "span"
            );

        cursor.className =
            "typing-cursor";

        cursor.textContent =
            "|";


        element.appendChild(
            cursor
        );


        const interval =
            setInterval(() => {

                if (index >= text.length) {

                    clearInterval(
                        interval
                    );

                    cursor.remove();

                    resolve();

                    return;
                }


                cursor.before(
                    document.createTextNode(
                        text.charAt(index)
                    )
                );


                if (
                    text.charAt(index)
                        .trim()
                ) {

                    typingSound();

                }


                index++;

            }, speed);

    });
}


/* =========================================================
   STORY TYPING
========================================================= */

async function playTypingStory() {

    const element =
        document.getElementById(
            "typingText"
        );

    if (!element) return;


    const story = `Kadang ada seseorang yang datang tanpa kita rencanakan.

Bukan karena dia paling sempurna.

Bukan juga karena semuanya selalu mudah.

Tapi karena ada sesuatu dari dirinya yang terasa berbeda.

Dan entah kenapa, buat Diky...
orang itu adalah Chelyn.`;


    await typeText(
        element,
        story,
        34
    );
}


/* =========================================================
   SCENE 4 AUTO TYPING
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const scene4 =
            document.getElementById(
                "scene4"
            );


        if (!scene4) return;


        const observer =
            new MutationObserver(() => {

                if (
                    scene4.classList.contains(
                        "active"
                    )
                ) {

                    if (
                        !scene4.dataset.played
                    ) {

                        scene4.dataset.played =
                            "true";

                        setTimeout(
                            playTypingStory,
                            500
                        );

                    }

                }

            });


        observer.observe(
            scene4,
            {
                attributes: true,
                attributeFilter: [
                    "class"
                ]
            }
        );

    }
);


/* =========================================================
   MINI GAME
========================================================= */

function startGame() {

    buttonSound();


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


    if (intro) {
        intro.classList.add("hidden");
    }

    if (result) {
        result.classList.add("hidden");
    }

    if (play) {
        play.classList.remove("hidden");
    }


    score = 0;

    timeLeft = 15;


    updateGameUI();


    const area =
        document.getElementById(
            "gameArea"
        );

    if (area) {
        area.innerHTML = "";
    }


    clearInterval(gameTimer);
    clearInterval(heartSpawner);


    gameTimer =
        setInterval(() => {

            timeLeft--;

            updateGameUI();


            if (timeLeft <= 0) {

                endGame(false);

            }

        }, 1000);


    heartSpawner =
        setInterval(
            spawnHeart,
            620
        );


    for (
        let i = 0;
        i < 3;
        i++
    ) {

        setTimeout(
            spawnHeart,
            i * 180
        );

    }
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


    const heart =
        document.createElement(
            "div"
        );


    /*
     * Pink heart agar sesuai
     * dengan tema website.
     */

    heart.textContent = "♥";

    heart.className =
        "catch-heart";


    heart.style.color =
        Math.random() > 0.5
            ? "#f3b8d0"
            : "#cbbdf5";


    const maxX =
        Math.max(
            0,
            area.clientWidth - 35
        );

    const maxY =
        Math.max(
            0,
            area.clientHeight - 35
        );


    heart.style.left =
        `${Math.random() * maxX}px`;

    heart.style.top =
        `${Math.random() * maxY}px`;


    let caught = false;


    function catchHeart(event) {

        event.preventDefault();

        event.stopPropagation();


        if (caught) return;

        caught = true;


        playTone(
            620,
            0.06,
            0.025
        );


        score++;


        updateGameUI();


        heart.remove();


        if (
            score >= MAX_SCORE
        ) {

            endGame(true);

        }

    }


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


    setTimeout(() => {

        if (heart.parentElement) {

            heart.remove();

        }

    }, 1450);
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
            `${(score / MAX_SCORE) * 100}%`;

    }
}


/* =========================================================
   END GAME
========================================================= */

function endGame(won) {

    clearInterval(
        gameTimer
    );

    clearInterval(
        heartSpawner
    );


    const play =
        document.getElementById(
            "gamePlay"
        );

    const result =
        document.getElementById(
            "gameResult"
        );

    const icon =
        document.getElementById(
            "gameResultIcon"
        );

    const title =
        document.getElementById(
            "gameResultTitle"
        );

    const text =
        document.getElementById(
            "gameResultText"
        );


    if (play) {

        play.classList.add(
            "hidden"
        );

    }


    if (result) {

        result.classList.remove(
            "hidden"
        );

    }


    if (won) {

        if (icon) {
            icon.textContent = "♥";
        }

        if (title) {
            title.textContent =
                "Kamu berhasil.";
        }

        if (text) {

            text.textContent =
                "Kalau hati sebanyak ini saja kamu mau tangkap, semoga kamu juga mau membaca cerita Diky sampai selesai.";

        }


        playTone(
            523,
            0.12,
            0.035
        );


        setTimeout(() => {

            playTone(
                659,
                0.12,
                0.035
            );

        }, 100);

        setTimeout(() => {

            playTone(
                784,
                0.18,
                0.035
            );

        }, 200);


    } else {

        if (icon) {
            icon.textContent = "·";
        }

        if (title) {
            title.textContent =
                "Belum berhasil.";
        }

        if (text) {

            text.textContent =
                "Tidak apa-apa. Coba sekali lagi. Ceritanya masih menunggu.";

        }

    }
}


/* =========================================================
   KEYBOARD / TYPING CLICK EFFECT
========================================================= */

document.addEventListener(
    "click",
    event => {

        const target =
            event.target.closest(
                "button"
            );

        if (!target) return;

        if (!audioContext) return;

        playTone(
            520,
            0.045,
            0.018
        );

    }
);


/* =========================================================
   AUTO MUSIC FALLBACK
========================================================= */

/*
 * Beberapa browser desktop mengizinkan
 * autoplay setelah halaman selesai.
 *
 * Di HP biasanya tidak.
 *
 * Kita mencoba sekali secara halus.
 * Kalau ditolak, musik tetap akan dimulai
 * ketika surat diklik.
 */

window.addEventListener(
    "load",
    () => {

        setTimeout(() => {

            if (!musicStarted) {

                bgm.play()
                    .then(() => {

                        musicStarted =
                            true;

                        initAudio();

                        setMusicUI(
                            true
                        );

                        startVisualizer();

                    })
                    .catch(() => {

                        /*
                         * Normal pada browser HP.
                         * Tidak dianggap error.
                         */

                    });

            }

        }, 500);

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
            musicStarted &&
            bgm.paused
        ) {

            bgm.play()
                .catch(() => {});

        }

    }
);


/* =========================================================
   PREVENT DOUBLE TOUCH
========================================================= */

document.addEventListener(
    "touchstart",
    () => {

        if (
            audioContext &&
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume();

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   INITIAL STATE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        showOnlyFirstScene();

    }
);


function showOnlyFirstScene() {

    const scenes =
        document.querySelectorAll(
            ".scene"
        );

    if (!scenes.length) return;


    scenes.forEach(
        (scene, index) => {

            scene.classList.toggle(
                "active",
                index === 0
            );

        }
    );

    currentScene = 1;
}


/* =========================================================
   OPTIONAL WHATSAPP
========================================================= */

function balasWa() {

    const message =
        "Aku sudah baca semuanya... 🤍";

    const url =
        `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(
        url,
        "_blank"
    );
}


/* =========================================================
   EXPOSE FUNCTIONS
   Untuk onclick dari HTML
========================================================= */

window.openEnvelope =
    openEnvelope;

window.nextScene =
    nextScene;

window.startGame =
    startGame;

window.endGame =
    endGame;

window.balasWa =
    balasWa;

window.toggleMusic =
    toggleMusic;