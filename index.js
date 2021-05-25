$(document).ready(function() {
    $('.board').css('height', $('.board').css('width'));
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            $('.board').append(`<div class="item ${(i + j) % 2 == 0? 'white' : 'black'}" row="${i}" column="${j}"></div>`);
        }
    }
    //cara ngisi queen
    //$(`.item[row="${row}"][column="${column}"]`).addClass('queen');
});

$(window).resize(function() {
    $('.board').css('height', $('.board').css('width'));
});

$('input[type="text"]').blur(function() {
    if ($(this).val().length != 0) {
        let val = $(this).val();
        $(this).val(Number(val));
    }
})

function validate(evt) {
    var theEvent = evt || window.event;
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /^\d+$/;
    if (key == '.') {
        let text = evt.target.value;
        console.log(text.indexOf('.'));
        if (text.indexOf('.') != -1) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    } else if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}