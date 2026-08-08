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

document.body.addEventListener('click', () => {
    document.getElementById('cli-input')?.focus({ preventScroll: true });
});

function initCli() {
    const input = document.getElementById('cli-input');
    const mirror = document.getElementById('word-mirror');
    if (!input) return;

    input.focus({ preventScroll: true });
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
