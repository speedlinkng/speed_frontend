function drag(){
    let sortAll = document.querySelectorAll('.use_drag'); 
    sortAll.forEach(container => {
        let items = container.querySelectorAll('.item'); // Find the '.item' elements within each container
    
        items.forEach(item => {
            item.setAttribute('draggable', true); // Ensure the item is draggable
    
            item.addEventListener("dragstart", () => {
                setTimeout(function () {
                    item.classList.add("dragging");
                    item.classList.add("hoverDash");
                }, 0);
            });
    
            item.addEventListener("dragend", () => {
                item.classList.remove("hoverDash");
                item.classList.remove("dragging");
            });
        });
    
        let initSortable = (e) => {
            e.preventDefault();
            let draggingItem = container.querySelector(".dragging");
    
            // If draggingItem is null, stop execution
            if (!draggingItem) {
                console.error("No item is being dragged!");
                return;
            }
    
            let siblings = [...container.querySelectorAll(".item:not(.dragging)")];
            let mouseY = e.clientY;
    
            let nextSibling = siblings.find(sibling => {
                let rect = sibling.getBoundingClientRect();
                let offset = 12;
                let direction = mouseY > rect.top + rect.height / 2 ? 1 : -1;
                let siblingTriggerY = rect.top + rect.height / 2 + direction * offset;
                return mouseY <= siblingTriggerY;
            });
    
            // Only attempt to append or insert if draggingItem is valid
            if (nextSibling === undefined) {
                container.appendChild(draggingItem); // Append to the end if no next sibling found
            } else {
                container.insertBefore(draggingItem, nextSibling);
            }
        };
    
        container.addEventListener("dragover", initSortable);
        container.addEventListener("dragenter", e => e.preventDefault());
    });
    
    
}
setTimeout(()=>{
    drag()
},5000)


