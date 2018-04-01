const dropdown = document.querySelector("select");
dropdown.addEventListener("change", sortOnChange);
document.getElementById('taskInput').addEventListener("keydown",insert);
let storage = {};

if(localStorage.getItem("storage") === null){
    localStorage.setItem("storage", JSON.stringify({items:[], idCount:0, sortBy:"date"}));
    storage = JSON.parse(localStorage.getItem("storage"));
}
else{
    storage = JSON.parse(localStorage.getItem("storage"));
    dropdown.value = storage.sortBy;
    let newItems = sort(storage.items, storage.sortBy);
    for(let i = 0; i<newItems.length; i++){
        itemToUl(newItems[i],0);
    }
}

function insert(e){
    if(document.getElementById('taskInput').value !== "" && e.keyCode === 13) {
        let task = document.getElementById('taskInput').value;
        document.getElementById('taskInput').value = "";
        let today = new Date();
        let newTask={"task":task, "date":today, "checkBox":false, "id":storage.idCount};
        storage.idCount++;
        storage.items.push(newTask);
        localStorage.setItem("storage",JSON.stringify(storage));
        let sortedItems = sort(storage.items,storage.sortBy );
        for(let i=0;i<sortedItems.length;i++){
            if (sortedItems[i].id === newTask.id){
                itemToUl(newTask,i)
            }
        }
    }
}

function sort(items, sortType){
    if (sortType === "alphabetical order") {
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
    }

    else if (sort === "done"){
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
    }
    else{      //sorting by date, defult
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
    }
    return(items);
}

function changeCheckbox(id) {
    for(let i=0;i<storage.items.length;i++){
        if (storage.items[i].id === id){
            storage.items[i].checkBox = !storage.items[i].checkBox;
        }
    }
    localStorage.setItem("storage",JSON.stringify(storage));
}

function remove(li){
    const ul = document.getElementById("tasks");
    for(let i=0;i<storage.items.length;i++){
        if (storage.items[i].id === parseInt(li.id)){
           storage.items.splice(i,1);
        }
    }
    localStorage.setItem("storage",JSON.stringify(storage));
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
    li.querySelector("input").addEventListener("change",function (){changeCheckbox(item.id)});
    li.querySelector("button").addEventListener("click",function (){remove(li)});
    if(index === 0){
        ul.appendChild(li);
    }
    else{
        ul.insertBefore(li,ul.childNodes[index]);
    }
}

function sortOnChange() {
    const sortType = dropdown.value;
    storage.sortBy = sortType;
    localStorage.setItem("storage", JSON.stringify(storage));
    let sortedItems = sort(storage.items, sortType);
    document.getElementById("tasks").innerHTML = "";
    for(let i = 0; i<sortedItems.length; i++){
        itemToUl(sortedItems[i],0);
    }
}