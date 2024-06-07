

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
