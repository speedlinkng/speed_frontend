function getGoogleUrlData(){
    let url = '';

    if (localStorage.getItem('temp_newstore') == 1) {
      url = backendUrl+'/api/google/newstorage' 
    }
    if (localStorage.getItem('temp_newstore') == 2) {
      url = backendUrl+'/api/google/changeDriveMail' 
    }
    if (localStorage.getItem('temp_newstore') == 0) {
      return
    }
    localStorage.setItem('temp_newstore', 0)
    let url_params = new URLSearchParams(window.location.search)
 



    async function sendData() {
      let settings = {
        method: 'GET',
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Authorization": `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify({
          scope: url_params.get('scope'),
          code: url_params.get('code'),
          prompt: url_params.get('prompt'),
          authuser: url_params.get('authuser'),
        })
      };

      // open uploader
      $('.app-preloader').show()
      localStorage.setItem('preferred', 1)
   

        // try {
        //     let fetchResponses = await fetch(`${url}`, settings);

        //     let res = await fetchResponses.json();

        //     if (res.error == 1) {

        //     } else if (res.error == 2) {
        //     window.location.href = `${baseUrl}/auth`
        //     } else if (res.success == 1) {
        //     //alert('success')
        //     console.log(res.token)
        //     localStorage.setItem('my_goog_acc', res.token) // google access token for users second time
        //     endLoader()
        //     setActiveItem('Create')
        //     $(`#cancel_stroage_selec_modal`).trigger('click');
        
        //     } else {
        //     // meanse the user had already been logged out
            
            
        //     }


        // }
        // catch (err) {
        //     // An error occured
        //     endLoader()
        //     console.log('internet error')
        //     console.log(err)
        //     showNoti('error', err, 3000)
        // } finally{
        //     $('.app-preloader').hide()
        // }

        let scope = url_params.get('scope');
        let code = url_params.get('code');
        let prompt = url_params.get('prompt');
        let authuser = url_params.get('authuser');

        let body = JSON.stringify({
            scope: scope,
            code: code,
            prompt: prompt,
            authuser: authuser,
        })
        alert(url)
        $.ajax({
            url: 'http://sftsadmin.speedlinkng.com/api/google/newstorage',
            method: 'POST',
            dataType: 'json', 
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "Authorization": `Bearer ${localStorage.getItem('access')}`,
            },
            data: body,
            beforeSend: function(){
                showNoti('primary', 'Hold on were initiating your request', 3000)
                startLoader()
            },
            success: function(res) {
            
              console.log('Success:', res);

                if (res.error == 1) {

                } else if (res.error == 2) {
                   window.location.href = `${baseUrl}/auth`
                } else if (res.success == 1) {
                    //alert('success')
                    console.log(res.token)
                    localStorage.setItem('my_goog_acc', res.token) // google access token for users second time
                    endLoader()
                    setActiveItem('Create')
                    $(`#cancel_stroage_selec_modal`).trigger('click');
                
                } else {

                }
            },
            error: function(xhr, status, error) {
              console.error('Error:', error);
              showNoti('error', error, 3000)
              endLoader()
            }
        });
          
    }
    // myStorage()
    setTimeout(function(){
      sendData()
    }, 5000)
  } 

  getGoogleUrlData()