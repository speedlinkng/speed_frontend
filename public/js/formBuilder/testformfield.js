
// import { moduleVariable } from './testmodule.js';
// Initialize variables to store questions and answers

var count = 0;
var count_ = 0;
var addmore_count = 0;
var quest = ""
var ans = "";
var newInput = "";
var storedInput = "";
var value = ""
var editSettings ;

var save = (function () {
  localStorage.setItem('form-questions', quest)
})



async function adddefaultQ(addpage, res_id = null){
  
  if(addpage == 1 ){
    addQ('', res_id)
  }
  else{
    var label_ = [ 'Your Name', 'Your Email'] 
    var fieldType = ['Text', 'Email']
    for(i= 0; i < 2; i++){
      await addQ(label_[i], null, fieldType[i])
   
    }

  }
}



async function editAddDefaultQ(fieldValues, res_id, fieldTypes, fieldIndex, conditions, editSettings){
  // console.log('inside the hosue', JSON.parse(editSettings))

    await addQ(fieldValues, res_id, fieldTypes, fieldIndex, conditions, editSettings) 

}

setTimeout(function(){
  var a_ = addPage
  adddefaultQ(a_)
}, 1000)



async function addQ(e = null, res_id = null, fieldTypes = null, fieldIndex = null, conditions = null, editSettings = null) {
  // res_id is also pageIndex
  // console.log('BIG BOYS ARE FINE', JSON.parse(editSettings))


  window.def = ''
  window.res_id = res_id
  // console.log(e)
  if(fieldTypes !== null){
    if(fieldTypes == 'File Upload'){
      window.typ = 'File_Upload'
    }else{
      window.typ = fieldTypes
    }
    // alert('type not null')
  }else{
    window.typ = 'Text'
    // alert('type is null')
  }

  if(e !== null){
    window.def = e
  }else{
    window.def = undefined
  }

    count += 1
    addmore_count += 1


    if(conditions !== null){
    
      let conditions_ = JSON.parse(conditions)
    
      window.selCond = conditions_.secondCondition[1].SCL_selectorValue
      window.selCondAll = conditions_.secondCondition

    }else{
      window.selCond = 'greater'
    }

// alert(window.typ)
newInput = $(
  /*html*/
  `
  <div draggable="true" class="item mt-2 ">
  <div  class="details">
  <div class="grid grid-cols-12 gap-3 isOpenField${count}" x-data="{ isOpenField${count}: true }" :class="{ 'opacity-0': !isOpenField${count}, 'pointer-events-none': !isOpenField${count} }">
    <div class="col-span-12 eachField${count} text-sm eachField grid grid-cols-1 w-full mt-2 case-prime${count} rounded-lg border border-slate-200 p-3 py-4 dark:border-navy-600">
     <div class="cursor-move w-fit" ondragstart="getPrevFields(${count}, ${addmore_count}, ${true})">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
   
      </div>
      <div class="flex space-x-4">

        <label class="block w-[55%]" x-data="{selectedOption${count}: $store.selectedOption${count}}" x-init="$store.selectedOption${count} = window.typ">
          <select class="form-select mt-1 h-8 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-xs+ hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent" x-bind:value="$store.selectedOption${count}" x-model="$store.selectedOption${count}">
            <option value="Text">Text</option>
            <option value="Email">Email</option>
            <option value="Dropdown">Dropdown</option>
            <option value="File_Upload">File Upload</option>

          </select>

          <!-- Result of whatever option was selected -->
          <input name="Field_select_option" type="text" class="hidden Field_select_option" x-bind:value="$store.selectedOption${count}" />
          <input name="Field_count" type="text" class="hidden Field_count prime_count${count}" value="${count}" />


        </label>

        <input @blur="getPrevFields(${count}, ${addmore_count}, ${true})" class="fieldName form-input w-[45%] rounded-lg prime${count} bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Field Label" x-model="window.def" x-bind:value="window.def" type="text" />

      </div>


      <!-- TEXT DETAILS--->

      <div class="sm:grid sm:grid-cols-12 gap-2">
        <div class="sm:col-span-12 md:col-span-10">
          <!-- Put settings, logic and delete in a grid format or inline -->
          <!-- COLLAPSIBLA CUSTOMIZATION -->
          <div x-data="{expanded_condition${count} : $store.expanded_condition${count}}" x-init="$store.expanded_condition${count} = false" class="w-full">
            <div @click="$store.expanded_condition${count} = !$store.expanded_condition${count}" class="flex cursor-pointer items-center justify-between text-base font-semibold text-primary dark:text-navy-100 hover:p-[1px]">
              <p @click="" class="text-xs sm:text-sm">Conditional Logic</p>
              <div :class="$store.expanded_condition${count} && '-rotate-180'" class="text-sm font-normal leading-none text-slate-400 transition-transform duration-300 dark:text-navy-300">
                <i class="bi bi-chevron-down mt-[1px]"></i>
              </div>
            </div>

            <div x-collapse x-show="$store.expanded_condition${count}">
              <div>

                <div class="CONDITIONAL_LOOP${count} mt-4 mb-2 text-sm dropdown-custom grid grid-col-1 gap-1 py-4 border border-primary dark:border-0 px-2 rounded-lg bg-[#f4f4f5] card shadow">
                  <div class="FirstCondition${count}">
                    <label x-data="{ myVariable: null }" x-init="myVariable = window.def" class=" sm:flex sm:flex-row text-sm">

                      <select name="hide-show" class="hide-show${count} form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                        <option value="Hide">Hide</option>
                        <option value="Show">Show</option>
                        <option value="Make Required">Make Required</option>
                      </select>

                      <span class=" mx-2 h-inherit flex items-center w-fit text-xs sm:text-sm text-primary">This field (if)</span>
                    </label>

                    <label class="sm:flex sm:flex-row">
                      <select name="if" class="if${count} form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                        <option value="All">All</option>
                        <option value="Any">Any</option>
                      </select>
                      <span class=" mx-2 h-inherit flex items-center w-fit text-xs sm:text-sm text-primary">of the following rules match</span>
                    </label>
                  </div>
                  <br>
                  <div id="logicContition${count}" class="SecondCondition${count} w-full relative px-2 pb-8">
                    <div class=" ">
                      <label x-data="{ myVariable: null, selectedCondition: window.selCond }" x-init="myVariable = window.def; selectCondition = window.selCond" class="logicContition${count} sm:flex sm:flex-row  space-y-1 sm:space-x-4 gap-1 sm:gap-0">

                        <select name="matches" id="loginSelect${addmore_count}" onchange="checkSelected(${addmore_count})" class="loginSelect${addmore_count} conditionSelect form-select w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                          <option value="" selected></option>
                        </select>

                        <select x-model="selectedCondition" name="condition" class="selectedCondition${count} form-select w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                          <option value="greater">Is greater than</option>
                          <option value="less">Is less than</option>
                          <option value="equal">Is equal to</option>
                          <option value="less_equal">Is less than or equal to</option>
                          <option value="greater_equal">Is greater than or equal to</option>
                          <option value="empty">Is empty</option>
                          <option value="not_empty">Is not empty</option>
                          <option value="contains">Contains</option>
                          <option value="does_not_contain">Does not contain</option>
                          <option value="checked">Checked</option>
                          <option value="not_checked">Not Checked</option>
                        </select>

                        <template x-if="['greater', 'less', 'equal', 'less_equal', 'greater_equal'].includes(selectedCondition)">
                          <!-- Numeric input for numeric conditions -->
                          <input name="compared" class="col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="" type="number" />
                        </template>

                        <template x-if="['empty', 'not_empty', 'checked', 'not_checked'].includes(selectedCondition)">
                          <!-- No need for an input for these conditions -->
                          <input name="compared" value="0" class="hidden col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="" type="number" />
                        </template>

                        <template x-if="['contains', 'does_not_contain'].includes(selectedCondition)">
                          <!-- Text input for 'contains' and 'does_not_contain' conditions -->
                          <input name="compared" class="col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="" type="text" />
                        </template>

                      </label>
                    </div>

                    <div onclick='addmorecondition(${count},window.selCondAll)' class="addmorecondition absolute bottom-0 right-2 text-primary cursor-pointer hover:text-blue-200">Add more</div>
                  </div>


                </div>

              </div>
            </div>
          </div>

          <!-- Advanced Settings -->
          <div x-data="{expanded${count} : $store.expanded${count}}" x-init="$store.expanded${count} = false" class=" w-full">
            <div @click="$store.expanded${count} = !$store.expanded${count}" class="flex cursor-pointer items-center justify-between text-base font-semibold text-primary  hover:p-[1px] hover:rounded-md dark:text-navy-100">
              <p class="text-xs sm:text-sm">Settings</p>

              <div :class="$store.expanded${count} && '-rotate-180'" class="text-sm font-normal leading-none text-slate-400 transition-transform duration-300 dark:text-navy-300">
                <i class="bi bi-chevron-down"></i>
              </div>
            </div>
            <div x-collapse x-show="$store.expanded${count}" class="mt-4 mb-2 w-full bg-[#f4f4f5] py-4 px-2 rounded-lg card shadow dark:border-0">
              <div class="text-sm FIELD_SETTINGS">

                <!--  TEXT SETTINGS -->
                <div class="text-custom TEXT_SETTING${count}" x-show="$store.selectedOption${count} === 'Text'">
                  <label class=" grid items-center grid-cols-9" x-data="{selectedFruits: ['apple']}">
                    <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-5 h-5 col-span-1 invisible " viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                    </svg>
                    <p class="col-span-4 ">Required</p>
                    <input x-model="selectedFruits" name="Required" class="RequiredCheck col-span-4 border required-checkbox${count} form-checkbox is-basic h-5 w-5 ml-2 rounded bg-slate-100 border-slate-400/70 checked:!bg-success checked:!border-success hover:!border-success focus:!border-success dark:bg-navy-900 dark:border-navy-500" type="checkbox" />
                    <p class="hidden">Value: <span x-text="selectedFruits"></span></p>
                    </label><br>
                  <label class=" grid items-center grid-cols-9 mt-2">
                    <svg x-tooltip.placement.right.interactive.content="'#content7'" fill="none" stroke="currentColor" stroke-width="1.7" class="w-5 h-5 col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                    </svg>
                    <template id="content7">
                      <div class="flex rounded-lg bg-black bg-opacity-50 text-xs backdrop-blur-md  text-slate-100 p-3 dark:bg-navy-500 w-fit max-w-[150px]">
                        <p>When enabled, the value of this field will be prepended to the upload files name.</p>
                      </div>
                    </template> 
                    <p class="col-span-4 ">Add field value to the front of the file name </p>
                    <input name="Add field value to the front of the file name" class="ADVT col-span-4 required-checkbox${count} form-checkbox is-basic h-5 w-5 ml-2 rounded bg-slate-100 border-slate-400/70 checked:!bg-success checked:!border-success hover:!border-success focus:!border-success dark:bg-navy-900 dark:border-navy-500" type="checkbox" />
                  </label><br>
                  <label class=" grid items-center grid-cols-9 mt-2">
                    <svg x-tooltip.placement.right.interactive.content="'#content8'" fill="none" stroke="currentColor" stroke-width="1.7" class="w-5 h-5 col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                    </svg>
                    <template id="content8">
                      <div class="flex rounded-lg bg-black bg-opacity-50 text-xs backdrop-blur-md  text-slate-100 p-3 dark:bg-navy-500 w-fit max-w-[150px]">
                        <p>Text or data that helps the user enter the correct type of information.</p>
                      </div>
                    </template>
                    <p class="col-span-4 ">Placeholder</p>
                    <input name="Placeholder" class="col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Placeholder" type="text" />
                  </label><br>
                  <label class=" grid items-center grid-cols-9 mt-2">
                    <svg x-tooltip.placement.right.interactive.content="'#content9'" fill="none" stroke="currentColor" stroke-width="1.7" class="w-5 h-5 col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                    </svg>
                    <template id="content9">
                      <div class="flex rounded-lg bg-black bg-opacity-50 text-xs backdrop-blur-md  text-slate-100 p-3 dark:bg-navy-500 w-fit max-w-[150px]">
                        <p>Set up custom validations. When specified, it is a regular expression that the input's value must match in order for the value to pass constraint validation.</p>
                      </div>
                    </template>
                    <p class="col-span-4">Validation Pattern</p>
                    <input name="Validation Pattern" class="col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Validation Pattern" type="text" />
                  </label><br>
                  <label class=" grid items-center grid-cols-9 mt-2">
                    <svg x-tooltip.placement.right.interactive.content="'#content10'" fill="none" stroke="currentColor" stroke-width="1.7" class="w-5 h-5 col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                    </svg>
                    <template id="content10">
                      <div class="flex rounded-lg bg-black bg-opacity-50 text-xs backdrop-blur-md  text-slate-100 p-3 dark:bg-navy-500 w-fit max-w-[150px]">
                        <p>Text or data that helps the user enter the correct type of information.</p>
                      </div>
                    </template>
                    <p class="col-span-4">Description</p>
                    <input name="Description" class="col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Description" type="text" />
                  </label>
                </div>

                <!--  DROPDOWN SETTINGS -->
                <div class="dropdown-custom text-sm DROPDOWN_SETTING${count}" x-show="$store.selectedOption${count} === 'Dropdown'">
                  <label class=" items-center grid  grid-cols-9 ">
                    <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-5 h-5 col-span-1 invisible" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                    </svg>
                    <p class="col-span-4">Required</p>
                    <input name="Required" class="col-span-4 required-checkbox${count} form-checkbox is-basic h-5 w-5 mr-1 rounded bg-slate-100 border-slate-400/70 checked:!bg-success checked:!border-success hover:!border-success focus:!border-success dark:bg-navy-900 dark:border-navy-500" type="checkbox" />
                  </label>
                  <br>
                  <label class="grid items-center grid-cols-9 mt-1">
                    <svg x-tooltip.placement.right.interactive.content="'#content7'" fill="none" stroke="currentColor" stroke-width="1.7" class="w-5 h-5 col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                    </svg>
                   
                    <p class="col-span-6 lg:col-span-5 ">Add field value to the front of the file name </p>
                    <input name="Add field value to the front of the file name" class="ADVT col-span-2 lg:col-span-3 required-checkbox${count} form-checkbox is-basic h-5 w-5 ml-2 rounded bg-slate-100 border-slate-400/70 checked:!bg-success checked:!border-success hover:!border-success focus:!border-success dark:bg-navy-900 dark:border-navy-500" type="checkbox" />
                  </label>
                  <br>
                  <label class=" grid items-center grid-cols-9 mt-1">
                    <svg x-tooltip.placement.right.interactive.content="'#content10'" fill="none" stroke="currentColor" stroke-width="1.7" class="w-5 h-5 col-span-1 " viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                    </svg>
                  
                    <p class="col-span-4 ">Description</p>
                    <input name="Description" class="col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Description" type="text" />
                  </label>
                  <br>
                  <label class=" grid grid-cols-9 mt-2">

                    <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-5 h-5 col-span-1 " viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                    </svg>

                    <p class="col-span-4 ">Dropdown List</p>
                    <textarea name="Dropdown List" rows="4" placeholder="Option 1&#10;Option 2&#10;Option 3" class="col-span-4 form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-transparent dark:hover:border-navy-400 dark:focus:border-accent"></textarea>
                  </label>
                </div>

                <!--  FILE UPLOAD SETTINGS -->
                <div class="dropdown-custom FILEUPLOAD_SETTING${count}" x-show="$store.selectedOption${count} === 'File_Upload'">
                  <label class="s items-center grid  grid-cols-9 ">
                    <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-5 h-5 col-span-1 " viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                    </svg>

                    <p class="col-span-4">Required</p>
                    <input name="Required" class="col-span-4 required-checkbox${count} form-checkbox is-basic h-5 w-5 mr-1 rounded bg-slate-100 border-slate-400/70 checked:!bg-success checked:!border-success hover:!border-success focus:!border-success dark:bg-navy-900 dark:border-navy-500" type="checkbox" />

                  </label>
                  <br>
                  <!-- Description -->
                  <label class="grid items-center grid-cols-9 mt-1">
                    <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-5 h-5 col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                    </svg>
                    <p class="col-span-4 lg:col-span-3">Description</p>
                    <input name="Description" class="col-span-4 lg:col-span-5 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Enter Description" type="text" />
                  </label><br>

                  <!-- Rename File As -->
                  <label class="grid items-center grid-cols-9 mt-1">
                    <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-5 h-5 col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                    </svg>
                    <p class="col-span-4 lg:col-span-3">Rename File As</p>
                    <input name="Rename File As" class="col-span-4 lg:col-span-5 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Enter File Name" type="text" />
                  </label><br>

                  <!-- File Types -->
                  <label x-data="{selectFileType${count}:''}" class="grid items-center grid-cols-9 mt-1">
                    <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-5 h-5 col-span-1 lg:col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                    </svg>
                    <p class="col-span-4 lg:col-span-3">File Types</p>

                    <select x-model="selectFileType${count}" name="File Types" x-init="$el._tom = new Tom($el,{ 
                                plugins: ['remove_button'],
                                create: true,
                                sortField: {field: 'text',direction: 'asc'}
                              })" class="x-3 text-xs py-2 select-tom${count} w-full col-span-4 lg:col-span-5" multiple placeholder="Enter/Select File Types..." autocomplete="off">
                      <option value="pdf">PDF (.pdf)</option>
                      <option value="doc">Microsoft Word (.doc, .docx)</option>
                      <option value="xls">Microsoft Excel (.xls, .xlsx)</option>
                      <option value="ppt">Microsoft PowerPoint (.ppt, .pptx)</option>
                      <option value="txt">Plain Text (.txt)</option>
                      <option value="jpg" >JPEG Image (.jpg, .jpeg)</option>
                      <option value="png">PNG Image (.png)</option>
                      <option value="gif">GIF Image (.gif)</option>
                      <option value="mp3">MP3 Audio (.mp3)</option>
                      <option value="mp4">MP4 Video (.mp4)</option>
                      <option value="zip">ZIP Archive (.zip)</option>
                      <option value="csv">CSV File (.csv)</option>
                      <option value="html">HTML Document (.html)</option>
                      <option value="css">CSS Stylesheet (.css)</option>
                      <option value="js">JavaScript (.js)</option>
                      <option value="json">JSON File (.json)</option>
                      <option value="xml">XML Document (.xml)</option>
                      <option value="svg">SVG Image (.svg)</option>
                    </select>
                    <input name="File Types" :value="selectFileType${count}" class="hidden col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Enter File Types" type="text" />

                  </label><br>

                  <!-- Max File Size (MB) -->
                  <label class="grid items-center grid-cols-9 mt-1">
                    <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-5 h-5 col-span-1 lg:col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                    </svg>
                    <p class="col-span-4 lg:col-span-3">Max File Size (MB)</p>
                    <input name="Max File Size (MB)" class="col-span-4 lg:col-span-5 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Enter Max File Size" type="text" />
                  </label><br>

                  <!-- File Quantity -->
                  <label class="grid items-center grid-cols-9 mt-1">
                    <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-5 h-5 col-span-1 " viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                    </svg>
                    <p class="col-span-4 lg:col-span-3">File Quantity</p>
                    <input name="File Quantity" class="col-span-4 lg:col-span-5 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Enter File Quantity" type="text" />
                  </label>

                </div>


                <!--  EMAIL SETTINGS -->
                <div class="dropdown-custom EMAIL_SETTING${count}" x-show="$store.selectedOption${count} === 'Email'">
                  <label class=" grid items-center grid-cols-4" x-data="{selectedFruits: ['apple']}">
                    <p class="col-span-2 ">Required</p>
                    <input x-model="selectedFruits" name="Required" class="col-span-2 border required-checkbox${count} form-checkbox is-basic h-5 w-5 ml-2 rounded bg-slate-100 border-slate-400/70 checked:!bg-success checked:!border-success hover:!border-success focus:!border-success dark:bg-navy-900 dark:border-navy-500" type="checkbox" />
                    <p class="hidden">Value: <span x-text="selectedFruits"></span></p>
                    </label><br>
                  <label class=" grid items-center grid-cols-4">
                    <p class="col-span-2 ">Add field value to the front of the file name </p>
                    <input name="Add field value to the front of the file name" class="ADVT col-span-2 required-checkbox${count} form-checkbox is-basic h-5 w-5 ml-2 rounded bg-slate-100 border-slate-400/70 checked:!bg-success checked:!border-success hover:!border-success focus:!border-success dark:bg-navy-900 dark:border-navy-500" type="checkbox" />
                  </label><br>
                  <label class=" grid items-center grid-cols-4">
                    <p class="col-span-2 ">Placeholder</p>
                    <input name="Placeholder" class="col-span-2 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Placeholder" type="text" />
                  </label><br>

                  <label class=" grid items-center grid-cols-4">
                    <p class="col-span-2 ">Validation Pattern</p>
                    <input name="Validation Pattern" class="col-span-2 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Validation Pattern" type="text" />
                  </label><br>
                  <label class=" grid items-center grid-cols-4">
                    <p class="col-span-2 ">Description</p>
                    <input name="Description" class="col-span-2 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Description" type="text" />
                  </label>
                </div>

              </div>
            </div>
          </div>

        </div>

        <!-- Delets field button -->
        <div class=" sm:col-span-12 md:col-span-2">
          <button onclick="deletefield(${count})" class="col-span-2 btn h-6 w-6 p-0 font-medium text-error hover:bg-error/20 focus:bg-error/20 active:bg-error/25">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewbox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>




      <div class="hidden">
        <button onclick="getId('prime${count}')" class="w-fit text-sm btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
          Add
        </button>
        <button onclick="$('.case-prime${count}').remove(), $('#add_question').show()" class="btn border text-sm border-error font-medium text-error hover:bg-error hover:text-white focus:bg-error focus:text-white active:bg-error/90">
          Cancel
        </button>

      </div>

    </div>

    <!-- <button onclick="deletefield(${count})" class="col-span-2 mt-2 btn h-9 w-9 p-0 font-medium text-error hover:bg-error/20 focus:bg-error/20 active:bg-error/25">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewbox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button> -->
  </div>
  </div>
  </div>

  <script>
    getPrevFields(count)
    function addmorecondition(e, con) {
      addMore(e, con)
    }
  </script>
 
  `);


  $('.drop_').on('input', () => {

    const textareaValue = document.querySelector('.drop_').value;

    // Split the value into lines
    const lines = textareaValue.split('\n');
    // console.log(lines)

    // Trim and filter out empty lines
    const trimmedLines = $.map(lines, function (line) {
      return line.trim();
    }).filter(function (line) {
      return line !== '';
    });

    // Create a comma-separated string
    const commaSeparatedOptions = trimmedLines.join(', ');

    // Log or use the result as needed
    // console.log(commaSeparatedOptions);
  })


  // $('#add_question').hide();
  if(window.res_id == null){
   
    // console.log(newInput)

    $('#showResult_').append(newInput);
  }else{
    $('.showResult_'+window.res_id).append(newInput);
  }

  // Handle Edit Settings, FOR SOME REASON IT CAN ONLYWORK IN THIS JS FILE DUE TO TOM-SELECT
  if(editSettings !== null){
      
    // await editSet(count, editSettings, fieldIndex, fieldTypes)
  
  }

}
function myComponent(initialValue) {
  
  return {
    myVariable: window.def,
  };
}
async function editSet(count_ES, editSettings, fieldIndex, fieldTypes) {
  
  let settings_ = JSON.parse(editSettings) // gotten from edit function
  let settArray = []
  settings_.forEach((setting_)=>{
    settArray.push(setting_)
  })
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
  console.log(settArray)
  if(fieldIndex !== null){

    if(fieldTypes == 'Text'){
      let getPage = document.querySelector(`[page-count = '${res_id}'] .eachField${count_ES} .TEXT_SETTING${count_ES}`)

      if(settArray[0].inputValue == 'on'){
        getPage.querySelector(`[name="Required"]`).setAttribute('checked', 'true');
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

    // END TEXT SETTINGS
    }            
    if(fieldTypes == 'Dropdown'){
      let getPage = document.querySelector(`[page-count = '${res_id}'] .eachField${count_ES} .DROPDOWN_SETTING${count_ES}`)

      if(settArray[0].inputValue == 'on'){
        getPage.querySelector(`[name="Required"]`).checked = true
      }

      if(settArray[1].inputValue == 'on'){
        getPage.querySelector(`.ADVT`).checked = true
      }

      if(settArray[2].inputValue !== ''){
        getPage.querySelector(`[name="Description"]`).value = settArray[2].inputValue
      }

      // DROPSDOWN OPTIONS
      
      if(settArray[3].inputValue !== ''){
        const options = settArray[3].inputValue;
        const formattedOptions = options.join('\n');
        getPage.querySelector(`[name="Validation Pattern"]`).value = formattedOptionss
    
      }

      
    }            
    if(fieldTypes == 'Email'){
      
      let getPage = document.querySelector(`[page-count = '${res_id}'] .eachField${count_ES} .EMAIL_SETTING${count_ES}`)

      if(settArray[0].inputValue == 'on'){
        getPage.querySelector(`[name="Required"]`).checked = true
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
      
      let getPage = document.querySelector(`[page-count = '${res_id}'] .eachField${count_ES} .FILEUPLOAD_SETTING${count_ES}`)

      if(settArray[0].inputValue == 'on'){
        getPage.querySelector(`[name="Required"]`).checked = true
      }

      if(settArray[1].inputValue !== ''){
        getPage.querySelector(`[name="Description"]`).value = settArray[1].inputValue
      }

      if(settArray[2].inputValue !== ''){
        getPage.querySelector(`[name="Rename File As"]`).value = settArray[2].inputValue
      }

      if(settArray[3].inputValue !== ''){
       // console.log(getPage.querySelector(`[name="File Types"]`))
        getPage.querySelector(`[name="File Types"] option[value="${settArray[3].inputValue}"]`).selected = true
      

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
function checkSelected(e){
  var selectedValue =   $('#loginSelect'+e).val();
  if(selectedValue == ''){
    // console.log('you have not selected'+selectedValue)
  }else{
    // console.log('yes'+selectedValue)
  }
}


async function getPrevFields(e, addmore_count_ = null, refresh = null){
  e = Math.max(1, Math.floor(e || 1));
  const values = [];


  let GPF_Count;
    if(addmore_count_ !== null){
      GPF_Count = addmore_count_
    }else{
      GPF_Count = e
    }
    if(e == 1){
      let fieldConditionSelect = document.querySelector(`.prime${e}`);
      let fieldConditionCount = document.querySelector(`.prime_count${e}`);
      let $select = $('.loginSelect' + GPF_Count);
      if(refresh == true){
        $select.empty();
      }
      // console.log(fieldConditionSelect)
      // console.log($select)
      $select.append('<option value="Email#1">Email</option>');
      $select.append('<option value=""  disabled selected>Choose Field</option>');
    
    }else{
      let $select = $('.loginSelect' + GPF_Count);
      if(refresh == true){
        $select.empty();
      }
      $select.append('<option value=""  disabled selected>Choose Field</option>');

      for (let i = e-1; i >= 1; i--) {

        // console.log('for an I: ' + i)
        // console.log('what is e: ' + e)
        let fieldConditionSelect = document.querySelector(`.prime${i}`);
        let fieldConditionCount = document.querySelector(`.prime_count${i}`);

       // console.log(fieldConditionSelect)
        if(fieldConditionSelect !== null){
          // let $field = $('.prime'+GPF_Count);
          // console.log(GPF_Count)
          // console.log(e)
          // console.log(fieldConditionSelect)
          // console.log($select)
          let value = fieldConditionSelect.value; // Add this line to get the value from each select
          let value_count = fieldConditionCount.value; // incase of duplicate field label, this attempts to arrdess it
          $select.find('option[value=""]').not(':disabled').remove();     
          $select.append('<option value="' + value +'#'+ value_count+'">' + value + '</option>');
        }
      }
    }

}


async function getPrevFields_(e, addmore_count_ = null){
  // DEFUNCT
  let GPF_Count;
    if(addmore_count_ !== null){
      GPF_Count = addmore_count_
    }else{
      GPF_Count = e
    }

    // get the current field number, 
    // get the fieilds less than that number, do not get to 0, stop at one
    // get the value of those fields lss than tat number
      // Assuming 'e' is defined elsewhere in your code
      let allConditionSelect = document.querySelectorAll('.fieldName');
      let $select = $('.loginSelect' + GPF_Count);

      allConditionSelect.forEach((selectCondition, index) => {
        let value = selectCondition.value; // Add this line to get the value from each select
        let $field = $('.prime'+GPF_Count);
   
        // alert(value)
        // Use $select instead of $('.loginSelect'+index) for consistency

        $select.find('option[value=""]').remove();      
        $select.append('<option value="' + value + '">' + value + '</option>');

        if($field.val() == value){
  
          $select.find(`option[value="${value}"]`).remove(); 
          // console.log(`${$select.val()} ' = ' ${value})`)
        } 
        if(GPF_Count == '1'){
          $select.append('<option value="Email">Email</option>');
        }
      });

  /*
  var optionsData = [];
  var divContent 
  var $select = $('#loginSelect'+e);
  // console.log(e);
  const divCount = $(`.showResult_ .eachField`).length;
  $(`.showResult_ .eachField .fieldName`).each(function() {
    divContent =''
    divContent += $(this).val();
    if(divContent === ''){

    }
    else{
      // console.log(divContent)
      optionsData.push(divContent)
    }
    // console.log('divContent is'+ divContent)
    // optionsData = [];
    
  });
// console.log(optionsData)
// Loop through the data and append options to the select
$.each(optionsData, function (index, value) {
// console.log('value'+value)
// $select.html('')

$select.find('option[value=""]').remove();
$select.append('<option value="'+value+'">'+value+'</option>');

});
// console.log('current count '+e)
// console.log('the div count is '+divCount+'and the div content is '+divContent)
// alert(divContent)
*/

}



// ADD MORE LOGIC TO THE FORM
async function addMore(counted, con = null) {

  // console.log(counted)
  // alert(window.pos) // this was set in edit.js
  if(con !== null){
    // console.log(con)
    if(window.selCondAddMore !== ''){
      let conditions_ = con
      // console.log(conditions_[window.pos])
     
      // window.selCond = conditions_.secondCondition[window.pos].SCL_selectorValue
    }
  }
  ++addmore_count

  $(`#logicContition${counted}`).append(
    `
        <div class=" mt-2">
          <label x-data="{myVariable: null,isOpen: true, selectedCondition: window.selCond}" x-init="myVariable = window.def"  x-show="isOpen" class="logicContition${counted}  mt-1 sm:flex sm:flex-row sm:space-x-4">
            <select name="matches" id="loginSelect${addmore_count}" onchange="checkSelected(${addmore_count})" class="loginSelect${addmore_count} conditionSelect form-select w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                <option value="" selected></option>
            </select>
            <select x-model="selectedCondition" name="condition" class="selectedCondition${count} form-select w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                <option value="greater">Is greater than</option>
                <option value="less">Is less than</option>
                <option value="equal">Is equal to</option>
                <option value="less_equal">Is less than or equal to</option>
                <option value="greater_equal">Is greater than or equal to</option>
                <option value="empty">Is empty</option>
                <option value="not_empty">Is not empty</option>
                <option value="contains">Contains</option>
                <option value="does_not_contain">Does not contain</option>
                <option value="checked">Checked</option>
                <option value="not_checked">Not Checked</option>
            </select>

            <template x-if="['greater', 'less', 'equal', 'less_equal', 'greater_equal'].includes(selectedCondition)">
                <!-- Numeric input for numeric conditions -->
                <input name="compared" class="col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="" type="number" />
            </template>

            <template x-if="['empty', 'not_empty', 'checked', 'not_checked'].includes(selectedCondition)">
                <!-- No need for an input for these conditions -->
                <input name="compared" value="0" class="hidden col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="" type="number" />
            </template>

            <template x-if="['contains', 'does_not_contain'].includes(selectedCondition)">
                <!-- Text input for 'contains' and 'does_not_contain' conditions -->
                <input name="compared" class="col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="" type="text" />
            </template>

            <button @click="isOpen = false" class="btn h-9 w-9 p-0 font-medium text-error hover:bg-error/20 focus:bg-error/20 active:bg-error/25">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewbox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
            
        </label>
        </div>
     
        `)
      await getPrevFields(counted, addmore_count)
}



function onDelete(e) {

  var addedQuestion = $(`.${e}`)
  addedQuestion.remove()
}

function deletefield(e) {

  var fieldToDelte = $(`.isOpenField${e}`)
  fieldToDelte.remove()
}



function getId(e) {
  const requiredCheckbox = $(`.required-checkbox${count}`);
  const isRequired = requiredCheckbox.prop('checked') ? 'Required' : 'Not Required';
  var getCase = $(`.case-${e}`)
  var getClass = $(`.${e}`)

  getCase.remove()

  storedInput = $(
    /*html*/
    `
            <div class="flex mt-2 gap-2 added-prime${count_}">
                <p class="p-2">Question ${count_ + 1}</p>
            </div>
            <div class=" added-prime${count_} flex items-center justify-between space-x-2 rounded-lg border border-slate-200 p-3 py-5 dark:border-navy-600">
                <div class="flex items-center space-x-4">
                    <div class="avatar h-12 w-12">
                        <div
                          class="mask is-squircle text-success flex h-14 w-14 items-center font-bold  justify-center bg-success/10"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                          </svg>                              
                     
                        </div>
                      </div>
                    <div>
                        <p class="font-medium text-lg text-slate-700 dark:text-navy-100">
                            ${getClass.val()}
                        </p>
                        
                        <p class="mt-0.5 text-xs line-clamp-1 ${(isRequired == 'Required') ? 'text-error' : 'text-success'}">
                            ${isRequired}
                        </p>
                    </div>
                </div>
        
                <button onclick="onDelete('added-prime${count_}')" class="btn h-9 w-9 p-0 font-medium text-error hover:bg-error/20 focus:bg-error/20 active:bg-error/25" >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
                
                  
            </div>
        
            `);
  $('.showResult_').append(storedInput);
  $('#add_question').show()

  value = `${getClass.val()}-${isRequired}`
  quest += (count_ > 0 ? ', ' : '') + value;
  // console.log(quest)
  localStorage.setItem('form-questions', quest)
  count_++


}
