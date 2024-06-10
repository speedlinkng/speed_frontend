
function callEdit(req_index) {
  localStorage.setItem('editting', true)


  
  function dragNewPage1() {
    const sortAll2 = document.querySelector(".use_drag_edit");
    // const sortAll2 = document.querySelector('.showResult_')
    let items = sortAll2.querySelectorAll(".item");
    console.log("ALL ITEMS", items);
    console.log("sortAll2", sortAll2);
    items.forEach((item) => {
      item.addEventListener("dragstart", () => {
        setTimeout(function () {
          item.classList.add("dragging");
          item.classList.add("hoverDash");
        }, 0);
      });

      item.addEventListener("dragend", () => {
        item.classList.remove("hoverDash");
        item.classList.remove("dragging");
      });
    });
    let initSortable2 = (e) => {
      e.preventDefault();
      let draggingItem = sortAll2.querySelector(".dragging");
      let siblings = [...sortAll2.querySelectorAll(".item:not(.dragging)")];

      let mouseY = e.clientY;

      let nextSibling = siblings.find((sibling) => {
        // console.log(sibling)
        let rect = sibling.getBoundingClientRect();
        let offset = 12; // Adjust this value to control the trigger point
        // Check if dragging upwards or downwards
        let direction = mouseY > rect.top + rect.height / 2 ? 1 : -1;

        // Calculate trigger point based on direction
        let siblingTriggerY = rect.top + rect.height / 2 + direction * offset;

        // Trigger move when halfway into the next sibling regardless of direction
        return mouseY <= siblingTriggerY;
      });

      console.log("NEXT SIBBLING", nextSibling);
      console.log("dragging Item", draggingItem);
      if (nextSibling === undefined) {
        sortAll2.appendChild(draggingItem); // Append to the end if no next sibling found
      } else {
        sortAll2.insertBefore(draggingItem, nextSibling);
      }
      console.log(nextSibling);
    };

    sortAll2.addEventListener("dragover", initSortable2);
    sortAll2.addEventListener("dragenter", (e) => e.preventDefault());
  }
  setTimeout(() => {
    dragNewPage1();
  }, 3000);
  
  // RESET THESE VALUES
  count = 0;
  count_ = 0;
  addmore_count = 0;
  resultCount = 0;

  // hide save button and show update button
  $('#create_save_').hide()
  $('#create_update_').show()

   allArrayEdit = JSON.parse(allArrayEdit)
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
        <div page-count="${pageIndex}" class="EACHPAGE this_page${pageIndex} place-content-center p-2 sm:max-w-[900px] card bg-white rounded-md h-fit m-auto left-0 right-0 relative dark:border-t dark:border-navy-450">

            <div class="grid grid-cols-12 "  x-data="{ isOpenTitle: true }" x-show="isOpenTitle">
              <!-- INPUT TITLE -->
              <input class="uph_${pageIndex} form-input col-span-10 sm:col-span-8 text-[30px] rounded-lg border-slate-300 bg-transparent px-3 py-2 focus:border placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value="${header.header[0].page_header}" placeholder="Upload Title" type="text" />    
              <!-- EDIT BUTTON -->
              <div class=" col-span-2 sm:col-span-2 p-2 mt-2 ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </div>
              <!-- DELETE BUTTON -->
              <button @click="isOpenTitle = false" class="col-span-3 sm:col-span-2 sm:mt-2 ml-[4px] btn h-9 w-9 p-0 font-medium text-error hover:bg-error/20 focus:bg-error/20 active:bg-error/25">
                <svg xmlns="http://www.w3.org/2000/svg" class="h4 w-4" fill="none" viewbox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-12 gap-[] " x-data="{ isOpenDesc: true }" x-show="isOpenDesc">
              <!-- INPUT DESCRIPTION -->
              <input class="upd_${pageIndex} form-input col-span-10 sm:col-span-8 text-base rounded-lg border-slate-300 bg-transparent px-3 py-2 focus:border placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" value="${header.header[0].page_description}" placeholder="Upload Description" type="text" />    
              <!-- EDIT BUTTON -->
              <div class=" col-span-2 sm:col-span-2 p-2 mt-2 ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </div>
              <!-- DELETE BUTTON -->
              <button @click="isOpenDesc = false" class="col-span-3 sm:col-span-2 sm:mt-2 ml-[4px] btn h-9 w-9 p-0 font-medium text-error hover:bg-error/20 focus:bg-error/20 active:bg-error/25">
                <svg xmlns="http://www.w3.org/2000/svg" class="h4 w-4" fill="none" viewbox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              
            </div>
      
          <div x-data class="showResult_${pageIndex} use_drag_edit formClass p-2 grid grid-cols-1 place-content-center w-full">
          
          </div>
          <div x-data="{ inputEntered: false, inputHasValue:  window.submit_field }" class="ml-2 flex border text-center justify-center rounded-lg px-2 w-fit sm:w-[40%] md:w-fit border-primary font-medium text-primary hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary/90 dark:border-accent dark:text-accent-light dark:hover:bg-accent dark:hover:text-white dark:focus:bg-accent dark:focus:text-white dark:active:bg-accent/90">
            <span x-on:input="inputHasValue = $event.target.innerText" contenteditable="true" x-text="inputHasValue" x-on:keyup="inputEntered = true" @blur="inputEntered = false"
              class=" content_edit_submit_field${pageIndex} text-base btn  py-2 px-2 border-0 bg-transparent min-w-[60px] max-w-[200px]" style="display: inline-block; border:0; outline:none;">
            </span>
            <input x-model="inputHasValue" class=" hidden edit_submit_field${pageIndex} text-lg btn !p-0 border-0 bg-transparent !w-fit" value="${header.header[0].edit_submit_field}" />
            <div x-show="!inputEntered" class="grid place-content-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </div>
          </div>
          <br>
          <div>
            <div class="flex space-x-2 holdbuttons">
              <button :class="$store.expanded_condition && 'border'" @click="falsifyAllExpanded()" onclick="addQ(${null},${pageIndex})" id="add_question${pageIndex}" class="btn text-sm bg-gray-100 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
                Add Field
              </button>
              <button @click="deletePage(${pageIndex})" id="delete_page" class="btn text-sm text-error border border-error hover:bg-error/20 font-medium focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:border-error">
                Delete Page app
              </button>
              <button @click="openPageSetings()" id="page_settings" class="hidden  btn text-sm text-error border-warning hover:bg-warning/20 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>   
              </button>
       
            </div><br>
          </div>
        </div>`;
        $('.wholePage').append(`<div class="wholePage_ mt-5" >${wholePageHTML}</div>`);
        
      
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
                
            }, 200)
         

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
              let if_ = conditions_.firstCondition[1].selectorValue
              let matches_ = conditions_.secondCondition[0].SCL_selectorValue
              let selectedCondition_ = conditions_.secondCondition[1].SCL_selectorValue
              let compared_ = conditions_.secondCondition[2].SCL_inputValue
              
          
              let getPage = document.querySelector(`[page-count = '${res_id}'] .eachField${count}`)
            
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