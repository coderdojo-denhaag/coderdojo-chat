var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var started = new Date();

app.get('/', (req, res) => {
    var welcomeBody = '<h1>CoderDojo Chat is online since: ' + started + '</h1>' +
        '<h2>Players online: ' + spelers.length + '</h2>'
    res.send(welcomeBody);
});

http.listen(8080, () => {
    console.log('listening on *:8080');
});

var spelers = [];
var berichten = [];
var speler = {
    id: '',
    naam: '',
    avatar: ''
}
var bericht = {
    van: speler,
    tekst: '',
    tijd: new Date()
}

io.on('connection', function (socket) {
    console.log('een speler maakte verbinding');
    socket.on('nieuwe-speler', function (speler) {
        console.log('nieuwe-speler', speler);
        var existing = spelers.findIndex(p => p.id == speler.id);
        if (existing == -1) {
            spelers.push(speler);
            socket.emit('welkom-speler', {
                id: speler.id,
                naam: speler.naam,
                avatar: speler.avatar
            });
            socket.broadcast.emit('welkom-speler', {
                id: speler.id,
                naam: speler.naam,
                avatar: speler.avatar
            });
        }
        io.emit('spelers', spelers);
    });
    socket.on('nieuw-bericht', function (bericht) {
        console.log(bericht);
        berichten.push(bericht);
        socket.emit('speler-zegt', {
            van: bericht.van,
            tekst: bericht.tekst,
            tijd: bericht.tijd
        });
        socket.broadcast.emit('speler-zegt', {
            van: bericht.van,
            tekst: bericht.tekst,
            tijd: bericht.tijd
        });
    });

});