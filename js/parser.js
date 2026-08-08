function renderMarkdown(markdown) {
    return new MarkdownParser().render(markdown);
}

class MarkdownParser {
    constructor() {
        // Block tags get rendered to final HTML immediately and swapped for
        // a placeholder token, so the paragraph pass below can't mangle
        // them (e.g. wrap a <div> in a <p>). Tokens are restored at the end.
        this.blocks = new Map();
        this.counter = 0;
    }

    render(markdown) {
        const withPlaceholders = this.extractBlocks(markdown || '');
        const withParagraphs = this.buildParagraphs(withPlaceholders);
        return this.resolvePlaceholders(withParagraphs);
    }

    protect(html) {
        const token = '@@MDBLOCK' + this.counter++ + '@@';
        this.blocks.set(token, html);
        return token;
    }

    resolvePlaceholders(text) {
        for (const [token, html] of this.blocks) text = text.split(token).join(html);
        return text;
    }

    isPlaceholder(text) {
        return /^@@MDBLOCK\d+@@$/.test(text);
    }

    // key="value" key2="value2" -> {key: value, key2: value2}
    parseAttrs(str) {
        const attrs = {};
        const re = /([\w-]+)\s*=\s*"([^"]*)"/g;
        let m;
        while ((m = re.exec(str))) attrs[m[1]] = m[2];
        return attrs;
    }

    // "eclipse" -> media/icons/<folder>/eclipse.svg, but a value that's
    // already a path (has a "/" or an extension) is left alone.
    resolveIconPath(value, folder) {
        if (!value || value.includes('/') || /\.[a-z0-9]+$/i.test(value)) return value;
        return `media/icons/${folder}/${value}.svg`;
    }

    slugify(text) {
        return String(text).split('/').pop().replace(/\.[^.]+$/, '')
            .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    extractBlocks(text) {
        text = text.replace(/<html>([\s\S]*?)<\/html>/g, (_, inner) => this.protect(inner.trim()));

        text = text.replace(/<accordion\s+([^>]*)>([\s\S]*?)<\/accordion>/g,
            (_, attrs, body) => this.protect(this.renderAccordion(attrs, body)));

        text = text.replace(/<three-col>([\s\S]*?)<\/three-col>/g,
            (_, inner) => this.protect(this.renderThreeCol(inner)));

        text = text.replace(/<gallery>([\s\S]*?)<\/gallery>/g,
            (_, inner) => this.protect(this.renderGallery(inner)));

        // a bare <img> (outside <gallery>) works the same way, standalone
        text = text.replace(/<img\s+([^>]*)\/?>/g,
            (_, attrs) => this.protect(this.renderImg(this.parseAttrs(attrs))));

        return text;
    }

    renderAccordion(attrStr, body) {
        const { icon = '', title = '' } = this.parseAttrs(attrStr);
        const iconUrl = this.resolveIconPath(icon, 'accordion');
        const id = this.slugify(icon || title);
        return `<div class="accordion-section" id="accordion-${id}">
            <button class="accordion-header" type="button">
                <span class="accordion-chevron">&gt;</span>
                <span class="accordion-icon" style="-webkit-mask-image:url('${iconUrl}');mask-image:url('${iconUrl}');"></span>
                ${this.parseInline(title.trim())}
            </button>
            <div class="accordion-body">${this.render(body.trim())}</div>
        </div>`;
    }

    renderThreeCol(inner) {
        const cols = inner.split('<col>').map((s) => s.trim()).filter(Boolean)
            .map((seg) => `<div class="col">${this.render(seg)}</div>`).join('');
        return `<div class="three-col">${cols}</div>`;
    }

    renderGallery(inner) {
        const imgs = [...inner.matchAll(/<img\s+([^>]*)\/?>/g)]
            .map((m) => this.renderImg(this.parseAttrs(m[1]))).join('');
        return `<div class="gallery">${imgs}</div>`;
    }

    renderImg({ href = '', src = '' }) {
        return `<a class="imglink" href="${href}" target="_blank"><img src="${src}" loading="lazy"></a>`;
    }

    buildParagraphs(text) {
        return text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean).map((block) => {
            // a block that's only placeholder tokens stays as-is (no <p>
            // wrapper) -- block-level elements can't legally nest in a <p>
            const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
            if (lines.length && lines.every((l) => this.isPlaceholder(l))) return lines.join('\n');

            const heading = block.match(/^(#{1,6})\s+(.*)$/);
            if (heading && !block.includes('\n')) {
                const level = heading[1].length;
                return `<h${level}>${this.parseInline(heading[2])}</h${level}>`;
            }

            // single newlines inside a paragraph become <br>, so "- " lines
            // (deliberately not turned into a real list) still read as one
            return `<p>${this.parseInline(block.split('\n').join('<br>\n'))}</p>`;
        }).join('\n');
    }

    parseInline(text) {
        // stash backslash-escaped markdown chars so they survive untouched
        const swaps = [['\\\\', '@@BS@@'], ['\\*', '@@ST@@'], ['\\_', '@@US@@'], ['\\[', '@@LB@@'], ['\\]', '@@RB@@']];
        for (const [a, b] of swaps) text = text.split(a).join(b);

        text = text.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
            // external (http/https) links open in a new tab; internal ones
            // (#hash routes, action:name, #404) navigate/act in-page as
            // before, so they're left without target
            .replace(/\[([^\]]*)\]\(([^)]*)\)/g, (_, label, url) => /^https?:\/\//i.test(url)
                ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`
                : `<a href="${url}">${label}</a>`);

        for (const [a, b] of swaps) text = text.split(b).join(a.replace('\\', ''));
        return text;
    }
}

// ---- mounting ----------------------------------------------------------
//
// One shell now (index.html) instead of one HTML file per page. Routing is
// hash-based (#research, #creative, ...) so switching pages never reloads --
// #copyright/#navbar live outside #content and are fetched once; #content
// itself gets replaced per route, either with the flat readme markdown
// (which embeds its own #photo/#cli via <html> blocks) or with the
// two-column LEFTRIGHT_SHELL below. Either way, whatever mount points show
// up inside #content afterward get filled the same way they always did --
// the fill calls just run after the content that contains them exists.

const LEFTRIGHT_SHELL = '<div id="leftright"><div id="left"><div id="photo"></div>' +
    '<div class="linktree" id="left-linktree"></div></div>' +
    '<div id="right"><div id="right-content"></div><footer id="cli"></footer></div></div>';

async function fetchText(path) {
    const res = await fetch(path);
    return res.ok ? res.text() : '';
}

async function fillMarkdown(selector, path) {
    if (!document.querySelector(selector)) return;
    const html = renderMarkdown(await fetchText(path));
    document.querySelectorAll(selector).forEach((el) => { el.innerHTML = html; });
}

async function fillRaw(selector, path) {
    if (!document.querySelector(selector)) return;
    const html = await fetchText(path);
    document.querySelectorAll(selector).forEach((el) => { el.innerHTML = html; });
}

function setActiveNav(page) {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    navbar.querySelectorAll('.nav-item.active').forEach((el) => el.classList.remove('active'));
    const current = navbar.querySelector(`a[href="#${page}"]`);
    if (current) current.closest('.nav-item').classList.add('active');
    if (window.updateNavHighlight) window.updateNavHighlight();
}

async function renderPage() {
    const page = location.hash.slice(1) || 'readme';
    setActiveNav(page);
    document.body.dataset.route = page;

    const content = document.getElementById('content');
    if (!content) return;

    if (page === 'readme') {
        content.innerHTML = renderMarkdown(await fetchText('content/readme.md'));
        await fillRaw('#photo', 'content/photo.html');
        await fillRaw('.linktree', 'content/linktree.html');
        await fillRaw('#cli', 'content/cli.html');
        if (window.initCli) window.initCli();
    } else {
        // #left (photo + linktree) only gets rebuilt when arriving from
        // readme (or on first load) -- going between two non-readme routes
        // reuses the #leftright already in the DOM and only refills
        // #right-content, so #left doesn't flicker/reset on every nav
        const isNew = !document.getElementById('leftright');
        if (isNew) {
            content.innerHTML = LEFTRIGHT_SHELL;
            await fillRaw('#photo', 'content/photo.html');
            await fillRaw('.linktree', 'content/linktree.html');
            await fillRaw('#cli', 'content/cli.html');
        }
        await fillMarkdown('#right-content', `content/${page}.md`);
        // #cli-input only just got created (isNew) or was already
        // initialized on a previous render -- re-running initCli() on the
        // same persisting input would double up its event listeners
        if (isNew && window.initCli) window.initCli();
    }

    const lastPath = document.getElementById('last-path');
    if (lastPath) lastPath.textContent = '\\' + page + '_';
    if (window.sizeRight) window.sizeRight();
    // sizeRight()'s max-height must be set first -- syncRightHeight()'s
    // cap depends on it
    if (window.syncRightHeight) window.syncRightHeight();
    if (window.openPendingAccordion) window.openPendingAccordion();
}

async function initPage() {
    await fillMarkdown('#copyright', 'content/copyright.md');
    await fillRaw('#navbar', 'content/navbar.html');
    if (window.initNavHighlight) window.initNavHighlight();
    await renderPage();
}

document.addEventListener('click', (e) => {
    const header = e.target.closest('.accordion-header');
    if (!header) return;
    // open/closed visuals (display + chevron rotation) are plain CSS, just
    // driven off the 'open' class -- the scroll-into-view shift is handled
    // by openAccordion/closeAccordion in helpers.js, shared with the
    // research-topic link/cli path. syncRightHeight is separate and just
    // re-checks #right's height any time content here might have changed
    // -- it's a no-op unless we're on research/creative (see helpers.js)
    const section = header.closest('.accordion-section');
    if (section.classList.contains('open')) window.closeAccordion?.(section);
    else window.openAccordion?.(section);
    window.syncRightHeight?.();
});

window.addEventListener('hashchange', renderPage);
document.addEventListener('DOMContentLoaded', initPage);
