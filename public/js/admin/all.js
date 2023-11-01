// Get all user records
async function getAllUsers() {

    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      },
    };
    try {
      let getAllUsers = await fetch(`${backendUrl}/api/admin/getAllUsers`, settings);
      let res = await getAllUsers.json();
      let status = await getAllUsers.status;
        if(status == 403 && res.message == 'invalid token'){
            window.location.href = `${baseUrl}/auth`
        }

        if (res.data != '') {
            let data = res.data
            $('#all_users').html('') // EMPTY THE HTML DISPLAY HOLDER
            data.forEach(res => {
              console.log(res)
              $('#all_users').append(
              /*html*/
            `
            <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
              <div class="flex items-center space-x-4">
                <span class="font-medium text-slate-700 dark:text-navy-100">${res.firstName} ${res.lastName} </span>
              </div>
            </td>
            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                ${res.email}
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-navy-100 sm:px-5">
                ${res.number}
            </td>
            <td class="whitespace-nowrap text-center px-4 py-3 sm:px-5">
                ${res.count_uploads}
              </div>
            </td>
            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
              <button
                class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewbox="0 0 24 24"
                  stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </td>
          </tr>
     
             `
  
              )
  
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

        console.log(res.data)

    }
    catch (err) {
      console.log('internet error')
      console.log(err)
    }
  }

  async function searchUser() {

    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      },
    };
    let searchTerm = 'iso@gmail.com'
    try {
      let searchUser = await fetch(`${backendUrl}/api/admin/searchUser/${searchTerm}`, settings);
      let res = await searchUser.json();
      let status = await searchUser.status;
      console.log(status)
      console.log(res.data[0])

    }
    catch (err) {
      console.log('internet error')
      console.log(err)
    }
  }

  async function searchRecord() {

    let settings = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      },
      body: JSON.stringify({
        searchTerm :'tje'
      })
    };
    try {
      let searchRecord = await fetch(`${backendUrl}/api/admin/searchRecord`, settings);
      let res = await searchRecord.json();
      let status = await searchRecord.status;
        if(status == 402){
            return 'record not found';
        }
        console.log(res.data[0])


    }
    catch (err) {
      console.log('internet error')
      console.log(err)
    }
  }

  async function getTotalUserCount() {

    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      },
    };
    try {
      let getTotalUserCount = await fetch(`${backendUrl}/api/admin/getTotalUserCount`, settings);
      let res = await getTotalUserCount.json();
        console.log(res.data)

    }
    catch (err) {
      console.log('internet error')
      console.log(err)
    }
  }

  async function getTotalRecordCount() {

    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      },
    };
    try {
      let getTotalRecordCount = await fetch(`${backendUrl}/api/admin/getTotalRecordCount`, settings);
      let res = await getTotalRecordCount.json();
        console.log(res.data[0])

    }
    catch (err) {
      console.log('internet error')
      console.log(err)
    }
  }

  async function getTotalByteUploaded() {

    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      },
    };
    try {
      let getTotalByteUploaded = await fetch(`${backendUrl}/api/admin/getTotalByteUploaded`, settings);
      let res = await getTotalByteUploaded.json();
        console.log(res.data[0])

    }
    catch (err) {
      console.log('internet error')
      console.log(err)
    }
  }

  async function getTotalSubscribers() {

    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      },
    };
    try {
      let getTotalSubscribers = await fetch(`${backendUrl}/api/admin/getTotalSubscribers`, settings);
      let res = await getTotalSubscribers.json();
        console.log(res.data[0])

    }
    catch (err) {
      console.log('internet error')
      console.log(err)
    }
  }

  async function getTotalAmount() {

    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      },
    };
    try {
      let getTotalAmount = await fetch(`${backendUrl}/api/admin/getTotalAmount`, settings);
      let res = await getTotalAmount.json();
        console.log(res.data[0])

    }
    catch (err) {
      console.log('internet error')
      console.log(err)
    }
  }


  getTotalUserCount()
  searchRecord()
  searchUser()
  getAllRecords()
  getAllUsers()