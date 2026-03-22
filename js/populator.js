let leftContent;
let rightContent;

document.addEventListener("DOMContentLoaded", () => {
    leftContent = document.getElementById("left-content");
    rightContent = document.getElementById("right-content");
    replaceLeft('read-me');});
    
function resetRightBox(){
    document.getElementById("right-box").style.backgroundImage = 'none';
    document.getElementById("right-box").style.height = 'auto';
    document.getElementById("welcome-box").style.display = 'none';
    document.getElementById("right-half").style.display = 'flex';
}
function replaceContent (place, input) {
    if (!place) {console.error("place is missing"); return;}
    if (!input) {console.error("input is missing"); return;}
    nextImage();

    (async () => {
        try {
            const response = await fetch(`html/${input}.html`);
            const content = await response.text();
            place.innerHTML = content;} 
        catch (err) {console.error(`error fetching content for ${input}:`, err);}
    
        switch (input) {
            case 'read-me':
                document.getElementById("read-me-button").classList.remove("inactive");
                document.getElementById("about-me-button").classList.add("inactive");
                break;
            case 'about-me':
                document.getElementById("about-me-button").classList.remove("inactive");
                document.getElementById("read-me-button").classList.add("inactive");
                break;
            case 'welcome':
                break;
            case '404':
                resetRightBox();
                break;
            case 'research':
                resetRightBox();
                document.getElementById("research-button").classList.remove("inactive");
                document.getElementById("creative-button").classList.add("inactive");
                document.getElementById("affiliations-button").classList.add("inactive");
                document.getElementById("favorites-button").classList.add("inactive");
                break;
            case 'creative':
                resetRightBox();
                document.getElementById("creative-button").classList.remove("inactive");
                document.getElementById("research-button").classList.add("inactive");
                document.getElementById("affiliations-button").classList.add("inactive");
                document.getElementById("favorites-button").classList.add("inactive");
                break;
            case 'affiliations':
                resetRightBox();
                document.getElementById("affiliations-button").classList.remove("inactive");
                document.getElementById("research-button").classList.add("inactive");
                document.getElementById("creative-button").classList.add("inactive");
                document.getElementById("favorites-button").classList.add("inactive");
                break;
            case 'favorites':
                resetRightBox();
                document.getElementById("favorites-button").classList.remove("inactive");
                document.getElementById("research-button").classList.add("inactive");
                document.getElementById("creative-button").classList.add("inactive");
                document.getElementById("affiliations-button").classList.add("inactive");
                break;
        }
    })();}

window.replaceLeft = function(leftchoice) {
    console.log("replaceLefting", leftchoice);
    if (!leftContent) {console.error("left content is missing"); return;} 
    replaceContent(leftContent, leftchoice);}

window.replaceRight = function(rightchoice) {
    console.log("replaceRighting", rightchoice);
    if (!rightContent) {console.error("right content is missing"); return;}
    replaceContent(rightContent, rightchoice);}