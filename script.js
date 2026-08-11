/* =========================================================
   LOVE FOR CHELYN — FINAL SCRIPT
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

    const music =
        document.getElementById("bgm");

    const paperSound =
        document.getElementById("paperSound");

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

    const replyButton =
        document.getElementById("replyButton");


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
       AUDIO
       ===================================================== */

    let musicStarted = false;
    let paperSoundPlayed = false;

    if (music) {
        music.volume = 0.38;
        music.loop = true;
        music.preload = "auto";
    }

    if (paperSound) {
        paperSound.volume = 0.85;
        paperSound.preload = "auto";
    }


    /* =====================================================
       START MUSIC
       ===================================================== */

    function startMusic() {

        if (!music) return;

        /*
         * Jangan restart musik kalau sudah berjalan.
         */
        if (!music.paused) {
            musicStarted = true;

            if (musicVisualizer) {
                musicVisualizer.classList.add("active");
            }

            return;
        }

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

                    if (musicVisualizer) {
                        musicVisualizer.classList.remove("active");
                    }

                });

        }

    }


    /* =====================================================
       USER INTERACTION → MUSIC
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
            passive: true
        }
    );

    document.addEventListener(
        "click",
        musicInteraction
    );


    /* =====================================================
       PAPER SOUND
       ===================================================== */

    function playPaperSound() {

        if (!paperSound) return;

        if (paperSoundPlayed) return;

        paperSoundPlayed = true;

        try {

            paperSound.currentTime = 0;
            paperSound.volume = 0.85;

            const playPromise =
                paperSound.play();

            if (playPromise !== undefined) {
                playPromise.catch(() => {});
            }

        } catch (error) {
            // Abaikan jika browser menolak audio.
        }

    }


    /* =====================================================
       OPEN LETTER
       ===================================================== */

    function openLetter() {

        /*
         * Musik dimulai dari interaksi user.
         */
        startMusic();

        if (!envelope) return;

        /*
         * Jangan jalankan animasi dua kali.
         */
        if (envelope.classList.contains("open")) {
            return;
        }

        /*
         * Buka amplop.
         */
        envelope.classList.add("open");

        /*
         * Suara kertas.
         */
        playPaperSound();

        /*
         * Love corner tetap digunakan
         * dari Bab 1 sampai Bab 10.
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

        reveals.forEach(
            (element, index) => {

                element.classList.remove("visible");

                setTimeout(() => {

                    element.classList.add("visible");

                }, 100 + index * 90);

            }
        );

    }


    /* =====================================================
       CURRENT CHAPTER
       ===================================================== */

    let currentChapter = 1;


    /* =====================================================
       SHOW SCENE
       ===================================================== */

    function showScene(number) {

        const nextScene =
            document.getElementById(
                `scene${number}`
            );

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
         * Musik tetap berjalan.
         * Tidak di-reset ketika pindah chapter.
         */
        startMusic();


        /* =================================================
           LOVE CORNER
           ================================================= */

        /*
         * ♥ sengaja TIDAK dihilangkan pada Bab 10.
         */
        if (loveCorner) {

            loveCorner.classList.add("active");

        }


        /* =================================================
           CHAPTER 7
           ================================================= */

        if (number === 7) {

            startTyping();

        }


        /* =================================================
           CHAPTER 10
           ================================================= */

        if (number === 10) {

            setTimeout(() => {

                const endingReveals =
                    nextScene.querySelectorAll(
                        ".reveal"
                    );

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
                    Number(
                        button.dataset.next
                    );

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
                 * Tidak ada keyboard sound.
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

        /*
         * Jangan mengulang typing setiap kali scene
         * dibuka kembali.
         */
        if (typingStarted) return;

        typingStarted = true;

        if (scene7Button) {

            scene7Button.classList.add(
                "hidden"
            );

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

                                        if (
                                            scene7Button
                                        ) {

                                            setTimeout(
                                                () => {

                                                    scene7Button.classList.remove(
                                                        "hidden"
                                                    );

                                                    scene7Button.classList.add(
                                                        "visible"
                                                    );

                                                },
                                                500
                                            );

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
       INITIAL SCENE
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

            if (
                event.key === "ArrowLeft" &&
                currentChapter > 1
            ) {

                showScene(
                    currentChapter - 1
                );

            }

        }
    );


    /* =====================================================
       REPLY BUTTON
       ===================================================== */

    if (replyButton) {

        replyButton.href =
            "https://wa.me/6288229456210";

        replyButton.target =
            "_blank";

        replyButton.rel =
            "noopener noreferrer";

    }


    /* =====================================================
       REDUCED MOTION
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