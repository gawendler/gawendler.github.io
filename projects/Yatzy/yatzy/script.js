//expriment
var hur_mångaspelare = [1, 2, 3];

//byta namn på spelare
var spelare1 = document.getElementById("spelare1")
var spelare2 = document.getElementById("spelare2")

function spelare1_namn() {
    var name = prompt("Skriv in ditt namn");
    if (spelare = spelare1.textContent) {
        spelare = name;
    } else {
        spelare = spelare2.textContent;
    }
    spelare1.innerHTML = name;
    update();
}

function spelare2_namn() {
    var name = prompt("Skriv in ditt namn");
    console.log(spelare)
    if (spelare = spelare1.textContent) {
        spelare = spelare1.textContent;
    } else {
        spelare = spelare2.textContent;
    }
    console.log(spelare)
    spelare2.innerHTML = name;
    update();
}
//ändra kast bild när man hovrar över den samt när man kastar
var throwdiceimg = document.getElementById("throwdiceimg")
document.getElementById("throwdice").addEventListener("mouseover", mouseOver);
document.getElementById("throwdice").addEventListener("mouseout", mouseOut);

function mouseOver() {
    throwdiceimg.src = "img/throwdice" + kast + "-2.png"
}

function mouseOut() {
    throwdiceimg.src = "img/throwdice" + kast + "-1.png"
}


function mouseOver2() {
    //text
    document.getElementById("text").classList.add("show");
    document.getElementById("text").classList.remove("hide");
    document.getElementById("bruh").classList.add("hide");
    document.getElementById("bruh").classList.remove("show");
    document.getElementById("bruh2").classList.add("hide");
    document.getElementById("bruh2").classList.remove("show");
}

function mouseOut2() { //text
    document.getElementById("text").classList.add("hide");
    document.getElementById("text").classList.remove("show");
    document.getElementById("bruh").classList.add("show");
    document.getElementById("bruh").classList.remove("hide");
    document.getElementById("bruh2").classList.add("show");
    document.getElementById("bruh2").classList.remove("hide");
}
document.addEventListener('DOMContentLoaded', function () {
    var checkbox = document.querySelector('input[type="checkbox"]');

    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            var element = document.body;
            element.classList.toggle("light-mode");

        } else {
            var element = document.body;
            element.classList.remove("light-mode");
        }
    });
});



//varibalar
var kast = 3;
var spelare = spelare2.textContent;

function byt_spelare() {
    //fixa så att inga siffror syns
    if (spelare == spelare1.textContent) {
        spelare = spelare2.textContent;
    } else {
        spelare = spelare1.textContent;
    }
    document.getElementById("throwdice").classList.remove("knapp_disable");
    //reset dice
    for (var i = 1; i <= 5; i++) {
        document.getElementById("dice-" + i).classList.remove("dice_selected");
        document.getElementById("dice-" + i).classList.add("dice");
        document.getElementById("dice-" + i).classList.add("knapp_disable");
    }

    //kollar vilkn spelare och ändrar tabellen 
    if (spelare == spelare1.textContent) {
        for (var i = 19; i <= 36; i++) {
            document.getElementById("ruta-" + i).classList.remove("poäng");
            document.getElementById("ruta-" + i).classList.add("ruta_selected");
        }
        for (var i = 1; i <= 18; i++) {
            document.getElementById("ruta-" + i).classList.add("poäng");
            document.getElementById("ruta-" + i).classList.remove("ruta_selected");
        } //visa spelare
        document.getElementById("spelare1").classList.remove("not_current_spelare");
        document.getElementById("spelare2").classList.add("not_current_spelare");
    } else {
        //om spelare 2
        for (var i = 1; i <= 18; i++) {
            document.getElementById("ruta-" + i).classList.add("ruta_selected");
            document.getElementById("ruta-" + i).classList.remove("poäng");
        }
        for (var i = 19; i <= 36; i++) {
            document.getElementById("ruta-" + i).classList.add("poäng");
            document.getElementById("ruta-" + i).classList.remove("ruta_selected");
        }
        //visa spelare
        document.getElementById("spelare2").classList.remove("not_current_spelare");
        document.getElementById("spelare1").classList.add("not_current_spelare");
    }
    kast = 3;
    update();
}

var dice;
//check which dice that are selected
function click_dice(dice) {
    if (document.getElementById("dice-" + dice).classList.contains("dice_selected")) {
        document.getElementById("dice-" + dice).classList.remove("dice_selected");
        document.getElementById("dice-" + dice).classList.add("dice");
    } else {
        document.getElementById("dice-" + dice).classList.add("dice_selected");
        document.getElementById("dice-" + dice).classList.remove("dice");
    }

}
//när man klickar på kasta
function kasta() {
    //kollar hur många kast kvar
    if (kast <= 0) {
        return;
    }

    //check which selected
    var arr = [];

    for (var i = 1; i <= 5; i++) {
        //ta bort tranparant för alla dice
        document.getElementById("dice-" + i).classList.remove("knapp_disable");
        //kollar vilka som är tagna
        if (document.getElementById("dice-" + i).classList.contains("dice")) {
            arr.push("dice-" + i);
        }
    }

    //kastar tärningarna som inte är markerade
    for (var i = 1; i <= arr.length; i++) {
        var diceValue = Math.floor(Math.random() * 6) + 1;
        var diceElement = document.getElementById(arr[i - 1]);
        diceElement.src = `img/dice-${diceValue}.png`;
        diceElement.alt = `Tärningsbild med nummer ${diceValue}`;
    }
    //minskar kastet
    kast = kast - 1;
    update();
}

//när man klickar på en ruta i tabellen stängs den av
function poäng(ruta_selected) {
    document.getElementById("ruta-" + ruta_selected).classList.add("ruta_disabled");
    document.getElementById("ruta-" + ruta_selected).classList.remove("ruta_selected", "poäng");
    byt_spelare();
}

function vilken_ruta_textcontent(vilken_ruta, lika_med) {
    //kollar om den är av. isånna fall gör ingenting
    if (document.getElementById("ruta-" + vilken_ruta).classList.contains("ruta_disabled")) {
        return;
    } else {
        return document.getElementById("ruta-" + vilken_ruta).textContent = lika_med;
    }

}
//räknar ut totalen och vem som vinner
function count_total() {
    //kollar om man har kastat
    if (document.getElementById("dice-1").classList.contains("knapp_disable")) {
        return;
    }
    var splited = 0;
    var dicevalues = [];

    //får alla tärningars värde
    for (var i = 1; i < 6; i++) {
        splited = document.getElementById("dice-" + i).src.split("dice-")[1];
        splited = splited.split(".")[0];
        dicevalues.push(splited);
    }
    //lägg alla i en arr och se hur många av varje
    var eq = new Array(6);
    eq[1] = 0;
    eq[2] = 0;
    eq[3] = 0;
    eq[4] = 0;
    eq[5] = 0;
    eq[6] = 0;

    eq[dicevalues[0]]++;
    eq[dicevalues[1]]++;
    eq[dicevalues[2]]++;
    eq[dicevalues[3]]++;
    eq[dicevalues[4]]++;


    function ett_till_sex() {
        const counts = {};

        for (const num of dicevalues) {
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        //räkna hur mycket allt är värt om det från 1 till 6 spelare 1
        for (var i = 1; i <= 6; i++) {
            if (counts[i] == undefined) {
                vilken_ruta_textcontent(i, 0);

            } else { //spelare 1
                vilken_ruta_textcontent(i, counts[i] * i);
                //spelare 2
                vilken_ruta_textcontent(i + 18, counts[i] * i);
            }
        }
    }

    //alla funktioner för att räkna ut är nedan
    function ett_par() {
        for (var i = 6; i > 0; i--) {
            if (eq[i] > 1)
                return vilken_ruta_textcontent(9, 2 * i), vilken_ruta_textcontent(27, 2 * i);
        }
        return vilken_ruta_textcontent(9, 0), vilken_ruta_textcontent(27, 0);
    }

    function två_par() {
        for (var i = 6; i > 1; i--)
            if (eq[i] > 1)
                for (var j = i - 1; j > 0; j--)
                    if (eq[j] > 1)
                        return vilken_ruta_textcontent(10, 2 * (i + j)), vilken_ruta_textcontent(28, 2 * (i + j));
        return vilken_ruta_textcontent(10, 0), vilken_ruta_textcontent(28, 0);
    }

    function tretal() {
        for (var i = 6; i > 0; i--)
            if (eq[i] > 2)
                return vilken_ruta_textcontent(11, 3 * i), vilken_ruta_textcontent(29, 3 * i);
        return vilken_ruta_textcontent(11, 0), vilken_ruta_textcontent(29, 0);
    }

    function fyrtal() {
        for (var i = 6; i > 0; i--)
            if (eq[i] > 3)
                return vilken_ruta_textcontent(12, 4 * i), vilken_ruta_textcontent(30, 4 * i);
        return vilken_ruta_textcontent(12, 0), vilken_ruta_textcontent(30, 0);
    }

    function liten_stege() {
        if (eq[1] == 1 && eq[2] == 1 && eq[3] == 1 && eq[4] == 1 && eq[5] == 1)
            return vilken_ruta_textcontent(13, 15), vilken_ruta_textcontent(31, 15);
        return vilken_ruta_textcontent(13, 0), vilken_ruta_textcontent(31, 0);
    }

    function stor_stege() {
        if (eq[2] == 1 && eq[3] == 1 && eq[4] == 1 && eq[5] == 1 && eq[6] == 1)
            return vilken_ruta_textcontent(14, 20), vilken_ruta_textcontent(32, 20);
        return vilken_ruta_textcontent(14, 0), vilken_ruta_textcontent(32, 0);
    }

    function kåk() {
        for (var i = 6; i > 1; i--) {
            if (eq[i] > 2) {
                for (var j = i - 1; j > 0; j--)
                    if (eq[j] > 1)
                        return vilken_ruta_textcontent(15, 3 * i + 2 * j), vilken_ruta_textcontent(33, 3 * i + 2 * j);
            } else if (eq[i] > 1) {
                for (var j = i - 1; j > 0; j--)
                    if (eq[j] > 2)
                        return vilken_ruta_textcontent(15, 2 * i + 3 * j), vilken_ruta_textcontent(33, 2 * i + 3 * j);
            }
        }
        return vilken_ruta_textcontent(15, 0), vilken_ruta_textcontent(33, 0);
    }

    function chans() {
        return vilken_ruta_textcontent(16, parseInt(dicevalues[0]) + parseInt(dicevalues[1]) + parseInt(dicevalues[2]) + parseInt(dicevalues[3]) + parseInt(dicevalues[4])), vilken_ruta_textcontent(34, parseInt(dicevalues[0]) + parseInt(dicevalues[1]) + parseInt(dicevalues[2]) + parseInt(dicevalues[3]) + parseInt(dicevalues[4]));
    }

    function yatzy() {
        if (dicevalues[0] == dicevalues[1] && dicevalues[0] == dicevalues[2] && dicevalues[0] == dicevalues[3] && dicevalues[0] == dicevalues[4])
            return vilken_ruta_textcontent(17, 50), vilken_ruta_textcontent(35, 50);
        return vilken_ruta_textcontent(17, 0), vilken_ruta_textcontent(35, 0);
    }

    ett_till_sex();
    ett_par();
    två_par();
    tretal();
    fyrtal();
    liten_stege();
    stor_stege();
    kåk();
    chans();
    yatzy();

}

function summa_bonus_total() { //räkna summan av 1-6
    var summa_spelare1 = 0,
        summa_spelare2 = 0;

    //räkna för 1 till 6 spelare 1
    for (var i = 1; i < 7; i++) {
        //kollar om den är avaktiverad för att räkna totalen
        if (document.getElementById("ruta-" + i).classList.contains("ruta_disabled")) {
            summa_spelare1 = summa_spelare1 + parseInt(document.getElementById("ruta-" + i).textContent);
        } //räknar för spelare 2
        if (document.getElementById("ruta-" + (i + 18)).classList.contains("ruta_disabled")) {
            summa_spelare2 = summa_spelare2 + parseInt(document.getElementById("ruta-" + (i + 18)).textContent);
        }
    }

    //skriver ut summan i rutorna
    document.getElementById("ruta-7").innerHTML = summa_spelare1;
    document.getElementById("ruta-25").innerHTML = summa_spelare2; //räkna om du får bonus
    var bonus_spelare1 = -63,
        bonus_spelare2 = -63;

    bonus_spelare1 = bonus_spelare1 + summa_spelare1;
    bonus_spelare2 = bonus_spelare2 + summa_spelare2;
    document.getElementById("ruta-8").innerHTML = bonus_spelare1;
    document.getElementById("ruta-26").innerHTML = bonus_spelare2;
    if (bonus_spelare1 >= 0) {
        document.getElementById("ruta-8").innerHTML = 50;
    }
    if (bonus_spelare2 >= 0) {
        document.getElementById("ruta-26").innerHTML = 50;
    }
    //allt nedan är för att räkna totalen av alla rutor
    var total_spelare2 = 0,
        total_spelare1 = 0;

    for (var i = 1; i < 17; i++) {
        //kollar om den är avaktiverad för att räkna totalen //räknar för spelare 1
        if (document.getElementById("ruta-" + i).classList.contains("ruta_disabled")) {
            total_spelare1 = total_spelare1 + parseInt(document.getElementById("ruta-" + i).textContent);
        } //räknar för spelare 2
        if (document.getElementById("ruta-" + (i + 18)).classList.contains("ruta_disabled")) {
            total_spelare2 = total_spelare2 + parseInt(document.getElementById("ruta-" + (i + 18)).textContent);
        }
    } //skriver ut totalen i rutorna

    if (bonus_spelare1 < 0) {
        document.getElementById("ruta-18").innerHTML = total_spelare1 - summa_spelare1 - bonus_spelare1;
    } else {
        document.getElementById("ruta-18").innerHTML = total_spelare1 - summa_spelare1;
    }
    if (bonus_spelare2 < 0) {
        document.getElementById("ruta-36").innerHTML = total_spelare2 - summa_spelare2 - bonus_spelare2;
    } else {
        document.getElementById("ruta-36").innerHTML = total_spelare2 - summa_spelare2;
    }

}

function update() {

    //fixa ui
    mouseOver()
    //om kast = 0 stäng av kasta 
    if (kast <= 0) {
        document.getElementById("throwdice").classList.add("knapp_disable");
        kast = 0;
    }
    //count total och möjliga poäng
    count_total();
    summa_bonus_total();
    //fixa rutorna för spelarna
    if (spelare == spelare2.textContent) {
        for (var i = 1; i < 18; i++) {
            vilken_ruta_textcontent(i, 0);
        }
    } else {
        for (var i = 19; i < 35; i++) {
            vilken_ruta_textcontent(i, 0);
        }
    }
}

function setup() {
    //fixa tärningarna
    for (var i = 1; i <= 5; i++) {
        var diceElement = document.getElementById("dice-" + i);
        diceElement.src = `img/dice-${i}.png`;
        //ta bort tranparant för alla dice
        document.getElementById("dice-" + i).classList.add("knapp_disable");
    }
    byt_spelare();
    //fix ui
    mouseOut();
}
setup();