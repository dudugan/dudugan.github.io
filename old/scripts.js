// preview.js
//
// Wires up preview.html: a bare-bones harness for browsing content/*.md
// through markdown-parser.js and clicking between them. This is a test
// harness, not the real site's navigation/behavior code -- script.js
// (whenever it's written for real) doesn't have to look anything like
// this.

const PAGE_TITLES = {
    'read-me': "readme",
    'about-me': "about me",
    research: "research",
    creative: "creative",
    affiliations: "affiliations",
    favorites: "favorites",
};

const page = document.getElementById('page');
const pageContent = document.getElementById('page-content');
const profilePhoto = document.getElementById('profile-photo');
const cliLine = document.getElementById('cli-line');
const siteNav = document.getElementById('site-nav');
const linktree = document.getElementById('linktree');
const siteFooter = document.getElementById('site-footer');

async function loadPage(key) {
    let markdown;
    try {
        const res = await fetch('content/' + key + '.md');
        if (!res.ok) throw new Error('not found');
        markdown = await res.text();
    } catch (err) {
        markdown = await (await fetch('content/404.md')).text();
    }
    pageContent.innerHTML = renderMarkdown(markdown);
    pageContent.querySelectorAll('.accordion-body').forEach((el) => { el.style.display = 'none'; });

    page.className = 'page-' + key;
    profilePhoto.classList.toggle('visible', key === 'read-me');

    const cliKey = key === 'read-me' ? 'readme' : key === 'about-me' ? 'aboutme' : key;
    cliLine.innerHTML = 'borderlineconscious:~# \\' + cliKey + '_<span class="cli-cursor"></span>';

    document.title = (PAGE_TITLES[key] || key) + ' — content preview';
    siteNav.querySelectorAll('.nav-item').forEach((el) => {
        el.classList.toggle('active', el.id === 'nav-' + slugFor(key));
    });
}

function slugFor(key) {
    // matches the slugify() logic in markdown-parser.js's renderNav(): the
    // nav labels are "readme"/"aboutme" (no hyphen), not "read-me"/"about-me"
    if (key === 'read-me') return 'readme';
    if (key === 'about-me') return 'aboutme';
    return key;
}

// readme()/aboutme() are called directly by the onclick="..." attributes
// that markdown-parser.js's <nav-left> rule bakes into nav.md's output --
// see renderNav() in markdown-parser.js.
window.readme = () => loadPage('read-me');
window.aboutme = () => loadPage('about-me');

function openlink(url) {
    window.open(url.startsWith('http') ? url : 'https://' + url, '_blank');
}

function downloadFile(relativePath, filename) {
    const link = document.createElement('a');
    link.href = relativePath;
    link.download = filename || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function addTildeSeparators(container) {
    const items = container.querySelectorAll('.nav-item');
    items.forEach((item, i) => {
        if (i === 0) return;
        const tilde = document.createElement('span');
        tilde.className = 'nav-tilde';
        tilde.textContent = '~';
        item.parentNode.insertBefore(tilde, item);
    });
}

async function init() {
    const navMd = await (await fetch('content/nav.md')).text();
    siteNav.innerHTML = renderMarkdown(navMd);
    addTildeSeparators(siteNav);

    // <nav-right> items render as real <a href="research.html"> links (see
    // renderNav() in markdown-parser.js) since on the real site they're
    // meant to be actual separate pages. This preview is a single page, so
    // clicks on them are caught here and routed through loadPage() instead
    // of letting the browser navigate to a file that doesn't exist.
    siteNav.addEventListener('click', (e) => {
        const link = e.target.closest('.nav-right-item');
        if (!link) return;
        e.preventDefault();
        const key = link.getAttribute('href').replace(/\.html$/, '');
        loadPage(key);
    });

    const linktreeMd = await (await fetch('content/linktree.md')).text();
    linktree.innerHTML = renderMarkdown(linktreeMd);
    linktree.addEventListener('click', (e) => {
        const btn = e.target.closest('.link-btn');
        if (!btn) return;
        if (btn.dataset.linkDownload) {
            downloadFile(btn.dataset.linkDownload, btn.dataset.linkFilename);
        } else if (btn.dataset.linkUrl) {
            openlink(btn.dataset.linkUrl);
        }
    });

    const footerMd = await (await fetch('content/footer.md')).text();
    siteFooter.innerHTML = renderMarkdown(footerMd);

    page.addEventListener('click', (e) => {
        const header = e.target.closest('.accordion-header');
        if (!header) return;
        const section = header.closest('.accordion-section');
        const willOpen = !section.classList.contains('open');
        section.classList.toggle('open', willOpen);
        const body = section.querySelector('.accordion-body');
        if (body) body.style.display = willOpen ? 'block' : 'none';
        const chevron = header.querySelector('.accordion-chevron');
        if (chevron) chevron.textContent = willOpen ? 'v' : '>';
    });

    loadPage('read-me');
}

init();
