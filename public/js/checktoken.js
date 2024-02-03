 
 //check if access token is still valid
  async function checkToken (){
    
  if(localStorage.getItem('access') !== null){
   
      let settings = {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('access')}`,
        },
      };
      try {
        let fetchResponses = await fetch(`${backendUrl}/api/app/check`, settings);
        let staus = await fetchResponses.status
        let res = await fetchResponses.json();
        // console.log(res)
        if(res.error == 1){

        }else if(res.error == 2){
          window.location.href = `${baseUrl}/auth`
        }else{

        }
     
  
      }
      catch (err) {
        // console.log(err)
      }
    }else{
      // if access token is not set, go to login
    }
  }
    setInterval(function(){
      checkToken()
    }, 5000)

