/* =========================================================
   LOVE FOR CHELYN — SCRIPT
   MUSIC + PAPER SOUND + CHAPTER + ENVELOPE + TYPING
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const scenes = document.querySelectorAll(".scene");

    const envelope = document.getElementById("envelope");
    const openLetterButton =
        document.getElementById("openLetterButton");

    const music = document.getElementById("bgm");

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

    const scene7Button =
        document.getElementById("scene7Button");


    /* =====================================================
       PAPER SOUND
       File: asset/kertas.mp3
       ===================================================== */

    const paperSound = new Audio("asset/kertas.mp3");

    paperSound.preload = "auto";
    paperSound.volume = 0.85;


    /* =====================================================
       CHAPTER DATA
       ===================================================== */

    const chapterNames = {
        1: "THE LETTER",
        2: "THE BEGINNING",
        3: "ABOUT YOU",
        4: "LITTLE THINGS",
        5: "YOU",
        6: "WHY YOU",
        7: "CONFESSION",
        8: "THANK YOU",
        9: "ONE LAST THING",
        10: "FOR CHELYN"
    };


    /* =====================================================
       MUSIC
       ===================================================== */

    let musicStarted = false;

    function startMusic() {

        if (!music) return;

        music.volume = 0.38;

        const playPromise = music.play();

        if (playPromise !== undefined) {

            playPromise
                .then(() => {

                    musicStarted = true;

                    if (musicVisualizer) {
                        musicVisualizer.classList.add("active");
                    }

                })
                .catch(() => {

                    musicStarted = false;

                });

        }
    }


    /* =====================================================
       START MUSIC ON USER INTERACTION
       ===================================================== */

    function musicInteraction() {

        if (!musicStarted) {
            startMusic();
        }

    }


    document.addEventListener(
        "touchstart",
        musicInteraction,
        {
            once: false,
            passive: true
        }
    );

    document.addEventListener(
        "click",
        musicInteraction,
        {
            once: false
        }
    );


    /* =====================================================
       PAPER SOUND
       ===================================================== */

    let paperSoundPlayed = false;

    function playPaperSound() {

        if (paperSoundPlayed) return;

        paperSoundPlayed = true;

        paperSound.currentTime = 0;
        paperSound.volume = 0.85;

        paperSound.play().catch(() => {});

    }


    /* =====================================================
       OPEN LETTER
       ===================================================== */

    function openLetter() {

        startMusic();

        if (!envelope) return;

        if (envelope.classList.contains("open")) {
            return;
        }

        /*
         * Buka animasi amplop
         */
        envelope.classList.add("open");

        /*
         * Suara kertas dimainkan ketika surat dibuka
         */
        playPaperSound();

        /*
         * Floating hearts
         */
        if (loveCorner) {

            setTimeout(() => {

                loveCorner.classList.add("active");

            }, 650);

        }

    }


    if (envelope) {

        envelope.addEventListener(
            "click",
            openLetter
        );

        envelope.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    openLetter();

                }

            }
        );

    }


    if (openLetterButton) {

        openLetterButton.addEventListener(
            "click",
            openLetter
        );

    }


    /* =====================================================
       REVEAL ANIMATION
       ===================================================== */

    function revealScene(scene) {

        if (!scene) return;

        const reveals =
            scene.querySelectorAll(".reveal");

        reveals.forEach((element, index) => {

            element.classList.remove("visible");

            setTimeout(() => {

                element.classList.add("visible");

            }, 100 + index * 90);

        });

    }


    /* =====================================================
       CHAPTER CHANGE
       ===================================================== */

    let currentChapter = 1;

    function showScene(number) {

        const nextScene =
            document.getElementById(`scene${number}`);

        if (!nextScene) return;

        scenes.forEach(scene => {

            scene.classList.remove("active");

        });

        nextScene.classList.add("active");

        currentChapter = number;

        updateHeader(number);

        updateProgress(number);

        revealScene(nextScene);

        /*
         * Musik TIDAK di-reset.
         * Musik tetap berjalan saat pindah chapter.
         */

        startMusic();


        /* =================================================
           CHAPTER 7 — TYPING
           ================================================= */

        if (number === 7) {

            startTyping();

        }


        /* =================================================
           CHAPTER 10 — ENDING REVEAL
           ================================================= */

        if (number === 10) {

            setTimeout(() => {

                const endingReveals =
                    nextScene.querySelectorAll(".reveal");

                endingReveals.forEach(
                    (element, index) => {

                        element.classList.remove(
                            "visible"
                        );

                        setTimeout(() => {

                            element.classList.add(
                                "visible"
                            );

                        }, 120 + index * 100);

                    }
                );

            }, 100);

        }

    }


    /* =====================================================
       HEADER
       ===================================================== */

    function updateHeader(number) {

        if (chapterNumber) {

            chapterNumber.textContent =
                `${String(number).padStart(2, "0")} / 10`;

        }

        if (chapterLabel) {

            chapterLabel.textContent =
                chapterNames[number] || "";

        }

    }


    /* =====================================================
       PROGRESS
       ===================================================== */

    function updateProgress(number) {

        if (!progressFill) return;

        const percentage =
            (number / 10) * 100;

        progressFill.style.width =
            `${percentage}%`;

    }


    /* =====================================================
       NEXT BUTTONS
       ===================================================== */

    const nextButtons =
        document.querySelectorAll(".next-button");

    nextButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const next =
                    Number(button.dataset.next);

                if (!next) return;

                showScene(next);

            }
        );

    });


    /* =====================================================
       TYPING SCENE
       ===================================================== */

    const typeLine1 =
        document.getElementById("typeLine1");

    const typeLine2 =
        document.getElementById("typeLine2");

    const typeLine3 =
        document.getElementById("typeLine3");


    const typingTexts = [

        "Diky sebenarnya sudah lama ingin mengatakan sesuatu.",

        "Mungkin selama ini Diky terlalu banyak menyimpan kata-kata.",

        "Diky suka sama kamu, Chelyn. ♥"

    ];


    let typingStarted = false;


    function typeText(
        element,
        text,
        speed,
        callback
    ) {

        if (!element) {

            if (callback) callback();

            return;

        }

        element.textContent = "";

        let index = 0;

        function type() {

            if (index < text.length) {

                element.textContent +=
                    text.charAt(index);

                index++;

                /*
                 * Tidak ada suara keyboard lagi.
                 */

                setTimeout(type, speed);

            } else {

                if (callback) {
                    callback();
                }

            }

        }

        type();

    }


    /* =====================================================
       START TYPING
       ===================================================== */

    function startTyping() {

        if (typingStarted) return;

        typingStarted = true;

        if (scene7Button) {

            scene7Button.classList.add("hidden");

        }

        typeText(
            typeLine1,
            typingTexts[0],
            38,
            () => {

                setTimeout(() => {

                    typeText(
                        typeLine2,
                        typingTexts[1],
                        38,
                        () => {

                            setTimeout(() => {

                                typeText(
                                    typeLine3,
                                    typingTexts[2],
                                    55,
                                    () => {

                                        if (scene7Button) {

                                            setTimeout(() => {

                                                scene7Button.classList.remove(
                                                    "hidden"
                                                );

                                                scene7Button.classList.add(
                                                    "visible"
                                                );

                                            }, 500);

                                        }

                                    }
                                );

                            }, 500);

                        }
                    );

                }, 500);

            }
        );

    }


    /* =====================================================
       INITIAL REVEAL
       ===================================================== */

    const firstScene =
        document.getElementById("scene1");

    if (firstScene) {

        revealScene(firstScene);

    }


    /* =====================================================
       INITIAL HEADER
       ===================================================== */

    updateHeader(1);

    updateProgress(1);


    /* =====================================================
       PARTICLES
       ===================================================== */

    const particles =
        document.getElementById("particles");

    if (particles) {

        const particleCount = 18;

        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const particle =
                document.createElement("span");

            particle.className =
                "particle";

            particle.style.left =
                `${Math.random() * 100}%`;

            particle.style.animationDuration =
                `${8 + Math.random() * 10}s`;

            particle.style.animationDelay =
                `${Math.random() * -15}s`;

            particle.style.opacity =
                `${0.15 + Math.random() * 0.35}`;

            particles.appendChild(
                particle
            );

        }

    }


    /* =====================================================
       KEYBOARD SHORTCUT
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "ArrowRight" &&
                currentChapter < 10
            ) {

                showScene(
                    currentChapter + 1
                );

            }

        }
    );


    /* =====================================================
       SOCIAL LINKS
       ===================================================== */

    const replyButton =
        document.getElementById("replyButton");

    if (replyButton) {

        replyButton.href =
            "https://wa.me/6288229456210";

        replyButton.target =
            "_blank";

        replyButton.rel =
            "noopener noreferrer";

    }


    /* =====================================================
       REDUCED MOTION SUPPORT
       ===================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (reducedMotion) {

        document.documentElement.classList.add(
            "reduce-motion"
        );

    }

});