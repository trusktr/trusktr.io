
var pageWidth = 0;

$(document).ready(function() {
    var mouseMoveCount = 0,
        colorHigh = 359, // HSL Hue
        colorLow = 0, // HSL Hue
        colorRange = colorHigh - colorLow,
        colorHue,
        colorSaturation = '34%',
        colorLightness = '46%',
        hslParts = [];

    $('html, body').on('mousemove', function(event) {
        //Gradient HSL color change on mouse move for background and text.
        var _this = $(this);

        colorHue = Math.floor(event.pageX / pageWidth * colorRange + colorLow);
        $('body, html').css({'background-color':'hsl('+colorHue+','+colorSaturation+','+colorLightness+')'});
        $('a[href!="next"]').css({'color':'hsl('+colorHue+','+colorSaturation+','+colorLightness+')'});

        if (mouseMoveCount%10 == 0) {
            mouseMoveCount = 0;
        }
        mouseMoveCount++;
    });



});

$(window).load(function() {
    pageWidth = $('html').width();
});

$(window).on('resize', function() {
    pageWidth = $('html').width();
})
