module.exports = function(app) {
	var BudgetAdwords = app.models.budgetAdwords;

	var controller = {};

	controller.salvar = function(req, res) {
		var _id = req.body._id;

		if (_id) {
			BudgetAdwords.findByIdAndUpdate(_id, req.body)
				.exec()
				.then(
					function (resultado) {
						res.json(resultado);
					},
					function (error) {
						console.log(error);
					});
		} else {
			BudgetAdwords.create(req.body)
				.then(
					function (resBudgetAdwords) {
						res.status(201).json(resBudgetAdwords);
					},
					function (error) {
						console.log(error);
					});
		}
	};

	controller.budgetAdwordsPorLogin = function(req, res) {
		BudgetAdwords
			.find({ 
				objectIdLogin: req.params.objectIdLogin
			})
			.exec()
			.then(
				function (resBudgetAdwords) {
					res.json(resBudgetAdwords);
				},
				function (error) {
					console.log(error);
				});
	};


	return controller;
}