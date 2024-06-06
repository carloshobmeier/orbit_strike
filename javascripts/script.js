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
const audioMenu = new Audio("/audios/MENUpowerful-gym-rock.mp3");
const audioOver = new Audio("/audios/game_over.mp3");
const audioSelecionado = new Audio("/audios/selecionado.mp3");

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
  var audio = new Audio('/audios/botao.mp3');

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
  var audio2 = new Audio('/audios/pick-up.mp3');

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

const audioColisao = () => {
  const audioDaColisao = document.createElement("audio");
  audioDaColisao.className = "audio_colisao";
  audioDaColisao.setAttribute("src", "/audios/lataria.mp3");
  audioDaColisao.play();
  cenario.appendChild(audioDaColisao);
  audioDaColisao.addEventListener("ended", () => {
    audioDaColisao.remove();
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

const Chefe = () => {
  const chefe = document.createElement("div");
  chefe.className = "chefe";
  chefe.style.position = "absolute";
  chefe.setAttribute("data-vida", 25);
  chefe.style.width = "200px";
  chefe.style.height = "200px";

  // Caminhos das imagens para o chefão
  const imagensChefao = ["/imagens/chefao_vermelho.png", "/imagens/chefao_branco.png"];
  // Escolha aleatória entre as duas imagens
  const imagemEscolhida = imagensChefao[Math.floor(Math.random() * imagensChefao.length)];

  chefe.style.backgroundImage = `url(${imagemEscolhida})`;
  chefe.style.backgroundPosition = "center";
  chefe.style.backgroundRepeat = "no-repeat";
  chefe.style.backgroundSize = "contain";
  chefe.style.top = "-200px";
  chefe.style.left = Math.floor(Math.random() * (larguraCenario - 200)) + "px";
  cenario.appendChild(chefe);
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
  const navaInimigas = document.querySelectorAll(".inimigo, .chefe");
  for (let i = 0; i < navaInimigas.length; i++) {
    let nave = navaInimigas[i];
    let posicaoTopNaveInimiga = nave.offsetTop;

    // Define a velocidade com base na classe da nave
    let velocidadeAtual = nave.classList.contains('rapida') ? velocidadeNaveInimigasRapida : 
                          nave.classList.contains('chefe') ? velocidadeChefe1 : velocidadeNaveInimigas;

    posicaoTopNaveInimiga += velocidadeAtual;
    nave.style.top = posicaoTopNaveInimiga + "px";

    if (posicaoTopNaveInimiga > alturaCenario) {
      if (!nave.classList.contains('rapida')) {
        // Reduz a vida apenas para naves normais e chefes
        vidaAtual -= nave.classList.contains('chefe') ? 3 : 1;
        vida.textContent = `Vida: ${vidaAtual}`;
      }

      // Chama as funções de efeito visual e sonoro para todas as naves
      explosaoNaveInimigaDestruida(nave.offsetLeft);
      audioPassou();

      nave.remove();  // Remove a nave do DOM

      if (vidaAtual <= 0) {
        gameOver();
      }
    }
  }
}


const colisao = () => {
  const todasNavesInimigas = document.querySelectorAll(".inimigo, .chefe");
  const todosTiros = document.querySelectorAll(".tiro");
  const todasNavesVida = document.querySelectorAll(".nave-vida"); // Seleciona também as naves de vida

  todasNavesInimigas.forEach(naveInimiga => {
    todosTiros.forEach(tiro => {
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
        audioColisao();
        tiro.remove();

        if (vidaAtualNaveInimiga <= 0) {
          const posicaoLeftNaveInimiga = naveInimiga.offsetLeft;
          const posicaoTopNaveInimiga = naveInimiga.offsetTop;
          const pontosPorNave = naveInimiga.classList.contains('chefe') ? 500 :
                                naveInimiga.classList.contains('rapida') ? 100 : 10;
          pontosAtual += pontosPorNave;
          atualizarPontos(pontos);
          
          const isChefe = naveInimiga.classList.contains('chefe');
          naveInimigaDestruida(posicaoLeftNaveInimiga, posicaoTopNaveInimiga, isChefe);
          naveInimiga.remove();
        } else {
          naveInimiga.setAttribute("data-vida", vidaAtualNaveInimiga);
        }
      }
    });
  });

  // Colisão com a nave de vida
  todasNavesVida.forEach(naveVida => {
    todosTiros.forEach(tiro => {
      const colisaoNaveVida = naveVida.getBoundingClientRect();
      const colisaoTiro = tiro.getBoundingClientRect();
      if (
        colisaoNaveVida.left < colisaoTiro.right &&
        colisaoNaveVida.right > colisaoTiro.left &&
        colisaoNaveVida.top < colisaoTiro.bottom &&
        colisaoNaveVida.bottom > colisaoTiro.top
      ) {
        tiro.remove();  // Remove o tiro
        destruirNaveVida(naveVida);  // Trata a colisão com a nave de vida
      }
    });
  });
}




const naveInimigaDestruida = (posicaoLeftNaveInimiga, posicaoTopNaveInimiga, isChefe) => {
  const naveInimigaDestruida = document.createElement("div");
  naveInimigaDestruida.className = "naveinimigadestruida";
  naveInimigaDestruida.style.position = "absolute";
  naveInimigaDestruida.style.width = isChefe ? "200px" : "100px"; // Dobro do tamanho para chefes
  naveInimigaDestruida.style.height = isChefe ? "200px" : "100px"; // Dobro do tamanho para chefes
  naveInimigaDestruida.style.backgroundImage = "url(/imagens/eliminado.gif)";
  naveInimigaDestruida.style.backgroundPosition = "center";
  naveInimigaDestruida.style.backgroundRepeat = "no-repeat";
  naveInimigaDestruida.style.backgroundSize = "contain";
  naveInimigaDestruida.style.left = posicaoLeftNaveInimiga + "px";
  naveInimigaDestruida.style.top = posicaoTopNaveInimiga + "px";
  cenario.appendChild(naveInimigaDestruida);

  // Tocar áudio específico para chefes
  const audioFile = isChefe ? "/audios/destruido_chefao.mp3" : "/audios/destruido.mp3";
  audioExplosoes(audioFile);

  setTimeout(() => { cenario.removeChild(naveInimigaDestruida); }, 1000);
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

const audioExplosoes = (audioSrc) => {
  const audioExplosaoNaveInimiga = new Audio(audioSrc);
  audioExplosaoNaveInimiga.play();
  cenario.appendChild(audioExplosaoNaveInimiga);
  audioExplosaoNaveInimiga.addEventListener("ended", () => {
    audioExplosaoNaveInimiga.remove();
  });
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



const criarNaveVida = () => {
  const naveVida = document.createElement('div');
  naveVida.className = 'nave-vida';
  naveVida.style.position = 'absolute';
  naveVida.style.width = '100px';
  naveVida.style.height = '100px';
  naveVida.style.backgroundImage = "url('/imagens/pod_vida.png')";
  naveVida.style.backgroundSize = 'cover';
  naveVida.style.left = '0px';
  naveVida.style.top = '20px'; // Posiciona no topo do cenário
  cenario.appendChild(naveVida);
  moverNaveVida(naveVida);
}

const intervalosMovimentoNavesVida = [];
const intervalosMovimentoItensVida = [];

const moverNaveVida = (naveVida) => {
  let direcao = 1; // Define a direção inicial para a direita
  const velocidadeNaveVida = 1; // Velocidade de movimento horizontal da nave de vida

  const intervaloMovimento = setInterval(() => {
    // Converte a posição atual de left de px para número
    let posicaoAtual = parseInt(naveVida.style.left, 10);

    // Verifica se a nave atingiu os limites laterais da tela
    if (posicaoAtual >= (larguraCenario - parseInt(naveVida.style.width, 10)) && direcao > 0) {
      direcao = -1; // Muda a direção para a esquerda
    } else if (posicaoAtual <= 0 && direcao < 0) {
      direcao = 1; // Muda a direção para a direita
    }

    // Atualiza a posição horizontal da nave
    naveVida.style.left = `${posicaoAtual + velocidadeNaveVida * direcao}px`;
  }, 20);

  // Guarda o intervalo para poder limpar depois
  naveVida.dataset.intervalo = intervaloMovimento;
  intervalosMovimentoNavesVida.push(intervaloMovimento); // Armazena o intervalo
}

const moverItemVida = (itemVida) => {
  const intervaloItem = setInterval(() => {
    let posicaoTopAtual = parseInt(itemVida.style.top, 10);
    posicaoTopAtual += 3; // Move para baixo
    itemVida.style.top = `${posicaoTopAtual}px`;
    if (posicaoTopAtual > alturaCenario) {
      clearInterval(intervaloItem);
      itemVida.remove(); // Remove o item se ele sair da tela
    }
  }, 30);

  // Guarda o intervalo para poder limpar depois
  itemVida.dataset.intervalo = intervaloItem;
  intervalosMovimentoItensVida.push(intervaloItem); // Armazena o intervalo
}



const destruirNaveVida = (naveVida) => {
  clearInterval(naveVida.dataset.intervalo); // Para o movimento

  const posicaoHorizontal = parseInt(naveVida.style.left, 10);
  const posicaoTop = parseInt(naveVida.style.top, 10);

  const larguraNaveVida = 100;  // Largura da nave de vida
  const alturaNaveVida = 100;   // Altura da nave de vida
  const larguraExplosao = 50;  // Largura da explosão
  const alturaExplosao = 50;   // Altura da explosão

  const explosao = document.createElement('div');
  explosao.className = 'explosao';
  explosao.style.position = 'absolute';
  explosao.style.width = `${larguraExplosao}px`;
  explosao.style.height = `${alturaExplosao}px`;
  explosao.style.backgroundImage = "url('/imagens/eliminado.gif')";
  explosao.style.backgroundSize = 'cover';  // Garante que o background cubra todo o elemento
  explosao.style.left = `${posicaoHorizontal + (larguraNaveVida - larguraExplosao) / 2}px`;
  explosao.style.top = `${posicaoTop + (alturaNaveVida - alturaExplosao) / 2}px`;
  cenario.appendChild(explosao);

  setTimeout(() => {
    explosao.remove();
  }, 1000);  // Asumindo que a duração da animação é 1000ms

  naveVida.remove(); // Remove do DOM
  audioExplosoes("/audios/destruido_pod.mp3"); // Toca o som de destruição
  criarItemVida(`${posicaoHorizontal + (larguraNaveVida - 50) / 2}px`); // Centraliza o item de vida
}

const criarItemVida = (posicaoHorizontal) => {
  const itemVida = document.createElement('div');
  itemVida.className = 'item-vida';
  itemVida.style.position = 'absolute';
  itemVida.style.width = '50px';
  itemVida.style.height = '50px';
  itemVida.style.backgroundImage = "url('/imagens/vida1.png')";
  itemVida.style.left = posicaoHorizontal; // Usa a posição horizontal ajustada para centralizar
  itemVida.style.top = '30px'; // Posição inicial no topo onde o pod foi destruído
  cenario.appendChild(itemVida);
  moverItemVida(itemVida);
}


const checarColisaoItemVida = () => {
  const itensVida = document.querySelectorAll('.item-vida');
  itensVida.forEach(itemVida => {
    const rectItemVida = itemVida.getBoundingClientRect();
    const rectNave = nave.getBoundingClientRect();

    if (rectItemVida.left < rectNave.right &&
        rectItemVida.right > rectNave.left &&
        rectItemVida.top < rectNave.bottom &&
        rectItemVida.bottom > rectNave.top) {
      // Incrementa a vida do jogador
      vidaAtual += 1;
      vida.textContent = `Vida: ${vidaAtual}`;

      // Remove o item de vida do cenário
      const somVida = new Audio("/audios/vida.mp3");
      somVida.play();
      itemVida.remove();
    }
  });
}




const gameOver = () => {
  document.removeEventListener("keydown", teclaPressionada);
  document.removeEventListener("keyup", teclaSolta);
  clearInterval(checaMoveNaveInimigas);
  clearInterval(checaNaveInimigas);
  clearInterval(checaChefe);
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
  const navesInimigas = document.querySelectorAll(".inimigo, .chefe");
  navesInimigas.forEach(inimigo => inimigo.remove());
  const todosTiros = document.querySelectorAll(".tiro");
  todosTiros.forEach(tiro => cenario.removeChild(tiro));
  audioOver.play();
}



function abrirModalComandos() {
  document.getElementById("modalComandos").style.display = "block";
}

function fecharModalComandos() {
  document.getElementById("modalComandos").style.display = "none";
}

function abrirModalEscolhaNave() {
  document.getElementById("modalEscolhaNave").style.display = "block";
}

function fecharModalEscolhaNave() {
  document.getElementById("modalEscolhaNave").style.display = "none";
}
function abrirModalSobre() {
  document.getElementById("modalSobre").style.display = "block";
}

function fecharModalSobre() {
  document.getElementById("modalSobre").style.display = "none";
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
  audioSelecionado.play();
}

function selecionarNaveVerde() {
  NaveEscolha.style.backgroundImage = "url('/imagens/nave_verde.png')";
  audioSelecionado.play();
}

function selecionarNaveAzul() {
  NaveEscolha.style.backgroundImage = "url('/imagens/nave_azul.png')";
  audioSelecionado.play();
}





function selecionarFaseSpac1() {
  const videoSource = document.getElementById('fundo'); // Certifique-se de que o ID 'fundo' está no <source> dentro do seu <video>
  videoSource.src = '/videos/spac1.mp4';
  document.getElementById('video-fundo').load(); // Para recarregar o vídeo
  audioSelecionado.play();
}

function selecionarFaseSpac2() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac2.mp4';
  document.getElementById('video-fundo').load();
  audioSelecionado.play();
}

function selecionarFaseSpac3() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac3.mp4';
  document.getElementById('video-fundo').load();
  audioSelecionado.play();
}
function selecionarFaseSpac4() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac4.mp4';
  document.getElementById('video-fundo').load();
  audioSelecionado.play();
}
function selecionarFaseSpac5() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac5.mp4';
  document.getElementById('video-fundo').load();
  audioSelecionado.play();
}
function selecionarFaseSpac6() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac6.mp4';
  document.getElementById('video-fundo').load();
  audioSelecionado.play();
}
function selecionarFaseSpac7() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac7.mp4';
  document.getElementById('video-fundo').load();
  audioSelecionado.play();
}
function selecionarFaseSpac8() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac8.mp4';
  document.getElementById('video-fundo').load();
  audioSelecionado.play();
}
function selecionarFaseSpac9() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac9.mp4';
  document.getElementById('video-fundo').load();
  audioSelecionado.play();
}
function selecionarFaseSpac10() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac10.mp4';
  document.getElementById('video-fundo').load();
  audioSelecionado.play();
}
function selecionarFaseSpac11() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac11.mp4';
  document.getElementById('video-fundo').load();
  audioSelecionado.play();
}
function selecionarFaseSpac12() {
  const videoSource = document.getElementById('fundo');
  videoSource.src = '/videos/spac12.mp4';
  document.getElementById('video-fundo').load();
  audioSelecionado.play();
}




document.addEventListener('DOMContentLoaded', function() {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip-text';
  tooltip.innerHTML = '<div class="title"></div><div class="description"></div>';
  document.body.appendChild(tooltip);

  const fases = document.querySelectorAll('.fases, .naves, .naves_inimigas, .desenvolvedores');
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

function startAudio() {
  audioMenu.loop = true;
  audioMenu.play();
}


document.addEventListener('DOMContentLoaded', function() {
  var tecladoImg = document.getElementById('teclado');

  tecladoImg.addEventListener('mouseover', function() {
      this.src = './imagens/teclado_marcado.png';
  });

  tecladoImg.addEventListener('mouseout', function() {
      this.src = './imagens/teclado.png';
  });
});



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
  intervaloCriarNaveVida = setInterval(criarNaveVida, 50000); // Armazena o intervalo
  intervaloChecarColisaoItemVida = setInterval(checarColisaoItemVida, 50); // Checa a colisão a cada 50ms
  checaMoveNave = setInterval(moveNave, 5);
  checaMoveTiros = setInterval(moveTiros, 50);
  checaChefe = setInterval(Chefe, 30000);
  checaMoveNaveInimigas = setInterval(moveNaveInimigas, 50);
  checaNaveInimigas = setInterval(naveInimigas, 1000);
  checaNaveInimigasRapidas = setInterval(naveInimigaRapida, 15000);
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
  audioMenu.pause(); // Pausa a reprodução do áudio
  audioMenu.currentTime = 0; // Reinicia o áudio para o início
  audioJogo.loop = true;
  audioJogo.play();
  // Remover o botão "Game Over" se ele existir no DOM
  const perdeu = document.getElementById("gameOverButton");
  if (perdeu) {
    perdeu.remove();
  }
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
    clearInterval(checaChefe);
    clearInterval(checaColisao);
    clearInterval(checaTiros);
    clearInterval(intervaloCriarNaveVida); // Pausar criação de novas naves de vida
    clearInterval(intervaloChecarColisaoItemVida); // Pausar checagem de colisão dos itens de vida

    // Limpar os intervalos de movimento das naves de vida e dos itens de vida
    intervalosMovimentoNavesVida.forEach(intervalo => clearInterval(intervalo));
    intervalosMovimentoItensVida.forEach(intervalo => clearInterval(intervalo));

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
    checaChefe = setInterval(Chefe, 30000);
    checaNaveInimigasRapidas = setInterval(naveInimigaRapida, 15000);
    checaColisao = setInterval(colisao, 10);
    checaTiros = setInterval(atirar, 10);
    intervaloCriarNaveVida = setInterval(criarNaveVida, 50000); // Reiniciar a criação das naves de vida
    intervaloChecarColisaoItemVida = setInterval(checarColisaoItemVida, 50); // Reiniciar a checagem de colisão dos itens de vida

    // Reiniciar os intervalos de movimento das naves de vida e dos itens de vida
    const navesVida = document.querySelectorAll('.nave-vida');
    navesVida.forEach(naveVida => moverNaveVida(naveVida));
    const itensVida = document.querySelectorAll('.item-vida');
    itensVida.forEach(itemVida => moverItemVida(itemVida));

    document.getElementById('botaoPausa').style.display = 'none';
  }
}