// ============================================================
// public/js/agendamentos.js
// ============================================================
// ESTE ARQUIVO É COM VOCÊ (ALUNO DESENVOLVE).
//
// Requisitos envolvidos: RF-19 (listar ordenado, com dados de
// tutor e pet) e RF-20 (atualizar data de um agendamento).
//
// Sugestão de estrutura por linha da tabela: cada linha mostra
// os dados do agendamento, e na coluna "Ações" um campo de data
// (input type="date", já preenchido com a data atual do
// agendamento) mais um botão "Salvar" - ao clicar, atualiza
// aquele agendamento. Isso evita precisar de modal/popup.
//
// EXEMPLOS DE APOIO (pasta exemplos/):
//   - exemplo-montar-tela.js : desenhar a tabela e formatar datas
//   - exemplo-fetch.js       : GET, PUT e os demais tipos de fetch
// ============================================================

const corpoTabela = document.getElementById('corpo-tabela-agendamentos');
const tabela = document.getElementById('tabela-agendamentos');
const mensagemAgendamentos = document.getElementById('mensagem-agendamentos');

inicializar();

async function inicializar() {
    await carregarAgendamentos();
}

// ------------------------------------------------------------
// RF-19: listar agendamentos ordenados por data, com dados de
// pet e tutor (join)
// ------------------------------------------------------------
async function carregarAgendamentos() {
    try {
        // TODO: fetch GET /api/agendamentos
        // Trate resposta.status === 401 (redirecionar para /login.html)
        // Pegue o JSON e chame renderizarAgendamentos(agendamentos)

        const resposta = await fetch('/api/agendamentos');

        if (resposta.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        if (!resposta.ok) {
            throw new Error('Erro ao buscar agendamentos.');
        }

        const agendamentos = await resposta.json();

        renderizarAgendamentos(agendamentos);

    } catch (erro) {
        mensagemAgendamentos.textContent = 'Erro ao carregar agendamentos.';
        mensagemAgendamentos.classList.remove('d-none');
        tabela.classList.add('d-none');
        console.error(erro);
    }
}

function renderizarAgendamentos(agendamentos) {
    // TODO: se a lista estiver vazia, mantenha a mensagem visível
    // e a tabela escondida (classe d-none)

    if (agendamentos.length === 0) {
        mensagemAgendamentos.textContent = 'Nenhum agendamento encontrado.';
        mensagemAgendamentos.classList.remove('d-none');
        tabela.classList.add('d-none');
        corpoTabela.innerHTML = '';
        return;
    }

    // TODO: caso contrário, esconda a mensagem, mostre a tabela, e
    // monte uma linha <tr> para cada agendamento dentro de
    // corpoTabela.innerHTML, com as colunas: data, nome do pet,
    // espécie, nome do tutor, telefone do tutor, observação, e uma
    // célula de ação contendo:
    //   <input type="date" value="DATA NO FORMATO AAAA-MM-DD" data-id="${agendamento.id}">
    // ATENÇÃO: a data chega do banco como "2026-09-20T03:00:00.000Z", e o
    // <input type="date"> só aceita "2026-09-20". Veja o item F de
    // exemplos/exemplo-montar-tela.js antes de preencher o value.
    //   <button data-id="${agendamento.id}">Salvar</button>
    //
    // Depois de montar o innerHTML, adicione os addEventListener
    // nos botões "Salvar" recém-criados (eles não existem até esse
    // innerHTML ser inserido).

    mensagemAgendamentos.classList.add('d-none');
    tabela.classList.remove('d-none');

    corpoTabela.innerHTML = agendamentos.map(agendamento => {
        const data = agendamento.data_agendamento
            ? new Date(agendamento.data_agendamento).toISOString().split('T')[0]
            : '';

        const dataFormatada = data
            ? data.split('-').reverse().join('/')
            : '';

        return `
            <tr>
                <td>${dataFormatada}</td>
                <td>${agendamento.nome_pet || ''}</td>
                <td>${agendamento.especie || ''}</td>
                <td>${agendamento.nome_tutor || ''}</td>
                <td>${agendamento.telefone_tutor || ''}</td>
                <td>${agendamento.observacao || ''}</td>
                <td>
                    <input
                        type="date"
                        value="${data}"
                        data-id="${agendamento.id}"
                        class="data-agendamento"
                    >
                    <button
                        type="button"
                        class="btn-salvar"
                        data-id="${agendamento.id}"
                    >
                        Salvar
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    corpoTabela.querySelectorAll('.btn-salvar').forEach(botao => {
        botao.addEventListener('click', () => {
            const id = botao.dataset.id;

            const campoData = corpoTabela.querySelector(
                `.data-agendamento[data-id="${id}"]`
            );

            const novaData = campoData.value;

            if (!novaData) {
                alert('Selecione uma data.');
                return;
            }

            atualizarDataAgendamento(id, novaData);
        });
    });
}

// ------------------------------------------------------------
// RF-20: atualizar a data de um agendamento
// Chamada pelos botões "Salvar" criados em renderizarAgendamentos()
// ------------------------------------------------------------
async function atualizarDataAgendamento(id, novaData) {
    try {
        // TODO: fetch PUT /api/agendamentos/{id}, enviando
        // { data_agendamento: novaData } como JSON no body.
        // Confira resposta.ok e avise o usuário (alert ou mensagem)
        // se deu certo ou não.

        const resposta = await fetch(`/api/agendamentos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data_agendamento: novaData
            })
        });

        if (resposta.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        if (!resposta.ok) {
            const dados = await resposta.json().catch(() => ({}));
            throw new Error(
                dados.erro || 'Não foi possível atualizar a data.'
            );
        }

        alert('Data do agendamento atualizada com sucesso.');

        await carregarAgendamentos();

    } catch (erro) {
        alert(erro.message || 'Erro ao atualizar data do agendamento.');
        console.error(erro);
    }
}
