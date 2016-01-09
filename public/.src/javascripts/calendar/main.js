import $ from 'jquery';
import        'jquery-tooltipster/js/jquery.tooltipster';
import        'bootstrap/dist/js/bootstrap'; // TODO Error: needs jQuery (relies on it being global)
import        'bootstrap-datepicker/dist/js/bootstrap-datepicker';

import infinitePng from '../../images/calendar/infinite.png'
import starsPng from '../../images/calendar/stars.png'
import tagsPng from '../../images/calendar/tags.png'

window.$ = $

window.addEventListener('load', function() {
    document.querySelector('.infinite').src = `/js/${infinitePng}`
    document.querySelector('.stars').src = `/js/${starsPng}`
    document.querySelector('.tags').src = `/js/${tagsPng}`
})

//System.import('bootstrap/css/bootstrap-theme.css!');

$(document).ready(function() {
    var savedDate = null; // This holds the date the user has picked AND saved.
    var currentlySelectedDate = null; // this holds the date the user has momentarily picked, but not necessarily saved.

    var tooltipOptions = { // To enable one of these, add the appropriate file to the SystemJS shim definitions.
        //theme: 'tooltipster-punk',
        //theme: 'tooltipster-noir',
        //theme: 'tooltipster-light',
        //theme: 'tooltipster-shadow'
    };

    var datepickerOptions = {
        format: 'mm/dd/yyyy',
        daysOfWeekDisabled: [0,6], // disable weekends
        startDate: new Date(2014, 0, 1),
        endDate: new Date(2014, 11, 31),
        beforeShowDay: function(date) {
            // Disable 2014 Federal Bank Holidays:
            var classes = [];
            var enabled = true;
            var holidayName = "";
            var holidays = [
                // TODO: These are hard coded days, which will actually vary from year to year. We can calculate them instead of hard coding once per year.
                [0,  1 , "New Year's Day"], // Wednesday - January 1 -
                [0,  20, "Martin Luther King’s Birthday"], // Monday - January 20 - Martin Luther King’s Birthday
                [1,  17, "George Washington’s Birthday"], // Monday - February 17 - George Washington’s Birthday
                [4,  26, "Memorial Day"], // Monday - May 26 - Memorial Day
                [6,  4 , "Independence Day"], // Friday - July 4 - Independence Day
                [8,  1 , "Labor Day"], // Monday - September 1 - Labor Day
                [9,  13, "Columbus Day"], // Monday - October 13 - Columbus Day
                [10, 11, "Veterans Day"], // Tuesday - November 11 - Veterans Day
                [10, 27, "Thanksgiving Day"], // Thursday - November 27 - Thanksgiving Day
                [11, 25, "Christmas Day"]  // Thursday - December 25 - Christmas Day
            ];
            holidays.forEach(function(item, index) {
                if (date.getUTCMonth() == holidays[index][0] && date.getUTCDate() == holidays[index][1]) {
                    holidayName = holidays[index][2];
                    enabled = false;
                    classes.push('disabled');
                    classes.push('bank-holiday');
                }
            });

            return {
                enabled: enabled,
                classes: classes.join(' '),
                tooltip: enabled? false: 'Holiday: '+holidayName
            };
        }
    };

    var picker = $('#datePicker').datepicker(datepickerOptions);
    $('.bank-holiday').tooltipster(tooltipOptions);

    picker.on('changeDate', function(event) {
        currentlySelectedDate = picker.datepicker('getDate');
        $('#datePickerModal #saveButton').removeClass('disabled');
        $('.bank-holiday').tooltipster(tooltipOptions);
    });
    picker.on('changeMonth', function() {
        $('.bank-holiday').tooltipster(tooltipOptions);
    });

    $('#datePickerModal #saveButton').on('click', function() {
        if (currentlySelectedDate) { // save the currently selected date if there is one.
            console.log('saving the date.');
            savedDate = currentlySelectedDate;
            var formattedDate = picker.datepicker('getFormattedDate');
            $('#dateField').val(formattedDate).change();
            $('#datePickerModal #saveButton').addClass('disabled');
        }
    });

    $('#datePickerModal button.closeDatepicker').on('click', function() {

        // return the calendar back to it's state if the user didn't save.
        if (!savedDate) { // the state when no date has yet been picked.
            console.log('removing the picker');
            picker.datepicker('remove');
            picker = $('#datePicker').datepicker(datepickerOptions);
            $('#datePickerModal #saveButton').addClass('disabled');
            $('.bank-holiday').tooltipster(tooltipOptions);
        }
        else { // the state when a previous date was already saved.
            console.log('setting picker back to saved date.');
            picker.datepicker('setDate', savedDate);
            $('.bank-holiday').tooltipster(tooltipOptions);
        }
    });

    $('.datepicker .prev, .datepicker .next').on('click', function() {
        setTimeout(function() {
            // FIXME: expose an event from Datepicker for when the user
            // has switched month views using the previous and next
            // buttons so we don't have to use this nasty setTimeout..
            $('.bank-holiday').tooltipster(tooltipOptions);
        }, 100);
    });

});
