module.exports = function(app) {
	var Campanha = app.models.campanhas;

	var controller = {};

	controller.salvar = function(req, res) {
		var _id = req.body._id;

		if (_id) {
			Campanha.findByIdAndUpdate(_id, req.body)
				.exec()
				.then(
					function (resultado) {
						res.json(resultado);
					},
					function (error) {
						console.log(error);
					});
		} else {
			Campanha.create(req.body)
				.then(
					function (campanha) {
						res.status(201).json(campanha);
					},
					function (error) {
						console.log(error);
					});
		}
	};

	controller.excluir = function(req, res) {
    	Campanha.findOneAndRemove({
      		_id: req.params.id
    	}, function(resultado){
    	}, function(error){
    	});
  };

	controller.campanhasPorLogin = function(req, res) {
		Campanha
			.find({ 
				objectIdLogin: req.params.objectIdLogin
			})
			.exec()
			.then(
				function (campanha) {
					res.json(campanha);
				},
				function (error) {
					console.log(error);
				});
	};

	return controller;
}