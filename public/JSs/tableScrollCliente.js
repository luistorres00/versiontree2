// Sistema de gerenciamento de scroll para a página do cliente
let lastKnownScrollPosition = 0;
let ticking = false;

document.addEventListener("DOMContentLoaded", function () {
    const tabela = document.getElementById('tabela');
    const thead = tabela.querySelector('thead');
    const contentTop = document.getElementById('content-top');
    const tableContainer = document.querySelector('.table-container');
    
    // Verificar se há uma posição de scroll salva
    var posicaoScrollVertical = localStorage.getItem("posicaoScrollVerticalCliente");
    var posicaoScrollHorizontal = localStorage.getItem("posicaoScrollHorizontalCliente");
    
    if (posicaoScrollVertical) {
        setTimeout(() => {
            tableContainer.scrollTop = parseInt(posicaoScrollVertical);
        }, 100);
    }
    
    if (posicaoScrollHorizontal) {
        setTimeout(() => {
            tableContainer.scrollLeft = parseInt(posicaoScrollHorizontal);
        }, 100);
    }
    
    function adjustTableScroll() {
        const contentTopHeight = contentTop.offsetHeight;
        const contentTopPadding = parseInt(window.getComputedStyle(contentTop).padding);
        const totalTopOffset = contentTopHeight + contentTopPadding;
        
        // Ajusta a posição do container da tabela
        tableContainer.style.top = totalTopOffset + 'px';
        tableContainer.style.height = `calc(100vh - ${totalTopOffset + 20}px)`;
    }

    // Observar o scroll da tabela
    tableContainer.addEventListener('scroll', function() {
        localStorage.setItem("posicaoScrollVerticalCliente", tableContainer.scrollTop);
        localStorage.setItem("posicaoScrollHorizontalCliente", tableContainer.scrollLeft);
    });

    // Ajusta quando a janela é redimensionada
    window.addEventListener('resize', adjustTableScroll);
    
    // Ajusta inicialmente
    adjustTableScroll();
});

// Antes de recarregar a página, salvar as posições do scroll
window.addEventListener('beforeunload', function() {
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
        localStorage.setItem("posicaoScrollVerticalCliente", tableContainer.scrollTop);
        localStorage.setItem("posicaoScrollHorizontalCliente", tableContainer.scrollLeft);
    }
});
