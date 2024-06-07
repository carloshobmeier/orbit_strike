
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