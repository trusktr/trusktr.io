

/*
 *lexiScanner is a class with methods.
 */
var lexiScanner = function() {
    //private
    var string = "";
    var charPtr = 0; // points to the initial character at first.
    var previousCharPtr = 0;
    var advanced = false;

    //public
    this.parensOpen = 0; // to keep track of parentheses.

    this.setString = function(inputString) {
        string = inputString;
        charPtr = 0; // back to the beginning.
        previousCharPtr = 0;
        this.parensOpen = 0;
        // count open/close parens
        if (this.token() == "(") { this.parensOpen++; } else if (this.token() == ")") { this.parensOpen--; }
            /*console.log("PARENS: "+this.parensOpen);*/
            /*console.log("charPtr: "+charPtr);*/
    };

    this.firstToken = function() {
        // get first character from string.
        return string.charAt(0);
    };
    this.token = function() {
        return string.charAt(charPtr);
    };
    this.tokenAt = function(i) {
        return string.charAt(i);
    };
    this.getNextTerminal = function() {
        previousCharPtr = charPtr;
        return string.charAt(charPtr < string.length-1 ? ++charPtr : charPtr);
    };
    this.getPreviousTerminal = function() {
        previousCharPtr = charPtr;
        return string.charAt(charPtr > 0 ? --charPtr : charPtr);
    };
    this.index = function() {
        return charPtr;
    };
    this.previousIndex = function() {
        return previousCharPtr;
    }
    this.advancePtr = function() {
        previousCharPtr = charPtr;
        if (charPtr < string.length-1) {
            charPtr++;
            advanced = true;
            // count open/close parens
            if (this.token() == "(") { this.parensOpen++; } else if (this.token() == ")") { this.parensOpen--; }
                /*console.log("PARENS: "+this.parensOpen);*/
                /*console.log("charPtr: "+charPtr);*/
        }
        else {
            advanced = false;
        }
        return charPtr;
    };
    this.rewindPtr = function() {
        previousCharPtr = charPtr;
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

/*
 *##########################################################################
 *#### NORMAL CREDIT
 *##########################################################################
 */
// normal_credit namespace (basically just a self-instantiated class (Yeah, JavaScript's crazy good))
var normal_credit = new (function() {
    var scanner = new lexiScanner();

    this.exp = function() {
        if (!this.term()) {
            /*console.log("EXP error 1: TERM expected.");*/
            return false;
        }

            /*console.log("EXP WHILE 1: "+scanner.token());*/
        while (scanner.token() == "+" || scanner.token() == "-") {
            /*console.log("EXP WHILE 2: "+scanner.token());*/

            scanner.advancePtr();
                if (scanner.parensOpen < 0) {return false;}
                if (scanner.isLastChar() && scanner.parensOpen != 0) {return false;}

            if (!this.term()) {
                /*console.log("EXP error 2: TERM expected after '+' or '-'.");*/
                return false;
            }
        }

        return true;
    }

    this.term = function() {
        if (!this.factor()) {
            /*console.log("TERM error 1: FACTOR expected.");*/
            return false;
        }
        /*console.log("TERM WHILE 1: "+scanner.token());*/

        while (scanner.token() == "*" || scanner.token() == "/") {

            scanner.advancePtr();
                if (scanner.parensOpen < 0) {return false;}
                if (scanner.isLastChar() && scanner.parensOpen != 0) {return false;}

            if (!this.factor()) {
                /*console.log("TERM error 2: FACTOR expected after '*' or '/'.");*/
                return false;
            }
        }

        return true;
    }


    this.factor = function() {
        if (scanner.token() == "(") {

            scanner.advancePtr();
                if (scanner.parensOpen < 0) {return false;}
                if (scanner.isLastChar() && scanner.parensOpen != 0) {return false;} // there MUST be something after (, or it's invalid.

            if (this.exp()) {
                if (scanner.token() != ")") {
                    /*console.log("FACTOR error 1: ')' expected after EXP");*/
                    return false;
                }

                scanner.advancePtr();
                    if (scanner.parensOpen < 0) {return false;}
                    if (scanner.isLastChar() && scanner.parensOpen != 0) {return false;}
            }
            else {
                /*console.log("FACTOR error 2: EXP expected after '('");*/
                return false;
            }
        }
        else {
            if (!this.digit()) {
                /*console.log("FACTOR error 3: DIGIT expected.");*/
                return false;
            }
        }

        return true;
    }


    this.digit = function() {
        if (!(
            parseInt(scanner.token()) == 0 ||
            parseInt(scanner.token()) == 1 ||
            parseInt(scanner.token()) == 2 ||
            parseInt(scanner.token()) == 3
        )) {
            /*console.log("DIGIT error 1: '0', '1', '2', or '3' expected.");*/
            return false;
        }

        var digitIndex = scanner.index();
            /*console.log("Digit Index: "+digitIndex);*/

            scanner.advancePtr();
                if (scanner.parensOpen < 0) {return false;}
                if (scanner.isLastChar() && scanner.parensOpen != 0) {return false;}

            /*console.log("New Index: "+scanner.index());*/
            /*console.log("AFTER DIGIT: "+scanner.token());*/


            //a digit can be only be followed by an operator, closing parenthesis if open parenthesis,
            //or END of string.  Return false otherwise.
            if (scanner.index() != digitIndex)
            {
                if (scanner.token() == "(") { // a ( following a DIGIT is automaticallly failure.
                    /*console.log('FOO BAR BLAH');*/ return false;
                }
                /*console.log("ONE: "+scanner.token());*/
                if (scanner.parensOpen >= 0)
                {
                    /*console.log("TWO: "+scanner.token());*/
                    if (scanner.token() != ")"
                        && scanner.token() != "+"
                        && scanner.token() != "-"
                        && scanner.token() != "*"
                        && scanner.token() != "/"
                    ) {
                        /*console.log("THREE: "+scanner.token());*/
                        return false;
                    }
                }
            }
            // might not need this block at all since this is taken care of on each advancePtr().
            else if (scanner.index() == digitIndex) { // if last character in string.
                /*console.log("SEVEN: "+scanner.token());*/
                if (scanner.parensOpen > 0) {
                    return false;
                }
            }


        return true;
    }


    this.recognize = function(inputString) {
        scanner.setString(inputString);
        /*console.log(scanner.firstToken());*/

        if (this.exp()) {
            /*console.log("The input string is valid. Good job!");*/
            // show message on page.
            return true;
        }
        else {
            /*console.log("Sorry, invalid input. Try again.");*/
            // show message on page.
            return false;
        }
    }
})(); // normal_credit()


/*
 *##########################################################################
 *#### EXTRA CREDIT
 *##########################################################################
 */
// extra_credit namespace (basically just a self-instantiated class (Yeah, JavaScript's crazy good))
var extra_credit = new (function() {
    var scanner = new lexiScanner();


    this.exp = function() {
        if (scanner.token() == "(") {

            scanner.advancePtr();
                if (scanner.parensOpen < 0) {return false;}
                if (scanner.isLastChar() && scanner.parensOpen != 0) {return false;}

            if (this.list()) {
                if (scanner.token() != ")") {
                    /*console.log("ALPHA error 1: ')' expected after LIST");*/
                    return false;
                }

                scanner.advancePtr();
                    if (scanner.parensOpen < 0) {return false;}
                    if (scanner.isLastChar() && scanner.parensOpen != 0) {return false;}
                    if (scanner.previousIndex() != scanner.index() && scanner.token() != "," && scanner.token() != ")") {return false;} // Only a comma or right parens can come after a right parens.
            }
            else {
                /*console.log("FACTOR error 2: LIST expected after '('");*/
                return false;
            }
        }
        else {
            if (scanner.token() != "a") {
                /*console.log("EXP error 3: 'a' expected.");*/
                return false;
            }

            scanner.advancePtr();
                if (scanner.parensOpen < 0) {return false;}
                if (scanner.isLastChar() && scanner.parensOpen != 0) {return false;}
                if (scanner.previousIndex() != scanner.index() && scanner.token() != "," && scanner.token() != ")") {return false;}
        }

        return true;
    }


    this.list = function() {
        if (!this.exp()) {
            /*console.log("LIST error 1: TERM expected.");*/
            return false;
        }

            /*console.log("LIST WHILE 1: "+scanner.token());*/
        while (scanner.token() == ",") {
            /*console.log("LIST WHILE 2: "+scanner.token());*/

            scanner.advancePtr();
                if (scanner.parensOpen < 0) {return false;}
                if (scanner.isLastChar() && scanner.parensOpen != 0) {return false;}

            if (!this.exp()) {
                /*console.log("LIST error 2: TERM expected after '+' or '-'.");*/
                return false;
            }
        }

        return true;
    }

    this.recognize = function(inputString) {
        scanner.setString(inputString);
        /*console.log(scanner.firstToken());*/

        if (this.list()) {
            /*console.log("The input string is valid. Good job!");*/
            // show message on page.
            return true;
        }
        else {
            /*console.log("Sorry, invalid input. Try again.");*/
            // show message on page.
            return false;
        }
    }
})(); // normal_credit()

$(document).ready(function() {
    /*console.log("Enter a string to test: ");*/
    // RECEIVE INPUT into inputString... input changes on keyup of form element.
    var originalInputTip = $('#inputTip span').text();
    $('#string').on('keyup', function() {
        var _this = $(this);
        /*console.log("-----------------------------");*/
        if (_this.val() != "") {
            if (normal_credit.recognize(_this.val())) {
                $('#inputTip span').text("The input string is valid. Good job! ;)");
                //$('#inputTip span').css('color','white');
            }
            else {
                $('#inputTip span').text("Sorry, invalid input. :( Keep trying.");
                //$('#inputTip span').css('color','red');
            }
        }
        else {
            $('#inputTip span').text(originalInputTip);
            //$('#inputTip span').css('color','white');
        }
    });

    var originalInputTipEC = $('#inputTipEC span').text();
    $('#stringec').on('keyup', function() {
        var _this = $(this);
        /*console.log("-----------------------------");*/
        if (_this.val() != "") {
            if (extra_credit.recognize(_this.val())) {
                $('#inputTipEC span').text("The input string is valid. Good job! ;)");
            }
            else {
                $('#inputTipEC span').text("Sorry, invalid input. :( Keep trying.");
            }
        }
        else {
            $('#inputTipEC span').text(originalInputTipEC);
        }
    });
});



