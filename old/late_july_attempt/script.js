// LINK-BUTTONS

function downloadFile(relativePath, filename) {
    const link = document.createElement('a');
    link.href = relativePath; 
    link.download = filename || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);}
function openlink(link) {
    url = 'https://' + link; 
    window.open(url, '_blank');}
function emailme() {
    window.open('mailto:duzugan@gmail.com');}

// CONSTS

const HEADSHOTS = [
    'images/headshots/murray.jpg',
    'images/headshots/fruit.jpeg',
    'images/headshots/siena.jpg',
    'images/headshots/composing.jpg',
    'images/headshots/chimpanzee.jpg',
    "images/headshots/hawai'i.jpg",
    'images/headshots/fish.jpeg',
    'images/headshots/backyard.jpg',];

// MOUNTING

function mountToolbars() {
    const buttons = [
        {cls: 'theme-btn', icon: 'icons/toolbar/eclipse.svg', label: 'Toggle dark mode'},
        {cls: 'music-btn', icon: 'icons/toolbar/waveform.svg', label: 'Toggle music'},
        {cls: 'video-btn', icon: 'icons/toolbar/eye.svg', label: 'Toggle background video'},
        {cls: 'dice-btn', icon: 'icons/toolbar/dice.svg', label: 'Shuffle photo'},];
    document.querySelectorAll('.toolbar-mount').forEach((mount) => {
        const list = mount.classList.contains('half-toolbar') ? buttons.slice(0, 2) : buttons;
        mount.innerHTML = list.map((b) =>
            `<button class="tool-btn ${b.cls}" type="button" aria-label="${b.label}"><img src="${b.icon}" alt="${b.label}"></button>`
        ).join('');});}

const NAV_ITEMS = [
    {label: 'readme', href: 'index.html'},
    {label: 'aboutme', href: 'about-me.html'},
    {label: 'research', href: 'research.html'},
    {label: 'creative', href: 'creative.html'},
    {label: 'affiliations', href: 'affiliations.html'},
    {label: 'favorites', href: 'favorites.html'}];
function mountNav() {
    const mount = document.getElementById('nav-mount');
    if (!mount) return;
    const list = NAV_ITEMS.map((item) => `<a class="nav-link"href="${item.href}">${item.label}</a>`).join(' &bull; ') + ' &bull; ';
    wrapMarqueeContent(mount, list);}

const PLATFORM_LINKS = [
    {label: 'substack', url: 'www.borderlineconscious.substack.com'},
    {label: 'spotify', url: 'open.spotify.com/user/mrcranium23?si=023da2ce0ac54237'},
    {label: 'letterboxd', url: 'letterboxd.com/dudushi/'},
    {label: 'goodreads', url: 'www.goodreads.com/user/show/147256252'},
    {label: 'github', url: 'github.com/dudugan'},
    {label: 'resume', download: 'documents/resume.pdf', filename: 'David_Garsten_Resume.pdf'},
    {label: 'instagram', url: 'www.instagram.com/invites/contact/?i=1haytr2eku14k&utm_content=83g1ns3'},];

function mountLinks() {
    const buttonsHtml = PLATFORM_LINKS.map((item, i) =>
        `<button class="link-btn" type="button" data-link-index="${i}">${item.label}</button>`
    ).join('');
    document.querySelectorAll('.links-mount').forEach((mount) => {
        if (mount.classList.contains('marquee')) {
            wrapMarqueeContent(mount, buttonsHtml);
        } else {
            mount.innerHTML = buttonsHtml; // e.g. the sidebar's high-links-mount, which doesn't scroll
        }});}

// event delegation so this works no matter how many .links-mount copies
// exist on the page, or when they get rebuilt by mountLinks() above
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.link-btn');
    if (!btn) return;
    const item = PLATFORM_LINKS[Number(btn.dataset.linkIndex)];
    if (!item) return;
    if (item.download) downloadFile(item.download, item.filename);
    else openlink(item.url);});

// MARQUEE HELPER
//
// the outer .marquee element (nav-mount, footer, etc.) is the fixed-size
// clipping box; the direction classes (marquee-ltr/marquee-rtl) live on
// it in the html already, unchanged. what actually needs to move is an
// inner wrapper around the content, so this helper builds that wrapper
// and copies the direction across. see MARQUEE section below (in
// style.css) for the animation itself.
//
// was: took content the caller had already doubled exactly once, and
// the css always animated by a fixed -50%. bug David found: still a
// visible blank gap. real cause -- doubling isn't actually enough
// unless a single copy is already at least as wide as the mount, which
// it usually isn't (nav/links are short lists, most windows are wide).
// now: takes ONE copy of the content, measures how wide it actually
// renders (via a throwaway offscreen probe), and repeats it as many
// times as needed to comfortably exceed the mount's width -- so
// there's always enough repeated content to fill the visible area no
// matter how wide the window is. the repeat count is passed to css as
// a --marquee-copies custom property; the animation always moves by
// exactly "one copy's width" (-100%/copies), so scroll speed stays the
// same regardless of how many copies that ends up being.
function wrapMarqueeContent(mount, singleCopyHtml) {
    const direction = mount.classList.contains('marquee-ltr') ? 'marquee-ltr' : 'marquee-rtl';

    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute; left:-9999px; top:0; visibility:hidden; white-space:nowrap; display:inline-block;';
    probe.innerHTML = singleCopyHtml;
    document.body.appendChild(probe);
    const copyWidth = probe.offsetWidth || 1;
    probe.remove();

    const mountWidth = mount.offsetWidth || window.innerWidth;
    // *2 so there's a full extra copy's worth of buffer beyond just
    // "barely enough" -- keeps things seamless even as the animation
    // moves through the copies. capped at 20 as a sanity limit.
    const copies = Math.min(20, Math.max(2, Math.ceil((mountWidth * 2) / copyWidth)));

    mount.innerHTML = `<div class="marquee-track ${direction}" style="--marquee-copies:${copies};">${singleCopyHtml.repeat(copies)}</div>`;
}

// PAGE MERGE (content-only pages -> other.html's structure)
//
// fetch() + swap, no build step. A page counts as "content-only" if it
// doesn't already have a .layout element (index.html and other.html
// both do; research.html and friends don't).
async function mergeContentPage() {
    const originalContent = document.body.innerHTML;

    const res = await fetch('other.html');
    const html = await res.text();
    const shell = new DOMParser().parseFromString(html, 'text/html');

    document.title = shell.title || document.title;
    document.body.innerHTML = shell.body.innerHTML;

    // other.html's own <script src="script.js">/<script src="cli.js"> tags
    // came along in that innerHTML string above -- they won't actually
    // run (script tags inserted via .innerHTML never execute, which is
    // also why loadCliScript() below has to use createElement instead),
    // so they're just dead markup at this point. removing them so they
    // don't sit in the page for no reason.
    document.body.querySelectorAll('script').forEach((s) => s.remove());

    const mount = document.getElementById('content-mount');
    if (mount) mount.innerHTML = originalContent;
}

// cli.js's top-level code (const input = document.getElementById(...), etc.)
// runs the moment the file loads, so it needs the #cli markup to already
// exist. that's true for index.html/other.html (they load cli.js as a
// normal <script> tag after their own cli markup), but content-only pages
// don't have that markup until mergeContentPage() above finishes -- and
// it finishes asynchronously, after any static <script> tag would have
// already tried (and failed) to run. so content-only pages don't load
// cli.js statically at all; instead we inject it here, after the merge,
// with a dynamically-created <script> element (unlike script tags that
// arrive via .innerHTML, a script element added with appendChild DOES execute).
function loadCliScript() {
    const script = document.createElement('script');
    script.src = 'cli.js';
    document.body.appendChild(script);
}

// INIT
//
// runs once per page load. on index.html/other.html the structure is
// already there, so this just mounts. on a bare content-only page, it
// merges other.html's structure in first, then mounts the same way.
document.addEventListener('DOMContentLoaded', async () => {
    if (!document.querySelector('.layout')) {
        await mergeContentPage();
        loadCliScript();
    }
    mountToolbars();
    mountNav();
    mountLinks();
    // reveals the page -- see the html:not(.ready) rule in style.css.
    // without this, content-only pages would flash their raw unstyled
    // markup for a moment before the merge above finishes.
    document.documentElement.classList.add('ready');
});

// ACCORDION

function accordionSection(id, iconFile, title, bodyHtml, open) {
    return `
    <div class="accordion-section${open ? ' open' : ''}" id="accordion-${id}">
        <button class="accordion-header" type="button">
            <span class="accordion-chevron">${open ? 'v' : '&gt;'}</span>
            <span class="accordion-icon" style="-webkit-mask-image:url('icons/accordion/${iconFile}');mask-image:url('icons/accordion/${iconFile}');"></span>
            ${title}
        </button>
        <div class="accordion-body">${bodyHtml}</div>
    </div>`;}

document.addEventListener('click', (e) => {
    const header = e.target.closest('.accordion-header');
    if (!header) return;
    const section = header.closest('.accordion-section');
    const chevron = header.querySelector('.accordion-chevron');
    const willOpen = !section.classList.contains('open');
    section.classList.toggle('open', willOpen);
    if (chevron) chevron.textContent = willOpen ? 'v' : '>';});

// TOOLBAR
//
// was: const audio = document.getElementById('bg-audio') / same for video,
// declared once up here at the top of the file. that only worked on
// pages where #bg-audio/#bg-video already exist the moment script.js
// first runs -- true for index.html/other.html, but not for
// content-only pages, where those elements don't exist until
// mergeContentPage() finishes (after this top-level code has already
// run). now: looked up fresh inside the click handler instead, so it
// always finds the current page's real elements.
//
// also: the click handler below was `e.target.closest('#tool-btn')`
// (an id selector matching nothing, since these buttons only ever
// carry classes -- see mountToolbars() above) and was missing the
// closing `)` on addEventListener(...), which made the whole file fail
// to parse. both fixed below; the per-button behavior described in the
// original comments (kept, one per branch) is now real code.
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.tool-btn');
    if (!btn) return;

    // if button class is "theme-btn",
    // put the document in dark mode if in light mode, else in light mode
    // and rotate the button 90 degrees clockwise (with a transition)
    // the page should start in light mode
    if (btn.classList.contains('theme-btn')) {
        document.documentElement.classList.toggle('dark-mode');
        const degrees = (Number(btn.dataset.rotation) || 0) + 90;
        btn.dataset.rotation = degrees;
        btn.style.transform = `rotate(${degrees}deg)`;
    }

    // if button class is "music-btn",
    // if audio is paused,
        // play audio
        // and start an animation whereby the button flips vertically
        // every 0.5 seconds (with no transition)
    // else if audio is playing,
        // pause audio
        // and stop the animation
    // the page should start with paused audio and no animation
    //
    // was: toggled on `audio.paused`. bug David found: clicking didn't
    // play audio, and every click after the first sped the flip up
    // instead of stopping it. cause: audio.play() returns a promise
    // that can fail silently (autoplay restrictions, or the file still
    // being fetched since the <audio> tag has preload="none") -- when
    // that happens, audio.paused snaps back to true, so the *next*
    // click also thinks "paused, let's start" and creates ANOTHER
    // setInterval on top of the one from before (which never got
    // cleared, since that only happens in the "else" branch). two
    // intervals both flipping the same button every 500ms looks exactly
    // like the flip running 2x speed, and it compounds again on every
    // click after that. now: track play/pause state ourselves with a
    // class on the button instead of trusting audio.paused, so the
    // toggle can't desync from what we actually intended -- and log any
    // real playback failure instead of swallowing it, so if audio still
    // doesn't play, the browser console will say why.
    if (btn.classList.contains('music-btn')) {
        const audio = document.getElementById('bg-audio');
        if (!audio) return;
        const isPlaying = btn.classList.contains('is-playing');
        if (!isPlaying) {
            btn.classList.add('is-playing');
            audio.play().catch((err) => console.error('bg-audio failed to play:', err));
            let flipped = false;
            btn.dataset.flipTimer = setInterval(() => {
                flipped = !flipped;
                // "flips vertically" = mirror flip, per David's answer in
                // ARCHIVE.md -- scaleY(-1), no transition (set in style.css)
                btn.style.transform = flipped ? 'scaleY(-1)' : '';
            }, 500);
        } else {
            btn.classList.remove('is-playing');
            audio.pause();
            clearInterval(Number(btn.dataset.flipTimer));
            btn.style.transform = '';
        }
    }

    // if button class is "video-btn",
    // if video is paused,
        // play video
        // and change the image link inside the button to "icons/toolbar/eye-closed.svg"
    // else if video is playing,
        // pause video
        // and change the image link inside the button to "icons/toolbar/eye.svg"
    // the page should start with the video paused and the image "icons/toolbar/eye.svg"
    //
    // was (round 1): play/pause only -- correct, but David was
    // imprecise about where the video should show up (it just sat
    // inline at the bottom of the page). fixed with an .is-visible
    // class (display:none when off, fixed full-page background when
    // on -- see style.css).
    //
    // was (round 2): after that fix, clicking correctly showed/hid the
    // background, but it displayed as a frozen image instead of an
    // actually-playing video. the <video> tag had no `muted` attribute
    // -- some browsers only guarantee that a programmatic play() call
    // will actually start playback (rather than silently no-op) when
    // the element is muted, gesture or not. since the video's poster
    // image is literally that video's own first frame, a stalled
    // play() looks identical to "just an image." fixed by adding
    // `muted` on the <video> tag in index.html/other.html.
    //
    // also new this round: David wants a higher-res video without
    // paying its load cost on every page visit. so the <video> tag no
    // longer has a `src` at all (see index.html/other.html) -- nothing
    // downloads until this handler sets `video.src` itself, the first
    // time the button is ever clicked. every click after that just
    // reuses the already-loaded video.
    //
    // toggles .is-playing on the button (like the music-btn fix above)
    // rather than trusting video.paused, so the visibility class and
    // actual playback can't desync from each other.
    if (btn.classList.contains('video-btn')) {
        const video = document.getElementById('bg-video');
        const img = btn.querySelector('img');
        if (!video) return;
        const isPlaying = btn.classList.contains('is-playing');
        if (!isPlaying) {
            btn.classList.add('is-playing');
            video.classList.add('is-visible');
            if (!video.getAttribute('src')) {
                // first click ever: this is the only point the actual
                // video file gets fetched
                video.src = 'media/tbilisi.mp4';
            }
            // no currentTime reset here, so this resumes from wherever
            // it was last paused (loop is handled by the <video loop>
            // attribute already on the element)
            video.play().catch((err) => console.error('bg-video failed to play:', err));
            if (img) img.src = 'icons/toolbar/eye-closed.svg';
        } else {
            btn.classList.remove('is-playing');
            video.classList.remove('is-visible');
            video.pause();
            if (img) img.src = 'icons/toolbar/eye.svg';
        }
    }

    // if button class is "dice-btn",
    // get the img inside id="photos"
    // make its src equal to a random src from HEADSHOTS
    // (but must be different from the current src)
    if (btn.classList.contains('dice-btn')) {
        const img = document.querySelector('#photos img');
        if (!img) return;
        let next;
        do {
            next = HEADSHOTS[Math.floor(Math.random() * HEADSHOTS.length)];
        } while (next === img.getAttribute('src') && HEADSHOTS.length > 1);
        img.src = next;
    }
});

// MARQUEE
//
// everything with class="marquee" should be a marquee
// things with "marquee-ltr" make the text move left to right
// things with "marquee-rtl" make the text move right to left
// stop marquees on hover, start on move away
//
// implemented as css only (see .marquee-track / @keyframes / :hover
// rules in style.css) -- no js needed here beyond wrapMarqueeContent()
// above, which builds the inner track that the animation runs on. pure
// css :hover also covers "stop on hover, start on move away" for free.
