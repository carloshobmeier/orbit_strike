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