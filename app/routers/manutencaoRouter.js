module.exports = (app) => {
  
  const manutencao = app.controller.manutencao;
 

  app.get("/manutencao", (req, res) => manutencao.getManutencao(req, res));
  

  return this;
};
