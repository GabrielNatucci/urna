const main = document.getElementById("main");
const fs = document.getElementById("fs").content.firstElementChild.cloneNode(true);
const snd = document.getElementById("snd").content.firstElementChild.cloneNode(true);
const trd = document.getElementById("trd").content.firstElementChild.cloneNode(true);
const lst = document.getElementById("lst").content.firstElementChild.cloneNode(true);
const fim = document.getElementById("fim").content.firstElementChild.cloneNode(true);
const count = document.getElementById("count").content.firstElementChild.cloneNode(true);
const err = document.getElementById("err").content.firstElementChild.cloneNode(true);
var audio = new Audio("som/SomDaUrna.mp3")
var porPersio = 0.0;
var porAlex = 0.0;
var tmpNota = 0;

// --------------- templates para json --------------- // 
var dado = {                                           // 
    nota: 0,        // qual nota                       //                                           //
    votoPersio: 0,  // qntd persio                     //
    votoAlex: 0,    // qntd alex                       //
};                                                     //
var txtDado = '{ "dado" : []}';                        //
// --------------- templates para json --------------- // 

lerDados();

localStorage.setItem("verificar", "cool");
if (localStorage.verificar) {
    firstScreen();
} else {
    main.appendChild(err);
}

function firstScreen(){
    main.innerHTML = "";
    main.appendChild(fs);
    
    fsBtn = document.getElementById("fs-btn");
    fsLogo = document.getElementById("fs-logo");

    fsBtn.addEventListener('mouseup', function(event){
        event.preventDefault();
        secondScreen();
    })

    fsLogo.addEventListener('mouseup', function(){
        countScreen();
    })
}

function secondScreen(){
    main.innerHTML = "";
    main.appendChild(snd);
    
    let select = document.getElementById("snd-select");
    select.value = "none";

    document.getElementById("snd-btn").addEventListener('mouseup', function(event){
        event.preventDefault();
        if(select.value != "none") {
            tmpNota = parseInt(select.value);
            nextScreen();
        } else {
            select.style.border = "2px solid red";
            select.style.transition = "0.2s";
        }
    })

    select.addEventListener('input', function(event){
        event.preventDefault();
        select.style.border = "2px solid rgba(30, 30, 30, 0.2)";
    })
}

function nextScreen(){
    main.innerHTML = "";
    main.appendChild(trd);

    let trdRadio = document.getElementsByClassName("trd-radio");
    trdRadio[0].checked = false;
    trdRadio[1].checked = false;
    document.getElementById("alex").style.color = "red";

    document.getElementById("trd-btn").addEventListener('mouseup', function(event){
        event.preventDefault();
        trdRadio = document.getElementsByClassName("trd-radio");
        try {
            if (trdRadio[0].checked == true || trdRadio[1].checked == true) {
                if (trdRadio[0].checked == true) {
                    dado.votoPersio += 1;
                } else {
                    dado.votoAlex += 1;
                }
                lastScreen();
            } else {
                console.log(trdRadio.style);
            }
        } catch (ex) {}
    })
}

function lastScreen(){
    if (dado.votoAlex == 0) {
        porAlex = 0;
        porPersio = 100;
    } else if (dado.votoPersio == 0) {
        porAlex = 100;
        porPersio = 0;
    } else {
        porPersio = (dado.votoPersio/(dado.votoPersio + dado.votoAlex) * 100).toFixed(2);
        porAlex = (100 - porPersio).toFixed(2);
    }

    if (dado.votoAlex + dado.votoPersio == 1){
        dado.nota = tmpNota.toFixed(2);
    } else {
        soma = parseInt(dado.votoAlex) + parseInt(dado.votoPersio)
        dado.nota = ((parseFloat(dado.nota)*(soma - 1) + parseFloat(tmpNota))/(soma)).toFixed(2);
    }

    console.log("porcentagem persio: " + porPersio);
    console.log("porcentagem alex: " + porAlex);
    console.log("Persio: " + dado.votoPersio);
    console.log("Alex: " + dado.votoAlex);
    console.log("Nota: " + dado.nota);

    salvarDados();

    main.innerHTML = "";
    main.appendChild(lst);
    let persio = document.getElementById("nota-persio");
    let alex = document.getElementById("nota-alex");
    let medNota = document.getElementById("media-nota");

    persio.innerHTML = ("Pérsio: " + porPersio + "% - " + dado.votoPersio + " votos");
    alex.innerHTML = "Alex: " + porAlex + "% - " + dado.votoAlex + " votos";
    medNota.innerHTML = "Média da nota da feira: " + dado.nota;
    
    lstBtn = document.getElementById("lst-btn");

    lstBtn.addEventListener('mouseup', function(event){
        event.preventDefault();
        fimScreen();
    })
}

function fimScreen(){
    main.innerHTML = "";
    main.appendChild(fim);
    audio.play();

    let fimBtn = document.getElementById("fim-btn");

    fimBtn.addEventListener('mouseup', function(){
        location.reload();
    })
}

function countScreen(){
    main.innerHTML = "";
    main.appendChild(count);

    if (dado.votoAlex == 0 && dado.votoPersio == 0) {
        porAlex = 0;
        porPersio = 0;
    } else if (dado.votoAlex == 0) {
        porAlex = 0;
        porPersio = 100;
    } else if (dado.votoPersio == 0) {
        porAlex = 100;
        porPersio = 0;
    } else {
        porPersio = (dado.votoPersio/(dado.votoPersio + dado.votoAlex) * 100).toFixed(2);
        porAlex = (100 - porPersio).toFixed(2);
    }

    let persio = document.getElementById("nota-persio");
    let alex = document.getElementById("nota-alex");
    let medNota = document.getElementById("media-nota");
    let total = document.getElementById("total");
    persio.innerHTML = ("Pérsio: " + porPersio + "% - " + dado.votoPersio + " votos");
    alex.innerHTML = "Alex: " + porAlex + "% - " + dado.votoAlex + " votos";
    medNota.innerHTML = "Média da nota da feira: " + dado.nota;
    total.innerHTML = "Contagem total de votos: " + (parseInt(dado.votoAlex) + parseInt(dado.votoPersio));

    countBtn = document.getElementById("count-btn");

    countBtn.addEventListener('mouseup', function(){
        location.reload();
    })
}

function salvarDados(){
    if (!localStorage.dados) { 
        jsonDado = JSON.parse(txtDado);
        jsonDado.dado.push(dado);
    } else {
        jsonDado = JSON.parse(txtDado);
        jsonDado.dado = dado;
    }
    localStorage.setItem("dados", JSON.stringify(jsonDado));
    console.log(dado);
}

function lerDados(){
    if (localStorage.dados) {
        obj = JSON.parse(localStorage.getItem("dados"));
        dado.nota = parseInt(obj.dado.nota);
        if (isNaN(dado.nota))
            dado.nota = 0;

        dado.votoPersio = parseInt(obj.dado.votoPersio);
        if (isNaN(dado.votoPersio)) 
            dado.votoPersio = 0;

        dado.votoAlex = parseInt(obj.dado.votoAlex);
        if (isNaN(dado.votoAlex)) 
            dado.votoAlex = 0;

        console.log(dado);
    } else {
        salvarDados();
    }
}