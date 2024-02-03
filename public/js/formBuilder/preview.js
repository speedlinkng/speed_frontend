function previews(e = null){
    // console.log(allArray)
     const jsonData = allArray
     // Check if there are multiple pages
       const pages = Object.keys(jsonData.values);
       if (pages.length < 2) {
         $('.prev_form').html('')
         $('.prev_form').append(`
           <div class="py-5 px-2 h-fit">
            <div class="">
                <h3 class="form_header1 text-3xl"></h3>
                <h6 class="form_description1 text-sm"></h6>
              </div>

              <div class="prev_form_"></div>
              <br><br>
              <div class="relative mt-5 w-full">
                <button onclick="previews()" class=" absolute bottom-0 text-white inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Submit
                </button> 
              </div>
            </div>
         `)
         // Loop through each page
         pages.forEach((page, page_count) => {
         // console.log(`page${page_count+1}`);
           const fields = jsonData.values[page];
         // console.log(fields);
           // Check if there are multiple fields
           if (fields.length > 0) {
             // Loop through each field
             fields.forEach((field, index) => {
               const fieldName = Object.keys(field)[0]; // Assuming each field has only one key
               const fieldData = field[fieldName];
       

               getField(fieldData)
               getfirstCondition(fieldData)
               getsecondCondition(fieldData)
               getsettingsArray(fieldData)
              
               headers(fieldData)
        

               function headers(fieldData){
                page_desc = fieldData.page_description;
                page_head = fieldData.page_header;
                $(`.form_header1`).text(`${page_head}`)
                $(`.form_description1`).text(`${page_desc}`)
            }
               function getField(fieldData){
                                 // Access field type (which may be an array or an object)
                 const fieldType = fieldData.fieldType;
                 
                 // If fieldType is an object, directly access properties
                 const itemName = fieldType.fieldName;
                 const itemValue = fieldType.fieldValue;

                 if(itemName == 'Text'){

                   $('.prev_form_').append(`
                   <br>
                   <div class="mt-3 pt-3">
                    <p class="label_in_front${index}">${itemValue}</p>
                    <input name="${itemValue}"  
                        class="col-span-4 mt-1 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                        placeholder="${itemValue}"
                        type="text"
                    />
                   </div>
                 `)
                 }
                 if(itemName == 'Dropdown'){

                   $('.prev_form_').append(`
                   <br>
                   <div class="mt-3 pt-3">
                        <p class="label_in_front${index}">${itemValue}</p>
                        <select name="condition" class="mt-1 listOfDropList${index} form-select w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                        <option value="">${itemValue}</option>
                        
                        </select>
                    </div>
                   `)
                 
             

                 }
                 if(itemName == 'File Upload'){
                  
                  $(`.prev_form_`).append(`
                  <br>
                  <div id="questions-container">
                      <div class="" id="image_section" style="display:block ;">
                        <span>Images</span>
                        <div class="filepond fp-bordered fp-grid mt-1.5 [--fp-grid:2]">
                          <input type="file" class="file" name="file" id="fileponds" />
                        </div>
                      </div>
                      
                      <!-- PROGRESS BAR START -->
                      <div id="progress_bar_section" style="display:none ;">
                        <div class="flex">
                          <div class="mr-3 font-medium dark:text-white  flex items-center text-slate-800 "
                            id="upload_percentage">0%</div>
                          <div id="result" style="display: none;"
                            class="flex items-center text-red-500 dark:text-red-500 offline ">
                            <i class="bi bi-wifi-off" style="font-size: 20px;"></i>
                            <span>Seems you are offline, Dont leave this page </span>
                          </div>
                        </div>

                        <div class="progress h-2 bg-slate-150 dark:bg-navy-500">
                          <div class="is-active relative overflow-hidden rounded-full bg-warning progress_bar">

                          </div>
                        </div>
                      </div>
                      <!-- UPLOAD BUTTON FLEX -->
                      <div class="flex justify-start space-x-2 pt-4" id="upload_button" style="display:none;">

                        <button onclick="uploadToDrive()"
                          id="upload_btn"
                          class="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
                          <span>Upload</span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg>
                          <div id="up_spinner" style="display: none;"
                            class="spinner is-elastic h-7 w-7 animate-spin rounded-full border-[3px] border-white border-r-transparent dark:border-white dark:border-r-transparent">
                          </div>

                        </button>
                      </div>
                    </div>
             <script>
           
             const inputElements = document.getElementById('fileponds');

                     // Initialize FilePond
                     const ponds = FilePond.create(inputElements, {
                       allowMultiple: true,
                       instantUpload: true,
                       allowProcess: false
                       // Configuration options go here
                     });


                     // Listen for the 'addfile' event
                     ponds.on('addfile', (error, file) => {
                       if (!error) {
                         const firstFile = file;
                       } else {
                         // Handle the error
                         console.error('Error adding file:', error);
                       }
                     });
             </script>
              

                 
                  `)
                 }
                 if(itemName == 'Email'){
                   $('.prev_form_').append(`
                   <br>
                   <div class="mt-3 pt-3">
                    <p class="label_in_front${index}">${itemValue}</p>
                    <input name="${itemValue}"  
                        class="col-span-4 mt-1 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                        placeholder="${itemValue}"
                        type="email"
                    />
                   </div>
                 `)
                 }

                 
               // console.log(`Field Name: ${itemName}, Field Value: ${itemValue}`);
               
               }

               function getfirstCondition(fieldData){
                   // Access conditions > firstCondition
                   const firstCondition = fieldData.conditions.firstCondition;
                   // Loop through each condition in firstCondition
                   firstCondition.forEach(condition => {
                     const selectorName = condition.selectorName;
                     const selectorValue = condition.selectorValue;
                   // console.log(`First Condition Selector Name: ${selectorName}, Selector Value: ${selectorValue}`);
                   });
                 
               }
               function getsecondCondition(fieldData){
                   // Access conditions > secondCondition
                   const secondCondition = fieldData.conditions.secondCondition;
                   // Loop through each condition in secondCondition
                   secondCondition.forEach(condition => {
                     const selectorName = condition.SCL_selectorName;
                     const selectorValue = condition.SCL_selectorValue;
                     const inputName = condition.SCL_inputName;
                     const inputValue = condition.SCL_inputValue;
                   //  console.log(`Second Condition Selector Name: ${selectorName}, Selector Value: ${selectorValue}`);
                   //  console.log(`Input Name: ${inputName}, Input Value: ${inputValue}`);
                   });
       
                 
               }
               function getsettingsArray(fieldData){      
                  let fieldType = fieldData.fieldType;  
                  let itemName = fieldType.fieldName;
                  
                   const settingsArray = fieldData.settings;
                   // Loop through each item in settingsArray
                   settingsArray.forEach((setting, ind) => {
                     const inputName = setting.inputName;
                     const inputValue = setting.inputValue;
                     if(itemName == 'Dropdown'){
                        if(ind == 0){
                            let STN = inputValue
                            console.log(STN)
                            console.log(STN.length)
                            $(`.listOfDropList${index}`).find('option[value=""]').remove();
                            for(i=0; i <= STN.length;i++){
                            console.log(STN[i]) 
                            $(`.listOfDropList${index}`).append('<option value="'+STN[i]+'">'+STN[i]+'</option>');
                            
                            }
                        }
                    }                 
                   });
                 
               }


       
               // ... Continue accessing other properties if needed
             });
           }
         });
       }
       else{

            $('.prev_form').html('')
            $('.prev_form').append(`
            <div class="py-5 px-2 h-fit">
                <div class="pages">

                </div>

            </div>
            `)
      
           // Loop through each page
           console.log(pages)
           let pagelength_ = pages.length
           pages.forEach((page, pageIndex) => {
          
            $(`.pages`).append(
            
            `
            <div class="page${pageIndex} py-5 px-2 h-fit ">
              <div class="pb-4 mb-2">
                <h3 class="form_header${pageIndex} text-3xl">Your Form Preview</h3>
                <h6 class="form_description${pageIndex} text-sm">Your Form Preview</h6>
              </div>
                <div class="prev_form_${pageIndex}"></div>
                <br><br>
                <div class="relative absolutebottom-0 mt-5 w-[60%] flex space-x-2 pageButtons${pageIndex}">
     
                </div>
            </div>
            `)
            if(pageIndex == 0){
                
                $(`.page0`).addClass('block')
            }else{
                $(`.page${pageIndex}`).addClass('hidden')
            }
          
         
   
            if((pageIndex + 1) == pagelength_){
                
                $(`.pageButtons${pageIndex}`).append(`
                <button onclick="prev(${pageIndex})" class=" text-white inline-flex justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Prev
                </button> 
                <button onclick="submit()" class="  text-white inline-flex justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Submit
                </button> 

            `)
            
            }else{
              
                $(`.pageButtons${pageIndex}`).append(/*html*/`

                    <button @click="prev(${pageIndex})" class="  text-white inline-flex justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Prev
                    </button> 
                    <button @click="next(${pageIndex})" class=" text-white inline-flex justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Next
                    </button> 
                    
                    <script>
                    function next (e) {
                      
                        $('.page'+(e+1)).removeClass('hidden');
                        $('.page'+(e+1)).addClass('block');
                        $('.page'+e).removeClass('block');
                        $('.page'+e).addClass('hidden');
                    } 
                    function prev (e) {
                      
                        $('.page'+(e-1)).removeClass('hidden');
                        $('.page'+(e-1)).addClass('block');
                        $('.page'+e).removeClass('block');
                        $('.page'+e).addClass('hidden');
                    }                
                    </script>
                `)
                
            }


             console.log(`Page ${pageIndex + 1}`);
             const fields = jsonData.values[page];
             console.log(jsonData.values[page])
         
             // Check if there are multiple fields
             if (fields.length > 0) {
               // Loop through each field
               fields.forEach((field, index) => {
                 const fieldName = Object.keys(field)[0]; // Assuming each field has only one key
                 const fieldData = field[fieldName];
                
                 getField(fieldData)
                 getfirstCondition(fieldData)
                 getsecondCondition(fieldData)
                 getsettingsArray(fieldData)
                //  otherData(fieldData)
                 headers(fieldData)

                    function headers(fieldData){
                        page_desc = fieldData.page_description;
                        page_head = fieldData.page_header;
                       // alert(page_head)
                        $(`.form_header${pageIndex}`).text(`${page_head}`)
                        $(`.form_description${pageIndex}`).text(`${page_desc}`)
                    }

                    function getField(fieldData){
                        // alert('getfieldData')
                        // Access field type (which may be an array or an object)
                        const fieldType = fieldData.fieldType;
                        
                        // If fieldType is an object, directly access properties
                        const itemName = fieldType.fieldName;
                        const itemValue = fieldType.fieldValue;
// alert(itemName)
                        if(itemName == 'Text'){

                        $(`.prev_form_${pageIndex}`).append(`
                       
                        <div style="margin-top:12px;" class="mt-3 pt-3">
                        <p class="label_in_front${index}">${itemValue}</p>
                        <input name="${itemValue}"  
                            class="col-span-4 mt-1 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                            placeholder="${itemValue}"
                            type="text"
                        />
                        </div>
                        `)
                        }
                        if(itemName == 'Dropdown'){

                        $(`.prev_form_${pageIndex}`).append(`
                     
                        <div style="margin-top:12px;" class="mt-3 pt-3">
                            <p class="label_in_front${index}">${itemValue}</p>
                            <select name="condition" class="mt-1 listOfDropList${index} form-select w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                            <option value="">${itemValue}</option>
                            
                            </select>
                        </div>
                        `)
                        


                        }
                      
                        alert(index)
                        if(itemName == 'File Upload'){
                          $(`.prev_form_${pageIndex}`).append(`
                                      <div id="questions-container">
                                          <div class="" id="image_section${pageIndex}${index}"}" style="display: block;">
                                            <span>${itemValue}</span>
                                            <div class="filepond fp-bordered fp-grid mt-1.5 [--fp-grid:2]">
                                              <input type="file" class="file" name="file" id="fileponds${pageIndex}${index}" />
                                            </div>
                                          </div>
                                          
                                          <!-- PROGRESS BAR START -->
                                          <div id="progress_bar_section" style="display: none;">
                                            <div class="flex">
                                              <div class="mr-3 font-medium dark:text-white  flex items-center text-slate-800 "
                                                id="upload_percentage">0%</div>
                                              <div id="result" style="display: none;"
                                                class="flex items-center text-red-500 dark:text-red-500 offline ">
                                                <i class="bi bi-wifi-off" style="font-size: 20px;"></i>
                                                <span>Seems you are offline, Dont leave this page </span>
                                              </div>
                                            </div>

                                            <div class="progress h-2 bg-slate-150 dark:bg-navy-500">
                                              <div class="is-active relative overflow-hidden rounded-full bg-warning progress_bar">

                                              </div>
                                            </div>
                                          </div>
                                          <!-- UPLOAD BUTTON FLEX -->
                                          <div class="flex justify-start space-x-2 pt-4" id="upload_button" style="display:none;">

                                            <button onclick="uploadToDrive()"
                                              id="upload_btn"
                                              class="btn space-x-2 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
                                              <span>Upload</span>
                                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                stroke="currentColor" class="w-5 h-5">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                              </svg>
                                              <div id="up_spinner" style="display: none;"
                                                class="spinner is-elastic h-7 w-7 animate-spin rounded-full border-[3px] border-white border-r-transparent dark:border-white dark:border-r-transparent">
                                              </div>

                                            </button>
                                          </div>
                                        </div>

                                        <script>
           
                                            const inputElements${pageIndex}${index} = document.getElementById('fileponds${pageIndex}${index}');

                                                // Initialize FilePond
                                                let ponds${pageIndex}${index} = FilePond.create(inputElements${pageIndex}${index}, {
                                                  allowMultiple: true,
                                                  instantUpload: true,
                                                  allowProcess: false
                                                  // Configuration options go here
                                                });


                                                // Listen for the 'addfile' event
                                                ponds${pageIndex}${index}.on('addfile', (error, file) => {
                                                  if (!error) {
                                                    const firstFile = file;
                                                  } else {
                                                    // Handle the error
                                                    console.error('Error adding file:', error);
                                                  }
                                                });
                                        </script>
                                          

                                      `)
                        }
                        if(itemName == 'Email'){
                            
                        $(`.prev_form_${pageIndex}`).append(`
                      
                        <div style="margin-top:12px;" class="mt-3 pt-3">
                        <p class="label_in_front${index}">${itemValue}</p>
                        <input name="${itemValue}"  
                            class="col-span-4 mt-1 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                            placeholder="${itemValue}"
                            type="email"
                        />
                        </div>
                        `)
                        }

                    // console.log(`Field Name: ${itemName}, Field Value: ${itemValue}`);
                    
                    }

                    function getfirstCondition(fieldData){
                        // alert('first codition')
                        // Access conditions > firstCondition
                        const firstCondition = fieldData.conditions.firstCondition;
                        // Loop through each condition in firstCondition
                        firstCondition.forEach(condition => {
                            const selectorName = condition.selectorName;
                            const selectorValue = condition.selectorValue;
                        // console.log(`First Condition Selector Name: ${selectorName}, Selector Value: ${selectorValue}`);
                        });
                        
                    }
                    function getsecondCondition(fieldData){
                        // Access conditions > secondCondition
                        const secondCondition = fieldData.conditions.secondCondition;
                        // Loop through each condition in secondCondition
                        secondCondition.forEach(condition => {
                            const selectorName = condition.SCL_selectorName;
                            const selectorValue = condition.SCL_selectorValue;
                            const inputName = condition.SCL_inputName;
                            const inputValue = condition.SCL_inputValue;
                        //  console.log(`Second Condition Selector Name: ${selectorName}, Selector Value: ${selectorValue}`);
                        //  console.log(`Input Name: ${inputName}, Input Value: ${inputValue}`);
                        });

                        
                    }
                    function getsettingsArray(fieldData){
                        let fieldType = fieldData.fieldType;  
                        let itemName = fieldType.fieldName;
          
                        // Access settingsArray
                        const settingsArray = fieldData.settings;
                        // Loop through each item in settingsArray
                        console.log(settingsArray)
                        settingsArray.forEach((setting, ind) => {
                            const inputName = setting.inputName;
                            const inputValue = setting.inputValue;
                            console.log(ind)
                            if(itemName == 'Dropdown'){
                                if(ind == 0){
                                let STN = inputValue
                                console.log(STN)
                                console.log(STN.length)
                                $(`.listOfDropList${index}`).find('option[value=""]').remove();
                                for(i=0; i <= STN.length;i++){
                                  console.log(STN[i]) 
                                  if(STN[i] !== undefined){
                                      $(`.listOfDropList${index}`).append('<option value="'+STN[i]+'">'+STN[i]+'</option>');
                                  }
                                  
                                  
                                  }
                                }
                            }
                        
                        });
                        
                    }

                 
                       
                 // ... Continue accessing other properties if needed
               });
             }
           });
         
       }

       if(e == 'openModal'){
          $(`#openModal`).trigger('click');
       }
     }
