alert(baseUrl)
$(document).ready(function () {
    $("#login_btn").click(async function (e) {
      localStorage.setItem('drive_email', 'drrowly99@gmail.com');
alert(baseUrl)
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

          // unset all localstorage
      
          localStorage.setItem('access', 'Dashboard')
          localStorage.removeItem('previewAllArray')
          localStorage.removeItem('activeItemTimestamp')
          localStorage.removeItem('drive_email')
          localStorage.removeItem('firstzoommodal')
          localStorage.removeItem('my_goog_backup_storage')
          localStorage.removeItem('backup_stroage')
          localStorage.removeItem('backup_preferred')
          localStorage.setItem('editting', false)

          // call backend

          let options = {
            method: 'GET',
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              "Authorization": `Bearer ${json.token}`
              
            },
          };
          let backSave = await fetch(`${baseUrl}/exchange`, options);
          b_status  = backSave.status
          console.log(backSave)
          if(b_status == 200){
            console.log('something came back')
             // call backend
          $('#call_error').text('')
          $('#call_error').hide()
          $('#call_success').show()
          $('#call_success').text('')
          
          $('#call_success').append('Signin Successful')
          localStorage.setItem('access', json.token);
          localStorage.getItem('access');
          window.location.href = `${baseUrl}/dash`
            
          }else{
            end_loading(myButton, 'Sign in')
            return
          }

          

         


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
         end_loading(myButton, 'Sign in')
        }, 1000)
      }
    })
  }) 