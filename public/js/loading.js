

function start_loading(myButton){
    // Change the text to "Loading..." with animated dots
    myButton.innerHTML = 'Loading<span class="loading-dots"></span>';
    myButton.classList.add('disabled:pointer-events-none', 'disabled:select-none', 'disabled:opacity-60');
    myButton.disabled = true;
}

function end_loading(myButton, name){
    myButton.classList.remove('disabled:pointer-events-none', 'disabled:select-none', 'disabled:opacity-60');
    myButton.disabled = false; // Re-enable the button (whether the fetch succeeds or fails)
    myButton.innerHTML = name;
}
 function startLoader(){
    alert('start')
    $('#root').append(`
    <div id="startloader" @click="showModalLoading = true"></div>
    `)
    setTimeout(function(){
        let startLoader = document.querySelector('#startloader')
        console.log(startLoader)
        startLoader.click();
        $('#startloader').remove();
    },500)

 }
 function endLoader(){
    $('#root').append(`
    <div id="endloader" @click="showModalLoading = false"></div>
    `)
    setTimeout(function(){
        let endLoader = document.querySelector('#endloader')
        endLoader.click();
        $('#endloader').remove();
        $('#startloader').remove();
    },500)
 }
