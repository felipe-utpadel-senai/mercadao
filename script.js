const alertBox = document.getElementById('alert');

// Função para exibir mensagens de alerta
function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
    alertBox.style.display = 'block';
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000); // Oculta após 3 segundos
}

// Cadastrar Mercado
formMercado.addEventListener('submit', async (event) => {
    event.preventDefault();
    const idMercado = document.getElementById('idMercado').value;
    const nomeMercado = document.getElementById('nomeMercado').value;
    const enderecoMercado = document.getElementById('enderecoMercado').value;

    const response = await fetch('http://localhost:3000/mercados', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idMercado,
            nomeMercado,
            enderecoMercado
        })
    });

    const data = await response.json();
    showAlert(data.mensagem, response.ok ? 'success' : 'error');
});

// Cadastrar Produto
formProduto.addEventListener('submit', async (event) => {
    event.preventDefault();
    const idProduto = document.getElementById('idProduto').value;
    const nomeProduto = document.getElementById('nomeProduto').value;
    const descricaoProduto = document.getElementById('descricaoProduto').value;
    const precoProduto = document.getElementById('precoProduto').value;
    const quantidadeProduto = document.getElementById('quantidadeProduto').value;
    const mercadoRef = document.getElementById('mercadoRef').value;

    const response = await fetch(`http://localhost:3000/mercados/${mercadoRef}/produtos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idProduto,
            nomeProduto,
            descricaoProduto,
            precoProduto,
            quantidadeProduto
        })
    });

    const data = await response.json();
    showAlert(data.mensagem, response.ok ? 'success' : 'error');
});

// Registrar Movimentação
formMovimentacao.addEventListener('submit', async (event) => {
    event.preventDefault();
    const idProduto = document.getElementById('idProdutoMov').value;
    const idMercado = document.getElementById('idMercadoMov').value;
    const tipoMovimentacao = document.getElementById('tipoMovimentacao').value;
    const quantidadeMovimentacao = document.getElementById('quantidadeMovimentacao').value;
    const dataMovimentacao = document.getElementById('dataMovimentacao').value;

    const response = await fetch(`http://localhost:3000/mercados/${idMercado}/produtos/${idProduto}/movimentacoes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tipo: tipoMovimentacao,
            quantidade: quantidadeMovimentacao,
            dataMovimentacao
        })
    });

    const data = await response.json();
    showAlert(data.mensagem, response.ok ? 'success' : 'error');
});