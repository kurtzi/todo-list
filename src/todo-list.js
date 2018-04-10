let allTasks = [];
let isEditBoxVis = false;
let globalId;
let idToFind;
let todoList;

function addEntry() {
    const newEntry = document.querySelector("#inputBox").value;
    if (newEntry) {
        document.querySelector("#inputBox").value = '';
        const newId = getId();
        const newItem = {text: newEntry, time: new Date(), isDone: false, id: newId};
        allTasks.push(newItem);
        sortList();
        todoList.insertBefore(createNode(newItem), todoList.childNodes[getIndexNumber(newId)]);
        saveDataLocally();
    }
    else {
        alert('Please enter something, surely you got SOMETHING to do')
    }
}

function getSavedList() {
    const savedList = JSON.parse(localStorage.getItem("entriesList"));
    const sortNum = localStorage.getItem("sorting");
    globalId = localStorage.getItem("globalId") || 5000;
    if (savedList) {
        allTasks = savedList.map(item => ({text: item.text, time: new Date(item.time), isDone: item.isDone, id: item.id}));
        updateList();
        document.querySelector('#sortBox').value = Number(sortNum);
    }
}

function getId() {
    return globalId++
}

function updateList() {
    todoList.innerHTML = '';
    allTasks.forEach(item => {
        todoList.appendChild(createNode(item));
    });
}

function createNode(item) {
    let node = document.createElement("li");
    node.id = "contBox" + item.id;
    let checked = '';
    if (item.isDone) {
        checked = 'checked';
    }
    const curDis = isEditBoxVis ? "inline-block" : "none";
    node.innerHTML = `<div class="editBox" style="display: ${curDis}"><i class="fa fa-close" id="delBtn${item.id}"></i><i class="fa fa-pencil" id="editBtn${item.id}"></i></div><input type="checkbox" id="isDone${item.id}" ${checked}>${item['text']}`;
    node.querySelector(`#isDone${item.id}`).addEventListener("click", function () { changeIsDone(`${item.id}`)});
    node.querySelector(`i.fa-pencil`).addEventListener("click", function () { editEntry(`${item.id}`)});
    node.querySelector(`i.fa-close`).addEventListener("click", function () { removeEntry(`${item.id}`)});
    return node;
}

function toggleEdit() {
    if (isEditBoxVis) {
        document.querySelectorAll('div.editBox').forEach(item => item.style.display =  "none");
        document.querySelector('#editBtn').innerText = 'Edit/Remove';
        isEditBoxVis = false;
    }
    else {
        document.querySelectorAll('div.editBox').forEach(item => item.style.display = "inline-block");
        document.querySelector('#editBtn').innerText = 'Done';
        isEditBoxVis = true;
    }
}

function compareId(e) {
    return Number(e.id) === Number(idToFind);
}

function getIndexNumber(id) {
    idToFind = id;
    return allTasks.findIndex(compareId);
}

function changeIsDone(d) {
    const entryIndex = getIndexNumber(d);
    allTasks[entryIndex].isDone = document.querySelector(`#isDone${d}`).checked;
    sortList();
    updateList();
    saveDataLocally();
}

function saveDataLocally() {
    try {
        localStorage.setItem("entriesList", JSON.stringify(allTasks));
        localStorage.setItem("sorting", document.querySelector('#sortBox').value);
        localStorage.setItem("globalId", globalId)
    }
    catch (err) {
        console.error(err);
    }
}

function removeEntry(index) {
    if (confirm("Are you sure?")) {
        const element = document.querySelector(`#contBox${index}`);
        element.parentNode.removeChild(element);
        allTasks.splice(getIndexNumber(index), 1);
        saveDataLocally();
    }
}

function editEntry(id) {
    const index = getIndexNumber(id);
    const editedText = prompt("Please edit the entry:", allTasks[index].text);
    if (editedText !== null && editedText !== allTasks[index].text) {
        allTasks[index].text = editedText;
        let curBox = document.querySelector("#contBox" + id);
        curBox.childNodes[2].data = editedText;
        const selection = Number(document.querySelector('#sortBox').value);
        if (selection === 4 || selection === 5 ) {
            const editedEntry = allTasks[index];
            curBox.parentNode.removeChild(curBox);
            sortList();
            todoList.insertBefore(createNode(editedEntry), todoList.childNodes[getIndexNumber(id)]);
        }
        saveDataLocally();
    }
}

function sortList() {
    const selection = Number(document.querySelector('#sortBox').value);
    if (selection === 0) {
        allTasks.sort(function (a, b) {
            return a.time < b.time ? -1 : a.time > b.time ? 1 : 0;
        })
    }
    if (selection === 1) {
        allTasks.sort(function (a, b) {
            return a.time > b.time ? -1 : a.time < b.time ? 1 : 0;
        })
    }
    if (selection === 2) {
        allTasks.sort(function (a, b) {
            return a.isDone > b.isDone ? -1 : a.isDone < b.isDone ? 1 : 0;
        })
    }
    if (selection === 3) {
        allTasks.sort(function (a, b) {
            return a.isDone < b.isDone ? -1 : a.isDone > b.isDone ? 1 : 0;
        })
    }
    if (selection === 4) {
        allTasks.sort(function (a, b) {
            const text1 = a.text.toUpperCase();
            const text2 = b.text.toUpperCase();
            return text1 < text2 ? -1 : text1 > text2 ? 1 : 0;
        })
    }
    if (selection === 5) {
        allTasks.sort(function (a, b) {
            const text1 = a.text.toUpperCase();
            const text2 = b.text.toUpperCase();
            return text1 > text2 ? -1 : text1 < text2 ? 1 : 0;
        })
    }
}

init();

function init() {
    todoList = document.querySelector("#todoList");
    getSavedList();
    document.querySelector("#sortBox").addEventListener("change", function () {
        sortList();
        updateList();
        saveDataLocally();
    });
    document.querySelector("#editBtn").addEventListener("click", function () {
        toggleEdit();
    });
    document.querySelector("#addBtn").addEventListener("click", function () {
        addEntry();
    });
    document.querySelector("#inputBox").addEventListener("keypress", function (event) {
        if ((event.which || event.keyCode) === 13) {
            addEntry();
        }
    });
}