
  let tokenClient;
  let accessToken = null;

  let pickerInited = false;
  let gisInited = false;

  // Replace with your client ID and scopes
  const clientId = '74500727848-c69s6kfbg7lrplkteia00ne0nurvnurp.apps.googleusercontent.com';
  const scopes ='https://www.googleapis.com/auth/drive';
  const APP_ID = '74500727848';

  // Load Google APIs
  function onApiLoad() {
    gapi.load('picker', onPickerApiLoad);
    gapi.load('client:auth2', gisLoaded);
  }

  // Initialize Google Picker
  function onPickerApiLoad() {
    pickerInited = true;
  }

  // Initialize Google Sign-In
  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: scopes,
      callback: '' // defined later
    });
    gisInited = true;
  }

  // Create and render Google Picker
  function createPicker() {
    if (!pickerInited || !gisInited) {
      console.error('Google Picker or Sign-In not initialized.');
      return;
    }

    const docsView = new google.picker.DocsView()
    .setIncludeFolders(true) 
    // .setOwnedByMe(true)
    .setMimeTypes('application/vnd.google-apps.folder')
    .setSelectFolderEnabled(true);

    const showPicker = () => {
      const picker = new google.picker.PickerBuilder()
        // .addView(google.picker.ViewId.FOLDERS)
        .addView(docsView)
        .setOAuthToken(accessToken)
        .setTitle('Selct a folder to use for the upload')
        .setDeveloperKey('AIzaSyBlCqsTME0plFSDfQ1aVG3pj-oCqVEiMmE') // Replace with your API key
        .setCallback(pickerCallback)
        .setAppId(APP_ID)
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .build();
      picker.setVisible(true);
    };


    // check if user is using his own or speedlinks drive 
    // then set the correct access token
    if(localStorage.getItem('preferred') == 1){
      accessToken = localStorage.getItem('my_goog_acc');
    }else{
      accessToken = null;
      // show notification message
      showNoti('error', `You are using speedlink's default drive`, 5000)
      return;
    }

    // Check if accessToken is already set
    if (accessToken !== null) { 
      showPicker(); // Call showPicker directly since we already have the access token
    } else {
    
    // Request access token
    tokenClient.callback = async (response) => {
      if (response.error !== undefined) {
        throw response;
      }
      accessToken = response.access_token;
      console.log(accessToken)
      showPicker();
    };
      
    // Prompt the user to select an account and grant consent
    tokenClient.requestAccessToken({ prompt: 'consent' });
    }

  }

  // Handle Google Picker callback
  function pickerCallback(data) {
    if (data.action === google.picker.Action.PICKED) {
      const folderId = data.docs[0].id;
      const folderIdName = data.docs[0].name;
      // console.log('Selected folder ID:', folderId);
      // console.log('Selected folder Name:', folderIdName);
      let fold = document.querySelector('#chosen_folder_idd')
      let folderName = document.querySelector('#chosen_folder')
      fold.value = folderId
      folderName.value = folderIdName  
    }
  }
