$(document).ready(function () {
    //REPLACE ID IN URL

    let url_params = new URLSearchParams(window.location.search)
    console.log(url_params.get('id'))

    if (url_params == null || url_params == '') {

    }

    async function open(url_params) {

      let settings = {
        method: 'GET',
      };


      try {
        let fetchRecord = await fetch(`http://localhost:5000/api/app/getrecordbyidnoauth/${url_params.get('id')}`, settings);
        let fetchSettings = await fetch(`http://localhost:5000/api/app/getsettingbyidnoauth/${url_params.get('id')}`, settings);
        let statuz = await fetchRecord.status
        let record = await fetchRecord.json();
        let set = await fetchSettings.json();


        console.log('folder ' + record.data.folder)
        console.log('folder_id ' + record.data.folder_id)

        // store google access token, folderName and folderId in localstorage
        localStorage.setItem('b_token', set.token)
        localStorage.setItem('folder_id', record.data.folder_id)
        localStorage.setItem('folder', record.data.folder_id)

        // initialize questions
        let savedQuestions = record.data.questions
        localStorage.setItem('savedQuestions', record.data.questions)


        // loop through questions and append them to form on the page
        const questArray = savedQuestions.split(', ');
        questArray.forEach(function (question, index) {
          const newInput = $( /*html*/`
          <label class="block mt-1">
            <span class="capitalize">${question}?</span>

            <input
              class="question_class form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
              placeholder=""
              id="upload_email"
              type="text"
              value="mmm"
            />
            <span class="text-red-400 question_class_error${index}"></span>
          </label>
          `);
          $('#include_questions').append(newInput);
        });


        if (statuz == 301) {
          $('#main_content').hide()
          $('#upload_title').text('Link Expired')
          // window.location.href = `http://127.0.0.1:5502/dist/auth/signin.html`
        } else {

        }

        // make use of settings details
        if (set.ask_name == 'true') {

        }
        if (set.send_notification == 'true') {

        }
        // QUANTITY SETTINGS
        if (set.quantity == 'multiple_files') {

        } else if (set.quantity == 'multiple_files') {

        } else {

        }
        // UPLOAD SIZE SETTINGS
        if (set.upload_size == 'any_size') {

        } else if (set.upload_size == 'custom') {

        } else {

        }

        if (set.file_type == 'true') {

        }

        /*
        const inputString = "John,Doe,30";
  
        // Split the string into an array using a comma as the delimiter
        const parts = inputString.split(',');
  
        // Count how many parts were generated
        const numberOfParts = parts.length;
  
        // Assign the array elements to variables
        const firstName = parts[0];
        const lastName = parts[1];
        const age = parseInt(parts[2]); // Convert age to an integer
  
        console.log("First Name:", firstName);
        console.log("Last Name:", lastName);
        console.log("Age:", age);
        */


        if (record.error == 2) {
          window.location.href = "/dist/auth/signin.html";
        }
        if (record.status == 200) {
          $('#upload_title').html(`<span class="capitalize">${record.data.record_name}</span>`)
          $('#upload_description').text(record.data.description)
          // $('#upload_title').text(record.data.record_name)
          //console.log(json.data)
          //window.location.href = "/dist/dashboard/share.html";        
        } else {
          console.log('Going to chunk 2')


        }
      } catch (e) {
        // WHEN BACKEND HANDLES NO URL ID
        console.log('hmm')
        console.log(e);
      }
    }
    open(url_params)
}) 
