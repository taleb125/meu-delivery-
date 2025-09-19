const produtos = {
    'Hambúrguer Clássico': {
        nome: 'Hambúrguer Clássico',
        preco: 25.00
    },
    'Pizza Margherita': {
        nome: 'Pizza Margherita',
        preco: 45.00
    }
};
let carrinho = [];
let totalDoCarrinho = 0;
const listaCarrinho = document.getElementById('lista-carrinho');
const totalCarrinho = document.getElementById('total-carrinho');
const botoesAdicionar = document.querySelectorAll('.btn-adicionar');
const botaoFinalizar = document.querySelector('.btn-finalizar');
botoesAdicionar.forEach(botao => {
    botao.addEventListener('click', (evento) => {
        const itemCardapio = evento.target.closest('.item-cardapio');
        const nomeProduto = itemCardapio.getAttribute('data-produto');
        adicionarProdutoAoCarrinho(nomeProduto);
    });
});
botaoFinalizar.addEventListener('click', async () => {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio. Adicione um item para finalizar o pedido.");
        return;
    }
    const pedido = {
        items: carrinho
    };
    try {
        const response = await fetch('/process_payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });
        const data = await response.json();
        if (data.id) {
            window.location.href = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${data.id}`;
        } else {
            alert("Erro ao criar o link de pagamento.");
        }
    } catch (error) {
        console.error('Erro:', error);
        alert("Ocorreu um erro ao processar o pagamento. Tente novamente mais tarde.");
    }
});
function adicionarProdutoAoCarrinho(nomeDoProduto) {
    const produto = produtos[nomeDoProduto];
    if (produto) {
        carrinho.push(produto);
        totalDoCarrinho += produto.preco;
        atualizarVisualizacaoCarrinho();
    }
}
function atualizarVisualizacaoCarrinho() {
    listaCarrinho.innerHTML = '';
    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = '<li class="aviso-vazio">Seu carrinho está vazio.</li>';
    } else {
        carrinho.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
            listaCarrinho.appendChild(li);
        });
    }
    totalCarrinho.innerText = `R$ ${totalDoCarrinho.toFixed(2)}`;
}