$('.app-preloader').show()

function downloadExcel() {
  var table = document.getElementById('submissionsTable');
  var ws = XLSX.utils.table_to_sheet(table);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  /* save to file */
  XLSX.writeFile(wb, 'table.xlsx');
}

function downloadWord() {
  var table = document.getElementById('submissionsTable');
  var content = '<html><body>' + table.outerHTML + '</body></html>';
  var converted = htmlDocx.asBlob(content);

  /* save to file */
  saveAs(converted, 'table.docx');
}

function downloadCSV() {
  var table = document.getElementById('submissionsTable');
  var ws = XLSX.utils.table_to_sheet(table);
  var csv = XLSX.utils.sheet_to_csv(ws);

  /* create a Blob from the string and save it as a CSV file */
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var link = document.createElement('a');
  var url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', 'table.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadPDF() {
  // Set custom options for jsPDF and jspdf-autotable
  var doc = new jsPDF({
      orientation: 'landscape', // 'portrait' or 'landscape'
      unit: 'in', // inches, mm, cm, or pt
      format: 'a3' // See jsPDF documentation for other formats
  });

  // Set custom font size for the table
  var fontSize = 10; // Font size in points
  doc.setFontSize(fontSize);

  // Generate PDF from the HTML table
  doc.autoTable({ 
      html: '#submissionsTable',
      startY: 0.75 // Position of the table from the top of the page (in inches)
  });

  // Save the PDF file
  doc.save('editable_table.pdf');
}


async function downloadZip_sub(){
  let  user_google_id = 12
  $.ajax({
    url: `${backendUrl}/api/google/downloadFolderAsZip/${user_google_id}/${folder_id}/${storage_email}`,
    type: 'GET',
    beforeSend: function(){
 
    },
    success: function(response) {
      // Handle successful response
      $('#output').html(response);
    },
    error: function(xhr, status, error) {
      // Handle error
      $('#output').html('Error: ' + status);
    }
  });
}

async function backToDashboard() {

   
    console.log($('.hold_create_button'))
    // $('.submission_for').text(subfor)
    $('#dashoard').show()
    $('#submissions').hide()
    $('#submissionsTable').show()
  }
  // get submitted records
  async function getSubmittedRecords(record_id) {

  let settings = {
    method: 'GET',
    headers: {
    "Authorization": `Bearer ${localStorage.getItem('access')}`,
  }
  };
  try {
  let fetchResponses = await fetch(`${backendUrl}/api/app/getSubmissionById/${record_id}`, settings);
  let Sub_staus = await fetchResponses.status
  let Sub_res = await fetchResponses.json();

  console.log('{{{{{{{{{{{{{{{{{{{{{{{{success}}}}}}}}}}}}}}}}}}}}}}}}')
  if (Sub_res.error == 1) {
  } else if (Sub_res.error == 2) {

  } else if (Sub_res.success == 1 && Sub_staus == 200) {


  if (Sub_res.data != '') {
    let jsonString = JSON.stringify(Sub_res.data);
    // console.log('jsonString', jsonString)
    console.log('data', Sub_res.data)
    let data = Sub_res.data
    $('#displaySubmit').html('') // EMPTY THE HTML DISPLAY HOLDER
    data.forEach((rez, No) => {

    let viewL= '' 
    let downloadL= '' 
    let submittedBy = ''
    let fileLinks = ''
    let submit_data = rez.submitted_data
    let file_urls = rez.file_urls
    let reply_links = rez.reply_links
    console.log('reply_links')
    console.log(rez)
    if(reply_links != null){
      console.log(reply_links[0].webViewLink)
      console.log(reply_links[0].downloadLink)
      viewL = reply_links[0].webViewLink
      downloadL = reply_links[0].downloadLink
    }else{
      viewL = null
      downloadL = null
    }

    console.log(submit_data)
    console.log(file_urls)
    if(submit_data != null){
    console.log(rez.submitted_data)
      let matchingField
      const targetFieldName = "Your Name";
      const formReplies = rez.submitted_data.formReplies['0'];

      // Check if targetFieldName exists, case-insensitive
      if (formReplies && typeof formReplies === 'object') {
         matchingField = Object.values(formReplies).find(field => {
          return field.fieldName.toLowerCase() === targetFieldName.toLowerCase();
        });
      
        console.log(matchingField); // { fieldName: 'firstName', value: 'John' }
      }

      if (matchingField) {
      submittedBy = matchingField.fieldValue;
      console.log(`Entry ${rez.id} has ${targetFieldName} with value: ${submittedBy}`);

      // Set submittedBy in the entry
      // entry.submittedBy = submittedBy;
      } else {
      console.log(`Entry ${rez.id} does not have ${targetFieldName}`);
      }
    }




  if(file_urls != null){
  file_urls.forEach((file_link, index) => {
  fileLinks += `<div class="border rounded-md space-x-1 flex w-fit mt-[2px]">
    <span class="p-1.5 hover:text-primary"><a class="text-xs lowercase" href="${file_link.webViewLink}" target="_blank">${(file_link.webViewLink).slice(0, 40).concat("...")}</a></span>

    <span class="p-2 border-l text-success hover:text-success/20 flex justify-center items-center">
      <a href="${file_link.downloadLink}" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-arrow-down" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M7.646 10.854a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 9.293V5.5a.5.5 0 0 0-1 0v3.793L6.354 8.146a.5.5 0 1 0-.708.708z" />
          <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
        </svg>
      </a>
    </span>
  </div>`
  // console.log(`${file_link.downloadLink} && ${file_link.webViewLink}`)
  })
  }


  $('#displaySubmit').append(
  /*html*/
  `
  <tr class="capitalize border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
    <td class="whitespace-nowrap px-4 py-3 sm:px-5">
      ${No}
    </td>
    <td class="whitespace-nowrap px-4 py-3 sm:px-5">
      ${submittedBy}
    </td>
    <td class="whitespace-nowrap px-4 py-3 sm:px-5">
      ${moment(rez.created_at).format('lll')}
    </td>
    <td class="whitespace-nowrap px-4 py-3 sm:px-5">
      <div class="flex space-x-1">
        <div onclick="downloadReply('${downloadL}')" class="p-2 w-fit rounded-md flex justify-center items-center bg-success/10 text-success hover:bg-success/20 ">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
          </svg>
        </div>
        <div onclick="viewReply('${viewL}')" class="p-2 w-fit rounded-md flex justify-center items-center bg-primary/10 text-primary hover:bg-primary/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
          </svg>
      </div>
      

      </div>
    </td>
    <td class="whitespace-normal px-4 py-3 sm:px-5">
      ${fileLinks}
    </td>

  </tr>
  <script>
  function viewReply(e) {
    window.location.href = e
  }
  function downloadReply(e) {
    window.location.href = e
  }
  </script>

  `
  )

  })

  }else{
  $('#submissionsTable').hide() // set diaplay to empty
 
  $('.show_submissions_table').append(
  /*html*/
  `
  <div class="border-y border-dotted border-transparent border-b-slate-200 dark:border-b-navy-500 absolute w-[100%]">
    <div class="whitespace-nowrap px-4 py-3 sm:px-5 w-[100%] dark:border-navy-500">
      <div class="flex items-center space-x-4 justify-center">

        <span class="font-medium text-slate-700 dark:text-navy-200">No submissions record yet</span>
      </div>
    </div>
  </div>
  `
  )
  }

  } else {
  console.log('something is wrong')
  }
  }

  catch (err) {
  console.log('internet error')
  console.log(err)
  }

  }



async function callSubmittedData(e){

getSubmittedRecords(e)
}