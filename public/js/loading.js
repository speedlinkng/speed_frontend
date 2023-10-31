
function start_loading(myButton){
    // Change the text to "Loading..." with animated dots
    myButton.innerHTML = 'Loading<span class="loading-dots"></span>';
    myButton.classList.add('disabled:pointer-events-none', 'disabled:select-none', 'disabled:opacity-60');
    myButton.disabled = true;
}

function end_loading(myButton){
    myButton.classList.remove('disabled:pointer-events-none', 'disabled:select-none', 'disabled:opacity-60');
    myButton.disabled = false; // Re-enable the button (whether the fetch succeeds or fails)
    myButton.innerHTML = 'Sign In';
}