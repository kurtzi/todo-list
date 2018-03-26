/**
 * Created by idoi on 25/03/2018.
 */

var itemArr = [];


function addEntry() {
    var newEntry = document.getElementsByTagName("input")[0].value
    if(newEntry) {
        var currTime = new Date();
        document.getElementsByTagName("input")[0].value = '';
        itemArr.push([newEntry, currTime])

        updateList();
    }
    else {
        alert('Please enter something, surely you got SOMETHING to do')
    }
}


function updateList() {
    var todoList = document.getElementById("todoList");
    while( todoList.firstChild ){
        todoList.removeChild( todoList.firstChild );
    }
    for (var item in itemArr) {

        var node = document.createElement("LI");
        var textnode = document.createTextNode(itemArr[item][0]);
        node.appendChild(textnode);
        todoList.appendChild(node);
    }
}