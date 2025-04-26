var id = function(id) {
    return document.getElementById(id);
}

let functions = {
    pSe: 0,
    pSi: 0, 
    pNe: 0, 
    pNi: 0, 
    jFe: 0, 
    jFi: 0, 
    jTe: 0, 
    jTi: 0 
}
let qnum = 0, 
o1 = "", 
o2 = "",
o3 = "", 
o4 = "", 
mbti = ""; 

const currentQ = {
    question_text: "", 
    qimg: "",
    qo1: "", 
    qo2: "", 
    qo3: "", 
    qo4: "", 
    b1answer: "", 
    b2answer: "",
    b3answer: "", 
    b4answer: "",
    display: function() {
        id('questionText').innerHTML = this.question_text; 
        id('questionImage').src = this.qimg;
        id('button1').innerHTML = '→ ' + this.b1answer; 
        id('button2').innerHTML = '→ ' + this.b2answer; 
        id('button3').innerHTML = '→ ' + this.b3answer; 
        id('button4').innerHTML = '→ ' + this.b4answer; 
        id('currentValues').innerHTML = `Se: ${functions.pSe}, Si: ${functions.pSi}, 
            Ne: ${functions.pNe}, Ni: ${functions.pNi}, Fe: ${functions.jFe}, Fi: ${functions.jFi}, 
            Te: ${functions.jTe}, Ti: ${functions.jTi}`; 
        o1 = this.qo1;
        o2 = this.qo2;
        o3 = this.qo3; 
        o4 = this.qo4; 
    }
}

function startQuiz() {
    block('quizpage'); 
    hide('readypage'); 
    nextpage(); 
}

function getResults(freq) {
    const STATES = ['pSe', 'pSi', 'pNe', 'pNi', 'jFe', 'jFi', 'jTe', 'jTi'];
    const CHARSET = STATES.map(s => new Set([...s])); 
        // creates an array of eight sets where each set contains the characters of the state

    // all legal ordered pairs in a deterministic order
    const OUTCOMES = [];
    for (let i = 0; i < STATES.length; ++i) {
        for (let j = 0; j < STATES.length; ++j) {
            if (i === j) continue;               // skip, can't pair state with self
            let ok = true;                       
            for (const ch of CHARSET[i]) {
                if (CHARSET[j].has(ch)) { 
                    ok = false; break;          // if share any characters, skip
                }
            }
            if (ok) OUTCOMES.push([i, j]);       // (indexA, indexB)
        }
    }

    console.log(OUTCOMES); // should be 16 allowed ordered pairs in fixed rank order

    let bestScore   = [-1, -1];  // (max, min)
    let bestRank    = Infinity;  // position in OUTCOMES
    let bestPairIdx = null;      // [idxA, idxB]

    OUTCOMES.forEach((pair, rank) => {
        const [a, b] = pair;
        const fA = freq[STATES[a]] ?? 0;
        const fB = freq[STATES[b]] ?? 0;
    
        const score = [Math.max(fA, fB), Math.min(fA, fB)];
    
        const better =
              score[0] > bestScore[0] ||
              (score[0] === bestScore[0] && score[1] >  bestScore[1]) ||
              (score[0] === bestScore[0] && score[1] === bestScore[1] && rank < bestRank);
    
        if (better) {
          bestScore   = score;
          bestRank    = rank;
          bestPairIdx = pair;
        }
    });

    if (bestPairIdx === null) return null;   // no legal pair at all (shouldn’t happen)

    let [a, b] = bestPairIdx;

    // put the higher frequency first (still an ordered pair!)
    if ((freq[STATES[b]] ?? 0) > (freq[STATES[a]] ?? 0)) {
        [a, b] = [b, a];
    }

    console.log(STATES[a], STATES[b]);
    mbti = STATES[a].slice(1) + STATES[b].slice(1); // remove the first character (p or j)
    console.log(mbti);

    // top two functions -> types
    if (mbti === 'NiFe') {
        id('mbtiprinted').innerText = 'INFJ'; 
    } else if (mbti === 'NiTe') {
        id('mbtiprinted').innerText = 'INTJ';          
    } else if (mbti === 'FeNi') {
        id('mbtiprinted').innerText = 'ENFJ';          
    } else if (mbti === 'FiNe') {
        id('mbtiprinted').innerText = 'INFP';          
    } else if (mbti === 'TeNi') {
        id('mbtiprinted').innerText = 'ENTJ';          
    } else if (mbti === 'TiNe') {
        id('mbtiprinted').innerText = 'INTP';          
    } else if (mbti === 'NeTi') {
        id('mbtiprinted').innerText = 'ENTP';          
    } else if (mbti === 'NeFi') {
        id('mbtiprinted').innerText = 'ENFP';          
    } else if (mbti === 'SiTe') {
        id('mbtiprinted').innerText = 'ISTJ';          
    } else if (mbti === 'SeTi') {
        id('mbtiprinted').innerText = 'ESTP';          
    } else if (mbti === 'SiFe') {
        id('mbtiprinted').innerText = 'ISFJ';          
    } else if (mbti === 'SeFi') {
        id('mbtiprinted').innerText = 'ESFP';          
    } else if (mbti === 'TeSi') {
        id('mbtiprinted').innerText = 'ESTJ';          
    } else if (mbti === 'TiSe') {
        id('mbtiprinted').innerText = 'ISTP';          
    } else if (mbti === 'FeSi') {
        id('mbtiprinted').innerText = 'ESFJ';          
    } else if (mbti === 'FiSe') {
        id('mbtiprinted').innerText = 'ISFP';          
    } 
    // failsafe against annoying people to make them feel special
    // (and maybe also some actual infjs)
    else {
        id('mbtiprinted').innerText = 'oops!';  
    }

    hide('quizpage');
    block('resultspage'); 
}

function nextpage() {
    qnum += 1; 
    if (qnum == 1) {
        currentQ.question_text = `You wake up in a deep dark tunnel. The floor is wet, and the walls are kind of squishy. 
        People around you are talking, but you’re not paying attention because…`; 
        currentQ.qimg = "imgs/1.png";
        currentQ.qo1 = "Ne"; 
        currentQ.qo2 = "Ni"; 
        currentQ.qo3 = "Se"; 
        currentQ.qo4 = "Si"; 
        currentQ.b1answer = `my head is exploding with possibilities: what if we’re on an alien planet? 
        how can i breathe without a mask?`; 
        currentQ.b2answer = `i’m trying to conserve energy right now and 
        what they’re saying doesn’t seem super relevant to me.`; 
        currentQ.b3answer = `they’re talking about some random philosophical topic 
        and i just want to go and DO something!`; 
        currentQ.b4answer = `i was pulled away from my daily routine this morning with NO WARNING!`; 
    } 
    else if (qnum == 2) {
        currentQ.question_text = `You follow the crowd into a giant, misty clearing. 
        Suddenly the air in front of you solidifies into a smiling red blood cell. “Here’s your stop!” they say.`; 
        currentQ.qo1 = "Se"; 
        currentQ.qo2 = "Fe"; 
        currentQ.qo3 = "Te"; 
        currentQ.qo4 = "Ne"; 
        currentQ.b1answer = `awesome! where should we go first?`; 
        currentQ.b2answer = `thanks for all your help, sir! what do you recommend we do now?`; 
        currentQ.b3answer = `okay, so i think the first step is to take an inventory of our supplies.`; 
        currentQ.b4answer = `i’ve always wondered what it would be like to live inside someone else’s body…`; }
    else if (qnum == 3) {
        currentQ.question_text = `the red blood cell rushes off before you can get a word in edgewise, 
        and suddenly a flying sandwich lands on a spongy structure in front of you, and says, 
        “Welcome to the Lungs! I’m Panini.”`; 
        currentQ.qo1 = "Ti"; 
        currentQ.qo2 = "Fi"; 
        currentQ.qo3 = "Ni"; 
        currentQ.qo4 = "Si"; 
        currentQ.b1answer = `wait - what is a flying sandwich doing in the lungs??`; 
        currentQ.b2answer = `Panini is a really beautiful name :)`; 
        currentQ.b3answer = `hey, i was wondering, why are we here?`; 
        currentQ.b4answer = `my grandma loves paninis…`; }
    else if (qnum == 4) {
        currentQ.question_text = `“You have been summoned by the Council of Southeastern Anatomical Noises
            (C-SAN) to discuss a dire matter of intrasonic politics,” says Panini. 
            “But you’re early! What do you want to do?”`; 
        currentQ.qo1 = "Te"; 
        currentQ.qo2 = "Ti"; 
        currentQ.qo3 = "Fi";  
        currentQ.qo4 = "Fe"; 
        currentQ.b1answer = `well, if it’s truly a dire matter of intrasonic politics, 
        I think we shouldn’t waste any time!`; 
        currentQ.b2answer = `how many councils of anatomical noises are there, 
        and why is it divided by cardinal direction?`; 
        currentQ.b3answer = `i really want to help as much as i can but i’m also kind of exhausted from that ride - 
        is it ok if i take a quick nap and then come back?`; 
        currentQ.b4answer = `*turn to the others* what do you guys want to do?`; }
    else if (qnum == 5) {
        currentQ.question_text = `Panini looks puzzled the moment words begin to exit your mouth. 
        “I… can’t understand what you’re saying.” He thinks for a moment, and then whistles loudly. 
        You see a huge blob of mucus bounding towards you in the distance.`; 
        currentQ.qo1 = "Ne"; 
        currentQ.qo2 = "Se"; 
        currentQ.qo3 = "Fe"; 
        currentQ.qo4 = "Te"; 
        currentQ.b1answer = `huh, i wonder why the blob of mucus is moving so fast. it probably won’t kill me, right?`; 
        currentQ.b2answer = `woah, what’s happening! this is all so exciting!`; 
        currentQ.b3answer = `do you see that - do you see that?!`; 
        currentQ.b4answer = `RUN!!`; }
    else if (qnum == 6) {
        currentQ.question_text = `Suddenly the blob of mucus stops, and snuggles up to the flying sandwich. 
        It burps a few times, and then coughs up what looks like a tiny dead fish. It doesn’t smell bad though. `; 
        currentQ.qo1 = "Si"; 
        currentQ.qo2 = "Se"; 
        currentQ.qo3 = "Ne"; 
        currentQ.qo4 = "Ni"; 
        currentQ.b1answer = `ew why is there a dead fish gross`; 
        currentQ.b2answer = `woah, exotic!`; 
        currentQ.b3answer = `wait wait wait I think I read about this in Glossa a few weeks ago!`; 
        currentQ.b4answer = `hmmm… wait, maybe we can use it to communicate? ohhh - that’s why he whistled!!`; }
    else if (qnum == 7) {
        currentQ.question_text = `Panini takes the fish and rubs it for a moment 
        with his wing before dropping it into your hand. He looks at you, waiting. `; 
        currentQ.qo1 = "Te"; 
        currentQ.qo2 = "Ti"; 
        currentQ.qo3 = "Fe"; 
        currentQ.qo4 = "Fi"; 
        currentQ.b1answer = `hmm, how could I get this to work...`; 
        currentQ.b2answer = `how could a fish be a universal translation device? let me think
            about this systematically...`; 
        currentQ.b3answer = `*turn to the others* wait one of you should take this, not me!`; 
        currentQ.b4answer = `*bow to Panini, and make random gestures in order to signal: “what
            should I do with this?”`; }
    else if (qnum == 8) {
        currentQ.question_text = `“They go in your ear, silly,” says Panini after a moment of confusion, 
        and the blob of mucus burps once more. You push it in, and the blob’s burps turn into words: 
        “Hey! I’m Kyle. I just came from the heart - it’s really beautiful, you know. You should go visit.”`; 
        currentQ.qo1 = "Te"; 
        currentQ.qo2 = "Fe"; 
        currentQ.qo3 = "Ne"; 
        currentQ.qo4 = "Se"; 
        currentQ.b1answer = `*takes out notebook* where is it, and when’s a good time to visit?`; 
        currentQ.b2answer = `that sounds great! is that one of your favorite places around here?`; 
        currentQ.b3answer = `woah, i wonder if the heart actually looks red from the inside…`; 
        currentQ.b4answer = `wait, yes! let’s go right now!`; }
    else if (qnum == 9) {
        currentQ.question_text = `Before Kyle can respond, he spontaneously combusts, and ten tiny blobs of mucus take his place.`; 
        currentQ.qo1 = "Ti"; 
        currentQ.qo2 = "Fi"; 
        currentQ.qo3 = "Si"; 
        currentQ.qo4 = "Ni"; 
        currentQ.b1answer = `um… how did that just happen?`; 
        currentQ.b2answer = `aww, there are cute baby blobs of mucus! but where did Kyle go?`; 
        currentQ.b3answer = `oh my god what’s happening why was there just an explosion`; 
        currentQ.b4answer = `huh… Panini, does this happen often?`; }
    else if (qnum == 10) {
        currentQ.question_text = `Before Panini starts to explain, the baby blobs of mucus explode with chatter. 
        “What was our dad like!” they ask you. “Were you friends?” and “who’s that sandwich guy” 
        and “did you know that…” and “do you wanna play hide and seek with us?”`; 
        currentQ.qo1 = "Se"; 
        currentQ.qo2 = "Si"; 
        currentQ.qo3 = "Ni"; 
        currentQ.qo4 = "Ne"; 
        currentQ.b1answer = `I’d love to play hide and seek with you! let’s do it!`; 
        currentQ.b2answer = `uhhhhh too much stimulationnn`; 
        currentQ.b3answer = `sorry, I think I have important intrasonic politics things to think about right now`; 
        currentQ.b4answer = `your dad was pretty cool, for the few seconds I knew him, and that sandwich guy is Panini, 
        my guide here in the Body! And hide and seek sounds fun! And what else did you say, sorry?`; }
    else if (qnum == 11) {
        currentQ.question_text = `The baby blobs of mucus get bored of you and run off before you even get to play 
        hide and seek. “Unfortunately,” says Panini, “I’ll have to terminate you now. 
        Only sounds with triple-A access are allowed to witness our pyrotechnic capabilities.”`; 
        currentQ.qo1 = "Si"; 
        currentQ.qo2 = "Ni"; 
        currentQ.qo3 = "Ti"; 
        currentQ.qo4 = "Fi"; 
        currentQ.b1answer = `wait, terminate?? what does that mean??`; 
        currentQ.b2answer = `*slowly back away* ok, ok... let's just calm down and talk about this for a moment...`; 
        currentQ.b3answer = `excuse me, but how do i not have triple-A access? what about the dire intrasonic politics 
            meeting?`; 
        currentQ.b4answer = `- Panini!! I thought you were a nice guy! this does not feel like you! this is just wrong!`; }
    else if (qnum == 12) {
        currentQ.question_text = `“Sorry man… those are just the rules… to protect you from randomly bursting into flames, you know?”`; 
        currentQ.qo1 = "Ti"; 
        currentQ.qo2 = "Fi"; 
        currentQ.qo3 = "Fe"; 
        currentQ.qo4 = "Te"; 
        currentQ.b1answer = `that doesn't make any sense!!`; 
        currentQ.b2answer = `those rules are NOT nice`; 
        currentQ.b3answer = `i mean i definitely don't want to make other people randomly burst into flames because
            of me...`; 
        currentQ.b4answer = `ok there are so many more efficient ways to do that though`; }
    else if (qnum == 13) {
        currentQ.question_text = `Panini frowns a bit, thinking. Suddenly the same red blood cell from before speeds past you, 
        and you are swept up a long vertical chasm. “We’re busting you outta here!” the red blood cell says. `; 
        currentQ.qo1 = "Se"; 
        currentQ.qo2 = "Ni"; 
        currentQ.qo3 = "Si"; 
        currentQ.qo4 = "Ne"; 
        currentQ.b1answer = `i’m confused… how did you get here?`; 
        currentQ.b2answer = `ugh this adventure was not worth it`; 
        currentQ.b3answer = `ok you better not take me to ANOTHER new place - i don't care how cool it is`; 
        currentQ.b4answer = `ok i’m glad you’re saving me but this place was also kind of cool and super interesting ngl`; }
    else if (qnum == 14) {
        currentQ.question_text = `The red blood cell drops you in a cavernous clearing. 
        The floor is wobbly and squishy, and in front of you are a bunch of white boulders. It’s the end of your journey. 
        He tells you, “you can jump out here! let me know if you’re ever in the area again and we can hang out.”`; 
        currentQ.qo1 = "Ti"; 
        currentQ.qo2 = "Te"; 
        currentQ.qo3 = "Fi"; 
        currentQ.qo4 = "Fe"; 
        currentQ.b1answer = `ok`; 
        currentQ.b2answer = `actually any chance i could book you again in a few hours to take me to this conference 
        i have to go to? we could hang out in the meantime - i have approximately 34 minutes of free time.`; 
        currentQ.b3answer = `ok! but honestly, i’ll want to come back, and i’ll picture myself doing it, but i never actually will :(`; 
        currentQ.b4answer = `will do! thank you so much for all of this! you’ve been a great chaffeur - see you soon!`; }
    else if (qnum == 15) {
        getResults(functions); 
    }
    currentQ.display(); 
}

function answer(direction) {
    if (o1 === "Se" || o1 === "Si" || o1 === "Ne" || o1 === "Ni") {
        o1 = "p" + o1; 
    }
    if (o1 === "Fe" || o1 === "Fi" || o1 === "Te" || o1 === "Ti") {
        o1 = "j" + o1; 
    }
    if (o2 === "Se" || o2 === "Si" || o2 === "Ne" || o2 === "Ni") {
        o2 = "p" + o2; 
    }
    if (o2 === "Fe" || o2 === "Fi" || o2 === "Te" || o2 === "Ti") {
        o2 = "j" + o2; 
    }
    if (o3 === "Se" || o3 === "Si" || o3 === "Ne" || o3 === "Ni") {
        o3 = "p" + o3; 
    }  
    if (o3 === "Fe" || o3 === "Fi" || o3 === "Te" || o3 === "Ti") {
        o3 = "j" + o3; 
    }
    if (o4 === "Se" || o4 === "Si" || o4 === "Ne" || o4 === "Ni") {
        o4 = "p" + o4; 
    }
    if (o4 === "Fe" || o4 === "Fi" || o4 === "Te" || o4 === "Ti") {
        o4 = "j" + o4; 
    }
    if (direction === 'b1') {
        functions[o1] += 1; 
    } else if (direction === 'b2') {
        functions[o2] += 1; 
    } else if (direction === 'b3') {
        functions[o3] += 1; 
    } else if (direction === 'b4') {
        functions[o4] += 1; 
    }
}

function hide(elementId) {
    const element = id(elementId);
    if (element) {
        element.style.display = 'none';
    } else {
        console.log(`element '${elementId}' not found.`);
    }
}
function block(elementId) {
    const element = id(elementId);
    if (element) {
        element.style.display = 'flex';
    } else {
        console.log(`element '${elementId}' not found.`);
    }
}