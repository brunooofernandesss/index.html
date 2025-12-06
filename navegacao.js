document.addEventListener("DOMContentLoaded", function() {
    // 1. CRIA O BOTÃO HOME IMEDIATAMENTE (Não espera nada)
    const estilo = document.createElement('style');
    estilo.innerHTML = `
        .nav-float { 
            position: fixed; bottom: 20px; right: 20px; display: flex; gap: 10px; z-index: 99999; 
        }
        .btn-nav { 
            padding: 10px 15px; background: #4f46e5; color: white; text-decoration: none; 
            border-radius: 50px; font-family: sans-serif; font-weight: bold; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: 0.2s; font-size: 14px; 
            display: flex; align-items: center; border: 2px solid white;
        }
        .btn-nav:hover { background: #3730a3; transform: translateY(-2px); }
        .btn-home { background: #2c3e50; } 
        @media (max-width: 600px) { 
            .nav-float { bottom: 10px; right: 10px; left: 10px; justify-content: center; } 
            .btn-nav { flex: 1; justify-content: center; font-size: 13px; } 
        }
    `;
    document.head.appendChild(estilo);

    const container = document.createElement('div');
    container.className = 'nav-float';
    
    // Botão Home (Garantido)
    const btnHome = document.createElement('a');
    btnHome.href = "index.html";
    btnHome.className = 'btn-nav btn-home';
    btnHome.innerHTML = '🏠 Home';
    container.appendChild(btnHome);
    document.body.appendChild(container); // Coloca na tela AGORA

    // 2. DEPOIS tenta descobrir Próximo e Anterior
    const paginaHome = "index.html";
    const arquivoAtual = window.location.pathname.split("/").pop() || "index.html";
    
    // Se for a home, esconde o botão que acabamos de criar
    if(arquivoAtual === "index.html" || arquivoAtual === "") {
        container.style.display = 'none';
        return;
    }

    fetch(paginaHome)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = Array.from(doc.querySelectorAll('.card a')).map(a => a.getAttribute('href'));
            
            const atualLimpo = decodeURIComponent(arquivoAtual);
            const indexAtual = links.findIndex(link => decodeURIComponent(link) === atualLimpo);

            if (indexAtual !== -1) {
                // Adiciona Anterior (se tiver)
                if (indexAtual > 0) {
                    const btnAnt = document.createElement('a');
                    btnAnt.href = links[indexAtual - 1];
                    btnAnt.className = 'btn-nav';
                    btnAnt.innerHTML = '⬅️ Ant';
                    container.insertBefore(btnAnt, btnHome); // Coloca antes do Home
                }
                // Adiciona Próximo (se tiver)
                if (indexAtual < links.length - 1) {
                    const btnProx = document.createElement('a');
                    btnProx.href = links[indexAtual + 1];
                    btnProx.className = 'btn-nav';
                    btnProx.innerHTML = 'Prox ➡️';
                    container.appendChild(btnProx); // Coloca depois do Home
                }
            }
        })
        .catch(err => console.log("Erro ao buscar links:", err));
});
