
var pageWidth = 0;

function color_increase_brightness(hex, percent) {
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if(hex.length == 3){
        hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);

    return '#' +
       ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}

$(document).ready(function() {
    var mouseMoveCount = 0,
        colorHigh = 359, // HSL Hue
        colorLow = 0, // HSL Hue
        colorRange = colorHigh - colorLow,
        colorHue,
        colorSaturation = 34,
        colorLightness = 46,
        hslParts = [];
    var _inputs = $('input[type="text"]');

    $('html, body').on('mousemove', function(event) {
        //Gradient HSL color change on mouse move for background and text.
        var _this = $(this);

        colorHue = Math.floor(event.pageX / pageWidth * colorRange + colorLow);
        $('body, html').css({'background-color':'hsl('+colorHue+','+colorSaturation+'%,'+colorLightness+'%)'});
        $('a[href!="next"]').css({'color':'hsl('+colorHue+','+colorSaturation+'%,'+colorLightness+'%)'});

        _inputs.each(function() {
            var _this = $(this);
            if (_this.is(':focus')) {
                _this.css({'border-color':'hsla('+colorHue+','+(colorSaturation+(100-colorSaturation)*0.25)+'%,'+(colorLightness+(100-colorLightness)*0.25)+'%, 1)'});
            }
            else {
                _this.css({'border-color':'rgba(255,255,255,0.35)'});
            }
        });

        if (mouseMoveCount%10 == 0) {
            mouseMoveCount = 0;
        }
        mouseMoveCount++;
    });

    _inputs.on('focus', function() {
        var _this = $(this);
        _this.css({'border-color':'hsla('+colorHue+','+(colorSaturation+(100-colorSaturation)*0.25)+'%,'+(colorLightness+(100-colorLightness)*0.25)+'%, 1)'});
    });
    _inputs.on('blur', function() {
        var _this = $(this);
        _this.css({'border-color':'rgba(255,255,255,0.35)'});
    });



});

$(window).load(function() {
    pageWidth = $('html').width();
});

$(window).on('resize', function() {
    pageWidth = $('html').width();
})
