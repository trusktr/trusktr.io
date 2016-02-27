
var pageWidth = 0;
var heartPositionTop = $('#heart').offset().top;
var heartPositionLeft = $('#heart').position().left;

/*
 *BEGIN FOLLOWING FACE CODE {
 */
var boundaries_top = new Array(),
    boundaries_right = new Array(),
    boundaries_bottom = new Array(),
    boundaries_left = new Array(),
    mouse_positions = new Array(),
    face_directions = new Array();
/*
 *END FOLLOWING FACE CODE }
 */

$(document).ready(function() {
    pageWidth = $('html').width();
    heartPositionTop = $('#heart').offset().top;
    heartPositionLeft = $('#heart').position().left;

    //inefficient
    // function blink(){
        // $('div#hello').delay(1000).fadeOut(0).delay(400).fadeIn(0, function () {
          // blink();
        // });
    // }
    // blink();

    //efficient
    // function blink(){
        // $('div').delay(1000).fadeOut(0).delay(400).fadeIn(0);
    // }
    // blink();
    // setInterval(function() {
        // blink();
    // }, 1400);


    //$('.rotater').css({
      //  'left':'-'+$('#page').width()+'px'
    //});



    var mouseMoveCount = 0,
        colorHigh = 359, // HSL Hue
        colorLow = 0, // HSL Hue
        colorRange = colorHigh - colorLow,
        colorHue,
        colorSaturation = '34',
        colorLightness = '46',
        hslParts = [],
        nextClickCount = 0;

    $('html, body').on('mousemove', function(event) {
        //Gradient HSL color change on mouse move for background and text.
        var _this = $(this);

        colorHue = Math.floor(event.pageX / pageWidth * colorRange + colorLow);
        $('body, html').css({'color':'hsl('+colorHue+','+colorSaturation+'%,'+colorLightness+'%)'});
        $('#more').css({'color':'hsl('+colorHue+','+Math.floor(colorSaturation*0.1)+'%,'+colorLightness+'%)'});
        $('a[class!="nohighlight"]').css({'background-color':'hsl('+colorHue+','+colorSaturation+'%,'+colorLightness+'%)'});

        if (mouseMoveCount%10 == 0) {
            mouseMoveCount = 0;
        }
        mouseMoveCount++;
    });

    //Random HSL colors on interval for the heart.
    setInterval(function() {
        for (var i=0; i<1; i++) {
            hslParts[i] = Math.floor(Math.random()*colorRange + colorLow);
        }
        $('#heart').css({'color':'hsl('+hslParts[0]+',47%,75%)'});
    }, 100);

    $('#next').css('top', ($(window).height()/2 - $('#next').height()/2) + 'px');

    setTimeout(function() {
        $('#hello').addClass('comeIn');
    }, /*500*/0);
    setTimeout(function() {
        $('#nameIs').addClass('comeIn');
    }, /*2200*/0);
    setTimeout(function() {
        $('#joePea').addClass('comeIn');
    }, /*2500*/0);
    setTimeout(function() {
        $('#email').addClass('comeIn');
    }, /*4200*/0);
    setTimeout(function() {
        $('#skating').addClass('comeIn');
    }, /*5500*/0);
    setTimeout(function() {
        $('#csc').addClass('comeIn');
    }, /*6500*/0);
    setTimeout(function() {
        $('#music').fadeIn(0);
    }, /*8000*/0);
    setTimeout(function() {
        $('#goal').addClass('comeIn');
    }, /*9000*/0);
    setTimeout(function() {
        $('#next').fadeIn(1200);
    }, 1200);

    $('#next').on('click', function(event) {
        var _this = $(this);

        _this.fadeOut(0);
        nextClickCount++;

        $('.introOnly > *').fadeOut(1000);
        $('#skating > span').not('#heart').fadeOut(1000, function() {

            $('#heart').appendTo('body').css({
                'position': 'absolute',
                'top': heartPositionTop+'px',
                'left': (heartPositionLeft+40)+'px'
            });

            setTimeout(function() {
                var namePosition = $('#name').offset();
                $('#heart').animate({
                    'top': (namePosition.top - 14) +'px', // avoid hard coded numbers!
                    'left': (namePosition.left + $('#name').width() + 20 + 50/*(profile pic width)*/) +'px' // avoid hard coded numbers!!
                }, function() {
                    $('#heart').text('★');

                    $('#more').fadeIn(2000);
                });
            }, 100);

            /*
             *BEGIN FOLLOWING FACE CODE {
             */
            $('.face_container').each(function() {
                var _this = $(this),
                this_imgHeight = _this.find('img:first').height(),
                this_imgWidth =  _this.find('img:first').width();

                _this.css({
                    'height':''+this_imgHeight+'px',
                    'width':''+this_imgWidth+'px'
                });

                //document the numberical boundaries for each image
                var this_index = _this.index(),
                    this_offset = _this.offset();
                boundaries_top[this_index] = this_offset.top;
                boundaries_right[this_index] = this_offset.left+this_imgWidth;
                boundaries_bottom[this_index] = this_offset.top+this_imgHeight;
                boundaries_left[this_index] = this_offset.left;
                mouse_positions[this_index] = 0; // initiate to no intial mouse position for this face
                face_directions[this_index] = 5; // initiate to middle middle face diretion for this face

            });
            /*
             *END FOLLOWING FACE CODE }
             */
        });

        event.preventDefault();
    });

});

$(window).load(function() {
    pageWidth = $('html').width();
    //heartPositionTop = $('#heart').offset().top;
    //heartPositionLeft = $('#heart').position().left;
    $('#next').css('top', ($(window).height()/2 - $('#next').height()/2) + 'px');

    /*
     *BEGIN FOLLOWING FACE CODE {
     */
    setTimeout(function() {

    $('.face_container').each(function() {
        var _this = $(this),
        this_imgHeight = _this.find('img:first').height(),
        this_imgWidth =  _this.find('img:first').width();

        _this.css({
            'height':''+this_imgHeight+'px',
            'width':''+this_imgWidth+'px'
        });

        //document the numberical boundaries for each image
        var this_index = _this.index(),
            this_offset = _this.offset();
        boundaries_top[this_index] = this_offset.top;
        boundaries_right[this_index] = this_offset.left+this_imgWidth;
        boundaries_bottom[this_index] = this_offset.top+this_imgHeight;
        boundaries_left[this_index] = this_offset.left;
        mouse_positions[this_index] = 0; // initiate to no intial mouse position for this face
        face_directions[this_index] = 5; // initiate to middle middle face diretion for this face

    });

    $('#faces').each(function() {
        var _this = $(this);
        _this.css({
            'width':'auto', // set dynamically later
            'height':'auto' // set dynamically later
        });
    });

    $(document).on('mousemove', function(event) {

        // for each face, check the mouse position
        $('.face_container').each(function() {
            var _this = $(this),
            this_index = _this.index();

            var topY = false, middleY = false, bottomY = false, leftX = false, middleX = false, rightX = false;

            var previous_faceDirection = 0, new_faceDirection = 0;

            // determine the row
            if (event.pageY < boundaries_top[this_index]) {
                // top row
                topY = true;
            }
            else if (event.pageY >= boundaries_top[this_index] && event.pageY <= boundaries_bottom[this_index]) {
                // middle row
                middleY = true;
            }
            else if (event.pageY > boundaries_bottom[this_index]) {
                // bottom row
                bottomY = true;
            }

            // determine the column
            if (event.pageX < boundaries_left[this_index]) {
                // left column
                leftX = true;
            }
            else if (event.pageX >= boundaries_left[this_index] && event.pageX <= boundaries_right[this_index]) {
                // middle column
                middleX = true;
            }
            else if (event.pageX > boundaries_right[this_index]) {
                // right column
                rightX = true;
            }

            // match the row to column
            if (topY) {
                if (leftX) { // top left
                    mouse_positions[this_index] = 1;
                }
                else if (middleX) { // top middle
                    mouse_positions[this_index] = 2;
                }
                else if (rightX) { // top right
                    mouse_positions[this_index] = 3;
                }
            }
            else if (middleY) {
                if (leftX) { // middle left
                    mouse_positions[this_index] = 4;
                }
                else if (middleX) { // middle middle
                    mouse_positions[this_index] = 5;
                }
                else if (rightX) { // middle right
                    mouse_positions[this_index] = 6;
                }
            }
            else if (bottomY) {
                if (leftX) { // bottom left
                    mouse_positions[this_index] = 7;
                }
                else if (middleX) { // bottom middle
                    mouse_positions[this_index] = 8;
                }
                else if (rightX) { // bottom right
                    mouse_positions[this_index] = 9;
                }
            }

            //if we move to a new area, update the face direction
            if (face_directions[this_index] != mouse_positions[this_index]) {
                previous_faceDirection = face_directions[this_index];
                new_faceDirection = face_directions[this_index] = mouse_positions[this_index];
                //show the appropriate face direction
                // lower the z-index of previous face direction
                $('#face'+(this_index+1)+'_'+previous_faceDirection).css({'z-index':'0'});
                //raise the z-index of the new face direction
                $('#face'+(this_index+1)+'_'+new_faceDirection).css({'z-index':'10'});
            }
        });
    });
    }, 1200);
    /*
     *END FOLLOWING FACE CODE }
     */

});

$(window).on('resize', function() {
    pageWidth = $('html').width();
    //heartPositionTop = $('#heart').offset().top;
    //heartPositionLeft = $('#heart').position().left;
    $('#next').css('top', ($(window).height()/2 - $('#next').height()/2) + 'px');
})
