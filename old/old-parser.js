// 1. turns content md into html
// 2. mounts html content

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
            .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2">$1</a>');

        for (const [a, b] of swaps) text = text.split(b).join(a.replace('\\', ''));
        return text;
    }
}

// ---- mounting ----------------------------------------------------------
//
// Every page loads this file plus helpers.js and cli.js. On load, this
// figures out which page it is from the URL, drops that page's markdown
// into whichever content mount exists, and fills in the shared pieces
// (nav/photo/copyright/linktree are markdown or plain HTML fetched from
// content/; cli.js takes over once content/cli.html is in the DOM).

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

async function initPage() {
    const page = location.pathname.split('/').pop().replace(/\.html$/, '') || 'readme';

    await fillMarkdown('#copyright', 'content/copyright.md');
    await fillRaw('#navbar', 'content/navbar.html');
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const current = navbar.querySelector(`a[href="${page}.html"]`);
        if (current) current.closest('.nav-item').classList.add('active');
    }
    await fillRaw('#photo', 'content/photo.html');
    await fillRaw('.linktree', 'content/linktree.html');

    // readme.html has #content; every other page uses sidebar.html, which
    // has #left-content (always the condensed sidebar bio) + #right-content
    if (document.getElementById('right-content')) {
        await fillMarkdown('#left-content', 'content/sidebar.md');
        await fillMarkdown('#right-content', `content/${page}.md`);
    } else {
        await fillMarkdown('#content', `content/${page}.md`);
    }

    await fillRaw('#cli', 'content/cli.html');
    const lastPath = document.getElementById('last-path');
    if (lastPath) lastPath.textContent = '\\' + page + '_';
    if (window.initCli) window.initCli();
}

document.addEventListener('click', (e) => {
    const header = e.target.closest('.accordion-header');
    if (header) header.closest('.accordion-section').classList.toggle('open');
    // open/closed visuals (display + chevron rotation) are plain CSS --
    // toggling the class is all this needs to do.
});

document.addEventListener('DOMContentLoaded', initPage);
