


var bigPrimes = [
    BigNumber(2199023255579),
    BigNumber(87178291199),
    BigNumber(479001599),
    BigNumber(2971215073),
    BigNumber(4398050705407),
    BigNumber(3010349),
    BigNumber(54018521),
    BigNumber(370248451),
    BigNumber(6643838879),
    BigNumber(119218851371),
    BigNumber(5600748293801),
    BigNumber(1686049),
    BigNumber(2922509),
    BigNumber(3276509),
    BigNumber(94418953),
    BigNumber(321534781),
    BigNumber(433494437),
    BigNumber(780291637),
    BigNumber(1405695061),
    BigNumber(2971215073),
    BigNumber(19577194573),
    BigNumber(25209506681)
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

    if (typeof t.donePickingTricks == 'undefined')
        t.donePickingTricks = false;
    if (typeof t.trickPickElapsed == 'undefined')
        t.trickPickElapsed = 0;
    if (typeof t.charRevealElapsed == 'undefined')
        t.charRevealElapsed = 0;
    if (typeof t.wait == 'undefined')
        t.wait = 0;
    if (typeof t.tricksPicked == 'undefined')
        t.tricksPicked = 0;
    if (typeof t.numTricksPicked == 'undefined')
        t.numTricksPicked = 0;
    if (typeof t.numCharsRevealed == 'undefined')
        t.numCharsRevealed = 0;
    if (typeof t.picked == 'undefined') {
        t.picked = generatePassword();
        console.log(t.picked);}
    if (typeof t.previous == 'undefined')
        t.previous = h.text();
    if (typeof t.charsRevealed == 'undefined')
        t.charsRevealed = [];
    if (typeof t.charsNotRevealed == 'undefined')
        t.charsNotRevealed = [];


    if (!t.donePickingTricks && t.trickPickElapsed >= t.wait) {
        console.log('Picking a trick.');
        while (t.picked.length == t.previous.length) {
            t.picked = generatePassword();
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
        t.wait = Math.abs(Math.pow(t.numCharsRevealed*0.01 - t.picked.length*0.01, 4));
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
        t.picked = generatePassword();
        t.previous = h.text();
        t.charsRevealed = [];
        t.charsNotRevealed = [];
    }
}

function generateNumber() {
    var g = generateNumber;
    var Xn = BigNumber(0); // This is Xn as in Xn from a Blum Blum Shub sequence.

    if (typeof g.mouseTrailIndex == 'undefined')
        g.mouseTrailIndex = 0;

    // This is the first number of a discrete Blum Blum Shub sequence.
    Xn = aTriangleB( mouseTrailX[g.mouseTrailIndex] .multiply( randomNumber), mouseTrailY[g.mouseTrailIndex] .multiply( aTriangleB(pickPrime(), pickPrime()) ) );
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
    var M = pickPrime() .multiply( pickPrime() ); // BigNumber() number
    var n = Math.floor(Math.random() * 100)+50;
    for (var i=0; i<n; i++) {
        Xn = Xn .pow( 2 ) .mod( M );
    }
    randomNumber = Xn; // use it globally,
    return Xn; // or take the return value.
}

function generatePassword() {
    var passwordLength = 24; // TODO: Allow the user to choose the password length. ;)
    var password = "";
    var index = BigNumber(0);
    var rand = BigNumber(0);
    for (var i=0; i<passwordLength; i++) {
        rand = generateNumber().toFixed(0);
        console.log(" -- rand: "+rand);
        index = rand .mod( charactersSet.length );
        console.log(' -- index: '+index);
        password += charactersSet[parseInt( index.toFixed(0).toString() )];
    }
    return password;
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
    t.picked = generatePassword();
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

/*
 *aTriangleB takes a and B and performs one of four random arithmetic operations on it.
 *Let's call it the triangle operator.
 */
function aTriangleB(a, B) {
    var rand = Math.floor(Math.random() * 4); // a random number to choose aa random operation to perform on the two operands of aTriangleB
    var aString = a.toString(), BString = B.toString();
    console.log(" -- a to string: "+aString);
    console.log(" -- B to string: "+BString);
    var longestLength = aString.length >= BString.length ? aString.length : BString.length;
    var subResult = BigNumber(0);
    var subResult_absolute = BigNumber(0);
    if (rand == 0) {
        // add
        return a .plus( B);
    }
    else if (rand == 1) {
        // subtract
        console.log(" --- a.cmp(B) test: "+a.cmp(B));
        subResult = a .minus( B);
        subResult_absolute = subResult.cmp(0) < 0 ? subResult.minus(subResult).minus(subResult) : subResult;
        return subResult_absolute; // keep the result positive (absolute).
    }
    else if (rand == 2) {
        // multiply
        return a .multiply( B);
    }
    else if (rand == 3) {
        // divide
        return (a .div( B)) .multiply( BigNumber(10) .pow( /*longestLength*/6 ) ); // keep the result bigger, not smaller.
    }
}

var randomNumber = BigNumber(0); // This contains the result each time that generateNumber() is called. This must be > 0 before calling generateNumber();
function generateInitial() {
    // This function calls generateNumber() a few times using the first 10 pairs of X,Y coordinates
    // of the initial mouse movement to seed the random generator.
    // This generator relies on the date() that the code gets executed as well as the user's mouse input.

    console.log('generate initial.');
    for (var i=0; i<10; i++) {
        generateNumber();
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
            colorHigh = 219, // RGB
            colorLow = 143, // RGB
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
                // Convert each mouse movement into BigNumber() numbers.
                for (var i=0; i<mouseTrailX.length; i++) {
                    mouseTrailX[i] = BigNumber(mouseTrailX[i]);
                    mouseTrailY[i] = BigNumber(mouseTrailY[i]);
                }
                randomNumber = pickPrime(); // randomNumber needs to be initialized one time to begin the sequence.
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


