const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const initialState = {
    player: {
      lvl: 1,
      hp: 100,
      gold: 50,
    },
    location: {
      botoes: ["Ir para a loja", "Explorar a floresta", "Enfrentar o chefe"],
      texto:
        "Bem-vindo ao Save the Village! Seu objetivo é derrotar o dragão que está ameaçando a vila. Você está na praça da vila. Para onde deseja ir? Use os botões acima.",
    },
  };

  res.render("index", initialState);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando! Acesse o jogo em http://localhost:${PORT}`);
});
