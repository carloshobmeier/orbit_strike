const botaoIniciar = document.getElementById("iniciar");
const cenario = document.getElementById("cenario");
const nave = document.getElementById("nave");
const vida = document.getElementById("vida");
const pontos = document.getElementById("pontos");
const audioJogo = new Audio("/audios/despair_metal.mp3");

const larguraCenario = cenario.offsetWidth;
const alturaCenario = cenario.offsetHeight;

const larguraNave = nave.offsetWidth;
const alturaCeNave = nave.offsetHeight;

const velocidadeNave = 20;
const velocidadeTiro = 25;
const velocidadeNaveInimigas = 4;

let estaAtirando = false;
let jogoPausado = false;

let tiroAtual = 0;

let vidaAtual = 10;
let pontosAtual = 0;

let checaMoveNaveInimigas;
let checaNaveInimigas;
let checaMoveTiros;
let checaMoveNave;
let checaColisao;
let checaTiros;

let posicaoHorizontal = larguraCenario / 2 - 50;
let posicaoVertical = alturaCenario - alturaCeNave;
let direcaoHorizontal = 0;
let direcaoVertical = 0;

const teclaPressionada = (tecla) => {
  if (tecla.key === "ArrowRight") {
    direcaoHorizontal = 1;
  } else if (tecla.key === "ArrowLeft") {
    direcaoHorizontal = -1;
  } else if (tecla.key === "ArrowDown") {
    direcaoVertical = 1;
  } else if (tecla.key === "ArrowUp") {
    direcaoVertical = -1;
  }
}

const teclaSolta = (tecla) => {
  if (tecla.key === "ArrowRight" || tecla.key === "ArrowLeft") {
    direcaoHorizontal = 0;
  } else if (tecla.key === "ArrowDown" || tecla.key === "ArrowUp") {
    direcaoVertical = 0;
  }
}

const moveNave = () => {
  posicaoHorizontal += direcaoHorizontal * velocidadeNave;
  posicaoVertical += direcaoVertical * velocidadeNave;
  if (posicaoHorizontal < 0) {
    posicaoHorizontal = 0;
  } else if (posicaoHorizontal + larguraNave > larguraCenario) {
    posicaoHorizontal = larguraCenario - larguraNave;
  }
  if (posicaoVertical < 0) {
    posicaoVertical = 0;
  } else if (posicaoVertical + alturaCeNave > alturaCenario) {
    posicaoVertical = alturaCenario - alturaCeNave;
  }
  nave.style.left = posicaoHorizontal + "px";
  nave.style.top = posicaoVertical + "px";
}

const atirar = () => {
  const delayTiro = Date.now();
  const atrasoTiro = delayTiro - tiroAtual;

  if (estaAtirando && atrasoTiro >= 100) {
    tiroAtual = Date.now();
    criaTiros(posicaoHorizontal + 45, posicaoVertical - 10);
  }
}

document.addEventListener("keydown", (tecla) => {
  if (tecla.key === " ") {
    estaAtirando = true;
  }
});

document.addEventListener("keyup", (tecla) => {
  if (tecla.key === " ") {
    estaAtirando = false;
  }
})

const criaTiros = (posicaoLeftTiro, posicaoTopTiro) => {
  const tiro = document.createElement("div");
  tiro.className = "tiro";
  tiro.style.position = "absolute";
  tiro.style.width = "30px";
  tiro.style.height = "30px";
  tiro.style.backgroundImage = "url('./imagens/tiro_verde.png')";
  tiro.style.left = posicaoLeftTiro + "px";
  tiro.style.top = posicaoTopTiro + "px";
  cenario.appendChild(tiro);
  audioTiros();
}
const audioTiros = () => {
  const audioDoTiro = document.createElement("audio");
  audioDoTiro.className = "audiotiro";
  audioDoTiro.setAttribute("src", "/audios/tiro.mp3");
  audioDoTiro.play();
  cenario.appendChild(audioDoTiro);
  audioDoTiro.addEventListener("ended", () => {
    audioDoTiro.remove();
  })
}

const moveTiros = () => {
  const tiros = document.querySelectorAll(".tiro");
  for (let i = 0; i < tiros.length; i++) {
    if (tiros[i]) {
      let posicaoTopTiro = tiros[i].offsetTop;
      posicaoTopTiro -= velocidadeTiro;
      tiros[i].style.top = posicaoTopTiro + "px";
      if (posicaoTopTiro < -10) {
        tiros[i].remove();
      } 
    }
  }
}

const naveInimigas = () => {
  const inimigo = document.createElement("div");
  inimigo.className = "inimigo";
  inimigo.style.position = "absolute";
  inimigo.setAttribute("data-vida", 5);
  inimigo.style.width = "100px";
  inimigo.style.height = "100px";
  inimigo.style.backgroundImage = "url(/imagens/nave_preta.png)";
  inimigo.style.backgroundPosition = "center";
  inimigo.style.backgroundRepeat = "no-repeat";
  inimigo.style.backgroundSize = "contain";
  inimigo.style.left = Math.floor(Math.random() * (larguraCenario - larguraNave)) + "px";
  inimigo.style.top = "-100px";
  cenario.appendChild(inimigo);
}




const moveNaveInimigas = () => {
  const navaInimigas = document.querySelectorAll(".inimigo");
  for (let i = 0; i < navaInimigas.length; i++) {
    if (navaInimigas[i]) {
      let posicaoTopNaveInimiga = navaInimigas[i].offsetTop;
      let posicaoLeftNaveInimiga = navaInimigas[i].offsetLeft;
      posicaoTopNaveInimiga += velocidadeNaveInimigas;
      navaInimigas[i].style.top = posicaoTopNaveInimiga + "px";
      if (posicaoTopNaveInimiga > alturaCenario) {
        vidaAtual -= 1;
        vida.textContent = `Vida: ${vidaAtual}`;
        explosaoNaveInimigaDestruida(posicaoLeftNaveInimiga);
        if (vidaAtual <= 0) {
          gameOver();
        }
        navaInimigas[i].remove();
      } 
    }
  }
}

const colisao = () => {
  const todasNavesInimigas = document.querySelectorAll(".inimigo");
  const todosTiros = document.querySelectorAll(".tiro");
  todasNavesInimigas.forEach((naveInimiga) => {
    todosTiros.forEach((tiro) => {
      const colisaoNaveInimiga = naveInimiga.getBoundingClientRect();
      const colisaoTiro = tiro.getBoundingClientRect();
      const posicaoNaveInimigaLeft = naveInimiga.offsetLeft;
      const posicaoNaveInimigaTop = naveInimiga.offsetTop;
      let vidaAtualNaveInimiga = parseInt(naveInimiga.getAttribute("data-vida"));
      if (
        colisaoNaveInimiga.left < colisaoTiro.right &&
        colisaoNaveInimiga.right > colisaoTiro.left &&
        colisaoNaveInimiga.top < colisaoTiro.bottom &&
        colisaoNaveInimiga.bottom > colisaoTiro.top
      ) {
        vidaAtualNaveInimiga--;
        tiro.remove();
        if (vidaAtualNaveInimiga === 0) {
          pontosAtual += 10;
          pontos.textContent = `Pontos: ${pontosAtual}`;
          naveInimiga.remove();
          naveInimigaDestruida(posicaoNaveInimigaLeft, posicaoNaveInimigaTop);
        } else {
          naveInimiga.setAttribute("data-vida", vidaAtualNaveInimiga);
        }
      }
    })
  })
}

const naveInimigaDestruida = (posicaoLeftNaveInimiga, posicaoTopNaveInimiga) => {
  const naveInimigaDestruida = document.createElement("div");
  naveInimigaDestruida.className = "naveinimigadestruida";
  naveInimigaDestruida.style.position = "absolute";
  naveInimigaDestruida.style.width = "100px";
  naveInimigaDestruida.style.height = "100px";
  naveInimigaDestruida.style.backgroundImage = "url(/imagens/eliminado.gif)";
  naveInimigaDestruida.style.backgroundPosition = "center";
  naveInimigaDestruida.style.backgroundRepeat = "no-repeat";
  naveInimigaDestruida.style.backgroundSize = "contain";
  naveInimigaDestruida.style.left = posicaoLeftNaveInimiga + "px";
  naveInimigaDestruida.style.top = posicaoTopNaveInimiga + "px";
  cenario.appendChild(naveInimigaDestruida);
  audioExplosoes();
  setTimeout(() => {cenario.removeChild(naveInimigaDestruida);}, 1000);
}

const explosaoNaveInimigaDestruida = (posicaoLeftNaveInimiga) => {
  const explosaoNaveInimiga = document.createElement("div");
  explosaoNaveInimiga.className = "explosaonaveinimiga";
  explosaoNaveInimiga.style.position = "absolute";
  explosaoNaveInimiga.style.width = "100px";
  explosaoNaveInimiga.style.height = "100px";
  explosaoNaveInimiga.style.backgroundImage = "url(/imagens/passou.gif)";
  explosaoNaveInimiga.style.backgroundPosition = "center";
  explosaoNaveInimiga.style.backgroundRepeat = "no-repeat";
  explosaoNaveInimiga.style.backgroundSize = "contain";
  explosaoNaveInimiga.style.left = posicaoLeftNaveInimiga + "px";
  explosaoNaveInimiga.style.top = (alturaCenario - 100) + "px";
  cenario.appendChild(explosaoNaveInimiga);
  audioPassou();
  setTimeout(() => {cenario.removeChild(explosaoNaveInimiga);}, 1000);
}

const audioExplosoes = () => {
  const audioExplosaoNaveInimiga = document.createElement("audio");
  audioExplosaoNaveInimiga.className = "audioexplosoes";
  audioExplosaoNaveInimiga.setAttribute("src", "/audios/destruido.mp3");
  audioExplosaoNaveInimiga.play();
  cenario.appendChild(audioExplosaoNaveInimiga);
  audioExplosaoNaveInimiga.addEventListener("ended", () => {
    audioExplosaoNaveInimiga.remove();
  })
}
const audioPassou = () => {
  const audioPassouNaveInimiga = document.createElement("audio");
  audioPassouNaveInimiga.className = "audioexplosoes";
  audioPassouNaveInimiga.setAttribute("src", "/audios/erro.mp3");
  audioPassouNaveInimiga.play();
  cenario.appendChild(audioPassouNaveInimiga);
  audioPassouNaveInimiga.addEventListener("ended", () => {
    audioPassouNaveInimiga.remove();
  })
}


function pausarJogo() {
  if (!jogoPausado) {
    jogoPausado = true;
    clearInterval(checaMoveNave);
    clearInterval(checaMoveTiros);
    clearInterval(checaMoveNaveInimigas);
    clearInterval(checaNaveInimigas);
    clearInterval(checaColisao);
    document.getElementById('botaoPausa').style.display = 'block';

  }
}

function despausarJogo() {
  if (jogoPausado) {
    jogoPausado = false;
    checaMoveNave = setInterval(moveNave, 50);
    checaMoveTiros = setInterval(moveTiros, 50);
    checaMoveNaveInimigas = setInterval(moveNaveInimigas, 50);
    checaColisao = setInterval(colisao, 10);
    checaNaveInimigas = setInterval(naveInimigas, 1000);
    
    document.getElementById('botaoPausa').style.display = 'none';
  }
}


const gameOver = () => {
  document.removeEventListener("keydown", teclaPressionada);
  document.removeEventListener("keyup", teclaSolta);
  clearInterval(checaMoveNaveInimigas);
  clearInterval(checaNaveInimigas);
  clearInterval(checaMoveTiros);
  clearInterval(checaMoveNave);
  clearInterval(checaColisao);
  const perdeu = document.createElement("div");
  perdeu.style.position = "absolute";
  perdeu.innerHTML = "Game Over";
  perdeu.style.backgroundColor = "white";
  perdeu.style.color = "black";
  perdeu.style.left = "50%";
  perdeu.style.top = "50%";
  perdeu.style.padding = "10px 20px";
  perdeu.style.borderRadius = "5px";
  perdeu.style.transform = "translate(-50%, -50%)";
  cenario.appendChild(perdeu);
  cenario.removeChild(nave);
  cenario.style.animation = "none";
  const navesInimigas = document.querySelectorAll(".inimigo");
  navesInimigas.forEach((inimigos) => {
    inimigos.remove();
  });
  const todosTiros = document.querySelectorAll(".tiro");
  todosTiros.forEach((tiro) => {
    cenario.removeChild(tiro);
  });
}

const iniciarJogo = () => {
  document.addEventListener("keydown", teclaPressionada);
  document.addEventListener("keyup", teclaSolta);
  document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") { // Tecla ESC para pausar
      pausarJogo();
    } else if (jogoPausado) { // Qualquer outra tecla para despausar
      despausarJogo();
    }
  });  
  checaMoveNave = setInterval(moveNave, 50);
  checaMoveTiros = setInterval(moveTiros, 50);
  checaMoveNaveInimigas = setInterval(moveNaveInimigas, 50);
  checaColisao = setInterval(colisao, 10);
  checaNaveInimigas = setInterval(naveInimigas, 1000);
  checaTiros = setInterval(atirar, 10);
  botaoIniciar.style.display = "none";
  cenario.style.animation = "animarCenario 10s infinite linear";
  audioJogo.loop = true;
  audioJogo.play();
}
