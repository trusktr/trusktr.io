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
            '^','&','*','(',')','_','-','+','=','[',']','\\',';',"'",',','.','/','{','}','|',':','"','<','>','?',' '
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
    var h = $('h1#title');
    var rand = 0;
    var goalNumberOfTrickPicks = 5;
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
    if (typeof t.picked == 'undefined')
        t.picked = pickTrick();
    if (typeof t.previous == 'undefined')
        t.previous = h.text();
    if (typeof t.charsRevealed == 'undefined')
        t.charsRevealed = [];
    if (typeof t.charsNotRevealed == 'undefined')
        t.charsNotRevealed = [];


    if (!t.donePickingTricks && t.trickPickElapsed >= t.wait) {
        console.log('Picking a trick.');
        while (t.picked.length == t.previous.length) {
            t.picked = pickTrick();
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
        t.wait = Math.abs(Math.pow(t.numCharsRevealed*0.1 - t.picked.length*0.1, 4));
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
        }
    }
    else {
        for (var i=0; i<t.picked.length; i++) {
            h.text(h.text()+charactersSet[Math.floor(Math.random() * charactersSet.length)]);
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
        t.picked = pickTrick();
        t.previous = h.text();
        t.charsRevealed = [];
        t.charsNotRevealed = [];
    }
}

function pickTrick() {
    return tricks[ Math.floor(Math.random() * tricks.length) ];
}

function Timer(duration, action, repeat/*TODO: ,autostart*/) {
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
	this.resume(); // if autostart.
};

var trickPickTimer4 = new Timer(75, trickPickTimer4Action, true);
function randomTrick() {
    // onclick, make sure the timer is stopped, reset all vars, start over.
    var t = trickPickTimer4Action, h = $('h1#title');
    trickPickTimer4.stop();
    t.donePickingTricks = false;
    t.trickPickElapsed = 0;
    t.charRevealElapsed = 0;
    t.wait = 0;
    t.tricksPicked = 0;
    t.numTricksPicked = 0;
    t.numCharsRevealed = 0;
    t.picked = pickTrick();
    t.previous = h.text();
    t.charsRevealed = [];
    t.charsNotRevealed = [];
    trickPickTimer4.start();
}


function setTitleCenter() {
	var _title = $('#title'),
		width = _title.width(),
		height = _title.height();

	_title.css({"margin-left" : ""+(-width/2)+"px"});
	_title.css({"margin-top" : ""+(-height/2)+"px"});
}

$(document).ready(function() {
	setTitleCenter();

	$('html').css({'background-color':'none'});


	var mouseMoveCount = 0;
	$('body').on('mousemove', function() {
		var _this = $(this),
			colorHigh = 219, // RGB
			colorLow = 143, // RGB
			colorRange = colorHigh - colorLow,
			rgbParts = [];

		if (mouseMoveCount%20 == 0) {
			for (var i=0; i<3; i++) {
				rgbParts[i] = Math.floor(Math.random()*colorRange + colorLow);
				console.log(rgbParts[i]);
			}
			$('body').css({'background-color':'rgb('+rgbParts[0]+','+rgbParts[1]+','+rgbParts[2]+')'}); // TODO use integers

			mouseMoveCount = 0;
		}

		mouseMoveCount++;
	});

        $('body').on('click', function() {
            randomTrick();
        });

        var 
});

$(window).resize(function(){
    setTitleCenter();
});


