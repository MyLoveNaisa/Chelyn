/* =========================================================
   LOVE FOR CHELYN — FINAL SCRIPT
   MUSIC + PAPER SOUND + CHAPTER + ENVELOPE + TYPING
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const scenes =
        document.querySelectorAll(".scene");

    const envelope =
        document.getElementById("envelope");

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

    const backToStart =
        document.getElementById("backToStart");


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

        if (musicStarted) return;

        music.volume = 0.38;

        const playPromise =
            music.play();

        if (playPromise !== undefined) {

            playPromise
                .then(() => {

                    musicStarted = true;

                    if (musicVisualizer) {

                        musicVisualizer.classList.add(
                            "active"
                        );

                    }

                })
                .catch(() => {

                    /*
                     * Browser bisa menolak autoplay.
                     * Musik akan dicoba lagi saat
                     * user melakukan interaksi.
                     */

                    musicStarted = false;

                });

        }

    }


    /* =====================================================
       MUSIC USER INTERACTION
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

    let paperSoundPlayed = false;

    function playPaperSound() {

        if (!paperSound) return;

        /*
         * Supaya suara kertas hanya dimainkan
         * satu kali saat amplop pertama dibuka.
         */

        if (paperSoundPlayed) return;

        paperSoundPlayed = true;

        paperSound.currentTime = 0;

        paperSound.volume = 0.85;

        const playPromise =
            paperSound.play();

        if (playPromise !== undefined) {

            playPromise.catch(() => {});

        }

    }


    /* =====================================================
       OPEN LETTER
       ===================================================== */

    function openLetter() {

        /*
         * Mulai musik karena ini adalah
         * interaksi langsung dari user.
         */

        startMusic();


        if (!envelope) return;


        /*
         * Jangan buka dua kali.
         */

        if (
            envelope.classList.contains("open")
        ) {

            return;

        }


        /*
         * Buka animasi amplop.
         */

        envelope.classList.add("open");


        /*
         * Mainkan suara kertas.
         */

        playPaperSound();


        /*
         * Floating hearts.
         */

        if (loveCorner) {

            loveCorner.classList.add(
                "active"
            );

        }


        /*
         * Setelah amplop terbuka,
         * otomatis masuk ke Chapter 2.
         */

        setTimeout(() => {

            showScene(2);

        }, 1000);

    }


    /* =====================================================
       ENVELOPE CLICK
       ===================================================== */

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


    /* =====================================================
       OPEN LETTER BUTTON
       ===================================================== */

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
            scene.querySelectorAll(
                ".reveal"
            );


        reveals.forEach(
            (element, index) => {

                element.classList.remove(
                    "visible"
                );


                setTimeout(() => {

                    element.classList.add(
                        "visible"
                    );

                }, 100 + index * 90);

            }
        );

    }


    /* =====================================================
       CHAPTER CHANGE
       ===================================================== */

    let currentChapter = 1;


    function showScene(number) {

        const nextScene =
            document.getElementById(
                `scene${number}`
            );


        if (!nextScene) return;


        /*
         * Hilangkan scene sebelumnya.
         */

        scenes.forEach(
            (scene) => {

                scene.classList.remove(
                    "active"
                );

            }
        );


        /*
         * Tampilkan scene baru.
         */

        nextScene.classList.add(
            "active"
        );


        currentChapter = number;


        /*
         * Update header.
         */

        updateHeader(number);


        /*
         * Update progress.
         */

        updateProgress(number);


        /*
         * Reveal animasi.
         */

        revealScene(nextScene);


        /*
         * Musik tidak di-reset.
         */

        startMusic();


        /* =================================================
           CHAPTER 7 — TYPING
           ================================================= */

        if (number === 7) {

            startTyping();

        }


        /* =================================================
           CHAPTER 10 — ENDING
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


        /*
         * Scroll kembali ke atas
         * setiap pindah chapter.
         */

        nextScene.scrollTop = 0;

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
        document.querySelectorAll(
            ".next-button"
        );


    nextButtons.forEach(
        (button) => {

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

        }
    );


    /* =====================================================
       TYPING ELEMENTS
       ===================================================== */

    const typeLine1 =
        document.getElementById(
            "typeLine1"
        );

    const typeLine2 =
        document.getElementById(
            "typeLine2"
        );

    const typeLine3 =
        document.getElementById(
            "typeLine3"
        );


    const typingTexts = [

        "Diky sebenarnya sudah lama ingin mengatakan sesuatu.",

        "Mungkin selama ini Diky terlalu banyak menyimpan kata-kata.",

        "Diky suka sama kamu, Chelyn. ♥"

    ];


    let typingStarted = false;


    /* =====================================================
       TYPE TEXT
       ===================================================== */

    function typeText(
        element,
        text,
        speed,
        callback
    ) {

        if (!element) {

            if (callback) {
                callback();
            }

            return;

        }


        element.textContent = "";


        let index = 0;


        function type() {

            if (index < text.length) {

                element.textContent +=
                    text.charAt(index);

                index++;


                setTimeout(
                    type,
                    speed
                );

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
         * Jangan ulang typing kalau Chapter 7
         * dibuka lagi.
         */

        if (typingStarted) return;


        typingStarted = true;


        /*
         * Sembunyikan tombol Lanjut.
         */

        if (scene7Button) {

            scene7Button.classList.add(
                "hidden"
            );

        }


        /*
         * LINE 1
         */

        typeText(
            typeLine1,
            typingTexts[0],
            38,
            () => {

                setTimeout(() => {


                    /*
                     * LINE 2
                     */

                    typeText(
                        typeLine2,
                        typingTexts[1],
                        38,
                        () => {

                            setTimeout(() => {


                                /*
                                 * LINE 3
                                 */

                                typeText(
                                    typeLine3,
                                    typingTexts[2],
                                    55,
                                    () => {


                                        /*
                                         * Tampilkan tombol
                                         * setelah typing selesai.
                                         */

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
       BACK TO START
       ===================================================== */

    if (backToStart) {

        backToStart.addEventListener(
            "click",
            () => {

                /*
                 * Kembali ke Chapter 1.
                 */

                showScene(1);


                /*
                 * Reset amplop supaya bisa
                 * dibuka lagi.
                 */

                if (envelope) {

                    envelope.classList.remove(
                        "open"
                    );

                }


                /*
                 * Reset suara kertas.
                 */

                paperSoundPlayed = false;


                /*
                 * Reset typing jika nanti
                 * Chapter 7 dibuka lagi.
                 */

                typingStarted = false;


                if (typeLine1) {
                    typeLine1.textContent = "";
                }

                if (typeLine2) {
                    typeLine2.textContent = "";
                }

                if (typeLine3) {
                    typeLine3.textContent = "";
                }


                if (scene7Button) {

                    scene7Button.classList.add(
                        "hidden"
                    );

                    scene7Button.classList.remove(
                        "visible"
                    );

                }

            }
        );

    }


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
       INITIAL REVEAL
       ===================================================== */

    const firstScene =
        document.getElementById(
            "scene1"
        );


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
        document.getElementById(
            "particles"
        );


    if (particles) {

        const particleCount = 18;


        for (
            let i = 0;
            i < particleCount;
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

            /*
             * Arrow Right = chapter berikutnya.
             */

            if (
                event.key === "ArrowRight" &&
                currentChapter < 10
            ) {

                showScene(
                    currentChapter + 1
                );

            }


            /*
             * Arrow Left = chapter sebelumnya.
             */

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