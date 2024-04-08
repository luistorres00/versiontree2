const express = require("express");
const router = express.Router();
const {
  addController,
  getController,
  dropController,
  putController,
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

module.exports = router;
