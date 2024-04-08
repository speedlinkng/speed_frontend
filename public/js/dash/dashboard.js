
$('.app-preloader').show()


  function setActiveItem(item) {
    // Set activeItem in localStorage with a 2-minute expiration time
    localStorage.setItem('activeItem', item);
    localStorage.setItem('activeItemTimestamp', Date.now());

    $(`#_${item}`).trigger('click');
  }

  
  //GET SPEEDLINK GOOGLE_ACCESS TOKEN TO UPLOAD TO SPEEDLINK DRIVE
  async function speedlinkAccess() {

    // let settings = {
    //   method: 'GET',
    //   headers: {
    //     "Authorization": `Bearer ${localStorage.getItem('access')}`,
    //   },
    // };
    // try {
    //   let fetchResponses = await fetch(`${backendUrl}/api/google/speedlinkaccess`, settings);
    //   let staus = await fetchResponses.status
    //   let res = await fetchResponses.json();

    //   if (res.error == 1) {

    //   } else if (res.error == 2) {
    //     window.location.href = `${baseUrl}/auth`
    //   } else if (res.success == 1) {
    //     console.log(res.token)
    //     localStorage.setItem('default_goog_acc', res.token) // google default accesstokend to upload to speedlink drive
    //     localStorage.setItem('b_token', res.token) // google default accesstokend to upload to speedlink drive
    //     // this is the preferred drive usage, speedlink or my own 
    //     // close others, open /create
      
    //     setActiveItem('Create')
    //     $(`#cancel_stroage_selec_modal`).trigger('click');

    //         // window.location.href = `${baseUrl}/dash/create`
    //   } else {
    //     console.log('something is wrong')
    //   }


    // }
    // catch (err) {
    //   console.log('internet error')
    //   console.log(err)
    // }
    setActiveItem('Create')
    $(`#cancel_stroage_selec_modal`).trigger('click');
    // chck if preferred was already set to 1, 
    // then reload to ensure google selectDrive knows it shouldnt us the 
    // localstorage accesstoken
    // Also unset the my_google_acc localstorage
    if(localStorage.getItem('preferred') == 1){
      localStorage.setItem('preferred', 0)
      localStorage.removeItem('my_goog_acc')
      location.reload() 
    }


  }


  async function myStorage() {

    localStorage.setItem('temp_mystore', true) // set a temporary storage which will be used to know the user clicked this option
    // window.location.href = `${backendUrl}/api/google/auth` // prompt 

    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      },
    };
    try {
      let fetchResponses = await fetch(`${backendUrl}/api/google/mystorage`, settings);
      let staus = await fetchResponses.status
      let res = await fetchResponses.json();

      if (res.error == 1) {

      } else if (res.error == 2) {
        window.location.href = `${baseUrl}/auth`
      } else if (res.success == 1) {
        console.log(res.token)
        localStorage.setItem('my_goog_acc', res.token) // google access token for users second time
        localStorage.setItem('b_token', res.token) // google access token for users second time
        localStorage.setItem('preferred', 1)
        setActiveItem('Create')
        $(`#cancel_stroage_selec_modal`).trigger('click');
        // window.location.href = `${baseUrl}/dash/create`
      } else {
        console.log('something is wrong')
      }


    }
    catch (err) {
      console.log('internet error')
      console.log(err)
    }
  }


  async function newStorage() {

    localStorage.setItem('temp_newstore', 1) // set a temporary storage which will be used to know the user clicked this option
    localStorage.setItem('preferred', 1) // set a temporary storage which will be used to know the user clicked this option
    window.location.href = `${backendUrl}/api/google/auth/${localStorage.getItem('access')}` // prompt 

    //myStorage()
    /* let settings = {
       method: 'GET',
       headers: {
         "Authorization": `Bearer ${localStorage.getItem('access')}`,
       },
     };
     try {
       let fetchResponses = await fetch(`${backendUrl}/api/google/newstorage`, settings);
       let staus = await fetchResponses.status
       let res = await fetchResponses.json();
    
       if(res.error == 1){
 
       }else if(res.error == 2){
         window.location.href = `http://127.0.0.1:5502/dist/auth/signin.html`
       }else if(res.success == 1){
         console.log(res.token)
         localStorage.setItem('new_goog_acc', res.token) // google new access tokenfor the users first time
         window.location.href = '${baseUrl}dash/create.html'
       }else{
         console.log('something is wrong')
       }
    
 
     }
     catch (err) {
       console.log('internet error')
       console.log(err)
     } */
  }


  async function downloadZip(record_id,u,f,s){


    $.ajax({
      url: `${backendUrl}/api/google/downloadFolderAsZip/${record_id}/${u}/${f}/${s}`,
      type: 'GET',
      beforeSend: function(){
        // alert('loading')
      },
      success: function(response, status) {
        // Handle successful response
        console.log(status);
        console.log(response);
        createZipFile(response.token)

      },
      error: function(xhr, status, error) {
        // Handle error
       console.log(error)
      }
    });

    async function createZipFile(accessToken) {
      // Create a zip file.
      const zip = new JSZip();
  
      // Get the parent folder's ID.
      const folderId = f; // Assuming you want to start from the root folder
      let totalBytesDownloaded = 0;
      // Function to fetch files and subfolders recursively
      async function fetchFilesAndSubfolders(folderId, zipFolder) {
          const response = await axios.get(`https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents&fields=files(id,name,mimeType)`, {
              headers: {
                  'Authorization': `Bearer ${accessToken}`
              },
              responseType: 'json',
              onDownloadProgress: function(progressEvent) {
                // Indicate that download is in progress
                console.log('Download in progress...');
            }
          });
  
          const items = response.data.files;
  
          // Fetch files and subfolders recursively
          for (const item of items) {
              if (item.mimeType === 'application/vnd.google-apps.folder') {
                  // If it's a folder, create a subfolder in the zip and recursively fetch its contents
                  const subZipFolder = zipFolder.folder(item.name);
                  await fetchFilesAndSubfolders(item.id, subZipFolder);
              } else {
                  // If it's a file, add it to the current zip folder
                  const fileResponse = await axios.get(`https://www.googleapis.com/drive/v3/files/${item.id}?alt=media`, {
                      headers: {
                          'Authorization': `Bearer ${accessToken}`
                      },
                      responseType: 'blob'
                  });
                  zipFolder.file(item.name, fileResponse.data);
              }
          }
      }
  
      try {
          // Start fetching files and subfolders recursively
          await fetchFilesAndSubfolders(folderId, zip);
  
          // Save the zip file using FileSaver.js
          const blob = await zip.generateAsync({ type: 'blob' });
          saveAs(blob, 'folder.zip');
          console.log('Download initiated.');
      } catch (error) {
          console.error('Error fetching files and subfolders:', error);
      }
  }
  
  
  async function createZipFiles(accessToken) {
    // Create a zip file.
    const zip = new JSZip();

    // Get the parent folder's ID.
    const folderId = f; // Assuming you want to start from the root folder

    // Function to fetch files and subfolders recursively
    async function fetchFilesAndSubfolders(folderId, zipFolder) {
        const response = await fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents&fields=files(id,name,mimeType)`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        const items = data.files;

        // Fetch files and subfolders recursively
        for (const item of items) {
            if (item.mimeType === 'application/vnd.google-apps.folder') {
                // If it's a folder, create a subfolder in the zip and recursively fetch its contents
                const subZipFolder = zipFolder.folder(item.name);
                await fetchFilesAndSubfolders(item.id, subZipFolder);
            } else {
                // If it's a file, add it to the current zip folder
                const fileResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${item.id}?alt=media`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const blob = await fileResponse.blob();
                zipFolder.file(item.name, blob);
            }
        }
    }

    try {
        // Start fetching files and subfolders recursively
        await fetchFilesAndSubfolders(folderId, zip);

        // Save the zip file using FileSaver.js
        const blob = await zip.generateAsync({ type: 'blob' });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'folder.zip';
        link.click();
        console.log('Clicked');
    } catch (error) {
        console.error('Error fetching files and subfolders:', error);
    }
}

  }


  function getGoogleUrlData(){
    let url = '';

    if (localStorage.getItem('temp_newstore') == 1) {
      url = `${backendUrl}/api/google/newstorage` 
    }
    if (localStorage.getItem('temp_newstore') == 2) {
      url = `${backendUrl}/api/google/changeDriveMail` 
    }
    if (localStorage.getItem('temp_newstore') == 0) {
      return
    }
    localStorage.setItem('temp_newstore', 0)
    let url_params = new URLSearchParams(window.location.search)
    // console.log(url_params.get('scope'))
    // console.log(url_params.get('code'))
    // console.log(url_params.get('prompt'))
    // console.log(url_params.get('authuser'))

    async function sendData() {
      let settings = {
        method: 'POST',
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
      startLoader()
      alert('working')
      try {
        let fetchResponses = await fetch(`${url}`, settings);
        let staus = await fetchResponses.status
        let res = await fetchResponses.json();

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
          // window.location.href = `${baseUrl}/dash/create`
        } else {
           // meanse the user had already been logged out
        
        
        }


      }
      catch (err) {
        console.log('internet error')
        console.log(err)
      } finally{
        $('.app-preloader').hide()
      }
    }
    // myStorage()
    sendData()
  } 

  getGoogleUrlData()

  // GET LIS OFALL RECORDS 

  async function getRecordList() {
    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      }
    };
    try {
      let fetchResponses = await fetch(`${backendUrl}/api/app/getrecords`, settings);
      let staus = await fetchResponses.status
      let res = await fetchResponses.json();
      let allres ; // Hold the request json data
      if (res.error == 1) {
        // alert('wrong 1')
      } else if (res.error == 2) {
        // alert('wrong 2')
        window.location.href = `${baseUrl}/auth`
      } else if (res.success == 1 && staus == 200) {
        console.log('{{{{{{{{{{{{{{{{{{{{{{{{success}}}}}}}}}}}}}}}}}}}}}}}}')
        console.log(res)
        if (res.data != '') {
          let jsonString = JSON.stringify(res.data);
        
          // console.log('jsonString', jsonString)
          let data = res.data
          $('#display').html('') // EMPTY THE HTML DISPLAY HOLDER
          console.log(data)
          
          data.forEach((rez, req_index) => {
            console.log(rez)
            console.log(rez.record_data)
            console.log(rez.record_data.otherData)
            console.log(rez.record_data.otherData.drop_zone)

            console.log('//////////////////////')
            allres = rez.record_data
       
            let res_status = ''
            if(rez.status == 'pending'){
              res_status = `<div class=" badge border  rounded-full border-warning text-warning">${rez.status}</div>`
            }else if(rez.status == 'completed'){
              res_status = `<div class="badge border rounded-full border-success text-success">${rez.status}</div>`
            }else{
              res_status = `<div class="badge border rounded-full border-error text-error">${rez.status}</div>`
            }
            $('#display').append(
            /*html*/
              `
                <tr class="capitalize border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                  <div class="flex items-center space-x-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-8 w-8 text-secondary"
                      viewbox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                      />
                    </svg>
                    <span class="font-medium text-slate-700 dark:text-navy-100">${allres.otherData.page_name}</span
                    >
                  </div>
                </td>
                <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                  ${moment(rez.expiry_date).format('lll')} 
                </td>
                <td
                  class="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-navy-100 sm:px-5"
                >
                  <span>50</span> <span @click="activeItem = 'Submissions'" onclick="viewAll('${rez.record_id}', '${allres.otherData.page_name}')" class="text-primary lowercase pl-3 cursor-pointer ">View all</span>
                </td>
                <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                  <div class="flex -space-x-2">
                    <div class=""> <a id="clipboardContent${rez.record_id}" href="${baseUrl}/form/${((rez.record_id).replace(/\s/g, ''))}">${baseUrl}/form/${((rez.record_id).replace(/\s/g, ''))}</a></div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                <div class="flex -space-x-2">
                  <div class="flex space-x-4">
                    <button onclick="customButtonClick('${allres.otherData.page_url}')" class="btn h-9 w-9 border border-success p-0 font-medium text-success hover:bg-success hover:text-white focus:bg-success focus:text-white active:bg-success-focus/90 ">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share " viewBox="0 0 16 16">
                        <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
                      </svg>
                    </button>
                    <button @click="$clipboard({
                      content:document.querySelector('#clipboardContent${rez.record_id}').innerText,
                      success:()=>$notification({text:'Text Copied',variant:'success'}),
                      error:()=>$notification({text:'Error',variant:'error'})
                    })" class="btn h-9 w-9 border border-primary p-0 font-medium text-primary hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary/90 dark:border-accent dark:text-accent-light dark:hover:bg-accent dark:hover:text-white dark:focus:bg-accent dark:focus:text-white dark:active:bg-accent/90">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy " viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </td>
                <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                <div class="flex -space-x-2">
                    ${rez.status}
                  </div>
                </td>

                <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                  <div class="flex -space-x-2">
                    <div>
                    <div x-data="usePopper({placement:'bottom-end',offset:4})"
                    @click.outside="if(isShowPopper) isShowPopper = false" class="inline-flex">
                    <button x-ref="popperRef" @click="isShowPopper = !isShowPopper"
                      class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewbox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </button>
                    <div x-ref="popperRoot" class="popper-root" :class="isShowPopper && 'show'">
                      <div
                        class="popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                        <ul>
                          <li>
                            <a href="#"
                              class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">Download .docx</a>
                          </li>
                          <li>
                            <a href="#"
                              class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">
                            Download .xls  
                            </a>
                          </li>
                          <li>
                            <a href="#"
                              class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">
                            Download .cvs  
                            </a>
                          </li>
                          <li>
                          <a href="#"
                            class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">
                          Download .pdf  
                          </a>
                        </li>
                        <li onclick="downloadZip('${rez.record_id}', '${rez.user_google_id}', '${rez.folder_id}', '${rez.storage_email}')">
                          <a href="#"
                            class="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">
                          Download record folder 
                          </a>
                        </li>
                        </ul>
                        <div class="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                        <ul>
                          <li onclick="editThisForm('${req_index}')">
                            <a href="#"
                              class="text-primary flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">
                            Edit Request
                            </a>
                          </li>
                          <li class="hidden jsonString${req_index}">
                            ${jsonString}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                    </div>
                  </div>
                </td>

              </tr>
              <script>
                
                function editThisForm(req_index){
               
                  // call open the form editor by trigger-clicking the create button
                   allArrayEdit = $('.jsonString'+req_index).text() // set this to the global reserve array for editing
                   setActiveItem('Create')
                   $('#cancel_stroage_selec_modal').trigger('click');
                   
                   callEdit(req_index)
                 }
              </script>
              
              <script>      


                  function viewAll(e, subfor){
                    // hide create button
                
                    $('.submission_for').text(subfor)
                    $('#dashoard').hide()
                    $('#submissions').show()
                    // call to show submissions
                    callSubmittedData(e)

                  }


                  function customButtonClick(e) {
                  
                
                      if (navigator.share) {
                          navigator.share({
                              title: 'Share Form link',
                              text: 'shar this form link!',
                            // url: "https://speedlink/form/"+${((allres.otherData.page_url).replace(/\s/g, '')).toLowerCase()},
                          })
                          .then(() => console.log('Successful share'))
                          .catch((error) => console.log('Error sharing:', error));
                      } else {
                          // Fallback for browsers that do not support the Web Share API
                          alert('Sharing is not supported in this browser.');
                      }
                  }
              </script>
              `

            )

        })

        }else{
            $('.dashboardTableHolder').html('') // set diaplay to empty
            console.log($('.tReq').text())
            $('.dashboardTableHolder').append(
                /*html*/
                  `
               <div class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500 absolute w-[100%]">
                <div class="whitespace-nowrap px-4 py-3 sm:px-5 w-[100%] dark:border-navy-500">
                    <div class="flex items-center space-x-4 justify-center">
                       
                        <span class="font-medium text-slate-700 dark:text-navy-200">No Request Created Yet</span>
                    </div>
                </div>
               </div>
               `
               )
        }

      } else {
        console.log('something is wrong')
        window.location.href = `${baseUrl}/auth`
      }
    }

    catch (err) {
      console.log('internet error')
      console.log(err)
    }

  }

  getRecordList()


