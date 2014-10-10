import $ from 'jquery';

$(document).ready(function() {
    $('.menuitem a').on('click', function(event) {
        var _link = $(this);
        if (_link.parent().is('.frame')) {
            event.preventDefault();
            $('iframe').attr('src', _link.attr('href'));
        }
        else {
        }
    });
    $('a[href="/clobe"]').trigger('click');
});
