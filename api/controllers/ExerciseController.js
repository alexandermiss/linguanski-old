/**
 * ExerciseController
 *
 * @description :: Server-side logic for managing Exercises
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `ExerciseController.word()`
   */
  word: function (req, res) {
    /*return res.json({
      todo: 'word() is not implemented yet!'
    });*/
    res.view('exercises/word');
  },


  /**
   * `ExerciseController.remenber()`
   */
  remenber: function (req, res) {
    return res.json({
      todo: 'remenber() is not implemented yet!'
    });
  }
};

