/*
INFO LÄS README.txt
*/

//hur snabbt den animerar
let animatespeed = 100;
//hur snabbt färgen ändras på alternativ 6/color settings
let colorspeed = 500;
let colorchange = 15;
let colorinterval = "";
//random variablar
let arr = ["F", "F", "+", "-"];
let hello = ["", "", "", "", ""];

//huvud, color, animera, timer och generation variablar
let color = 0,
  vinkel = 0,
  djup = 0,
  info_n = 0,
  r = 255,
  g = 0,
  b = 0,
  animera = 0,
  timer,
  generation = 0,
  maxGeneration = 5;

//första fraktalen vid start
let axiom = "F++F++F";
let rules = [
  {
    in: "F",
    out: "F-F++F-F",
  },
];
let mening = axiom;

//göm från början
document.getElementById("göminfo").style.visibility = "hidden";

// variabar för att zomma och flyta på fraktalen
let scale = 1;
let down = false;
let x1 = window.innerWidth / 2;
let y1 = window.innerHeight / 2;
let dragDiff = {
  x1: 0,
  y1: 0,
};

//när användaren börjar dra med musen
function BörjaDra(e) {
  if (e.offsetX > 180) {
    down = true;
    dragDiff.x1 = e.offsetX - x1;
    dragDiff.y1 = e.offsetY - y1;
    draw();
  }
}
//när användaren slutar dra med musen
function stopDra(e) {
  if (e.offsetX > 180) {
    down = false;
    stopDra.x1 = e.offsetX;
    stopDra.y1 = e.offsetY;
  }
}
//när användaren drar med musen
function movedrag(e) {
  if (e.offsetX > 180) {
    e.preventDefault();
    if (down) {
      x1 = e.offsetX - dragDiff.x1;
      y1 = e.offsetY - dragDiff.y1;
      draw();
    }
  }
}
//när användaren zoomar dra med musen
function zoom(e) {
  scale += e.deltaY * -0.01;
  // Restrict scale
  scale = Math.min(Math.max(1, scale), 80);
  setup();
}
//kollar om man gör någon av dessa funktioner ex mousedown
const move = document.getElementById("move");
move.addEventListener("mousedown", BörjaDra);
move.addEventListener("mouseup", stopDra);
move.addEventListener("mousemove", movedrag);
move.addEventListener("wheel", zoom);

//start funktion
function setup() {
  createCanvas(windowWidth - 40, windowHeight - 25);
  draw();
}

//generera fraktal
function generera() {
  let nextmening = "";
  //mening är axiomen i början
  for (let i = 0; i < mening.length; i++) {
    let found = false;
    //för varje tecken i meningen/axiomen
    let tecken = mening.charAt(i);
    //för varje tecken i regel körs denna
    for (let j = 0; j < rules.length; j++) {
      //om teckenet är samma som regel tecknet körs denna
      if (tecken === rules[j].in) {
        found = true;
        nextmening += rules[j].out;
        break;
      }
    }
    if (!found) {
      nextmening += tecken;
    }
  }
  mening = nextmening;
  console.log(mening);
  draw();
}
//ändra färg och steg fraktal
function draw() {
  resetMatrix(0);
  background("#ecf0f1");
  //color
  if (color === 0) {
    stroke(44, 62, 80); //white
  } else if (color == 1) {
    stroke(0, 0, 255); //blue
  } else if (color == 2) {
    stroke(0, 128, 0); //green
  } else if (color == 3) {
    stroke(255, 0, 0); //red
  } else if (color == 4) {
    stroke(255, 165, 0); //orange
  } else if (color == 5) {
    stroke(r, g, b); //rgb flera färger
  }
  //vart man ska börja rita
  translate(x1, y1);
  //för varje character i "mening"/"rules" kör loopen
  for (let i = 0; i <= mening.length; i++) {
    //sätter "tecken" till nuvarande tecknet i meningen/axiomen
    let tecken = mening.charAt(i);
    //går ett steg framåt
    if (tecken === "F") {
      line(0, 0, 0, -scale);
      translate(0, -scale);
    }
    //vrider den åt höger med vinkeln du har angivit
    else if (tecken === "+") {
      rotate(radians(vinkel.value));
    }
    //vrider den åt vänster med vinkeln du har angivit
    else if (tecken === "-") {
      rotate(-radians(vinkel.value));
    }
    //gör en förgrening, Gör det som står inom hackparateserna och sedan går tillbaka till teckenet innan hackparantesen
    else if (tecken === "[") {
      push();
    } else if (tecken === "]") {
      pop();
    }
  }
}

//!UI
let fraktal = (function () {
  //!göm UI med knappen på toppen
  let gömknapp = document.getElementById("gömknapp");
  let hidden = false;
  gömknapp.onclick = function () {
    hidden = !hidden;
    if (hidden) {
      document.getElementById("göm1").style.visibility = "hidden";
      document.getElementById("göm2").style.visibility = "hidden";
      document.getElementById("göm3").style.visibility = "hidden";
      document.getElementById("bruh").style.border = "1px solid black";
    } else {
      document.getElementById("göm1").style.visibility = "visible";
      document.getElementById("göm2").style.visibility = "visible";
      document.getElementById("göm3").style.visibility = "visible";
      document.getElementById("bruh").style.border = "1px solid white";
    }
  };

  //!INFO
  let infoknapp = document.getElementById("infoknapp");
  let hiddeninfo = true;
  infoknapp.onclick = function () {
    hiddeninfo = !hiddeninfo;
    if (hiddeninfo) {
      document.getElementById("göminfo").style.visibility = "hidden";
      document.getElementById("göminfo").style.height = "0px";
      document.getElementById("göm2").style.visibility = "visible";
      document.getElementById("göm2").style.height = "325px";
    } else {
      document.getElementById("göminfo").style.visibility = "visible";
      document.getElementById("göminfo").style.height = "340px";
      document.getElementById("göm2").style.visibility = "hidden";
      document.getElementById("göm2").style.height = "0%";
    }
    info_n++;
    if (info_n === 1) {
      infoknapp.className = "knappon";
    }
    if (info_n === 2) {
      infoknapp.className = "knapp";
      info_n = 0;
    }
  };

  //!COLOR
  let colorknapp = document.getElementById("colorknapp");
  colorknapp.onclick = function () {
    //stänger av colorloop
    clearInterval(colorinterval);
    color++;
    if (color === 6) {
      color = 0;
    }
    //sätta på color change
    if (color === 5) {
      colorinterval = setInterval(colorloop, colorspeed);
    }
    update();
  };

  //color loop
  function colorloop() {
    if (r > 0 && b <= 0) {
      r -= colorchange;
      g += colorchange;
    }
    if (g > 0 && r <= 0) {
      g -= colorchange;
      b += colorchange;
    }
    if (b > 0 && g <= 0) {
      r += colorchange;
      b -= colorchange;
    }
    draw();
  }

  //!SLIDERS VINKEL
  vinkel = document.getElementById("vinkel");
  let vinkelout = document.getElementById("vinkel-out");
  vinkelout.innerHTML = vinkel.value;

  //gör saker med vinkel
  vinkel.oninput = function () {
    vinkelout.innerHTML = this.value;
    update();
  };

  //!DJUP
  djup = document.getElementById("djupknapp");
  let generationout = document.getElementById("generation-out");
  generationout.innerHTML = djup.value;

  djup.oninput = function () {
    mening = axiom;
    generation = djup.value;
    for (let i = 0; i < djup.value; i++) {
      generera();
    }
    generationout.innerHTML = this.value;
    update();
  };

  //!RANDOM
  let random = document.getElementById("randomknapp");
  random.onclick = function () {
    for (let i = 0; i < 8; i++) {
      hello[i] = arr[Math.floor(Math.random() * arr.length)];
    }
    axiom =
      "F" +
      arr[Math.floor(Math.random() * arr.length)] +
      arr[Math.floor(Math.random() * arr.length)] +
      arr[Math.floor(Math.random() * arr.length)];
    rules = [
      {
        in: "F",
        out:
          "F" +
          hello[0] +
          hello[1] +
          hello[2] +
          hello[3] +
          hello[4] +
          hello[5] +
          hello[6] +
          hello[7],
      },
    ];
    vinkel.value = getRandomInt(0, 361);
    scale = 4;
    djup.value = 3;
    update();
  };

  //Random funktion
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //så man kan genera ett tal mellan två värden.
  }

  //!ANIMERA
  let animeraknapp = document.getElementById("animeraknapp");
  animeraknapp.onclick = function () {
    animera++;
    if (animera === 1) {
      timedCount();
      animeraknapp.className = "knappon";
    }
    if (animera === 2) {
      clearTimeout(timer);
      animeraknapp.className = "knapp";
      animera = 0;
    }
  };

  timedCount = function () {
    let v = parseInt(vinkel.value);
    v = v + 1;

    if (v === 361) {
      v = 0;
    }
    //updatera UI
    vinkel.value = v;
    vinkelout.innerHTML = vinkel.value;
    //vänta
    timer = setTimeout(timedCount, animatespeed);
    update();
  };

  //!SAVE button för egna input på fraktaler
  const spara = document.getElementById("spara");
  spara.onclick = function () {
    axiom = document.getElementById("axiom").value;

    var textArea = document.getElementById("rules2");
    var rows = textArea.value.split("\n");

    //skit dålig
    if (rows.length >= 2) {
      const row1 = rows[0].split("=");
      const row2 = rows[1].split("=");
      rules = [
        {
          in: row1[0],
          out: row1[1],
        },
        {
          in: row2[0],
          out: row2[1],
        },
      ];
    }
    if (rows.length === 1) {
      const row1 = rows[0].split("=");
      rules = [
        {
          in: row1[0],
          out: row1[1],
        },
      ];
    }
    // Loop through all rows

    if (axiom.length <= 0) {
      alert("OBS: Du har ingen AXIOM");
    } else if (!rows[0].includes("=")) {
      alert("OBS: Du måste ha ett (=) i RULES");
    } else if (rules[0].in.length >= 2 || rules[0].in.length <= 0) {
      alert("OBS: Du måste ha ETT tecken före (=) i RULES");
    } else if (rules[0].out.length <= 0) {
      alert("OBS: Du har inga RULES efter (=)");
    } else if (!axiom.includes(rules[0].in)) {
      alert(
        "OBS: Ditt tecken i RULES före (=) har inte något tecken som förekommer i AXIOMEN"
      );
    } else {
      confirm(
        "OBS: Tryck på DJUP för att se din fraktal\n" +
          "Axiom: " +
          axiom +
          "\nRules in: " +
          rules[0].in +
          "\nRules out: " +
          rules[0].out
      );
    }
  };

  //!RESET
  let reset = document.getElementById("resetknapp");
  reset.onclick = function () {
    color = 0;
    vinkel.value = 60;
    scale = 5;
    djup.value = 0;
    x1 = window.innerWidth / 2;
    y1 = window.innerHeight / 2;
    axiom = "F++F++F";
    rules = [
      {
        in: "F",
        out: "F-F++F-F",
      },
    ];
    mening = axiom;
    //stönga av animera
    clearTimeout(timer);
    animera.className = "knapp";
    animera = 0;
    //update this
    update();
  };

  //!SAVE OCH LOAD
  let save = function () {
    let ruleid =
      "#" +
      vinkel.value +
      "," +
      scale +
      "," +
      color +
      "," +
      djup.value +
      "," +
      axiom +
      "," +
      rules[0].in +
      "," +
      rules[0].out;
    window.location = String(window.location).replace(/\#.*$/, "") + ruleid;
  };

  let load = function () {
    let link = window.location.toString();
    if (link.includes("#")) {
      const linkinfo = link.split("#");
      const partoflink = linkinfo[1].split(",");
      //Sliders
      vinkel.value = partoflink[0];
      //Knappar
      scale = partoflink[1];
      color = partoflink[2];
      djup.value = partoflink[3];
      axiom = partoflink[4];
      rules[0].in = partoflink[5];
      rules[0].out = partoflink[6];

      if (
        vinkel.value == undefined ||
        scale === undefined ||
        djup.value === undefined ||
        axiom === undefined ||
        rules[0].in === undefined ||
        rules[0].out === undefined ||
        color === undefined
      ) {
        //Sliders
        vinkel.value = 60;
        //Knappar
        scale = 10;
        djup.value = 0;
        let axiom = "F++F++F";
        let rules = [
          {
            in: "F",
            out: "F-F++F-F",
          },
        ];
        color = 0;
      }
    } else {
      //Sliders
      vinkel.value = 60;
      //Knappar
      scale = 10;
      //Knappar
      djup.value = 0;
      let axiom = "F++F++F";
      let rules = [
        {
          in: "F",
          out: "F-F++F-F",
        },
      ];
      color = 0;
    }
    save();
  };
  //!START
  load();
  //!Uppdatera allt/////////////////////////////
  let update = function () {
    //skriver ut de nya väderna
    setup();

    //animeringshastighet gör det snabbare när det är närare visa värden
    if (
      (vinkel.value > 150 && vinkel.value < 220) ||
      vinkel.value > 330 ||
      vinkel.value < 30
    ) {
      animatespeed = 50;
    }
    if (
      (vinkel.value > 30 && vinkel.value < 150) ||
      (vinkel.value > 220 && vinkel.value < 330)
    ) {
      animatespeed = 100;
    }

    //Updaterar sliders och knappar
    vinkelout.innerHTML = vinkel.value;
    generationout.innerHTML = parseInt(djup.value) + 1;
    document.getElementById("färg_n").innerHTML = color;
    document.getElementById("axiom-out").innerHTML = axiom;
    document.getElementById("rules1-out").innerHTML = rules[0].in;
    document.getElementById("rules2-out").innerHTML = rules[0].out;
    //sparar hashen för hemsidan
    save();
  };

  //!EXEMPEL
  const Kochcurve = document.getElementById("Kochcurve");
  Kochcurve.addEventListener("click", function () {
    axiom = "-F";
    rules = [
      {
        in: "F",
        out: "F+F--F+F",
      },
    ];
    vinkel.value = 60;
    scale = 5;
    djup.value = 4;

    setup();
  });
  const Sierpinskisquare = document.getElementById("Sierpinskisquare");
  Sierpinskisquare.addEventListener("click", function () {
    axiom = "F+XF+F+XF";
    rules = [
      {
        in: "X",
        out: "XF-F+F-XF+F+XF-F+F-X",
      },
    ];
    vinkel.value = 90;
    scale = 5;
    djup.value = 0;
    update();
  });

  const LSystemBushes1 = document.getElementById("L-System Bushes 1");
  LSystemBushes1.addEventListener("click", function () {
    axiom = "F";
    rules = [
      {
        in: "F",
        out: "FF+[+F-F-F]-[-F+F+F]",
      },
    ];
    vinkel.value = 22.5;
    scale = 5;
    djup.value = 0;
    update();
  });

  const LSystemBushes2 = document.getElementById("L-System Bushes 2");
  LSystemBushes2.addEventListener("click", function () {
    axiom = "F";
    rules = [
      {
        in: "F",
        out: "F[+FF][-FF]F[-F][+F]F",
      },
    ];
    vinkel.value = 35;
    scale = 5;
    djup.value = 0;
    update();
  });

  const Board = document.getElementById("Board");
  Board.addEventListener("click", function () {
    axiom = "F+F+F+F";
    rules = [
      {
        in: "F",
        out: "FF+F+F+F+FF",
      },
    ];
    vinkel.value = 90;
    scale = 5;
    djup.value = 0;
    update();
  });

  const Triangle = document.getElementById("Triangle");
  Triangle.addEventListener("click", function () {
    axiom = "F+F+F";
    rules = [
      {
        in: "F",
        out: "F-F+F",
      },
    ];
    vinkel.value = 120;
    scale = 5;
    djup.value = 0;
    update();
  });
  const Crystal = document.getElementById("Crystal");
  Crystal.addEventListener("click", function () {
    axiom = "F+F+F+F";
    rules = [
      {
        in: "F",
        out: "FF+F++F+F",
      },
    ];
    vinkel.value = 90;
    scale = 5;
    djup.value = 0;
    update();
  });
  const Sierpinskitriangle = document.getElementById("Sierpinski Triangle");
  Sierpinskitriangle.addEventListener("click", function () {
    axiom = "FXF--FF--FF";
    rules = [
      {
        in: "F",
        out: "FF",
      },
      {
        in: "X",
        out: "--FXF++FXF++FXF--",
      },
    ];
    vinkel.value = 60;
    scale = 5;
    djup.value = 0;
    update();
  });
  const DragonCurve = document.getElementById("Dragon Curve");
  DragonCurve.addEventListener("click", function () {
    axiom = "FX";
    rules = [
      {
        in: "X",
        out: "X+YF+",
      },
      {
        in: "Y",
        out: "-FX-Y",
      },
    ];
    vinkel.value = 90;
    scale = 5;
    djup.value = 0;
    update();
  });
  const Tiles = document.getElementById("Tiles");
  Tiles.addEventListener("click", function () {
    axiom = "F+F+F+F";
    rules = [
      {
        in: "F",
        out: "FF+F-F+F+FF",
      },
    ];
    vinkel.value = 90;
    scale = 5;
    djup.value = 0;
    update();
  });

  const Rings = document.getElementById("Rings");
  Rings.addEventListener("click", function () {
    axiom = "F+F+F+F";
    rules = [
      {
        in: "F",
        out: "FF+F+F+F+F+F-F",
      },
    ];
    vinkel.value = 90;
    scale = 5;
    djup.value = 0;
    update();
  });
  const Lévycurve = document.getElementById("Lévy curve");
  Lévycurve.addEventListener("click", function () {
    axiom = "F";
    rules = [
      {
        in: "F",
        out: "+F--F+",
      },
    ];
    vinkel.value = 45;
    scale = 5;
    djup.value = 0;
    update();
  });
  const HexagonalGosper = document.getElementById("Hexagonal Gosper");
  HexagonalGosper.addEventListener("click", function () {
    axiom = "XF";
    rules = [
      {
        in: "X",
        out: "X+YF++YF-FX--FXFX-YF+",
      },
      {
        in: "Y",
        out: "-FX+YFYF++YF+FX--FX-Y",
      },
    ];
    vinkel.value = 60;
    scale = 5;
    djup.value = 0;
    update();
  });

  const SierpinskiArrowhead = document.getElementById("Sierpinski Arrowhead");
  SierpinskiArrowhead.addEventListener("click", function () {
    axiom = "YF";
    rules = [
      {
        in: "X",
        out: "YF+XF+Y",
      },
      {
        in: "Y",
        out: "XF-YF-X",
      },
    ];
    vinkel.value = 60;
    scale = 5;
    djup.value = 0;
    update();
  });
  const QuadraticSnowflake = document.getElementById("Quadratic Snowflake");
  QuadraticSnowflake.addEventListener("click", function () {
    axiom = "F";
    rules = [
      {
        in: "F",
        out: "F-F+F+F-F",
      },
    ];
    vinkel.value = 90;
    scale = 5;
    djup.value = 0;
    update();
  });
  const PeanoCurve = document.getElementById("Peano Curve");
  PeanoCurve.addEventListener("click", function () {
    axiom = "X";
    rules = [
      {
        in: "X",
        out: "XFYFX+F+YFXFY-F-XFYFX",
      },
      {
        in: "Y",
        out: "YFXFY-F-XFYFX+F+YFXFY",
      },
    ];
    vinkel.value = 90;
    scale = 5;
    djup.value = 0;
    update();
  });
  const snowflake = document.getElementById("Snowflake");
  snowflake.addEventListener("click", function () {
    axiom = "F-F-F-F-F";
    rules = [
      {
        in: "F",
        out: "F-F++F+F-F-F",
      },
    ];
    vinkel.value = 72;
    scale = 5;
    djup.value = 0;
    update();
  });
  const KrishnaAnklets = document.getElementById("Krishna Anklets");
  KrishnaAnklets.addEventListener("click", function () {
    axiom = "-X--X";
    rules = [
      {
        in: "X",
        out: "XFX--XFX",
      },
    ];
    vinkel.value = 45;
    scale = 5;
    djup.value = 0;
    update();
  });
})();
