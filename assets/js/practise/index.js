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
      this.listenTo(this.model, 'focusItem', this.focusItem);
    },
    ui: {
      input: 'input'
    },
    triggers:{
      'keyup @ui.input': 'typing:item'
    },
    onKey: function (e){
      console.log(e);
      // console.log('InputView item selected: ', this.model.toJSON());
    },
    focusItem: function (){
      this.ui.input.focus();
    }
  });

  var ListView = Marionette.CollectionView.extend({
    childView: InputView,

    // onChildviewSelectItem: function (chilView){
    //   var cursor = this.collection.cursor;
    //   console.log('ListView item selected: ', chilView.model.toJSON(), cursor);
    // },
    onChildviewTypingItem: function (chilView){
      console.log(arguments);
      // if ( chilView.model.get('letter') == '' )
      var cursor = this.collection.cursor++;
      var m = this.collection.findWhere({i: cursor});
      m.trigger('focusItem');
      // console.log(m);
      // console.log('Typing item selected: ', chilView.model.toJSON(), cursor);
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
      col.cursor = 1;
      self.showView( new ListView({ collection: col }) );
    }
  });

  app = new App();
  app.start();

});
