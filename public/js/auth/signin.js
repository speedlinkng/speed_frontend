$(document).ready(function () {
    $("#login_btn").click(async function (e) {
      localStorage.setItem('drive_email', 'drrowly99@gmail.com');

      let settings = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          email: $('#signin_email').val(),
          password: $('#signin_password').val()
        })
      };

      const myButton = document.getElementById('login_btn');
      // Call losding function
      start_loading(myButton)
      try {
        let fetchResponses = await fetch(`${backendUrl}/api/users/login`, settings);
        // let head = await fetchResponses.headers
        let sta = await fetchResponses.status
        let json = await fetchResponses.json();



        if (sta == 200) {
          $('#call_error').text('')
          $('#call_error').hide('')
          $('#call_success').show()
          $('#call_success').text('')
          
          $('#call_success').append('Signup successful')
          localStorage.setItem('access', json.token);
          localStorage.getItem('access');
          window.location.href = `${baseUrl}/dash`


        }
        else if (sta == 302) {
          console.log(json.message)
          $('#call_error').show()
          $('#call_error').text('')
          $('#call_error').append(json.message)

        }
        else if (sta == 303) {
          console.log(json.message)
          $('#call_error').show()
          $('#call_error').text('')
          $('#call_error').append(json.message)

        }
        else if (sta == 403) {
          $('#call_error').show()
          $('#call_error').text('')
          for (i = 0; i < json.message.length; i++) {
            console.log(json.message[i])
            let msg = `<p>${json.message[i]}</p>`
            $('#call_error').append(msg)
          }

        }
        else {
          console.log(sta)
          console.log(json)
        }

      } catch (e) {
        console.log(e);
      } finally {
        setTimeout(function () {
         end_loading(myButton)
        }, 1000)
      }
    })
  }) 