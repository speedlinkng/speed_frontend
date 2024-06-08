var selectedDataForBackup;
var table
var showZoomTable = `
<div class="h-fit relative backup_progress hidden">
<div
  id="floatingDiv"
  class="floating-div absolute top-[-20px] left-0 text-slate-800 w-6 h-6 rounded-full flex items-center justify-center"
></div>
<div
  class="progress h-2 bg-secondary/15 dark:bg-secondary-light/25 relative"
>
  <div
    id="progressBar"
    class="is-active absolute left-0 h-full overflow-hidden rounded-full bg-secondary"
  ></div>
</div>
</div>
<select
id="filterSelect"
class="outline-none p-2 border rounded border-[#aaa] mx-2"
>
<option value="">Filter</option>
<option value="Backup pending">Backup pending</option>
<option value="Backup completed">Backup completed</option>
<option value="Backup in progress">Backup in progress</option>
</select>

<table
  id="zoom_table"
  class="allTable hover bg-tranparent w-full text-left poppin is-sc"
>
  <thead class="bg-white">
    <tr>
      <th
        class="rounded-tl-lg whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold capitalize text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
      >
        <input
          id="selectAllCheckbox"
          class="form-checkbox is-basic bg-slate-100 h-4 w-4 rounded border-slate-400/70 checked:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent"
          type="checkbox"
        />
      </th>
      <th
        class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold capitalize text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
      >
        S/N
      </th>
      <th
        class="whitespace-normal bg-slate-200 px-4 py-3 font-semibold capitalize text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
      >
        id
      </th>
      <th
        class="min-w-fit whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold capitalize text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
      >
        Status
      </th>
      <th
        class="hidden whitespace-normal bg-slate-200 px-4 py-3 font-semibold capitalize text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
      >
        count
      </th>
      <th
        class="min-w-fit whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold capitalize text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
      >
        Topic
      </th>
      <th
        class="hidden whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold capitalize text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
      >
        UUID
      </th>
      <th
        class="min-w-fit whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold capitalize text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
      >
        Start Time
      </th>
      <th
        class="min-w-fit whitespace-normal bg-slate-200 px-4 py-3 font-semibold capitalize text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
      >
        files
      </th>
      <th
        class="min-w-fit whitespace-normal bg-slate-200 px-4 py-3 font-semibold capitalize text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
      >
        raw_size
      </th>

      <th
        class="whitespace-normal bg-slate-200 px-4 py-3 font-semibold capitalize text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
      >
        Action
      </th>
    </tr>
  </thead>
  <tbody class="bg-white" id="zoom_table_content"></tbody>
</table>
`
async function tableConfig() {
  
  // Get the "Select All" checkbox and all row checkboxes
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  const rowCheckboxes = document.querySelectorAll(".row-checkbox");
  const tbody = document.querySelector("tbody");

  // Add event listener to "Select All" checkbox
  selectAllCheckbox.addEventListener("change", function () {
    rowCheckboxes.forEach((checkbox) => {
      checkbox.checked = this.checked;
      toggleHighlight(checkbox.closest("tr"), this.checked);
    });
  });

  // Add event listener to each row checkbox
  rowCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      toggleHighlight(this.closest("tr"), this.checked);
    });
  });

  // Function to toggle the highlight class
  function toggleHighlight(row, highlight) {
    if (highlight) {
      row.classList.add("highlight");
    } else {
      row.classList.remove("highlight");
    }
  }



  
// Add event listener to "Get Selected Data" button
document.getElementById("backup_btn").addEventListener("click", function () {
  const selectedData = [];
  let tot_size = 0;
  let count_file = 0;
  const rowCheckboxes = document.querySelectorAll(".row-checkbox");

  rowCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const row = checkbox.closest("tr");
      const rowIndex = table.row(row).index();
      const rowData = table.row(rowIndex).data();

      console.log('Raw Size:', rowData[8]);
      console.log('File Count:', rowData[3]);

      tot_size += parseInt(rowData[8], 10); // Correctly add up the sizes
      count_file += parseInt(rowData[3], 10); // Correctly add up the count files

      const rowObject = {
        id: rowData[2],
        topic: rowData[4],
        uuid: rowData[5],
        raw_size: rowData[8],
      };
      selectedData.push(rowObject);
    }
  });

  selectedDataForBackup = selectedData;
  console.log(selectedData);
  localStorage.setItem('tot_backup_size', tot_size);
  localStorage.setItem('tot_count_file', count_file);
  console.log("Total Size:", tot_size); // Log the total size
  console.log("Total Files:", count_file); // Log the total file count
});
}



async function integrateZoom() {

    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      }
    };
    try {
      let fetchResponses = await fetch(`${backendUrl}/api/zoom/`, settings);
      let status = await fetchResponses.status
      let res = await fetchResponses.json();

      console.log(status)
      if (res.error == 1) {
        window.location.href = `${baseUrl}/auth`
      } else if (res.error == 2) {
        window.location.href = `${baseUrl}/auth`
      } else if (res.success == 1 && status == 200) {
        // console.log(res.data)
        window.location.href = res.data
      }

    }
    catch (err) {
      console.log('nam')
      $('.loader_skeleton').hide()
      $('#integrate_zoom').show()
      $('#display_zoom_table').hide()
      console.log('internet error')
      console.log(err)
    }
  }

  async function refresh(refresh = null) {
    if (refresh != null) {
      $('.loader_skeleton').show()
      $('#integrate_zoom').hide()
      $('#display_zoom_table').hide()
      showNoti("white", "Refreshing", 2000);
      setTimeout(() => {
        clickModal()
      }, 3000)
    }
    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      }
    };
    try {
      let fetchResponses = await fetch(`${backendUrl}/api/zoom/refresh`, settings);
      let status = await fetchResponses.status
      let res = await fetchResponses.json();
      console.log(status)
      if (res.success == 1 && status == 200) {
  
      console.log(res.success)
        $('.loader_skeleton').hide()
        $('#integrate_zoom').hide()
        $('#display_zoom_table').show()
        // -------------------------------------
        // Call to get recordings data from zoom
        getRecordingsData(refresh)
        
      }else{
        console.log('nam')
        $('.loader_skeleton').hide()
        $('#integrate_zoom').show()
        $('#display_zoom_table').hide()
      }
      

    }
    catch (err) {
      console.log('nam')
      $('.loader_skeleton').hide()
      $('#integrate_zoom').show()
      $('#display_zoom_table').hide()
      console.log('internet error')
      console.log(err)
    }
  }
  function formatFileSize(totalSize) {
    if (totalSize < 1024) {
        return totalSize + ' bytes';
    } else if (totalSize < 1024 * 1024) {
        return (totalSize / 1024).toFixed(2) + ' KB';
    } else if (totalSize < 1024 * 1024 * 1024) {
        return (totalSize / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
        return (totalSize / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
}

function share(url){
  let a= document.createElement('a');
  a.target= '_blank';
  a.href= url;
  a.click();
}

function play(url){
  const play = url.split(',');
  play.forEach((eachPlay, index) => {
      setTimeout(() => {
          console.log('each play', eachPlay);
          let a = document.createElement('a');
          a.target = '_blank';
          a.href = eachPlay;
          a.click();
      }, index * 100); // Adjust the delay time as needed (e.g., 100 milliseconds)
  });
  

}

function download(url){
const download = url.split(',');
download.forEach((eachdownload, index) => {
    setTimeout(() => {
        console.log('each play', eachdownload);
        let a = document.createElement('a');
        a.target = '_blank';
        a.href = eachdownload;
        a.click();
    }, index * 1000); // Adjust the delay time as needed (e.g., 100 milliseconds)
});

}

function backupStatus(status) {
  // alert(status)
  if (status == 'pending') {
    return `<div class="badge text-xs+ space-x-2 px-0 text-secondary dark:text-secondary-light">
        <div class="h-2 w-2 rounded-full bg-current"></div>
        <span>Backup pending</span>
      </div>`
  } else if (status == 'completed')
  {
      return `<div class="badge space-x-2 px-0 text-success">
        <div class="h-2 w-2 rounded-full bg-current"></div>
        <span>Backup completed</span>
      </div>`
  }
  else {
        return ` <div class="badge space-x-2 px-0 text-warning">
        <div class="h-2 w-2 rounded-full bg-current"></div>
        <i class="bi bi-dot bg-current"></i>
        <span>Backup in progress</span>
      </div>`
    }
    
}

async function getRecordingsData(refresh = null) {
  $('.show_zoom_table').html('')
  $('.show_zoom_table').html(showZoomTable)
  if (refresh != null) { 
    $('#zoom_table_content').html('')
    $('.record_skeleton').show()
  }

    let allFilesize = 0
    function formatFileSize(totalSize) {
      if (totalSize < 1024) {
          return totalSize + ' bytes';
      } else if (totalSize < 1024 * 1024) {
          return (totalSize / 1024).toFixed(2) + ' KB';
      } else if (totalSize < 1024 * 1024 * 1024) {
          return (totalSize / (1024 * 1024)).toFixed(2) + ' MB';
      } else if (totalSize < 1024 * 1024 * 1024 * 1024) {
          return (totalSize / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
      } else if (totalSize < 1024 * 1024 * 1024 * 1024 * 1024) {
          return (totalSize / (1024 * 1024 * 1024 * 1024)).toFixed(2) + ' TB';
      } else {
          return (totalSize / (1024 * 1024 * 1024 * 1024 * 1024)).toFixed(2) + ' PB';
      }
  }
  

    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      }
    };
    try {
      let fetchResponses = await fetch(`${backendUrl}/api/zoom/recordings`, settings);
      let status = await fetchResponses.status
      let res = await fetchResponses.json();
      console.log(status)
      if (status == 201) {
        console.log(res.reason)
        if (res?.reason == 'not_subscribed_to_zoom') {
        
          showNoti("error", res.message, 7000)
        }
       }
      if (res.success == 1 && status == 200) {
        // --------------------------------
        // Remove skeleton
        $('.record_skeleton').hide()
        // console.log(res.data.meetings)
        let records = res.data
        // -------------------------------
        // If this is sucessful, call another endpoint that gets the recordings from the DB.

        let fetchResponsesDB = await fetch(`${backendUrl}/api/zoom/recordings_from_db`, settings);
        let statusDB = await fetchResponsesDB.status
        let resDB = await fetchResponsesDB.json();
        
        if (res.success == 1 && status == 200) { 
          // -----------------------------
          // This rsult has a jsonb field recording_data, get this field 
          // -----------------------------
          // Also save fields like the id, etc in hidden columns
          let recordsDB = resDB.data
          console.log(resDB.data , 'this db is...')
          // if (recordsDB == '' || recordsDB == null || recordsDB == []) {
          //   showNoti("error", res.message, 7000)
          // }
          // -----------------------------
          // Clear or destroy the table before appending data again
          if (table) {
            // var element = $('#zoom_table');
            // element.detach()
            // alert('yes table')
         }

          recordsDB.forEach(function (recordDB, index) { 
            let __url = recordDB.recording_data.recording_files
            let playUrl = []
            let downloadUrl = []
            for (let i = 0; i < __url.length; i++) {
              let item = __url[i];
              // let downloadUrl = item.download_url;
              // let playUrl = item.play_url;
              playUrl.push(item.play_url); 
              downloadUrl.push(item.download_url); 
              
              //  console.log("Download URL:", downloadUrl);
              //  console.log("Play URL:", playUrl);
            }

            playUrl = playUrl.join(',');
            // console.log(playUrl)
            downloadUrl = downloadUrl.join(',');
         
            let _url = '';
              function formatFileSize(totalSize) {
                if (totalSize < 1024) {
                    return totalSize + ' bytes';
                } else if (totalSize < 1024 * 1024) {
                    return (totalSize / 1024).toFixed(2) + ' KB';
                } else if (totalSize < 1024 * 1024 * 1024) {
                    return (totalSize / (1024 * 1024)).toFixed(2) + ' MB';
                } else {
                    return (totalSize / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
                }
              }
            allFilesize += recordDB.recording_data.total_size
            let size = formatFileSize(recordDB.recording_data.total_size)
            // status.

  
      
              
            $('#zoom_table_content').append(
            /*html*/
          `
          <tr class="capitalize border-y border-transparent border-b-slate-200 !text-black dark:border-b-navy-500" style="color:black;">
            <td class="border px-4 py-2">
              <input
                class="row-checkbox form-checkbox is-basic h-4 w-4 rounded border-slate-400/70 checked:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent"
                type="checkbox"
              />
            </td>
              <td class="whitespace-nowrap px-4 py-3 sm:px-5 ">
                ${index+1}
                </td>
     
                <td class="main_id ">
                  ${recordDB.id}
                  </td>
                  <td id="tb_${recordDB.id}" class="whitespace-nowrap px-4 py-3 sm:px-5">
                   ${backupStatus(recordDB.backup_status)} 
                </td>
                  <td class="">
                  ${recordDB.recording_data.recording_count}
                  </td>
                  <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                    <b>${recordDB.recording_data.topic}</b>
                    </td>
                    <td class="">
                    ${recordDB.recording_data.uuid} 
                  </td>
                  <td class="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-navy-100 sm:px-5">
                  ${moment(recordDB.recording_data.start_time).format('lll')} 
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-navy-100 sm:px-5">
              ${recordDB.recording_data.recording_count} Files (${size})
            </td>
            <td class="raw_size">
            ${recordDB.recording_data.total_size}
            </td>
          
            <td class="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-navy-100 sm:px-5">
          <div class="flex space-x-1">
                  <div onclick="share('${recordDB.recording_data.share_url}')" class="p-2 w-fit rounded-md flex justify-center items-center bg-primary/10 text-primary hover:bg-primary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                  <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
                </svg>
              </div>
              <div onclick="download('${downloadUrl}')" class="p-2 w-fit rounded-md flex justify-center items-center  text-success hover:bg-success/20 hover:text-green-600 ">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-arrow-down" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M7.646 10.854a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 9.293V5.5a.5.5 0 0 0-1 0v3.793L6.354 8.146a.5.5 0 1 0-.708.708z"/>
                <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
              </svg>
            </div>
            <div onclick="play('${playUrl}')" class="p-2 w-fit rounded-md flex justify-center items-center  text-secondary hover:bg-secondary/20 hover:text-pink-600 ">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
              <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
            </svg>
          </div>
    
            </div>
          </td>
          </tr>

        `
            )
            
          })

          $('.sizeMGB').text(formatFileSize(allFilesize))
          console.log('The total size for this file is ', console.log(formatFileSize(allFilesize)))
       

          setTimeout(function () { 
            tableConfig()
            if (table) {
              table.search('').draw();
              const inputField = document.querySelector(".dt-input");
            } else {
              // $('#filterSelect').show()
              table = new DataTable("#zoom_table", {
                info: false,
                ordering: true,
                paging: true,
                fixedHeader: true,
                // searching: false,    // Disable search functionality
                lengthChange: false,  // Disable "entries per page" option
                scrollY: '500px', // Vertical scrolling height
                // scrollX: true, // Enable horizontal scrolling
                scrollCollapse: true, // Allow DataTable to shrink to fit if needed
                columnDefs: [
                  { orderable: false, targets: 0 }, // Disable ordering for the first column (index 0)
                  { visible: false, targets: [ 2,4, 6, 9] } // Hide columns 2, 3, and 8
                ]
              });

              setTimeout(function () { 
             
                const inputsDataTables = document.querySelectorAll('.dt-input');
                inputsDataTables.forEach(inputsDataTable => {
                  inputsDataTable.setAttribute('autocomplete', 'off');
                  inputsDataTable.setAttribute('name', 'name' + new Date().getTime());
                  console.log(inputsDataTable.value)
                  alert('set input')
                  inputsDataTable.value = '';
                });
              }, 1500)
              
              function moveFilterSelect() {
              
                    var filterSelect = document.getElementById('filterSelect');
                    var searchContainer = document.querySelector('.dt-search');
  
                    if (searchContainer && filterSelect) {
                        // Insert filterSelect after the search container
                        searchContainer.appendChild(filterSelect);
                        // Show the filterSelect element
                        filterSelect.style.display = 'inline-block';
                    }
  
                        // Custom filtering function
                        DataTable.ext.search.push(
                          function(settings, data, dataIndex) {
                              var selectedValue = document.getElementById('filterSelect').value;
                  
                              // Array of column indexes to check
                              var columnIndexes = [ 3];
                  
                              // Check each column for the selected value
                              for (var i = 0; i < columnIndexes.length; i++) {
                                  var columnIndex = columnIndexes[i];
                                  var cellData = table.cell(dataIndex, columnIndex).node().querySelector('span').textContent;
                  
                                  if (selectedValue === "" || cellData === selectedValue) {
                                      return true;
                                  }
                              }
                  
                              // If none of the columns match the filter, exclude the row
                              return false;
                          }
                      );
              }
              setTimeout(function () {
                moveFilterSelect();
               },1000)
              
              
        
  
                // Event listener for filter select change
                $('#filterSelect').on('change', function() {
                    table.draw();
                });
           }
 
          },500)

        }

      }
      else if (status == 400) { 
       
        if (res?.reason == 'invalid_grant') {
          // ---------------------------------
          // you have to return the user to integrte options page
          $('.loader_skeleton').hide()
          $('#integrate_zoom').show()
          $('#display_zoom_table').hide()
        }
        else if (res?.reason == 'refresh_changed') { 
          $('.loader_skeleton').hide()
          $('#integrate_zoom').show()
          $('#display_zoom_table').hide()
        }
        else {
        
          window.zoomError = res.message
        
          if (window.zoomError === undefined) { 
            $('#showModalError').click()
            $('.errMesg').text('Network error, ensure you have an active internet connection')
          } else {
            $('#showModalError').click()
            $('.errMesg').text(window.zoomError)
          }
       

        }
      }
      else {
        $('#zoom_table_content').html(
          `
          <div class="p-2 text-center text-xl text-black">No Record Yet</div>
          `
        )
       }
    }
    catch (err) {
      // console.log('inter')
      console.log(err)
    }
}


  setTimeout(async () => {
    if (localStorage.getItem('activeItem') == 'Zoom') {
      refresh()
    }
  }, 3000)
  
  // setTimeout(async () => {
  //   window.backupInProgress = true
  // }, 20000)

  // setTimeout(()=>{
  //   getRecordingsData()
  // }, 5000)


  async function bkup_mygoogle() { 
    localStorage.setItem("backup_stroage", 2); // set a temporary storage which will be used to know the user clicked this option
    localStorage.setItem("backup_preferred", 1);

    if (localStorage.getItem("my_goog_backup_storage") != 0) {
      // check if the my_goog_backup_storage is set
      // Show notification go ahead to select what he wants to backup
      backup()
    } else {
      window.location.href = `${backendUrl}/api/google/auth/${localStorage.getItem(
        "access"
      )}`; 
    }
  
  }
  
  async function bkup_speedlink() { 
    localStorage.setItem("backup_stroage", 1);
    localStorage.setItem("backup_preferred", 0);
    // --------------------------------
    // St this to 0 because onc you change option, you will be prompter to still signin again
    // and select youe new storage account
    localStorage.setItem("my_goog_backup_storage", 0);
    backup()
  }
  

  
const fetchData = async () => {
  let oldCount = 0
  // alert(localStorage.getItem('backupInProgress'))
  if (localStorage.getItem('backupInProgress') == 'true') {
      let settings = {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('access')}`,
        }
      };
      try {
        const response = await fetch('http://localhost:5000/api/zoom/fetchBackupEvent', settings);
        const data = await response.json();
        // Process the fetched data here (e.g., update UI)
        // console.log(data.data);
        if (oldCount != data.data) {

          oldCount = data.data
          // $('.backingUpFileCount').show()
          // $('.bkupFiles').text(data.data)
          window.bkupfile = data
        }
      
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
};
  
setInterval(function () {
  fetchData()
 }, 5000);

var totalBytesDownloaded = 0;
var totalBytesUploaded = 0;
var totalBackupSize = 0;
var totalBytesTransferred = 0;
let fileProgress = {};
let socketId
const socket = io(backendUrl);
socket.on('connect', () => {
  console.log('Connected to server');
  socketId = socket.id; // Get socket ID after connection
  console.log('Socket ID:', socketId); // Log the socket ID
});

socket.on('download_progress', (data) => {
  totalBytesDownloaded += data.bytesDownloaded;

});

socket.on('backup_in_progress', (data) => {
  
  $(`#tb_${data.id}`).html(`
  ${backupStatus('in-progress')}
  `)

});

socket.on('upload_progress_name', (data) => {
  // console.log(`Upload progress name for &&&& ${data.fileName}`);
  localStorage.setItem('fileNameBacked', data.fileName);

});

socket.on('upload_progress', (data) => {
  const { fileName, bytesUploaded } = data;
  
  // Update the file's progress
  fileProgress[fileName] = bytesUploaded;

  // Sum the progress of all files
  let totalBytesUploaded = Object.values(fileProgress).reduce((acc, bytes) => acc + bytes, 0);

  // Calculate total transferred bytes (if you need to consider downloads too)
  let totalBytesTransferred = totalBytesUploaded; // Add totalBytesDownloaded if needed
  
  console.log(`Upload progress for ${fileName}: ${formatFileSize(bytesUploaded)} bytes`);
  console.log('TOTAL UPLOADED = ', totalBytesTransferred, 'in MB it is ==', formatFileSize(totalBytesTransferred));
  
  updateProgress(totalBytesTransferred, totalBackupSize);
  $('.bkupFiles').text(formatFileSize(totalBytesTransferred));
});


socket.on('backup_complete', (data) => {
  setTimeout(() => {
    showNoti("show_success", "backup completed", 3000);
    $('.backup_progress').hide()
  }, 5000)
 
  $(`#tb_${data.id}`).html(`
  ${backupStatus('completed')}
  `)
  console.log(`#tb_${data.id}`)
  console.log(data.id);
  
  // Update your UI to indicate that the backup is complete
});

socket.on('total_size', (data) => {
  console.log(formatFileSize(data.size));
  console.log(formatFileSize(data.times2));
  totalBackupSize  = data.size  
  $('.backingUpFileCount').show()
  $('.totFiles').text(formatFileSize(data.size))
  // Update your UI to indicate that the backup is complete
});

socket.on('error', (data) => {
  console.error(data.message);
  // Update your UI to indicate that an error occurred
});



async function backup() {

  if (selectedDataForBackup.length === 0) {
    showNoti("red-slate", "Select the recordings you wiash to backup", 5000);
    return;
  }

  data = {
    selectedDataForBackup: selectedDataForBackup,
    preferred: localStorage.getItem("backup_preferred"),
    socketId: socketId
  }

  let settings = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  };
  try {
    // hide backup button
    $('#backup_btn').show()
    $('#backingup_btn').show()
    // ----- SHOW PROGRESS----
    $('.backup_progress').show()
    showNoti("white-slate", "We are backing up your data, this might take a while. Kindly avoid clicking the backup button until this process is complete", 10000);
    localStorage.setItem('backupInProgress', true)
    let fetchResponses = await fetch(`${backendUrl}/api/zoom/backup`, settings);
    let status = await fetchResponses.status
    let res = await fetchResponses.json();

    console.log(status)
    if (res.error == 1) {
      window.zoomError = res.message
      $('#showModalError').click()
      $('.errMesg').text(window.zoomError)
   
    } else if (res.success == 1 && status == 200) {
      // console.log(res.data)
      // window.location.href = res.data
    }

  }
  catch (err) {
    // Show backup button
    $('#backup_btn').show()
    $('#backingup_btn').show()
      // ----- SHOW PROGRESS----
      $('.backup_progress').hide()
    showNoti("error", "An error occured", 3000)
    localStorage.setItem('backupInProgress', false)
  }
}

function updateProgress(totalBytesTransferred, totalBackupSize) {
  
  const progressPercentage = (totalBytesTransferred / totalBackupSize) * 100;
  console.log('totalBackupSize', totalBackupSize, formatFileSize(totalBackupSize))
  console.log('progressPercentage', progressPercentage)
  const progressBar = document.getElementById('progressBar');
  const floatingDiv = document.getElementById('floatingDiv');

  // Ensure updates are synchronous
  requestAnimationFrame(() => {
    // Update progress bar width
    progressBar.style.width = `${progressPercentage}%`;

    // Update floating div position and content
    floatingDiv.style.left = `${progressPercentage}%`;
    floatingDiv.textContent = `${Math.round(progressPercentage)}%`;
  });
}

// function updateProgress(progressPercentage) {
//   const progressBar = document.getElementById('progressBar');
//   const floatingDiv = document.getElementById('floatingDiv');

//   // Ensure updates are synchronous
//   requestAnimationFrame(() => {
//     // Update progress bar width
//     progressBar.style.width = `${progressPercentage}%`;

//     // Update floating div position and content
//     floatingDiv.style.left = `${progressPercentage}%`;
//     floatingDiv.textContent = `${Math.round(progressPercentage)}%`;
//   });
// }

// Simulate progress update every 500ms
// let progress = 0;
// const interval = setInterval(() => {
//   if (progress <= 100) {
//     updateProgress(progress);
//     progress += 5; // Increment progress by 5%
//   } else {
//     clearInterval(interval); // Stop the interval when progress reaches 100%
//   }
// }, 500);



function clickModal() {
 // alert(`Modal clicked${localStorage.getItem('firstzoommodal')}`)
  localStorage.setItem('firstzoommodal', 1) 
  if (localStorage.getItem('firstzoommodal') == 0) { 

  } else {
    let a= document.getElementById('firstButtonModal');
    a.click();
  }

}
