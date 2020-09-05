/*
Eerst stellen we de variabelen vast
*/
var socket = io("https://coderdojochat.azurewebsites.net/");
var verbind = document.getElementById("verbind");
var chat = document.getElementById("chat");
var verstuur = document.getElementById("verstuur");
var online = document.getElementById("online");
var mijnnaam = document.getElementById("naam");
var form = document.getElementsByTagName("form")[0];

var ik = {
    id: Date.now(),
    naam: '',
    avatar: 'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShaggyMullet&accessoriesType=Blank&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=PastelBlue&eyeType=Default&eyebrowType=Default&mouthType=Twinkle&skinColor=Brown'
}

var bericht = {
    van: ik,
    tekst: '',
    tijd: null
}

/*
Daarna maken we de functies
*/

function maakVerbinding() {
    if (ik.naam == '') {
        var naam = mijnnaam.value;
        ik.naam = naam;
        localStorage.setItem("speler", JSON.stringify(ik));
    }
    socket.emit('nieuwe-speler', ik);
    mijnnaam.parentElement.style.display = "none";
}

function verstuurBericht(e) {
    e.preventDefault();
    var tekst = document.getElementById("bericht").value;
    bericht.tekst = tekst;
    bericht.tijd = new Date();
    socket.emit('nieuw-bericht', bericht);
    document.getElementById("bericht").value = "";
}

/*
De functies worden gekoppeld aan de knoppen
*/
verbind.onclick = maakVerbinding;
verstuur.onclick = verstuurBericht;
form.onsubmit = verstuurBericht;

/*
Nu koppelen we onze chat server
*/
socket.on('welkom-speler', function (speler) {
    console.log(speler);
    chat.innerHTML += "Welkom " + speler.naam + "!<br>";
});

socket.on('speler-zegt', function (ontvangen) {
    console.log(ontvangen);
    chat.innerHTML += "<strong>" + ontvangen.van.naam + " zegt: </strong><br>";
    chat.innerHTML += ontvangen.tekst + "<br>";
    chat.parentElement.scrollTop = chat.parentElement.scrollHeight;
});

socket.on('spelers', function (spelers) {
    console.log(spelers);
    online.innerHTML = "<h3>Wie is online?</h3>";
    for (var i = 0; i < spelers.length; i++) {
        var avatar = "<img src='" + spelers[i].avatar + "'>";
        online.innerHTML += avatar + spelers[i].naam + "<br>";
    }
});

/*
Als je de pagina opnieuw laadt, dan kan je geen nieuwe naam opgeven.
*/
if (localStorage.getItem("speler") != null) {
    ik = JSON.parse(localStorage.getItem("speler"));
    mijnnaam.style.display = "none";
}