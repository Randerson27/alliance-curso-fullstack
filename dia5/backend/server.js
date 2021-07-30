const express = require('express')
const { Pool, types } = require('pg')
const cors = require("cors")
const app = express()
app.use(express.json());
const port = 3000

app.use(cors())

const pool = new Pool({
    connectionString: "postgres://postgres:789141215@localhost:5432/login_usuarios"
});

pool.on('connect', () => {
    console.log("Base de dados conectada com sucesso")
})

types.setTypeParser(1082, function(value) { 
    return value;
});

// Retorna todos os usuarios
app.get('/movimentos/', async(req, res) => {
    const result = await pool.query("SELECT id, data_mov, descricao, categoria, valor FROM movimentos");
    res.status(200).send(result.rows);
})

// Retorna o produto com o codigo informado
app.get('/movimentos/:id', async(req, res) => {
    const result = await pool.query("SELECT id, data_mov, descricao, categoria, valor FROM usuarios WHERE id = $1", [req.params.id]);

    if (result.rowCount == 0) {
        res.statusCode = 404
        res.send("")
    } else
        res.send(result.rows[0]);
})

app.delete('/movimentos/:id', async(req, res) => {
    var result = await pool.query("DELETE FROM movimentos WHERE id = $1", [req.params.id]);

    if (result.rowCount == 0) {
        res.statusCode = 404
        res.send("NOK");
    } else {
        res.send("OK");
    }
})


app.put('/movimentos/:id', async(req, res) => {
    const resource = await pool.query("SELECT id, data_mov, descricao, categoria, valor FROM movimentos WHERE id = $1", [req.params.id]);
    var newObj = req.body;
    //Verifica se o código da URl existe
    if (resource.rowCount == 0) {
        res.statusCode = 404
        res.send("NOK");
    } else {
        var elementoAtual = resource.rows[0];


        const updated = await pool.query("UPDATE movimentos SET data_mov = $1, descricao = $2, categoria = $3, valor = $4 WHERE id = $5 RETURNING *", [newObj.data_mov, newObj.descricao, newObj.categoria,newObj.valor, req.params.id]);
        res.send(updated.rows[0]);
    }
})

app.post('/movimentos', async(req, res) => {
    var newObj = req.body;
    // Checar se o objeto recebido já existe (mesmo login)
    const sameId = await pool.query("SELECT id FROM movimentos WHERE id = $1 ", [newObj.id]);
    if (sameId.rowCount > 0) {
        //     Retornar 409 (conflict)
        res.statusCode = 409;
        res.send("Login already registered");
    } else {
        // Caso negativo, adicionar na lista em memória
        const inserted = await pool.query("INSERT INTO movimentos (id, data_mov, descricao, categoria, valor) VALUES ($1, $2, $3, $4, $5) RETURNING *", [newObj.id, newObj.data_mov, newObj.descricao, newObj.categoria, newObj.valor]);
        // Definir cõdigo de retorno codigo 201 (created)
        // Retornar o objeto inserido (nâo a lista)
        res.status(201).send(inserted.rows[0]);
    }
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})