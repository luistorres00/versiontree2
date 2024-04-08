const mongoose = require("mongoose");

// Definir modelo Mongoose para os dados
const dadoSchema = new mongoose.Schema({
  camera:{
    type: String,
  },
  curva: {
    type: String,
  },
  hora: {
    type: String,
  },
  video: {
    type: Boolean,
  },
  report: {
    type: Boolean,
  },
  nfa: {
    type: Boolean,
  },
  priority: {
    type: Boolean,
  },
  obs: {
    type: String,
  },
});

const Dados = mongoose.model("wfr", dadoSchema, "wfrs");

module.exports = Dados;
