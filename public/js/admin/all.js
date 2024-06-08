

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
      // console.log(res.data[0])
      if(status == 305){
        // window.location.href = `${baseUrl}/auth`
      }

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
        if(status == 305){
          // window.location.href = `${baseUrl}/auth`
        }
        // console.log(res.data[0])


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
        $('#total_users').text(res.data)

        if(status == 305){
          // window.location.href = `${baseUrl}/auth`
        }
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
        $('#record_count').text(res.data)
        if(status == 305){
          // // window.location.href = `${baseUrl}/auth`
        }

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

      function chooseDisplayUnit(result) {
        const bytes = result.bytes;
        const kilobytes = result.kilobytes;
        const megabytes = result.megabytes;
        const gigabytes = result.gigabytes;
    
        if (gigabytes >= 1) {
            return `${gigabytes.toFixed(2)} GB`;
        } else if (megabytes >= 1) {
            return `${megabytes.toFixed(2)} MB`;
        } else if (kilobytes >= 1) {
            return `${kilobytes.toFixed(2)} KB`;
        } else {
            return `${bytes} BYTES`;
        }
    }

    
        const displayUnit = chooseDisplayUnit(res.data);
        // console.log(`Display Unit: ${displayUnit}`);
        $('#total_files_gb').text(displayUnit)
 

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

  async function logout() {

    let settings = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      }
    };
  
    const myButton = document.getElementById('logout');
    start_loading(myButton)
    try {
      let searchRecord = await fetch(`${backendUrl}/api/users/logout`, settings);
      let res = await searchRecord.json();
      let status = await searchRecord.status;
        if(status == 305){
          window.location.href = `${baseUrl}/auth`
        }
        if(status == 403){
          window.location.href = `${baseUrl}/auth`
        }
        if(status == 200){
          window.location.href = `${baseUrl}/auth`
        }
        



    }
    catch (err) {
      console.log('internet error')
      console.log(err)
    } finally{
      setTimeout(function () {
        end_loading(myButton)
       }, 1000)
    }
  }


  getTotalByteUploaded()
  getTotalRecordCount()
  getTotalUserCount()
  searchRecord()
  searchUser()

  