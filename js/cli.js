const CLI_ROUTES = [
    ['rea', 'readme'], ['ab', 'aboutme'], ['r', 'research'],
    ['cha', 'chameleon'], ['c', 'creative'],
    ['ani', 'research-other-animals'], ['anc', 'research-ancient-people'],
    ['an', 'anglerfish'],
    ['art', 'research-ai'], ['al', 'research-aliens'], ['ai', 'research-ai'],
    ['a', 'affiliations'],
    ['f', 'favorites'],
    ['s', 'songbird'], ['o', 'octopus'], ['h', 'research-humans'],
];

const CLI_ACTIONS = {
    chameleon: 'theme-cycle',
    songbird: 'audio-toggle',
    octopus: 'photo-cycle',
    anglerfish: 'video-toggle',
};

// touch-primary devices (phones/tablets) have no physical keyboard, so
// "focus" means popping the on-screen keyboard -- auto-focusing the cli
// there just interrupts navigation instead of offering a shortcut
const isTouchPrimary = window.matchMedia?.('(pointer: coarse)').matches;

// re-focuses the cli after a click anywhere on the page, so typing a
// command works without having to click the cli itself first -- but not
// for clicks on links/buttons/inputs, which navigate or act on their own,
// and not on touch devices, where stealing focus just pops the keyboard
document.body.addEventListener('click', (e) => {
    if (isTouchPrimary) return;
    if (e.target.closest('a, button, input, [data-action]')) return;
    document.getElementById('cli-input')?.focus({ preventScroll: true });
});

function initCli() {
    const input = document.getElementById('cli-input');
    const mirror = document.getElementById('word-mirror');
    if (!input) return;

    if (!isTouchPrimary) input.focus({ preventScroll: true });
    input.addEventListener('input', () => { mirror.textContent = input.value; });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') e.preventDefault();
        if (e.key !== 'Enter') return;
        const prefix = input.value.split(' ')[0];
        const route = CLI_ROUTES.find(([p]) => prefix.startsWith(p));
        if (route) {
            const action = CLI_ACTIONS[route[1]] || (ACTIONS[route[1]] ? route[1] : null);
            if (action) ACTIONS[action]?.();
            else location.hash = route[1];
        }
        input.value = '';
        mirror.textContent = '';
    });
}

window.initCli = initCli;
