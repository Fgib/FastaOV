$(function () {
    var field = $('.mapCard');

    field.on('click', function (e) {
        var id = $(this).data("map");
        console.log('Clicked on map ' + id);
        if (id) {
            socket.emit('p2_select', id);
        }
    });

    socket.on('map_selected', function(msg) {
        if (msg.startsWith('P1:')) {
            var id = msg.substring(3);
            console.log('Map selected by P1: ' + id);
            $("#" + id).addClass("selectedP1");
        } else {
            var id = msg.substring(3);
            console.log('Map selected by P2: ' + msg);
            $("#" + id).addClass("selectedP2");
        }
    });
    // socket.on('chat_message', function(msg) {
    //     var item = document.createElement('li');
    //     item.textContent = msg;
    //     messages.appendChild(item);
    //     window.scrollTo(0, document.body.scrollHeight);
    // });
});