var bigPrimes = [
    2199023255579,
    87178291199,
    479001599,
    2971215073,
    4398050705407,
    3010349,
    54018521,
    370248451,
    6643838879,
    119218851371,
    5600748293801,
    1686049,
    2922509,
    3276509,
    94418953,
    321534781,
    433494437,
    780291637,
    1405695061,
    2971215073,
    19577194573,
    25209506681
];

var charactersSet = [
            '0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l',
            'm','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J',
            'K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','~','`','!','@','#','$','%',
            '^','&','*','(',')','_','-','+','=','[',']','\\',';',',','.','/','{','}','|',':','<','>','?'
        ];
var tricks = [
            'kickflip',
            'heelflip',
            'hardflip',
            'inward heelflip',
            '360 flip',
            'lazer flip',
            'pop shoveit',
            'backside kickflip',
            'backside heelflip',
            'frontside kickflip',
            'varial flip',
            'varial heelflip',
            'double flip',
            'double heelflip',
            'varial double flip'
];

function trickPickTimer4Action() {
    var t = trickPickTimer4Action;
    var h = $('h1#password');
    var rand = 0;
    var goalNumberOfTrickPicks = 2;
    // TODO: CONTINUE HERE: See CONTINUE HERE below.
    //var goalNumberOfFrames = 100;
    //var specialParameter = 0; //TODO: Rename this to something meaningful.
    //var specialParameterSet = false;

    if (typeof t.donePickingTricks == 'undefined') {
        t.donePickingTricks = false;
        t.trickPickElapsed = 0;
        t.charRevealElapsed = 0;
        t.wait = 0;
        t.tricksPicked = 0;
        t.numTricksPicked = 0;
        t.numCharsRevealed = 0;
        t.picked = ''+generatePassword();
        t.previous = h.text();
        t.charsRevealed = [];
        t.charsNotRevealed = [];
        console.log('BLAH BLAH BLAH ');
    }


    if (!t.donePickingTricks && t.trickPickElapsed >= t.wait) {
        console.log('Picking a trick.');
        while (t.picked == t.previous) {
            t.picked = ''+generatePassword();
        }
        t.previous = t.picked;

        t.numTricksPicked += 1;
        t.wait = Math.abs(Math.pow(t.numTricksPicked*0.1, 4));
        t.trickPickElapsed = -1;
    }
    t.trickPickElapsed++;

    // TODO: CONTINUE HERE: Calculate the specialParameter so that al characters reveal in the same time no matter the length of t.picked trick.
    //var totalFrames = 0;
    //if (t.donePickingTricks && !specialParameterSet) {
    //    specialParameterSet = true;

    //    for (var i=0; i<t.picked.length; i++) {

    //    }
    //}

    if (t.donePickingTricks && t.charRevealElapsed >= t.wait) { // after trick is picked.
        console.log('Revealing a character.');

        rand = Math.floor(Math.random() * t.charsNotRevealed.length);
        t.charsRevealed[t.charsNotRevealed.splice(rand, 1)] = true;

        console.log('  Revealed a character.');

        t.numCharsRevealed += 1;
        t.wait = Math.abs(Math.pow( (t.numCharsRevealed - t.picked.length) * 0.01, 4));
        t.charRevealElapsed = -1;
    }
    t.charRevealElapsed++;
    h.text('');

    if (t.donePickingTricks) {
        for (var i=0; i<t.picked.length; i++) {
            if (t.charsRevealed[i] == true) {
                h.text(h.text()+t.picked[i]);
            }
            else {
                h.text(h.text()+charactersSet[Math.floor(Math.random() * charactersSet.length)]);
            }
            setGeneratorCenter();
        }
    }
    else {
        for (var i=0; i<t.picked.length; i++) {
            h.text(h.text()+charactersSet[Math.floor(Math.random() * charactersSet.length)]);
            setGeneratorCenter();
        }
    }

    if (!t.donePickingTricks && t.numTricksPicked == goalNumberOfTrickPicks) { // done picking tricks
        t.donePickingTricks = true;
        console.log('done picking tricks.');
        t.wait = 0; // reset so character reveal can use.

        // set up for the character reveal.
        for (var i=0; i<t.picked.length; i++) {
            t.charsRevealed[i] = false;
        }
        for (var i=0; i<t.picked.length; i++) {
            t.charsNotRevealed[i] = i;
        }
    }

    if (t.numCharsRevealed == t.picked.length) { // done revealing characters.
        console.log('done revealing final trick.');

        // stop timer and reset stuff for next time.
        trickPickTimer4.stop();
        t.donePickingTricks = false;
        t.trickPickElapsed = 0;
        t.charRevealElapsed = 0;
        t.wait = 0;
        t.tricksPicked = 0;
        t.numTricksPicked = 0;
        t.numCharsRevealed = 0;
        t.picked = ''+generatePassword();
        t.previous = h.text();
        t.charsRevealed = [];
        t.charsNotRevealed = [];
    }
}

function generatePassword() {
    var passwordLength = 24;
    var password = "";
    var index;
    var rand;
    for (var i=0; i<passwordLength; i++) {
        rand = generateNumber();
        index = rand % charactersSet.length;
        password += charactersSet[index];
    }
    return password;
}

function generateNumber() {
    var g = generateNumber;
    var Xn; // This is Xn as in Xn from a Blum Blum Shub sequence.

    if (typeof g.mouseTrailIndex == 'undefined')
        g.mouseTrailIndex = 0;

    // This is the first number of a discrete Blum Blum Shub sequence.
    Xn = aTriangleB(mouseTrailX[g.mouseTrailIndex] * randomNumber, mouseTrailY[g.mouseTrailIndex] * aTriangleB(pickPrime(), pickPrime()));
    g.mouseTrailIndex++; // We loop through the array of mouse pointer positions...
                        // Alternatively we could ask the user to move his mouse between password generations to generate a new table
                        // so each password generation is more random. But we'll leave that for later.
    if (g.mouseTrailIndex == mouseTrailX.length)
        g.mouseTrailIndex = 0; // go back to the beginning of the mouse trail table.

    // This loop does a Blum Blum Sequence of a randomly selected length, seeded by the time.
    // Note: Anywhere you see Math.random(), the random number returned there is based on a time seed.
    // Note: This generator couples JavaScript's time-based seeding with the user's random mousemovement,
    // so we've increased the randomness many times over because no general pattern is likely to be
    // observed from the user's mouse movement, and plus the Blum Blum Shub sequence generates numbers
    // that are seemingly unrelated. Also, the triangle operater (see aTriangleB) introduces more
    // randomness by helping us generate numbers derived from random arithmetic. for the various parameters
    // of our sequence of Blum Blum Shub sequences
    // The end result of each Blum Blum Shub sequence is used along with the user's mouse movement to
    // generate a new starting point for the next sequence that will derive the next random number.
    var M = pickPrime() * pickPrime();
    var n = Math.floor(Math.random() * 100)+50;
    for (var i=0; i<n; i++) {
        Xn = Math.pow(Xn, 2) % M;

        // prevent Xn, and thus our final random number, from ever being zero.
        while (Xn == 0 || Xn == 1)
            Xn = aTriangleB(mouseTrailX[g.mouseTrailIndex] * randomNumber, mouseTrailY[g.mouseTrailIndex] * aTriangleB(pickPrime(), pickPrime()));
        // In the rare event that Xn becomes zero or one, select a new value at random.
        // We avoid zeros and ones because we don't want indeterminants or endless loops.
        // You'll notice that if Xn is one or zero, the loop will go forever.
    }
    randomNumber = Xn; // use it globally,
    return Xn; // or use this return value.
}

function Timer(duration, action, repeat, autostart) {
    var timerId, paused=false, start, remaining = duration;
    this.pause = function() {
        paused = true;
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
    };
    this.stop = function() {
        paused = true;
        window.clearTimeout(timerId);
        remaining = duration; // back to the beginning.
    };
    this.resume = function() {
        paused = false;
        start = new Date();
        if (repeat) {
                    // TODO: The interval duration will be messed up after pausing. It needs a mechanism of resetting the remaining to the original duration.
                    timerId = window.setInterval(action, remaining);
                }
                else {
                    $('*').css('border', '1px solid red')
                    timerId = window.setTimeout(action, remaining);
                }
    };
    this.start = function() {
        this.resume();
    }
    this.isPaused = function() {
        return paused;
    };
    this.setRemaining = function(newValue) {
        remaining = newValue;
    };
        if (autostart) {
            this.resume();
        }
};

var trickPickTimer4 = new Timer(75, trickPickTimer4Action, true, false);
function randomTrick() {
    // onclick, make sure the timer is stopped, reset all vars, start over.
    var t = trickPickTimer4Action, h = $('h1#password');
    trickPickTimer4.stop();
    t.donePickingTricks = false;
    t.trickPickElapsed = 0;
    t.charRevealElapsed = 0;
    t.wait = 0;
    t.tricksPicked = 0;
    t.numTricksPicked = 0;
    t.numCharsRevealed = 0;
    t.picked = ''+generatePassword();
    t.previous = h.text();
    t.charsRevealed = [];
    t.charsNotRevealed = [];
    trickPickTimer4.start();
}


function setGeneratorCenter() {
    var _gen = $('#generator'),
        width = _gen.width(),
        height = _gen.height();

    _gen.css({"margin-left" : "-"+(width/2)+"px"});
    _gen.css({"margin-top" : "-"+(height/2)+"px"});
}

function setGeneratorButtonCenter() {
    var _button = $('#generate');
    _button.css('margin-left','-'+(_button.outerWidth()/2)+'px');
}

function pickPrime() {
    return bigPrimes[Math.floor(Math.random() * bigPrimes.length)];
}

function aTriangleB(a, B) {
    var rand = Math.floor(Math.random() * 4); // a random number to choose a random opration to perform on the two operands of aTriangleB
    var longestLength = (''+a).length >= (''+B).length ? (''+a).length : (''+B).length;

    // prevent a and B from ever being zero!
    while (a == 0 || B == 0) {
        if (a == 0) {
            console.log(" -- a is ZERO!");
            a = aTriangleB(mouseTrailX[Math.floor(Math.random()*mouseTrailX.length)] * randomNumber, mouseTrailY[Math.floor(Math.random()*mouseTrailX.length)] * aTriangleB(pickPrime(), pickPrime()));
        }
        if (B == 0) {
            console.log(" -- B is ZERO!");
            B = aTriangleB(mouseTrailX[Math.floor(Math.random()*mouseTrailX.length)] * randomNumber, mouseTrailY[Math.floor(Math.random()*mouseTrailX.length)] * aTriangleB(pickPrime(), pickPrime()));
        }
    }

    if (rand == 0) {
        // add
        return a + B;
    }
    else if (rand == 1) {
        // subtract
        return Math.abs(a - B); // keep the result positive.
    }
    else if (rand == 2) {
        // multiply
        return a * B;
    }
    else if (rand == 3) {
        // divide
        return (a / B) * Math.pow(10, longestLength); // keep the result big, not small.
    }
}

var randomNumber = pickPrime(); // This contains the result each time that generateNumber() is called. This must be > 0 before calling generateNumber();
function generateInitial() {
    // This function calls generateNumber() a few times using the first 10 pairs of X,Y coordinates
    // of the initial mouse movement to seed the random generator.
    // This generator relies on the date() that the code gets executed as well as the user's mouse input.

    console.log('generate initial.');
    for (var i=0; i<10; i++) {
        console.log(generateNumber());
    }
}

var mouseTrailX = [];
var mouseTrailY = [];
$(document).ready(function() {
    setGeneratorCenter();
    setGeneratorButtonCenter();

    $('html').css({'background-color':'none'});


    var mouseMoveCount = 0;
    var movedEnough = false;
    $('body').on('mousemove', function(event) {
        mouseMoveCount++;
        console.log(mouseMoveCount);
        var _this = $(this),
            colorHigh = 200, // RGB
            colorLow = 100, // RGB
            colorRange = colorHigh - colorLow,
            rgbParts = [];

        // Set random color on each mouse move.
        if (mouseMoveCount%5 == 0) {
            for (var i=0; i<3; i++) {
                rgbParts[i] = Math.floor(Math.random()*colorRange + colorLow);
            }
            $('#password').css({'color':'rgb('+rgbParts[0]+','+rgbParts[1]+','+rgbParts[2]+')'}); // TODO use integers

            if (movedEnough)
                mouseMoveCount = 0;
        }

        // Collect initial mouse move positions to seed random.
        if (!movedEnough) {
            mouseTrailX.push(event.pageX);
            mouseTrailY.push(event.pageY);
            if (mouseMoveCount >= 150) {
                movedEnough = true;
                console.log('Before generateInitial.');
                generateInitial(); // This is synchronous, so the next line enables the generate button after this line is done.
                $('#generate').removeAttr('disabled');
            }
        }
    });

    $('#generate').on('click', function() {
        var _this = $(this);
        if (_this.attr('disabled') == "disbabled") {
            // nothing.
        }
        else {
            randomTrick();
        }
    });
});

$(window).resize(function(){
    setGeneratorCenter();
});


