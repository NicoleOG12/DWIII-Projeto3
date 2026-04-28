# DWIII-Projeto3

## ✨ Sobre o projeto

Ferramenta de linha de comando em Node.js para validar URLs a partir de uma URL única ou de um arquivo contendo vários links. O resultado é apresentado com mensagens amigáveis e coloridas no terminal, substituindo os códigos HTTP crus por informações mais legíveis.

## 👩‍💻 Autoras

- [Nicole Oliveira Gonçalves](https://github.com/NicoleOG12)
- [Stela dos Santos Montenegro](https://github.com/stela-sm)

## 📌 Objetivo

- Receber entrada via `process.argv`.
- Ler arquivos de texto ou markdown com `fs.promises.readFile`.
- Extrair URLs usando RegEx.
- Validar cada link com `node-fetch`.
- Traduzir códigos HTTP em mensagens amigáveis.
- Tratar falhas de rede e erros DNS com mensagens customizadas.

## 🗂️ Arquivos principais

- `cli.js` — ponto de entrada e interface com o usuário.
- `leitor.js` — processamento de entrada e extração de URLs.
- `httpValidacao.js` — requisições HTTP e regras de negócio.

## ✅ Regras de validação

- `200` → Site no ar e operante! 🟢
- `400 / 404` → Página não encontrada. 🔴
- `500` → Erro interno no servidor do site. 🟡
- Erros de conexão/DNS → Domínio inexistente ou erro de rede. 🔴

## 🛠️ Tecnologias
<p>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" width="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/markdown/markdown-original.svg" width="50"/>
</p>

## 🚀 Como usar

```bash
npm install
node cli.js https://www.exemplo.com.br
node cli.js ./arquivos/texto.md
```

## 🧪 Scripts úteis

```bash
npm run cli
npm run validar
```
