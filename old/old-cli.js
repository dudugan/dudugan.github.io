// cli.js — the fake terminal prompt. Its markup (#cli-input etc.) comes
// from content/cli.html, fetched in by parser.js, so nothing here can run
// until parser.js calls initCli() once that's actually in the DOM.

const CLI_ROUTES = [
    ['rea', 'readme'], ['ab', 'aboutme'], ['r', 'research'],
    ['c', 'creative'], ['a', 'affiliations'], ['f', 'favorites'],
];

function initCli() {
    const input = document.getElementById('cli-input');
    const mirror = document.getElementById('word-mirror');
    if (!input) return;

    input.focus({ preventScroll: true });
    document.body.addEventListener('click', () => input.focus({ preventScroll: true }));
    input.addEventListener('input', () => { mirror.textContent = input.value; });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') e.preventDefault();
        if (e.key !== 'Enter') return;
        const prefix = input.value.split(' ')[0];
        const route = CLI_ROUTES.find(([p]) => prefix.startsWith(p));
        if (route) location.href = route[1] + '.html';
        input.value = '';
        mirror.textContent = '';
    });
}

window.initCli = initCli;
