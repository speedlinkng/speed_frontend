
  // Handle FORM IMPUTS
  function hasMultipleNames(nameToVerify) {
    // Split the input string by space
    const names = nameToVerify.split(' ');

    // Check if the array has more than one element
    return names.length > 1;
  }

  function isValidEmail(email) {
    // Regular expression for a basic email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    return emailRegex.test(email);
  }


  // HANDLE QUESIONS-------

  function processQuestions(stopLoop) {
    let ans = "";

    // Select all elements with the class "prime"
    $('.question_class').each(function (index) {

      console.log(`${index}`)
      // Get the input value
      let answer = $(this).val();
      // check if the fields are empty
      if (answer == '') {
        console.log('empty')
        $(`.question_class_error${index}`).text(`Question ${index + 1} field is required`)
        stopLoop = true
        localStorage.setItem('stopLoop', true);
        return

      } else {
        $(`.question_class_error${index}`).text('')
        console.log('not empty')
        localStorage.setItem('stopLoop', false); // set to false to continue
      }


      ans += (index > 0 ? ', ' : '') + answer;

      // Log the result to the console
      console.log(` ANS :${answer}`);



    })


    let _answer = $( /*html*/`
          <label class="block mt-1">


            <input
              class="question_class form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
              placeholder=""
              id="answered"
              type="text"
              value="${ans}"
            />
          
          </label>
          `);

    $('#include_questions').append(_answer);

    console.log(` all answer :${ans}`);

    // stop the entire function

  }




  // handle Image alternation
  function next() {
    if ($('#upload_email').val() == '') {
      $('#up_email_err').text('Email field is required')

    } else {
      $('#up_email_err').text('')
    }
    if ($('#upload_name').val() == '') {
      $('#up_name_err').text('Name field is required')
      return
    } else {
      $('#up_name_err').text('')
    }


    // If questions is aailable, then open this function
    if (localStorage.getItem('savedQuestions') != null) {
      var stopLoop = false;
      processQuestions(stopLoop)
    }

    // STOP NEXT IF stoploop is true
    stopLoop = localStorage.getItem('stopLoop');

    if (stopLoop === 'true') {

      return; // Returning false from the callback stops the loop

    }



    // VERIFY EMAIL ADDRESS ------
    const emailToVerify = $('#upload_email').val();
    if (isValidEmail(emailToVerify)) {

    } else {
      $('#up_email_err').text(`${emailToVerify} is not a valid email address.`)
      return;
    }

    //VERIFY NAME  --------
    const nameToVerify = $('#upload_name').val(); // Replace with the input you want to check

    if (hasMultipleNames(nameToVerify)) {
      console.log(`The input "${nameToVerify}" .`);
    } else {
      $('#up_email_err').text(`Please input your first and last name.`)
      return;
    }


    $('#up_name_err').text('')
    $('#up_email_err').text('')

    // HIDE AND SHOW SECTIONS
    $('#image_section').show()
    $('#next_section').hide()
    $('#upload_button').show()
    $('#next_section').hide()
  }


