async function getAllRecords() {

    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      },
    };
    try {
      let getAllRecords = await fetch(`${backendUrl}/api/admin/getAllRecords`, settings);
      let res = await getAllRecords.json();
      let status = await getAllRecords.status;

        if(status == 403 && res.message == 'invalid token'){
            window.location.href = `${baseUrl}/auth`
        }

        if(status == 400 && res.message == 'invalid token'){
          console.log('invalid')
          window.location.href = `${baseUrl}/auth`
        }

        if (res.data != '') {
          let data = res.data
          let id = 1
          $('#all_records').html('') // EMPTY THE HTML DISPLAY HOLDER
          console.log('record res', res)
          data.forEach(res => {


            // SET RECORD DRIVE
            let record_drive = ''
            if(res.preferred_drive == 1){
               record_drive = `Sppedlink's Drive`
            }else{
               record_drive = `User's Drive`
            }
            let res_status = ''
            if(res.status == 'pending'){
              res_status = `<div class=" badge border  rounded-full border-warning text-warning">${res.status}</div>`
            }else if(res.status == 'completed'){
              res_status = `<div class="badge border rounded-full border-success text-success">${res.status}</div>`
            }else{
              res_status = `<div class="badge border rounded-full border-error text-error">${res.status}</div>`
            }

            // alert(res.record_name)
            $('#all_records').append(
            /*html*/
            `
            <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                  ${id++}
              </td>  
            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                  ${res.record_data.otherData.page_name}
              </td>
              <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                  ${record_drive}
              </td>
            
              <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                  ${record_drive}
              </td>  
              <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                  ${res.record_id}
     
              </td>  
              <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                  ${res.user_id}
      
              </td>                      
              <td class="whitespace-nowrap px-4 py-3 sm:px-5"  x-data="{showModal:false}">
              <button
                  @click="showModal = true"
                  class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                      viewbox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
              </button>
             
          </td>

            </tr>
      
              `

              )

              setTimeout(function () { 
                tableConfig()
                if (table) {
                  table.search('').draw();
                } else {
                  table = new DataTable("#records_table", {
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
                    //   { visible: false, targets: [ 2,4, 6, 9] } // Hide columns 2, 3, and 8
                    ]
                  });
          
      
           
               }
     
              },500)
            })

          }else{
              $('#display').html('') // set diaplay to empty
              $('#display').append(
                  /*html*/
                    `
                <div class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500 absolute w-[100%]">
                  <div class="whitespace-nowrap px-4 py-3 sm:px-5 w-[100%] border dark:border-navy-500">
                      <div class="flex items-center space-x-4 justify-center">
                        
                          <span class="font-medium text-slate-700 dark:text-navy-200">No Record Yet</span>
                      </div>
                  </div>
                </div>
                `
              )
        }
        

    }
    catch (err) {
      console.log('internet error')
      console.log(err)
    }
  }

  getAllRecords()