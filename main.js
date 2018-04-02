const sortDropdown = document.getElementById("sortBy");
sortDropdown.addEventListener("change", sortOnChange);
document.getElementById('taskInput').addEventListener("keydown",addListElement);
let storage = {items:[], idCount:0, sortBy:"date"};

function start() {
    if(localStorage.getItem("storage") === null){
        updateLocalStorage();
    }
    else{
        storage = JSON.parse(localStorage.getItem("storage"));
        sortDropdown.value = storage.sortBy;
        let newItems = sortItems(storage.items, storage.sortBy); // not sure if needed
        newItems.forEach((item, i) => {
            itemToUl(newItems[i],i);

        })
        // for(let i = 0; i<newItems.length; i++){
        //     itemToUl(newItems[i],i);
        // }
    }
}

function addListElement(e){
    console.log("adding");
    const enterKey = 13;
    if(document.getElementById('taskInput').value !== "" && e.keyCode === enterKey) {

        let taskDescription = document.getElementById('taskInput').value;
        document.getElementById('taskInput').value = "";
        let today = new Date();
        let newTask={"task":taskDescription, "date":today, "checkBox":false, "id":storage.idCount};
        let insertIndex = indexToInsert(newTask, storage.sortBy);
        console.log(insertIndex);
        storage.idCount++;
        storage.items.splice(insertIndex,0, newTask);

        updateLocalStorage();

        itemToUl(newTask,insertIndex)
    }
}

function sortItems(items, sortType){
    if (sortType === "alphabetical order") {
        items = sortAlphabetically(items)
    }
    else if (sortType === "done"){
        items = sortByDone(items);
    }
    else{      //sorting by date, defult
      items = sortByDate(items);
    }
    return(items);
}

function changeCheckbox(li, newTask) {
    const ul = document.getElementById("tasks");
    for(let i=0;i<storage.items.length;i++){
        if (storage.items[i].id === parseInt(li.id)){
            storage.items[i].checkBox = !storage.items[i].checkBox;
            if(storage.sortBy === "done"){
                remove(li);
                let insertIndex = indexToInsert(newTask, "done");
                storage.items.splice(insertIndex,0, newTask);
                itemToUl(newTask,insertIndex);
                break;
            }
        }
    }
    updateLocalStorage();
}

function remove(li){
    const ul = document.getElementById("tasks");
    for(let i=0;i<storage.items.length;i++){
        if (storage.items[i].id === parseInt(li.id)){
           storage.items.splice(i,1);
        }
    }
    updateLocalStorage();
    ul.removeChild(li);
}
function displayDate(today) {
    today = new Date(Date.parse(today));
    let dd = today.getDay()+1;
    let mm = today.getMonth()+1; //January is 0
    let yyyy = today.getFullYear();
    if(dd<10) dd = '0'+dd;
    if(mm<10) mm = '0'+mm;
    return(dd + '/' + mm+ '/' + yyyy);

}

function itemToUl(item, index){
    const ul = document.getElementById("tasks");
    let li = document.createElement("li");
    li.innerHTML = `<span>${item.task}</span><span> ${displayDate(item.date)}</span><input type = "checkbox" ${item.checkBox ? "checked":""}><button> Delete Task</button>`;
    li.setAttribute("id", item.id);
    li.querySelector("input").addEventListener("change",function (){changeCheckbox(li, item)});
    li.querySelector("button").addEventListener("click",function (){remove(li)});
    ul.insertBefore(li,ul.childNodes[index]);
}

function sortOnChange() {
    const sortType = sortDropdown.value;
    storage.sortBy = sortType;
    let sortedItems = sortItems(storage.items, sortType);
    storage.items = sortedItems;
    updateLocalStorage();
    document.getElementById("tasks").innerHTML = "";
    for(let i = 0; i<sortedItems.length; i++){
        itemToUl(sortedItems[i],i);
    }
}

function indexToInsert(newTask,sortBy) {
    let items = storage.items;
    if (sortBy === "date"){
        return items.length;
    }
    else {
        for(let i =0; i<items.length; i++){
            if (sortBy === "alphabetical order" && newTask.task.toUpperCase() < items[i].task.toUpperCase()){
                    return i;
            }
            else if (sortBy === "done" && newTask.checkBox > items[i].checkBox){
                    return i
            }
        }
        return items.length;
    }


}
function sortAlphabetically(items) {
    items.sort(function(a, b) {
        let taskA = a.task.toUpperCase(); // ignore upper and lowercase
        let taskB = b.task.toUpperCase(); // ignore upper and lowercase
        if (taskA < taskB) {
            return -1;
        }
        if (taskA > taskB) {
            return 1;
        }
        return 0;
    });
    return items
}

function sortByDone(items) {
    items.sort(function(a, b) {
        let doneA = a.checkBox;
        let doneB = b.checkBox;
        if (doneA > doneB) {
            return -1;
        }
        if (doneA < doneB) {
            return 1;
        }
        return 0;
    });
    return items;
}

function sortByDate(items) {
    items.sort(function(a, b) {
        let dateA = new Date(Date.parse(a.date));
        let dateB = new Date(Date.parse(b.date));
        if (dateA < dateB) {
            return -1;
        }
        if (dateA > dateB) {
            return 1;
        }
        return 0;
    });
    return items;
}

function updateLocalStorage() {
    localStorage.setItem("storage",JSON.stringify(storage));
}
start();
