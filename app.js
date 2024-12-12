const frutas = ['MAÇÃ', 'PIMENTA', 'CAQUI', 'ABACAXI'];  // As frutas que vão nas sacolas
const outrasFrutas = ['ACEROLA', 'ARROZ', 'ABOBRINHA', 'CACAU', 'CAJU', 'CARAMBOLA', 'MACARRÃO', 'MANDIOCA', 'MARACUJÁ', 'PIPOCA', 'PIMENTÃO', 'PIRULITO'];  // As frutas que vão nas cartelas
let sacolas = [];
let jogadorAtual = 0;  // Índice do jogador que está jogando atualmente
let jogoEmAndamento = true;

document.getElementById('comecar-jogo').addEventListener('click', iniciarJogo);
document.getElementById('mostrar-regras').addEventListener('click', function() {
    document.getElementById('modal-regras').style.display = 'block';
});

// Alternar entre idiomas no modal de regras
document.getElementById('idioma-regras').addEventListener('change', function() {
    const idiomaSelecionado = this.value;
    document.querySelectorAll('.regras-texto').forEach(texto => {
        texto.style.display = texto.getAttribute('data-lang') === idiomaSelecionado ? 'block' : 'none';
    });
});

document.getElementById('anterior-jogador').addEventListener('click', () => {
    jogadorAtual = (jogadorAtual - 1 + sacolas.length) % sacolas.length;
    mostrarVezJogador();
});

document.getElementById('proximo-jogador').addEventListener('click', () => {
    jogadorAtual = (jogadorAtual + 1) % sacolas.length;
    mostrarVezJogador();
});

function iniciarJogo() {
    const numeroJogadores = parseInt(document.getElementById('numero-jogadores').value);
    if (numeroJogadores < 2 || numeroJogadores > 4) {
        alert("Por favor, insira um número de jogadores entre 2 e 4.");
        return;
    }

    const sacolasDiv = document.getElementById('sacolas');
    const cartoesDiv = document.getElementById('cartoes');
    const navegacaoJogadoresDiv = document.getElementById('navegacao-jogadores');

    sacolasDiv.innerHTML = '';
    cartoesDiv.innerHTML = '';
    sacolas = [];
    jogadorAtual = 0; // Reinicia o turno para o primeiro jogador
    jogoEmAndamento = true; // Reinicia o estado do jogo

    // Tornar a navegação entre jogadores visível
    navegacaoJogadoresDiv.style.display = 'flex';

    // Embaralhar as listas de frutas
    embaralharArray(frutas); // Embaralha as frutas que irão nas sacolas
    embaralharArray(outrasFrutas); // Embaralha as frutas para as cartelas

    // Criar sacolas e distribuir as frutas para os jogadores
    for (let i = 0; i < numeroJogadores; i++) {
        const fruta = frutas[i];  // A fruta das sacolas é escolhida da lista 'frutas'
        sacolas.push({ fruta, conteudo: [] });

        sacolasDiv.innerHTML += ` 
            <div class="sacola" id="sacola-${i}" data-fruta="${fruta}">
                <strong>${fruta}</strong>
                <div class="cesta-conteudo" id="cesta-${fruta}"></div>
            </div>`;
    }

    // Agora, cria as cartelas para os jogadores
    // Criar uma única lista com todas as 12 frutas
    const cartelas = [...outrasFrutas]; // Todos os 12 itens de outrasFrutas

    // Embaralha as cartelas
    embaralharArray(cartelas);

    // Gerar os cartões (cartelas)
    for (let i = 0; i < cartelas.length; i++) {
        const fruta = cartelas[i];
        cartoesDiv.innerHTML += `<div class="cartao" data-fruta="${fruta}">
                                    <div class="cartao-conteudo">
                                        <img src="img/${fruta}.png" alt="${fruta}" class="cartao-img fruta-imagem"/>
                                    </div>
                                  </div>`;
    }

    // Mostrar de quem é a vez
    mostrarVezJogador();

    // Adicionar eventos de clique aos cartões
    document.querySelectorAll('.cartao').forEach(cartao => {
        cartao.addEventListener('click', () => {
            if (jogoEmAndamento && jogadorAtual === sacolas.findIndex(s => s.fruta === sacolas[jogadorAtual].fruta)) {
                revelarCartao(cartao);
            }
        });
    });
}

// Fechar modal ao clicar no 'x' ou fora do modal
document.querySelector('.fechar').addEventListener('click', function() {
    document.getElementById('modal-regras').style.display = 'none';
});

window.onclick = function(event) {
    if (event.target === document.getElementById('modal-regras')) {
        document.getElementById('modal-regras').style.display = 'none';
    }
}

function embaralharArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function revelarCartao(cartaoElement) {
    const fruta = cartaoElement.getAttribute('data-fruta');
    cartaoElement.classList.add('revelado'); // Aplica o efeito de virada

    // Verificar se a fruta começa com a mesma letra da fruta da sacola do jogador atual
    const sacola = sacolas[jogadorAtual];
    if (sacola.fruta[0] === fruta[0]) {  // Comparando a primeira letra
        setTimeout(() => {
            alert(`Descoberta: ${fruta}`);
            
            // Criar a imagem da fruta
            const imgFruta = document.createElement('img');
            imgFruta.src = `img/${fruta}.png`;  // Caminho da imagem da fruta
            imgFruta.alt = fruta;              // Alt text com o nome da fruta
            imgFruta.classList.add('fruta-imagem'); // Adiciona uma classe para estilizar a imagem

            // Adicionar a imagem da fruta na sacola do jogador
            const cesta = document.getElementById(`cesta-${sacola.fruta}`);
            if (cesta) {
                cesta.appendChild(imgFruta);
            }

            // Adicionar a fruta à cesta do jogador
            sacola.conteudo.push(fruta);

            // Remover o cartão da cartela
            cartaoElement.remove();

            // Verificar se o jogador atual já ganhou (acertou 3 vezes)
            if (sacola.conteudo.length === 3) {
                alert(`Jogador ${jogadorAtual + 1} venceu!`);
                soltarConfetes();
                jogoEmAndamento = false;  // Finaliza o jogo
                return;
            }

            // Passar a vez para o próximo jogador
            jogadorAtual = (jogadorAtual + 1) % sacolas.length;
            mostrarVezJogador();
        }, 1000); // Exibe a descoberta por um segundo antes de mover para a cesta
    } else {
        setTimeout(() => {
            cartaoElement.classList.remove('revelado'); // Volta a virar o cartão
            // Passar a vez para o próximo jogador
            jogadorAtual = (jogadorAtual + 1) % sacolas.length;
            mostrarVezJogador();
        }, 1000); // Aguarda um segundo antes de virar de volta o cartão
    }
}


function mostrarVezJogador() {
    const jogadorAtualSpan = document.getElementById('jogador-atual');
    jogadorAtualSpan.textContent = `Jogador ${jogadorAtual + 1}`;

    // Esconde todas as cestas e mostra apenas a do jogador atual
    sacolas.forEach((_, index) => {
        document.getElementById(`sacola-${index}`).style.display = index === jogadorAtual ? 'block' : 'none';
    });
}

function soltarConfetes() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
}
