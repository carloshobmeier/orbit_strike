
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
