const express = require('express')
const { Pool } = require('pg')
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

// Importa as APIs
const produtosApi = require('./api/produtos');
produtosApi(app, pool); //registra as rotas

const usuariosApi = require('./api/usuarios');
usuariosApi(app, pool); //registra as rotas

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})