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

  async function cancelPlan2() {
    //alert('working')
    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      }
    };

    const myButton = document.getElementById('cancelPlan2');
    // Call losding function
    start_loading(myButton)
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
         end_loading(myButton, 'Cancel')
        }, 1000)
      }
  }

  getPlan()