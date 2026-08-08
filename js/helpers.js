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



// -- photo/theme/audio/video hooks ---------------------------------------
//
// two kinds of clicks land here: photo-label clicks (data-action="...")
// and markdown links written as [text](action:name) -- both funnel into
// the same registry via one delegated listener.

const HEADSHOTS = [
    'media/images/headshots/chimpanzee.jpg',
    'media/images/headshots/composing.jpg',
    'media/images/headshots/fish.jpeg',
    'media/images/headshots/murray.jpg',
    'media/images/headshots/fruit.jpeg',
    "media/images/headshots/hawai'i.jpg",
    'media/images/headshots/siena.jpg',
    'media/images/headshots/zurich.jpg',
    'media/images/headshots/tbilisi.jpg',
];

const THEMES = ['default', 'dusk', 'meadow'];
let themeIndex = THEMES.indexOf('default');
document.body.dataset.theme = THEMES[themeIndex]; // default (cream) is the default on load
let photoIndex = -1;
let songbirdAudio = null;
let videoOn = false;

const ACTIONS = {
    'photo-cycle': () => {
        const img = document.getElementById('photo-img');
        if (!img) return;
        photoIndex = (photoIndex + 1) % HEADSHOTS.length;
        img.src = HEADSHOTS[photoIndex];
    },
    'dog-photo': () => {
        const img = document.getElementById('photo-img');
        if (img) img.src = 'media/images/sora.jpg';
    },
    'audio-toggle': () => {
        // .playing is driven off the audio element's own events, not the
        // click itself -- so it only ever shows purple while sound is
        // actually rendering (play() can silently fail/be blocked). Looked
        // up fresh each time (not closed over) since #photo gets replaced
        // wholesale on every SPA route change -- a captured reference would
        // go stale and stop matching the label actually on screen.
        const label = () => document.querySelector('[data-action="audio-toggle"]');
        if (!songbirdAudio) {
            songbirdAudio = new Audio('media/r4.mp3');
            songbirdAudio.loop = true;
            songbirdAudio.addEventListener('playing', () => label()?.classList.add('playing'));
            songbirdAudio.addEventListener('pause', () => label()?.classList.remove('playing'));
        }
        if (songbirdAudio.paused) songbirdAudio.play().catch(() => {});
        else songbirdAudio.pause();
    },
    'video-toggle': () => {
        videoOn = !videoOn;
        document.body.classList.toggle('av-mode', videoOn);
        let video = document.getElementById('bg-video');
        if (videoOn) {
            if (!video) {
                video = document.createElement('video');
                video.id = 'bg-video';
                video.src = 'media/tbilisi.mp4';
                video.poster = 'media/tbilisi-poster.jpg';
                video.playsInline = true;
                video.muted = false;
                // loop isn't set -- 'ended' below drives a manual reverse
                // playback instead, for a forward/back bounce loop.
                document.body.prepend(video);
                video.addEventListener('ended', () => {
                    video.pause();
                    requestAnimationFrame(function stepBack() {
                        if (!videoOn) return;
                        video.currentTime = Math.max(0, video.currentTime - 1 / 30);
                        if (video.currentTime <= 0) { video.play().catch(() => {}); return; }
                        requestAnimationFrame(stepBack);
                    });
                });
            }
            video.play().catch(() => {});
        } else if (video) {
            video.pause();
        }
    },
    'theme-cycle': () => {
        themeIndex = (themeIndex + 1) % THEMES.length;
        document.body.dataset.theme = THEMES[themeIndex];
    },
    // readme's "borderline conscious" topic links -- jump to research and
    // pop the matching accordion open. Navigating is a route change (async,
    // #right-content doesn't exist yet), so the id to open is stashed and
    // picked up by openPendingAccordion() once parser.js finishes rendering.
    'research-humans': () => gotoResearchAccordion('humans'),
    'research-other-animals': () => gotoResearchAccordion('other-animals'),
    'research-aliens': () => gotoResearchAccordion('aliens'),
    'research-ai': () => gotoResearchAccordion('ai'),
    'research-ancient-people': () => gotoResearchAccordion('ancient-people'),
};

// -- accordion open/close "shift" animation --------------------------------
//
// opening an accordion -- however it happens, a direct click or arriving
// via a research-topic link/cli command below -- scrolls it into view,
// which reads as the content "shifting up" to reveal it. Closing the last
// still-open accordion in #right-content reverses that: scrolls back to
// the top, i.e. "shifts back down".
function openAccordion(section) {
    if (!section || section.classList.contains('open')) return;
    section.classList.add('open');
    section.scrollIntoView({ block: 'start', behavior: 'smooth' });
}
function closeAccordion(section) {
    if (!section || !section.classList.contains('open')) return;
    section.classList.remove('open');
    const container = document.getElementById('right-content');
    if (container && !container.querySelector('.accordion-section.open')) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
window.openAccordion = openAccordion;
window.closeAccordion = closeAccordion;

let pendingAccordion = null;
function gotoResearchAccordion(id) {
    pendingAccordion = id;
    if (location.hash === '#research') window.openPendingAccordion?.();
    else location.hash = 'research';
}
window.openPendingAccordion = () => {
    if (!pendingAccordion) return;
    const section = document.getElementById(`accordion-${pendingAccordion}`);
    pendingAccordion = null;
    openAccordion(section);
};

document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action], a[href^="action:"]');
    if (!el) return;
    e.preventDefault();
    const name = el.dataset.action || el.getAttribute('href').slice(7);
    ACTIONS[name]?.(el);
});

// on any route with a #right (i.e. everything but readme), the page itself
// is locked (see body:has(#right) in style.css) and every wheel scroll --
// no matter what it's over -- drives #right's scroll instead, so nothing
// else on the page shifts. #right-content (not #right itself) is the
// actual scroll container -- it's the one with overflow-y:auto -- looked
// up fresh each time since it gets replaced wholesale on every route change.
document.addEventListener('wheel', (e) => {
    const rightContent = document.getElementById('right-content');
    if (!rightContent) return;
    rightContent.scrollTop += e.deltaY;
    e.preventDefault();
}, { passive: false });

// -- navbar highlight ------------------------------------------------------
//
// one highlight element lives in #navbar and gets slid/resized to sit
// behind whichever .nav-item is relevant: the hovered one while the mouse
// is over the navbar, or the active one otherwise. navbar.html is fetched
// once (not per-route), so this only needs to run once; parser.js calls
// window.updateNavHighlight() after every route change to re-settle it on
// the new active item.
function initNavHighlight() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let highlight = document.getElementById('nav-highlight');
    if (!highlight) {
        highlight = document.createElement('span');
        highlight.id = 'nav-highlight';
        navbar.prepend(highlight);
    }

    let litTimer = null;

    // fast while actively tracking the mouse between items, slower when
    // snapping back to rest on the active item (mouseleave, route change,
    // resize) -- two different feels for two different situations
    function moveTo(item, slow) {
        const duration = slow ? 400 : 150;
        clearTimeout(litTimer);
        navbar.querySelectorAll('.nav-item.lit').forEach((el) => el.classList.remove('lit'));
        highlight.style.transitionDuration = duration + 'ms';
        if (!item) { highlight.style.opacity = 0; return; }
        highlight.style.opacity = 1;
        highlight.style.left = (item.offsetLeft - 3) + 'px';
        highlight.style.top = item.offsetTop + 'px';
        highlight.style.width = (item.offsetWidth + 6) + 'px';
        highlight.style.height = item.offsetHeight + 'px';
        // text stays its normal color (coral) until the highlight has
        // actually arrived -- no fade, just a hard cut right as it lands
        litTimer = setTimeout(() => item.classList.add('lit'), duration);
    }

    window.updateNavHighlight = () => moveTo(navbar.querySelector('.nav-item.active'), true);

    navbar.querySelectorAll('.nav-item').forEach((item) => {
        item.addEventListener('mouseenter', () => moveTo(item, false));
    });
    navbar.addEventListener('mouseleave', window.updateNavHighlight);
    window.addEventListener('resize', () => window.updateNavHighlight());

    window.updateNavHighlight();
}
window.initNavHighlight = initNavHighlight;

// -- #right sizing -----------------------------------------------------
//
// max-height can't just be a fixed calc() in CSS -- the pixel offset from
// the viewport top depends on the navbar/margins above #right, which have
// shifted more than once as other things changed, silently pushing #cli
// (the last thing inside #right) below the fold with no way back since
// the outer page can't scroll (see body:has(#right) in style.css). This
// measures #right's actual position and leaves exactly 20px of room below
// it instead of guessing.
function sizeRight() {
    const right = document.getElementById('right');
    if (!right) return;
    const top = right.getBoundingClientRect().top;
    right.style.maxHeight = Math.max(100, window.innerHeight - top - 20) + 'px';
}
window.sizeRight = sizeRight;
window.addEventListener('resize', sizeRight);

// -- #right height "shift" (research/creative only) ----------------------
//
// on research and creative specifically, #right's own height animates to
// match its content's natural size -- #right-content's scrollHeight plus
// #cli -- instead of snapping instantly (flex's default shrink-to-fit) or
// just clipping/scrolling internally. Capped by sizeRight()'s max-height,
// same as before. Every other page keeps the old shrink-to-fit behavior
// (no explicit height set). This isn't tied to any one trigger (accordion
// click, route change, ...) -- it's just re-run any time #right-content's
// content might have changed while on one of these two pages, so it stays
// in sync no matter what caused the change.
function syncRightHeight() {
    const right = document.getElementById('right');
    const content = document.getElementById('right-content');
    if (!right || !content) return;
    const page = document.body.dataset.route;
    if (page !== 'research' && page !== 'creative') {
        right.style.height = '';
        return;
    }
    const cli = document.getElementById('cli');
    const cap = parseFloat(right.style.maxHeight) || Infinity;
    const desired = Math.min(cap, content.scrollHeight + (cli ? cli.offsetHeight : 0));
    right.style.height = desired + 'px';
}
window.syncRightHeight = syncRightHeight;
window.addEventListener('resize', syncRightHeight);
