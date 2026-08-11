/* =========================================================
   MUSIC ENGINE — AUTOPLAY + FALLBACK
========================================================= */

const bgm = document.getElementById("bgm");

let musicStarted = false;
let musicStarting = false;


/* ---------------------------------------------------------
   START MUSIC
--------------------------------------------------------- */

async function startMusic() {

    if (!bgm) {
        console.error("BGM ELEMENT TIDAK DITEMUKAN");
        return;
    }

    if (musicStarted || musicStarting) {
        return;
    }

    musicStarting = true;

    try {

        bgm.loop = true;
        bgm.volume = 0;

        /*
         * Paksa browser melakukan load audio.
         */
        bgm.load();

        await bgm.play();

        musicStarted = true;
        musicStarting = false;

        console.log("🎵 MUSIC PLAYING");

        /*
         * Fade in cinematic.
         */
        let volume = 0;

        const fade = setInterval(() => {

            volume += 0.02;

            if (volume >= 0.42) {

                volume = 0.42;
                clearInterval(fade);
            }

            bgm.volume = volume;

        }, 100);

        updateMusicUI();

    } catch (error) {

        musicStarting = false;

        console.log(
            "Autoplay diblokir browser:",
            error
        );

        updateMusicUI();
    }
}


/* ---------------------------------------------------------
   STOP MUSIC
--------------------------------------------------------- */

function stopMusic() {

    if (!bgm) return;

    bgm.pause();
    bgm.currentTime = 0;

    musicStarted = false;

    updateMusicUI();
}


/* ---------------------------------------------------------
   TOGGLE
--------------------------------------------------------- */

function toggleMusic() {

    if (!bgm) return;

    if (musicStarted) {

        stopMusic();

    } else {

        startMusic();
    }
}


/* ---------------------------------------------------------
   MUSIC UI
--------------------------------------------------------- */

function updateMusicUI() {

    const button =
        document.getElementById("music-toggle");

    const text =
        document.getElementById("music-text");

    if (!button || !text) return;

    if (musicStarted) {

        text.textContent = "PLAYING";

        button.classList.add("playing");

        button.setAttribute(
            "aria-label",
            "Pause music"
        );

    } else {

        text.textContent = "MUSIC";

        button.classList.remove("playing");

        button.setAttribute(
            "aria-label",
            "Play music"
        );
    }
}


/* =========================================================
   AUTOPLAY
========================================================= */

function attemptAutoplay() {

    /*
     * Coba langsung ketika halaman selesai dimuat.
     */
    startMusic();

}


/* =========================================================
   FIRST USER INTERACTION FALLBACK
========================================================= */

function musicFallback() {

    if (musicStarted) return;

    startMusic();
}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateMusicUI();

        /*
         * COBA AUTOPLAY LANGSUNG.
         */
        setTimeout(() => {

            attemptAutoplay();

        }, 300);


        /*
         * Kalau browser memblokir autoplay,
         * klik pertama akan menyalakan musik.
         */
        const events = [
            "pointerdown",
            "touchstart",
            "click",
            "keydown"
        ];

        events.forEach(event => {

            document.addEventListener(
                event,
                musicFallback,
                {
                    passive: true,
                    once: false
                }
            );

        });

    }
);


/* =========================================================
   ENVELOPE
========================================================= */

function openEnvelope() {

    /*
     * Klik surat juga menjadi fallback autoplay.
     */
    startMusic();

    if (typeof playEnvelopeSound === "function") {
        playEnvelopeSound();
    }

    const envelope =
        document.getElementById("envelope");

    if (envelope) {

        envelope.classList.add("open");
    }

    if (typeof createHeartBurst === "function") {
        createHeartBurst();
    }

    setTimeout(() => {

        if (typeof nextScene === "function") {
            nextScene(2);
        }

    }, 1700);
}


/* =========================================================
   EXPOSE
========================================================= */

window.startMusic = startMusic;
window.stopMusic = stopMusic;
window.toggleMusic = toggleMusic;
window.openEnvelope = openEnvelope;