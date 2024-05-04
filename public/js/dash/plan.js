  async function getPlan() {
    //alert('working')
    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      }
    };
    try {
      let fetchResponses = await fetch(`${backendUrl}/api/app/check`, settings);
      let staus = await fetchResponses.status
      let res = await fetchResponses.json();

      console.log(status)
      if (res.error == 1) {
        window.location.href = `${baseUrl}/auth`
      } else if (res.error == 2) {
        //alert('wrong 2')
        window.location.href = `${baseUrl}/auth`
      } else if (res.success == 1 && staus == 200) {
        console.log(res.data)
      

        if (res.data.plan == 1) {
            $('#paid_plan').hide()
            $('#free_plan').show()
        } else {
            $('#paid_plan').show()
            $('#free_plan').hide()
        }
    }

    }
    catch (err) {
      console.log('internet error')
      console.log(err)
    }
  }

  async function cancelPlan() {
    //alert('working')
    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      }
    };

    const myButton = document.getElementById('cancelPlan2');
    startLoader();
    try {
      let cancel = await fetch(`${backendUrl}/api/pay/cancel`, settings);
      let staus = await cancel.status
      let res = await cancel.json();

    
      if (res.error == 1) {
        window.location.href = `${baseUrl}/auth`
      } else if (res.error == 2) {
        //alert('wrong 2')
        window.location.href = `${baseUrl}/auth`
      } else if (res.success == 1 && staus == 200) {
            $('.sub_canceled').show()
            setTimeout(function(){
                $('#paid_plan').hide()
                $('#free_plan').show()
            }, 3000)
      
        }

    }
    catch (err) {
      console.log('internet error')
      console.log(err)
    }finally {
        setTimeout(function () {
          endLoader();
        }, 1000)
      }
  }

  function buyPlan(){

    // Firsttime payment on paystack
    async function startPaystack(){
      let settings = {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('access')}`,
        }
      };
      
      
      const myButton = document.getElementById('.plus_plan');
      // Call losding function
      startLoader();

      try {
        let pay = await fetch(`http://localhost:5000/api/pay`, settings);
        let status = await pay.status
        let json = await pay.json();
        console.log(json)
        if (status == 200) {
          window.location.href = json.data
        }
      }catch(err){
        console.log(err)
      }finally{
        setTimeout(function () {
          endLoader()
          }, 1000)
      }
    }
    startPaystack()
  }

  getPlan()
