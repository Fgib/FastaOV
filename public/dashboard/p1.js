$(function () {
    var field = $('#input');
    var button = $('#button');

    button.on('click', function (e) {
        e.preventDefault();
        if (field.val()) {
            socket.emit('chat_message', field.val());
            field.val('');
        }
    });

    socket.on('chat_message', function(msg) {
        var item = document.createElement('li');
        item.textContent = msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
});