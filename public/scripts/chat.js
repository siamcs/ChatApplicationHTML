$(document).ready(function () {
    var socket = io.connect("/");

    var userName = prompt("What is your name?");
    if (!userName) {
        userName = "Guest";
    }

    socket.emit("newuser", userName);

    socket.on('connection.success', function (res) {
        $('#messages').append(`<li>${res.UserName}: ${res.Message}</li>`);
    });

    socket.on('connection.others', function (res) {
        $('#messages').append(`<li>${res.UserName}: ${res.Message}</li>`);
    });

    $('#btnSend').on('click', function () {
        var message = $('#txtInput').val().trim();
        if (message) {
            socket.emit("send", message);
        }
        $('#txtInput').val('').focus();
    });

    socket.on('SendClient', function (res) {
        $('#messages').append(`<li>${res.UserName}: ${res.Message}</li>`);
    });

    $('#dropbox').on('dragenter', (evt) => evt.preventDefault());
    $('#dropbox').on('dragover', (evt) => evt.preventDefault());

    $('#dropbox').on('drop', function (evt) {
        evt.preventDefault();
        var file = evt.originalEvent.dataTransfer.files[0];
        if (file.size > 1 * 1024 * 1024) {
            alert("Max file size is 1MB");
            return;
        }
        if (file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg') {
            var reader = new FileReader();
            reader.onload = function (e) {
                socket.emit('uploadImage', e.target.result);
            }
            reader.readAsDataURL(file);
        } else {
            alert("Invalid file type. Only PNG, JPG, and JPEG allowed.");
        }
    });

    socket.on('SendImage', function (res) {
        var img = document.createElement('img');
        img.src = res.Message;
        var li = document.createElement('li');
        li.innerHTML = `${res.UserName}: `;
        li.appendChild(img);
        $('#messages').append(li);
    });
});
