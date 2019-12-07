import $ from 'jquery';

function Alert(message) {
    if(message) {
        $('.alert').text(message).slideUp(100).fadeIn(200);
    } else {
        $('.alert').css('display', 'none');
        $('.alert').text(message);
    }
}

export default Alert;