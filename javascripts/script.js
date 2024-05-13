const botaoIniciar = document.getElementById("iniciar");
const botaoSobre = document.getElementById("sobre")
const botaoEscolhaNave = document.getElementById("escolhaNave")
const botaoEscolhaFase = document.getElementById("escolhaFase")
const botaoSair = document.getElementById("sair")
const botaoDificuldade = document.getElementById("dificuldade")
const botaoInimigo = document.getElementById("inimigos")
const cenario = document.getElementById("cenario");
const nave = document.getElementById("nave");
const vida = document.getElementById("vida");
const pontos = document.getElementById("pontos");
const audioJogo = new Audio("/audios/despair_metal.mp3");

const NaveEscolha = document.getElementById("nave")
const FaseEscolha = document.getElementById("fundo")


const larguraCenario = cenario.offsetWidth;
const alturaCenario = cenario.offsetHeight;

const larguraNave = nave.offsetWidth;
const alturaCeNave = nave.offsetHeight;

const velocidadeNave = 2;
const velocidadeTiro = 25;
const velocidadeNaveInimigas = 3.5;
const velocidadeNaveInimigasRapida = 6;

let estaAtirando = false;
let jogoPausado = false;

let tiroAtual = 0;

let vidaInicial = 10;
let pontosIniciais = 0;

let vidaAtual = vidaInicial;
let pontosAtual = pontosIniciais;

let checaMoveNaveInimigas;
let checaNaveInimigas;
let checaNaveInimigasRapidas;
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

const naveInimigaRapida = () => {
  const inimigo = document.createElement("div");
  inimigo.className = "inimigo rapida";  // Uma nova classe para estilos específicos
  inimigo.style.position = "absolute";
  inimigo.setAttribute("data-vida", 5);  // Define a vida da nave
  inimigo.setAttribute("data-tipo", "rapida");  // Uma nova data attribute para identificar o tipo
  inimigo.style.width = "100px";
  inimigo.style.height = "100px";
  inimigo.style.backgroundImage = "url(/imagens/nave_amarela.png)";
  inimigo.style.backgroundPosition = "center";
  inimigo.style.backgroundRepeat = "no-repeat";
  inimigo.style.backgroundSize = "contain";
  inimigo.style.left = Math.floor(Math.random() * (larguraCenario - 100)) + "px";
  inimigo.style.top = "-100px";
  cenario.appendChild(inimigo);
}



const moveNaveInimigas = () => {
  const navaInimigas = document.querySelectorAll(".inimigo");
  for (let i = 0; i < navaInimigas.length; i++) {
    if (navaInimigas[i]) {
      let posicaoTopNaveInimiga = navaInimigas[i].offsetTop;
      // Define a velocidade com base na classe da nave
      let velocidadeAtual = navaInimigas[i].classList.contains('rapida') ? velocidadeNaveInimigasRapida : velocidadeNaveInimigas;
      posicaoTopNaveInimiga += velocidadeAtual;
      navaInimigas[i].style.top = posicaoTopNaveInimiga + "px";

      if (posicaoTopNaveInimiga > alturaCenario) {
        // Se a nave inimiga passar pela tela, verificar se é do tipo rápido
        if (!navaInimigas[i].classList.contains('rapida')) {
          vidaAtual -= 1;  // Reduz a vida somente se não for uma nave rápida
          vida.textContent = `Vida: ${vidaAtual}`;
        }
        explosaoNaveInimigaDestruida(navaInimigas[i].offsetLeft);
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
      if (
        colisaoNaveInimiga.left < colisaoTiro.right &&
        colisaoNaveInimiga.right > colisaoTiro.left &&
        colisaoNaveInimiga.top < colisaoTiro.bottom &&
        colisaoNaveInimiga.bottom > colisaoTiro.top
      ) {
        let vidaAtualNaveInimiga = parseInt(naveInimiga.getAttribute("data-vida"));
        vidaAtualNaveInimiga--;
        tiro.remove();
        if (vidaAtualNaveInimiga === 0) {
          // Captura as posições antes de remover a nave
          const posicaoLeftNaveInimiga = naveInimiga.offsetLeft;
          const posicaoTopNaveInimiga = naveInimiga.offsetTop;
          const pontosPorNave = naveInimiga.classList.contains('rapida') ? 100 : 10;
          pontosAtual += pontosPorNave;
          pontos.textContent = `Pontos: ${pontosAtual}`;
          naveInimiga.remove();  // Remove a nave inimiga do DOM
          naveInimigaDestruida(posicaoLeftNaveInimiga, posicaoTopNaveInimiga);  // Chama a função de destruição passando as posições
        } else {
          naveInimiga.setAttribute("data-vida", vidaAtualNaveInimiga);
        }
      }
    });
  });
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
    // Limpar todos os intervalos para evitar duplicações
    clearInterval(checaMoveNave);
    clearInterval(checaMoveTiros);
    clearInterval(checaMoveNaveInimigas);
    clearInterval(checaNaveInimigas);
    clearInterval(checaNaveInimigasRapidas);
    clearInterval(checaColisao);
    clearInterval(checaTiros);
    document.getElementById('botaoPausa').style.display = 'block';
  }
}


function despausarJogo() {
  if (jogoPausado) {
    jogoPausado = false;
    // Reiniciar os intervalos apenas uma vez para garantir que não haja duplicação
    checaMoveNave = setInterval(moveNave, 5);
    checaMoveTiros = setInterval(moveTiros, 50);
    checaMoveNaveInimigas = setInterval(moveNaveInimigas, 50);
    checaNaveInimigas = setInterval(naveInimigas, 1000);
    checaNaveInimigasRapidas = setInterval(naveInimigaRapida, 15000);
    checaColisao = setInterval(colisao, 10);
    checaTiros = setInterval(atirar, 10);
    document.getElementById('botaoPausa').style.display = 'none';
  }
}



const gameOver = () => {
  document.removeEventListener("keydown", teclaPressionada);
  document.removeEventListener("keyup", teclaSolta);
  clearInterval(checaMoveNaveInimigas);
  clearInterval(checaNaveInimigas);
  clearInterval(checaNaveInimigasRapidas);
  clearInterval(checaMoveTiros);
  clearInterval(checaMoveNave);
  clearInterval(checaColisao);

  const buttonsContainer = document.createElement("div");
  buttonsContainer.style.position = "absolute";
  buttonsContainer.style.left = "50%";
  buttonsContainer.style.top = "50%";
  buttonsContainer.style.transform = "translate(-50%, -50%)";
  buttonsContainer.style.display = "flex";
  buttonsContainer.style.flexDirection = "column";
  buttonsContainer.style.alignItems = "center";
  cenario.appendChild(buttonsContainer);

  const perdeu = document.createElement("button");
  perdeu.id = "gameOverButton";
  perdeu.className = "btn-menu";
  perdeu.innerHTML = "Game Over";
  perdeu.style.margin = "10px"; // Espaço entre os botões
  buttonsContainer.appendChild(perdeu);
  perdeu.onclick = sairDoJogo;

  botaoIniciar.innerHTML = "Tentar Novamente";
  botaoIniciar.style.display = "block";
  botaoIniciar.style.margin = "10px"; // Espaço entre os botões
  buttonsContainer.appendChild(botaoIniciar);

  cenario.style.animation = "none";
  const navesInimigas = document.querySelectorAll(".inimigo");
  navesInimigas.forEach(inimigo => inimigo.remove());
  const todosTiros = document.querySelectorAll(".tiro");
  todosTiros.forEach(tiro => cenario.removeChild(tiro));
}



function abrirModalEscolhaNave() {
  document.getElementById("modalEscolhaNave").style.display = "block";
}

function fecharModalEscolhaNave() {
  document.getElementById("modalEscolhaNave").style.display = "none";
}

function abrirModalEscolhaFase() {
  document.getElementById("modalEscolhaFase").style.display = "block";
}

function fecharModalEscolhaFase() {
  document.getElementById("modalEscolhaFase").style.display = "none";
}

function abrirModalInimigos() {
  document.getElementById("modalInimigos").style.display = "block";
}

function fecharModalInimigos() {
  document.getElementById("modalInimigos").style.display = "none";
}





function selecionarNaveBranca() {
  NaveEscolha.style.backgroundImage = "url('/imagens/nave_branca.png')";
}

function selecionarNaveVerde() {
  NaveEscolha.style.backgroundImage = "url('/imagens/nave_verde.png')";
}

function selecionarNaveAzul() {
  NaveEscolha.style.backgroundImage = "url('/imagens/nave_azul.png')";
}





function selecionarFaseSpac1() {
  const videoSource = document.getElementById('fundo'); // Certifique-se de que o ID 'fundo' está no <source> dentro do seu <video>
  videoSource.src = '/videos/spac1.mp4';
  document.getElementById('video-fundo').load(); // Para recarregar o vídeo
}

function selecionarFaseSpac2() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac2.mp4';
  document.getElementById('video-fundo').load();
}

function selecionarFaseSpac3() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac3.mp4';
  document.getElementById('video-fundo').load();
}
function selecionarFaseSpac4() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac4.mp4';
  document.getElementById('video-fundo').load();
}
function selecionarFaseSpac5() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac5.mp4';
  document.getElementById('video-fundo').load();
}
function selecionarFaseSpac6() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac6.mp4';
  document.getElementById('video-fundo').load();
}
function selecionarFaseSpac7() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac7.mp4';
  document.getElementById('video-fundo').load();
}
function selecionarFaseSpac8() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac8.mp4';
  document.getElementById('video-fundo').load();
}
function selecionarFaseSpac9() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac9.mp4';
  document.getElementById('video-fundo').load();
}
function selecionarFaseSpac10() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac10.mp4';
  document.getElementById('video-fundo').load();
}
function selecionarFaseSpac11() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac11.mp4';
  document.getElementById('video-fundo').load();
}
function selecionarFaseSpac12() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac12.mp4';
  document.getElementById('video-fundo').load();
}




document.addEventListener('DOMContentLoaded', function() {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip-text';
  tooltip.innerHTML = '<div class="title"></div><div class="description"></div>';
  document.body.appendChild(tooltip);

  const fases = document.querySelectorAll('.fases, .naves, .naves_inimigas');
  fases.forEach(function(fase) {
    fase.addEventListener('mousemove', function(e) {
      const title = fase.getAttribute('data-title');
      const description = fase.getAttribute('data-description');
      if (title || description) {
        tooltip.querySelector('.title').textContent = title;
        tooltip.querySelector('.description').textContent = description;
        tooltip.style.left = (e.pageX + 15) + 'px';  // Slight offset from the cursor
        tooltip.style.top = (e.pageY + 15) + 'px';
        tooltip.style.opacity = 1;
      }
    });

    fase.addEventListener('mouseout', function() {
      tooltip.style.opacity = 0;
    });
  });
});


function sairDoJogo() {
  window.location.href = './sair.html';
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
  vida.textContent = `Vida: 10`;
  pontos.textContent = `Pontos: 0`;
  vidaAtual = vidaInicial;
  pontosAtual = pontosIniciais;
  
  checaMoveNave = setInterval(moveNave, 5);
  checaMoveTiros = setInterval(moveTiros, 50);
  checaMoveNaveInimigas = setInterval(moveNaveInimigas, 50);
  checaNaveInimigas = setInterval(naveInimigas, 1000);
  checaNaveInimigasRapidas = setInterval(naveInimigaRapida, 15000);  // Agora chamando corretamente
  checaColisao = setInterval(colisao, 10);
  checaTiros = setInterval(atirar, 10);
  botaoIniciar.style.display = "none";
  botaoSobre.style.display = "none";
  botaoSair.style.display = "none";
  botaoEscolhaFase.style.display = "none";
  botaoEscolhaNave.style.display = "none";
  botaoDificuldade.style.display = "none";
  botaoInimigo.style.display = "none";
  cenario.style.animation = "animarCenario 10s infinite linear";
  audioJogo.loop = true;
  audioJogo.play();
  // Remover o botão "Game Over" se ele existir no DOM
  const perdeu = document.getElementById("gameOverButton");
  if (perdeu) {
    perdeu.remove();
  }
}

