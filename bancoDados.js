const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'mercadao'
});
conexao.connect((erro) =>{
    if(erro != null){
        console.log('Deu erro', erro.message);
        return;
    }
    console.log('Conectado com sucesso!');
});
module.exports = conexao;