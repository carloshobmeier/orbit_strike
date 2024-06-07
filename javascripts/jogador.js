

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

