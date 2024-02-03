
Alpine.data('f_u_a', () => ({
    // Find the input element
    
    uploadToDrive() {
        alert('done')
      const fd = new FormData();
      const uploadedFiles = ponds.getFiles();
    
    //   const myButton = document.getElementById('upload_btn');
        // start_loading(myButton)
        console.log(uploadedFiles)
        
    
      // START LOADING
      console.log('loop')
      for (var i = 0; i < uploadedFiles.length; i++) {
        console.log(uploadedFiles[i].source)
      }
    
      // BLOB
      let selectedFile = uploadedFiles[0].source
    
      // Resume an upload after it failed due to network issues
      function checkResume(header_res, size) {
        let url = ''
        let range = ''
    
        //  Set interval to keep checking to see if the chunk_status has changes  
        const intervalId = setInterval(function () {
          resume()
        }, 3000)
    
        async function resume() {
          if (navigator.onLine) {
            if (localStorage.getItem('loc_url') !== null) {
              url = header_res
            }
            console.log('url' + url)
    
            try {
              const response = await fetch(header_res, {
                method: 'PUT',
                headers: {
                  "Content-Range": `bytes */${size}`,
                  "Content-Length": '0'
                }
              });
              let status_ = await response.status
              let headers = await response.headers.get('range');
    
              console.log(status_)
              console.log(headers)
              if (headers == null) {
                range = null
                uploadfile(url, selectedFile, range)
              }
              if (status_ == 308) {
                let ranges = headers
                let parts = ranges.split("-");
                if (parts.length === 2) {
                  range = parts[1];
                } else {
                  console.log('Invalid format');
                }
                console.log('new range is:' + range)
                uploadfile(url, selectedFile, range)
                clearInterval(intervalId);
              }
            
              if (status_ == 200) {
                updateProgressBar('complete')
                console.log('upload complete')
                clearInterval(intervalId);
              }
              clearInterval(intervalId);
    
            } catch (err) {
              console.log(err)
            }
    
          } else {
            console.log('You are offline.');
          }
        }
    
      }
    
    
    
    
      // GET GOOGLE LOCATION URL FOR THIS FILE UPLOAD
    
    
      const getlocations = async (selectedFile) => {
        console.log('SLECTED FILE' + selectedFile)
    
        try {
    
          const folderId = localStorage.getItem('folder_id'); // Replace with the actual folder ID
          const accessToken = localStorage.getItem('b_token');
    
          console.log(accessToken)
    
          // Step 1: Initiate the resumable session
          const initiateResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
            method: 'POST',
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
              name: `${selectedFile.name}`,
              mimeType: selectedFile.type,
              parents: [folderId] // Place the folder ID in an array
            })
          });
          console.log(initiateResponse.status)
          if (initiateResponse.status === 200) {
            const header_res = await initiateResponse.headers.get('location');
            let status = await initiateResponse.status
            localStorage.setItem('loc_url', header_res)
    
            if (header_res != null) {
              uploadfile(header_res, selectedFile)
            }
          } else {
            console.error('Failed to initiate the resumable session.');
          }
    
        }
        catch (error) {
          console.log(error)
        }finally{
          setTimeout(function () {
            // end_loading(myButton, 'Upload')
           }, 1000)
        }
      }
      // END FUNCTION
    
      const uploadfile = async (header_res, selectedFile, range = null) => {
        // alert(range)
        if (selectedFile) {
          // Create a new FileReader
          const fileReader = new FileReader();
    
          // Define an event handler for when the file is loaded
          fileReader.onload = function (event) {
           
            //alert(event)
            let chunkIndex = ''
            // Access the file data as an ArrayBuffer
            const arrayBuffer = event.target.result;
    
            // Convert the ArrayBuffer to a Uint8Array
            const uint8Array = new Uint8Array(arrayBuffer);
    
            // Get a chunk of 256KB from the Uint8Array
            const chunkSize = 256 * 1024; // 200KB
            // Initialize variables for tracking chunk index and total chunks
    
            if (range !== null) {
              chunkIndex = localStorage.getItem('chunkIndex');
            } else {
              chunkIndex = 0;
            }
    
    
            const totalChunks = Math.ceil(uint8Array.length / chunkSize);
    
    
            async function uploadLessThan(range = null, selectedFile) {
    
              const totalSize_ = uint8Array.length;
              let chunk_ = '';
              //console.log(`the chunk is ${chunk_}`)
    
              let _start = ''
    
              if (range != null) {
                console.log('range is present')
                _start = Number(range) + 1
                console.log(_start)
                chunk_ = uint8Array.slice(_start, uint8Array.length);
              } else {
                _start = 0
                chunk_ = uint8Array
              }
    
    
    
              // Step 2: Upload the file
              const uploadFile = async (header_res, selectedFile) => {
    
                // alert(localStorage.getItem('folder_id'))
                const response = await axios(
                  {
                    method: "PUT",
                    url: header_res,
                    headers: {
                      'Content-Range': `bytes ${_start}-${totalSize_ - 1}/${totalSize_}`,
                      'Content-Type': selectedFile.type, // Specify the MIME type
                    },
                    data: chunk_,
                    onUploadProgress: (progressEvent) => {
                      if (range != null) {
    
                        console.log('totalsize' + totalSize_)
                        let new_load = (progressEvent.loaded + Number(range))
                        let percentCompleted = Math.round((new_load / totalSize_ * 100));
                        $('.prog').text(`${Math.round(percentCompleted)}%`)
    
                        console.log(`Upload Progress: ${percentCompleted}%`);
                        console.log(`File Loaded: ${new_load}`);
    
                        $('.progress_bar').removeClass('bg-green-500')
                        $('.progress_bar').addClass('is-active')
                        $('.progress_bar').addClass('bg-orange-500')
                        $('#progress_bar_section').show()
                        $('.progress_bar').css('width', `${percentCompleted.toFixed(2)}%`)
                        $('#upload_percentage').text(`${Math.round(percentCompleted)}%`)
                      } else {
                        // Calculate and report the upload progress
                        $('.prog').text(`${Math.round(progressEvent.loaded * 100 / progressEvent.total)}%`)
                        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    
                        console.log(`Upload Progress: ${percentCompleted}%`);
                        console.log(`File Loaded: ${progressEvent.loaded}`);
    
                        $('.progress_bar').removeClass('bg-green-500')
                        $('.progress_bar').addClass('is-active')
                        $('.progress_bar').addClass('bg-orange-500')
                        $('#progress_bar_section').show()
                        $('#upload_percentage').text(`${Math.round(percentCompleted)}%`)
                        $('.progress_bar').css('width', `${percentCompleted.toFixed(2)}%`)
                      }
    
                    }
                  })
                  .then((response) => {
                    // Handle a successful response here
                    console.log('Response data:', response.data);
                    console.log('Response data:', response.status);
                    if (response.status == 200) {
    
    
                      $('.progress_bar').removeClass('bg-orange-500')
                      $('.progress_bar').removeClass('bg-warning')
                      $('.progress_bar').removeClass('is-active')
                      $('.progress_bar').addClass('bg-green-500')
    
                    }
                    gogetMetadata(response.data)
                  })
                  .catch((error) => {
                    if (error.response) {
    
                      // The request was made and the server responded with a non-2xx status code
                      console.log('Error response status:', error.response.status);
                      console.log('Error response data:', error.response.data);
                    } else if (error.request) {
                      // The request was made but no response was received, typically a network issue
                      console.error('Network issue:', error.request);
                      checkResume(header_res, totalSize_)
                    } else {
                      // Something happened in setting up the request or during the request
                      console.error('Request error:', error.message);
                    }
                  });
    
              }
    
              uploadFile(header_res, selectedFile)
            }
    
            async function submitAndUpdate(selectedFile, fileId) {
              console.log('submit')
              let url_params = window.location.href;
              let parts = url_params.split('/');
              let url_id = parts[parts.length - 1];
              console.log($('#answered').val())
              let settings = {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                  email: $('#upload_email').val(),
                  name: $('#upload_name').val(),
                  answers: $('#answered').val(),
                  record_id: url_id,
                  fileType: selectedFile.type,
                  fileName: selectedFile.name,
                  fileId: fileId,
                  fileSize: uint8Array.length
                })
              };
    
              console.log(settings)
              console.log('<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>')
              try {
                let submitResponse = await fetch(`http://localhost:5000/api/app/submitAndUpdate`, settings);
                // let head = await fetchResponses.headers
                let sta = await submitResponse.status
                let json = await submitResponse.json();
    
                if (sta == 200) {
                  $('#main_content').hide()
                  $('#upload_title').text('Upload Completed')
    
                  // RELOAD PAGE AFTER ALL
                  // window.location.href = `http://127.0.0.1:5502/dist/auth/signin.html`
                }
              } catch (err) {
                console.log(err)
              }
            }
    
            async function gogetMetadata(res) {
              
              // Assuming you have authenticated and obtained an access token
              const accessToken = localStorage.getItem('b_token'); // Replace with your actual access token
              const fileId = res.id; // Replace with the actual file ID
    
              // Make a request to fetch the file's metadata, including webViewLink
              const webLink = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=webViewLink`;
              const webContent = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=webContentLink`;
              try {
                const linkResponse = await fetch(webLink, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                  },
    
                });
                console.log('link status:' + linkResponse.status)
                if (linkResponse.status == 200) {
                  let link = await linkResponse.json()
                  console.log(link.webViewLink)
                  alert('update and submit')
                  // submitAndUpdate(selectedFile, fileId)
                }
    
              }
              catch (error) {
                console.error('Error fetching wbviewLink:', error);
              }finally{
                setTimeout(function () {
                  end_loading(myButton, 'Upload')
                 }, 1000)
              }
    
              try {
                const linkContent = await fetch(webContent, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                  },
                });
    
                let content = await linkContent.json()
                console.log(content.webContentLink)
                console.log(content)
              }
              catch (error) {
                console.error('Error fetching webViewContent:', error);
              }
    
    
            }
    
            // Function to update the progress bar and text 
    
    
            // Check if file size is less than 256 of equal to 256 kb
            console.log(uint8Array.length)
            if (uint8Array.length >= (1024)) {
              console.log('less thank')
              uploadLessThan(range, selectedFile)
            }
    
          };
    
          // Read the file as an ArrayBuffer
          fileReader.readAsArrayBuffer(selectedFile);
        }
      }
      getlocations(selectedFile)
    }
    }))