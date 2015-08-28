var request = require("request");

module.exports = function(app) {
	var Unbounce = app.models.unbounce;

	var controller = {};

	controller.salvar = function(req, res) {
    var _id = req.body._id;

    if (_id) {
      Unbounce.findByIdAndUpdate(_id, req.body)
        .exec()
        .then(
          function (resLogin) {
            res.json(resLogin);
          },
          function (error) {
            console.log(error);
          });
    }
    else {
    	Unbounce.create(req.body)
      		.then(
        		function (login) {
          			res.status(201).json(login);
        		},
        		function (error) {
          			console.log(error);
        		});
          }
  	};

  controller.excluir = function(req, res) {
    Unbounce.findOneAndRemove({

      _id: req.params.id

    }, function(resultado){

    }, function(error){
      
    });
  };

  controller.retornarPaginasPorObjectId = function(req, res) {
    Unbounce
      .find({ 
        objectIdLogin: req.params.objectId
      })
      .exec()
      .then(
        function (resultadoCampanhas) {
          res.json(resultadoCampanhas);
        },
        function (error) {
          console.log(error);
        });
  };

	return controller;
}