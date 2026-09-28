const express = require('express');

const app = express();
const cors = require('cors');
const pool = require('./db');

const PORTA = 3000;
app.use(cors());

app.get('/api/projetos', async (req, res) => {
    const sql = "SELECT id, nome, descricao, tecnologias, link_github, ano FROM projetos WHERE status = 'publicado' ORDER BY ano DESC, id";
    const [linhas] = await pool.execute(sql, [req.params.id]);
    if (linhas.length === 0) {
        return res.status(404).json({ erro: 'Projeto não encontrdo'})
    }
    //const resultado = pool.query(sql);
    //console.log(resultado);
    res.json(linhas[0]);
});

app.listen(PORTA, () => {
  console.log('API no ar em http://localhost:' + PORTA);
});