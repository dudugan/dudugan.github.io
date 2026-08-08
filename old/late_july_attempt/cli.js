const wordMirror = document.getElementById('word-mirror');
const input = document.getElementById('cli-input');
const cli = document.getElementById('cli');
const lastPath = document.getElementById('last-path');
const body = document.body;

window.addEventListener('load', () => input.focus());
cli.addEventListener('click', () => input.focus());
body.addEventListener('click', () => input.focus());
    // ephemeral like that

input.addEventListener('input', () => {
    wordMirror.textContent = input.value;});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') e.preventDefault();});

input.addEventListener('focus', () => console.log('focused'));

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const text = input.value;
        const prefix = text.split(' ')[0];

        // was: replaceLeft('read-me') / replaceRight('research') etc. --
        // those called into the old single-page-app swap functions, which
        // don't exist anymore now that every page has its own url. now we
        // just navigate there directly. also dropped the old 'f' ->
        // favorites branch, since favorites isn't part of the new nav.
        // (David confirmed this file split + this exact fix in
        // ARCHITECTURE.md's open questions -- no other rewrite needed.)
        if (prefix.startsWith('rea')){
            window.location.href = 'index.html';
            lastPath.innerHTML = `\\readme_`;}
        else if (prefix.startsWith('ab')){
            window.location.href = 'about-me.html';
            lastPath.innerHTML = `\\aboutme_`;}
        else if (prefix.startsWith('r')){
            window.location.href = 'research.html';
            lastPath.innerHTML = `\\research_`;}
        else if (prefix.startsWith('c')){
            window.location.href = 'creative.html';
            lastPath.innerHTML = `\\creative_`;}
        else if (prefix.startsWith('a')){
            window.location.href = 'affiliations.html';
            lastPath.innerHTML = `\\affiliations_`;}

        input.value = '';
        wordMirror.textContent = '';}
});