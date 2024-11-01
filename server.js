const express = require('express');

const cors = require('cors');

const conexao = require('./bancoDados');

const mercados = [];

const server = express();

server.use(express.json());

server.use(cors());

//check
//Post para criação de mercado c
server.post('/mercados', (req, res) => {
    console.log('Body requisição:', req.body);
    const idMercado = req.body.idMercado;
    const nomeMercado = req.body.nomeMercado;
    const enderecoMercado = req.body.enderecoMercado;
    let insertSql = 'INSERT INTO dadosMercado (id_mercado,nomeMercado,enderecoMercado) VALUES(';
    insertSql = insertSql.concat(idMercado, ',');
    insertSql = insertSql.concat("'",nomeMercado,"'", ',');
    insertSql = insertSql.concat("'",enderecoMercado,"'", ')');

    conexao.query(insertSql, (erro, resultado) =>{
        if(erro){
            console.log(erro);
            throw erro;
        }
        res.json({mensagem: "Mercado cadastrado com sucesso"});
    });

});

//check
//Post para criação de produto
server.post('/mercados/:idMercado/produtos', (req, res) => {
    // Capturando o ID do mercado da URL
    const idMercado = req.params.idMercado;

    const idProduto = req.body.idProduto;
    const nomeProduto = req.body.nomeProduto;
    const descricaoProduto = req.body.descricaoProduto;
    const precoProduto = req.body.precoProduto;
    const quantidadeProduto = req.body.quantidadeProduto;

    let insertSql = 'INSERT INTO produto (id_produto, nomeProduto, descricaoProduto, precoProduto, quantidadeProduto, id_mercadoRef) VALUES(';
    insertSql = insertSql.concat(idProduto, ',');
    insertSql = insertSql.concat("'", nomeProduto, "'", ',');
    insertSql = insertSql.concat("'", descricaoProduto, "'", ',');
    insertSql = insertSql.concat(precoProduto, ',');
    insertSql = insertSql.concat(quantidadeProduto, ',');
    insertSql = insertSql.concat(idMercado, ')');

    conexao.query(insertSql, (erro, resultado) => {
        if (erro) {
            console.error(erro);
            res.status(500).json({ mensagem: 'Erro ao cadastrar o produto' });
            return;
        }
    
        res.json({
            mensagem: 'Produto cadastrado com sucesso',
            produto: {
                id: idProduto,
                nome: nomeProduto,
                descricao: descricaoProduto,
                preco: precoProduto,
                quantidade: quantidadeProduto,
                id_mercado: idMercado
            }
        });
    });
});

//check
//Post movimentações 
server.post('/mercados/:idMercado/produtos/:idProduto/movimentacoes', (req, res) => {
    // Capturando o ID do mercado e do produto da URL
    //const idMercado = req.params.idMercado;
    const idMovimentacao = req.body.idMov;

    // Extraindo as informações da movimentação a partir do corpo da requisição
    const idProduto = req.body.idProduto
    const tipoMovimentacao = req.body.tipoMovimentacao;
    const quantidadeMovimentacao = req.body.quantidadeMovimentacao;
    const dataMovimentacao = req.body.data_mov;


    // Montando a query SQL para inserir a movimentação de estoque
    let insertSql = 'INSERT INTO movimentacoes (id_movimentacao, tipoMov, quantMov, data_mov,id_produtoRef) VALUES(';
    insertSql = insertSql.concat(idMovimentacao, ',');
    //insertSql = insertSql.concat(idMercado, ',');
    insertSql = insertSql.concat("'", tipoMovimentacao, "'", ',');
    insertSql = insertSql.concat(quantidadeMovimentacao, ',');
    insertSql = insertSql.concat("'", dataMovimentacao, "'",',');
    insertSql = insertSql.concat(idProduto,')');

    // Executando a query de inserção
    conexao.query(insertSql, (erro, resultado) => {
        if (erro) {
            console.error(erro);
            res.status(500).json({ mensagem: 'Erro ao registrar a movimentação' });
            return;
        }

        // Respondendo com os detalhes da movimentação registrada
        res.json({
            mensagem: 'Movimentação registrada com sucesso',
            movimentacao: {
                //id_mercado: idMercado,
                id_produto: idProduto,
                tipo: tipoMovimentacao,
                quantidade: quantidadeMovimentacao,
                data_movimentacao: dataMovimentacao,
                idMov: idMovimentacao
            }
        });
    });
});

//check
//Deletar mercado
server.delete('/mercados', (req, res) => {

    console.log('Body requisição:', req.body);
    const idMercado = Number(req.body.id);

    if (!idMercado) {
        res.status(400).json({ mensagem: "ID do mercado é necessário para a exclusão" });
        return;
    }

    const deleteSql = 'DELETE FROM dadosMercado WHERE id_mercado = ?';

    conexao.query(deleteSql, [idMercado], (erro, resultado) => {
        if (erro) {
            console.log(erro);
            res.status(500).json({ mensagem: "Erro ao deletar mercado" });
            return;
        }

        if (resultado.affectedRows === 0) {
            res.status(404).json({ mensagem: "Mercado não encontrado" });
            return;
        }

        res.json({ mensagem: "Mercado deletado com sucesso" });
    });

    // Remover o mercado da lista local, se aplicável
    const indiceMercado = mercados.findIndex(m => m.id === idMercado);
    if (indiceMercado >= 0) {
        mercados.splice(indiceMercado, 1);
        console.log("Mercado removido da lista local.");
    }
});

//check
//Deletar produto
server.delete('/mercados/:idMercado/produtos/:idProduto', (req, res) => {
    // Capturando os IDs do mercado e do produto da URL
    const idMercado = req.params.idMercado;
    const idProduto = req.params.idProduto;

    // Montando a query SQL para excluir o produto do estoque
    let deleteSql = 'DELETE FROM produto WHERE id_produto = ';
    deleteSql = deleteSql.concat(idProduto, ' AND id_mercadoRef = ', idMercado);

    // Executando a query de exclusão
    conexao.query(deleteSql, (erro, resultado) => {
        if (erro) {
            console.error(erro);
            res.status(500).json({ mensagem: 'Erro ao excluir o produto' });
            return;
        }

        // Verificando se algum produto foi excluído
        if (resultado.affectedRows === 0) {
            res.status(404).json({ mensagem: 'Produto ou mercado não encontrado' });
            return;
        }

        // Respondendo com a confirmação da exclusão
        res.json({ mensagem: 'Produto excluído com sucesso' });
    });
});

//check
//Puxar os mercados
server.get('/mercados', (req, res) => {
    conexao.query('SELECT * FROM dadosMercado', (erro, resultados) => {
        if (erro) {
            console.log(erro);
            res.status(500).json({ mensagem: 'Erro ao buscar mercados' });
        } else {
            res.json(resultados);
        }
    });
});
//falta testar
// Endpoint GET para buscar um mercado pelo ID
server.get('/mercados/:id', (req, res) => {

    const id = parseInt(req.params.id, 10);
    //const mercado = mercados.find(m => m.id === id);
    const selectSql = `SELECT * FROM dadosMercado WHERE id_mercado = ${id}`;

    conexao.query(selectSql, [id], (erro, resultados) => {
        if (erro) {
            console.error(erro);
            res.status(500).json({ message: 'Erro ao buscar o mercado' });
            return;
        }

        if (resultados) {
            res.json(resultados);
        } else {
            res.status(404).json({ message: 'Mercado não encontrado' });
        }
    });
});
//check
//Buscar produto de mercado 
server.get('/mercados/:idMercado/produtos', (req, res) => {

    const id = parseInt(req.params.idMercado, 10);
    //const mercado = mercados.find(m => m.id === idMercado);
    const selectSql = `SELECT * FROM produto WHERE id_mercadoRef = ${id}`

    conexao.query(selectSql, [id], (erro, resultados) => {
        if(erro){
            console.error(erro);
            res.status(500).json({message: 'Erro ao buscar produto'});
            return;
        }
        if (resultados) {
            res.json(resultados);
        } else {
            res.status(404).json({ message: 'Mercado não encontrado' });
        }
    });
});

//check
// Endpoint GET para listar movimentações de estoque de um produto específico em um mercado
server.get('/mercados/:idMercado/produtos/:idProduto/movimentacoes', (req, res) => {
   
    const idMercado = parseInt(req.params.idMercado, 10);
    const idProduto = parseInt(req.params.idProduto, 10);
    const mercado = mercados.find(m => m.id === idMercado);

    conexao.query('SELECT movimentacoes FROM produtos WHERE idProduto = ' , (erro, resultados) => {
        if (mercado) {
            const produto = mercado.produtos.find(p => p.id === idProduto);
            if (produto) {
                res.json(produto.movimentacoes);
            } else {
                res.status(404).json({ message: 'Produto não encontrado' });
            }
        } else {
            res.status(404).json({ message: 'Mercado não encontrado' });
        }
    });
});

//check
// PUT para atualizar as informações de um mercado com base no nomeMercado
server.put('/mercados/:nomeMercado', (req, res) => {
    const nomeMercado = req.params.nomeMercado; // Nome do mercado atual passado na URL
    const novoNomeMercado = req.body.nomeMercado; // Novo nome do mercado
    const novoEnderecoMercado = req.body.enderecoMercado; // Novo endereço do mercado

    // Verifica se os novos valores foram fornecidos
    if (!novoNomeMercado || !novoEnderecoMercado) {
        res.status(400).json({ mensagem: "Os campos 'nomeMercado' e 'enderecoMercado' são obrigatórios." });
        return;
    }

    // SQL para atualizar o mercado com base no nome original
    const updateSql = 'UPDATE dadosMercado SET nomeMercado = ?, enderecoMercado = ? WHERE nomeMercado = ?';

    // Executa a atualização
    conexao.query(updateSql, [novoNomeMercado, novoEnderecoMercado, nomeMercado], (erro, resultado) => {
        if (erro) {
            console.error(erro);
            res.status(500).json({ mensagem: 'Erro ao atualizar mercado' });
            return;
        }

        // Verifica se algum registro foi atualizado
        if (resultado.affectedRows === 0) {
            res.status(404).json({ mensagem: "Mercado não encontrado" });
            return;
        }

        // Retorna o mercado atualizado
        const selectSql = 'SELECT * FROM dadosMercado WHERE nomeMercado = ?';
        conexao.query(selectSql, [novoNomeMercado], (erro, resultados) => {
            if (erro) {
                console.error(erro);
                res.status(500).json({ mensagem: 'Erro ao buscar o mercado atualizado' });
                return;
            }
            
            res.json({
                mensagem: "Mercado atualizado com sucesso",
                mercadoAtualizado: resultados[0]
            });
        });
    });
});
//check
// PUT para atualizar as informações de um produto específico em um mercado
server.put('/mercados/:idMercado/produtos/:idProduto', (req, res) => {
    const idMercado = req.params.idMercado; // ID do mercado na URL
    const idProduto = req.params.idProduto; // ID do produto na URL

    // Novos dados do produto que queremos atualizar
    const novoNomeProduto = req.body.nomeProduto;
    const novaDescricaoProduto = req.body.descricaoProduto;
    const novoPrecoProduto = req.body.precoProduto;
    const novaQuantidadeProduto = req.body.quantidadeProduto;

    // Verifica se todos os campos necessários estão presentes
    if (!novoNomeProduto || !novaDescricaoProduto || novoPrecoProduto === undefined || novaQuantidadeProduto === undefined) {
        res.status(400).json({ mensagem: "Os campos 'nomeProduto', 'descricaoProduto', 'precoProduto' e 'quantidadeProduto' são obrigatórios." });
        return;
    }

    // SQL para atualizar o produto com base nos IDs de mercado e produto
    const updateSql = `UPDATE produto 
                       SET nomeProduto = ?, descricaoProduto = ?, precoProduto = ?, quantidadeProduto = ? 
                       WHERE id_mercadoRef = ? AND id_produto = ?`;

    // Executa a atualização do produto
    conexao.query(updateSql, [novoNomeProduto, novaDescricaoProduto, novoPrecoProduto, novaQuantidadeProduto, idMercado, idProduto], (erro, resultado) => {
        if (erro) {
            console.error(erro);
            res.status(500).json({ mensagem: 'Erro ao atualizar o produto' });
            return;
        }

        // Verifica se o produto foi atualizado
        if (resultado.affectedRows === 0) {
            res.status(404).json({ mensagem: "Produto ou mercado não encontrado" });
            return;
        }

        // Consulta para retornar os detalhes do produto atualizado junto com o mercado
        const selectSql = `SELECT p.id_produto, p.nomeProduto, p.descricaoProduto, p.precoProduto, p.quantidadeProduto, 
                                  m.id_mercado, m.nomeMercado, m.enderecoMercado
                           FROM produto AS p
                           JOIN dadosMercado AS m ON p.id_mercadoRef = m.id_mercado
                           WHERE p.id_mercadoRef = ? AND p.id_produto = ?`;

        // Executa a consulta para obter os detalhes do produto atualizado
        conexao.query(selectSql, [idMercado, idProduto], (erro, resultados) => {
            if (erro) {
                console.error(erro);
                res.status(500).json({ mensagem: 'Erro ao buscar o produto atualizado' });
                return;
            }

            res.json({
                mensagem: "Produto atualizado com sucesso",
                produtoAtualizado: {
                    id_produto: resultados[0].id_produto,
                    nomeProduto: resultados[0].nomeProduto,
                    descricaoProduto: resultados[0].descricaoProduto,
                    precoProduto: resultados[0].precoProduto,
                    quantidadeProduto: resultados[0].quantidadeProduto,
                    mercado: {
                        id_mercado: resultados[0].id_mercado,
                        nomeMercado: resultados[0].nomeMercado,
                        enderecoMercado: resultados[0].enderecoMercado
                    }
                }
            });
        });
    });
});

server.listen(3000, () => {
    console.log('servidor rodando na porta 3000');
});