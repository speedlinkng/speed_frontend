
const baseUrl = `${window.location.protocol}//${window.location.host}`;
    alert('1 is', baseUrl)
    // const backendUrl = `https://speedbankend-production.up.railway.app`;
    // const backendUrl = `https://bapi.blazzingshare.com`
    // const backendUrl_ = `https://speedbankend-production.up.railway.app`; 
    window.bkupfile = 0 
    const allArray = { 
      values: {},
      preferred: localStorage.getItem('preferred'),
      b_token: localStorage.getItem('b_token')
    };
   let allArrayEdit = { 
        values: {},
        preferred: localStorage.getItem('preferred'),
        b_token: localStorage.getItem('b_token')
    };
    var editFormRecordId;
    var addPage = 0;
    var RecordDataDashboard = [];
  

    async function start(){
        var w2 = {};
        w2.includeHTML = function(cb) {
            var elements = document.querySelectorAll('[w2-include-html]');
          
            elements.forEach(function(element) {
              var file = element.getAttribute('w2-include-html');
          
              if (file) {
                console.log(file)
                fetch(file)
                  .then(function(response) {
                    if (response.status === 200) {
                      return response.text();
                    } else {
                      throw new Error('Page not found');
                    }
                  })
                  .then(function(content) {
                   

                    element.insertAdjacentHTML('afterbegin', content);
                    element.removeAttribute('w2-include-html');

                    // Create a new script element for each match and append it to execute the JavaScript code
                    var scriptMatches = content.match(/<script src="([^"]+)"><\/script>/g);
                    if (scriptMatches) {
                        console.log('matched')
                        scriptMatches.forEach(function(scriptMatch) {
                            const scriptElement = document.createElement('script');
                            const srcAttribute = scriptMatch.match(/src="([^"]+)"/)[1];
                            scriptElement.src = srcAttribute;
                            document.body.appendChild(scriptElement);
                        });
                    }

                    w3.includeHTML(cb);
                  })
                  .catch(function(error) {
                    element.innerHTML = error.message;
                    element.removeAttribute('w2-include-html');
                    w2.includeHTML(cb);
                  });
              }
            });
          
            if (cb) cb();
          };
          w2.includeHTML()
          
    }
    start()