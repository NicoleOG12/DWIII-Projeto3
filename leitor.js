import chalk from "chalk";
import fs from "fs/promises";
import path from "path";

const regexMarkdown = /\[([^\]]*)\]\((https?:\/\/[^$#\s)][^\s]*)\)/g;
const regexURLSolta = /https?:\/\/[^\s<>"')]+/g;

export function extraiLinks(texto) {
  const resultados = [];
  
  let match;
  while ((match = regexMarkdown.exec(texto)) !== null) {
    resultados.push({ texto: match[1], url: match[2] });
  }
  
  regexMarkdown.lastIndex = 0;
  
  while ((match = regexURLSolta.exec(texto)) !== null) {
    let url = match[0].replace(/[\)]+$/, '');
    const urlJaExiste = resultados.some(r => r.url === url);
    if (!urlJaExiste && url.length > 10) {
      resultados.push({ texto: null, url: url });
    }
  }
  
  return resultados;
}

export async function lerArquivo(caminhoDoArquivo) {
  try {
    const stats = await fs.stat(caminhoDoArquivo);
    if (!stats.isFile()) {
      throw new Error("O caminho especificado não é um arquivo válido.");
    }
    const texto = await fs.readFile(caminhoDoArquivo, "utf-8");
    return extraiLinks(texto);
  } catch (erro) {
    if (erro.code === "ENOENT") {
      throw new Error(chalk.red("❌ Arquivo não encontrado."));
    }
    if (erro.code === "EISDIR") {
      throw new Error(chalk.red("❌ O caminho é um diretório."));
    }
    throw new Error(chalk.red(`❌ Erro ao ler arquivo: ${erro.message}`));
  }
}

export function isValidURL(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function processaEntrada(entrada) {
  if (isValidURL(entrada)) {
    return [{ texto: null, url: entrada }];
  }
  
  const extensao = path.extname(entrada).toLowerCase();
  const extValidas = ['.md', '.txt', '.json', '.html'];
  
  if (extValidas.includes(extensao)) {
    return await lerArquivo(entrada);
  }
  
  try {
    return await lerArquivo(entrada);
  } catch {
    throw new Error(chalk.red(`❌ Entrada inválida: "${entrada}"`));
  }
}

export default { extraiLinks, lerArquivo, isValidURL, processaEntrada };