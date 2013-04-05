
        var pageWidth = 0;
        var heartPositionTop = $('#heart').offset().top;
        var heartPositionLeft = $('#heart').position().left;
        
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
                colorSaturation = '34%',
                colorLightness = '46%',
                hslParts = [],
                nextClickCount = 0;
                
            $('html, body').on('mousemove', function(event) {
                //Gradient HSL color change on mouse move for background and text.
                var _this = $(this);
                
                colorHue = Math.floor(event.pageX / pageWidth * colorRange + colorLow);
                $('body, html').css({'background-color':'hsl('+colorHue+','+colorSaturation+','+colorLightness+')'});
                $('a').css({'color':'hsl('+colorHue+','+colorSaturation+','+colorLightness+')'});
                
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
                            'left': (namePosition.left + $('#name').width() + 20) +'px' // avoid hard coded numbers!!
                        }, function() {
                            $('#heart').text('★');
                            
                            $('#more').fadeIn(2000);
                        });
                    }, 100);
                });
                
                event.preventDefault();
            });
            
        });
        
        $(window).load(function() {
            pageWidth = $('html').width();
            //heartPositionTop = $('#heart').offset().top;
            //heartPositionLeft = $('#heart').position().left;
            $('#next').css('top', ($(window).height()/2 - $('#next').height()/2) + 'px');
        });
        
        $(window).on('resize', function() {
            pageWidth = $('html').width();
            //heartPositionTop = $('#heart').offset().top;
            //heartPositionLeft = $('#heart').position().left;
            $('#next').css('top', ($(window).height()/2 - $('#next').height()/2) + 'px');
        })
