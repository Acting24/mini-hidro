const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_padrao';

// Rota de Login
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    if (senha === '123456') {
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }
    return res.status(401).json({ erro: 'Credenciais inválidas' });
});

// Middleware de Autenticação JWT
function autenticar(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ erro: 'Acesso negado' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ erro: 'Token inválido' });
        req.user = user;
        next();
    });
}

// Função auxiliar para chamar a IA com sanitização do retorno
async function classificarComIA(descricaoPrompt, tentativas = 2) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return 'Média';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

    for (let i = 1; i <= tentativas; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `Analise o problema hidráulico: "${descricaoPrompt}". Responda estritamente com UMA única palavra entre: Baixa, Média ou Crítica.` }]
                    }]
                })
            });

            if (response.status === 503) {
                await new Promise(res => setTimeout(res, 1500));
                continue;
            }

            const data = await response.json();
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                let resultado = data.candidates[0].content.parts[0].text.replace(/[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]/g, '').trim();
                
                if (resultado.toLowerCase().includes('critica') || resultado.toLowerCase().includes('crítica')) return 'Crítica';
                if (resultado.toLowerCase().includes('baixa')) return 'Baixa';
                if (resultado.toLowerCase().includes('media') || resultado.toLowerCase().includes('média')) return 'Média';
                
                return resultado;
            }
        } catch (err) {
            console.error('Erro na chamada da IA:', err.message);
        }
    }
    return 'Média';
}

// Rota para Listar Chamados
app.get('/api/chamados', autenticar, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM chamados ORDER BY id DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Rota para Criar Chamado (Com classificação automática via IA)
app.post('/api/chamados', autenticar, async (req, res) => {
    const { titulo, cep, bairro } = req.body;
    
    // Processa a prioridade/gravidade com o Gemini
    const prioridade = await classificarComIA(titulo);

    try {
        const query = 'INSERT INTO chamados (cliente_email, titulo, cep, bairro, status) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [req.user.email, titulo, cep, bairro, prioridade];
        const { rows } = await pool.query(query, values);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
}

module.exports = app;