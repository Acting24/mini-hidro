# 📄 DOCUMENTAÇÃO TÉCNICA E ACADÊMICA — MINI-HIDRO
**Projeto Integrador II (PJI240) — Univesp**

---

## 1. RESUMO E OBJETIVOS
O **Mini-Hidro** é uma aplicação web full-stack desenvolvida para modernizar a gestão de chamados de manutenção hidráulica urbana. O sistema integra Inteligência Artificial Generativa para triagem e classificação automática de gravidade dos problemas relatados, além de consultar dados geográficos automaticamente via API do ViaCEP.

### Objetivos Específicos:
- Implementar autenticação segura via JSON Web Token (JWT).
- Integrar com PostgreSQL para persistência de dados relacionais.
- Consumir a API do **Google Gemini** (`gemini-3.8-flash`) para classificação preditiva de urgência (Crítica, Média, Baixa) com mecanismo de resiliência/retry.
- Garantir acessibilidade web conforme diretrizes **WCAG 2.1 AA** (Skip Link, Focus Visível e atributos ARIA).
- Validar a resiliência da API backend com suíte de testes automatizados (Jest + Supertest).

---

## 2. ARQUITETURA DO SISTEMA
- **Backend:** Node.js v18+, Express.js, JWT, `dotenv`.
- **Banco de Dados:** PostgreSQL (Tabela `chamados` com status e dados geográficos).
- **APIs Externas:**
  - **ViaCEP API:** Preenchimento automático de logradouro/bairro.
  - **Google Gemini API:** Modelo `gemini-3.8-flash` para triagem inteligente.
- **Frontend:** HTML5 semântico, CSS3 (com suporte a alto contraste e visualização de foco) e Vanilla JavaScript.
- **Acessibilidade (a11y):** WCAG 2.1 AA com foco em leitores de tela e navegação por teclado.

---

## 3. ACESSIBILIDADE E NAVEGAÇÃO
Em conformidade com as diretrizes da WCAG 2.1 AA, o sistema foi estruturado considerando:
1. **Skip Link:** Mecanismo de salto dinâmico ao teclado no início do documento para focar no contêiner principal (`<main id="main-content">`).
2. **Focus Visível:** Destocamento de foco com `outline: 3px solid #0056b3` e `outline-offset: 2px` para usuários de navegação por `Tab`.
3. **Semântica ARIA:**
   - Atributos `aria-required="true"` nos campos do formulário.
   - `aria-live="polite"` para anúncio automático da atualização da lista de chamados.
   - Marcações semânticas de `role="main"`, `aria-labelledby` e `aria-label`.

---

## 4. TESTES E QUALIDADE DE CÓDIGO
O projeto possui testes automatizados implementados com **Jest** e **Supertest** cobrindo:
- Autenticação e bloqueio de rotas protegidas sem JWT.
- Criação e consulta de chamados com banco de dados PostgreSQL.
- Tratamento de exceções e resiliência no consumo da API do Gemini (status HTTP 503 e retries).

---

## 5. REPOSITÓRIO E VERSOES
- **Repositório GitHub:** [https://github.com/Acting24/mini-hidro](https://github.com/Acting24/mini-hidro)
- 
