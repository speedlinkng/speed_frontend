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
      console.log('internet error')
      console.log(err)
    }
  }

  async function refresh() {

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
      // console.log(status)
      if (res.success == 1 && status == 200) {
      // console.log(res.success)
        $('.loader_skeleton').hide()
        $('#integrate_zoom').hide()
        $('#display_zoom_table').show()
        
      }else{
        console.log('nam')
        $('.loader_skeleton').hide()
        $('#integrate_zoom').show()
        $('#display_zoom_table').hide()
      }
      

    }
    catch (err) {
      console.log('internet error')
      // console.log(err)
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

  async function getRecordingsData() {

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
      // console.log(status)
      if (res.success == 1 && status == 200) {
        // console.log(res.data.meetings)
        let records = res.data.meetings
        // console.log('recordings retrieved successfully')


     
        records.forEach((record, index) =>{
        //  console.log(JSON.stringify(res.download[index]))
        let __url = record.recording_files
          let playUrl = []
          let downloadUrl = []
        // Loop through the array and extract download_url and play_url for each object
        for (let i = 0; i < __url.length; i++) {
          let item = __url[i];
          // let downloadUrl = item.download_url;
          // let playUrl = item.play_url;
          playUrl.push(item.play_url); 
          downloadUrl.push(item.download_url); 
          
          // console.log("Download URL:", downloadUrl);
          // console.log("Play URL:", playUrl);
        }

        playUrl = playUrl.join(',');
        // console.log(playUrl)
        downloadUrl = downloadUrl.join(',');
        // console.log(downloadUrl)

        // console.log('0000000000000000000000000')
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
       let size = formatFileSize(record.total_size)
          $('#zoom_table_content').append(
              /*html*/
            `
            <tr class="capitalize border-y border-transparent border-b-slate-200 !text-black dark:border-b-navy-500" style="color:black;">
              <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                  ${index+1}
                  </td>
                    <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                      <b>${record.topic}</b>
                      </td>
                      <td class="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-navy-100 sm:px-5">
                      ${record.id} 
                    </td>
                    <td class="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-navy-100 sm:px-5">
                    ${moment(record.start_time).format('lll')} 
                  </td>
                  <td class="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-navy-100 sm:px-5">
                ${record.recording_count} Files (${size})
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-navy-100 sm:px-5">
            <div class="flex space-x-1">
                    <div onclick="share('${record.share_url}')" class="p-2 w-fit rounded-md flex justify-center items-center bg-primary/10 text-primary hover:bg-primary/20">
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
      }else{
        $('#zoom_table_content').append(
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

  
  setInterval(async ()=>{
     refresh()
  }, 5000)

  setTimeout(()=>{
    getRecordingsData()
  }, 5000)
  setInterval(async ()=>{
     getRecordingsData()
  }, 120000)

