const express = require("express");
const router = express.Router();
const {
  addController,
  getController,
  dropController,
  putController,
  addNumpadController,
  dropNumpadController,
  getNumpadController,
  addRaceController,
  getRaceController,
  putNumpadController,
  addObsOptionsController,
  getObsOptionsController,
  dropObsOptionsController,
  putObsOptionsController,
} = require("../controller/indexcont");

//CRUD
// Rota para adicionar dados ao banco de dados
router.post("/addData", addController.addData);

// Rota para buscar todos os dados do banco de dados
router.get("/getData", getController.getData);

// Rota para apagar todos os dados do banco de dados
router.post("/dropData", dropController.dropData);

// Rota para apagar um único documento
router.delete("/dropData/:id", dropController.dropOneData);

// Rota para atualizar todos os dados do banco de dados
router.post("/updateData/:id", putController.putData);

// Rota para dicionar um numero ao numpad
router.post("/addDataNumpad", addNumpadController.addDataNumpad);

// Rota para remover numero do numpad
router.post("/dropDataNumpad", dropNumpadController.dropDataNumpad);

// Rota para consultar numero do numpad
router.get("/getDataNumpad", getNumpadController.getDataNumpad);

// Rota para atualizar dados do numpad
router.post("/updateNumpad/:id", putNumpadController.putNumpadData);

// Rota para adicionar opções ás observações
router.post("/addObsOptions", addObsOptionsController.addObsOptions);

// Rota para buscar todas as opcoes a base de dados
router.get("/getObsOptions", getObsOptionsController.getObsOptions);

// Rota para apagar todas as opções na base de dados
router.post("/dropObsOptions", dropObsOptionsController.dropObsOptions);

// Rota para apagar uma única opção
router.delete("/dropObsOptions/:id", dropObsOptionsController.dropOneObsOption);

// Rota para atualizar uma oção
router.post("/updateObsOptions/:id", putObsOptionsController.putObsOptions);

// Rota para adicionar RACE
router.post("/addRace", addRaceController.addRace);

// Rota para consultar Last RACE
router.get("/getLRace", getRaceController.getLastRaceId);

module.exports = router;
