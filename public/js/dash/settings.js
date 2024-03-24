

async function setNewPwd() {
    let settings = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      },
      body: JSON.stringify({
        oldPassword: $('#set_oldPassword').val(),
        newPassword:$('#set_newPassword').val()
      })
    };
    try {
      let fetchResponses = await fetch(`${backendUrl}/api/users/setNewPassword `, settings);
      let staus = await fetchResponses.status
      let res = await fetchResponses.json();

      console.log(staus)
      if (staus == 301) {
        window.variant = 'warning'
        window.noti = 'It seems your old password is incorrect'
        $('#showPasswordChangedNotifiaction').click()
      } else if (staus == 400) {
        window.location.href = `${baseUrl}/auth`
      } else if (res.success == 1 && staus == 200) {
        $('#set_oldfPassword').val('');
        $('#set_newPassword').val('');
        window.noti = 'Password changed successfully'
        $('#showPasswordChangedNotifiaction').click()
    }

    }
    catch (err) {
      console.log('internet error')
      console.log(err)
    }
  }

  async function setNewPhoneNumber() {
   const input = $('#set_newPhoneNumber');
   $('#setNewPhoneNumber').attr('disabled', true)


      // Get the value of the input field
      const value = input.val();
      console.log(value)
      // Check if the value is a number
      if (isNaN(value)) {
        // Log an error if the value is not a number
        // console.log('Error: Input must be a number.');
        $('.error_newPhoneNumber').text('Error: Input must be a number.')
        $('#setNewPhoneNumber').attr('disabled', false)
        return
      } else if(value.length >= 11 ) {
          // Log an error if the value is greater than 11 or less than 8
          $('.error_newPhoneNumber').text('Error: Input must be between 8 and 11.')
          $('#setNewPhoneNumber').attr('disabled', false)
          return
        
      }else{
        $('.error_newPhoneNumber').text('')
      }
       

    let settings = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      },
      body: JSON.stringify({
        set_newPhoneNumber: $('#set_newPhoneNumber').val(),
      })
    };
    try {
      let fetchResponses = await fetch(`${backendUrl}/api/users/set_newPhoneNumber `, settings);
      let staus = await fetchResponses.status
      let res = await fetchResponses.json();

      if (staus == 301) {
        window.variant = 'error'
        window.noti = 'Opps..! A problem occured'
        $('#showPasswordChangedNotifiaction').click()
      } else if (staus == 400) {
        window.location.href = `${baseUrl}/auth`
      } else if (res.success == 1 && staus == 200) {

        $('#setNewPhoneNumber').attr('disabled', false)
        window.variant = 'error'
        $('#set_newPhoneNumber').val('');
        window.noti = 'Phone Number changed successfully'
        $('#showPasswordChangedNotifiaction').click()
    }

    }
    catch (err) {
      
      window.variant = 'warning'
      window.noti = err
      $('#showPasswordChangedNotifiaction').click()
   
    }
  }
