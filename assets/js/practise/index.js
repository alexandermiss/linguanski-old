var app = {};
$(function(){

  var Letter = Backbone.Model.extend({});
  var Letters = Backbone.Collection.extend({model: Letter});

  var Phrase = Backbone.Model.extend({
    defaults: {
      phrase: 'отлично'
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

    events:{
      'keyup @ui.input': 'onKey'
    },

    onKey: function (e){
      this.triggerMethod('typing:item', this);
    },

    focusItem: function (){
      this.ui.input.focus();
    }

  });

  var ListView = Marionette.CollectionView.extend({
    childView: InputView,

    onChildviewTypingItem: function ( chilView ){
      var letter_typed  = chilView.ui.input.val().toLowerCase();
      var letter_orig   = chilView.model.get('letter').toLowerCase();
      var phrase        = this.collection.phrase;
      var cursor        = this.collection.cursor;

      console.log('letter_typed item...', letter_typed);
      console.log('current item...', cursor);
      console.log('phrase...', this.collection.pluck('letter'), phrase);

      // if ( phrase == this.collection.pluck('letter').join('') ){
      //   console.log('completed', phrase)
      // }else
      if ( letter_orig == letter_typed && cursor < this.collection.size() ){
        if ( cursor > this.collection.size() - 1
          || this.collection.cursor > this.collection.size() - 1 ){
          cursor = this.collection.size() - 1;
          this.collection.cursor = (cursor+1);
        }
        else {
          this.collection.phrase += letter_typed;
          if ( ( cursor + 1 ) != this.collection.size() ){

            var m = this.collection.findWhere({i: (cursor+1)});
            m.trigger('focusItem');
          }
        }
        chilView.$el.removeClass('red').addClass('green');
        this.collection.cursor++;
        cursor++;
        console.log('next item...', cursor);

      }else{
        chilView.$el.addClass('red').transition({
          animation:'jiggle',
          onComplete: function(){
            chilView.$el.removeClass('red');
          }
        });
        chilView.ui.input.val('');
      }
    }
  });

  var App = Marionette.Application.extend({
    region: '#typing',

    onStart: function (){
      var self = this;
      var phr = new Phrase()
      ,   col = new Letters();

      _.each(phr.get('phrase').split(''), function (l, i){
        col.add( new Letter({letter: l, i: i}) );
      });
      col.cursor = 0;
      col.phrase = '';
      app.col = col;
      self.showView( new ListView({ collection: col }) );
    }
  });

  if( Backbone.$('#typing').length ){
    app = new App();
    app.start();
  }

});
