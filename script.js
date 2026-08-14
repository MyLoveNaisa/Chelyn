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
let sceneTransitionLocked = false;
const chapterLabels = [
 "THE FIRST PAGE",
 "THE BEGINNING",
 "LITTLE THINGS",
 "THE DETAILS",
 "THE WAY YOU ARE",
 "IF THINGS CHANGE",
 "WHAT I NEVER SAID",
 "NO PERFECT WORDS",
 "BEFORE THE LAST PAGE",
 "THE FINAL PAGE"
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
 "Hai Diky, aku sudah baca suratnya sampai akhir. Ada banyak hal yang ingin aku bilang setelah membaca semuanya. ♡";
 const whatsappURL =
 `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
 window.location.href = whatsappURL;
 });
 }
 const backToStartButton = document.getElementById("backToStartButton");
 if (backToStartButton) {
 backToStartButton.addEventListener("click", () => {
 goToScene(2);
 });
 }
}
function setupEnvelope() {
 if (!envelope) return; 
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
function setMusicVisualizer(active) {
 if (musicVisualizer) {
 musicVisualizer.classList.toggle("active", active);
 }
}
function goToScene(number) {
 if (number < 1 || number > 10 || number === currentScene || sceneTransitionLocked) return;
 sceneTransitionLocked = true;
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
 setTimeout(() => { sceneTransitionLocked = false; }, 560);
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
 "Mungkin selama ini Diky nggak pernah benar-benar tahu cara mengatakannya.";
 const text2 =
 "Semakin mengenal Chelyn, semakin banyak hal kecil yang diam-diam menetap.";
 const text3 =
 "Dan kalau harus jujur... kamu bukan sekadar seseorang yang pernah hadir. Kamu adalah seseorang yang ingin Diky ingat dengan cara yang baik.";
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
document.addEventListener("visibilitychange", () => {
 const visible = document.visibilityState === "visible";
 if (particles) {
 particles.style.display = visible ? "" : "none";
 }
 if (!visible) {
 if (bgm && !bgm.paused) {
 bgm.dataset.wasPlaying = "1";
 bgm.pause();
 }
 return;
 }
 if (letterOpened && bgm && bgm.paused && bgm.dataset.wasPlaying === "1") {
 delete bgm.dataset.wasPlaying;
 const promise = bgm.play();
 if (promise && typeof promise.catch === "function") {
 promise.then(() => {
 musicStarted = true;
 setMusicVisualizer(true);
 }).catch(() => {});
 }
 }
}, { passive: true });
/* LUMI BOT — additive runtime, no external dependency */
const lumi = {
 bot: null,
 bubble: null,
 speaking: false,
 bubbleTimer: null,
 blinkTimer: null,
 voices: [],
 egg: 0,
 lastText: "",
 introShown: false
};

function setupLumiBot() {
 lumi.bot = document.getElementById("lmBot");
 lumi.bubble = document.getElementById("lmBubble");
 if (!lumi.bot) return;

 setTimeout(() => lumi.bot && lumi.bot.classList.add("lm-ready"), 0);

 lumi.bot.addEventListener("click", handleLumiClick);
 lumi.bot.addEventListener("keydown", event => {
   if (event.key === "Enter" || event.key === " ") {
     event.preventDefault();
     handleLumiClick();
   }
 });

 if ("speechSynthesis" in window) {
   loadLumiVoices();
   if ("onvoiceschanged" in speechSynthesis) {
     speechSynthesis.addEventListener("voiceschanged", loadLumiVoices, { once: false });
   }
 }

 scheduleLumiBlink();
}

function loadLumiVoices() {
 if (!("speechSynthesis" in window)) return;
 lumi.voices = speechSynthesis.getVoices();
}

function getLumiVoice() {
 const voices = lumi.voices.length ? lumi.voices : speechSynthesis.getVoices();
 if (!voices.length) return null;

 const id = voices.filter(v => /^id(?:-|_)/i.test(v.lang));
 if (!id.length) return voices[0];

 const femaleHints = /female|perempuan|woman|google indonesia|indonesia/i;
 return id.find(v => femaleHints.test(v.name)) || id[0];
}

function lumiGreeting() {
 const hour = new Date().getHours();
 let timeWord, periodText;
 if (hour >= 5 && hour < 11) {
   timeWord = "Selamat pagi";
   periodText = "Hari ini";
 } else if (hour >= 11 && hour < 15) {
   timeWord = "Selamat siang";
   periodText = "Hari ini";
 } else if (hour >= 15 && hour < 18) {
   timeWord = "Selamat sore";
   periodText = "Sore ini";
 } else {
   timeWord = "Selamat malam";
   periodText = "Malam ini";
 }
 return `${timeWord}. Aku Lumi Bot. Aku diciptakan oleh tuanku, Diky. ${periodText}, aku akan menemanimu membaca sesuatu yang dia titipkan. Kalau kamu siap... mari kita mulai.`;
}

function lumiSpeak(text, hold = 4200) {
 if (!text || !("speechSynthesis" in window) || document.hidden) {
   showLumiBubble(text, hold);
   return false;
 }

 clearTimeout(lumi.bubbleTimer);
 speechSynthesis.cancel();

 const utterance = new SpeechSynthesisUtterance(text);
 const voice = getLumiVoice();
 if (voice) utterance.voice = voice;
 utterance.lang = voice && /^id/i.test(voice.lang) ? voice.lang : "id-ID";
 utterance.rate = 0.88;
 utterance.pitch = 1.08;
 utterance.volume = 0.86;

 lumi.speaking = true;
 lumi.lastText = text;
 lumi.bot.classList.add("lm-speaking");
 showLumiBubble(text, hold);

 utterance.onend = () => stopLumi(false);
 utterance.onerror = () => stopLumi(false);
 speechSynthesis.speak(utterance);
 return true;
}

function stopLumi(cancelSpeech = true) {
 if (cancelSpeech && "speechSynthesis" in window) speechSynthesis.cancel();
 lumi.speaking = false;
 if (lumi.bot) lumi.bot.classList.remove("lm-speaking");
}

function showLumiBubble(text, hold = 4200) {
 if (!lumi.bubble) return;
 clearTimeout(lumi.bubbleTimer);
 lumi.bubble.textContent = text;
 lumi.bubble.classList.add("show");
 lumi.bubbleTimer = setTimeout(() => {
   lumi.bubble.classList.remove("show");
 }, hold);
}

function scheduleLumiBlink() {
 clearTimeout(lumi.blinkTimer);
 const delay = 2600 + Math.random() * 3200;
 lumi.blinkTimer = setTimeout(() => {
   if (lumi.bot && !document.hidden) {
     lumi.bot.classList.add("lm-blink");
     setTimeout(() => lumi.bot && lumi.bot.classList.remove("lm-blink"), 110);
   }
   scheduleLumiBlink();
 }, delay);
}

function handleLumiClick() {
 if (!lumi.bot) return;

 if (lumi.speaking) {
   stopLumi(true);
   showLumiBubble("Baik... aku diam dulu.", 1800);
   return;
 }

 lumi.egg++;
 let text;
 if (lumi.egg === 1) {
   text = "Oh... kamu menemukan aku.";
 } else if (lumi.egg === 2) {
   text = "Aku kira aku cuma akan menjadi pajangan.";
 } else if (lumi.egg === 3) {
   text = "Baiklah... aku akan mengaku. Aku juga penasaran bagaimana akhir cerita ini.";
 } else {
   text = "Tenang. Aku tidak akan membocorkan ending-nya.";
 }
 lumiSpeak(text, lumi.egg === 3 ? 5200 : 3300);
}

function lumiIntroAfterLetter() {
 if (lumi.introShown || !lumi.bot || document.hidden) return;
 lumi.introShown = true;
 lumiSpeak(lumiGreeting(), 6200);
 setTimeout(() => {
   if (!lumi.speaking && !document.hidden) {
     lumiSpeak("Baik... Sekarang, biarkan kata-kata Diky berbicara sendiri. Aku akan tetap di sini.", 4300);
   }
 }, 7000);
}

/* Initialize only Lumi; existing initialization remains untouched. */
document.addEventListener("DOMContentLoaded", setupLumiBot);

/* Hook only after the existing open-letter action has run. */
const lumiOriginalOpenLetter = openLetter;
openLetter = function() {
 lumiOriginalOpenLetter();
 setTimeout(lumiIntroAfterLetter, 900);
};

/* Pause Lumi speech and blink timers with the page. */
document.addEventListener("visibilitychange", () => {
 if (document.hidden) {
   clearTimeout(lumi.blinkTimer);
   clearTimeout(lumi.bubbleTimer);
   stopLumi(true);
   if (lumi.bubble) lumi.bubble.classList.remove("show");
 } else if (lumi.bot) {
   scheduleLumiBlink();
 }
}, { passive: true });
