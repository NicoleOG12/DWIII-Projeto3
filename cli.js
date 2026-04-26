import chalk from "chalk";
import { processaEntrada } from "./leitor.js";
import { validaURL, exibirResultados } from "./httpValidacao.js";

const argumentos = process.argv;

function mostrarAjuda() {
  console.log(`
${chalk.cyan("╔══════════════════════════════════════════════════════════╗")}
${chalk.cyan("║")}  ${chalk.bold.white("VALIDADOR DE URLs CLI")}                            ${chalk.cyan("║")}
${chalk.cyan("╚══════════════════════════════════════════════════════════╝")}

${chalk.white("Uso:")}
  ${chalk.gray("$")} ${chalk.green("node cli.js <URL ou arquivo>")}

${chalk.white("Exemplos:")}
  ${chalk.gray("$")} ${chalk.green("node cli.js https://www.google.com")}
  ${chalk.gray("$")} ${chalk.green("node cli.js ./arquivos/texto.md")}

${chalk.white("Opções:")}
  ${chalk.yellow("--help")}     ${chalk.gray("Mostra esta mensagem de ajuda")}
  ${chalk.yellow("-v")}         ${chalk.gray("Mostra a versão da aplicação")}
`);
}

function mostrarBanner() {
  console.log(`
${chalk.cyan("🔗")} ${chalk.bold("Validador de URLs")} - ${chalk.gray("Node.js CLI")}
${chalk.gray("─".repeat(50))}
`);
}

async function main() {
  if (argumentos.includes("--help") || argumentos.includes("-h")) {
    mostrarAjuda();
    process.exit(0);
  }
  
  if (argumentos.includes("-v") || argumentos.includes("--version")) {
    console.log(chalk.green("v1.0.0"));
    process.exit(0);
  }
  
  const entrada = argumentos[2];
  
  if (!entrada) {
    console.log(chalk.red("❌ Erro: Nenhuma URL ou arquivo fornecido."));
    console.log(chalk.gray("Use --help para ver as opções disponíveis."));
    process.exit(1);
  }
  
  try {
    mostrarBanner();
    console.log(chalk.gray(`📂 Entrada: ${entrada}`));
    console.log(chalk.gray("─".repeat(50)));
    
    const links = await processaEntrada(entrada);
    
    if (links.length === 0) {
      console.log(chalk.yellow("\n⚠ Nenhum link encontrado para validar."));
      process.exit(0);
    }
    
    console.log(chalk.green(`\n✓ ${links.length} link(s) encontrado(s)\n`));
    
    const resultados = await validaURL(links);
    exibirResultados(resultados);
    
  } catch (erro) {
    console.log(chalk.red(`\n❌ Erro: ${erro.message}`));
    process.exit(1);
  }
}

main();