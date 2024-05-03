$(".app-preloader").show();

function setActiveItem(item) {
  // Set activeItem in localStorage with a 2-minute expiration time
  localStorage.setItem("activeItem", item);
  localStorage.setItem("activeItemTimestamp", Date.now());

  $(`#_${item}`).trigger("click");
}

//GET SPEEDLINK GOOGLE_ACCESS TOKEN TO UPLOAD TO SPEEDLINK DRIVE
async function speedlinkAccess(plan) {
  // If user is on freelan, dont nlet them access this, also
  // Block this access via server side

  if (plan != 2) {
    setTimeout(function () {
      $(`#cancel_stroage_selec_modal`).trigger("click"); // close modal
      setActiveItem("Plan");
    }, 1000);
    showNoti("primary", "Upgrade to a paid plan to access this feature", 4000);
    return false;
  }

  setActiveItem("Create");
  $(`#cancel_stroage_selec_modal`).trigger("click");
  // Remove the set googla access token, so when users try to select folder to tore their drive,
  // it dosent let them as this is defaulted to the email address as the drive folder
  if (localStorage.getItem("preferred") == 1) {
    localStorage.setItem("preferred", 0);
    localStorage.removeItem("my_goog_acc");
  }
}

async function myStorage() {
  localStorage.setItem("temp_mystore", true); // set a temporary storage which will be used to know the user clicked this option
  // window.location.href = `${backendUrl}/api/google/auth` // prompt

  let settings = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  };
  try {
    let fetchResponses = await fetch(
      `${backendUrl}/api/google/mystorage`,
      settings
    );
    let staus = await fetchResponses.status;
    let res = await fetchResponses.json();

    if (res.error == 1) {
    } else if (res.error == 2) {
      window.location.href = `${baseUrl}/auth`;
    } else if (res.success == 1) {
      console.log(res.token);
      localStorage.setItem("my_goog_acc", res.token); // google access token for users second time
      localStorage.setItem("b_token", res.token); // google access token for users second time
      localStorage.setItem("preferred", 1);
      setActiveItem("Create");
      $(`#cancel_stroage_selec_modal`).trigger("click");
      // window.location.href = `${baseUrl}/dash/create`
    } else {
      console.log("something is wrong");
    }
  } catch (err) {
    console.log("internet error");
    console.log(err);
  }
}

async function newStorage() {
  localStorage.setItem("temp_newstore", 1); // set a temporary storage which will be used to know the user clicked this option
  localStorage.setItem("preferred", 1); // set a temporary storage which will be used to know the user clicked this option
  window.location.href = `${backendUrl}/api/google/auth/${localStorage.getItem(
    "access"
  )}`; // prompt

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

async function downloadZip(record_id, u, f, s) {
  $.ajax({
    url: `${backendUrl}/api/google/downloadFolderAsZip/${record_id}/${u}/${f}/${s}`,
    type: "GET",
    beforeSend: function () {
      // alert('loading')
    },
    success: function (response, status) {
      // Handle successful response
      console.log(status);
      console.log(response);
      createZipFile(response.token);
    },
    error: function (xhr, status, error) {
      // Handle error
      console.log(error);
    },
  });

  async function createZipFileOld(accessToken) {
    // Create a zip file.
    const zip = new JSZip();
    console.log('start folder is', f)

    // Get the parent folder's ID.
    const folderId = f; // Assuming you want to start from the root folder
    let totalBytesDownloaded = 0;
    // Function to fetch files and subfolders recursively
    async function fetchFilesAndSubfolders(folderId, zipFolder) {
      const response = await axios.get(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents&fields=files(id,name,mimeType)`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: "json",
          onDownloadProgress: function (progressEvent) {
            // Indicate that download is in progress
            console.log("Download in progress...");
          },
        }
      );

      const items = response.data.files;
      console.log('this is th items', items)

      // Fetch files and subfolders recursively
      for (const item of items) {
        console.log('for loop started')
        if (item.mimeType === "application/vnd.google-apps.folder") {
          console.log('this is a folder')
          // If it's a folder, create a subfolder in the zip and recursively fetch its contents
          const subZipFolder = zipFolder.folder(item.name);
          await fetchFilesAndSubfolders(item.id, subZipFolder);
        } else {
          console.log('this is not a folder')
          // If it's a file, add it to the current zip folder
          const fileResponse = await axios.get(
            `https://www.googleapis.com/drive/v3/files/${item.id}?alt=media`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              responseType: "blob",
            }
          );
          console.log(item.name)
          console.log(fileResponse.data)
          zipFolder.file(item.name, fileResponse.data);
        }
      }
    }

    try {
      // Start fetching files and subfolders recursively
      await fetchFilesAndSubfolders(folderId, zip);
      // Save the zip file using FileSaver.js
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "folder.zip");
      console.log("Download initiated.");
    } catch (error) {
      console.error("Error fetching files and subfolders:", error);
    }
  }

  async function createZipFiles(accessToken) {
    // Create a zip file.
    const zip = new JSZip();

    // Get the parent folder's ID.
    const folderId = f; // Assuming you want to start from the root folder

    // Function to fetch files and subfolders recursively
    async function fetchFilesAndSubfolders(folderId, zipFolder) {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents&fields=files(id,name,mimeType)`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      const items = data.files;

      // Fetch files and subfolders recursively
      for (const item of items) {
        if (item.mimeType === "application/vnd.google-apps.folder") {
          // If it's a folder, create a subfolder in the zip and recursively fetch its contents
          const subZipFolder = zipFolder.folder(item.name);
          await fetchFilesAndSubfolders(item.id, subZipFolder);
        } else {
          // If it's a file, add it to the current zip folder
          const fileResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files/${item.id}?alt=media`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const blob = await fileResponse.blob();
          zipFolder.file(item.name, blob);
        }
      }
    }

    try {
      // Start fetching files and subfolders recursively
      await fetchFilesAndSubfolders(folderId, zip);

      // Save the zip file using FileSaver.js
      const blob = await zip.generateAsync({ type: "blob" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "folder.zip";
      link.click();
      console.log("Clicked");
    } catch (error) {
      console.error("Error fetching files and subfolders:", error);
    }
  }
  async function createZipFileTrackLocally(accessToken) {
    // Create a zip file.
    const zip = new JSZip();
  
    // Get the parent folder's ID.
    const folderId = f; // Assuming you want to start from the root folder
  
    // Function to gather file information and download functions
    async function getFileData(folderId) {
      const response = await axios.get(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents&fields=files(id,name,mimeType,size)`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: "json",
        }
      );
  
      const items = response.data.files;
      const files = [];
      let totalSize = 0; // Store total size for progress calculation
  
      for (const item of items) {
        if (item.mimeType === "application/vnd.google-apps.folder") {
          // Recursively get files from subfolders
          files.push(...(await getFileData(item.id)));
        } else {
          // Create a download function for each file
          files.push({
            name: item.name,
            size: item.size, // Assuming size is available
            download: async () => {
              const fileResponse = await axios.get(
                `https://www.googleapis.com/drive/v3/files/${item.id}?alt=media`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                  responseType: "blob",
                  onDownloadProgress: async (progressEvent) => {
                    totalSize += progressEvent.loaded; // Accumulate total size
                    const progress = totalSize === 0
                      ? 0
                      : (progressEvent.loaded / totalSize) * 100;
                    console.log(`Overall Download Progress: ${progress.toFixed(2)}%`);
                  },
                }
              );
              return fileResponse.data;
            },
          });
        }
      }
  
      return files;
    }
  
    try {
      // Get file information for the entire folder structure
      const files = await getFileData(folderId);
  
      // Build the zip archive structure
      for (const file of files) {
        if (file.mimeType === "application/vnd.google-apps.folder") {
          zip.folder(file.name);
        }
      }
  
      // Download and add files to the zip archive
      for (const file of files) {
        if (file.mimeType !== "application/vnd.google-apps.folder") {
          const downloadedFile = await file.download();
          zip.file(file.name, downloadedFile);
        }
      }
  
      // Generate the zip blob after all downloads
      const blob = await zip.generateAsync({ type: "blob" });
  
      // Trigger download using saveAs
      saveAs(blob, "folder.zip");
      console.log("Download initiated.");
    } catch (error) {
      console.error("Error fetching files and subfolders:", error);
    }
  }

  async function createZipFileO(accessToken) {
    // Create a zip file.
    const zip = new JSZip();
    console.log('start folder is', f);
  
    // Get the parent folder's ID.
    const folderId = f; // Assuming you want to start from the root folder
  
    // Function to fetch files and subfolders recursively
    async function fetchFilesAndSubfolders(folderId, zipFolder) {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents&fields=files(id,name,mimeType)`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      const items = await response.json();
      console.log('this is the items', items);
  
      // Fetch files and subfolders recursively
      for (const item of items) {
        console.log('for loop started');
        if (item.mimeType === "application/vnd.google-apps.folder") {
          console.log('this is a folder');
          // If it's a folder, create a subfolder in the zip and recursively fetch its contents
          const subZipFolder = zipFolder.folder(item.name);
          await fetchFilesAndSubfolders(item.id, subZipFolder);
        } else {
          console.log('this is not a folder');
          // If it's a file, download and add it to the current zip folder
          try {
            const fileResponse = await fetch(
              `https://www.googleapis.com/drive/v3/files/${item.id}?alt=media`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
                responseType: "blob",
              }
            );
  
            if (!fileResponse.ok) {
              throw new Error(`Error downloading file ${item.name}: ${fileResponse.statusText}`);
            }
  
            const fileBlob = await fileResponse.blob();
            zipFolder.file(item.name, fileBlob);
          } catch (error) {
            console.error(`Error downloading file ${item.name}:`, error);
            // Handle download error (e.g., skip file, log error)
          }
        }
      }
    }
  
    try {
      // Start fetching files and subfolders recursively
      await fetchFilesAndSubfolders(folderId, zip);
  
      // Save the zip file using FileSaver.js
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "folder.zip");
      console.log("Download initiated.");
    } catch (error) {
      console.error("Error fetching files and subfolders:", error);
    }
  }

  async function createZipFile(accessToken) {
    // Create a zip file.
    const zip = new JSZip();

    // Get the parent folder's ID.
    const folderId = f; // Assuming you want to start from the root folder

    // Function to fetch files and subfolders recursively
    async function fetchFilesAndSubfolders(folderId, zipFolder) {
        const response = await axios.get(
            `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents&fields=files(id,name,mimeType)`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                responseType: "json",
                onDownloadProgress: function (progressEvent) {
                    // Indicate that download is in progress
                    console.log("Download in progress...");
                },
            }
        );

        const items = response.data.files;

        // Fetch files and subfolders recursively
        for (const item of items) {
            if (item.mimeType === "application/vnd.google-apps.folder") {
                // If it's a folder, create a subfolder in the zip and recursively fetch its contents
                const subZipFolder = zipFolder.folder(item.name);
                await fetchFilesAndSubfolders(item.id, subZipFolder);
            } else {
                // If it's a file, add it to the current zip folder
                const fileResponse = await axios.get(
                    `https://www.googleapis.com/drive/v3/files/${item.id}?alt=media`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        responseType: "blob",
                    }
                );
                zipFolder.file(item.name, fileResponse.data);
            }
        }
    }

    try {
        // Start fetching files and subfolders recursively
        await fetchFilesAndSubfolders(folderId, zip);

        // Generate the zip file
        const blob = await zip.generateAsync({ type: "blob" });

        // Create a Blob URL for the zip file
        const blobUrl = URL.createObjectURL(blob);

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = "folder.zip";
        downloadLink.click();
        
        // Cleanup: revoke the Blob URL
        URL.revokeObjectURL(blobUrl);

        console.log("Download initiated.");
    } catch (error) {
        console.error("Error fetching files and subfolders:", error);
    }
}

  
  
  
  
  
}

// GET LIS OFALL RECORDS
async function getRecordList() {
  let settings = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  };
  try {
    let fetchResponses = await fetch(
      `${backendUrl}/api/app/getrecords`,
      settings
    );
    let staus = await fetchResponses.status;
    let res = await fetchResponses.json();
    let allres; // Hold the request json data
    if (res.error == 1) {
      // alert('wrong 1')
    } else if (res.error == 2) {
      // alert('wrong 2')
      window.location.href = `${baseUrl}/auth`;
    } else if (res.success == 1 && staus == 200) {
      console.log("{{{{{{{{{{{{{{{{{{{{{{{{success}}}}}}}}}}}}}}}}}}}}}}}}");
      // console.log(res);
      if (res.data != "") {
        let jsonString = JSON.stringify(res.data);

        // console.log('jsonString', jsonString)
        let data = res.data;
        $("#display").html(""); // EMPTY THE HTML DISPLAY HOLDER
        console.log(data);

        data.forEach((rez, req_index) => {
          // console.log(rez);
          console.log(rez);
          // console.log(rez.record_data.otherData);
          // console.log(rez.record_data.otherData.page_url);

          RecordDataDashboard.push(rez); // this can be used when filtering in submission.js
          allres = rez.record_data;

          let res_status = "";
          if (rez.status == "pending") {
            res_status = `<div class=" badge border  rounded-full border-warning text-warning">${rez.status}</div>`;
          } else if (rez.status == "completed") {
            res_status = `<div class="badge border rounded-full border-success text-success">${rez.status}</div>`;
          } else {
            res_status = `<div class="badge border rounded-full border-error text-error">${rez.status}</div>`;
          }
          $("#display").append(
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
                    <span class="font-medium text-slate-700 dark:text-navy-100">${
                      allres.otherData.page_name
                    }</span
                    >
                  </div>
                </td>
                <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                  ${moment(rez.expiry_date).format("lll")} 
                </td>
                <td
                  class="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-navy-100 sm:px-5"
                >
                  <span>50</span> <span @click="activeItem = 'Submissions'" onclick="viewAll('${
                    rez.record_id
                  }', '${
              allres.otherData.page_name
            }')" class="text-primary lowercase pl-3 cursor-pointer ">View all</span>
                </td>
                <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                  <div class="flex -space-x-2">
                    <div class=""> <a id="clipboardContent${
                      rez.record_id
                    }" href="${baseUrl}/form/${rez.record_id.replace(
              /\s/g,
              ""
            )}">${baseUrl}/form/${rez.record_id.replace(/\s/g, "")}</a></div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                <div class="flex -space-x-2">
                  <div class="flex space-x-4">
                    <button onclick="customButtonClick('${
                      allres.otherData.page_url
                    }')" class="btn h-9 w-9 border border-success p-0 font-medium text-success hover:bg-success hover:text-white focus:bg-success focus:text-white active:bg-success-focus/90 ">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share " viewBox="0 0 16 16">
                        <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
                      </svg>
                    </button>

                    <div
                        x-data="usePopper({
                          offset: 12,
                          placement: 'right-start',
                          modifiers: [
                            {name: 'flip', options: {fallbackPlacements: ['bottom','top']}},
                            {name: 'preventOverflow', options: {padding: 10}}
                          ]
                      })"
                    @click.outside="if(isShowPopper) isShowPopper = false"
                    class="flex">
                      <button
                        x-ref="popperRef"
                        @click="isShowPopper = !isShowPopper"
                        class="btn h-9 w-9 border border-black p-0 font-medium text-black hover:bg-black hover:text-white focus:bg-black focus:text-black active:bg-black">
                     
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-code-slash " viewBox="0 0 16 16">
                        <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0"/>
                      </svg>
                      </button>

                      <div x-ref="popperRoot" class="popper-root" :class="isShowPopper && 'show'">
                      <div class="popper-box min-w-fit p-2 ">
                        <div
                          class="rounded-md border border-slate-150 bg-white p-4 dark:border-navy-600 dark:bg-navy-700"
                        >
                          <h4
                            class="text-base font-medium tracking- text-slate-700 line-clamp- dark:text-navy-100"
                          >
                              Copy and embed in your own code base 
                          </h4>
                          <div>
<pre class="mt-2"><code id="htmlCode" class="language-html code-block${req_index}">
&lt;iframe
style="width: 100%; height: 500px"
frameborder="0"
src='http://localhost:4000/form/${rez.record_id}' &gt;
&lt;/iframe&gt;</code></pre>

                          <button
                          class="btn mt-2 h-6 border shrink-0 rounded bg-white/20 px-2 text-xs text-black active:bg-white/25"
                          @click="$clipboard({
                            content:document.querySelector('.code-block${req_index}').innerText,
                            success:()=>$notification({text:'Text Copied',variant:'success'}),
                            error:()=>$notification({text:'Error',variant:'error'})
                          })"
                        >
                          Copy
                        </button>
                          </div>

                      
                        </div>
                      </div>
                      </div>

        
                    </div>

                    <button @click="$clipboard({
                      content:'${baseUrl}/form/${rez.record_id.replace(/\s/g, "")}',
                      success:()=>$notification({text:'Link copied',variant:'success'}),
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
                        class="!text-black popper-box rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                        <ul>
             
                        
                        <li onclick="downloadZip('${rez.record_id}', 
                        '${ rez.user_google_id}', '${rez.folder_id}', '${rez.storage_email}')">
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
                            // url: "https://speedlink/form/"+${allres.otherData.page_url
                              .replace(/\s/g, "")
                              .toLowerCase()},
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
          );
        });
      } else {
        $(".dashboardTableHolder").html(""); // set diaplay to empty
        console.log($(".tReq").text());
        $(".dashboardTableHolder").append(
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
        );
      }
    } else {
      console.log("something is wrong");
      window.location.href = `${baseUrl}/auth`;
    }
  } catch (err) {
    console.log("internet error");
    console.log(err);
  }
}

getRecordList();
