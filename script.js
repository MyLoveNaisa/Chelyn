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
/* === LUMI BOT: isolated runtime === */
(function(){
 const bot=document.getElementById("lumiBot"),bubble=document.getElementById("lumiBubble");
 if(!bot||!bubble)return;
 const synth=window.speechSynthesis;
 let speaking=false,egg=0,bubbleTimer=null,greeted=false;
 const textByTime=()=>{const h=new Date().getHours();return h>=5&&h<11?"Selamat pagi":h>=11&&h<15?"Selamat siang":h>=15&&h<18?"Selamat sore":"Selamat malam"};
 const openText=()=>{const g=textByTime();const period=g==="Selamat pagi"?"Hari ini":g==="Selamat siang"?"Hari ini":g==="Selamat sore"?"Sore ini":"Malam ini";return `${g}. Aku Lumi Bot. Aku diciptakan oleh tuanku, Diky. ${period}, aku akan menemanimu membaca sesuatu yang dia titipkan. Kalau kamu siap... mari kita mulai.`};
 function pickVoice(){if(!synth)return null;const vs=synth.getVoices();return vs.find(v=>/^id(-|_)/i.test(v.lang)&&/female|woman|perempuan|google.*indonesia|id-id/i.test(v.name))||vs.find(v=>/^id(-|_)/i.test(v.lang))||vs.find(v=>/indonesia|bahasa indonesia/i.test(v.name))||null}
 function show(t,ms=3600){bubble.textContent=t;bubble.classList.add("show");clearTimeout(bubbleTimer);bubbleTimer=setTimeout(()=>bubble.classList.remove("show"),ms)}
 function stop(){if(synth&&synth.speaking)synth.cancel();speaking=false;bot.classList.remove("talking");}
 function speak(t){if(!synth){show(t);return false}stop();show(t,Math.max(3200,t.length*55));const u=new SpeechSynthesisUtterance(t);u.lang="id-ID";u.rate=.88;u.pitch=1.12;u.volume=.9;const v=pickVoice();if(v)u.voice=v;u.onstart=()=>{speaking=true;bot.classList.add("talking")};u.onend=u.onerror=()=>{speaking=false;bot.classList.remove("talking")};synth.speak(u);return true}
 function click(){if(speaking){stop();show("Oke... aku diam dulu.",1800);return}egg++;bot.classList.remove("happy","thinking");if(egg===1){bot.classList.add("happy");speak("Oh... kamu menemukan aku.")}else if(egg===2){speak("Aku kira aku cuma akan menjadi pajangan.")}else if(egg===3){bot.classList.add("thinking");speak("Baiklah... aku akan mengaku. Aku juga penasaran bagaimana akhir cerita ini.")}else{speak("Tenang. Aku tidak akan membocorkan ending-nya.")}}
 bot.addEventListener("click",e=>{e.stopPropagation();click()});bot.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();click()}});
 function greetOnce(){if(greeted)return;greeted=true;speak(openText())}
 document.addEventListener("pointerdown",e=>{if(e.target===bot||bot.contains(e.target))return;if(!greeted)greetOnce()},{once:true,passive:true});
 const oldOpen=window.openLetter;
 if(typeof oldOpen==="function")window.openLetter=function(){
   const wasFirst=!greeted;
   greeted=true;
   oldOpen.apply(this,arguments);
   setTimeout(()=>speak(wasFirst?openText():"Baik... Sekarang, biarkan kata-kata Diky berbicara sendiri. Aku akan tetap di sini."),120);
 };
 else if(openLetterButton)openLetterButton.addEventListener("click",()=>{greeted=true;speak(openText())},{once:true});
 document.addEventListener("visibilitychange",()=>{if(document.hidden)stop()},{passive:true});
 if(synth&&synth.addEventListener)synth.addEventListener("voiceschanged",()=>{});
 bot.classList.add("idle");
})();
