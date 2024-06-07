
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