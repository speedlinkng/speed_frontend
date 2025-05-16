
function downloadExcel(tableID) {

  var table = document.getElementById('submissionsTable');
  var ws = XLSX.utils.table_to_sheet(table);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  /* save to file */
  XLSX.writeFile(wb, 'table.xlsx');

  
//   let filename = $('.submission_for').text();
// let downloadLink;
// let dataType = 'application/vnd.ms-excel';
// let tableSelect = document.getElementById(tableID);
// let tableHTML = tableSelect.outerHTML;

// // Specify file name
// filename = filename ? filename + '.xls' : 'excel_data.xls';

// // Create download link element
// downloadLink = document.createElement("a");

// document.body.appendChild(downloadLink);

// // Add styling for Excel cells
// let style = "<style>";
// style += "table {border-collapse: collapse; width: 100%;}";
// style += "table, th, td {border: 1px solid black;}";
// style += "th {font-weight: bold;}";
// style += "</style>";

// // Concatenate style with tableHTML
// tableHTML = style + tableHTML;

// if (navigator.msSaveOrOpenBlob) {
//     let blob = new Blob(['\ufeff', tableHTML], {
//         type: dataType
//     });
//     navigator.msSaveOrOpenBlob(blob, filename);
// } else {
//     // Create a link to the file
//     downloadLink.href = 'data:' + dataType + ';charset=utf-8,' + encodeURIComponent(tableHTML);

//     // Setting the file name
//     downloadLink.download = filename;

//     //triggering the function
//     downloadLink.click();
// }

}


function downloadWord() {
  let table = document.getElementById('submissionsTable');
  let content = '<html><body>' + table.outerHTML + '</body></html>';
  let converted = htmlDocx.asBlob(content);

  /* save to file */
  saveAs(converted, 'table.docx');
}

function downloadCSV() {
  let table = document.getElementById('submissionsTable');
  let ws = XLSX.utils.table_to_sheet(table);
  let csv = XLSX.utils.sheet_to_csv(ws);

  /* create a Blob from the string and save it as a CSV file */
  let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  let link = document.createElement('a');
  let url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', 'table.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadPDF() {
  // Set custom options for jsPDF and jspdf-autotable
  let doc = new jsPDF({
      orientation: 'landscape', // 'portrait' or 'landscape'
      unit: 'in', // inches, mm, cm, or pt
      format: 'a3' // See jsPDF documentation for other formats
  });

  // Set custom font size for the table
  let fontSize = 10; // Font size in points
  doc.setFontSize(fontSize);

  // Generate PDF from the HTML table
  doc.autoTable({ 
      html: '#submissionsTable',
      startY: 0.75 // Position of the table from the top of the page (in inches)
  });

  // Save the PDF file
  doc.save('editable_table.pdf');



  // var docs = new jspdf.jsPDF('p', 'pt', 'a3');

  // docs.html(document.querySelector('#submissionsTable'), {
  //   callback: function (docs) {
  //     docs.save('data.pdf');
  //   },
  //   margin: [60, 60, 60, 60],
  //   x: 32,
  //   y: 32,
  // });
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
  // auto click myRequest sidebar button
  const myRequestButton = document.getElementById("_Dashboard");
  myRequestButton.click();
    
}
// In the script where callSubmittedData is defined
window.callSubmittedData = async function(e) {
  getSubmittedRecords(e);
};
  
window.submission_for = async function (pageName) { 
  const submissionForEl = document.querySelector('.submission_for');
  console.log(submissionForEl)
  if (submissionForEl) {
    submissionForEl.textContent = pageName;
  } 
}
// get submitted records
async function getSubmittedRecords(record_id) {
  // Show loading state
  $('#display_submission_head').html('');
  $('#displaySubmit').html(`
    <tr>
      <td colspan="100" class="text-center py-8">
        <div class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </td>
    </tr>
  `);

  const settings = {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('access')}`
    }
  };

  try {
    const response = await fetch(`${backendUrl}/api/app/getSubmissionById/${record_id}`, settings);
    const status = response.status;
    const data = await response.json();

    $('.no-submission').remove();

    // Clear existing content
    $('#display_submission_head').empty();
    $('#displaySubmit').empty();

    // Build table header
    $('#display_submission_head').append(`
      <th class="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold capitalize text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
        No
      </th>
      <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold capitalize text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
        Submitted At
      </th>
    `);

    const tableFieldNames = new Set(); // Use a Set to avoid duplicate headers

    if (data.success && status === 200 && data.data && data.data.length > 0) {
      $('#submissionsTable').show();

      data.data.forEach((submission, index) => {
        const { submitted_data, file_urls, reply_links, created_at } = submission;
        const formReplies = submitted_data?.formReplies?.[0];
        const fieldValues = {};

        if (formReplies) {
          // Extract field names for headers and values for rows
          for (const key in formReplies) {
            if (formReplies.hasOwnProperty(key)) {
              const field = formReplies[key];
              tableFieldNames.add(field.fieldName);
              fieldValues[field.fieldName] = field.fieldValue;
            }
          }

          // Append dynamic headers if it's the first row
          if (index === 0) {
            tableFieldNames.forEach(fieldName => {
              $('#display_submission_head').append(`
                <th class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold capitalize text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  ${fieldName}
                </th>
              `);
            });

            // Add action column header after dynamic columns
            $('#display_submission_head').append(`
              <th class="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold capitalize text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                Action
              </th>
            `);
          }

          // Build table row
          let output = '';
          tableFieldNames.forEach(name => {
            let value = fieldValues[name] || '';

            if (file_urls) {
              const fileLink = file_urls.find(file =>
                file.label && file.label.toLowerCase() === name.toLowerCase()
              );

              if (fileLink) {
                output += `
                  <td>
                    <div class="border rounded-md space-x-1 flex w-fit mt-[2px]">
                      <span class="p-1.5 hover:text-primary">
                        <a class="text-xs lowercase" href="${fileLink.webViewLink}" target="_blank">
                          ${fileLink.webViewLink.slice(0, 40)}...
                        </a>
                      </span>
                      <span class="p-2 border-l text-success hover:text-success/20 flex justify-center items-center">
                        <a href="${fileLink.downloadLink}" target="_blank">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M7.646 10.854a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 9.293V5.5a.5.5 0 0 0-1 0v3.793L6.354 8.146a.5.5 0 1 0-.708.708z"/>
                            <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
                          </svg>
                        </a>
                      </span>
                    </div>
                  </td>
                `;
              } else {
                output += `<td class="whitespace-normal px-4 py-3 sm:px-5">${value}</td>`;
              }
            } else {
              output += `<td class="whitespace-normal px-4 py-3 sm:px-5">${value}</td>`;
            }
          });

          // Add action buttons
          const viewLink = reply_links?.[0]?.webViewLink || '#';
          const downloadLink = reply_links?.[0]?.downloadLink || '#';

       $('#displaySubmit').append(`
          <tr class="capitalize border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
            <td class="whitespace-nowrap px-4 py-3 sm:px-5">${index + 1}</td>
            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
              ${moment(created_at).format('lll')}
            </td>
            ${output}
            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
              <div class="flex space-x-2">
                <button
                  onclick="downloadReply('${downloadLink}')"
                  class="icon-btn bg-blue-50 hover:bg-blue-100 text-blue-500 active:bg-blue-200 transition-colors duration-200 transform hover:scale-110"
                  title="Download Reply"
                  style="padding: 0.5rem;"
                >
                  <span class="material-icons" style="font-size: 1rem;">download</span>
                </button>
                <button
                  onclick="viewReply('${viewLink}')"
                  class="icon-btn bg-green-50 hover:bg-green-100 text-green-500 active:bg-green-200 transition-colors duration-200 transform hover:scale-110"
                  title="View Reply"
                  style="padding: 0.5rem;"
                >
                  <span class="material-icons" style="font-size: 1rem;">visibility</span>
                </button>
              </div>
            </td>
          </tr>
        `);

        }
      });
    } else {
      showNoSubmissions();
    }
  } catch (err) {
    console.error('Error fetching submissions:', err);
    showNoSubmissions();
    showNoti('red', 'Failed to load submissions. Please try again.', 3000);
  }
}