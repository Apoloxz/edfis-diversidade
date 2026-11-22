const botoesAba = document.querySelectorAll('.aba-btn');
const secoes = document.querySelectorAll('.conteudo-aba');
const btnMobile = document.getElementById('btn-mobile');
const navMenu = document.getElementById('nav-menu');

// Função principal para trocar de aba
function abrirAba(idAlvo) {
    secoes.forEach(secao => secao.classList.remove('ativa'));

    botoesAba.forEach(btn => {
        btn.classList.remove('ativa');
        if (btn.getAttribute('data-alvo') === idAlvo) {
            btn.classList.add('ativa');
        }
    });

    const secaoAlvo = document.getElementById(idAlvo);
    if (secaoAlvo) {
        secaoAlvo.classList.add('ativa');
    }

    navMenu.classList.remove('aberto');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

botoesAba.forEach(botao => {
    botao.addEventListener('click', () => {
        const alvo = botao.getAttribute('data-alvo');
        abrirAba(alvo);
    });
});

btnMobile.addEventListener('click', () => {
    navMenu.classList.toggle('aberto');
});

// ==========================================
// INTELIGÊNCIA ARTIFICIAL 100% GRATUITA (EF)
// ==========================================
const formIa = document.getElementById('form-ia');
const inputPergunta = document.getElementById('pergunta-ia');
const chatMensagens = document.getElementById('chat-mensagens');
const btnEnviarIa = document.getElementById('btn-enviar-ia');

function usarSugestao(texto) {
    inputPergunta.value = texto;
    formIa.dispatchEvent(new Event('submit'));
}

function adicionarMensagem(texto, remetente) {
    const div = document.createElement('div');
    div.className = remetente === 'usuario' ? 'msg-usuario' : 'msg-ia';
    
    if (remetente === 'usuario') {
        div.textContent = texto;
    } else {
        div.innerHTML = `<strong>Assistente EF:</strong> ${texto}`;
    }
    
    chatMensagens.appendChild(div);
    chatMensagens.scrollTop = chatMensagens.scrollHeight;
    return div;
}

formIa.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pergunta = inputPergunta.value.trim();
    if (!pergunta) return;

    // Mostra a pergunta do usuário na tela
    adicionarMensagem(pergunta, 'usuario');
    inputPergunta.value = '';
    inputPergunta.disabled = true;
    btnEnviarIa.disabled = true;

    // Balão de carregamento
    const msgCarregando = adicionarMensagem('Pesquisando e formulando resposta sobre Educação Física...', 'ia');

    try {
        // Instrução para manter a IA focada no tema do site
        const contextoSistema = "Você é um professor especialista em Educação Física escolar, esportes adaptados, inclusão e diversidade (relações étnico-raciais, religião, gênero, deficiência física, visual, intelectual, auditiva e TEA). Responda em português de forma clara, didática, acolhedora e objetiva. Se o usuário perguntar algo fora de Educação Física, saúde, esportes ou inclusão escolar, redirecione gentilmente para esses temas.";

        const response = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: contextoSistema },
                    { role: 'user', content: pergunta }
                ],
                model: 'openai'
            })
        });

        if (!response.ok) {
            throw new Error('Falha na resposta da IA');
        }

        const respostaTexto = await response.text();
        msgCarregando.innerHTML = `<strong>Assistente EF:</strong> ${respostaTexto}`;

    } catch (erro) {
        msgCarregando.innerHTML = `<strong>Assistente EF:</strong> Não foi possível conectar ao servidor gratuito no momento. Verifique sua conexão com a internet e tente novamente em alguns segundos.`;
    } finally {
        inputPergunta.disabled = false;
        btnEnviarIa.disabled = false;
        inputPergunta.focus();
        chatMensagens.scrollTop = chatMensagens.scrollHeight;
    }
});