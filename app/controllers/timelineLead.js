module.exports = function(app) {
	var TimelineLead = app.models.timelineLead;

	var controller = {};

	controller.salvarTimelineLead = function(req, res) {
		var _id = req.body._id;

		if (_id) {
			TimelineLead.findByIdAndUpdate(_id, req.body)
				.exec()
				.then(
					function (resultadoTimelineLead) {
						res.json(resultadoTimelineLead);
					},
					function (error) {
						console.log(error);
					});

		} else {
			TimelineLead.create(req.body)
				.then(
					function (timelineLead) {
						res.status(201).json(timelineLead);
					},
					function (error) {
						console.log(error);
					});
		}
	};

	controller.excluirTimelineLead = function(req, res) {
		TimelineLead.findOneAndRemove({
			_id: req.params.id
		}, function(ok){
		}, function(error){
		});
	};

	controller.consultarTimelineLead = function(req, res) {
		TimelineLead
			.find({ 
				objectIdLogin: req.params.objectId,
				objectIdLead: req.params.idLead
			})
			.exec()
			.then(
				function (resultadoTimelineLead) {
					res.json(resultadoTimelineLead);
				},
				function (error) {
					console.log(error);
				});
	};

	return controller;
}
