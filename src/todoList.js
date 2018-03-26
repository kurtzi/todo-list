const localStorage = window.localStorage;
const typeOfSorting = {Date: 'Date', Status: 'Status', Alphabetical: 'Alphabetical'};
const statusItem = {Done: "done", Open: "open"};
let savedTodoItems;

let getItemsFromLocalStorage = () => {

    savedTodoItems = JSON.parse(localStorage.getItem("todoItems"));

    if (!savedTodoItems) {
        let todoItems = {items: [], counter: 0, sortState: typeOfSorting.Date};
        localStorage.setItem("todoItems", JSON.stringify(todoItems));
        savedTodoItems = todoItems;
    }

    return savedTodoItems;
};

let saveStateToLocalStorage = (newItemToSave, sortOption, indexToInsert) => {

    savedTodoItems.sortState = sortOption;
    savedTodoItems.counter++;
    savedTodoItems.items.splice(indexToInsert, 0, newItemToSave);
    localStorage.setItem("todoItems", JSON.stringify(savedTodoItems));

};

function getIndexToInsert(sortType = 'Date', newItemToSave) {

    const comparisons = {
        Date: dateComparison,
        Alphabetical: stringComparision,
        Status: statusComparision
    };

    const compareFunc = comparisons[sortType];

    if (savedTodoItems.items[0] === undefined || compareFunc(newItemToSave, savedTodoItems.items[0]) < 0) {
        return 0;
    }

    for (let i = 0; i < savedTodoItems.items.length - 2; i++) {

        if (sortType !== typeOfSorting.Status) {
            if (compareFunc(savedTodoItems.items[i], newItemToSave) <= 0 && compareFunc(newItemToSave, savedTodoItems.items[i + 1]) <= 0) {
                return i + 1;
            }
        }
        else {
            if (compareFunc(savedTodoItems.items[i], savedTodoItems.items[i + 1]) < 0) {
                return i + 1;
            }
        }
    }

    return savedTodoItems.items.length;

}

function statusComparision(item1, item2) {

    return (item1.status === item2.status) ? 1 : -1;
}

function renderTodoItems() {

    savedTodoItems.items.forEach((todoItem) => {
        addElementToDOM(todoItem)
    });
}

function dateComparison(item1, item2) {

    let date1 = new Date(item1.date);
    let milliseconds1 = date1.getTime();

    let date2 = new Date(item2.date);
    let milliseconds2 = date2.getTime();

    return (milliseconds1 < milliseconds2) ? -1 : (milliseconds1 > milliseconds2) ? 1 : 0;
}

function sortByStatus() {

    let todoItems = savedTodoItems.items;

    let openTodoItems = todoItems.filter((todoItem) => {
        return todoItem.status !== statusItem.Done;
    });

    let doneTodoItems = todoItems.filter((todoItem) => {
        return todoItem.status !== statusItem.Open;
    });

    todoItems = openTodoItems.concat(doneTodoItems);

    setSortedItems(todoItems, typeOfSorting.Status);

    let listItems = document.getElementById("todo-list");
    listItems.innerHTML = ""; //drop all children

    todoItems.forEach((todoItem) => {
        addElementToDOM(todoItem);
    });
}

function sortTodoItems(sortType) {

    let todoItems = savedTodoItems.items;

    if (sortType === typeOfSorting.Date) {
        todoItems.sort(dateComparison);
    }

    if (sortType === typeOfSorting.Alphabetical) {
        todoItems.sort(stringComparision);
    }

    setSortedItems(todoItems, sortType);

    let listItems = document.getElementById("todo-list");
    listItems.innerHTML = ""; //drop all children

    todoItems.forEach((todoItem) => {
        addElementToDOM(todoItem);
    });
}

function setSortedItems(sortedItems, sortType) {

    savedTodoItems.items = sortedItems;
    savedTodoItems.sortState = sortType;
    localStorage.setItem("todoItems", JSON.stringify(savedTodoItems));
}

function stringComparision(item1, item2) {

    let textA = item1.description.toUpperCase();
    let textB = item2.description.toUpperCase();

    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;

}

function sortItems() {

    let sortType = document.querySelector('#sorting-options').value;

    if (sortType === typeOfSorting.Status) {
        sortByStatus();
    }
    else {
        sortTodoItems(sortType);
    }
}

function addItemToList(e) {

    if (e) {
        //Get the Unicode value of the pressed keyboard key
        //using which or keyCode depends on browser support
        let code = e.keyCode ? e.keyCode : e.which;
        const Enter = 13;

        if (code === Enter) {

            const itemDescription = document.getElementById("task-description").value;
            const sortOption = document.getElementById("sorting-options").value;
            let newItemToSave = {
                description: itemDescription,
                date: new Date(),
                status: 'open',
                id: savedTodoItems.counter
            };

            const isNew = true;
            let indexToInsert = getIndexToInsert(sortOption, newItemToSave);

            debugger;
            saveStateToLocalStorage(newItemToSave, sortOption, indexToInsert);
            addElementToDOM(newItemToSave, isNew, indexToInsert);
            clearTextInput();
        }
    }
}


function addElementToDOM(newItemToSave, isNew = false, indexToInsert) {


    let parent = document.querySelector('#todo-list');
    let child = createListElement(newItemToSave);

    if (parent.hasChildNodes() && isNew) {
        parent.insertBefore(child, parent.children[indexToInsert]);
    }
    else {
        parent.appendChild(child);
    }
}

function createTaskDate(taskDate) {

    taskDate = new Date(taskDate);

    let dd = taskDate.getDate();
    let mm = taskDate.getMonth() + 1; //January is 0!
    let yyyy = taskDate.getFullYear();


    if (dd < 10) {
        dd = `0${dd}`;
    }

    if (mm < 10) {
        mm = `0${mm}`;
    }

    taskDate = `${mm} / ${dd} / ${yyyy}`;

    let taskDateText = document.createElement("span");
    taskDateText.innerHTML = taskDate;
    taskDateText.className = "task-date";

    return taskDateText;
}

function clearTextInput() {
    document.getElementById("task-description").value = "";
}

function createListElement(todoItem) {

    let listItem = document.createElement("li");
    listItem.className = "list-element";
    listItem.id = todoItem.id;

    let deleteBtn = createDeleteButton(todoItem.id);
    let doneCheckbox = createDoneCheckbox(todoItem);
    let descriptionTaskText = createTaskDescription(todoItem.description);
    let taskDate = createTaskDate(todoItem.date);

    listItem.appendChild(doneCheckbox);
    listItem.appendChild(descriptionTaskText);
    listItem.appendChild(deleteBtn);
    listItem.appendChild(taskDate);

    return listItem;
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

function removeItemFromLocalStorage(idToDelete) {

    let todoItems = savedTodoItems;

    todoItems.items = todoItems.items.filter((savedTodoItem) => {
        return savedTodoItem.id !== idToDelete
    });

    localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

function removeItemFromDOM(idToDelete) {
    let parent = document.getElementById("todo-list");
    let child = document.getElementById(idToDelete);

    parent.removeChild(child);
}

function createTaskDescription(taskDescription) {
    let taskDescriptionParagraph = document.createElement("span");
    taskDescriptionParagraph.innerHTML = taskDescription;
    taskDescriptionParagraph.className = "task-description";

    return taskDescriptionParagraph;
}

function createDoneCheckbox(todoItem) {
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = "checkbox-done";

    if (todoItem.status === "done") {
        checkbox.checked = true;
    }

    checkbox.onchange = () => {
        changeTodoStatusOnLocalStorage(todoItem);
        if (savedTodoItems.sortState === typeOfSorting.Status) {
            sortByStatus();
        }
    };

    return checkbox;
}

function changeTodoStatusOnLocalStorage(todoItem) {

    let todoItems = savedTodoItems;

    for (let i = 0; i < todoItems.items.length; i++) {

        let currTodoItem = todoItems.items[i];

        //found relevant list item to update
        if (currTodoItem.id === todoItem.id) {
            if (currTodoItem.status === "open") {
                currTodoItem.status = "done";
            }
            else {
                currTodoItem.status = "open";
            }

            todoItems.items[i] = currTodoItem;

            break; //found relevant record
        }
    }

    localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

function setDropdownSelection() {
    document.querySelector('#sorting-options').value = savedTodoItems.sortState;
}

getItemsFromLocalStorage();
setDropdownSelection();
renderTodoItems();

//event handlers
document.querySelector('#task-description').addEventListener('keypress', addItemToList);
document.querySelector('#sorting-options').addEventListener('change', sortItems);