async function getAllSubscribers() {
  var table;
    let settings = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access')}`,
      },
    };
    try {
      let getAllRecords = await fetch(`${backendUrl}/api/admin/getAllSubscribers`, settings);
      let res = await getAllRecords.json();
      let status = await getAllRecords.status;
        if(status == 403 && res.message == 'invalid token'){
            window.location.href = `${baseUrl}/auth`
        }

      console.log(res.data)
      
      setTimeout(function () { 
      
        if (table) {
          table.search('').draw();
        } else {
          table = new DataTable("#users_table", {
            info: false,
            ordering: true,
            paging: true,
            fixedHeader: true,
            // searching: false,    // Disable search functionality
            lengthChange: false,  // Disable "entries per page" option
            scrollY: '500px', // Vertical scrolling height
            // scrollX: true, // Enable horizontal scrolling
            scrollCollapse: true, // Allow DataTable to shrink to fit if needed
            columnDefs: [
              { orderable: false, targets: 0 }, // Disable ordering for the first column (index 0)
            //   { visible: false, targets: [ 2,4, 6, 9] } // Hide columns 2, 3, and 8
            ]
          });
  

   
       }

      },500)

    }
    catch (err) {
      console.log('internet error')
      console.log(err)
    }
  }

  getAllSubscribers()

  // document.getElementById("sub").innerHTML = ''
  // const tb = new gridjs.Grid({
  //   columns: ["Name", "Email", "Phone Number"],
  //   sort: true,
  //   search: true,
  //   data: [
  //     ["John", "john@example.com", "(353) 01 222 3333"],
  //     ["Mark", "mark@gmail.com", "(01) 22 888 4444"],
  //     ["Eoin", "eoin@gmail.com", "0097 22 654 00033"],
  //     ["Sarah", "sarahcdd@gmail.com", "+322 876 1233"],
  //     ["Afshin", "afshin@mail.com", "(353) 22 87 8356"]
  //   ],
  //   resizable: true,
  //   className: {
   
  //     tr: 'border border-transparent border-b-slate-200 dark:border-b-navy-500',
  //     // table: 'custom-table-classname'
  //     th:"gridjs-th gridjs-th-sort whitespace-nowrap bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
  //   },
  //   // style: {
  //   //   table: {
  //   //     border: '3px solid #ccc'
  //   //   },
  //   //   th: {
  //   //     'background-color': 'rgba(0, 0, 0, 0.1)',
  //   //     color: '#000',
  //   //     'border-bottom': '3px solid #ccc',
  //   //     'text-align': 'center'
  //   //   },
  //   //   td: {
  //   //     'text-align': 'center'
  //   //   }
  //   // }
  // });
  
  
  
  // tb.render(document.getElementById("sub"));
