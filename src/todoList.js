/*
1. Have a list of tasks, sorted by add time.
2. At the end of the task list, add input box that accepts new task by ‘Enter’ key. Adding a new task should put the task at the end of the list and the input box should still appear after the whole list.
3. Each task should have a checkbox to indicate it’s status (done/open).
4. Ability to delete task.
5. Ability to sort by date, done/not done, alphabetical order.
6. Persistency: upon refresh, task list should appear.
7. CSS - design however you like
*/

const localStorage = window.localStorage;

let savedTodoItems ;

let itemsSavedOnLocalStorage = ()=>{

    let todoItems = {items: [] , counter: 0};
    savedTodoItems = localStorage.getItem("todoItems");

    if (!savedTodoItems){
        localStorage.setItem("todoItems", JSON.stringify(todoItems) );
        savedTodoItems = todoItems;
    }

    return savedTodoItems;
};

function renderTodoItems(){

    let todoItems = itemsSavedOnLocalStorage();
    todoItems = JSON.parse(todoItems);

    if (todoItems.items){
        todoItems.items.forEach((todoItem)=>{
            addElementToDOM(todoItem);
        });
    }
}

function filterByDate(){

    let savedTodoItems = localStorage.getItem("todoItems");
    let filteredDateItems = JSON.parse(savedTodoItems).items;
    filteredDateItems.sort(dateComparison);

    let mainDiv = document.getElementById("checkboxes-lst");
    mainDiv.innerHTML = ""; //drop all children

    filteredDateItems.forEach((todoItem)=>{
        addElementToDOM(todoItem);
    });
}

function dateComparison (item1, item2){
    let date1 = new Date(item1.date);
    let milliseconds1 = date1.getTime();

    let date2 = new Date(item2.date);
    let milliseconds2 = date2.getTime();

    return milliseconds2 - milliseconds1;
}

function filterByStatus() {

}


function filterAlphabeticalOrder(){

}

function removeFilters(){

}

function removeListItems(){

}


function setItemsToLocalStorage(itemsToSave){
    localStorage.setItem("todoItems", JSON.stringify(itemsToSave) );
}

function addElementToDOM(todoItem){

    let mainDiv = document.getElementById("checkboxes-lst");
    let listElement = createListElement(todoItem);
    mainDiv.appendChild(listElement);
}

function addTodoItemToLocalStorage(){

    let itemDescription = document.getElementById("task-description").value;
    let savedTodoItems = localStorage.getItem("todoItems");
    savedTodoItems = JSON.parse(savedTodoItems);

    let itemId = savedTodoItems.counter + 1;

    let newTodoItem = {description: itemDescription, date: new Date(), status: 'open' , id: itemId};

    savedTodoItems.items.push(newTodoItem);
    savedTodoItems.counter=  savedTodoItems.counter + 1;

    setItemsToLocalStorage(savedTodoItems);
    addElementToDOM(newTodoItem);
    clearTextInput();
}

function createTaskDate(taskDate){

    taskDate = new Date(taskDate);

    let dd = taskDate.getDate();
    let mm = taskDate.getMonth()+1; //January is 0!
    let yyyy = taskDate.getFullYear();

    if(dd < 10) {
        dd = `0${dd}`;
    }

    if(mm < 10) {
        mm = `0${mm}`;
    }

    taskDate = `${mm} / ${dd} / ${yyyy}`;

    let taskDateText = document.createElement("span");
    taskDateText.innerHTML = taskDate;
    taskDateText.className = "task-date";

    return taskDateText;
}

function clearTextInput(){
    document.getElementById("task-description").value = "";
}

function createListElement(todoItem){
    let listElemDiv = document.createElement("div");
    listElemDiv.className = "list-element";
    listElemDiv.id = todoItem.id;

    let deleteBtn = createDeleteButton(todoItem.id);
    let doneCheckbox = createDoneCheckbox(todoItem);
    let descriptionTaskText = createTaskDescription(todoItem.description);
    let taskDate = createTaskDate(todoItem.date);

    listElemDiv.appendChild(doneCheckbox);
    listElemDiv.appendChild(descriptionTaskText);
    listElemDiv.appendChild(deleteBtn);
    listElemDiv.appendChild(taskDate);

    return listElemDiv;
}

function createDeleteButton(idToDelete) {
    let deleteBtn = document.createElement("input");
    deleteBtn.type = "button";
    deleteBtn.value = "X";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => {
        removeItemFromDOM(idToDelete);
        removeItemFromLocalStorage(idToDelete);
    };

    return deleteBtn;
}

function removeItemFromLocalStorage(idToDelete){
    savedTodoItems = localStorage.getItem("todoItems");
    let todoItems = JSON.parse(savedTodoItems);
    todoItems.items = todoItems.items.filter((savedTodoItem)=> {
        return savedTodoItem.id !== idToDelete
    });

    localStorage.setItem("todoItems", JSON.stringify(todoItems) );
}

function removeItemFromDOM(idToDelete) {
    let parent = document.getElementById("checkboxes-lst");
    let child = document.getElementById(idToDelete);

    parent.removeChild(child);
}

function createTaskDescription(taskDescription) {
    let taskDescriptionParagraph = document.createElement("span");
    taskDescriptionParagraph.innerHTML = taskDescription;
    taskDescriptionParagraph.className = "task-description";

    return taskDescriptionParagraph;
}

function createDoneCheckbox(todoItem){
    let checkbox = document.createElement('input');
    checkbox.type= 'checkbox';
    checkbox.className = "checkbox-done";

    if (todoItem.status === "done"){
        checkbox.checked = true;
    }

    checkbox.onchange = ()=>{
        changeTodoStatusOnLocalStorage(todoItem);
    };

    return checkbox;
}

function changeTodoStatusOnLocalStorage(todoItem){

    savedTodoItems = localStorage.getItem("todoItems");
    let todoItems = JSON.parse(savedTodoItems);

    for(let i =0 ; i < todoItems.items.length; i++){

        let currTodoItem = todoItems.items[i];

        //found relevant list item to update
        if (currTodoItem.id === todoItem.id){
            if (currTodoItem.status === "open"){
                currTodoItem.status = "done";
            }
            else{
                currTodoItem.status = "open";
            }

            todoItems.items[i] = currTodoItem;

            break; //found relevant record
        }
    }

    localStorage.setItem("todoItems", JSON.stringify(todoItems) );

}

//TODO: submit message
function createSubmitMessage(status){

}