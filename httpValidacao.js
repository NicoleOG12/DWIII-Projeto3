import fetch from "node-fetch";
import chalk from "chalk";

const mapaStatus = {
  200: { mensagem: "Site no ar e operante!", cor: chalk.green, emoji: "✅" },
  201: { mensagem: "Recurso criado com sucesso!", cor: chalk.green, emoji: "✅" },
  202: { mensagem: "Requisição aceita!", cor: chalk.green, emoji: "✅" },
  204: { mensagem: "Requisição processada!", cor: chalk.green, emoji: "✅" },
  400: { mensagem: "Página não encontrada.", cor: chalk.red, emoji: "❌" },
  401: { mensagem: "Autenticação necessária.", cor: chalk.red, emoji: "🔒" },
  403: { mensagem: "Acesso proibido.", cor: chalk.red, emoji: "🚫" },
  404: { mensagem: "Página não encontrada.", cor: chalk.red, emoji: "❌" },
  405: { mensagem: "Método não permitido.", cor: chalk.red, emoji: "❌" },
  408: { mensagem: "Tempo de requisição esgotado.", cor: chalk.yellow, emoji: "⏱️" },
  429: { mensagem: "Muitas requisições.", cor: chalk.yellow, emoji: "⚠️" },
  500: { mensagem: "Erro interno no servidor do site.", cor: chalk.yellow, emoji: "⚠️" },
  501: { mensagem: "Funcionalidade não implementada.", cor: chalk.yellow, emoji: "⚠️" },
  502: { mensagem: "Gateway inválido.", cor: chalk.yellow, emoji: "⚠️" },
  503: { mensagem: "Serviço indisponível.", cor: chalk.yellow, emoji: "⚠️" },
  504: { mensagem: "Tempo de resposta esgotado.", cor: chalk.yellow, emoji: "⚠️" },
  301: { mensagem: "Site redirecionado permanentemente.", cor: chalk.green, emoji: "↩️" },
  302: { mensagem: "Site redirecionado temporariamente.", cor: chalk.green, emoji: "↪️" },
  304: { mensagem: "Conteúdo não modificado.", cor: chalk.green, emoji: "📦" }
};

function traduzStatus(statusCode) {
  const info = mapaStatus[statusCode];
  if (info) return info;
  
  if (statusCode >= 400 && statusCode < 500) {
    return { mensagem: `Erro do cliente: ${statusCode}`, cor: chalk.red, emoji: "❌" };
  }
  if (statusCode >= 500) {
    return { mensagem: `Erro do servidor: ${statusCode}`, cor: chalk.yellow, emoji: "⚠️" };
  }
  return { mensagem: `Status: ${statusCode}`, cor: chalk.gray, emoji: "❓" };
}

function traduzErroRede(erro) {
  const codigo = erro.code || erro.message;
  const mapaErrosRede = {
    ENOTFOUND: { mensagem: "Domínio inexistente ou erro de rede.", cor: chalk.red, emoji: "🌐" },
    ECONNREFUSED: { mensagem: "Conexão recusada.", cor: chalk.red, emoji: "🚫" },
    ETIMEDOUT: { mensagem: "Tempo de conexão esgotado.", cor: chalk.red, emoji: "⏱️" },
    ENETUNREACH: { mensagem: "Rede inalcançável.", cor: chalk.red, emoji: "🌐" },
    EAI_AGAIN: { mensagem: "Erro de DNS temporário.", cor: chalk.red, emoji: "🌐" },
    ERR_INVALID_URL: { mensagem: "URL inválida.", cor: chalk.red, emoji: "❌" },
    FETCH_ERROR: { mensagem: "Erro ao buscar URL.", cor: chalk.red, emoji: "❌" }
  };
  
  for (const [key, value] of Object.entries(mapaErrosRede)) {
    if (codigo.includes(key) || erro.message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  return { mensagem: `Erro de conexão: ${erro.message}`, cor: chalk.red, emoji: "❌" };
}

async function validaUmaURL(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, { method: "HEAD", signal: controller.signal, redirect: "follow" });
    clearTimeout(timeoutId);
    
    const traducao = traduzStatus(response.status);
    return {
      url: url,
      status: response.status,
      mensagem: traducao.mensagem,
      formatada: `${traducao.emoji} ${traducao.cor(traducao.mensagem)}`,
      sucesso: response.status >= 200 && response.status < 400
    };
  } catch (erro) {
    const traducao = traduzErroRede(erro);
    return {
      url: url,
      status: null,
      mensagem: traducao.mensagem,
      formatada: `${traducao.emoji} ${traducao.cor(traducao.mensagem)}`,
      sucesso: false,
      erro: erro.message
    };
  }
}

export async function validaURL(arrayLinks) {
  if (!arrayLinks || arrayLinks.length === 0) {
    console.log(chalk.yellow("⚠ Nenhum link para validar."));
    return [];
  }
  
  console.log(chalk.cyan("\n🔍 Validando URLs...\n"));
  
  const resultados = await Promise.all(
    arrayLinks.map(async (link) => await validaUmaURL(link.url || link))
  );
  
  return resultados;
}

export function exibirResultados(resultados) {
  console.log(chalk.cyan("═".repeat(60)));
  console.log(chalk.bold.cyan("📊 RESULTADO DA VALIDAÇÃO"));
  console.log(chalk.cyan("═".repeat(60)));
  
  let sucesso = 0, erro = 0;
  
  resultados.forEach((resultado, index) => {
    console.log(`\n${chalk.gray(`${index + 1}.`)} ${chalk.blue(resultado.url)}`);
    console.log(`   ${resultado.formatada}`);
    resultado.sucesso ? sucesso++ : erro++;
  });
  
  console.log(chalk.cyan("\n" + "═".repeat(60)));
  console.log(chalk.bold(`\n📈 Resumo: ${chalk.green(sucesso + " OK")} | ${chalk.red(erro + " Erros")}`));
  console.log(chalk.cyan("═".repeat(60) + "\n"));
}

export default { validaURL, exibirResultados };