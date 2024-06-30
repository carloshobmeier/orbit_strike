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
const audioJogo = new Audio("../audios/despair_metal.mp3");
const audioMenu = new Audio("../audios/MENUpowerful-gym-rock.mp3");
const audioOver = new Audio("../audios/game_over.mp3");
const audioSelecionado = new Audio("../audios/selecionado.mp3");

const NaveEscolha = document.getElementById("nave")
const FaseEscolha = document.getElementById("fundo")


const larguraCenario = cenario.offsetWidth;
const alturaCenario = cenario.offsetHeight;

const larguraNave = nave.offsetWidth;
const alturaCeNave = nave.offsetHeight;

const velocidadeNave = 2;
const velocidadeTiro = 25;
const velocidadeNaveInimigas = 2.5;
const velocidadeChefe1 = 1;
const velocidadeChefe2 = 0.5;
const velocidadeNaveInimigasRapida = 4;

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
let checaChefe;
let checaMoveTiros;
let checaMoveNave;
let checaColisao;
let checaTiros;

let posicaoHorizontal = larguraCenario / 2 - 50;
let posicaoVertical = alturaCenario - alturaCeNave;
let direcaoHorizontal = 0;
let direcaoVertical = 0;


let intervaloCriarNaveVida;
let intervaloChecarColisaoItemVida;


const atualizarPontos = (pontos) => {
  pontos.textContent = `Pontos: ${pontosAtual.toLocaleString()}`;
}


document.addEventListener('DOMContentLoaded', function() {
  var audio = new Audio('../audios/botao.mp3');

  var buttons = document.querySelectorAll('.btn-menu');
  buttons.forEach(function(button) {
      button.addEventListener('mouseover', function() {
          audio.play();
      });

      button.addEventListener('mouseout', function() {
          audio.pause();
          audio.currentTime = 0;
      });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var audio2 = new Audio('../audios/pick-up.mp3');

  var buttons = document.querySelectorAll('.tips');
  buttons.forEach(function(button) {
      button.addEventListener('mouseover', function() {
          audio2.play();
      });

      button.addEventListener('mouseout', function() {
          audio2.pause();
          audio2.currentTime = 0;
      });
  });
});



function sairDoJogo() {
  window.location.href = '../sair.html';
}

function startAudio() {
  audioMenu.loop = true;
  audioMenu.play();
}


document.addEventListener('DOMContentLoaded', function() {
  var tecladoImg = document.getElementById('teclado');
  var audio3 = new Audio('../audios/pick-up.mp3');

  tecladoImg.addEventListener('mouseover', function() {
      this.src = '../imagens/teclado_marcado.png';
      audio3.play();
      });
      
      tecladoImg.addEventListener('mouseout', function() {
        this.src = '../imagens/teclado.png';
        audio3.play();

  });
});


function changeImage() {
  document.getElementById('poder').src = '../imagens/pod_poder_mini_breve.png';
}

function revertImage() {
  document.getElementById('poder').src = '../imagens/pod_poder_mini.png';
}


