var id = function(id) {
    return document.getElementById(id);
}

let functions = {
    Se: 0,
    Si: 0, 
    Ne: 0, 
    Ni: 0, 
    Fe: 0, 
    Fi: 0, 
    Te: 0, 
    Ti: 0 
}
let qnum = 0, 
superiorcontenders = [],
secondarycontenders = [], 
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
        id('currentValues').innerHTML = `Se: ${functions.Se}, Si: ${functions.Si}, 
            Ne: ${functions.Ne}, Ni: ${functions.Ni}, Fe: ${functions.Fe}, Fi: ${functions.Fi}, 
            Te: ${functions.Te}, Ti: ${functions.Ti}`; 
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

function getResults() {
    let firstProp = null, secondProp = null, thirdProp = null, fourthProp = null, fifthProp = null; 
    let firstVal = -10, secondVal = -10, thirdVal = -10, fourthVal = -10, fifthVal = -10; 

    // record top five highest functions (3/4/5 are in case 2 doesn't work)
    for (let prop in functions) {
        let val = functions[prop]; 
        if (val > firstVal) {
            fifthVal = fourthVal; 
            fifthProp = fourthProp; 

            fourthVal = thirdVal; 
            fourthProp = thirdProp; 

            thirdVal = secondVal; 
            thirdProp = secondProp; 

            secondVal = firstVal; 
            secondProp = firstProp; 

            firstVal = val; 
            firstProp = prop; 
        } else if (val > secondVal) {
            fifthVal = fourthVal; 
            fifthProp = fourthProp; 

            fourthVal = thirdVal; 
            fourthProp = thirdProp; 

            thirdVal = secondVal; 
            thirdProp = secondProp; 

            secondVal = val; 
            secondProp = prop; 
        } else if (val > thirdVal) {
            fifthVal = fourthVal; 
            fifthProp = fourthProp; 

            fourthVal = thirdVal; 
            fourthProp = thirdProp; 

            thirdVal = val; 
            thirdProp = prop; 
        } else if (val > fourthVal) {
            fifthVal = fourthVal; 
            fifthProp = fourthProp; 

            fourthVal = val; 
            fourthProp = prop; 
        } else if (val > fifthVal) {
            fifthVal = val; 
            fifthProp = prop; 
        }
    }

    // adds dominant function
    if (firstProp === 'Se') {
        mbti += "Se"
    } else if (firstProp === 'Si') {
        mbti += "Si"
    } else if (firstProp === 'Ne') {
        mbti += "Ne"
    } else if (firstProp === 'Ni') {
        mbti += "Ni"
    } else if (firstProp === 'Fe') {
        mbti += "Fe"
    } else if (firstProp === 'Fi') {
        mbti += "Fi"
    } else if (firstProp === 'Te') {
        mbti += "Te"
    } else if (firstProp === 'Ti') {
        mbti += "Ti"
    }

    // to guard against 1. Se, 2. Si/Ne/Ni/Fe/Te mistakes
    let perceiving = new Set(["Se", "Si", "Ne", "Ni"])
    let judging = new Set(["Fe", "Fi", "Te", "Ti"])
    let extroverted = new Set(["Se", "Ne", "Fe", "Te"])
    let introverted = new Set(["Si", "Ni", "Fi", "Ti"])

    if (perceiving.has(firstProp) && perceiving.has(secondProp)) {
        if (perceiving.has(thirdProp)) {
            if (perceiving.has(fourthProp)) {
                secondProp = fifthProp
            } else {
                secondProp = fourthProp
            }
        } else {
            secondProp = thirdProp
        }
    }

    if (judging.has(firstProp) && judging.has(secondProp)) {
        if (judging.has(thirdProp)) {
            if (judging.has(fourthProp)) {
                secondProp = fifthProp
            } else {
                secondProp = fourthProp
            }
        } else {
            secondProp = thirdProp
        }
    }

    if (extroverted.has(firstProp) && extroverted.has(secondProp)) {
        if (extroverted.has(thirdProp)) {
            if (extroverted.has(fourthProp)) {
                secondProp = fifthProp
            } else {
                secondProp = fourthProp
            }
        } else {
            secondProp = thirdProp
        }
    }

    if (introverted.has(firstProp) && introverted.has(secondProp)) {
        if (introverted.has(thirdProp)) {
            if (introverted.has(fourthProp)) {
                secondProp = fifthProp
            } else {
                secondProp = fourthProp
            }
        } else {
            secondProp = thirdProp
        }
    }

    // adds secondary function
    if (secondProp === 'Se') {
        mbti += "Se"
    } else if (secondProp === 'Si') {
        mbti += "Si"
    } else if (secondProp === 'Ne') {
        mbti += "Ne"
    } else if (secondProp === 'Si') {
        mbti += "Ni"
    } else if (secondProp === 'Fe') {
        mbti += "Fe"
    } else if (secondProp === 'Fi') {
        mbti += "Fi"
    } else if (secondProp === 'Te') {
        mbti += "Te"
    } else if (secondProp === 'Ti') {
        mbti += "Ti"
    }

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
    else if (mbti === '') {
        id('mbtiprinted').innerText = 'INFJ';  
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
        getResults(); 
    }
    currentQ.display(); 
}

function answer(direction) {
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