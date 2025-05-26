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

  // if (plan != 2) {
  //   setTimeout(function () {
  //     $(`#cancel_stroage_selec_modal`).trigger("click"); // close modal
  //     setActiveItem("Plan");
  //   }, 1000);
  //   showNoti("primary", "Upgrade to a paid plan to access this feature", 4000);
  //   return false;
  // }

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
    showNoti("white", `your zip file is being created. This might take a while, be patient.`, 8000);
    
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
const viewAll = function(recordId, pageName) {
  // Store the data for the submissions component to access
  localStorage.setItem('currentSubmissionRecord', JSON.stringify({
    id: recordId,
    pageName: pageName
  }));
  
  // Update the "Submissions For" text immediately
  const submissionForEls = document.querySelectorAll('.submission_for');
  if (submissionForEls.length > 0) {
    submissionForEls.forEach(el => {
      el.textContent = pageName;
    });
  }
    window.submission_for(pageName); // try this if the other doset wor
  // Call the global function to fetch submissions
  if (typeof window.callSubmittedData === 'function') {
    window.callSubmittedData(recordId);
  } else {
    console.error('callSubmittedData function not found on window object');
    // Fallback: You could trigger a custom event here as an alternative
  }
  
  // Let Alpine.js handle the tab switching
  return true;
};

// Make viewAll globally available if needed
window.viewAll = viewAll;

// GET COUNTS FOR EACH FILE RECORDS
async function getSubmissionCount() {
  let settings = {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('access')}`,
    }
  }
  try {
      const response = await fetch(`${backendUrl}/api/app/getSubmissionCount`, settings);
      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }
    const data = await response.json();
    console.log(data)
    data.message.sort((a, b) => a.id - b.id);

console.log(data);
      return data.message;
  } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
  }
}
// GET LIS OF ALL RECORDS
function getStatusBadge(status) {
  switch (status) {
    case "active":
      return `<span class="badge  text-success">Active</span>`;
    case "inactive":
      return `<span class="badge text-warning">Inactive</span>`;
    case "expired":
      return `<span class="badge  text-danger text-red-600">Expired</span>`;
    default:
      return `<span class="badge  text-black">Unknown</span>`;
  }
}

async function getRecordList() {
  try {
    // Simulate loading state
    $("#display").html(`
      <tr>
        <td colspan="7" class="text-center py-4">
          <div class="w-full space-y-3">
            <!-- Table Row Skeleton -->
            ${[...Array(5)].map(() => `
              <div class="flex space-x-4 animate-pulse">
                <div class="h-6 w-6 rounded-full bg-gray-200"></div> <!-- Icon/Avatar -->
                <div class="flex-1 space-y-2">
                  <div class="h-4 w-3/4 bg-gray-200 rounded"></div> <!-- First Line -->
                  <div class="h-4 w-1/2 bg-gray-200 rounded"></div> <!-- Second Line -->
                </div>
              </div>
            `).join('')}
          </div>
        </td>
      </tr>
    `);
    

    // Fetch data from the backend
    const settings = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };
    const fetchResponses = await fetch(`${backendUrl}/api/app/getrecords`, settings);
    const status = fetchResponses.status;
    const res = await fetchResponses.json();
    console.log(status)
    console.log(res)
    // Handle errors
    if (res.error === 1 || res.error === 2) {
      if (res.error === 2) {
        window.location.href = `${baseUrl}/auth`;
      }
      if (res.error === 1) {
        // No user data present
     // In your getRecordList() function where you show "no records found":
$("#display").html(`
  <tr>
    <td colspan="7" class="text-center py-4">
      <div class="text-gray-500 dark:text-gray-400">
        No records found. 
        <span id="create_project_trigger" class="text-primary hover:underline cursor-pointer">Create your request now</span>.
      </div>
    </td>
  </tr>
`);

// Add event listener after inserting the HTML
document.getElementById('create_project_trigger').addEventListener('click', function() {
  document.getElementById('create_project_button').click();
});
      }
      return;
    }

    // Process data if successful
    if (res.success === 1 && status === 200) {
      // First get the submission counts
      const submissionCount = await getSubmissionCount();
      const data = res.data;

      if (data && data.length > 0) {
        let tableRows = "";
        // Clear the existing allArrayEdit.values, but keep other properties
        allArrayEdit.values = {};

        data.forEach((record, index) => {
          const recordData = record.record_data;
          const statusBadge = getStatusBadge(record.status);

          // **Populate allArrayEdit here**
          allArrayEdit[index] = { // changed from allArrayEdit.values[index]
            record_id: record.record_id,
            record_data: recordData,
          };
          // Populate allArrayEdit.values
          if (recordData.values) {
             for (const pageName in recordData.values) {
                if (!allArrayEdit.values[pageName]) {
                    allArrayEdit.values[pageName] = recordData.values[pageName];
                }
                else{
                  allArrayEdit.values[pageName] = recordData.values[pageName];
                }
             }
          }

          tableRows += `
            <tr class="capitalize border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
              <td class="whitespace-nowrap px-4 py-3 max-h-8 sm:px-5">
                <div class="flex items-center space-x-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                  </svg>
                  <span class="font-medium text-slate-700 dark:text-navy-100">${recordData.otherData.page_name}</span>
                </div>
              </td>
              <td class="whitespace-nowrap px-4 py-3 max-h-8 sm:px-5">
                ${moment(record.expiry_date).format("lll")}
              </td>
              <td class="whitespace-nowrap px-4 py-3 max-h-8 text-slate-700 dark:text-navy-100 sm:px-5">
                <span>${submissionCount[index].count}</span>
                <span @click="activeItem = 'Submissions'" onclick="viewAll('${record.record_id}', '${recordData.otherData.page_name}')" class="text-blue-500 normal-case pl-3 cursor-pointer">View all</span>
              </td>
              <td class="whitespace-nowrap normal-case px-4 py-3 max-h-8 sm:px-5">
                <div class="flex -space-x-2">
                  <div> <a 
                          id="clipboardContent${record.record_id}" 
                          href="${baseUrl}/form/${record.record_id.replace(/\s/g, "")}" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          ${baseUrl}/form/${record.record_id.replace(/\s/g, "")}
                        </a>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-4 py-3 max-h-8 sm:px-5">
                <div class="flex -space-x-2">
                  <div class="flex space-x-4">
                    <button onclick="customButtonClick('${recordData.otherData.page_url}')" class="btn h-8 w-8 p-1 font-medium text-slate-800 hover:text-blue-500 active:bg-success-focus/30">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                        <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
                      </svg>
                    </button>
                    </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-4 py-3 max-h-8 sm:px-5">
                <div class="flex -space-x-2">
                  ${statusBadge}
                </div>
              </td>
            <td class="whitespace-nowrap px-4 py-3 max-h-8 sm:px-5">
              <div class="flex items-center space-x-2">
                <button
                  onclick="downloadZip('${record.record_id}', '${recordData.otherData.page_url}', '${recordData.otherData.folder_id}', '${recordData.otherData.sfolder_id}')"
                  class="icon-btn bg-blue-50 hover:bg-blue-100 text-blue-500 active:bg-blue-200 transition-colors duration-200 transform hover:scale-110"
                  title="Download Files"
                  style="padding: 0.5rem;"
                >
                  <span class="material-icons" style="font-size: 1rem;">download</span>
                </button>

                <button
                  onclick="editRecord('${record.record_id}', ${index})"
                  class="icon-btn bg-green-50 hover:bg-green-100 text-green-500 active:bg-green-200 transition-colors duration-200 transform hover:scale-110"
                  title="Edit"
                  style="padding: 0.5rem;"
                >
                  <span class="material-icons" style="font-size: 1rem;">edit</span>
                </button>

                <button
                  onclick="deleteRecord('${record.record_id}')"
                  class="icon-btn bg-red-50 hover:bg-red-100 text-red-500 active:bg-red-200 transition-colors duration-200 transform hover:scale-110"
                  title="Delete"
                  style="padding: 0.5rem;"
                >
                  <span class="material-icons" style="font-size: 1rem;">delete</span>
                </button>
              </div>
            </td>

            </tr>
          `;
        });

        // Populate the table with data
        $("#display").html(tableRows);
      } else {
        // Display "no records" message
        $("#display").html(`
          <tr>
            <td colspan="7" class="text-center py-4">
              <div class="text-gray-500">
                No records found. <a href="#" class="text-primary hover:underline">Create your request now</a>.
              </div>
            </td>
          </tr>
        `);
      }
    } else {
      console.log("Something went wrong");
      window.location.href = `${baseUrl}/auth`;
    }
  } catch (err) {
    console.error("Error fetching records:", err);
    $("#display").html(`
      <tr>
        <td colspan="7" class="text-center py-4">
          <div class="text-red-500">
            Failed to load records. Please try again later.
          </div>
        </td>
      </tr>
    `);
  }
}

// Call the function
getRecordList();


function editRecord(recordId, index) { // Add index parameter
  console.log('Edit record:', recordId, 'at index:', index);
  setActiveItem("Create");
  $(`#cancel_stroage_selec_modal`).trigger("click");
  if (localStorage.getItem("preferred") == 1) {
    localStorage.setItem("preferred", 0);
    localStorage.removeItem("my_goog_acc");
  }
  window.callEdit(index); // Pass the index to window.callEdit
}

async function deleteRecord(recordId) {
  console.log('Delete record:', recordId);
  
  if (confirm('Are you sure you want to delete this record?')) {
    let settings = {
      method: 'POST', // Changed to POST since we're modifying data
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ recordId: recordId }) // Send the recordId in the body
    }
console.log(settings)
    try {
      const response = await fetch(`${backendUrl}/api/app/deleteRecord`, settings);
      console.log(response)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete record');
      }

      const data = await response.json();
      
      // Show success notification
      showNoti(
        "success", 
        "Record deleted successfully",
        5000
      );
      
      // Refresh the record list
      await getRecordList();
      
      return data;

    } catch (error) {
      console.error('Error deleting record:', error);
      
      // Show error notification
      showNoti(
        "error",
        error.message || "Failed to delete record",
        5000
      );
      
      throw error;
    }
  }
}

