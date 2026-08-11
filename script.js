/* =========================================================
   LOVE FOR CHELYN — SCRIPT.JS
   PREMIUM • 10 CHAPTERS • LIGHTWEIGHT
   ========================================================= */
"use strict";

const bgm = document.getElementById("bgm");
const paperSound = document.getElementById("paperSound");

const envelope = document.getElementById("envelope");
const openLetterButton = document.getElementById("openLetterButton");
const musicVisualizer = document.getElementById("musicVisualizer");
const loveCorner = document.getElementById("loveCorner");
const chapterNumber = document.getElementById("chapterNumber");
const chapterLabel = document.getElementById("chapterLabel");
const progressFill = document.getElementById("progressFill");
const particles = document.getElementById("particles");

let currentScene = 1;
let letterOpened = false;
let musicStarted = false;
let typingStarted = false;
let typingTimer = null;

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

document.addEventListener("DOMContentLoaded", () => {
    createParticles();
    setupNavigation();
    setupEnvelope();
    updateChapterUI();
    revealCurrentScene();
});

function createParticles() {
    if (!particles) return;

    const amount = window.innerWidth < 500 ? 8 : 12;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < amount; i++) {
        const particle = document.createElement("span");
        particle.className = "particle";
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${9 + Math.random() * 9}s`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particle.style.opacity = `${0.12 + Math.random() * 0.24}`;
        fragment.appendChild(particle);
    }

    particles.appendChild(fragment);
}

function setupNavigation() {
    document.querySelectorAll(".next-button").forEach(button => {
        button.addEventListener("click", () => {
            const next = Number(button.dataset.next);
            if (next) goToScene(next);
        });
    });

    const replyButton = document.getElementById("replyButton");
    if (replyButton) {
        replyButton.addEventListener("click", () => {
            const phone = "6288229456210";
            const message =
                "Hai Diky, aku sudah baca suratnya sampai akhir. Aku nggak tahu harus jawab apa, tapi makasih sudah bikin semuanya seindah ini. ♡";

            const whatsappURL =
                `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

            window.location.href = whatsappURL;
        });
    }

    const backToStartButton = document.getElementById("backToStartButton");
    if (backToStartButton) {
        backToStartButton.addEventListener("click", () => {
            // Bab 1 dimulai setelah halaman amplop/surat.
            goToScene(2);
        });
    }
}

function setupEnvelope() {
    if (!envelope) return;

    envelope.addEventListener("click", openLetter);

    envelope.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openLetter();
        }
    });

    if (openLetterButton) {
        openLetterButton.addEventListener("click", openLetter);
    }
}

function openLetter() {
    if (letterOpened) return;

    letterOpened = true;

    if (envelope) envelope.classList.add("open");

    playPaperSound();
    startMusic();

    if (loveCorner) loveCorner.classList.add("active");

    setTimeout(() => {
        goToScene(2);
    }, 850);
}

function playPaperSound() {
    if (!paperSound) return;

    try {
        paperSound.pause();
        paperSound.currentTime = 0;
        paperSound.volume = 0.72;

        const promise = paperSound.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(() => {});
        }
    } catch (_) {}
}

function startMusic() {
    if (!bgm || musicStarted) return;

    bgm.volume = 0.42;

    const playPromise = bgm.play();

    if (playPromise && typeof playPromise.then === "function") {
        playPromise
            .then(() => {
                musicStarted = true;
                setMusicVisualizer(true);
            })
            .catch(() => {
                musicStarted = false;
                setMusicVisualizer(false);
            });
    }
}

document.addEventListener("visibilitychange", () => {
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
});

function setMusicVisualizer(active) {
    if (musicVisualizer) {
        musicVisualizer.classList.toggle("active", active);
    }
}

function goToScene(number) {
    if (number < 1 || number > 10 || number === currentScene) return;

    const oldScene = document.getElementById(`scene${currentScene}`);
    const newScene = document.getElementById(`scene${number}`);
    if (!newScene) return;

    if (oldScene) {
        oldScene.classList.remove("active");
        oldScene.querySelectorAll(".reveal").forEach(el => {
            el.classList.remove("visible");
        });
    }

    currentScene = number;
    newScene.classList.add("active");
    newScene.scrollTop = 0;

    updateChapterUI();

    setTimeout(() => revealCurrentScene(), 80);

    if (number === 7) {
        startTypingScene();
    } else {
        stopTypingScene();
    }
}

function updateChapterUI() {
    if (chapterNumber) {
        chapterNumber.textContent =
            `${String(currentScene).padStart(2, "0")} / 10`;
    }

    if (chapterLabel) {
        // Bab 10 tidak menampilkan label "FOR CHELYN" agar header tetap bersih.
        chapterLabel.textContent =
            currentScene === 10
                ? ""
                : (chapterLabels[currentScene - 1] || "THE LETTER");
    }

    if (progressFill) {
        progressFill.style.width = `${currentScene * 10}%`;
    }
}

function revealCurrentScene() {
    const scene = document.getElementById(`scene${currentScene}`);
    if (!scene) return;

    scene.querySelectorAll(".reveal").forEach((element, index) => {
        setTimeout(() => {
            if (scene.classList.contains("active")) {
                element.classList.add("visible");
            }
        }, 100 + index * 75);
    });
}

function startTypingScene() {
    if (typingStarted) return;

    typingStarted = true;

    const line1 = document.getElementById("typeLine1");
    const line2 = document.getElementById("typeLine2");
    const line3 = document.getElementById("typeLine3");
    const button = document.getElementById("scene7Button");

    if (!line1 || !line2 || !line3) return;

    line1.textContent = "";
    line2.textContent = "";
    line3.textContent = "";

    if (button) button.classList.add("hidden");

    const text1 =
        "Mungkin selama ini Diky nggak selalu bisa menjelaskan semuanya.";
    const text2 =
        "Tapi semakin mengenal Chelyn, semakin banyak hal kecil yang terasa berarti.";
    const text3 =
        "Dan kalau harus jujur... kamu adalah seseorang yang ingin Diky simpan sebagai cerita yang indah.";

    typeText(line1, text1, 32, () => {
        typeText(line2, text2, 30, () => {
            typeText(line3, text3, 38, () => {
                if (button) {
                    setTimeout(() => {
                        button.classList.remove("hidden");
                        button.classList.add("visible");
                    }, 400);
                }
            });
        });
    });
}

function typeText(element, text, speed, finished) {
    let index = 0;
    element.textContent = "";

    function typeNext() {
        if (currentScene !== 7) return;

        if (index >= text.length) {
            if (typeof finished === "function") finished();
            return;
        }

        element.textContent += text.charAt(index);
        index++;

        typingTimer = setTimeout(typeNext, speed);
    }

    typeNext();
}

function stopTypingScene() {
    if (typingTimer) {
        clearTimeout(typingTimer);
        typingTimer = null;
    }

    typingStarted = false;
}

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", event => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, { passive: true });

document.addEventListener("touchend", event => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (
        Math.abs(deltaX) < 70 ||
        Math.abs(deltaX) < Math.abs(deltaY) * 1.3
    ) return;

    if (deltaX < 0 && currentScene < 10) {
        goToScene(currentScene + 1);
    } else if (deltaX > 0 && currentScene > 1) {
        goToScene(currentScene - 1);
    }
}, { passive: true });

let lastTouchEnd = 0;

document.addEventListener("touchend", event => {
    const now = Date.now();

    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }

    lastTouchEnd = now;
}, { passive: false });

document.addEventListener("keydown", event => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        if (currentScene < 10) goToScene(currentScene + 1);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        if (currentScene > 1) goToScene(currentScene - 1);
    }
});

if (bgm) bgm.volume = 0.42;
if (paperSound) paperSound.volume = 0.72;
