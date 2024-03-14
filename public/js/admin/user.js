// Get all user record$s

var allUsers; // this will be available everywhere within admin.ejs
async function getAllUsers() {

    let settings = {
      method: 'GET',
      headers: {
        "content-Type": "application/javascript",
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      },
    };
    try {
      let getAllUsers = await fetch(`${backendUrl}/api/admin/getAllUsers`, settings);
      let res = await getAllUsers.json();
      let status = await getAllUsers.status;
        if(status == 400 && res.message == 'invalid token'){
            console.log('invalid')
            window.location.href = `${baseUrl}/auth`
        }

        if(status == 403 && res.message == 'Access denied!'){
            console.log('access denied')
            window.location.href = `${baseUrl}/auth`
        }

        console.log('<<<>>>')
        console.log(res.data)
        console.log('<<<>>>')
        console.log(res.sub_data)


        if (res.sub_data != '') {
            let all = res.sub_data
            // let records = res.sub_data.
            let id = 1
            $('#all_users').html('') // EMPTY THE HTML DISPLAY HOLDER
            
            all.forEach(user => {
              console.log(user.user)
              console.log(user.records)

              allUsers = user.user
              let usr = user.user
              let rec = user.records
              usr.forEach(res => {  
           
                    $('#all_users').append(
              /*html*/
                    `
                    <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                    <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        ${id++}
                    </td>
                    <td
                        x-data="usePopper({
                            offset: 12,
                            placement: 'right-start',
                            modifiers: [
                            {name: 'flip', options: {fallbackPlacements: ['bottom','top']}},
                            {name: 'preventOverflow', options: {padding: 10}}
                            ]
                        })"
                       
                        x-ref="popperRef"
                        @mouseover="isShowPopper = !isShowPopper"
                        @mouseover.outside="if(isShowPopper) isShowPopper = false"
                         class="whitespace-nowrap px-4 py-3 sm:px-5" x-data="{showRecord:false}">
                    <div 
                        x-ref="popperRef"
                        @mouseover="isShowPopper = !isShowPopper"
                        class="flex items-center space-x-4">

                        <span 
                  
                        class="font-medium text-slate-700 dark:text-navy-100">
                        ${res.firstName} ${res.lastName} 
                        </span>
                        <div x-ref="popperRoot" class="popper-root " :class="isShowPopper && 'show'" >
                        <div class="popper-box max-w-[700px] w-fits">
                        <div class="rounded-md border border-slate-150 bg-white py-3 px-4 dark:border-navy-600 dark:bg-navy-700" >
                        <div class="is-scrollbar-hidden min-w-full h-60 overflow-x-auto">
                            <table class="w-full text-left">
                                <thead>
                                    <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                                        <th
                                            class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-yellow-800 dark:text-navy-100 lg:px-5">
                                            #
                                        </th>
                                        <th
                                            class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">
                                            Record Name
                                        </th>
                                        <th
                                            class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">
                                            Size
                                        </th>
                                        <th
                                            class="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 lg:px-5">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody class="show_record">

                                </tbody>
                            </table>
                        </div>
                        </div>
                        </div>
                        </div>

    

                      
                    </div>
                    </td>
                    <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        ${res.email}
                    </td>
                    <td class="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-navy-100 sm:px-5">
                        ${res.number}
                    </td>
                    <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        ${res.count_uploads}
                    </div>
                    </td>
                    <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                        ${res.plan}
                    </div>
                    </td>
                    <td class="whitespace-nowrap px-4 py-3 sm:px-5" x-data="{showModal:false}">
                    <button
                        @click="showModal = true"
                        class="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                            viewbox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                    </button>
                    <template x-teleport="#x-teleport-target">
                    <div class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
                        x-show="showModal" role="dialog" @keydown.window.escape="showModal = false">
                        <div class="absolute inset-0 bg-slate-900/60 transition-opacity duration-300" @click="showModal = false"
                            x-show="showModal" x-transition:enter="ease-out" x-transition:enter-start="opacity-0"
                            x-transition:enter-end="opacity-100" x-transition:leave="ease-in" x-transition:leave-start="opacity-100"
                            x-transition:leave-end="opacity-0"></div>
                        <div class="relative w-full max-w-lg origin-top rounded-lg bg-white transition-all duration-300 dark:bg-navy-700"
                            x-show="showModal" x-transition:enter="easy-out" x-transition:enter-start="opacity-0 scale-95"
                            x-transition:enter-end="opacity-100 scale-100" x-transition:leave="easy-in"
                            x-transition:leave-start="opacity-100 scale-100" x-transition:leave-end="opacity-0 scale-95">
                            <div class="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                                <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
                                    Edit User
                                </h3>
                                <button @click="showModal = !showModal"
                                    class="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewbox="0 0 24 24"
                                        stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            <div class="px-4 py-4 sm:px-5">
                                <p>
                                    Edit Allowable user details, this feature is available only for SuperAdmins
                                </p>
                                <div class="mt-4 space-y-4">
                                    <label class="block">
                                        <span>Change Status </span>
                                        <select id="edit_status${res.id}"
                                            class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                                            <option value="Active">Active</option>
                                            <option value="Suspended">Suspended</option>
                                            <option value="Deleted">Deleted</option>
                                            <option value="Denied">Denied</option>
                                        </select>
                                    </label>
                
                                    <label class="block">
                                        <span>Change Plan </span>
                                        <select id="edit_plan${res.id}"
                                            class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                                            <option value="1">1 (Free)</option>
                                            <option value="2">2 (Paid)</option>
                                            <option value="3">3 (Pro)</option>
                
                                        </select>
                                    </label>
                
                                    <label class="block">
                                        <span>Change firstName</span>
                                        <input
                                            class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                                            placeholder="Name" type="text" id="edit_firstName${res.id}" />
                                    </label>
                                    <label class="block">
                                        <span>Change lastName</span>
                                        <input
                                            class="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                                            placeholder="Name" type="text" id="edit_lastName${res.id}" />
                                    </label>
                
                                    <div class="space-x-2 text-right">
                                        <button @click="showModal = false"
                                            class="btn min-w-[7rem] rounded-full border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90">
                                            Cancel
                                        </button>
                                        <button onclick="update(${res.id})" @click="showModal = false"
                                            class="btn min-w-[7rem] rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                </td>

                </tr>



                <script>
                async function update(a_id) {
                let id = 1
                let e_status = $('#edit_status'+a_id).val()
                let e_lastname = $('#edit_lastName'+a_id).val()
                let e_firstname = $('#edit_firstName'+a_id).val()
                let e_plan = $('#edit_plan'+a_id).val()
                
                console.log(e_status)
                console.log(e_lastname)
                console.log(e_firstname)
                console.log(e_plan)
                
                    let settings = {
                        method: 'PATCH',
                        headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+localStorage.getItem('access'),
                        },
                        body: JSON.stringify({
                        e_status : e_status,
                        e_lastname : e_lastname,
                        e_firstname : e_firstname,
                        e_plan : e_plan,
                        })
                    }
                
                    try {
                        let getTotalAmount = await fetch(backendUrl+'/api/admin/updateUser/'+${res.id}, settings);
                        let res = await getTotalAmount.json();
                        let update_status = await getTotalAmount.status;
                        if(update_status == 200){
                            getAllUsers()
                        }

                    }
                    catch (err) {
                        console.log('internet ')
                        console.log(err)
                    }
                }
                    
                
                </script>
            
                    `
        
                    )

                    rec.forEach(rec => {
                        let rec_status = rec.status
                        if(rec_status == 'completed'){
                            rec_status = 
                            `
                            <div
                                class="badge space-x-2.5 rounded-full bg-success/10 text-success dark:bg-success-light/15 dark:text-success capitalize">
                                <div class="h-2 w-2 rounded-full bg-current"></div>
                                <span>${rec.status}</span>
                            </div>
                            
                            `
                        }else if(rec_status == 'expired'){
                           rec_status= `
                            <div
                                class="badge space-x-2.5 rounded-full bg-error/10 text-error dark:bg-error-light/15 dark:text-error capitalize">
                                <div class="h-2 w-2 rounded-full bg-current"></div>
                                <span>${rec.status}</span>
                            </div>
                            `
                        }else{
                          rec_status=  `
                            <div
                                class="badge space-x-2.5 rounded-full bg-warning/10 text-warning dark:bg-warning-light/15 dark:text-warning capitalize">
                                <div class="h-2 w-2 rounded-full bg-current"></div>
                                <span>${rec.status}</span>
                            </div>
                            `
                        }
                        $('.show_record').append(
                            `
                                        
                                <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                                    <td class="whitespace-nowrap px-4 py-3 sm:px-5">${id++}</td>
                                    <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                                        ${rec.record_name}
                                    </td>
                                    <td class="whitespace-nowrap px-4 py-3 sm:px-5">${rec.file_size}</td>
                                    <td class="whitespace-nowrap px-4 py-3 sm:px-5">
                                       ${rec_status}
                                    </td>
                                </tr>
                
                            `
                        )
                    })


  
            })
        })
  
          }else{
              $('#display').html('') // set diaplay to empty
              $('#display').append(
                  /*html*/
                    `
                 <div class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500 absolute w-[100%]">
                  <div class="whitespace-nowrap px-4 py-3 sm:px-5 w-[100%] border dark:border-navy-500">
                      <div class="flex items-center space-x-4 justify-center">
                         
                          <span class="font-medium text-slate-700 dark:text-navy-200">No Record Yet</span>
                      </div>
                  </div>
                 </div>
                 `
                 )
          }

    }
    catch (err) {
      console.log('internet error')
      console.log(err)
    }
  }


  getAllUsers()