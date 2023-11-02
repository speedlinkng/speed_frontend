
  /* exported gapiLoaded */
  /* exported gisLoaded */
  /* exported handleAuthClick */
  /* exported handleSignoutClick */

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

  // TODO(developer): Set to client ID and API key from the Developer Console
  const CLIENT_ID = '74500727848-c69s6kfbg7lrplkteia00ne0nurvnurp.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyBlCqsTME0plFSDfQ1aVG3pj-oCqVEiMmE';

  // TODO(developer): Replace with your own project number from console.developers.google.com.
  const APP_ID = '<YOUR_APP_ID>';

  let tokenClient;
  let accessToken = null;
  let pickerInited = false;
  let gisInited = false;


  // document.getElementById('authorize_button').style.visibility = 'hidden';
  // document.getElementById('signout_button').style.visibility = 'hidden';

  /**
   * Callback after api.js is loaded.
   */
  function gapiLoaded() {
    gapi.load('client:picker', initializePicker);
  }

  /**
   * Callback after the API client is loaded. Loads the
   * discovery doc to initialize the API.
   */
  async function initializePicker() {
    await gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');
    pickerInited = true;
    maybeEnableButtons();
  }

  /**
   * Callback after Google Identity Services are loaded.
   */
  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
  }

  /**
   * Enables user interaction after all libraries are loaded.
   */
  function maybeEnableButtons() {
    if (pickerInited && gisInited) {
      // document.getElementById('authorize_button').style.visibility = 'visible';
    }
  }

  /**
   *  Sign in the user upon button click.
   */
  function handleAuthClick() {

    tokenClient.callback = async (response) => {
      if (response.error !== undefined) {
        throw (response);
      }
   
      accessToken = response.access_token;
      localStorage.setItem('ac', response.access_token)
      // document.getElementById('signout_button').style.visibility = 'visible';
      // document.getElementById('authorize_button').innerText = 'Refresh';
      await createPicker();
    };

    if (accessToken === null) {
      
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
     
      tokenClient.requestAccessToken({prompt: ''});
    }
  }

  /**
   *  Sign out the user upon button click.
   */
  function handleSignoutClick() {
    
    if (accessToken) {
      accessToken = null;
      google.accounts.oauth2.revoke(accessToken);
      document.getElementById('content').innerText = '';
      // document.getElementById('authorize_button').innerText = 'Authorize';
      // document.getElementById('signout_button').style.visibility = 'hidden';
    }
  }

  /**
   *  Create and render a Picker object for searching images.
   */
  function createPicker() {
    const view = new google.picker.View(google.picker.ViewId.FOLDERS);
    // view.setMimeTypes('application/vnd.google-apps.folder');
    
    const docsView = new google.picker.DocsView()
          .setIncludeFolders(true) 
        //   .setOwnedByMe(true)
          .setMimeTypes('application/vnd.google-apps.folder')
          .setSelectFolderEnabled(true);
        //   .setParent('root');

    const picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        // .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setDeveloperKey(API_KEY)
        .setAppId(APP_ID)
        .setOAuthToken(accessToken)
        .setTitle('Selct a folder to use for the upload')
        // .addView(view)
        // .addView(google.picker.ViewId.FOLDERS)
        // .addView(new google.picker.DocsUploadView())
        .addView(docsView)
        .setCallback(pickerCallback)
        .build();
    picker.setVisible(true);
  }

  /**
   * Displays the file details of the user's selection.
   * @param {object} data - Containers the user selection from the picker
   */
  async function pickerCallback(data) {
    if (data.action === google.picker.Action.PICKED) {
      let text = `Picker response: \n${JSON.stringify(data, null, 2)}\n`;
      const document = data[google.picker.Response.DOCUMENTS][0];
      console.log(document.name)
      console.log(document.embedUrl)
      console.log(document.id)
      console.log('<<<<<<<<<dpcument>>>>>>>>>')
      const fileId = document[google.picker.Document.ID];
      localStorage.setItem('folderId', fileId);
      console.log(fileId)
      window.document.getElementById('file_res').innerText = fileId
      const res = await gapi.client.drive.files.get({
        'fileId': fileId,
        'fields': '*',
      });
      text += `Drive API response for first document: \n${JSON.stringify(res.result, null, 2)}\n`;

      // REPLACE FOLDER NAME FROM SPEEDLINK

      $('#create_folder').val(res.result.name)
      $('#file_res').val(fileId)
  //  console.log(text)
  //  console.log(res.result.name)
  //  console.log(res.result.kind)
      // /window.document.getElementById('file_res').innerText = text;
    }
  }
