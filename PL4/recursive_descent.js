

/*
 *lexiScanner is a class with methods.
 */
var lexiScanner = function() {
    this.firstToken = function(input) {
        // get first character from string.
        return input.charAt(0);
    };
    this.getNextTerminal = function(input) {
        return input.charAt(this.charPtr < input.length-1 ? this.charPtr++ : this.charPtr);
    };
    this.getPreviousTerminal = function(input) {
        return input.charAt(this.charPtr > 0 ? this.charPtr-- : this.charPtr);
    };

    this.charPtr = 0; // points to initial char at first.
}

function advanceTokenPtr(tokenPtr) {
    var tokenPtr = lexiScanner.getNextTerminal(inputString);
    // lexiScanner to be written later (or not really in the case of PL Hwk 1)...
}

function exp(tokenPtr) {
    if (!term(tokenPtr)) {
        print "error: TERM expected.";
        return false;
    }

    while (tokenPtr == "+" || tokenPtr == "-") {
        advanceTokenPtr(tokenPtr);
        if (!term(tokenPtr)) {
            print "error: TERM expected after '+' or '-'.";
            return false;
        }
    }

    return true;
}

function term(inputString) {
    if (!factor(tokenPtr)) {
        print "error: FACTOR expected.";
        return false;
    }

    while (tokenPtr == "*" tokenPtr == "/") {
        advanceTokenPtr(tokenPtr);
        if (!factor(tokenPtr)) {
            print "error: FACTOR expected after '*' or '/'.";
            return false;
        }
    }

    return true;
}


function factor(tokenPtr) {
    if (tokenPtr == "(") {
        advanceTokenPtr(tokenPtr);
        if exp(tokenPtr) {
            if (tokenPtr != ")") {
                print "error: ')' expected after EXP";
                return false;
            }
            advanceTokenPtr(tokenPtr);
        }
        else {
            print "error: EXP expected after '('";
            return false;
        }
    }
    else {
        if !digit(tokenPtr) {
            print "error: DIGIT expected.";
            return false;
        }
    }

    return true;
}


function digit(tokenPtr) {
    if (tokenPtr != "0" || "1" || "2" || "3") {
        print "error: '0', '1', '2', or '3' expected.";
        return false;
    }

    advanceTokenPtr(tokenPtr);
    return true;
}


function recognize() {
    var inputString = "";
    var tokenPtr = ""; //points to characters in inputString... In reality this will be just a character.

    console.log("Enter a string to test: ");
    // RECEIVE INPUT into inputString... input changes on keyup of form element.

    tokenPtr = lexiScanner.firstToken(inputString);

    if exp(tokenPtr) {
        console.log("The input string is valid. Good job!");
        // show message on page.
    }
    else {
        console.log("Sorry, invalid input. Try again.");
        // show message on page.
    }
}

$(document).ready(function() {
    recognize();
});




