$(document).ready(function () {

    function countdown(){

        // Set the countdown duration in seconds
        let countdownDuration = 1 * 60; // 1 minutes in seconds

        // Get the span element where the countdown will be displayed
        let countdownElement = document.getElementById('countdown');

        // Function to update the countdown
        function updateCountdown() {
            const minutes = Math.floor(countdownDuration / 60);
            const seconds = countdownDuration % 60;

            // Display the remaining time in the span element
            countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            // Update the countdown duration
            countdownDuration--;

            // Check if the countdown has reached zero
            if (countdownDuration < 0) {
                clearInterval(countdownInterval);
                countdownElement.textContent = '0';
            }
        }

        // Call the updateCountdown function every second
        let countdownInterval = setInterval(updateCountdown, 1000);

        // Initial update to display the starting time
        updateCountdown();

    }
    async function forgot_btn(e) {
   
      let settings = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          email: $('#forgot_email').val()
        })
      };
        console.log('count')
      const myButton = document.getElementById('forgot_btn');
      // Call losding function
      start_loading(myButton)
      try {
        let fetchResponses = await fetch(`${backendUrl}/api/users/forgot`, settings);
        let sta = await fetchResponses.status
        let json = await fetchResponses.json();

        if (sta == 200) {
          
          
            $('.forgot_success').show()
            $('.forgot_success').text('A password reset link has been sent to your email address')
         setTimeout(function(){
            $('.forgot_success').text('')
            $('.forgot_success').hide()
         }, 5000)
         $('.forgot').hide()
         $('.preverify').show()
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

    $("#forgot_btn").click(async function (e) {
        forgot_btn()
    })

    $("#resend_btn").click(async function (e) {
        if($('#countdown').text() == '0'){
            forgot_btn()
        }    
    })
  }) 

