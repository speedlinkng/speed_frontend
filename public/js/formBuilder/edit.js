
window.callEdit = function(req_index) {
  localStorage.setItem('editting', true)
  // MAKE this local storage change when not editing

  

function initDragAndDrop(pageIndex) {
  const sortAll2 = document.querySelector(`.showResult_${pageIndex}`);
  if (!sortAll2) {
    console.error(`Element with class '.showResult_${pageIndex}' not found for page ${pageIndex}.`);
    return;
  }

  let initSortable2 = (e) => {
    e.preventDefault();
    let draggingItem = sortAll2.querySelector(".dragging");
    let siblings = [...sortAll2.querySelectorAll(".item:not(.dragging)")];
    let mouseY = e.clientY;
    let nextSibling = siblings.find((sibling) => {
      let rect = sibling.getBoundingClientRect();
      let offset = 12;
      let direction = mouseY > rect.top + rect.height / 2 ? 1 : -1;
      let siblingTriggerY = rect.top + rect.height / 2 + direction * offset;
      return mouseY <= siblingTriggerY;
    });

    if (!nextSibling) {
      sortAll2.appendChild(draggingItem);
    } else {
      sortAll2.insertBefore(draggingItem, nextSibling);
    }
  };

  sortAll2.addEventListener("dragover", initSortable2);
  sortAll2.addEventListener("dragenter", (e) => e.preventDefault());

  sortAll2.addEventListener("dragstart", (e) => {
    const target = e.target;
    if (target.classList.contains("item")) {
      setTimeout(function () {
        target.classList.add("dragging");
        target.classList.add("hoverDash");
      }, 0);
    }
  });

  sortAll2.addEventListener("dragend", (e) => {
    const target = e.target;
    if (target.classList.contains("item")) {
      target.classList.remove("hoverDash");
      target.classList.remove("dragging");
    }
  });
}

  
  // RESET THESE VALUES
  count = 0;
  count_ = 0;
  addmore_count = 0;
  resultCount = 0;

  // hide save button and show update button
  $('#create_save_').hide()
  $('#create_update_').show()
console.log(allArrayEdit[req_index])
   editFormRecordId = allArrayEdit[req_index].record_id
   // console.log(allArrayEdit[req_index].record_data.values)
   // use this JSON data to edit and populate the main form Builder

    // {{{{{ OTHER DATA }}}}}
    $('.drop_zone').val(allArrayEdit[req_index].record_data.otherData.drop_zone)
    $('.success_page_text').val(allArrayEdit[req_index].record_data.otherData.success_page_text)
    $('.error_page_text').val(allArrayEdit[req_index].record_data.otherData.error_page_text)
    $('.shearable_link').val(allArrayEdit[req_index].record_data.otherData.shearable_link)
    $('.page_url').val(allArrayEdit[req_index].record_data.otherData.page_url)
    $('.page_name').val(allArrayEdit[req_index].record_data.otherData.page_name)


    // {{{{{ PAGES }}}}}
    // loop each page
    console.log('THIS PAGE IS PAGING ')
     console.log(allArrayEdit[req_index])
    let values = allArrayEdit[req_index].record_data.values

  
  // UPDATING THE google_drive_files page
  // use setTimeout to make his wait as this is loaded after some time 
  function edit_google_drive_files() {
    console.log(allArrayEdit[req_index].folder_id)
    console.log(allArrayEdit[req_index].record_data.filesandFolder.chosen_folder)
    console.log(allArrayEdit[req_index].expiry_date)
    localStorage.setItem('edit_preferred', allArrayEdit[req_index].record_data.preferred)

      // Retrieve values from the elements
      const folderId = allArrayEdit[req_index].folder_id;
      const chosenFolder = allArrayEdit[req_index].record_data.filesandFolder.chosen_folder;
      const expiryTime = allArrayEdit[req_index].expiry_date;
      const edit_preferred = allArrayEdit[req_index].record_data.preferred 
      const groupByArray =  allArrayEdit[req_index].record_data.filesandFolder.group_by 

      // Create an object with these values
      const editData = {
        folderId: folderId,
        chosenFolder: chosenFolder,
        expiryTime: expiryTime,
        preferred: edit_preferred,
        groupByArray: groupByArray,
      };
    
      // Convert the object to a JSON string
      const editDataJson = JSON.stringify(editData);

      // Store the JSON string in localStorage
    localStorage.setItem('edit_data', editDataJson);
    
    // ARRANGE GROUP_BY
  
    // Array of options to select
    // const selectElement = document.querySelector('.selectField');
    // console.log(selectElement)
    //     const options = selectElement.options;
  
    //     groupByArray.forEach(item => {
    //       for (let i = 0; i < options.length; i++) {
    //         if (options[i].value === item) {
    //           options[i].selected = true;
    //           // Trigger change event if necessary
    //           const event = new Event('change', { bubbles: true });
    //           options[i].dispatchEvent(event);
    //         }
    //       }
    //     });
    
    //     // Get the select element
    // let $select = $(".selectField");
    
    // $('#chosen_folder').val()
    // localStorage.setItem('edit_data', true)
  }

  setTimeout(function () {
    edit_google_drive_files()
  }, 1000)

  

    $('.wholePage').html('')

    Object.entries(values).forEach(([pageInd, pageFields], index) => {

        let pageIndex = ++resultCount 
        // Display page index and name
        console.log(`Page ${pageIndex}:`);

        // Display page header information
        const header = pageFields.find(field => field.hasOwnProperty("header"));
        if (header) {
            console.log("Page Header:", header.header[0]);
        }
        window.submit_field = header.header[0].edit_submit_field
        const wholePageHTML = `
          <div page-count="${pageIndex}" class="EACHPAGE this_page${pageIndex} place-content-center max-w-full mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
            <div class="space-y-4">
              <div class="flex items-center gap-2" x-data="{ isEditing: false, title: '${header.header[0].page_header}' }">
                <h1 x-show="!isEditing" class="text-2xl font-bold text-gray-900 dark:text-white" @click="isEditing = true" style="cursor:pointer;" x-text="title">
                    ${header.header[0].page_header}
                </h1>
                <input
                  x-show="isEditing"
                  type="text"
                  class="uph_${pageIndex} flex-1 text-2xl font-bold border-b border-blue-500 dark:border-blue-400 focus:ring-0 bg-transparent text-gray-900 dark:text-white"
                  x-model="title"
                  @blur="isEditing = false"
                  @keyup.enter="isEditing = false"
                  placeholder="Upload Title"
                  x-init="$el.focus()"
                  value="${header.header[0].page_header}"
                />
                <div x-show="!isEditing" class="flex gap-2">
                  <button @click="isEditing = true" class="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                </div>
                <button @click="isOpenTitle = false" class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewbox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div class="flex items-center gap-2" x-data="{ isEditing: false, description: '${header.header[0].page_description}' }">
                <p x-show="!isEditing" class="text-gray-600 dark:text-gray-300" @click="isEditing = true" style="cursor:pointer;" x-text="description">
                    ${header.header[0].page_description}
                </p>
                <input
                  x-show="isEditing"
                  type="text"
                  class="upd_${pageIndex} flex-1 border-b border-blue-500 dark:border-blue-400 focus:ring-0 bg-transparent text-gray-600 dark:text-gray-300"
                  x-model="description"
                  @blur="isEditing = false"
                  @keyup.enter="isEditing = false"
                  placeholder="Upload Description"
                  x-init="$el.focus()"
                  value="${header.header[0].page_description}"
                />
                <div x-show="!isEditing" class="flex gap-2">
                  <button @click="isEditing = true" class="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                </div>
                <button @click="isOpenDesc = false" class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewbox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div x-data class="showResult_${pageIndex} use_drag_edit formClass space-y-4">
              </div>

      <div class="flex justify-start" x-data="{ isEditing: false, buttonText: '${header.header[0].edit_submit_field}' }">
  <button
    x-show="!isEditing"
    x-transition:enter="transition ease-out duration-100"
    x-transition:enter-start="opacity-0 scale-95"
    x-transition:enter-end="opacity-100 scale-100"
    class="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md flex items-center gap-1 transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 text-sm"
    @click="isEditing = true"
    aria-label="Edit button text"
  >
    <span x-text="buttonText" class="whitespace-nowrap">${header.header[0].edit_submit_field}</span>
    <span class="material-icons text-sm" style="font-size: 16px;">edit</span>
  </button>

  <div
    x-show="isEditing"
    x-transition:enter="transition ease-out duration-100"
    x-transition:enter-start="opacity-0 scale-95"
    x-transition:enter-end="opacity-100 scale-100"
    class="relative"
  >
    <input
      type="text"
      class=" edit_submit_field${pageIndex} bg-teal-500 text-white font-medium py-2 px-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 border border-teal-600 dark:border-teal-400 text-sm"
      x-model="buttonText"
      @blur="isEditing = false"
      @keydown.escape="isEditing = false"
      @keyup.enter="isEditing = false"
      x-init="$el.focus(); $el.select()"
      value="${header.header[0].edit_submit_field}"
      aria-label="Edit button text input"
    />
    <span class="absolute inset-y-0 right-2 flex items-center pointer-events-none text-teal-200">
      <span class="material-icons text-sm" style="font-size: 16px;">edit</span>
    </span>
  </div>
</div>

<div class="flex gap-2 mt-4 pl-">
  <button
    :class="$store.expanded_condition && 'border'"
    @click="falsifyAllExpanded(); addQ(${null},${pageIndex}); drag()"
    id="add_question${pageIndex}"
    class="flex items-center gap-1 bg-slate-200 hover:bg-slate-400 text-primary font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 text-sm"
    aria-label="Add Field"
  >
    <span class="material-icons text-sm" style="font-size: 16px;">add</span>
    Add Field
  </button>

  <button
    @click="deletePage(${pageIndex})"
    id="delete_page"
    class="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 text-sm"
    aria-label="Delete Page"
  >
    <span class="material-icons text-sm" style="font-size: 16px;">delete</span>
    Delete Page
  </button>
</div>
<div class="holdbuttons"></div>

            </div>
          </div>
        `;
        $('.wholePage').append(`<div class="wholePage_ mt-5" >${wholePageHTML}</div>`);
        initDragAndDrop(pageIndex);

      
        // Loop through each field in the page
        pageFields.filter(field => !field.hasOwnProperty("header")).forEach( async (fieldObject, fieldIndex) => {
            const fieldName = Object.keys(fieldObject)[0];
            const fieldData = fieldObject[fieldName];
            let fieldValue = fieldData.fieldType.fieldValue;
            let fieldTypes = fieldData.fieldType.fieldName;
         
            $('.holdbuttons').append(`
            <button id="add_question_edit${pageIndex}${fieldIndex}" class="btn hidden" >
                ${fieldTypes}
            </button>    
            `)
            // triger click the add field button to add fields based on jsonDatas
            $(`#add_question_edit${pageIndex}${fieldIndex}`).attr('onClick', `editAddDefaultQ('${fieldValue}','${pageIndex}', '${fieldTypes}', '${fieldIndex}', '${JSON.stringify(fieldData.conditions)}', '${JSON.stringify(fieldData.settings)}')`)
            setTimeout(async function(){
            
                $(`#add_question_edit${pageIndex}${fieldIndex}`).trigger('click');
                // console.log('clicked'+pageIndex+fieldIndex)
                await editConditions(pageIndex, fieldIndex, JSON.stringify(fieldData.conditions), count)
                await editSettings(pageIndex, fieldIndex, JSON.stringify(fieldData.settings), count, fieldTypes)
                
            }, 500)
         

            // Display field information
            console.log(`Field ${fieldIndex + 1}: ${fieldName}`);
            console.log("Settings:", fieldData.settings);
            console.log("Field Type:", fieldData.fieldType.fieldValue);
            console.log("Conditions:", fieldData.conditions);
            console.log("Other Data:", fieldData.other_data);
            console.log("\n");
            
        });


       
        async function autoClickAddMore(res_id, fieldIndex, counted, position){
    
          window.pos = position// set position
          let getPage = document.querySelector(`[page-count = '${res_id}'] .eachField${count}`)
          // console.log(getPage)
          // console.log('CLICK CLICK'+res_id)
          const addMoreConditionElement = getPage.querySelector('.addmorecondition');
    
          // console.log(addMoreConditionElement)
          if (addMoreConditionElement) {
              addMoreConditionElement.click();
          }
    
        }

        async function editConditions(res_id, fieldIndex, conditions, counts){
      
          // {{{{{{{{{EDIT CONDITIONS DATA}}}}}}}}}
            let conditions_ = JSON.parse(conditions) // gotten from edit function

            if(fieldIndex !== null){
              let hide_show = conditions_.firstCondition[0].selectorValue
              console.log('hide_show')
              console.log(hide_show)
              let if_ = conditions_.firstCondition[1].selectorValue
              let matches_ = conditions_.secondCondition[0].SCL_selectorValue
              let selectedCondition_ = conditions_.secondCondition[1].SCL_selectorValue
              let compared_ = conditions_.secondCondition[2].SCL_inputValue
              
          
              let getPage = document.querySelector(`[page-count = '${res_id}'] .eachField${count}`)
            console.log('getpage')
            console.log(getPage)
              // {{{{{{{{{FIRST CONDITIONS DATA}}}}}}}}}
              getPage.querySelector(`[name="hide-show"] option[value='${hide_show}']`).selected = true
              getPage.querySelector(`[name="if"] option[value='${if_}']`).selected = true

              // {{{{{{{{{SECOND CONDITIONS DATA}}}}}}}}}
              // console.log('@@@@@@@@@@@@@@@@@'+matches_)
              if(getPage.querySelector(`#logicContition${count} [name="matches"] option[value='${matches_}']`) == matches_){
                getPage.querySelector(`#logicContition${count} [name="matches"] option[value='${matches_}']`).selected = true
              }
              //alert(selectedCondition_)
              getPage.querySelector(`#logicContition${count} [name="condition"] option[value='${selectedCondition_}']`)
              getPage.querySelector(`#logicContition${count} [name="condition"] option[value=${selectedCondition_}]`).selected = true
              getPage.querySelector(`#logicContition${count} [name="condition"]`).dispatchEvent(new Event('change'));
              // console.log('##############')


              if (conditions_.secondCondition.length > 3){
                let init = 1
                let secLen = conditions_.secondCondition.length
                // increment selectedCondition by 3 in order to get the next data point 
                // if the first one was at position 1, the second will be at position 4, and the next at position 7 like that
                // the total length must be in multiple of 3, that is 3 * 2 * 2 etc

                  if (secLen % 3 === 0) {
                    for (let i = 0; i < secLen; i += 3) {
                        // Calculate the desired positions: 1, 4, 7, 10, 13
                        let position = init + i;
                        if(position > 1){
                          // console.log(position);
                          setTimeout(async ()=>{
                            await autoClickAddMore(res_id, fieldIndex, count, position)
                          }, 100)
                        }
                    }
                  } else {
                    console.error('Invalid secLen. It should be a multiple of 3.');
                  }

               
                
  
              }
            }
            
        }
      
        async function editSettings(res_id, fieldIndex, settings, counts, fieldTypes){


          let settings_ = JSON.parse(settings) // gotten from edit function
          // console.log(settings_)
          let settArray = []
          settings_.forEach((setting_)=>{
            settArray.push(setting_)
            // console.log(settArray)
          })
          console.log(settArray)
          console.log('#######################')
          if(fieldIndex !== null){

            if(fieldTypes == 'Text'){
              let getPage = document.querySelector(`[page-count = '${res_id}'] .eachField${count} .TEXT_SETTING${count}`)

              if(settArray[0].inputValue == 'on'){
                console.log(getPage.querySelector(`[name="Required"]`).checked)
                getPage.querySelector(`[name="Required"]`).checked = true
                console.log(getPage.querySelector(`[name="Required"]`).checked)
              }

              if(settArray[1].inputValue == 'on'){
                console.log(getPage.querySelector(`.ADVT`))
                getPage.querySelector(`.ADVT`).checked = true
              }

              if(settArray[2].inputValue !== ''){
                getPage.querySelector(`[name="Placeholder"]`).value = settArray[2].inputValue
              }

              if(settArray[3].inputValue !== ''){
                getPage.querySelector(`[name="Validation Pattern"]`).value = settArray[3].inputValue
              }

              if(settArray[4].inputValue !== ''){
                getPage.querySelector(`[name="Description"]`).value = settArray[4].inputValue
              }

            // END TEXT SETTINGS
            }            
            if (fieldTypes == 'Dropdown') {
              // alert('this is a dropdown')
              let getPage = document.querySelector(`[page-count = '${res_id}'] .eachField${count} .DROPDOWN_SETTING${count}`)

              console.log('ALL DROPDOWN DATA', settArray)
              if(settArray[1].inputValue == 'on'){
                getPage.querySelector(`[name="Required"]`).checked = true
              }

              if(settArray[2].inputValue == 'on'){
                getPage.querySelector(`.ADVT`).checked = true
              }

              if(settArray[3].inputValue != ''){
                getPage.querySelector(`[name="Description"]`).value = settArray[2].inputValue
              }

              // DROPSDOWN OPTIONS
              
              if(settArray[0].inputValue != ''){
                // console.log(`DROPDOWN OPTIONS`,settArray[0].inputValue)
                const options = settArray[0].inputValue;
                const formattedOptions = options.join('\n');
                // alert(formattedOptions)
                console.log('NOW NOW',formattedOptions)
                getPage.querySelector(`[name="Dropdown List"]`).value = formattedOptions
            
              }

              
            }               
            if(fieldTypes == 'Email'){
              
              let getPage = document.querySelector(`[page-count = '${res_id}'] .eachField${count} .EMAIL_SETTING${count}`)

              
              if(settArray[0].inputValue == 'on'){
                // console.log(getPage.querySelector(`[name="Required"]`).checked)
                getPage.querySelector(`[name="Required"]`).checked = true
                // console.log(getPage.querySelector(`[name="Required"]`).checked)
              }

              if(settArray[1].inputValue == 'on'){
                getPage.querySelector(`.ADVT`).checked = true
              }

              if(settArray[2].inputValue !== ''){
                getPage.querySelector(`[name="Placeholder"]`).value = settArray[2].inputValue
              }

              if(settArray[3].inputValue !== ''){
                getPage.querySelector(`[name="Validation Pattern"]`).value = settArray[3].inputValue
              }

              if(settArray[4].inputValue !== ''){
                getPage.querySelector(`[name="Description"]`).value = settArray[4].inputValue
              }

            }       
             
            if(fieldTypes == 'File Upload'){
              
              let getPage = document.querySelector(`[page-count = '${res_id}'] .eachField${count} .FILEUPLOAD_SETTING${count}`)

              if(settArray[0].inputValue == 'on'){
                // console.log(getPage.querySelector(`[name="Required"]`).checked)
                getPage.querySelector(`[name="Required"]`).checked = true
                // console.log(getPage.querySelector(`[name="Required"]`).checked)
              }

              if(settArray[1].inputValue !== ''){
                getPage.querySelector(`[name="Description"]`).value = settArray[1].inputValue
              }

              if(settArray[2].inputValue !== ''){
                getPage.querySelector(`[name="Rename File As"]`).value = settArray[2].inputValue
              }

              if(settArray[3].inputValue == ''){
              //  console.log( getPage.querySelector(`[name="File Types"]`))
                getPage.querySelector(`[name="File Types"]`).value = 'css'
              
                // shearable_link
               // console.log( getPage.querySelector(`.ts-wrapper`))
                let inputElement = getPage.querySelector(`.ts-wrapper .ts-control input`)
                inputElement.focus();
                const event = new Event('keydown');
                inputElement.dispatchEvent(event);
               // console.log( getPage.querySelector(`.ts-wrapper .ts-dropdown [role="listbox"] [data-value = "css"]`))

               // console.log( getPage.querySelector(`[name="File Types"]  option[value='css']`))
                getPage.querySelector(`[name="File Types"]  option[value='css']`).click() 
                getPage.querySelector(`[name="File Types"]`).dispatchEvent(new Event('change'));

                // console.log( getPage.querySelector(`[name="File Types"] [role="listbox"] [data-value="css"]`))
                // getPage.querySelector(`[name="File Types""] [role="listbox"] [data-value="css"]`).selected = true
              }

              if(settArray[4].inputValue !== ''){
                getPage.querySelector(`[name="Max File Size (MB)"]`).value = settArray[4].inputValue
              }

              if(settArray[5].inputValue !== ''){
                getPage.querySelector(`[name="File Quantity"]`).value = settArray[5].inputValue
              }


            }
          }

        }
        
    });

}

  // FOR SOME REASON BASED ON TOM-SELECT OPERATION, YOU CANT CHANGE THIS SELCT IN EDIT.JS
  setTimeout(()=>{
    let getPage2 = document.querySelector(`.select-tom1`)
    let tom = getPage2.querySelector(`option[value="svg"]`)
   // console.log(tom)
    tom.selected = true
   // console.log(getPage2)
  }, 5000)