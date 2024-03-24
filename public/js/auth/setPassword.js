
$(document).ready(function () {


    async function change_pwd(e) {
    
      let settings = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          new_pwd: $('#new_password').val(),
          conf_new_pwd: $('#confirm_new_password').val(),
          user_id: $('#user_id').val()
        })
      };
        console.log('count')
      const myButton = document.getElementById('update_pwd_btn');
      // Call losding function
      start_loading(myButton)
      try {
        let fetchResponses = await fetch(`${backendUrl}/api/users/changeForgotPassword`, settings);
        let sta = await fetchResponses.status
        let json = await fetchResponses.json();

        if (sta == 303) {
            $('#pwd_change_success').hide()  
            $('#pwd_change_error').show()
            $('#pwd_change_error').text(json.message)
         setTimeout(function(){
            $('#pwd_change_error').text('')
            $('#pwd_change_error').hide()
         }, 5000)
        }
        if (sta == 200) {
            $('#pwd_change_error').hide()
            $('#pwd_change_success').show()
            $('#pwd_change_success').text('Password successfully changed, redirecting ...')
         setTimeout(function(){
            $('#pwd_change_success').text('')
            $('#pwd_change_success').hide()
           

         }, 5000)
         setTimeout(()=>{
            window.location.href = `${baseUrl}/auth`
         }, 2000)
         countdown()
        

        }
        else if (sta == 302) {
          

        }
        else if (sta == 303) {
          
        }
        else if (sta == 403) {
         
        }
        else {
  
        }

      } catch (e) {
        // console.log(e);
      } finally {
        setTimeout(function () {
         end_loading(myButton, 'Send Link')
        }, 1000)
      }
    }



    function validatePassword(password) {
        const minLengthRegex = /.{6,}/;
        const letterAndNumberRegex = /^(?=.*[a-zA-Z])(?=.*\d)/;
        const capitalLetterRegex = /[A-Z]/;
    
        const errors = [];
    
        if (!minLengthRegex.test(password)) {
            errors.push('Password must be at least 6 characters long.');
        }
    
        if (!letterAndNumberRegex.test(password)) {
            errors.push('Password must contain both letters and numbers.');
        }
    
        if (!capitalLetterRegex.test(password)) {
            errors.push('Password must contain at least one capital letter.');
        }
    
        return errors;
    }
    
    function validatePassword(password) {
        const minLengthRegex = /.{6,}/;
        const letterAndNumberRegex = /^(?=.*[a-zA-Z])(?=.*\d)/;
        const capitalLetterRegex = /[A-Z]/;
    
        const errors = [];
    
        if (!minLengthRegex.test(password)) {
            $('#pwd_change_error').show()
            errors.push('Password must be at least 6 characters long.');
        }
    
        if (!letterAndNumberRegex.test(password)) {
            $('#pwd_change_error').show()
            errors.push('Password must contain both letters and numbers.');
        }
    
        if (!capitalLetterRegex.test(password)) {
            $('#pwd_change_error').show()
            errors.push('Password must contain at least one capital letter.');
        }
    
        return errors;
    }
    
    

    $("#update_pwd_btn").click(async function (e) {
        

        const password = $('#new_password').val()
        const errors = validatePassword(password);
        const passwordErrorSpan = document.getElementById('pwd_change_error');
    
        if (errors.length > 0) {
            // Display errors in the span element
            // $('#pwd_change_error').show()
            // $('#pwd_change_error').text(json.message)
            passwordErrorSpan.textContent = errors.join(' ');
            return;
        }
    
        change_pwd()
    })

  }) 

