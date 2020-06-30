var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent');

app.get('/',(req, res)=>{
    res.sendFile(__dirname + '/index.html');
});

app.get('/:nomeSala',(req, res)=>{
    res.sendFile(__dirname + '/gioco.html');
});

app.get('/img/carte.jpg', (req, res)=>{
    res.sendFile(__dirname+'/img/carte.jpg');
});

app.get('/img/retro.jpg', (req, res)=>{
    res.sendFile(__dirname + '/img/retro.jpg');
})

server.listen(process.env.PORT,()=>{
    console.log('listening on 8080');
});

var sale = {};

function creareMazzo() {
    var mazzo=[];
    for (var i=0;i<4;i++) {
        for (var j=0; j<10;j++) {
            var potenza = ottenerePotenza(j);
            var carta = {seme:i, valore:j, potenza:potenza};
            mazzo.push(carta);
        }
    }
    return mazzo;
};

function controllareAccusi(nomeSala,giocatore) {
    var mazzo = sale[nomeSala].giocatori[giocatore].mazzo;
    var napoliDenari = 0;
    var napoliCoppe = 0;
    var napoliBastoni = 0;
    var napoliSpade = 0;
    var treAssi = 0;
    var treDue = 0;
    var treTre = 0;

    var mancanteAssi = [0,1,2,3];
    var mancanteDue = [0,1,2,3];
    var mancanteTre = [0,1,2,3];

    for (var j=0;j<mazzo.length;j++) {
        console.log(mazzo[j].seme+ " "+mazzo[j].valore);
        if (mazzo[j].seme == 0 && (mazzo[j].valore == 0 || mazzo[j].valore == 1 || mazzo[j].valore == 2)) {
            napoliDenari++;
            console.log("napoliDenari!");
        }

        else if (mazzo[j].seme == 1 && (mazzo[j].valore == 0 || mazzo[j].valore == 1 || mazzo[j].valore == 2)) {
            napoliCoppe++;
            console.log("napoliCoppe!");
        }

        else if (mazzo[j].seme == 2 && (mazzo[j].valore == 0 || mazzo[j].valore == 1 || mazzo[j].valore == 2)) {
            napoliBastoni++;
            console.log("napoliBastoni!");
        }

        else if (mazzo[j].seme == 3 && (mazzo[j].valore == 0 || mazzo[j].valore == 1 || mazzo[j].valore == 2)) {
            napoliSpade++;
            console.log("napoliSpade!");
        }

        else {
            console.log("Questa carta non ha alcun valore in particolare");
        }

        if (mazzo[j].valore == 0) {
            treAssi++;
            mancanteAssi.splice(mancanteAssi.indexOf(mazzo[j].seme),1);
        }

        else if (mazzo[j].valore == 1) {
            treDue++;
            mancanteDue.splice(mancanteDue.indexOf(mazzo[j].seme),1);
        }

        else if (mazzo[j].valore == 2) {
            treTre++;
            mancanteTre.splice(mancanteTre.indexOf(mazzo[j].seme),1);
        }
    }

    console.log("Ecco i valori: napoliDenari "+napoliDenari+" napoliCoppe "+napoliCoppe+" napoliBastoni "+napoliBastoni+" napoliSpade "+napoliSpade);
    console.log("Ecco i valori: treAssi "+treAssi+" treDue "+treDue+" treTre "+treTre);

    if (napoliDenari==3 && !sale[nomeSala].giocatori[giocatore].hasOwnProperty("napoliDenari")) {
        var seme = "denari";
        io.to(nomeSala).emit('napoli',giocatore,seme);
        sale[nomeSala].giocatori[giocatore].napoliDenari = true;
        sale[nomeSala].giocatori[giocatore].punti += 3;
        console.log('Hai una napoli di denari!');
    }

    if (napoliCoppe==3 && !sale[nomeSala].giocatori[giocatore].hasOwnProperty("napoliCoppe")) {
        var seme = "coppe";
        io.to(nomeSala).emit('napoli',giocatore,seme);
        sale[nomeSala].giocatori[giocatore].napoliCoppe = true;
        sale[nomeSala].giocatori[giocatore].punti += 3;
        console.log('Hai una napoli di coppe!');
    }

    if (napoliBastoni==3 && !sale[nomeSala].giocatori[giocatore].hasOwnProperty("napoliBastoni")) {
        var seme = "bastoni";
        io.to(nomeSala).emit('napoli',giocatore,seme);
        sale[nomeSala].giocatori[giocatore].napoliBastoni = true;
        sale[nomeSala].giocatori[giocatore].punti += 3;
        console.log('Hai una napoli di bastoni!');
    }

    if (napoliSpade==3 && !sale[nomeSala].giocatori[giocatore].hasOwnProperty("napoliSpade")) {
        var seme = "spade";
        io.to(nomeSala).emit('napoli',giocatore,seme);
        sale[nomeSala].giocatori[giocatore].napoliSpade = true;
        sale[nomeSala].giocatori[giocatore].punti += 3;
        console.log('Hai una napoli di spade!');
    }

    if (treAssi>=3 && !sale[nomeSala].giocatori[giocatore].hasOwnProperty("treAssi")) {
        if (mancanteAssi.length==0) {
            mancanteAssi.push("niente");
        }
        var valore = "assi";
        io.to(nomeSala).emit('buongioco',giocatore,treAssi.length,valore,mancanteAssi[0]);
        sale[nomeSala].giocatori[giocatore].treAssi = true;
        console.log('treAssi');
    }

    if (treDue>=3 && !sale[nomeSala].giocatori[giocatore].hasOwnProperty("treDue")) {
        if (mancanteAssi.length==0) {
            mancanteAssi.push("niente");
        }
        var valore = "due";
        io.to(nomeSala).emit('buongioco',giocatore,treDue.length,valore,mancanteAssi[0]);
        sale[nomeSala].giocatori[giocatore].treDue = true;
        console.log('treDue');
    }

    if (treTre>=3 && !sale[nomeSala].giocatori[giocatore].hasOwnProperty("treTre")) {
        if (mancanteAssi.length==0) {
            mancanteAssi.push("niente");
        }
        var valore = "tre";
        io.to(nomeSala).emit('buongioco',giocatore,treTre.length,valore,mancanteAssi[0]);
        sale[nomeSala].giocatori[giocatore].treTre = true;
        console.log('treTre');
    }
}

function controllareQuattroDiDenari(nomeSala,giocatore) {
    var mazzo = sale[nomeSala].giocatori[giocatore].mazzo;
    for (var j=0;j<mazzo.length;j++) {
        if (mazzo[j].seme == 0 && mazzo[j].valore == 3 && !sale[nomeSala].hasOwnProperty("briscola")) {
            var id = sale[nomeSala].giocatori[giocatore].id;
            var avversario;
            var utenti = Object.keys(sale[nomeSala].giocatori);
            for (var i=0;i<utenti.length;i++) {
                if (giocatore != utenti[i]) {
                    avversario = utenti[i];
                }
            }
            var idAvversario = sale[nomeSala].giocatori[avversario].id;
            io.to(id).emit('scegliere briscola');
            io.to(idAvversario).emit('avversario sta scegliendo briscola');
        }
    }
}

function ottenerePunti (potenza) {
    if (potenza>3 && potenza != 7) {
        punti=1/3;
    }
    else if (potenza == 7) {
        punti=1;
    }
    else {
        punti=0;
    }

    return punti;
}

function ottenerePotenza (valore) {
    var potenza;
    if (valore>2) {
        potenza = valore-3;
    }
    else {
        potenza = valore+7;
    }

    return potenza;
};

function mescolareMazzo(mazzo) {
    var mazzoMescolato=[];
    var lunghezza = mazzo.length;
    console.log(lunghezza);
    for (var i=0;i<lunghezza;i++) {
        var rand = Math.floor(Math.random()*mazzo.length);
        console.log(rand);
        mazzoMescolato.push(mazzo[rand]);
        mazzo.splice(rand,1);
    }

    return mazzoMescolato;
}

function ottenereTabellaGiocatori(nomeSala) {
    var tabellaGiocatori = [];

        for (var i=0;i<Object.keys(sale[nomeSala].giocatori).length;i++) {
            var giocatore = Object.keys(sale[nomeSala].giocatori)[i];
            var punteggio = Math.floor(sale[nomeSala].giocatori[giocatore].punti);
            var turno=false;

            if (sale[nomeSala].hasOwnProperty("turno") && sale[nomeSala].turno == giocatore) {
                turno=true;
            }
            
            tabellaGiocatori.push({nome:giocatore,punteggio:punteggio,turno:turno});
        }
    return tabellaGiocatori;
}

function vincitoreMano(nomeSala) {
    var vincitore;
    var puntiMano=0;
    var utenti = Object.keys(sale[nomeSala].giocatori);
    var potenzeSeme = [];
    var potenzeReali = [];
    var briscola = "niente";

    if (sale[nomeSala].hasOwnProperty("briscola")) {
        briscola = sale[nomeSala].briscola;
    }

    for (var i=0;i<utenti.length;i++) {
        var seme = sale[nomeSala].giocatori[utenti[i]].cartaGiocata.seme;
        var semeMano = sale[nomeSala].semeMano
        var potenza = sale[nomeSala].giocatori[utenti[i]].cartaGiocata.potenza;

        potenzeReali.push(potenza);

        if (seme == semeMano) {
            potenzeSeme.push(potenza);
            console.log("Le carte sono dello stesso seme");
        }

        else if (seme == briscola) {
            potenzeSeme.push(11);
        }

        else {
            potenzeSeme.push(0);
            console.log("Le carte sono di semi diversi");
        }
    }
    var massimo = Math.max(...potenzeSeme);
    console.log('Ecco il valore di "massimo": '+massimo);
    var indice = potenzeSeme.indexOf(massimo,0);
    console.log('Ecco il valore di "index": '+indice);

    vincitore = utenti[indice];

    for (var i=0;i<potenzeReali.length;i++) {
        var punti = ottenerePunti(potenzeReali[i]);
        console.log('Ecco il valore di "punti": '+punti);
        puntiMano += punti;
    }

    if (sale[nomeSala].giocatori[vincitore].mazzo.length == 1) {
        console.log('KABOOOOOOOOM');
        puntiMano++;
    }

    console.log('Ecco il valore di "puntiMano": '+puntiMano);
    console.log('Ecco il valore di "vincitore": '+vincitore);

    var informazioni = {
        vincitoreMano:vincitore,
        puntiMano:puntiMano
    };

    return informazioni;
}

io.on('connect',(socket)=>{
    socket.on('creare sala',(nomeSala,numeroGiocatori)=>{
        sale[nomeSala] = {
            nomeSala: nomeSala,
            numeroGiocatori: numeroGiocatori,
            partitaIniziata: false,
            mazzo:[],
            giocatori:{},
            numeroTurni:0
        };
        console.log('La sala "'+nomeSala+'" è stata creata');
        console.log(sale);
        io.to(socket.id).emit('sala creata');
    });

    socket.on('nuova partita', ()=>{
        var giocatori = Object.keys(sale[socket.room].giocatori);
        console.log(giocatori);
        if (sale[socket.room].hasOwnProperty("briscola")) {
            delete sale[socket.room].briscola;
        }
        for (var i=0; i<giocatori.length;i++) {
            var nomeUtente = sale[socket.room].giocatori[giocatori[i]].nomeUtente;
            var id = sale[socket.room].giocatori[giocatori[i]].id;
            var punti = sale[socket.room].giocatori[giocatori[i]].punti;
            console.log(id);
            sale[socket.room].giocatori[giocatori[i]] = {nomeUtente:nomeUtente,id:id,mazzo:[],punti:punti};
            console.log("Ecco il giocatore "+sale[socket.room].giocatori[giocatori[i]]);
        }
        console.log(sale[socket.room].giocatori);
        var mazzo = creareMazzo();
        mazzo = mescolareMazzo(mazzo);
        sale[socket.room].mazzo = mazzo;
        var giocatore1 = Object.keys(sale[socket.room].giocatori)[0];
        var giocatore2 = Object.keys(sale[socket.room].giocatori)[1];
        console.log(giocatore1+" "+giocatore2);
        for (var i=0;i<10;i++) {
            var carta1 = sale[socket.room].mazzo[0];
            var carta2 = sale[socket.room].mazzo[1];
            sale[socket.room].giocatori[giocatore1].mazzo.push(carta1);
            sale[socket.room].giocatori[giocatore2].mazzo.push(carta2);
            sale[socket.room].mazzo.splice(0,2);
        }
        console.log(sale[socket.room].giocatori[giocatore1].mazzo);
        console.log(sale[socket.room].giocatori[giocatore2].mazzo);
        console.log(sale[socket.room].mazzo);

        var id1 = sale[socket.room].giocatori[giocatore1].id;
        var id2 = sale[socket.room].giocatori[giocatore2].id;

        console.log(id1+" "+id2);

        io.to(id1).emit('carte distribuite',sale[socket.room].giocatori[giocatore1].mazzo,sale[socket.room].mazzo.length);
        io.to(id2).emit('carte distribuite',sale[socket.room].giocatori[giocatore2].mazzo,sale[socket.room].mazzo.length);
        
        if (socket.id != id1) {
            io.to(id2).emit('hai iniziato questo turno');
            io.to(id1).emit('non hai iniziato questo turno');
            io.to(id1).emit('tocca a te');
            sale[socket.room].turno = giocatore1;
        }

        else if (socket.id != id2) {
            io.to(id1).emit('hai iniziato questo turno');
            io.to(id2).emit('non hai iniziato questo turno');
            io.to(id2).emit('tocca a te');
            sale[socket.room].turno = giocatore2;
        }

        var tabellaGiocatori = ottenereTabellaGiocatori(socket.room);
        
        io.to(socket.room).emit('aggiornare tabella giocatori',tabellaGiocatori);

    });

    socket.on('ciao',(nomeUtente,nomeSala)=> { 
        if (sale.hasOwnProperty(nomeSala) && !sale[nomeSala].giocatori.hasOwnProperty(nomeUtente) && (Object.keys(sale[nomeSala].giocatori).length < sale[nomeSala].numeroGiocatori)) {
            socket.join(nomeSala);
            socket.room = nomeSala;
            socket.nomeUtente = nomeUtente;

            sale[nomeSala].giocatori[nomeUtente] = {nomeUtente:nomeUtente,id:socket.id,mazzo:[],punti:0};
            console.log("Ciao!!!");
            console.log(sale[nomeSala]);

            var tabellaGiocatori = ottenereTabellaGiocatori(nomeSala);

            console.log(tabellaGiocatori);

            io.to(socket.room).emit('aggiornare tabella giocatori',tabellaGiocatori);

            if (Object.keys(sale[nomeSala].giocatori).length == sale[nomeSala].numeroGiocatori) {
                io.to(socket.room).emit('partita pronta');
            }

            else {
                io.to(socket.room).emit('aspetta');
            }
        }

        else if (!sale.hasOwnProperty(nomeSala)) {
            io.to(socket.id).emit('sala inesistente');
        }

        else if (sale.hasOwnProperty(nomeSala) && sale[nomeSala].giocatori.hasOwnProperty(nomeUtente)) {
            io.to(socket.id).emit('nome già preso');
        }

        else if (Object.keys(sale[nomeSala].giocatori).length >= sale[nomeSala].numeroGiocatori) {
            io.to(socket.id).emit('sala al completo')
        }
    });

    socket.on('carta giocata',(valore,seme,cartaGiocata)=>{

        console.log('Ecco il valore di "socket.nomeUtente": '+socket.nomeUtente);
        console.log('Ecco il valore di "sale[socket.room].turno": '+sale[socket.room].turno);

        //vediamo se è il primo giocatore a giocare e in quel caso, facciamo che definisce lui il seme

        if (socket.nomeUtente == sale[socket.room].turno) {
            sale[socket.room].semeMano = seme;
        }

        //vediamo se il giocatore ha una carta del buon seme nel suo mazzo

        var haCartaDelBuonSeme = false;
        var semeMano = sale[socket.room].semeMano;

        for (var i=0;i<sale[socket.room].giocatori[socket.nomeUtente].mazzo.length;i++) {
            var semeCarta = sale[socket.room].giocatori[socket.nomeUtente].mazzo[i].seme;
            console.log(semeCarta+" vs "+semeMano);

            if (semeCarta == semeMano) {
                haCartaDelBuonSeme = true;
                console.log("Ehilà, il seme è quello giusto");
            }
        }

        console.log('Ecco il valore di "haCartaDelBuonSeme": '+haCartaDelBuonSeme);

        //vediamo se la carta giocata è valida

        if ((haCartaDelBuonSeme == true && seme == semeMano) || !haCartaDelBuonSeme) {
            socket.to(socket.room).emit('carta giocata da avversario',valore,seme,cartaGiocata);
            io.to(socket.id).emit('carta valida',valore,seme);
            
            sale[socket.room].giocatori[socket.nomeUtente].cartaGiocata = {valore:valore,seme:seme,potenza:ottenerePotenza(valore)};
        }

        else {
            io.to(socket.id).emit('carta non valida');
            console.log('LA CARTA NON È VALIDA');
        }

        //vediamo se hanno giocato tutti

        var hannoGiocatoTutti = true;

        var utenti = Object.keys(sale[socket.room].giocatori);

        for (var i=0;i<utenti.length;i++) {
            if (!sale[socket.room].giocatori[utenti[i]].hasOwnProperty("cartaGiocata")) {
                hannoGiocatoTutti = false;
            }
        }

        //vediamo chi ha vinto

        if (hannoGiocatoTutti == true) {
            var risultati = vincitoreMano(socket.room);
            console.log('Ecco il valore di "risultati": '+risultati);
            var vincitore = risultati.vincitoreMano;
            var punti = risultati.puntiMano;
            var idVincitore = sale[socket.room].giocatori[vincitore].id;

            sale[socket.room].giocatori[vincitore].punti += punti;
            sale[socket.room].turno = vincitore;

            if (vincitore==socket.nomeUtente) {
                socket.emit('hai vinto la mano');
                socket.broadcast.emit('hai perso la mano');
            }

            else {
                socket.emit('hai perso la mano');
                io.to(idVincitore).emit('hai vinto la mano');
            }

            //eliminiamo le carte giocate dal mazzo e diamo il nuovo mazzo

            var mazzoAvversario;
            var mazzoGiocatore;

            for (var i=0;i<utenti.length;i++) {

                var cartaGiocata = sale[socket.room].giocatori[utenti[i]].cartaGiocata;
                var indice = sale[socket.room].giocatori[utenti[i]].mazzo.findIndex((carta)=>{
                    return carta.valore==cartaGiocata.valore && carta.seme == cartaGiocata.seme;
                });
                console.log('Ecco il valore di "indice" nel mazzo del giocatore '+utenti[i]+': '+indice);
                sale[socket.room].giocatori[utenti[i]].mazzo.splice(indice,1);

                var mazzoPartita = sale[socket.room].mazzo;
                var nuovaCarta;
                if (mazzoPartita.length>0) {
                    var aleatorio = Math.floor(Math.random()*mazzoPartita.length);
                    nuovaCarta = sale[socket.room].mazzo[aleatorio];
                    sale[socket.room].giocatori[utenti[i]].mazzo.push(nuovaCarta);
                    sale[socket.room].mazzo.splice(aleatorio,1);
                }

                delete sale[socket.room].giocatori[utenti[i]].cartaGiocata;

                var id = sale[socket.room].giocatori[utenti[i]].id;
                console.log("Ecco il valore di 'id': "+id);

                if (utenti[i]!=socket.nomeUtente) {
                    mazzoAvversario = sale[socket.room].giocatori[utenti[i]].mazzo;
                }

                else {
                    mazzoGiocatore = sale[socket.room].giocatori[utenti[i]].mazzo;
                }
            };

            var tabellaGiocatori = ottenereTabellaGiocatori(socket.room);
            sale[socket.room].numeroTurni++;

            setTimeout(()=>{
                if (mazzoGiocatore.length>0) {
                    socket.emit('nuova carta',mazzoGiocatore,mazzoAvversario,sale[socket.room].mazzo.length);
                    socket.broadcast.emit('nuova carta',mazzoAvversario,mazzoGiocatore,sale[socket.room].mazzo.length);
                }
                io.to(socket.room).emit('aggiornare tabella giocatori',tabellaGiocatori);

            },2000);
        }
    });

    socket.on('controlla se ci sono ancora carte',()=>{
        var utenti = Object.keys(sale[socket.room].giocatori);
        var mazzoGiocatore;
        var mazzoAvversario;
        var puntiGiocatore;
        var puntiAvversario;
        var giocatore;
        var avversario;

        for (var i=0;i<utenti.length;i++) {
            if (utenti[i]==socket.nomeUtente) {
                mazzoGiocatore = sale[socket.room].giocatori[utenti[i]].mazzo;
                puntiGiocatore = Math.floor(sale[socket.room].giocatori[utenti[i]].punti);
                giocatore = utenti[i];
            }

            else {
                mazzoAvversario = sale[socket.room].giocatori[utenti[i]].mazzo;
                puntiAvversario = Math.floor(sale[socket.room].giocatori[utenti[i]].punti);
                avversario = utenti[i];
            }
        }

        if (mazzoGiocatore.length==0&&mazzoAvversario==0&&sale[socket.room].mazzo.length==0) {
            if (puntiGiocatore >=21 || puntiAvversario >=21) {
                if (puntiGiocatore>puntiAvversario) {
                    var risultatiFinali = {
                        vincitore:{
                            nome:giocatore,
                            punteggio:puntiGiocatore
                        },
                        perdente:{
                            nome:avversario,
                            punteggio:puntiAvversario
                        }
                    };
                }

                else if (puntiAvversario>puntiGiocatore) {
                    var risultatiFinali = {
                        perdente:{
                            nome:giocatore,
                            punteggio:puntiGiocatore
                        },
                        vincitore:{
                            nome:avversario,
                            punteggio:puntiAvversario
                        }
                    };
                }

                else {
                    var risultatiFinali = "pareggio";
                }
                io.to(socket.room).emit('partita finita',risultatiFinali);
            }

            else {
                setTimeout(()=>{
                    io.to(socket.room).emit('turno finito');
                },2000);
            }
        }
    });

    socket.on('controllare accusi o briscola',()=>{
        if (sale[socket.room].numeroTurni<=3) {
            controllareAccusi(socket.room,socket.nomeUtente);
        }
        if (!sale[socket.room].hasOwnProperty("briscola")) {
            controllareQuattroDiDenari(socket.room,socket.nomeUtente);
        }
    })

    socket.on('briscola scelta',(briscola)=>{
        var dizionarioSemi = ["denari","coppe","bastoni","spade"];
        var briscolaInNumeri = dizionarioSemi.indexOf(briscola);
        sale[socket.room].briscola = briscolaInNumeri;
        console.log(sale[socket.room].briscola);
        io.to(socket.room).emit('ecco la briscola',briscola);
    });

    socket.on('disconnect',()=>{
        io.to(socket.room).emit('partita eliminata');
        var nomeSala = socket.room
        setTimeout(()=>{
            if (sale.hasOwnProperty(nomeSala))
            delete sale[nomeSala];
            console.log(sale);
        },10000);
    });
});