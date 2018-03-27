/**
 * Created by idoi on 25/03/2018.
 */

var itemArr = [];

function addEntry() {
    console.log("addEntry is running")
    var newEntry = document.getElementsByTagName("input")[0].value
    if(newEntry) {
        var currTime = new Date();
        document.getElementsByTagName("input")[0].value = '';
        itemArr.push([newEntry, currTime, false])
        updateList();
    }
    else {
        alert('Please enter something, surely you got SOMETHING to do')
    }
}

function getSavedList() {
    console.log("getSavedList is running")
    var savedList = JSON.parse(localStorage.getItem("entriesList"))
    if (savedList) {
        itemArr = savedList;
         updateList()
    }
}

function updateList() {
    console.log("updateList is running")
    var todoList = document.getElementById("todoList");
    while( todoList.firstChild ){
        todoList.removeChild( todoList.firstChild );
    }
    console.log("before for loop")
    for (var thisItem in itemArr) {

        var node = document.createElement("LI");
        var textNode = document.createTextNode(itemArr[thisItem][0]);
        var checkBox = document.createElement('input');

        checkBox.type = 'checkbox';
        checkBox.id = 'isDone' + thisItem;
        checkBox.checked =  itemArr[thisItem][2];
        checkBox.addEventListener("click", function() {
            changeIsDone(this.id)
        });

        node.appendChild(checkBox);
        node.appendChild(textNode);

        todoList.appendChild(node);
    }
    saveListLocally();
}

function changeIsDone(d) {
    console.log("changeIsDone is running")


    var isChecked = document.getElementById(d).checked
    var index = d.substr(6)  //gets the index #
    itemArr[index][2] = isChecked;
    saveListLocally();
    console.log('checkbox changed', d, isChecked, index)
}

function saveListLocally() {
    console.log("before setItem")
    try {localStorage.setItem("entriesList", JSON.stringify(itemArr))
        console.log("after setitem")}
    catch (err){
        console.log(err)
    };
}