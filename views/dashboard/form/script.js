document.addEventListener("alpine:init", () => {
  const conditionSymbolMap = {
    greater: ">",
    less: "<",
    equal: "===",
    less_equal: "<=",
    greater_equal: ">=",
    empty: `=== ""`,
    not_empty: `!== ""`,
    contains: ".includes",
    does_not_contain: "!.includes",
    checked: "=== true",
    not_checked: "=== false",
  };

  function pushConditionWithSymbol(conditionValue, arrayType, _conditionsWord) {
    arrayType.push(conditionSymbolMap[conditionValue] || conditionValue);
    _conditionsWord.push(conditionValue);
  }

  function comparedPush(compareValue, arrayType, arrcondition, count) {
    // alert(arrcondition[count-1])
    if (
      arrcondition[count - 1] === "greater" ||
      arrcondition[count - 1] == "less" ||
      arrcondition[count - 1] == "less_equal" ||
      arrcondition[count - 1] == "greater_equal"
    ) {
      const doubleValue = parseFloat(compareValue);

      // Check if the conversion is successful (not NaN)
      if (!isNaN(doubleValue)) {
        arrayType.push(doubleValue);
        // console.log(arrayType)
      } else {
        // Handle the case where compareValue is not a valid double
        console.error("Invalid compareValue:", compareValue);
      }
    }

    if (
      arrcondition[count - 1] === "empty" ||
      arrcondition[count - 1] === "not_empty" ||
      arrcondition[count - 1] === "does_not_contain" ||
      arrcondition[count - 1] === "contains" ||
      arrcondition[count - 1] === "not_checked" ||
      arrcondition[count - 1] === "equal"
    ) {
      arrayType.push(compareValue.toString());
    }

    //console.log(arrayType)
  }

  Alpine.data("dropdown", () => ({
    watermark_div:false,
    isLoading: false,
    open: false,
    items: [],
    conditionsTest: [],
    _errors: [],
    requestJson: "",

    // SETTINGS
    preFileName: "",
    fileSettings: {},
    dropdownSettings: {},
    emailSettings: {},
    textSettings: {},
    // END SETTING

    // FORM REPLIES VALUES
    allReplyLink: [],

    // FILE UPLOADS
    allWebViewLink: [],
    allWebDownloadLink: [],
    uploadFolderId: null,
    UploadStatusProgress: "",
    countDownUpload: 0,
    allUploadImageArray: [],
    allUploadedFiles: 0,
    fileLabel: [],
    fileSourceName: [],
    ii: 0,
    countfielTofield: 0,
    ensure: 0,
    ensureOnce: 0,

    // SUCCESS AND ERROR
    errorMesg: 0,
    successMesg: 0,
    patternRegExp: null,

    // onShowNoti: function (message) {
    //   $notification({text:message,variant:'warning',position:'center-top',duration:3000})
    // },

    async callSuccess(message) {
      const successPageTextElement =
        document.getElementById("success_page_text");
      this.successMesg =
        successPageTextElement.value !== ""
          ? successPageTextElement.value
          : message;
      return;
    },

    async callError(message) {
      const errorPageTextElement = document.getElementById("success_page_text");
      this.errorMesg =
        errorPageTextElement.value !== ""
          ? errorPageTextElement.value
          : message;
      return;
    },

    async submitAndUpdate(res) {
      console.log("*********************8", res);
      let settings = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          submit_id: localStorage.getItem("submit_id"),
          replyLinks: res,
          fileLinks: this.allWebDownloadLink,
        }),
      };

      // console.log(settings)

      try {
        let submitResponse = await fetch(
          `${backendUrl}/api/app/submitAndUpdate`,
          settings
        );
        // let head = await fetchResponses.headers
        let sta = await submitResponse.status;
        let json = await submitResponse.json();

        console.log(sta);

        if (sta == 200) {
          const close_myButton = document.getElementById("close_progress");
          close_myButton.click();

          await this.callSuccess("Form has been submitted successfully..");
          let successModal = document.querySelector("#showModalSuccess");
          successModal.click();
          this.isLoading = false;

          // RELOAD PAGE AFTER ALL
          // location.reload();
          return false;
        } else {
          await this.callSuccess("ERROR Happened");

          let errorModal = document.querySelector("#showModalError");
          errorModal.click();
        }
      } catch (err) {
        this.isLoading = true
        console.log(err);
        this.errorMesg = err;
        let errorModal = document.querySelector("#showModalError");
        errorModal.click();
      }
    },

    async downloadDoc() {
      var _allReplyLink = this.allReplyLink;
      var preHtml =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
      var postHtml = "</body></html>";
      // Get the HTML content of the div
      var html =
        preHtml + document.querySelector(".convertToDoc").innerHTML + postHtml;

      // Create a new Blob object with the HTML content
      var blob = new Blob(["\ufeff", html], { type: "application/msword" });
      // Create a new Blob object with the HTML content
      var blob2 = new Blob(["\ufeff", html], { type: "text/html" });

      var uint8Array;
      var start = 0;
      var uint8Array;
      var totalSize = 0;

      var fileReader = new FileReader();

      fileReader.onload = function (event) {
        // Access the Blob data as an ArrayBuffer
        var arrayBuffer = event.target.result;
        // Convert the ArrayBuffer to a Uint8Array
        uint8Array = new Uint8Array(arrayBuffer);
        totalSize = uint8Array.length;
        console.log(uint8Array);
      };
      fileReader.readAsArrayBuffer(blob);

      async function getMeta(fileId) {
        let web = "";
        let down = "";

        const webLink = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=webViewLink`;
        const webContent = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=webContentLink`;

        try {
          const [linkResponse, linkContent] = await Promise.all([
            fetch(webLink, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${
                  document.querySelector("#uploadToken").value
                }`,
                Accept: "application/json",
              },
            }),
            fetch(webContent, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${
                  document.querySelector("#uploadToken").value
                }`,
                Accept: "application/json",
              },
            }),
          ]);

          if (linkResponse.status === 200) {
            const link = await linkResponse.json();
            web = link.webViewLink;
          }

          const content = await linkContent.json();
          const newUrl = content.webContentLink.replace(/&authuser=0/, "");
          const id = content.webContentLink.match(/id=([^&]+)/)[1];
          const desiredUrl = `https://drive.usercontent.google.com/u/1/uc?id=${id}&export=download`;
          down = desiredUrl;
        } catch (error) {
          console.error("Error fetching data:", error);
          this.errorMesg = error;
          let errorModal = document.querySelector("#showModalError");
          errorModal.click();
        }

        // Use 'web' and 'down' as needed
        console.log("Web Link:", web);
        console.log("Download Link:", down);
        const links = {
          name: "Form Reply",
          webViewLink: web,
          downloadLink: down,
        };
        _allReplyLink.push(links);
        console.log(_allReplyLink);
        return _allReplyLink;
      }

      async function uploadDoc(header_res) {
        try {
          const response = await axios({
            method: "PUT",
            url: header_res,
            headers: {
              "Content-Range": `bytes ${start}-${totalSize - 1}/${totalSize}`,
              "Content-Type": blob.type, // Specify the MIME type
            },
            data: uint8Array,
          });

          console.log(response);

          if (response.status === 200) {
            console.log("Upload successful");

            // Extract fileId from the response, assuming it's a JSON response
            const data = response.data;
            // const fileId = data.files[0].id;
            let fileId = data.id;

            // Call getMeta function with fileId (replace 'fileIds' with the actual variable)
            let allReplyLink_ = await getMeta(fileId);
            console.log(allReplyLink_);
            // Return fileId or perform other actions with fileId as needed
            return allReplyLink_;
          }
        } catch (error) {
          console.error("Error uploading document:", error);
          (this.errorMesg = "Error uploading document:"), error;
          let errorModal = document.querySelector("#showModalError");
          errorModal.click();
          // Handle errors here
        }
      }

      // alert(document.querySelector("#defaultParent").value)
      try {
        // Step 1: Initiate the resumable session
        const initiateResponse = await fetch(
          "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${
                document.querySelector("#uploadToken").value
              }`,
              "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
              name: `myDoc.doc`, // RENAME FILE HERE
              mimeType: blob.type,
              parents: [document.querySelector("#defaultParent").value], // Place the folder ID in an array
            }),
          }
        );

        console.log(initiateResponse);
        if (initiateResponse.status === 200) {
          const header_res = await initiateResponse.headers.get("location");
          let status = await initiateResponse.status;
          localStorage.setItem("loc_url", header_res);

          if (header_res != null) {
            let res = await uploadDoc(header_res);
            console.log(res);
            this.submitAndUpdate(res);
          }
        } else {
          // console.log('an error occured')
          this.errorMesg = "Resumable Error";
          let errorModal = document.querySelector("#showModalError");
          errorModal.click();
        }
      } catch (err) {
        // console.log(err)
        this.errorMesg = err;
        let errorModal = document.querySelector("#showModalError");
        errorModal.click();
      }
    },

    async repliesToDoc(replies) {
      console.log(replies);
      console.log("replies%%%%%%%%%%%%%%%%%%%%%");
      // Iterate over the form replies
      Object.values(replies.formReplies).forEach((reply) => {
        // Iterate over the fields in each reply
        Object.values(reply).forEach((field) => {
          // Log fieldName and fieldValue
          // PUT DATA TO REPLIES TOT DOC

          let data = `                    
                    <div style="margin-top: 15px; margin-bottom: 15px; display: grid;font-family: 'Verdana', sans-serif;">
                      <div style="display: flex;">
                          <span style=" margin-left: 15px; padding-left: 10px; font-weight: bold;">Question ${field.fieldCount}.</span>
                          <span style="">${field.fieldName}</span>
                      </div>
                      <div style="display: flex; margin-top:8px;" class="getCount${field.fieldCount}">
                          <span style=" margin-left: 15px;padding-left: 40px; font-weight: bold;">Reply ${field.fieldCount} :</span>
                          <span class="" style="">${field.fieldValue}</span>
                      </div>
                    </div>
                    `;
          $(".show_fields").append(data);

          // console.log(`${field.fieldName}: ${field.fieldValue}`);
        });
      });
    },

    async createSubFolders(parentFolderId, subfolderNames) {
      const accessToken = document.getElementById("uploadToken").value;
      let currentParentFolderId = parentFolderId;

      for (const subfolderName of subfolderNames) {
        var subfolderValue = subfolderName.fieldValue;

        try {
          // 1. Check if subfolder exists
          const existingFolderId = await this.checkIfSubfolderExists(
            currentParentFolderId,
            subfolderValue,
            accessToken
          );

          if (existingFolderId) {
            // Subfolder exists, update currentParentFolderId for next iteration
            console.log(
              `Subfolder '${subfolderValue}' already exists. Using its ID ${existingFolderId}.`
            );
            currentParentFolderId = existingFolderId;
            this.uploadFolderId = existingFolderId;
          } else {
            // Subfolder doesn't exist, create it
            const fileMetadata = {
              name: subfolderValue,
              parents: [currentParentFolderId],
              mimeType: "application/vnd.google-apps.folder",
            };

            const response = await fetch(
              "https://www.googleapis.com/drive/v3/files",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(fileMetadata),
              }
            );

            const fileData = await response.json();
            this.uploadFolderId = fileData.id;
            console.log(
              `Subfolder '${subfolderValue}' created with ID:`,
              fileData.id
            );

            // Update currentParentFolderId for next iteration
            currentParentFolderId = fileData.id;
          }
        } catch (error) {
          // Handle error for subfolder check or creation
          this.errorMesg = error;
          let errorModal = document.querySelector("#showModalError");
          errorModal.click();
        }
      }
    },

    // Helper function to check if a subfolder with the given name exists
    async checkIfSubfolderExists(parentFolderId, subfolderName, accessToken) {
      const query = encodeURIComponent(
        `name = '${subfolderName}' and mimeType = 'application/vnd.google-apps.folder' and '${parentFolderId}' in parents`
      );
      const url = `https://www.googleapis.com/drive/v3/files?q=${query}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (data.files && data.files.length > 0) {
        return data.files[0].id; // Return the ID of the first found subfolder
      } else {
        return null; // Subfolder not found
      }
    },

    getrealJson(jsonData_) {
      // // console.log(this.jsonData)
    },

    noSubmit() {
      // alert('no suvmits')
    },

    async repliesToJson(_errors) {
   


      this.allInputFields.forEach((field) => {
        const spanAbove = document.querySelector(`.Name${field}`);
        const fieldValue = document.querySelector(`.${field}`);
        const dataPointIdValue = fieldValue.getAttribute("data-pointId");
 
        let isUploadError = false
        if (fieldValue.name === "file") {
          console.log(`uploads${field}`)
          const getUploadFieldValue = document.querySelector(`.uploads${field}`);
          if (getUploadFieldValue.value == 'true') {
            const filePresent = document.querySelector(`#filePresent${field}`);
            console.log(filePresent);
           
            if (filePresent.value > 0 || filePresent.value != '') {
              
            } else {
              const fieldName = document.querySelector(`data-fieldName`)
              showNoti("error", `"${fieldName}" field requires a file`, 5000);
              this.isLoading = true
              this.preFileName = '' // reset prefileName as it will keep incrementing on each error
              _errors.push(true);
                
            }

          }

        }
   
      })



      if (_errors.every((element) => element === false)) {
        // Do something if all elements are false
        const replies = {
          formReplies: {},
        };
        // disturbing change is thhis pagekey
        // replies.formReplies[this.pageKey] = {}; before
        replies.formReplies[0] = {}; //after

        this.allInputFields.forEach((field) => {
          const spanAbove = document.querySelector(`.Name${field}`);
          const fieldValue = document.querySelector(`.${field}`);
          const dataPointIdValue = fieldValue.getAttribute("data-pointId");

          // let spanAbove = (inputElement.previousElementSibling).innerText;

          const fields = {
            fieldName: spanAbove.innerText,
            fieldValue: fieldValue.value,
            fieldCount: dataPointIdValue,
            // Add more mappings as needed
          };
          // Push fields into replies.formReplies[this.pageKey]
          // replies.formReplies[this.pageKey][field] = fields; before
          replies.formReplies[0][field] = fields;
        });

        /* {{{{{{{{{{{{{{{{{{{{{{{{{{{{REPLIES TO DOC }}}}}}}}}}}}}}}}}}}}}}}}}}}}*/

        // call repliesToDoc to convert the results into a document of choice
        await this.repliesToDoc(replies);

        console.log("done");
        // Create subfolders using this data
        // Example usage with a parent folder ID and an array of subfolder names
        const parentFolderId = Folder_id; // Replace with the actual parent folder ID
        const subfolderNames = Group_by;
        console.log('Group_by', Group_by);
        console.log('Group_by', Group_by.length);

        if (Group_by.length > 0 && Group_by.every(element => element === "")) { 
          alert('yes implemented')
          var result = Group_by.map(async (fieldName) => { 

            function getCurrentFormattedDate() {
              const date = new Date();
              const year = date.getFullYear();
              const month = ('0' + (date.getMonth() + 1)).slice(-2);
              const day = ('0' + date.getDate()).slice(-2);
              return `${year}-${month}-${day}`;
            }
            
            fieldName = getCurrentFormattedDate() + "_DefaultSubmission";
 
            return {
              fieldName: fieldName,
              fieldValue: null,
            };
          })

  
        } else {
          
          alert('not implemented')
          var result = Group_by.map(async (fieldName) => {
            // Check if replies.formReplies[0] exists and is an object
            if (
              replies.formReplies[0] &&
              typeof replies.formReplies[0] === "object"
            ) {
              function capitalizeFirstLetter(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
              }
              const capitalizedFieldName = capitalizeFirstLetter(fieldName);
              console.log(capitalizedFieldName);
              // Find the first matching fieldName in formReplies
              var matchingField = Object.values(replies.formReplies[0]).find(
                (field) => field.fieldName === capitalizedFieldName
              );
  
              console.log(capitalizedFieldName);
              console.log("matching field" + matchingField);
              // Return an object with fieldName and corresponding fieldValue
              return {
                fieldName: fieldName,
                fieldValue: matchingField ? matchingField.fieldValue : null,
              };
            } else {
              // If replies.formReplies[0] does not exist or is not an object, return null for fieldValue
             
              return {
                fieldName: fieldName,
                fieldValue: null,
              };
            }
          });
      
        }


        console.log(' subfolder NAME',result);

        await this.createSubFolders(parentFolderId, result);

        /* This promise clicks on all the hidden file upload buttons in this form. 
              We will first count how many they are, with this we will know how and when to submit and update our DB record 
            */

        let promises = [];
        // initialize again
        this.allWebDownloadLink = [];

        const clickClass = document.querySelectorAll(`.uploadToDrive`);
        this.ensure = clickClass.length;
        this.countDownUpload = clickClass.length; // So we can know how many upload were expecting
        if (clickClass) {
          console.log("other one : " + this.countDownUpload);
          for (const clickClass_ of clickClass) {
            promises.push(
              new Promise((resolve) => {
                clickClass_.click();
                resolve();
              })
            );
          }
        } else {
          // console.error("Button inside #button1 not found.");
        }
        await Promise.all(promises);

        let promis = [];
        const fielTofield = document.querySelectorAll(".fielTofield");

        if (fielTofield.length > 0) {
          this.countfielTofield = fielTofield.length; // Set the initial count
          this.ii = 0;
          // alert(`${this.ii} < ${this.countfielTofield}`)
          const intervalId = setInterval(() => {
            if (this.ii < this.countfielTofield) {
              promis.push(
                new Promise((resolve) => {
                  console.log("this promis: " + this.ii);
                  fielTofield[this.ii].click();
                  this.ii++;
                  resolve();
                })
              );
            } else {
              clearInterval(intervalId); // Stop the interval when the count is reached
            }
          }, 2000); // 10 seconds interval
        } else {
          const downlaodToDoc = document.querySelector(`#downloadToDoc`);
          downlaodToDoc.click();
          // Handle the case where the buttons are not found
          // console.error("Buttons not found.");
        }

        await Promise.all(promis);
        // SAVE THIS SUBMITTED DATA TO THE DB

        this.saveToDB(replies);
        /*
              IMAGES HAD ALREADY BEEN PROCESSED TO RESPECTIVE FOLDERS
              // SEND FILE DATA TO DATABASE
              // FIRST PROCESS IMAGE
            */
      } else {
        this.isLoading = false
        console.log("All elements are not false.");
      }
    },

    async saveToDB(replies) {
      /*
            Get other data from the form json array stored in form.ejs html
            sheck if an image is uploading in progress, 
            if it is the you'd have to set the status to pending, as it will be updated to completed only when the images have been uploaded completely.
          */

      let submitStatus;
      if (this.UploadStatusProgress == "pending") {
        submitStatus = "pending";
      } else {
        submitStatus = "completed";
      }
      // console.log(replies)
      let settings = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          json_replies: replies,
          title: document.querySelector(".FORM_HEADER").value,
          record_id: document.querySelector("#record_id").value,
          expiry_date: document.querySelector("#expiry_date").value,
          status: submitStatus,
          folder_id: this.uploadFolderId,
          user_id: document.querySelector("#user_id").value,
          drive_email: document.querySelector("#drive_email").value,
        }),
      };

      try {
        let fetchResponses = await fetch(
          `${backendUrl}/api/app/submitReplies`,
          settings
        );
        let staus = await fetchResponses.status;
        let res = await fetchResponses.json();

        if (res.error == 1) {
        } else if (res.error == 2) {
          window.location.href = "#";
        } else if (res.success == 1) {
          // Set SUBMIT_ID
          console.log("SUBMIT ID IS; ", res.submit_id);
          localStorage.setItem("submit_id", res.submit_id);
        } else {
          this.errorMesg = "error submiting replies";
          let errorModal = document.querySelector("#showModalError");
          errorModal.click();
          // console.log('something is wrong')
          return;
        }
      } catch (err) {
        // console.log('internet error')
        // console.log(err)
        this.errorMesg = err;
        let errorModal = document.querySelector("#showModalError");
        errorModal.click();
      } finally {
        $(".app-preloader").hide();
      }
    },

    async submitForm() {
      /*
            Click hidden upload buttons for each image upload
            // Ensure the upload modal screen only shows up once
            // LOOP THROGH ALL THE FIELDS AND SAVE TRIGGER THE VALIDATION
            // If all fields validation is passed, save the data
          */

      this.isLoading = true
     
      this._errors = [];
      let promises = [];
      this.allInputFields.forEach((field) => {
        if (field.substring(0, 6).toLowerCase() === "header") {
          // Do not include header fields in the loop
        } else {
          // set this.submitForm_ = true to enable auto clicking to verify each input and select fields
          this.submitForm_ = true;

          const clickClass = document.querySelectorAll(`.${field}`);
          // console.log(clickClass.value)
          if (clickClass) {
            for (const clickClass_ of clickClass) {
              promises.push(
                new Promise((resolve) => {
                  clickClass_.click();
                  resolve();
                })
              );
            }
          } else {
            // console.error("Button inside #button1 not found.");
          }
        }
      });

      // Wait for all of the promises to resolve before logging the message to the console
      await Promise.all(promises);

      // console.log(this._errors)
      // console.log('this are the errors',this._errors)
      this.repliesToJson(this._errors);
    },

    // PreFileName(eachFieldSetting) {
     
    //   // [[[[[[[[[[[[[      ADD FIELD TO FILE NAME VALIDATION      ]]]]]]]]]]]]]

    //   let foundAddField = (eachFieldSetting[this._keyComb] || []).find((item) =>
    //     item.hasOwnProperty("Add field value to the front of the file name")
    //   );
    //   if (foundAddField) {
    //     addField =
    //       foundAddField["Add field value to the front of the file name"];
    //     if (addField == "on") {
    //       this.preFileName += this.inputValue + "_";
    //       this.$notification({
    //         text: `${this.preFileName}`,
    //         variant: "green-500",
    //         position: "right-bottom",
    //         duration: 3000,
    //       });
    //     } else {
    //     }
    //   }
    // },

    checkSettings(
      eachFieldSetting,
      fieldValue,
      errors,
      fieldType,
      submit = null
    ) {
        // CHECK AND VALIDAT ALL SETTINGS FOR EVERY INPUT FIELD
        // DONT FORGET TO USE PAGEKEY FOR THE SETTINGS OBJECT
        // _keyComb is a globally accssible keyComb

      let required = "";
      let addField = ""; // this is (Add field value to the front of the file name)
      let validPattern = "";

      // [[[[[[[[[[[[[      REQUIRED VALIDATION      ]]]]]]]]]]]]]


      let foundRequired = (eachFieldSetting[this._keyComb] || []).find((item) =>
        item.hasOwnProperty("Required")
      );
      if (foundRequired) {
        required = foundRequired["Required"];
        if (required == "on") {
          if (this.inputValue !== "") {
            errors.validation = false;
            this._errors.push(false);
          } else {
            showNoti("warning", `"${fieldValue}" field cannot be empty`, 3000);
            errors.validation = true;
            this._errors.push(true);
            errors.message = `<li>This field cannot be empty</li>`;
            this.submitForm_ = false; // disable clicking on input
            // Notification.click();
            // this.$notification({text:'Error: you left some fields empty',variant:'error',position:'borrom-right',duration:3000})
            return;
          }
        } else {
          errors.validation = false;
          this._errors.push(false);
          // errors.message=`<li>This field cannot be empty</li>`
        }
      }

      // [[[[[[[[[[[[[      PATTREN VALIDATION      ]]]]]]]]]]]]]

      let foundValidPattern = (eachFieldSetting[this._keyComb] || []).find(
        (item) => item.hasOwnProperty("Validation Pattern")
      );
      if (foundValidPattern) {
        validPattern = foundValidPattern["Validation Pattern"];
        // console.log(validPattern)
        if (/^\/[^/]/.test(validPattern)) {
          // If there is only one slash, add another
          validPattern = "/" + validPattern;
        }
        // console.log('this is the valid pattern',validPattern)
        // // console.log(errors)

        try {
          this.patternRegExp = new RegExp(validPattern);
          // // console.log(this.patternRegExp)

          if (this.patternRegExp.test(this.inputValue)) {
            // console.log('Input matches the pattern.');
            errors.validation = false;
            this._errors.push(false);
          } else {
            errors.validation = true;
            this._errors.push(true);
            errors.message = `<li>the this field is invalid</li>`;
            // console.log('Input does not match the pattern.');
            this.submitForm_ = false; // disable clicking on input
            // this.$notification({
            //   text: "Error: certain fields are not valid",
            //   variant: "light",
            //   position: "right-bottom",
            //   duration: 3000,
            // });
            showNoti("error", "Error: certain fields are not valid", 5000);
            return;
          }
        } catch (error) {
          // console.error('Error creating regular expression:', error.message);
        }
      }

      if (required !== "" && required == "on") {
        // console.log(fieldValue.replace(/\s/g, '')+this._keyComb)
        // console.log(this.inputValue)
      }



      // [[[[[[[[[[[[[      ADD FIELD TO FILE NAME VALIDATION      ]]]]]]]]]]]]]
  
      // Reset this if submit showed error message
      if (submit !== null) {
        let foundAddField = (eachFieldSetting[this._keyComb] || []).find((item) =>
          item.hasOwnProperty("Add field value to the front of the file name")
        );
        if (foundAddField) {
          addField =
            foundAddField["Add field value to the front of the file name"];
          if (addField == "on") {
            if (this.inputValue) {
              this.preFileName += this.inputValue + "_";
              // this.$notification({
              //   content:'#custom_preFileName',
              //   position: "right-bottom",
              //   duration: 3000,
              // });
              // showNoti("error", "Error: certain fields are not valid", 5000);
            }
          } else {
          }
        }
      }

      // [[[[[[[[[[[[[      EMAIL VALIDATION      ]]]]]]]]]]]]]

      if (fieldType.fieldName === "Email") {
      
        if (this.inputValue) {
          let email = this.inputValue;

          // Regular expression for validating email
          let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          // Test if the input value matches the email pattern
          if (emailPattern.test(email)) {
         
            // console.log('Valid email address!');
            errors.validation = false;
            this._errors.push(false);
          } else {
          
            showNoti(
              "warning",
              `"${fieldValue}"field doesnt contain a valid email address`,
              5000
            );
            errors.validation = true;
            this._errors.push(true);
            errors.message = `<li>Email address in invalid </li>`;
            this.submitForm_ = false; // disable clicking on input
            return;
          }
        }
      }
    },

    checkFor(index, conditionField, arr1, arr2, arr3) {
      /* 
            this runs as each field loads in the file during loading state,
            it checks to see if to display a field or not and initializes certain data 
          */
      
      // show watermark div
      setTimeout(() => {
        this.watermark_div = true
      }, 1200)

      let keyComb = `${this.pageKey}${this.fieldKey}`;

      if (
        arr1[index - 1] !== "" &&
        arr2[index - 1] !== "" &&
        arr3[index - 1] !== "" &&
        arr3[index - 1] !== undefined
      ) {
        const parm1 = arr1[index - 1].match(/(.*)(?:#(\d+))$/)[1]; // seperate the tex from the field keye
        const operand = arr2[index - 1];
        const parm3 = arr3[index - 1];
        const condition = `"${parm1}" ${operand} ${parm3}`;
        // console.log(condition)

        this.conditionsTest.push({
          pointField: parm1.replace(/\s/g, ""),
          pointId: arr1[index - 1].match(/(?:.*#(\d+))$/)[1],
          condition: {
            param1: parm1,
            operand: operand,
            param3: parm3,
          },
          conditionField: conditionField.replace(/\s/g, ""),
          status: "",
        });
      } else {
      }

      /*  if ((this._if).toLowerCase() == 'all') {
            const allConditionsMet = this.completeCondition.every(condition => condition);
            console.log('All conditions met:', allConditionsMet);
            this.showLabel = allConditionsMet
            // Add logic for the case when all conditions are met
          }
          
          if ((this._if).toLowerCase() == 'any') {
              const anyConditionMet = this.completeCondition.some(condition => condition);
              console.log('Any condition met:', anyConditionMet);
              this.showLabel = anyConditionMet
              // Add logic for the case when any condition is met
          }*/
    },

    comparedPush(con, cond, arrCond, count) {
      comparedPush(con, cond, arrCond, count);
    },

    conditionPush(con, cond, _conditionsWord) {
      pushConditionWithSymbol(con, cond, _conditionsWord);
    },

    autoClick(showLabel, fieldValue) {
      const conditionValue_ = document.getElementById(`${fieldValue}`);
      // console.log(this.showLabel)
      // console.log('conditonloic', Boolean(conditionValue_.value))
      // console.log('conditonloic', (conditionValue_.value === 'true' ))
      // console.log('conditonloic', (conditionValue_.value ))
      var booleanValue = conditionValue_.value === "true";
      console.log("booleanValue", booleanValue);
      // if(booleanValue == true){
      //   this.showLabel = true
      // }else{
      //   this.showLabel = false
      // }
      this.showLabel = booleanValue;
      console.log(this.showLabel);

      // check complete condition to see if this field showlabel has been updated
    },

    autoClickClass(conditionField, pointCount) {
      // console.log(conditionField)
      const clickClass = document.querySelectorAll(`#${conditionField}`);
      console.log(clickClass);
      console.log("clickClass", clickClass.length);
      // recheck this to prevent th
      const conditionUpload06 = this.conditionsTest.find(
        (condition) => condition.conditionField === conditionField
      );
      conditionUpload06.status;
      // Check if the button inside #button1 exists
      if (clickClass) {
        clickClass.forEach(async (clickClass_) => {
          console.log("swait");
          clickClass_.click();
        });
        // Programmatically trigger a click on the button
        // clickClass.click();
      } else {
        console.error("Button inside #button1 not found.");
      }
    },

    handleInput(fieldLabel, fieldIndex, pointCount) {
      /* 
            this handles the input fields onBlur
            it checks for settings and conditional matches of each fields
          */
      let _if;
      this.conditionPointer;

      console.log(this.conditionsTest);
      console.log(fieldLabel.replace(/\s/g, ""));
      // check if the ccurrent inputs label and pointId matches any conditional lgic statement
      const foundItems = this.conditionsTest.filter(
        (item) =>
          item.pointField === fieldLabel.replace(/\s/g, "") &&
          item.pointId === pointCount
      );
      console.log("////////////////////");
      console.log(foundItems);

      if (foundItems.length > 0) {
        // console.log('Item found:', foundItems);
        // console.log('in:', this.conditionsTest);
        foundItems.forEach((foundItem) => {
          const newParam1 = this.inputValue;
          const operand = foundItem.condition.operand;
          const param3 = foundItem.condition.param3;
          let finalCondition = "";

          // CHECK OPERAND TYPES AGAIN
          // NOTE: in pushConditionWithSymbol we converted the words to symbol, not relevant tho but still we did
          // We didnt include checked and not_checked as this form builder has no need for it YET
          // The else condition condtains evrything else that the symbol can comfortably hole like >,<,===, etc.

          if (operand == `=== ""`) {
            finalCondition = `"${newParam1}" ${operand} `;
            // alert(finalCondition)
          } else if (operand == `!== ""`) {
            finalCondition = `${newParam1} ${operand}`;
            // alert(finalCondition)
          } else if (operand == ".includes") {
            finalCondition = `"${param3.toLowerCase()}"${operand}("${newParam1.toLowerCase()}")`;
            //  alert(finalCondition)
          } else if (operand == `!.includes`) {
            finalCondition = `!"${param3.toLowerCase()}".includes("${newParam1.toLowerCase()}")`;
            // alert('includes')
          } else {
            if (typeof param3 === "string") {
              // alert('all string')
              finalCondition = `"${newParam1}" ${operand} "${param3}"`;
            } else if (
              typeof param3 === "number" &&
              typeof newParam1 === "number"
            ) {
              //alert('all number')
              finalCondition = `${newParam1} ${operand} ${param3}`;
            } else if (
              typeof param3 === "number" &&
              typeof newParam1 === "string"
            ) {
              // alert('string and numbers')
              console.log(`${typeof param3} and ${typeof newParam1}`);
              finalCondition = `${newParam1} ${operand} ${param3}`;
            }
          }
          // END this

          console.log(finalCondition);
          foundItem.status = eval(finalCondition);

          if (eval(finalCondition)) {
            console.log(true);
            // this completeCondition push is almost not necessary and not used in this code
            this.completeCondition.push(true);
          } else {
            console.log("not greater");

            this.completeCondition.push(false);
          }

          // Filter the array based on the conditionField
          const filteredArray = this.conditionsTest.filter(
            (item) => item.conditionField === foundItem.conditionField
          );

          // Get the length of the filtered array
          const lengthOfCurrentConditionTest = filteredArray.length;

          // GET THE IF 'ALL' OR 'ANY ' CONDITION OF THE CODITION FIELD
          const conditionFieldIF = document.querySelector(
            `.${foundItem.conditionField}`
          );

          if (conditionFieldIF) {
            _if = conditionFieldIF.value;
          } else {
            _if = "none";
          }

          // get the conditional field and set the conditionValue to that of this field
          const conditionFieldLogic = document.querySelector(
            `#${foundItem.conditionField}`
          );
          conditionFieldLogic.value = true;
          console.log("field cond cond", conditionFieldLogic.value);

          // Check if that is all the conditions there is in this system
          if (foundItems.length < lengthOfCurrentConditionTest) {
            // console.log(this.conditionsTest)
            console.log("more condtions are to be met");

            // Now we have to check the conditionField, and process its own condition
            if (_if.toLowerCase() == "all") {
              console.log("This is ALL");
              // Check if every condition has a matching conditionField and the status is true
              const allConditionsTrue = this.conditionsTest
                .filter(
                  (item) => item.conditionField === foundItem.conditionField
                )
                .every((item) => item.status === true);
              // console.log('every condition matches',allConditionsTrue, foundItem.conditionField)
              if (allConditionsTrue) {
                conditionFieldLogic.value = allConditionsTrue;
                this.autoClickClass(foundItem.conditionField, pointCount);
              } else {
                conditionFieldLogic.value = false;
                this.autoClickClass(foundItem.conditionField);
                // console.log('not all match')
              }
              // this.showLabel = allConditionsTrue
              // Add logic for the case when all conditions are met
            }
            if (_if.toLowerCase() == "any") {
              console.log("This is ANY");
              const anyConditionTrue = this.conditionsTest
                .filter(
                  (item) => item.conditionField === foundItem.conditionField
                )
                .some((item) => item.status === true);
              // console.log('ANY condition matches',anyConditionTrue)

              if (anyConditionTrue) {
                conditionFieldLogic.value = anyConditionTrue;
                this.autoClickClass(foundItem.conditionField, pointCount);
              } else {
                conditionFieldLogic.value = false;
                this.autoClickClass(foundItem.conditionField);

                // console.log('not all match')
              }
            }
          } else {
            console.log("no more");
            if (_if.toLowerCase() == "any") {
              console.log("This is ANY");
              const anyConditionTrue = this.conditionsTest
                .filter(
                  (item) => item.conditionField === foundItem.conditionField
                )
                .some((item) => item.status === true);
              // console.log('ANY condition matches',anyConditionTrue, foundItem.conditionField)
              if (anyConditionTrue) {
                conditionFieldLogic.value = anyConditionTrue;
                this.autoClickClass(foundItem.conditionField);
              } else {
                conditionFieldLogic.value = false;
                this.autoClickClass(foundItem.conditionField);
                console.log("not all match");
              }
            }
            if (_if.toLowerCase() == "all") {
              console.log("This is ALL");
              // Check if every condition has a matching conditionField and the status is true
              const allConditionsTrue = this.conditionsTest
                .filter(
                  (item) => item.conditionField === foundItem.conditionField
                )
                .every((item) => item.status === true);
              // console.log('every condition matches',allConditionsTrue, foundItem.conditionField)
              if (allConditionsTrue) {
                conditionFieldLogic.value = allConditionsTrue; // set condition value as it will be used to hide or show the field
                this.autoClickClass(foundItem.conditionField);
              } else {
                conditionFieldLogic.value = false;
                this.autoClickClass(foundItem.conditionField);
                console.log("not all match");
              }
              // this.showLabel = allConditionsTrue
              // Add logic for the case when all conditions are met
            }
          }
        });

        // Perform some action with the found item
      } else {
        console.log("Item not found");
        // Perform some action when the item is not found
      }
    },
  }));
});
