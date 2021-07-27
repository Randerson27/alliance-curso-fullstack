const express = require('express')
const { Pool } = require('pg')
const app = express()
app.use(express.json());
const port = 3000

const pool = new Pool({
    connectionString: "postgres://postgres:789141215@localhost:5432/loja"
});

pool.on('connect', () =>{
    console.log("Base de dados conectada com sucesso")
})

var listaProdutos = [];

function initMemDB() {
    listaProdutos.push({codigo: 1, quantidade: 10, descricao: 'caneta'});
    listaProdutos.push({codigo: 2, quantidade: 20, descricao: 'borracha'});
    listaProdutos.push({codigo: 3, quantidade: 5, descricao: 'caderno'});
}

app.get('/', (req, res) => {
  res.send('Hello World! ')
})

//Retorna todos os produtos
app.get('/produtos/', async (req, res) => {
    const result = await pool.query("SELECT codigo, descricao, quantidade FROM produtos")
    res.status(200).send(result.rows);
})

//Retorna o produto com o codigo informado
app.get('/produtos/:codigo', async (req, res) => {
    const result = await pool.query(`SELECT codigo, descricao, quantidade FROM produtos WHERE codigo = ${req.params.codigo}`)
    //const result = listaProdutos.filter((x) => x.codigo == ///req.params.codigo);
    if (result.rowCount == 0){
        res.statusCode = 404
        res.send()
    }else{
        res.send(result.rows[0])
    }

})

app.delete('/produtos/:codigo', async (req, res) => {
    var result = await pool.query("DELETE FROM produtos WHERE codigo = $1", [req.params.codigo]);

    if (result.rowCount == 0) {
        res.statusCode = 404
        res.send("NOK"); 
    }
    else { 
        res.send("OK");
    }
})



app.put('/produtos/:codigo', async (req, res) => {
    const resource = await pool.query("SELECT codigo, descricao, quantidade FROM produtos WHERE codigo = $1", [req.params.codigo]);
    var newObj = req.body;
    //Verifica se o código da URl existe
    if (resource.rowCount == 0) {
        res.statusCode = 404
        res.send("NOK"); 
    }
    else {
        var elementoAtual = resource.rows[0]; 
        
        // Verifica se o código novo já é utilizado (e não é o mesmo)
        if (elementoAtual.codigo != newObj.codigo) {
            var existsNew = await pool.query("SELECT codigo, descricao, quantidade FROM produtos WHERE codigo = $1", [newObj.codigo]);
            if (existsNew.rowCount > 0) {
                res.statusCode = 409
                res.send("NOK");
                return;
            } 
        } 

        const updated = await pool.query("UPDATE produtos SET codigo = $1, descricao = $2, quantidade = $3 WHERE codigo = $4", [newObj.codigo, newObj.descricao, newObj.quantidade, req.params.codigo]);
        res.send("OK");
    }
})

app.post('/produtos', async (req,res) => {
    var newObj = req.body;
    // Checar se o objeto recebido já existe (mesmo codigo)
    const sameCodigo = await pool.query("SELECT codigo, descricao, quantidade FROM produtos WHERE codigo = $1", [newObj.codigo]);
    if (sameCodigo.rowCount > 0 ) {
    //     Retornar 409 (conflict)
        res.statusCode = 409;
        res.send("NOK");
    } else {
        // Caso negativo, adicionar na lista em memória
        const inserted = await pool.query("INSERT INTO produtos (codigo, descricao, quantidade) VALUES ($1, $2, $3) RETURNING *", [newObj.codigo, newObj.descricao, newObj.quantidade]);
        // Definir cõdigo de retorno codigo 201 (created)
        // Retornar o objeto inserido (nâo a lista)
        res.status(201).send(inserted[0]);
    }
})
 

// DELETE
// Verbo DELETE na rota /produtos/:codigo

// Sobrescrever a lista listaProdutos com um filter removendo o item excluido
// Como criar rota DELETE no express 


app.listen(port, () => {
  initMemDB();
  console.log(`Example app listening at http://localhost:${port}`)
})