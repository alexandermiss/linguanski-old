/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res, next){

		User.find({activated: true}).then(function(users){
			this.users = users;
			return Phrase.find({});
		})
		.then(function(phrases){
			this.phrases = phrases;
			return Language.find({});
		})
		.then(function(languages){
			return res.view('homepage', {
				layout: 'landing_layout',
				users: this.users,
				phrases: this.phrases,
				languages: languages
			});
		})
		.catch(function(err){
			return res.serverError(err);
		});

	}
};
