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
if(window.lumiSpeakGreeting)window.lumiSpeakGreeting();
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
(function(){
const root=document.getElementById("lumiBot"),btn=document.getElementById("lumiBotButton"),bubble=document.getElementById("lumiBubble");
if(!root||!btn||!bubble||!("speechSynthesis"in window))return;
let voice=null,speaking=false,last=-1;
const getGreeting=()=>{
 const hour=new Date().getHours();
 const part=hour<11?"pagi":hour<15?"siang":hour<18?"sore":"malam";
 const timeLine=hour<18?"Hari ini":"Malam ini";
 return "Selamat "+part+". Aku Lumi Bot. Aku diciptakan oleh tuanku, Diky. "+timeLine+", aku akan menemanimu membaca sesuatu yang dia titipkan. Kalau kamu siap... mari kita mulai.";
};
const lines=[
 getGreeting(),
 "Baik... sekarang, biarkan kata-kata Diky berbicara sendiri.",
 "Aku akan tetap di sini. Nikmati ceritanya.",
 "Aku mulai mengerti kenapa cerita ini dibuat.",
 "Tidak semua perasaan mudah dijelaskan.",
 "Jangan terburu-buru. Ada kata-kata yang lebih baik dibaca perlahan.",
 "Aku memang cuma Lumi Bot, tapi aku tahu bagian ini berarti.",
 "Sepertinya Diky sudah mengatakan banyak hal.",
 "Tinggal sedikit lagi. Jangan berhenti di sini.",
 "Oh... kamu menemukan aku.",
 "Tenang. Aku tidak akan membocorkan ending-nya."
];
function chooseVoice(){
 const voices=speechSynthesis.getVoices();
 voice=voices.find(v=>/^id(-|_)/i.test(v.lang)&&/female|perempuan|indonesia/i.test(v.name))
   ||voices.find(v=>/^id(-|_)/i.test(v.lang))
   ||voices.find(v=>/^ms(-|_)/i.test(v.lang))
   ||voices[0]||null;
}
function speak(text){
 speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(text);
 chooseVoice();
 if(voice)u.voice=voice;
 u.lang=voice?.lang||"id-ID";
 u.rate=.92;u.pitch=1.12;u.volume=.82;
 bubble.textContent=text;root.classList.add("is-speaking");speaking=true;
 u.onend=u.onerror=()=>{speaking=false;root.classList.remove("is-speaking");};
 speechSynthesis.speak(u);
}
function speakGreeting(){
 if(speaking)return;
 speak(getGreeting());
}
chooseVoice();
speechSynthesis.onvoiceschanged=chooseVoice;
btn.addEventListener("click",()=>{
 if(speaking){speechSynthesis.cancel();speaking=false;root.classList.remove("is-speaking");return;}
 let i=Math.floor(Math.random()*lines.length);
 if(i===last)i=(i+1)%lines.length;
 last=i;speak(lines[i]);
});
document.addEventListener("visibilitychange",()=>{
 if(document.hidden){speechSynthesis.cancel();speaking=false;root.classList.remove("is-speaking");}
});

/* Expose only one tiny hook so the existing "Buka Surat" click can start Lumi
   inside the same user gesture, avoiding mobile autoplay restrictions. */
window.lumiSpeakGreeting=speakGreeting;
})();

/* LUMI_VOICE_FIXED */
(function(){
"use strict";
const root=document.getElementById("lumiBot");
const bot=document.getElementById("lumiBotButton");
const bubble=document.getElementById("lumiBubble");
if(!root||!bot||!bubble)return;

const canSpeak=typeof window!=="undefined"&&"speechSynthesis"in window&&"SpeechSynthesisUtterance"in window;
let voices=[];
let active=false;
let last=-1;

function loadVoices(){
  if(!canSpeak)return;
  voices=window.speechSynthesis.getVoices()||[];
}
loadVoices();
if(canSpeak)window.speechSynthesis.onvoiceschanged=loadVoices;

function greeting(){
  const h=new Date().getHours();
  const part=h<11?"pagi":h<15?"siang":h<18?"sore":"malam";
  const when=h<18?"Hari ini":"Malam ini";
  return "Selamat "+part+". Aku Lumi Bot. Aku diciptakan oleh tuanku, Diky. "+when+", aku akan menemanimu membaca sesuatu yang dia titipkan. Kalau kamu siap... mari kita mulai.";
}

const lines=[
  greeting,
  function(){return "Baik... sekarang, biarkan kata-kata Diky berbicara sendiri."},
  function(){return "Aku akan tetap di sini. Nikmati ceritanya."},
  function(){return "Aku mulai mengerti kenapa cerita ini dibuat."},
  function(){return "Tidak semua perasaan mudah dijelaskan."},
  function(){return "Jangan terburu-buru. Ada kata-kata yang lebih baik dibaca perlahan."},
  function(){return "Aku memang cuma Lumi Bot, tapi aku tahu bagian ini berarti."},
  function(){return "Sepertinya Diky sudah mengatakan banyak hal."},
  function(){return "Tinggal sedikit lagi. Jangan berhenti di sini."},
  function(){return "Oh... kamu menemukan aku."},
  function(){return "Tenang. Aku tidak akan membocorkan ending-nya."}
];

function pickVoice(){
  loadVoices();
  if(!voices.length)return null;
  return voices.find(v=>/^id[-_]/i.test(v.lang))
    || voices.find(v=>/^id$/i.test(v.lang))
    || voices.find(v=>/^ms[-_]/i.test(v.lang))
    || voices.find(v=>/^en[-_]/i.test(v.lang))
    || voices[0];
}

function stop(){
  if(canSpeak)window.speechSynthesis.cancel();
  active=false;
  root.classList.remove("is-speaking");
}

function speak(text){
  if(!canSpeak){
    bubble.textContent=text;
    root.classList.add("is-speaking");
    setTimeout(()=>root.classList.remove("is-speaking"),Math.max(1800,text.length*55));
    return;
  }

  window.speechSynthesis.cancel();

  const u=new SpeechSynthesisUtterance(text);
  const v=pickVoice();
  if(v)u.voice=v;
  u.lang=v&&v.lang?v.lang:"id-ID";
  u.rate=.9;
  u.pitch=1.08;
  u.volume=1;

  bubble.textContent=text;
  active=true;
  root.classList.add("is-speaking");

  u.onend=()=>{
    active=false;
    root.classList.remove("is-speaking");
  };
  u.onerror=()=>{
    active=false;
    root.classList.remove("is-speaking");
  };

  window.speechSynthesis.speak(u);
}

function speakGreeting(){
  speak(greeting());
}

bot.addEventListener("click",function(e){
  e.preventDefault();
  e.stopPropagation();
  if(active){stop();return;}
  let i=Math.floor(Math.random()*lines.length);
  if(i===last)i=(i+1)%lines.length;
  last=i;
  speak(lines[i]());
});

/*
 * IMPORTANT:
 * Do NOT wait with setTimeout before speaking. Mobile browsers require
 * speechSynthesis.speak() to stay tied to a user gesture.
 *
 * We attach to the actual existing "Buka Surat" button after DOM is ready.
 */
function attachLetterVoice(){
  const open=document.getElementById("openLetterButton");
  if(!open||open.dataset.lumiVoiceAttached==="1")return;
  open.dataset.lumiVoiceAttached="1";

  open.addEventListener("click",function(){
    /*
     * This listener is intentionally synchronous.
     * The user's tap directly reaches speechSynthesis.speak().
     */
    speakGreeting();
  },{capture:false});
}

attachLetterVoice();
document.addEventListener("DOMContentLoaded",attachLetterVoice);

document.addEventListener("visibilitychange",function(){
  if(document.hidden)stop();
});

window.lumiSpeakGreeting=speakGreeting;
})();
