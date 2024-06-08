async function protectAdminroute() {

    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      },
    };
    try {
      let getTotalAmount = await fetch(`${backendUrl}/api/admin/checkAdminRoute`, settings);
      let status = await getTotalAmount.status;

  
      if(status == 400){
        window.location.href = `${baseUrl}/auth`
      }
      if(status == 403){
        window.location.href = `${baseUrl}/auth`
      }
    

    }
    catch (err) {
        window.location.href = `${baseUrl}/auth`
      console.log(err)
    }
  }
  protectAdminroute()