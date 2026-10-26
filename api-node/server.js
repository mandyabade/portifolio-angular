
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
const PORTA = 3000;
const SEGREDO = process.env.JWT_SECRET || 'piso-na-cara-do-inimigo-de-crocs';

app.use(cors());
app.use(express.json());

function autenticar(req, res, next) {
    const cabecalho = req.headers.authorization ?? '';
    const token = cabecalho.startsWith('Bearer ')
        ? cabecalho.slice(7)
        : '';

    if (!token) {
        return res.status(401).json({ erro: 'Tente novamente informando o Token' });
    }

    try {
        req.usuario = jwt.verify(token, SEGREDO);
        next();
    } catch (erro) {
        return res.status(401).json({ erro: 'O Token é inválido ou expirou, tente novamente' });
    }
}

function erroServidor(res, erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Falha interna no servidor' });
}

app.get('/api/projetos', async (req, res) => {
    try {
        const sql = `
            SELECT id, nome, descricao, tecnologias, link_github, ano
            FROM projetos
            WHERE status = 'publicado'
            ORDER BY ano DESC, id
        `;

        const [projetos] = await pool.query(sql);
        return res.status(200).json(projetos);
    } catch (erro) {
        return erroServidor(res, erro);
    }
});

app.get('/api/projetos/todos', autenticar, async (req, res) => {
    try {
        const sql = `
            SELECT id, nome, descricao, tecnologias, link_github, ano, status
            FROM projetos
            ORDER BY ano DESC, id
        `;

        const [projetos] = await pool.query(sql);
        return res.status(200).json(projetos);
    } catch (erro) {
        return erroServidor(res, erro);
    }
});

app.get('/api/projetos/:id', async (req, res) => {
    try {
        const sql = `
            SELECT id, nome, descricao, tecnologias, link_github, ano
            FROM projetos
            WHERE id = ? AND status = 'publicado'
        `;

        const [linhas] = await pool.execute(sql, [req.params.id]);

        if (linhas.length === 0) {
            return res.status(404).json({ erro: 'Projeto não encontrado' });
        }

        return res.status(200).json(linhas[0]);
    } catch (erro) {
        return erroServidor(res, erro);
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, senha } = req.body ?? {};

        if (!email || !senha) {
            return res.status(400).json({
                erro: 'Informe email e senha'
            });
        }

        const [linhas] = await pool.execute(
            'SELECT id, email, senha_hash FROM usuarios WHERE email = ?',
            [email]
        );

        const usuario = linhas[0];

        if (!usuario) {
            return res.status(401).json({
                erro: 'Email ou senha são inválidos, tente novamente'
            });
        }

        const confere = await bcrypt.compare(senha, usuario.senha_hash);

        if (!confere) {
            return res.status(401).json({
                erro: 'Email ou senha são inválidos, tente novamente'
            });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            SEGREDO,
            { expiresIn: '45m' }
        );

        return res.status(200).json({ token });
    } catch (erro) {
        return erroServidor(res, erro);
    }
});

app.post('/api/projetos', autenticar, async (req, res) => {
    try {
        const dados = req.body ?? {};

        if (!dados.nome || !dados.nome.trim()) {
            return res.status(400).json({
                erro: 'Informe pelo menos o nome do projeto'
            });
        }

        const sql = `
            INSERT INTO projetos
            (nome, descricao, tecnologias, link_github, ano, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [resultado] = await pool.execute(sql, [
            dados.nome.trim(),
            dados.descricao ?? '',
            dados.tecnologias ?? '',
            dados.link_github ?? '',
            dados.ano ?? new Date().getFullYear(),
            'publicado'
        ]);

        return res.status(201).json({
            id: resultado.insertId,
            mensagem: 'Projeto criado com sucesso'
        });
    } catch (erro) {
        return erroServidor(res, erro);
    }
});

app.put('/api/projetos/:id', autenticar, async (req, res) => {
    try {
        const dados = req.body ?? {};

        if (!dados.nome || !dados.nome.trim()) {
            return res.status(400).json({
                erro: 'Informe pelo menos o nome do projeto'
            });
        }

        const sql = `
            UPDATE projetos
            SET nome = ?, descricao = ?, tecnologias = ?, link_github = ?, ano = ?
            WHERE id = ?
        `;

        const [resultado] = await pool.execute(sql, [
            dados.nome.trim(),
            dados.descricao ?? '',
            dados.tecnologias ?? '',
            dados.link_github ?? '',
            dados.ano ?? new Date().getFullYear(),
            req.params.id
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: 'Projeto não encontrado'
            });
        }

        return res.status(200).json({
            mensagem: 'Projeto atualizado com sucesso'
        });
    } catch (erro) {
        return erroServidor(res, erro);
    }
});

app.delete('/api/projetos/:id', autenticar, async (req, res) => {
    try {
        const [resultado] = await pool.execute(
            'DELETE FROM projetos WHERE id = ?',
            [req.params.id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: 'Projeto não encontrado'
            });
        }

        return res.status(204).end();
    } catch (erro) {
        return erroServidor(res, erro);
    }
});

app.get('/api/tecnologias', async (req, res) => {
    try {
        const sql = `
            SELECT id, nome, categoria, descricao, ano_criacao
            FROM tecnologias
            WHERE status = 'ativo'
            ORDER BY categoria, nome
        `;

        const [tecnologias] = await pool.query(sql);
        return res.status(200).json(tecnologias);
    } catch (erro) {
        return erroServidor(res, erro);
    }
});

app.get('/api/tecnologias/:id', async (req, res) => {
    try {
        const sql = `
            SELECT id, nome, categoria, descricao, ano_criacao
            FROM tecnologias
            WHERE id = ? AND status = 'ativo'
        `;

        const [linhas] = await pool.execute(sql, [req.params.id]);

        if (linhas.length === 0) {
            return res.status(404).json({
                erro: 'Tecnologia não encontrada'
            });
        }

        return res.status(200).json(linhas[0]);
    } catch (erro) {
        return erroServidor(res, erro);
    }
});


app.post('/api/tecnologias', autenticar, async (req, res) => {
    try {
        const dados = req.body ?? {};

        if (
            typeof dados.nome !== 'string' ||
            !dados.nome.trim() ||
            typeof dados.categoria !== 'string' ||
            !dados.categoria.trim()
        ) {
            return res.status(400).json({
                erro: 'Informe o nome e a categoria da tecnologia.'
            });
        }

        const sql = `
            INSERT INTO tecnologias
            (nome, categoria, descricao, ano_criacao, status)
            VALUES (?, ?, ?, ?, 'ativo')
        `;

        const [resultado] = await pool.execute(sql, [
            dados.nome.trim(),
            dados.categoria.trim(),
            dados.descricao ?? '',
            dados.ano_criacao ?? null
        ]);

        return res.status(201).json({
            id: resultado.insertId,
            mensagem: 'Tecnologia cadastrada com sucesso.'
        });
    } catch (erro) {
        return erroServidor(res, erro);
    }
});

app.put('/api/tecnologias/:id', autenticar, async (req, res) => {
    try {
        const dados = req.body ?? {};

        if (
            typeof dados.nome !== 'string' ||
            !dados.nome.trim() ||
            typeof dados.categoria !== 'string' ||
            !dados.categoria.trim()
        ) {
            return res.status(400).json({
                erro: 'Informe o nome e a categoria da tecnologia.'
            });
        }

        const [existentes] = await pool.execute(
            'SELECT id FROM tecnologias WHERE id = ?',
            [req.params.id]
        );

        if (existentes.length === 0) {
            return res.status(404).json({
                erro: 'Tecnologia não encontrada.'
            });
        }

        const sql = `
            UPDATE tecnologias
            SET nome = ?, categoria = ?, descricao = ?, ano_criacao = ?
            WHERE id = ?
        `;

        await pool.execute(sql, [
            dados.nome.trim(),
            dados.categoria.trim(),
            dados.descricao ?? '',
            dados.ano_criacao ?? null,
            req.params.id
        ]);

        return res.status(200).json({
            mensagem: 'Tecnologia atualizada com sucesso.'
        });
    } catch (erro) {
        return erroServidor(res, erro);
    }
});

app.delete('/api/tecnologias/:id', autenticar, async (req, res) => {
    try {
        const [resultado] = await pool.execute(
            'DELETE FROM tecnologias WHERE id = ?',
            [req.params.id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: 'Tecnologia não encontrada.'
            });
        }

        return res.status(204).end();
    } catch (erro) {
        return erroServidor(res, erro);
    }
});


app.listen(PORTA, () => {
    console.log(`API no ar em http://localhost:${PORTA}`);
});
