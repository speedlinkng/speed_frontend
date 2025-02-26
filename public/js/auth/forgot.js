$(document).ready(function () {
  let countdownInterval; // Declare the interval variable globally

  function countdown() {
    // Set the countdown duration to 5 minutes (300 seconds)
    let countdownDuration = 5 * 60;

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

        // Show the "Resend" button and hide the countdown
        $('#resend_btn').show();
        $('#forgot_btn').hide();
      }
    }

    // Call the updateCountdown function every second
    countdownInterval = setInterval(updateCountdown, 1000);

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

    const myButton = document.getElementById('forgot_btn');
    // Call loading function
    start_loading(myButton);

    try {
      let fetchResponses = await fetch(`${backendUrl}/api/users/forgot`, settings);
      let sta = await fetchResponses.status;
      let json = await fetchResponses.json();

      if (sta == 200) {
        $('.forgot_success').show();
        $('.forgot_success').text('A password reset link has been sent to your email address');
        setTimeout(function () {
          $('.forgot_success').text('');
          $('.forgot_success').hide();
        }, 5000);

        $('.forgot').hide();
        $('.preverify').show();
        countdown(); // Start the countdown
      } else if (sta == 302 || sta == 303 || sta == 403) {
        // Handle other status codes if needed
      } else {
        // Handle other cases
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(function () {
        // end_loading(myButton, 'Send Link');
      }, 1000);
    }
  }
  async function forgot_btn_(e) {
    let settings = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        email: $('#forgot_email').val()
      })
    };

    const myButton = document.getElementById('forgot_btn');
    // Call loading function
    start_loading(myButton);

    try {
      let fetchResponses = await fetch(`${backendUrl}/api/users/forgot`, settings);
      let sta = await fetchResponses.status;
      let json = await fetchResponses.json();

      if (sta == 200) {
        $('.forgot_success').show();
        $('.forgot_success').text('A password reset link has been sent to your email address');
        setTimeout(function () {
          $('.forgot_success').text('');
          $('.forgot_success').hide();
        }, 5000);

        $('.forgot').hide();
        $('.preverify').show();
        countdown(); // Start the countdown
      } else if (sta == 302 || sta == 303 || sta == 403) {
        // Handle other status codes if needed
      } else {
        // Handle other cases
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(function () {
        // end_loading(myButton, 'Send Link');
      }, 1000);
    }
  }

  $("#forgot_btn").click(async function (e) {
    forgot_btn();
  });

  $("#resend_btn").click(async function (e) {
    if ($('#countdown').text() == '0') {
      alert('countdownlicked')
      forgot_btn_();
    }
  });
});