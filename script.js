/* =========================================================
   LOVE FOR CHELYN — SCRIPT.JS
   PREMIUM • 10 CHAPTERS • LIGHTWEIGHT
   ========================================================= */

"use strict";


/* =========================================================
   ELEMENTS
   ========================================================= */

const bgm = document.getElementById("bgm");
const keyboardSound = document.getElementById("keyboardSound");

const envelope = document.getElementById("envelope");
const openLetterButton = document.getElementById("openLetterButton");

const musicVisualizer =
    document.getElementById("musicVisualizer");

const loveCorner =
    document.getElementById("loveCorner");

const chapterNumber =
    document.getElementById("chapterNumber");

const chapterLabel =
    document.getElementById("chapterLabel");

const progressFill =
    document.getElementById("progressFill");

const particles =
    document.getElementById("particles");


/* =========================================================
   STATE
   ========================================================= */

let currentScene = 1;

let letterOpened = false;
let musicStarted = false;

let typingStarted = false;
let typingTimer = null;

let keyboardUnlocked = false;


/* =========================================================
   CHAPTER LABELS
   ========================================================= */

const chapterLabels = [
    "THE LETTER",
    "THE BEGINNING",
    "ABOUT CHELYN",
    "LITTLE THINGS",
    "HER FUNNY SIDE",
    "WHY YOU",
    "THE CONFESSION",
    "THANK YOU",
    "ONE LAST THING",
    "FOR CHELYN"
];


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    createParticles();

    setupRevealObserver();

    setupNavigation();

    setupEnvelope();

    setupKeyboardSound();

    updateChapterUI();

    revealCurrentScene();

});


/* =========================================================
   PARTICLES
   ========================================================= */

function createParticles() {

    if (!particles) return;

    const amount =
        window.innerWidth < 500 ? 10 : 16;

    const fragment =
        document.createDocumentFragment();

    for (let i = 0; i < amount; i++) {

        const particle =
            document.createElement("span");

        particle.className = "particle";

        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.animationDuration =
            `${8 + Math.random() * 10}s`;

        particle.style.animationDelay =
            `${Math.random() * 8}s`;

        particle.style.opacity =
            `${0.15 + Math.random() * 0.3}`;

        fragment.appendChild(particle);
    }

    particles.appendChild(fragment);
}


/* =========================================================
   REVEAL ANIMATION
   ========================================================= */

function setupRevealObserver() {

    if (!("IntersectionObserver" in window)) {

        document
            .querySelectorAll(".reveal")
            .forEach(el => {
                el.classList.add("visible");
            });

        return;
    }

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting &&
                        entry.target.closest(".scene.active")
                    ) {

                        entry.target.classList.add("visible");
                    }
                });

            },
            {
                threshold: 0.05
            }
        );

    document
        .querySelectorAll(".reveal")
        .forEach(el => observer.observe(el));
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    document
        .querySelectorAll(".next-button")
        .forEach(button => {

            button.addEventListener("click", () => {

                const next =
                    Number(button.dataset.next);

                if (!next) return;

                goToScene(next);
            });
        });


    const replyButton =
        document.getElementById("replyButton");

    if (replyButton) {

        replyButton.addEventListener("click", () => {

            /*
             * Tidak memaksa membuka aplikasi tertentu.
             * Kamu bisa mengganti bagian ini nanti
             * dengan link WhatsApp / Instagram / dll.
             */

            replyButton.innerHTML =
                `Terima kasih sudah membaca <span>♥</span>`;

            replyButton.disabled = true;
        });
    }
}


/* =========================================================
   ENVELOPE
   ========================================================= */

function setupEnvelope() {

    if (!envelope) return;

    envelope.addEventListener("click", openLetter);

    envelope.addEventListener("keydown", event => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            openLetter();
        }
    });


    if (openLetterButton) {

        openLetterButton.addEventListener(
            "click",
            openLetter
        );
    }
}


/* =========================================================
   OPEN LETTER
   ========================================================= */

function openLetter() {

    if (letterOpened) return;

    letterOpened = true;

    envelope.classList.add("open");

    /*
     * Keyboard audio di-unlock melalui
     * interaksi pengguna pertama.
     */

    unlockKeyboardAudio();

    /*
     * Musik mulai setelah surat dibuka.
     */

    startMusic();

    /*
     * Love kecil muncul di kiri atas.
     */

    if (loveCorner) {
        loveCorner.classList.add("active");
    }

    /*
     * Beri sedikit waktu agar animasi surat
     * selesai sebelum pindah halaman.
     */

    setTimeout(() => {

        goToScene(2);

    }, 850);
}


/* =========================================================
   MUSIC
   ========================================================= */

function startMusic() {

    if (!bgm || musicStarted) return;

    musicStarted = true;

    bgm.volume = 0.42;

    const playPromise =
        bgm.play();

    if (
        playPromise &&
        typeof playPromise.catch === "function"
    ) {

        playPromise
            .then(() => {

                setMusicVisualizer(true);

            })
            .catch(() => {

                /*
                 * Browser masih dapat menolak audio
                 * pada kondisi tertentu.
                 * Tombol/interaksi berikutnya akan
                 * mencoba lagi.
                 */

                musicStarted = false;

                setMusicVisualizer(false);
            });
    }
}


/* =========================================================
   RESUME MUSIC IF BROWSER PAUSES IT
   ========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState === "visible" &&
            letterOpened &&
            bgm &&
            bgm.paused
        ) {

            bgm.play()
                .then(() => {
                    musicStarted = true;
                    setMusicVisualizer(true);
                })
                .catch(() => {});
        }
    }
);


/* =========================================================
   MUSIC VISUALIZER
   ========================================================= */

function setMusicVisualizer(active) {

    if (!musicVisualizer) return;

    musicVisualizer.classList.toggle(
        "active",
        active
    );
}


/* =========================================================
   KEYBOARD AUDIO
   ========================================================= */

function setupKeyboardSound() {

    if (!keyboardSound) return;

    keyboardSound.volume = 0.24;

    /*
     * Pastikan keyboard.mp3 tidak berjalan
     * sendiri saat halaman dibuka.
     */

    keyboardSound.pause();

    keyboardSound.currentTime = 0;
}


function unlockKeyboardAudio() {

    if (keyboardUnlocked) return;

    keyboardUnlocked = true;

    if (!keyboardSound) return;

    /*
     * Memutar sebentar lalu pause.
     * Ini membantu membuka izin audio
     * setelah interaksi pengguna.
     */

    keyboardSound.volume = 0;

    const promise =
        keyboardSound.play();

    if (
        promise &&
        typeof promise.then === "function"
    ) {

        promise
            .then(() => {

                keyboardSound.pause();

                keyboardSound.currentTime = 0;

                keyboardSound.volume = 0.24;
            })
            .catch(() => {

                keyboardSound.volume = 0.24;
            });
    }
}


/* =========================================================
   KEYBOARD SOUND — SHORT EFFECT
   ========================================================= */

function playKeyboardSound() {

    if (!keyboardSound) return;

    try {

        keyboardSound.pause();

        keyboardSound.currentTime = 0;

        keyboardSound.volume = 0.24;

        const promise =
            keyboardSound.play();

        if (
            promise &&
            typeof promise.catch === "function"
        ) {
            promise.catch(() => {});
        }

    } catch (error) {
        /*
         * Audio tidak boleh menghentikan
         * jalannya website.
         */
    }
}


/* =========================================================
   GO TO SCENE
   ========================================================= */

function goToScene(number) {

    if (
        number < 1 ||
        number > 10 ||
        number === currentScene
    ) {
        return;
    }

    const oldScene =
        document.getElementById(
            `scene${currentScene}`
        );

    const newScene =
        document.getElementById(
            `scene${number}`
        );

    if (!newScene) return;

    if (oldScene) {

        oldScene.classList.remove("active");

        oldScene
            .querySelectorAll(".reveal")
            .forEach(el => {
                el.classList.remove("visible");
            });
    }

    currentScene = number;

    newScene.classList.add("active");

    updateChapterUI();

    /*
     * Scroll kembali ke bagian atas
     * setiap kali masuk bab baru.
     */

    newScene.scrollTop = 0;

    setTimeout(() => {

        revealCurrentScene();

    }, 80);


    /*
     * Bab 7 memiliki efek typing khusus.
     */

    if (number === 7) {

        startTypingScene();

    } else {

        stopTypingScene();
    }
}


/* =========================================================
   CHAPTER UI
   ========================================================= */

function updateChapterUI() {

    if (chapterNumber) {

        chapterNumber.textContent =
            `${String(currentScene).padStart(2, "0")} / 10`;
    }

    if (chapterLabel) {

        chapterLabel.textContent =
            chapterLabels[currentScene - 1] ||
            "THE LETTER";
    }

    if (progressFill) {

        progressFill.style.width =
            `${currentScene * 10}%`;
    }
}


/* =========================================================
   REVEAL CURRENT SCENE
   ========================================================= */

function revealCurrentScene() {

    const scene =
        document.getElementById(
            `scene${currentScene}`
        );

    if (!scene) return;

    const elements =
        scene.querySelectorAll(".reveal");

    elements.forEach((element, index) => {

        setTimeout(() => {

            if (
                scene.classList.contains("active")
            ) {

                element.classList.add("visible");
            }

        }, 100 + index * 90);
    });
}


/* =========================================================
   CHAPTER 7 — TYPING
   ========================================================= */

function startTypingScene() {

    if (typingStarted) return;

    typingStarted = true;

    const line1 =
        document.getElementById("typeLine1");

    const line2 =
        document.getElementById("typeLine2");

    const line3 =
        document.getElementById("typeLine3");

    const button =
        document.getElementById("scene7Button");

    if (!line1 || !line2 || !line3) return;

    line1.textContent = "";
    line2.textContent = "";
    line3.textContent = "";

    if (button) {
        button.classList.add("hidden");
    }


    const text1 =
        "Mungkin selama ini Diky nggak selalu bisa menjelaskan semuanya.";

    const text2 =
        "Tapi semakin mengenal Chelyn, semakin banyak hal kecil yang terasa berarti.";

    const text3 =
        "Dan kalau harus jujur... kamu adalah seseorang yang ingin Diky simpan sebagai cerita yang indah.";


    typeText(
        line1,
        text1,
        32,
        () => {

            typeText(
                line2,
                text2,
                30,
                () => {

                    typeText(
                        line3,
                        text3,
                        38,
                        () => {

                            if (button) {

                                setTimeout(() => {

                                    button.classList.remove(
                                        "hidden"
                                    );

                                    button.classList.add(
                                        "visible"
                                    );

                                }, 400);
                            }

                        }
                    );

                }
            );

        }
    );
}


/* =========================================================
   TYPE TEXT
   ========================================================= */

function typeText(
    element,
    text,
    speed,
    finished
) {

    let index = 0;

    element.textContent = "";

    function typeNext() {

        if (
            currentScene !== 7
        ) {

            return;
        }

        if (index >= text.length) {

            if (typeof finished === "function") {
                finished();
            }

            return;
        }

        element.textContent +=
            text.charAt(index);

        index++;

        /*
         * Tidak memainkan suara untuk
         * setiap karakter karena itu justru
         * bisa membuat audio berat.
         *
         * Suara keyboard dimainkan secara
         * berkala sehingga terasa natural.
         */

        if (
            index % 3 === 0 ||
            text.charAt(index - 1) === " "
        ) {

            playKeyboardSound();
        }

        typingTimer =
            setTimeout(
                typeNext,
                speed
            );
    }

    typeNext();
}


/* =========================================================
   STOP TYPING
   ========================================================= */

function stopTypingScene() {

    if (typingTimer) {

        clearTimeout(typingTimer);

        typingTimer = null;
    }

    typingStarted = false;
}


/* =========================================================
   SWIPE NAVIGATION
   ========================================================= */

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener(
    "touchstart",
    event => {

        const touch =
            event.changedTouches[0];

        touchStartX =
            touch.clientX;

        touchStartY =
            touch.clientY;

    },
    { passive: true }
);


document.addEventListener(
    "touchend",
    event => {

        const touch =
            event.changedTouches[0];

        const deltaX =
            touch.clientX - touchStartX;

        const deltaY =
            touch.clientY - touchStartY;

        /*
         * Swipe hanya aktif jika gerakan
         * horizontal cukup jelas.
         */

        if (
            Math.abs(deltaX) < 70 ||
            Math.abs(deltaX) < Math.abs(deltaY) * 1.3
        ) {
            return;
        }

        if (deltaX < 0) {

            /*
             * Swipe kiri = lanjut
             */

            if (currentScene < 10) {

                goToScene(
                    currentScene + 1
                );
            }

        } else {

            /*
             * Swipe kanan = kembali
             */

            if (currentScene > 1) {

                goToScene(
                    currentScene - 1
                );
            }
        }

    },
    { passive: true }
);


/* =========================================================
   PREVENT DOUBLE TAP ZOOM
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
    { passive: false }
);


/* =========================================================
   KEYBOARD NAVIGATION
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "ArrowRight" ||
            event.key === "ArrowDown"
        ) {

            if (currentScene < 10) {

                goToScene(
                    currentScene + 1
                );
            }
        }

        if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowUp"
        ) {

            if (currentScene > 1) {

                goToScene(
                    currentScene - 1
                );
            }
        }
    }
);


/* =========================================================
   SAFETY — KEEP MUSIC QUIET ON LOAD
   ========================================================= */

if (bgm) {

    bgm.volume = 0.42;
}

if (keyboardSound) {

    keyboardSound.volume = 0.24;
}