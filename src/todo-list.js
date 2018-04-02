let itemObj = [];
let isEditBoxVis = false;

function addEntry() {
    let newEntry = document.querySelector("#inputBox").value;
    if(newEntry) {
        let currTime = new Date();
        document.querySelector("#inputBox").value = '';
        itemObj.push({text: newEntry, time: currTime, isDone: false});
        updateList();
        sortList();
        attachEditRemoveBtns();
    }
    else {
        alert('Please enter something, surely you got SOMETHING to do')
    }
}

function getSavedList() {
    let savedList = JSON.parse(localStorage.getItem("entriesList"));
    let sortNum = localStorage.getItem("sorting");
    if (savedList) {
        itemObj = savedList.map(item => ({text: item.text, time: new Date(item.time), isDone:item.isDone}));
         updateList();
        document.querySelector('#sortBox').value = Number(sortNum);
    }
}

function updateList() {
    let todoList = document.querySelector("#todoList");
    while( todoList.firstChild ){
        todoList.removeChild( todoList.firstChild );
    }
    for (let thisItem in itemObj) {
        let node = document.createElement("div");
        node.id = "contBox" + thisItem;
        let textNode = document.createTextNode(itemObj[thisItem]['text']);
        let checkBox = document.createElement('input');
        let btnNode = document.createElement("div");
        let editIcon = document.createElement('i');
        editIcon.classList.add("fa", "fa-pencil");
        editIcon.id = "editBtn" + thisItem;
        let delIcon = document.createElement('i');
        delIcon.classList.add("fa", "fa-close");
        delIcon.id = "delBtn" + thisItem;
        checkBox.type = 'checkbox';
        checkBox.id = 'isDone' + thisItem;
        checkBox.checked =  itemObj[thisItem].isDone;
        checkBox.addEventListener("click", function() {
            changeIsDone(this.id);
        });

        btnNode.style = 'display: none';
        btnNode.classList.add('editBox');
        btnNode.appendChild(delIcon);
        btnNode.appendChild(editIcon);
        node.appendChild(btnNode);
        node.appendChild(checkBox);
        node.appendChild(textNode);

        todoList.appendChild(node);
    }
    isEditBoxVis = true;
    toggleEdit();
    saveListLocally();
    attachEditRemoveBtns();
}

function toggleEdit() {

    if (isEditBoxVis) {
        document.querySelectorAll('div.editBox').forEach(item => item.style = "display: none");
        document.querySelector('#editBtn').innerText  = 'Edit/Remove';
        isEditBoxVis = false;
    }
    else  {
        document.querySelectorAll('div.editBox').forEach(item => item.style = "display: inline-block");
        document.querySelector('#editBtn').innerText = 'Done'
        isEditBoxVis = true;
    }
}
function changeIsDone(d) {
    let isChecked = document.querySelector(`#${d}`).checked;
    let index = d.substr(6);  //gets the index #
    itemObj[index].isDone = isChecked;
    deSelectDropdown();
    saveListLocally();
}

function deSelectDropdown () {
    document.querySelector('#sortBox').value = -1;
}

function saveListLocally() {
    try {localStorage.setItem("entriesList", JSON.stringify(itemObj))
    localStorage.setItem("sorting", document.querySelector('#sortBox').value)
        }
    catch (err){
        console.log(err);
    }
}

function removeEntry(index) {
    if (confirm("Are you sure?")) {
        var element = document.querySelector(`#contBox${index}`);
        element.parentNode.removeChild(element);
        itemObj.splice(index, 1);
        saveListLocally();
    } else {

    }
}

function editEntry(index) {
    let editedText = prompt("Please edit the entry:", itemObj[index].text);
    if (editedText === null || editedText === itemObj[index].text ) {
        //cancel
    }
    else {
        itemObj[index].text = editedText;
        document.querySelector("#contBox" + index).childNodes[2].data = editedText;
        saveListLocally();
    }


}

function sortList() {
    let selection = Number(document.querySelector('#sortBox').value);
    if (selection === 0) {
        itemObj.sort(function(a, b) {
            return a.time < b.time ? -1 : a.time > b.time ? 1 : 0;
        })
    }
    if (selection === 1) {
        itemObj.sort(function(a, b) {
            return a.time > b.time ? -1 : a.time < b.time ? 1 : 0;
        })
    }
    if (selection === 2 ) {
        itemObj.sort(function(a, b) {
            return a.isDone > b.isDone ? -1 : a.isDone < b.isDone ? 1 : 0;
        })
    }
    if (selection === 3) {
        itemObj.sort(function(a, b) {
            return a.isDone < b.isDone ? -1 : a.isDone > b.isDone ? 1 : 0;
        })
    }
    if (selection === 4) {
        itemObj.sort(function(a, b) {
        let text1 = a.text.toUpperCase();
        let text2 = b.text.toUpperCase();
        return text1 < text2 ? -1 : text1 > text2 ? 1 : 0;
        })
    }
    if (selection === 5) {
        itemObj.sort(function(a, b) {
        let text1 = a.text.toUpperCase();
        let text2 = b.text.toUpperCase();
        return text1 > text2 ? -1 : text1 < text2 ? 1 : 0;
        })
    }
    updateList();
}

window.onload = function() {
    init();
};

function init() {
    getSavedList();
    document.querySelector("#sortBox").addEventListener("change", function(){
        sortList();
    });
    document.querySelector("#editBtn").addEventListener("click", function(){
        toggleEdit();
    });
    document.querySelector("#addBtn").addEventListener("click", function(){
        addEntry();
    });
    document.querySelector("#inputBox").addEventListener("keypress", function(event) {
        if ((event.which || event.keyCode) === 13) {
            addEntry();
        }
    });
}

function attachEditRemoveBtns() {
    document.querySelectorAll('i.fa-pencil').forEach(item => {
        if (!item.classList.contains('tagged')) {
            item.addEventListener("click", function(){
                let curIndex = this.id.substr(7);
                editEntry(curIndex)
            });
            item.classList.add("tagged")
        }
    });

    document.querySelectorAll('i.fa-close').forEach(item => {
        if (!item.classList.contains('tagged')) {
            item.addEventListener("click", function () {
                let curIndex = this.id.substr(6);
                removeEntry(curIndex);
            });
            item.classList.add("tagged")
        }
    })
}