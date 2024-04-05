function drag(){

   const sortAll = document.querySelector('.showResult_')
   const items = sortAll.querySelectorAll('.item')
   console.log(items)
   console.log('sortAll', sortAll)
    items.forEach(item => {
        item.addEventListener("dragstart", ()=>{
            setTimeout(function(){
                item.classList.add("dragging")
                item.classList.add("hoverDash");
            },0) 
        })

        item.addEventListener("dragend", ()=>{
            item.classList.remove("hoverDash");
            item.classList.remove("dragging")
        })
    })
    const initSortable = (e) => {
        e.preventDefault();
        const draggingItem = sortAll.querySelector(".dragging");
        const siblings = [...sortAll.querySelectorAll(".item:not(.dragging)")];

        const mouseY = e.clientY;

        let nextSibling = siblings.find(sibling => {
            const rect = sibling.getBoundingClientRect();
            const offset = 12; // Adjust this value to control the trigger point
           // Check if dragging upwards or downwards
            const direction = mouseY > rect.top + rect.height / 2 ? 1 : -1;

            // Calculate trigger point based on direction
            const siblingTriggerY = rect.top + rect.height / 2 + direction * offset;

            // Trigger move when halfway into the next sibling regardless of direction
            return mouseY <= siblingTriggerY;
        });

        if (nextSibling === undefined) {
            sortAll.appendChild(draggingItem); // Append to the end if no next sibling found
        } else {
            sortAll.insertBefore(draggingItem, nextSibling);
        }
        console.log(nextSibling);
    };




    sortAll.addEventListener("dragover", initSortable);
    sortAll.addEventListener("dragenter", e => e.preventDefault());
}
setTimeout(()=>{
    drag()
},5000)
