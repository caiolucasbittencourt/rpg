const botao1 = document.querySelector("#btn1");
const botao2 = document.querySelector("#btn2");
const botao3 = document.querySelector("#btn3");
const mensagem = document.querySelector("#message");
const txtXP = document.querySelector("#xpValue");
const txtHP = document.querySelector("#lifeValue");
const txtGold = document.querySelector("#goldValue");
const statsInimigo = document.querySelector("#enemyStatus");
const nomeInimigo = document.querySelector("#enemyName");
const vidaInimigoTexto = document.querySelector("#enemyLife");

let lvl = parseInt(txtXP.innerText);
let hp = parseInt(txtHP.innerText);
let gold = parseInt(txtGold.innerText);

let arma = 0;
let emBatalha;
let hpInimigo;
let mochila = ["espada"];

const listaArmas = [
  { nome: "espada", poder: 5 },
  { nome: "lança", poder: 10 },
  { nome: "adaga", poder: 50 },
  { nome: "besta", poder: 100 },
];

const bichos = [
  { nome: "goblin", nivel: 5, vida: 10 },
  { nome: "minotauro", nivel: 10, vida: 100 },
  { nome: "dragão", nivel: 20, vida: 500 },
];

const locais = [
    {
        nome: "praça da vila",
        botoes: ["Ir para a loja", "Explorar a floresta", "Enfrentar o chefe"],
        funcoes: [irLoja, irFloresta, lutarChefe],
        texto: "Você está na praça. Escolha seu próximo passo.",
    },
    {
        nome: "loja",
        botoes: ["Comprar poção de vida (10 ouro)", "Comprar arma (30 ouro)", "Voltar para a praça"],
        funcoes: [comprarVida, comprarArma, irPraca],
        texto: "Você entrou na loja. Veja os itens disponíveis.",
    },
    {
        nome: "floresta",
        botoes: ["Lutar contra goblin", "Lutar contra minotauro", "Voltar para a praça"],
        funcoes: [lutarGoblin, lutarMinotauro, irPraca],
        texto: "Você entrou na floresta. Cuidado com os inimigos.",
    },
    {
        nome: "luta",
        botoes: ["Atacar", "Esquivar", "Fugir"],
        funcoes: [atacar, esquivar, irPraca],
        texto: "Você está em combate!",
    },
    {
        nome: "vitoria",
        botoes: ["Voltar para a praça", "Voltar para a praça", "Voltar para a praça"],
        funcoes: [irPraca, irPraca, irPraca],
        texto: "O inimigo cai derrotado! Você ganhou experiência e ouro.",
    },
    {
        nome: "derrota",
        botoes: ["REINICIAR?", "REINICIAR?", "REINICIAR?"],
        funcoes: [reiniciar, reiniciar, reiniciar],
        texto: "Você foi derrotado... &#x2620;",
    },
    {
        nome: "vencedor",
        botoes: ["Jogar novamente?", "Jogar novamente?", "Jogar novamente?"],
        funcoes: [reiniciar, reiniciar, reiniciar],
        texto: "Parabéns! Você venceu o dragão e salvou a vila!",
    },
];


botao1.onclick = irLoja;
botao2.onclick = irFloresta;
botao3.onclick = lutarChefe;

function proximoNivel(n) {
  if (n === 1) {
    return 5;
  } else {
    return n + 5;
  }
}

function atualizarTela(localAtual) {
  statsInimigo.style.display = "none";
  botao1.innerText = localAtual.botoes[0];
  botao2.innerText = localAtual.botoes[1];
  botao3.innerText = localAtual.botoes[2];
  botao1.onclick = localAtual.funcoes[0];
  botao2.onclick = localAtual.funcoes[1];
  botao3.onclick = localAtual.funcoes[2];
  mensagem.innerHTML = localAtual.texto;
}

function irPraca() {
  atualizarTela(locais[0]);
}

function irLoja() {
  atualizarTela(locais[1]);
}

function irFloresta() {
  atualizarTela(locais[2]);
}

function comprarVida() {
  if (gold >= 10) {
    gold -= 10;
    hp += 10;
    atualizarStatus();
    mensagem.innerText = "Você comprou uma poção de vida e recuperou 10 de vida.";
  } else {
    mensagem.innerText = "Você não tem ouro suficiente para comprar poção de vida.";
  }
}

function comprarArma() {
  if (arma < listaArmas.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      arma++;
      mochila.push(listaArmas[arma].nome);
      atualizarStatus();
      mensagem.innerText = `Você adquiriu uma ${listaArmas[arma].nome}. Inventário: ${mochila.join(", ")}`;
    } else {
      mensagem.innerText = "Você não tem ouro suficiente para comprar arma.";
    }
  } else {
    mensagem.innerText = "Você já tem a melhor arma!";
    botao2.innerText = "Vender arma (15 ouro)";
    botao2.onclick = venderArma;
  }
}

function venderArma() {
  if (mochila.length > 1) {
    const vendida = mochila.pop();
    gold += 15;
    arma--;
    atualizarStatus();
    mensagem.innerText = `Você vendeu uma ${vendida}. Inventário: ${mochila.join(", ")}`;
  } else {
    mensagem.innerText = "Não venda sua única arma!";
  }
}

function lutarGoblin() {
  emBatalha = 0;
  comecarLuta();
}

function lutarMinotauro() {
  emBatalha = 1;
  comecarLuta();
}

function lutarChefe() {
  emBatalha = 2;
  comecarLuta();
}

function comecarLuta() {
  atualizarTela(locais[3]);
  hpInimigo = bichos[emBatalha].vida;
  statsInimigo.style.display = "block";
  nomeInimigo.innerText = bichos[emBatalha].nome;
  vidaInimigoTexto.innerText = hpInimigo;
}

function atacar() {
  mensagem.innerText = `O ${bichos[emBatalha].nome} investe contra você! Você contra-ataca com sua ${listaArmas[arma].nome}.`;
  hp -= calcularDano(bichos[emBatalha].nivel);

  if (acertouGolpe()) {
    let dano = listaArmas[arma].poder + Math.floor(Math.random() * lvl) + 1;
    hpInimigo -= dano;
  } else {
    mensagem.innerText += " Você errou o ataque.";
  }

  atualizarStatus();
  vidaInimigoTexto.innerText = hpInimigo;

  if (hp <= 0) {
    perdeu();
  } else if (hpInimigo <= 0) {
    if (emBatalha === 2) {
      venceu();
    } else {
      venceuBicho();
    }
  }

  if (Math.random() < 0.1 && mochila.length > 1) {
    let quebrada = mochila.pop();
    arma--;
    mensagem.innerText += ` Sua ${quebrada} quebrou!`;
  }
}

function calcularDano(nivelBicho) {
  let dano = (nivelBicho * 5) - Math.floor(Math.random() * lvl);
  return dano < 0 ? 0 : dano;
}

function acertouGolpe() {
  return Math.random() > 0.2 || hp < 20;
}

function esquivar() {
  mensagem.innerText = `Você desviou do ataque do ${bichos[emBatalha].nome}!`;
}

function venceuBicho() {
  gold += Math.floor(bichos[emBatalha].nivel * 50);
  lvl = proximoNivel(lvl);
  atualizarStatus();
  atualizarTela(locais[4]);
}

function perdeu() {
  atualizarTela(locais[5]);
}

function venceu() {
  atualizarTela(locais[6]);
}

function reiniciar() {
  lvl = 1;
  hp = 100;
  gold = 50;
  arma = 0;
  mochila = ["espada"];
  atualizarStatus();
  irPraca();
}

function atualizarStatus() {
  txtXP.innerText = lvl;
  txtHP.innerText = hp;
  txtGold.innerText = gold;
}