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
        console.log(res.data)
        window.location.href = res.data
      }

    }
    catch (err) {
      console.log('internet error')
      console.log(err)
    }
  }
