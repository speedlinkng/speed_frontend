function getGoogleUrlData() {
  var url = "";
  var url_params = new URLSearchParams(window.location.search);
 

  async function sendData(urll) {

    // open uploader
    $(".app-preloader").show();
    if (parseInt(localStorage.getItem("temp_newstore")) != 2) {
      const myRequestButton_ = document.getElementById("_Dashboard");
      myRequestButton_.click();
    }
    let scope = url_params.get("scope");
    let code = url_params.get("code");
    let prompt = url_params.get("prompt");
    let authuser = url_params.get("authuser");

    let body = {
      scope: scope,
      code: code,
      prompt: prompt,
      authuser: authuser,
    };
    console.log(body)
    console.log('ACCESS', localStorage.getItem("access"))
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

        if (res.error == 1) {
        } else if (res.error == 2) {
          window.location.href = `${baseUrl}/auth`;
        } else if (res.success == 1) {

          // Done set these if its the admin changing his default drive
          // --------------------------------
          if (parseInt(localStorage.getItem("temp_newstore")) != 2) {
            localStorage.setItem("my_goog_acc", res.token); // google access token for users second time
            endLoader();
            setActiveItem("Create");
            $(`#cancel_stroage_selec_modal`).trigger("click");
          }
        } else {
        }
        // localStorage.setItem("preferred", 0);
        localStorage.setItem("temp_newstore", 0);
      },
      error: function (xhr, status, error) {
        showNoti("error", `Error: ${error}`, 3000);
        endLoader();
        console.error("Error:", error);
        console.error("Error:", xhr);
        console.error("Error:", status);
        localStorage.setItem("preferred", 0);
        localStorage.setItem("temp_newstore", 0);
      },
    });
  }

  if (localStorage.getItem("temp_newstore") == 1) {
    url = backendUrl + "/api/google/newstorage";
    if (localStorage.getItem("preferred") == 1) {
      sendData(url);
    }
  } else if (localStorage.getItem("temp_newstore") == 2) {
    url = backendUrl + "/api/google/changeDriveMail";
    sendData(url);
  } else {
    url = "";
  }
}

getGoogleUrlData();
