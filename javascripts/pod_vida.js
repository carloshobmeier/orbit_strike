
const criarNaveVida = () => {
    const naveVida = document.createElement('div');
    naveVida.className = 'nave-vida';
    naveVida.style.position = 'absolute';
    naveVida.style.width = '100px';
    naveVida.style.height = '100px';
    naveVida.style.backgroundImage = "url('/imagens/pod_vida.png')";
    naveVida.style.backgroundSize = 'cover';
    naveVida.style.left = '0px';
    naveVida.style.top = '20px';
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


