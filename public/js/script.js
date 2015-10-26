/* globals $, document, io */

$(document).ready(function () {
    var isCon = false;
    var name = "";

    $(".submit").click(function () {
        isCon = true;
        name = $(".userName").val();
        $("#data").attr('placeholder', 'send message as ' + name);
        $(".textTyper").css('display', 'block');
        socket.emit('adduser', name);
        $(".submit, .username").css('display', 'none');
        $(".userNameDisplay").html('Username: ' + name);


    });

    $('.userName').keypress(function (e) {
        if (e.which == 13) {
            isCon = true;
            name = $(".userName").val();
            $("#data").attr('placeholder', 'send message as ' + name);
            $(".textTyper").css('display', 'block');
            socket.emit('adduser', name);
            $(".submit, .username").css('display', 'none');
            $(".userNameDisplay").html('Username: ' + name);

        }
    });

    function escaped(s) {
        return $("<div></div>").html(s).html();
    }

    var socket = io.connect('/');

    // on connection to server, ask for user's name with an anonymous callback
    socket.on('connect', function () {
        // call the server-side function 'adduser' and send one parameter (value of prompt)
        console.log('socket connected');
    });


    // listener, whenever the server emits 'updatechat', this updates the chat body
    socket.on('updatechat', function (username, data) {
        if (isCon) {
            $('#conversation').append('<b>' + escaped(username) + ':</b> ' + escaped(data) + "<br/>");
        }
    });

    // listener, whenever the server emits 'updateusers', this updates the username list
    socket.on('updateusers', function (data) {
        $('#users').empty();
        $.each(data, function (key, value) {
            $('#users').append('<div>' + key + '</div>');
        });
    });

    socket.on('servernotification', function (data) {
        if (data.connected) {
            if (data.to_self) data.username = "you";

            $('#conversation').append('connected: ' + escaped(data.username) + "<br/>");
        } else {
            $('#conversation').append('disconnected: ' + escaped(data.username) + "<br/>");
        }
    });

    // on load of page
    $(function () {
        // when the client hits ENTER on their keyboard
        $('#data').keypress(function (e) {
            if (e.which == 13) {
                var message = $('#data').val();
                $('#data').val('');
                // tell server to execute 'sendchat' and send along one parameter
                socket.emit('sendchat', message);
            }
        });
    });

});