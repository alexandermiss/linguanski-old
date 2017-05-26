$(function(){

  if( __n('#signinForm') ) return;

  $('form').form({
      fields: {
        email: {
          identifier  : "email",
          rules: [
            {
              type   : "empty",
              prompt : "Please enter your name"
            },
            {
              type   : "email",
              prompt : "Please enter a valid e-mail"
            }
          ]
        },
        password: {
          identifier  : "password",
          rules: [
            {
              type   : "empty",
              prompt : "Please enter your password"
            },
            {
              type   : "length[8]",
              prompt : "Your password must be at least 8 characters"
            }
          ]
        }
      },
      onSuccess: function (event, fields){
        event.preventDefault();

        $.post('/auth/login', {
            email: fields.email,
            password: fields.password,
            name: fields.name
          })
          .done(function(data){
            console.log('done', data);
            if(data && data.auth){
              window.location.href='/dashboard';
            }
          }).fail(function(data){
              console.log('fail', data);
          });

      }
    });
});
