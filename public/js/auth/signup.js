
  $(document).ready(function () {
    $("#signup_button").click(async function (e) {
      localStorage.setItem('drive_email', 'drrowly99@gmail.com');

      let settings = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          email: $('#signup_email').val(),
          first_name: $('#signup_firstName').val(),
          last_name: $('#signup_lastName').val(),
          number: $('#signup_phone').val(),
          password: $('#signup_password').val(),
          passwordConfirmation: $('#signuo_passwordConfirmation').val()
        })
      };

      const myButton = document.getElementById('signup_button');
      // Call losding function
      start_loading(myButton)
      try {
        let fetchResponses = await fetch(`${backendUrl}/api/users/`, settings);
        // let head = await fetchResponses.headers
        let sta = await fetchResponses.status
        let json = await fetchResponses.json();



        if (sta == 200) {
          $('#call_error_').hide()
          $('#call_success_').show()
          $('#call_success_').text('')
          $('#call_success_').append('Signup Successful')
          localStorage.setItem('access', json.token);
          localStorage.getItem('access');
          window.location.href = `${baseUrl}/auth/signin`


        }

        else if (sta == 401) {
          console.log(json.message)
          $('#call_error_').show('')
          $('#call_error_').text('')
          $('#call_error_').append(json.message)

        }
        else if (sta == 301) {
          console.log(json.message)
          $('#call_error_').show('')
          $('#call_error_').text('')
          $('#call_error_').html(json.message)

        }
        else if (sta == 403) {
          $('#call_error_').show()
          $('#call_error_').text('')
          for (i = 0; i < json.message.length; i++) {
            console.log(json.message[i])
            let msg = `<p>${json.message[i]}</p>`
            $('#call_error_').append(msg)
          }

        }
        else {
          console.log(sta)

        }

      } catch (e) {
        console.log(e);
      }finally {
        setTimeout(function () {
         end_loading(myButton, 'Sign up')
        }, 1000)
      }
    })
  }) 
