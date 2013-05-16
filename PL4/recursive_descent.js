

/*
 *lexiScanner is a class with methods.
 */
var lexiScanner = function() {
    var string = "";
    var charPtr = 0; // points to the initial character at first.
    var advanced = false;

    this.setString = function(inputString) {
        string = inputString;
        charPtr = 0; // back to the beginning.
    };

    this.firstToken = function() {
        // get first character from string.
        return string.charAt(0);
    };
    this.getCurrentTerminal = function() {
        return string.charAt(charPtr);
    };
    this.getNextTerminal = function() {
        return string.charAt(charPtr < string.length-1 ? ++charPtr : charPtr);
    };
    this.getPreviousTerminal = function() {
        return string.charAt(charPtr > 0 ? --charPtr : charPtr);
    };
    this.index = function() {
        return charPtr;
    };
    this.advancePtr = function() {
        if (charPtr < string.length-1) {
            charPtr++;
            advanced = true;
        }
        else {
            advanced = false;
        }
        return charPtr;
    };
    this.rewindPtr = function() {
        if (charPtr > 0) {
            charPtr--;
            advanced = false;
        }
        else {
            advanced = false;
        }
        return charPtr;
    };
    this.hasAdvanced = function() {
        return advanced;
    };
    this.isLastChar = function() {
        if (charPtr == string.length-1) {
            return true;
        }
        return false;
    };

}
var scanner = new lexiScanner(); // to be used globally by all functions. Yeah, this is bad, but it's good enough for now. :)
var doneScanning = false;

function exp() {
    if (!term()) {
        console.log("error: TERM expected.");
        return false;
    }

    while (scanner.getCurrentTerminal() == "+" || scanner.getCurrentTerminal() == "-") {
        scanner.advancePtr();
        if (!term()) {
            console.log("error: TERM expected after '+' or '-'.");
            return false;
        }
    }

    return true;
}

function term() {
    if (!factor()) {
        console.log("error: FACTOR expected.");
        return false;
    }

    while (scanner.getCurrentTerminal() == "*" || scanner.getCurrentTerminal() == "/") {
        scanner.advancePtr();
        if (!factor()) {
            console.log("error: FACTOR expected after '*' or '/'.");
            return false;
        }
    }

    return true;
}


var parensOpen = 0;
function factor() {
    if (scanner.getCurrentTerminal() == "(") {
        parensOpen++;
        if (scanner.index() == scanner.advancePtr()) return false; // there MUST be something after (, or it's invalid.
        if (exp()) {
            if (scanner.getCurrentTerminal() != ")") {
                console.log("error: ')' expected after EXP");
                return false;
            }
            parensOpen--;
            scanner.advancePtr();
        }
        else {
            console.log("error: EXP expected after '('");
            return false;
        }
    }
    else {
        if (!digit()) {
            console.log("error: DIGIT expected.");
            return false;
        }
    }

    return true;
}


function digit() {
    if (!(
        parseInt(scanner.getCurrentTerminal()) == 0 ||
        parseInt(scanner.getCurrentTerminal()) == 1 ||
        parseInt(scanner.getCurrentTerminal()) == 2 ||
        parseInt(scanner.getCurrentTerminal()) == 3
    )) {
        console.log("error: '0', '1', '2', or '3' expected.");
        return false;
    }
    var digitIndex = 0;
        digitIndex = scanner.index();
        console.log("Digit Index: "+digitIndex);
        scanner.advancePtr();
        console.log("New Index: "+scanner.index());
        console.log("AFTER DIGIT: "+scanner.getCurrentTerminal());


        //a digit can be only be followed by an operator, closing parenthesis if open parenthesis,
        //or END of string.  Return false otherwise.
        if (scanner.index() != digitIndex)
        {
            if (scanner.getCurrentTerminal() == "(") {
                console.log('FOO BAR BLAH'); return false;
            }
        }
        if (scanner.index() != scanner.advancePtr()) { // if there's more after a DIGIT
            console.log('GAZOONTIGHTTTTTTTTTTTTT');
            if (scanner.getCurrentTerminal() != "+"
                && scanner.getCurrentTerminal() != "-"
                && scanner.getCurrentTerminal() != "*"
                && scanner.getCurrentTerminal() != "/"
               )
            {
                console.log('ONE');
                if (parensOpen == 0)
                {
                    console.log('TWO');
                    if (scanner.getCurrentTerminal() == ")")
                        console.log('THREE');
                        return false;
                }
                if (parensOpen > 0)
                {
                console.log('FOUR');
                    if (scanner.getCurrentTerminal() != ")")
                        console.log('FIVE')
                        return false;
                }
            }
        }

    return true;
}


function recognize(inputString) {
    scanner.setString(inputString);
    console.log(scanner.firstToken());

    if (exp()) {
        console.log("The input string is valid. Good job!");
        // show message on page.
    }
    else {
        console.log("Sorry, invalid input. Try again.");
        // show message on page.
    }
}

$(document).ready(function() {
    console.log("Enter a string to test: ");
    // RECEIVE INPUT into inputString... input changes on keyup of form element.
    $('#string').on('keyup', function() {
        var _this = $(this);
        console.log("-----------------------------");
        recognize(_this.val());
    });
});



