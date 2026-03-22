function cap(hoveritem) {
    const hoverItem = document.getElementById(hoveritem);
    hoverItem.style.opacity = 0.4;
    hoverItem.style.cursor = 'url(images/bcursor.png), pointer';
}
function mcap(hoveritem) {
    const hoverItem = document.getElementById(hoveritem);
    hoverItem.style.opacity = 0.4;
    hoverItem.style.cursor = 'url(images/mcursor.png), pointer';
}
function scap(hoveritem) {
    const hoverItem = document.getElementById(hoveritem);
    hoverItem.style.opacity = 0.4;
    hoverItem.style.cursor = 'url(images/scursor.png), pointer';
}
function uncap(hoveritem) {
    const hoverItem = document.getElementById(hoveritem);
    hoverItem.style.opacity = 1; 
    hoverItem.style.backgroundColor = '';
    hoverItem.style.cursor = 'default'; 
}

function openlink(link) {
    url = 'https://' + link; 
    window.open(url, '_blank'); 
}

function downloadFile(relativePath, filename) {
    const link = document.createElement('a');
    // link.target = _blank;
    link.href = relativePath; 
    link.download = filename || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function emailme() {
    window.open('mailto:david.garsten@yale.edu'); 
}

let currentImageIndex = -1;
const images = [
    'images/headshots/murray.jpg',
    'images/headshots/fruit.jpeg',
    'images/headshots/siena.jpg',
    'images/headshots/composing.jpg',
    'images/headshots/chimpanzee.jpg',
    'images/headshots/hawai\'i.jpg',
    'images/headshots/fish.jpeg',
    'images/headshots/backyard.jpg',
];

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    document.getElementById('me-img').src = images[currentImageIndex];
}




// COOL OLD NAME THING
const title = document.getElementById('title');
const aSpan = document.getElementById('a');
let interval = null;
let paused = false;
let timeoutId = null;
let maxLetters = 100;

function updateMaxLetters() {
    // 1 letter / ~20px width, 200 cap
    maxLetters = Math.min(Math.floor(window.innerWidth / 40), 200);
}
updateMaxLetters();
window.addEventListener('resize', updateMaxLetters);

// const pattern = [1, 5, 20, 40, 10, 50, 7];
let i = 0;

function randomLetters(length) {
const letters = 'aəɐɑɘɛɜœβɓʙɕçbcðɖɗdeɻɽɟɺfɣɠɢgħɦɨıɪʑʝȷʁʀɞʜʎɭɫʟæɲɱʛhijklmŋɴɳɔɒɵɸɰɾɚɹ˞ʃʂθʈʊʉɤʋⱱʌʟʍɯɝɥʏχʒʐnopqrstuvwxyz';
let result = '';
for (let i = 0; i < length; i++) {
    result += letters[Math.floor(Math.random() * letters.length)];
}
return result;
}

function updateA() {
    if (paused) return;
    // const count = pattern[i % pattern.length];
    const count = Math.floor(Math.random() * maxLetters) + 1;

    // const count = Math.floor(Math.random() * 5) + 1;
    // aSpan.textContent = 'a'.repeat(count);
    aSpan.textContent = randomLetters(count);

    // random interval
    const nextDelay = Math.random() * 100;
    timeoutId = setTimeout(updateA, nextDelay);

    // vibration
    // const randomTilt = (Math.random() - 0.5) * 10;
    // aSpan.style.transform = `rotate(${randomTilt}deg)`;

    i++;
}

function startAnimation() {
    // if (!interval) interval = setInterval(updateA, 100);
    if (!timeoutId) updateA();
}
function stopAnimation() {
    // clearInterval(interval);
    // interval = null;
    clearTimeout(timeoutId);
    timeoutId = null;
}

function pause() {
    paused = true;
    stopAnimation();
    aSpan.textContent = 'arste';
    aSpan.style.transform = '';
    aSpan.style.letterSpacing = '';
}

function resume() {
    paused = false;
    startAnimation();
}

// desktop
title.addEventListener('mouseenter', resume);
title.addEventListener('mouseleave', pause);

// mobile
title.addEventListener('touchstart', (e) => {
    e.preventDefault(); // prevent highlight/zoom
    resume();
});
title.addEventListener('touchend', pause);
title.addEventListener('touchcancel', pause);

stopAnimation();
