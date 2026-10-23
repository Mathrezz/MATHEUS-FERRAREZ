 // ============================================================
 // public/js/principal.js
 // ============================================================
 // ESTE ARQUIVO É COM VOCÊ (ALUNO DESENVOLVE).
 //
 // O que falta aqui:
 //   - RF-09: recuperar o nome do usuário autenticado e exibir
 //     no elemento #nome-usuario
 //   - RF-10: implementar o logout no botão #btn-sair
 //
 // A navegação para Tutores, Pets e Agendamentos (RF-11) já está
 // pronta no HTML (são apenas links <a>), vocês não precisam
 // mexer nisso.
 // ============================================================

 const nomeUsuarioEl = document.getElementById('nome-usuario');
 const btnSair = document.getElementById('btn-sair');
 
 inicializar();
 
 async function inicializar() {
     await carregarUsuarioLogado();
 }
 
 async function carregarUsuarioLogado() {
     try {
         const resposta = await fetch('/api/auth/sessao');
 
         if (resposta.status === 401) {
             // sessão expirada ou usuário nunca logou
             window.location.href = '/login.html';
             return;
         }
 
         if (!resposta.ok) {
             throw new Error('Erro ao consultar a sessão: ' + resposta.status);
         }
 
         const dados = await resposta.json();
 
         // Suponha que "dados" seja { usuario: { nome: "Fulano" } }
         // Para exibir isso num elemento HTML (ex: <span id="nome-usuario">):
 
         nomeUsuarioEl.textContent = dados.usuario.nome;
 
     } catch (erro) {
         console.error('Erro ao buscar dado da sessão:', erro);
     }
 }
 
 // TODO (RF-09): usar dados.usuario.nome para preencher o
 // conteúdo de nomeUsuarioEl (ex: nomeUsuarioEl.textContent = ...)
 
btnSair.addEventListener('click', async () => {
    try {
        const resposta = await fetch('/api/auth/logout', {
            method: 'POST'
        });

        if (!resposta.ok) {
            throw new Error('Erro ao encerrar a sessão.');
        }
        window.location.href = '/login.html';

    } catch (erro) {
        console.error('Erro ao tentar sair:', erro);
    }

    // TODO (RF-10): chamar a rota POST /api/auth/logout via fetch,
    // e depois redirecionar o usuário para /login.html
    // Dica: veja exemplos/exemplo-logout.js
});
