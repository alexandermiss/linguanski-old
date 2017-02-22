var app = {};
$(function(){

  var Letter = Backbone.Model.extend({});
  var Letters = Backbone.Collection.extend({model: Letter});

  var Phrase = Backbone.Model.extend({
    defaults: {
      phrase: 'привет'
    }
  });

  var InputView = Marionette.View.extend({
    tagName: 'div',
    className: 'ui basic label letter',
    template: Template.get('form_typing'),
    initialize: function (){

    },
    ui: {
      input: 'input'
    },
    events: {
      'keyup @ui.input': 'onKey'
    },
    triggers:{
      'click input': 'select:item'
    },
    onKey: function (e){
      console.log('InputView item selected: ', this.model.toJSON());
    },
  });

  var ListView = Marionette.CollectionView.extend({
    childView: InputView,
    modelEvents: {
      ''
    },
    onChildviewSelectItem: function (chilView){
      console.log('ListView item selected: ', chilView.model.toJSON());
    }
  });

  var App = Marionette.Application.extend({
    region: '#typing',

    onStart: function (){
      var self = this;
      var phr = new Phrase()
      ,   col = new Letters();

      _.each(phr.get('phrase').split(''), function (l, i){
        console.log(l, i);
        col.add( new Letter({letter: l, i: i}) );
      });
      self.showView( new ListView({ collection: col }) );
    }
  });

  app = new App();
  app.start();

});
