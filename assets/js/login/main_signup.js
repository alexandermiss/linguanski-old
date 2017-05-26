$(function(){

  if( __n('#signupForm') ) return;

  $('.ui .checkbox').checkbox();

  $('form')
    .form({
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
        },
        password2: {
          identifier  : "password2",
          rules: [
            {
              type   : "empty",
              prompt : "Please enter your password"
            },
            {
              type   : "match[password]",
              prompt : "Your password does not mismatch"
            }
          ]
        },
        conditions: {
          identifier  : "conditions",
          rules: [
            {
              type   : "checked",
              prompt : "Please check the terms and conditions"
            },
          ]
        }
      },
      onSuccess: function (event, fields){
        event.preventDefault();

          $.post('/auth/register', {
              email: fields.email,
              password: fields.password,
              name: fields.name
            })
            .done(function(data){
              if(data && data.auth){
                window.location.href='/settings/first/configuration';
              }
            }).fail(function(data){
                console.log('fail', data);
            });

      }
    });
});
