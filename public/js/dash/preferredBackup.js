function getGoogleUrlData_bk() {
    var url = "";
    var url_params = new URLSearchParams(window.location.search);
  
  async function sendData_bk(urll) {
    let zoomClick_ = document.getElementById("_Zoom");
    zoomClick_.click();
  
      let scope = url_params.get("scope");
      let code = url_params.get("code");
      let prompt = url_params.get("prompt");
      let authuser = url_params.get("authuser");
  
      $.ajax({
        url: urll,
        method: "POST",
        dataType: "json",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        data: { scope: scope, code: code, prompt: prompt, authuser: authuser },
        
        beforeSend: function () {
          showNoti("primary", "Hold on were initiating your request", 3000);
          startLoader();
        },
        success: function (res) {
          console.log("Success:", res);
          alert('returned')
  
          if (res.error == 1) {
          } else if (res.error == 2) {
            window.location.href = `${baseUrl}/auth`;
          } else if (res.success == 1) {
            alert('success')
           
      
            localStorage.setItem("my_goog_acc", res.token); // google access token for users second time
            endLoader();
            setActiveItem("Zoom");
            $(`#cancel_stroage_selec_modal`).trigger("click");
          } else {
          }
      
          localStorage.setItem("backup_stroage", 0);
        },
        error: function (xhr, status, error) {
          localStorage.setItem("backup_stroage", 0);
          showNoti("error", `Error: ${error}`, 3000);
          endLoader();
          console.error("Error:", error);
          console.error("Error:", xhr);
          console.error("Error:", status);
        },
      });
    }
  
    if (localStorage.getItem("backup_stroage") == 2) {
        url = backendUrl + "/api/google/getUserBackupDrive";
            sendData_bk(url);
    }
  }
  
  getGoogleUrlData_bk();
  