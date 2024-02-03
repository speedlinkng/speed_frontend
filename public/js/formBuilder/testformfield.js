
// import { moduleVariable } from './testmodule.js';
// Initialize variables to store questions and answers

var count = 0;
var count_ = 0;
var quest = ""
var ans = "";
var newInput = "";
var storedInput = "";
var value = ""

var save = (function () {
  localStorage.setItem('form-questions', quest)
})



async function adddefaultQ(addpage, res_id = null){
  
  if(addpage == 1 ){
    addQ('', res_id)
  }else{
    var label_ = [ 'Your Name', 'Your Email'] 
    for(i= 0; i < 2; i++){
      await addQ(label_[i])
   
    }

  }
}
setTimeout(function(){
  var a_ = addPage
  adddefaultQ(a_)
}, 1000)


async function addQ(e = null, res_id = null) {
  window.def = ''
  window.res_id = res_id
  // console.log(e)
  if(e != null){
    window.def = e
    // console.log('{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}')
    // console.log(window.def)
  }else{
    window.def = ''
  }

  count += 1
  // console.log(window.def+ 'first then sec')
  //   var how = `<script>alert('scripted')</script>`;

  newInput = $(
    /*html*/
    `
    <div class="grid grid-cols-12 gap-3 isOpenField${count}" x-data="{ isOpenField${count}: true }" :class="{ 'opacity-0': !isOpenField${count}, 'pointer-events-none': !isOpenField${count} }">
      <div class="col-span-12 eachField${count} text-sm eachField grid grid-cols-1 w-full mt-2 case-prime${count} rounded-lg border border-slate-200 p-3 py-5 dark:border-navy-600">
        <div class="flex space-x-4">

          <label class="block w-[55%]" x-data="{selectedOption${count}: $store.selectedOption${count}}" x-init="$store.selectedOption${count} = 'Text'">
            <select x-init="$store.selectedOption${count};$el._x_tom = new Tom($el,{create: true,sortField: {field: 'text',direction: 'asc'}})" x-model="$store.selectedOption${count}">
              <option>Text</option>
              <option>Email</option>
              <option>Dropdown</option>
              <option>File Upload</option>

            </select>

            <!-- Result of whatever option was selected -->
            <input name="Field_select_option" type="text" class="hidden Field_select_option" x-bind:value="$store.selectedOption${count}" />


          </label>

          <input class="fieldName form-input w-[45%] rounded-lg prime${count} bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Field Label" x-model="window.def" x-bind:value="window.def !== '' ? window.def : undefined" type="text" />

        </div>


        <!-- TEXT DETAILS--->

        <div class="grid grid-cols-12 gap-2">
          <div class="col-span-10">
            <!-- Put settings, logic and delete in a grid format or inline -->
            <!-- COLLAPSIBLA CUSTOMIZATION -->
            <div x-data="{expanded_condition${count} : $store.expanded_condition${count}}" x-init="$store.expanded_condition${count} = false" class="w-full">
              <div @click="$store.expanded_condition${count} = !$store.expanded_condition${count}" class="flex cursor-pointer items-center justify-between  text-base font-medium text-slate-700 dark:text-navy-100">
                <p @click="" class="text-sm">Conditional Logic</p>
                <div :class="$store.expanded_condition${count} && '-rotate-180'" class="text-sm font-normal leading-none text-slate-400 transition-transform duration-300 dark:text-navy-300">
                  <i class="bi bi-chevron-down"></i>
                </div>
              </div>

              <div x-collapse x-show="$store.expanded_condition${count}">
                <div>

                  <div class="CONDITIONAL_LOOP${count} mt-4 mb-2 text-sm dropdown-custom grid grid-col-1 gap-1 py-4 border border-primary dark:border-0 px-2 rounded-lg bg-[#f4f4f5] card">
                    <div class="FirstCondition${count}">
                      <label x-data="{ myVariable: null }" x-init="myVariable = window.def" class="sm:flex sm:flex-row text-sm">

                        <select name="hide-show" class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                          <option>Hide</option>
                          <option>Show</option>
                          <option>Make Required</option>

                        </select>
                        <span class=" mx-2 h-inherit flex items-center w-[25%] text-blue-500">This field (if)</span>
                      </label>

                      <label class="sm:flex sm:flex-row">
                        <select name="if" class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                          <option>All</option>
                          <option>Any</option>

                        </select>
                        <span class=" mx-2 h-inherit flex items-center w-[55%] text-blue-500">of the following rules match</span>
                      </label>
                    </div>
                    <br>
                    <div id="logicContition${count}" class="SecondCondition${count} w-full relative px-2 pb-8">
                      <label x-data="{ myVariable: null, selectedCondition: 'greater' }" x-init="myVariable = window.def" class="logicContition${count} sm:flex sm:flex-row sm:space-x-4">

                        <select name="matches" id="loginSelect${count}" onchange="checkSelected(${count})" class="loginSelect${count} conditionSelect form-select w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                          <option value="" selected></option>
                        </select>

                        <select x-model="selectedCondition" name="condition" class="form-select w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
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

                      <div @click="addmorecondition(${count})" class="absolute bottom-0 right-2 text-blue-400 cursor-pointer hover:text-blue-200">Add more</div>
                    </div>


                  </div>

                </div>
              </div>
            </div>

            <!-- Advanced Settings -->
            <div x-data="{expanded${count} : $store.expanded${count}}" x-init="$store.expanded${count} = false" class=" w-full">
              <div @click="$store.expanded${count} = !$store.expanded${count}" class="flex cursor-pointer items-center justify-between  text-base font-medium text-slate-700 dark:text-navy-100">
                <p class="text-sm">Settings</p>

                <div :class="$store.expanded${count} && '-rotate-180'" class="text-sm font-normal leading-none text-slate-400 transition-transform duration-300 dark:text-navy-300">
                  <i class="bi bi-chevron-down"></i>
                </div>
              </div>
              <div x-collapse x-show="$store.expanded${count}" class="mt-4 mb-2 w-full bg-[#f4f4f5] py-4 px-2 rounded-lg card dark:border-0">
                <div class="text-sm FIELD_SETTINGS">

                  <!--  TEXT SETTINGS -->
                  <div class="text-custom TEXT_SETTING${count}" x-show="$store.selectedOption${count} === 'Text'">
                    <label class=" grid items-center grid-cols-9">
                      <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-6 h-6 col-span-1 invisible " viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                      </svg>
                      <p class="col-span-4 ">Required</p>
                      <input name="Required" class="col-span-4 border required-checkbox${count} form-checkbox is-basic h-5 w-5 ml-2 rounded bg-slate-100 border-slate-400/70 checked:!bg-success checked:!border-success hover:!border-success focus:!border-success dark:bg-navy-900 dark:border-navy-500" type="checkbox" />
                    </label><br>
                    <label class=" grid items-center grid-cols-9 mt-2">
                      <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-6 h-6 col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                      </svg>
                      <p class="col-span-4 ">Add field value to the front of the file name </p>
                      <input name="Add field value to the front of the file name " class="col-span-4 required-checkbox${count} form-checkbox is-basic h-5 w-5 ml-2 rounded bg-slate-100 border-slate-400/70 checked:!bg-success checked:!border-success hover:!border-success focus:!border-success dark:bg-navy-900 dark:border-navy-500" type="checkbox" />
                    </label><br>
                    <label class=" grid items-center grid-cols-9 mt-2">
                      <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-6 h-6 col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                      </svg>
                      <p class="col-span-4 ">Placeholder</p>
                      <input name="Placeholder" class="col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Placeholder" type="text" />
                    </label><br>
                    <label class=" grid items-center grid-cols-9 mt-2">
                      <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-6 h-6 col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                      </svg>
                      <p class="col-span-4">Validation Pattern</p>
                      <input name="Validation Pattern" class="col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Validation Pattern" type="text" />
                    </label><br>
                    <label class=" grid items-center grid-cols-9 mt-2">
                      <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-6 h-6 col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                      </svg>
                      <p class="col-span-4">Description</p>
                      <input name="Description" class="col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Description" type="text" />
                    </label>
                  </div>

                  <!--  DROPDOWN SETTINGS -->
                  <div class="dropdown-custom text-sm DROPDOWN_SETTING${count}" x-show="$store.selectedOption${count} === 'Dropdown'">
                    <label class="s items-center grid  grid-cols-9 ">
                      <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-6 h-6 col-span-1 " viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                      </svg>
                      <p class="col-span-4">Required</p>
                      <input name="Required" class="col-span-4 required-checkbox${count} form-checkbox is-basic h-5 w-5 mr-1 rounded bg-slate-100 border-slate-400/70 checked:!bg-success checked:!border-success hover:!border-success focus:!border-success dark:bg-navy-900 dark:border-navy-500" type="checkbox" />

                    </label>
                    <br>
                    <label class="grid items-center grid-cols-9 mt-1">
                      <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-6 h-6 col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                      </svg>

                      <p class="col-span-6 lg:col-span-5 ">Add field value to the front of the file name </p>
                      <input name="Add field value to the front of the file name" class="col-span-2 lg:col-span-3 required-checkbox${count} form-checkbox is-basic h-5 w-5 ml-2 rounded bg-slate-100 border-slate-400/70 checked:!bg-success checked:!border-success hover:!border-success focus:!border-success dark:bg-navy-900 dark:border-navy-500" type="checkbox" />
                    </label>
                    <br>
                    <label class=" grid items-center grid-cols-9 mt-1">
                      <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-6 h-6 col-span-1 " viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                      </svg>
                      <p class="col-span-4 ">Description</p>
                      <input name="Description" class="col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Description" type="text" />
                    </label>
                    <br>
                    <label class=" grid grid-cols-9 mt-2">

                      <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-6 h-6 col-span-1 " viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                      </svg>

                      <p class="col-span-4 ">Dropdown List</p>
                      <textarea name="Dropdown List" rows="4" placeholder="Option 1&#10;Option 2&#10;Option 3" class="col-span-4 form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-transparent dark:hover:border-navy-400 dark:focus:border-accent"></textarea>
                    </label>
                  </div>

                  <!--  FILE UPLOAD SETTINGS -->
                  <div class="dropdown-custom FILEUPLOAD_SETTING${count}" x-show="$store.selectedOption${count} === 'File Upload'">
                    <label class="s items-center grid  grid-cols-9 ">
                      <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-6 h-6 col-span-1 invisible" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                      </svg>

                      <p class="col-span-4">Required</p>
                      <input name="Required" class="col-span-4 required-checkbox${count} form-checkbox is-basic h-5 w-5 mr-1 rounded bg-slate-100 border-slate-400/70 checked:!bg-success checked:!border-success hover:!border-success focus:!border-success dark:bg-navy-900 dark:border-navy-500" type="checkbox" />

                    </label>
                    <br>
                    <!-- Description -->
                    <label class="grid items-center grid-cols-9 mt-1">
                      <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-6 h-6 col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                      </svg>
                      <p class="col-span-4 lg:col-span-5">Description</p>
                      <input name="Description" class="col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Enter Description" type="text" />
                    </label><br>

                    <!-- Rename File As -->
                    <label class="grid items-center grid-cols-9 mt-1">
                      <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-6 h-6 col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                      </svg>
                      <p class="col-span-4 lg:col-span-5">Rename File As</p>
                      <input name="Rename File As" class="col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Enter File Name" type="text" />
                    </label><br>

                    <!-- File Types -->
                    <label class="grid items-center grid-cols-9 mt-1">
                      <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-6 h-6 col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                      </svg>
                      <p class="col-span-4 lg:col-span-5">File Types</p>
                      <input name="File Types" class="col-span-4 hidden form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Enter File Types" type="text" />

                      <select name="File Types" x-init="$el._tom = new Tom($el,{ 
                                  plugins: ['remove_button'],
                                  create: true,
                                  sortField: {field: 'text',direction: 'asc'}
                                })" class="x-3 py-2  w-full col-span-4 " multiple placeholder="Enter/Select File Types..." autocomplete="off">
                        <option value="pdf" selected>PDF (.pdf)</option>
                        <option value="doc">Microsoft Word (.doc, .docx)</option>
                        <option value="xls">Microsoft Excel (.xls, .xlsx)</option>
                        <option value="ppt">Microsoft PowerPoint (.ppt, .pptx)</option>
                        <option value="txt">Plain Text (.txt)</option>
                        <option value="jpg" selected>JPEG Image (.jpg, .jpeg)</option>
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
                    </label><br>

                    <!-- Max File Size (MB) -->
                    <label class="grid items-center grid-cols-9 mt-1">
                      <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-6 h-6 col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                      </svg>
                      <p class="col-span-4 lg:col-span-5">Max File Size (MB)</p>
                      <input name="Max File Size (MB)" class="col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Enter Max File Size" type="text" />
                    </label><br>

                    <!-- File Quantity -->
                    <label class="grid items-center grid-cols-9 mt-1">
                      <svg fill="none" stroke="currentColor" stroke-width="1.7" class="w-6 h-6 col-span-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
                      </svg>
                      <p class="col-span-4 lg:col-span-5">File Quantity</p>
                      <input name="File Quantity" class="col-span-4 form-input w-full rounded-lg bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900" placeholder="Enter File Quantity" type="text" />
                    </label>

                  </div>


                  <!--  EMAIL SETTINGS -->
                  <div class="dropdown-custom EMAIL_SETTING${count}" x-show="$store.selectedOption${count} === 'Email'">
                    <label class=" grid items-center grid-cols-4">
                      <p class="col-span-2 ">Required</p>
                      <input name="Required" class="col-span-2 border required-checkbox${count} form-checkbox is-basic h-5 w-5 ml-2 rounded bg-slate-100 border-slate-400/70 checked:!bg-success checked:!border-success hover:!border-success focus:!border-success dark:bg-navy-900 dark:border-navy-500" type="checkbox" />
                    </label><br>
                    <label class=" grid items-center grid-cols-4">
                      <p class="col-span-2 ">Add field value to the front of the file name </p>
                      <input name="Add field value to the front of the file name" class="col-span-2 required-checkbox${count} form-checkbox is-basic h-5 w-5 ml-2 rounded bg-slate-100 border-slate-400/70 checked:!bg-success checked:!border-success hover:!border-success focus:!border-success dark:bg-navy-900 dark:border-navy-500" type="checkbox" />
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
          <div class="col-span-2">
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

    <script>
      getPrevFields(count)

      function addmorecondition(e) {
        addMore(e)
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
   
    console.log(newInput)
    // alert(window.res_id)
    $('#showResult_').append(newInput);
  }else{

    $('.showResult_'+window.res_id).append(newInput);
  }
}
function myComponent(initialValue) {
  
  return {
    myVariable: window.def,
  };
}
function checkSelected(e){
  var selectedValue =   $('#loginSelect'+e).val();
  if(selectedValue == ''){
    // console.log('you have not selected'+selectedValue)
  }else{
    // console.log('yes'+selectedValue)
  }
}


function getPrevFields(e){
      // Assuming 'e' is defined elsewhere in your code
      let allConditionSelect = document.querySelectorAll('.fieldName');
      let $select = $('.loginSelect' + e);

      allConditionSelect.forEach((selectCondition, index) => {
        let value = selectCondition.value; // Add this line to get the value from each select
        let $field = $('.prime'+e);
  
        // Use $select instead of $('.loginSelect'+index) for consistency

        $select.find('option[value=""]').remove();      
        $select.append('<option value="' + value + '">' + value + '</option>');

        if($field.val() == value){
  
          $select.find(`option[value="${value}"]`).remove(); 
          // console.log(`${$select.val()} ' = ' ${value})`)
        } 
        if(e == '1'){
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
function addMore(counted) {

  // console.log(counted)

  $(`#logicContition${counted}`).append(
    `

          <label x-data="{ myVariable: null,isOpen: true, selectedCondition: 'greater' }" x-init="myVariable = window.def"  x-show="isOpen" class="logicContition${count}  mt-1 sm:flex sm:flex-row sm:space-x-4">
            <select name="matches" id="loginSelect${count}" onchange="checkSelected(${count})" class="loginSelect${count} conditionSelect form-select w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                <option value="" selected></option>
            </select>
            <select x-model="selectedCondition" name="condition" class="form-select w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
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
     
        `)
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
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
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
