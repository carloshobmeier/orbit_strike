
const Chefe = () => {
const chefe = document.createElement("div");
chefe.className = "chefe";
chefe.style.position = "absolute";
chefe.setAttribute("data-vida", 25);
chefe.style.width = "200px";
chefe.style.height = "200px";

// Caminhos das imagens para o chefão
const imagensChefao = ["../imagens/chefao_vermelho.png", "../imagens/chefao_branco.png"];
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
inimigo.style.backgroundImage = "url(./imagens/nave_preta.png)";
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
inimigo.style.backgroundImage = "url(../imagens/nave_amarela.png)";
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
naveInimigaDestruida.style.backgroundImage = "url(../imagens/eliminado.gif)";
naveInimigaDestruida.style.backgroundPosition = "center";
naveInimigaDestruida.style.backgroundRepeat = "no-repeat";
naveInimigaDestruida.style.backgroundSize = "contain";
naveInimigaDestruida.style.left = posicaoLeftNaveInimiga + "px";
naveInimigaDestruida.style.top = posicaoTopNaveInimiga + "px";
cenario.appendChild(naveInimigaDestruida);

// Tocar áudio específico para chefes
const audioFile = isChefe ? "../audios/destruido_chefao.mp3" : "../audios/destruido.mp3";
audioExplosoes(audioFile);

setTimeout(() => { cenario.removeChild(naveInimigaDestruida); }, 1000);
}

const explosaoNaveInimigaDestruida = (posicaoLeftNaveInimiga) => {
const explosaoNaveInimiga = document.createElement("div");
explosaoNaveInimiga.className = "explosaonaveinimiga";
explosaoNaveInimiga.style.position = "absolute";
explosaoNaveInimiga.style.width = "100px";
explosaoNaveInimiga.style.height = "100px";
explosaoNaveInimiga.style.backgroundImage = "url(../imagens/passou.gif)";
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
audioPassouNaveInimiga.setAttribute("src", "../audios/erro.mp3");
audioPassouNaveInimiga.play();
cenario.appendChild(audioPassouNaveInimiga);
audioPassouNaveInimiga.addEventListener("ended", () => {
    audioPassouNaveInimiga.remove();
})
}

