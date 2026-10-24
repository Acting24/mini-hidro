const request = require('supertest');
const app = require('./server');

describe('Testes de Rotas da API', () => {
    it('Deve rejeitar login com senha errada', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ email: 'teste@univesp.br', senha: 'incorreta' });
        expect(res.statusCode).toEqual(401);
    });

    it('Deve negar acesso à lista de chamados sem Token JWT', async () => {
        const res = await request(app).get('/api/chamados');
        expect(res.statusCode).toEqual(401);
    });
});