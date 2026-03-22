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

        if (prefix.startsWith('rea')){
            replaceLeft('read-me');
            lastPath.innerHTML = `\\readme_`;} 
        else if (prefix.startsWith('ab')){
            replaceLeft('about-me');
            lastPath.innerHTML = `\\aboutme_`;} 
        else if (prefix.startsWith('r')){
            replaceRight('research');
            lastPath.innerHTML = `\\research_`;} 
        else if (prefix.startsWith('c')){
            replaceRight('creative');
            lastPath.innerHTML = `\\creative_`;} 
        else if (prefix.startsWith('a')){
            replaceRight('affiliations');
            lastPath.innerHTML = `\\affiliations_`;} 
        else if (prefix.startsWith('f')){
            replaceRight('favorites');
            lastPath.innerHTML = `\\favorites_`;}

        input.value = '';
        wordMirror.textContent = '';}
});